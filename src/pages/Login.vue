<template>
  <div id="wrapper" ref="wrapper">
    <div id="login">
      <card>
        <card-body>
          <center>
            <h3>Authentication</h3>
          </center>
          <section class='login-form'>
            <div style="margin-top:3.5rem;max-width:20rem">
              <mdinput :value="email"
                @input.native="email = $event.target.value"
                @keyup.enter.native="authenticate"
                size="md" type="text" label="Email"/>
            </div>
            <div style="margin-top:2rem;max-width:20rem">
              <mdinput :value="passwd"
                @input.native="passwd = $event.target.value"
                @keyup.enter.native="authenticate"
                size="md" type="password" label="Password"/>
            </div>
            <btn @click.native="authenticate"
              type="submit" color="primary" size="md"
              class='login-button'>Log In</btn>
          </section>
        </card-body>
      </card>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import MdInput from '@/components/MdInput.vue'
import card from '@/components/Card'
import cardBody from '@/components/CardBody'
import Btn from '@/components/Button.vue'

export default {
  name: 'login',
  components: {
    'Card': card,
    'CardBody': cardBody,
    'mdinput': MdInput,
    'btn': Btn
  },
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
          this.$router.replace('/main')
        },
        err => {
          alert('error: ' + err)
        }
      )
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
    width:20em;
    height:20em;
    margin-left: -10em; /*set to a negative number 1/2 of your width*/
    margin-top: -15em; /*set to a negative number 1/2 of your height*/
  }
  .login-button {
    margin-top: 3em;
    float: right;
  }
</style>
