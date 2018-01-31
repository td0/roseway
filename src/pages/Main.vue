<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <a @click="logout()">logout</a>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    logout: function () {
      console.log('logging out')
      firebase.auth().signOut().then(
        () => {
          this.$router.replace('/')
        },
        err => {
          alert('error : ' + err)
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
