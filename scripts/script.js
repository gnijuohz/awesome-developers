const awesomeDev = new Vue({
  el: '#app',
  data: {
    loading: true,
    people: [],
    searchText: '',
  },
  computed: {
    filteredPeople: function() {
      if (!this.searchText) {
        return this.people;
      }
      let searchText = this.searchText.toLowerCase();
      return this.people.filter((person) => {
        return (
          person.name.toLowerCase().indexOf(searchText) !== -1 ||
          person.tech.some((keyword) => {
            return keyword.toLowerCase().indexOf(searchText) !== -1;
          })
        );
      });
    },
  },
  mounted: function() {
    fetch(
      'https://raw.githubusercontent.com/gnijuohz/awesome-developers/master/people.json'
    )
      .then((response) => response.json())
      .then(
        (value) => {
          this.loading = false;
          this.people = value.people;
        },
        function(err) {
          console.log(err);
        }
      );
  },
});

Vue.component('awesome-person', {
  props: ['person'],
  computed: {
    hasBio: function() {
      return !!this.person.bio;
    },
    hasBlog: function() {
      return !!this.person.blog;
    },
    hasTwitter: function() {
      return !!this.person.twitter;
    },
    hasMedium: function() {
      return !!this.person.medium;
    },
    githubUrl: function() {
      return `https://github.com/${this.person.github}`;
    },
    twitterUrl: function() {
      return `https://twitter.com/${this.person.twitter}`;
    },
    mediumUrl: function() {
      return `https://medium.com/@${this.person.medium}`;
    },
    tech: function() {
      return this.person.tech;
    },
  },
  template: '#person',
});
