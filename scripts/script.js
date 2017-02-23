const awesomeDev = new Vue({
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
    fetch('https://raw.githubusercontent.com/gnijuohz/awesome-developers/master/people.json').then(response => response.json()).then(value => {
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
      return !!this.person.twitter
    },
    hasWeibo: function() {
      return !!this.person.weibo
    },
    hasZhihu: function() {
      return !!this.person.zhihu
    },
    hasMedium: function() {
      return !!this.person.medium
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
    zhihuUrl: function() {
      if (this.person.zhihu.indexOf('http') === 0) return this.person.zhihu
      return `https://zhihu.com/people/${this.person.zhihu}`
    },
    mediumUrl: function() {
      return `https://medium.com/@${this.person.medium}`
    },
    keywords: function() {
      return this.person.keywords
    }
  },
  template: '#person'
})
