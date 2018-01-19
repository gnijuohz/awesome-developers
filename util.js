const fs = require('fs');
const people = require('./people.json').people;

const staticContent = `
# Awesome Developers

*WIP*: A list of most *popular* (by follower count) developers on Github
with their social media accounts info listed so you can follow (stalk) them ;)

Contribution welcome. Data is located in \`people.json\`.

## List

`;

readme = fs.createWriteStream('README.md');
readme.write(staticContent);
let line;
for (const person of people) {
  let { name, github, githubURL, twitter, weibo, zhihu, medium, blog } = person;
  name = name || github;
  line = `- ${name}: [Github](${githubURL})`;
  if (twitter) line += `, [Twitter](https://twitter.com/${twitter})`;
  if (weibo) line += `, [Weibo](https://weibo.com/${weibo})`;
  if (medium) line += `, [Medium](https://medium.com/@${medium})`;
  if (zhihu) {
    zhihuURL = zhihu.indexOf('http') === 0 ? zhihu : `https://zhihu.com/people/${zhihu}`;
    line += `[Zhihu](${zhihuURL})`;
  }
  if (blog) line += `, [Blog](${blog})`;
  line += '\n';
  readme.write(line);
}

readme.end();
