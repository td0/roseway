<template>
  <center>
    <div id="login">
      <card>
        <card-body>
          <h3>Log In</h3>

          <!-- <input type="text" placeholder="email"> -->
          <!-- <input type="password" placeholder="password"> -->
        </card-body>
      </card>
      <section>
        <div style="margin-top:3rem;max-width:20rem">
          <mdinput type="text" label="Basic example" />
        </div>
      </section>
    </div>
  </center>
</template>

<script>
import MdInput from '@/components/MdInput'
import card from '@/components/Card'
import cardBody from '@/components/CardBody'

export default {
  name: 'login',
  methods: {
    focus (element) {
      element.classList.add('active')
    },
    blur (element) {
      element.classList.remove('active')
    }
  },
  created: () => {
    this.on('focus', function (callback) {
      this.callback = callback
      this.focus(this.callback)
    })

    this.on('blur', function (callback) {
      console.log('blur me')
      this.callback = callback
      this.blur(this.callback)
    })
  },
  components: {
    'Card': card,
    'CardBody': cardBody,
    'mdinput': MdInput
  }
}
</script>

<style scoped>
  #login {
    margin: 80px;
    width: 360px;
  }
</style>
