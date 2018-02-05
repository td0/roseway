<template>
  <div id="wrapper">
    <div id="login">

      <md-card id="card">
        <md-card-header>
          <center>
          <div class="md-title">
            Roseway
          </div>
          <div class="md-subhead">
            Authentication
          </div>
          </center>
        </md-card-header>
        <md-card-content>
          <md-field>
            <label>Email</label>
            <md-input v-model="email" />
          </md-field>
          <md-field>
            <label>Password</label>
            <md-input v-model="passwd" type="password" />
          </md-field>
          <md-button v-on:click="authenticate" class="md-raised md-accent login-button">Login</md-button>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'login',
  components: {},
  data: function () {
    return {
      email: '',
      passwd: ''
    }
  },
  methods: {
    authenticate: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.passwd).then(
        user => {
          this.$router.replace('/reports')
        },
        err => {
          alert('error: ' + err)
        }
      )
    }
  },
  created () {
    if (firebase.auth().currentUser) {
      this.$router.replace('/reports')
    }
  }
}
</script>

<style scoped>
  #wrapper {
    background-image: url('../assets/img/login_backdrop8.jpeg');
    background-size:     cover;
    background-repeat:   no-repeat;
    background-position: center center;
    margin: 0;
    width: 100%;
    height: 100vh;
  }
  #login {
    position:fixed;
    top: 50%;
    left: 50%;
    width:22em;
    height:20em;
    margin-left: -11em;
    margin-top: -15em;
  }
  .login-button {
    margin-top: 1em;
    margin-bottom: 2em;
    float: right;
  }
</style>
