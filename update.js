const fs = require('fs');
const github = require('octonode');
const Twit = require('twit');

const people = require('./people.json').people;
const twitterCredentials = require('./twitter-keys');

const client = github.client();
const ghsearch = client.search();

const T = new Twit(twitterCredentials);

const peopleLookup = {};
for (let person of people) {
  peopleLookup[person.github] = person;
}

/**
 * get user info via Github API
 * @param {Object} options
 * @return {Promise} a promise
 */
function searchUser(options) {
  return new Promise((resolve, reject) => {
    ghsearch.users(options, function(err, result, header) {
      if (err) reject(Error('error in getting users'));
      resolve(result.items);
    });
  });
}

// update the list via github api
function updatePeople() {
  const a = [...Array(10).keys()];
  Promise.all(
    a.map((value, index) => {
      return searchUser({
        q: '+type:user+followers:>100',
        sort: 'followers',
        order: 'desc',
        per_page: 100,
        page: index + 1,
      });
    })
  )
    .then((results) => {
      const users = [].concat(...results).map((person) => {
        const ghHandle = person.login;
        const found = peopleLookup[ghHandle] || {};
        return {
          github: ghHandle,
          name: found.name || '',
          company: found.company || '',
          bio: found.bio || '',
          twitter: found.twitter || '',
          medium: found.medium || '',
          blog: found.blog || '',
          tech: found.keywords || [],
        };
      });
      writeToJSON(users);
    })
    .catch((err) => {
      console.log(err);
    });
}

// really simple heuristic that might be wrong... but a lot
// of people are using the same handle for github and twitter
// another one that's not used here is firstname_lastname
function isPotentialMatch(twitterInfo, person) {
  let url;
  let entities = twitterInfo.entities;
  if (entities && entities.url) {
    url = entities.url.urls[0].expanded_url;
    if (url && url.includes(`github.com/${person.github}`)) {
      return true;
    }
    if (url === person.blog) return true;
  }
  // if they don't have that many followers, either this is not
  // the right one or they are not active, either way can be ignored
  if (twitterInfo.followers_count > 500) {
    return true;
  }
  return false;
}


async function updateTwitter() {
  for (let person of people) {
    if (!person.twitter) {
      const info = await T.get('users/show', {
        screen_name: person.github,
      });
      data = info.data;
      if (isPotentialMatch(data, person)) {
        person.twitter = person.github;
      }
    }
  }
  return people;
}

function writeToJSON(people) {
  fs.writeFileSync(
    'people.json',
    JSON.stringify({ people: people }, null, 2),
    'utf-8',
    (err) => {
      if (err) throw err;
    }
  );
}

// updateGithub();
updateTwitter().then((people) => {
  writeToJSON(people);
});
