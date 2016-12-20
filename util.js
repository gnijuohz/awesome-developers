const fs = require('fs')
const people = require('./people.json').people

readme = fs.createWriteStream('README.md', {
  flags: 'a'
})
readme.write('\n')
for (const person of people) {
  let line = `- ${person.name}: [github](${person.githubURL})`
  if (person.blog) line+= `, [blog](${person.blog})`
  if (person.twitter) line += `, [twitter](https://twitter.com/${person.twitter})`
  if (person.weibo) line += `, [weibo](https://weibo.com/${person.weibo})`
  if (person.medium) line += `, [medium](https://medium.com/@${person.medium})`
  line += '\n'
  readme.write(line)
}

readme.end()
