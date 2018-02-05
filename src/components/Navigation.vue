<template>
  <md-app>
    <md-app-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title">Roseway</span>
      <div class="md-toolbar-section-end">
        <md-button @click="logout">Logout</md-button>
      </div>
    </md-app-toolbar>

    <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span>Navigation</span>

        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button md-dense" @click="toggleMenu">
            <md-icon>keyboard_arrow_left</md-icon>
          </md-button>
        </div>
      </md-toolbar>

      <md-list>
        <md-list-item to="/">
          <md-icon>move_to_inbox</md-icon>
          <span class="md-list-item-text">Report</span>
        </md-list-item>

        <md-list-item to="/issues/fixed">
          <md-icon>send</md-icon>
          <span class="md-list-item-text">Road Fixed Issue</span>
        </md-list-item>

        <md-list-item to="/issues/abuse">
          <md-icon>delete</md-icon>
          <span class="md-list-item-text">Post Abuse Issue</span>
        </md-list-item>

        <md-list-item to="/users">
          <md-icon>error</md-icon>
          <span class="md-list-item-text">User Manager</span>
        </md-list-item>
      </md-list>
    </md-app-drawer>

    <md-app-content>
      <slot></slot>
    </md-app-content>
  </md-app>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'Navigation',
  data () {
    return {
      menuVisible: true
    }
  },
  methods: {
    logout: function () {
      firebase.auth().signOut().then(
        () => {
          console.log('logging out')
          this.$router.replace('/login')
        },
        err => {
          alert('error : ' + err)
        }
      )
    },
    toggleMenu: function () {
      this.menuVisible = !this.menuVisible
    },
    testFunc: function () {
      alert('test')
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-app {
    min-height: 100vh;
    // border: 1px solid rgba(#000, .12);
  }

  .router-link-active {
    background-color: #E0E0E0E0;
    .md-list-item-text {
      color: rgb(256,165,0);
    }
  }

  // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>
