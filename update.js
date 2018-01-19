const github = require('octonode');
const fs = require('fs');

const client = github.client();
const ghsearch = client.search();

const people = require('./people.json').people;

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

/**
 * update people.json
 */
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
      fs.writeFileSync(
        'people.json',
        JSON.stringify({ people: users }, null, 2),
        'utf-8',
        (err) => {
          if (err) throw err;
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

updatePeople();
