const fs = require('fs');
const people = require('./people.json').people;

const staticContent = `
# Awesome Developers

A list of awesome developers to follow.

The list is located in \`people.json\` and is sorted by GitHub followers count.

A lot of stuff is currently missing and contribution is welcome.

| Name | GitHub | Twitter | Medium | Blog |
| --- | --- | --- | --- | --- |
`;

readme = fs.createWriteStream('README.md');
readme.write(staticContent);

let line;
for (const person of people) {
  let { name, github, twitter, medium, blog } = person;
  name = name || github;
  const githubURL = `https://github.com/${github}`;
  line = `| ${name} | [GitHub](${githubURL})`;

  line += ` | `;
  line += twitter ? `[Twitter](https://twitter.com/${twitter})` : '   ';
  line += ` | `;
  line += medium ? `[Medium](https://medium.com/@${medium})`: '   ';
  line += ` | `;
  line += blog ? `[Blog](${blog})` : '   ';
  line += '|\n';
  readme.write(line);
}

readme.end();
