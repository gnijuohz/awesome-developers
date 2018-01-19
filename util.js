const fs = require('fs');
const people = require('./people.json').people;

const staticContent = `
# Awesome Developers

*WIP*: A list of most *popular* (by follower count) developers on Github
with their social media accounts info listed so you can follow (stalk) them ;)

Contribution welcome. Data is located in \`people.json\`. A lot of stuff is
currently missing.

## List

`;

readme = fs.createWriteStream('README.md');
readme.write(staticContent);
let line;
for (const person of people) {
  let { name, github, twitter, medium, blog } = person;
  name = name || github;
  const githubURL = `https://github.com/${github}`;
  line = `- ${name}: [Github](${githubURL})`;
  if (twitter) line += `, [Twitter](https://twitter.com/${twitter})`;
  if (medium) line += `, [Medium](https://medium.com/@${medium})`;
  if (blog) line += `, [Blog](${blog})`;
  line += '\n';
  readme.write(line);
}

readme.end();
