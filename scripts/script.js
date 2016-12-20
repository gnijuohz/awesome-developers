const app = new Vue({
  el: '#app',
  data: {
    people: [],
    searchText: ''
  },
  computed: {
    filteredPeople: function() {
      if (!this.searchText) {
        return this.people
      }
      let searchText = this.searchText.toLowerCase()
      return this.people.filter(person => {
        return person.name.toLowerCase().indexOf(searchText) !== -1 || person.keywords.some(keyword => {
          return keyword.toLowerCase().indexOf(searchText) !== -1
        })
      })
    }
  },
  mounted: function() {
    fetch('https://gist.githubusercontent.com/gnijuohz/32d57fe22afd5dc6c3118d3fb0d56fe0/raw/b7ff74618b3e03e0a88375b1ec2b6a0d2e3e3958/test.json').then(response => response.json()).then(value => {
      this.people = value.people
    }, function(err) {
      console.log(err)
    })
  }
})

Vue.component('awesome-person', {
  props: ['person'],
  computed: {
    hasBio: function() {
      return !!this.person.bio
    },
    hasBlog: function() {
      return !!this.person.blog
    },
    hasTwitter: function() {
      return !!this.person.twitter.length
    },
    hasWeibo: function() {
      return !!this.person.weibo.length
    },
    githubUrl: function() {
      return `https://github.com/${this.person.github}`
    },
    weiboUrl: function() {
      return `https://weibo.com/${this.person.weibo}`
    },
    twitterUrl: function() {
      return `https://twitter.com/${this.person.twitter}`
    },
    keywords: function() {
      return this.person.keywords
    }
  },
  template: '#person'
})
