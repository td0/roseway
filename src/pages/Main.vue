<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">Markgo Admin</span>
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
          <md-list-item to="/reports">
            <md-icon class="nav-reports">view_list</md-icon>
            <span class="md-list-item-text">Reports</span>
          </md-list-item>
          <md-list-item to="/maps">
            <md-icon class="nav-maps">map</md-icon>
            <span class="md-list-item-text">Maps</span>
          </md-list-item>
          <md-list-item to="/fixed-issues">
            <md-icon class="nav-fixed">build</md-icon>
            <span class="md-list-item-text">Fixed Road Issues</span>
          </md-list-item>
          <md-list-item to="/abuse-issues">
            <md-icon class="nav-abuse">report</md-icon>
            <span class="md-list-item-text">Abusive Post Issues</span>
          </md-list-item>
          <md-list-item to="/users">
            <md-icon class="nav-users">people</md-icon>
            <span class="md-list-item-text">User Manager</span>
          </md-list-item>
        </md-list>

      </md-app-drawer>

      <md-app-content >
        <router-view />
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Main',
  data () {
    return {
      menuVisible: false
    }
  },
  methods: {
    toggleMenu: function () {
      this.menuVisible = !this.menuVisible
    },
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
    testFunc () {
      alert('test')
    }
  },
  mounted () {
    this.menuVisible = true
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .md-app {
    min-height: 100vh;
    max-height: 400px;
  }
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
  a.router-link-active {
    background-color: rgba(0,0,0,.1);
    i.md-icon.md-theme-default.md-icon-font.nav-reports{
      color: #2777FF;
    }
    i.md-icon.md-theme-default.md-icon-font.nav-maps{
      color: #7A54DE
    }
    i.md-icon.md-theme-default.md-icon-font.nav-users{
      color: #EAA910;
    }
    i.md-icon.md-theme-default.md-icon-font.nav-fixed{
      color: #27BA77;
    }
    i.md-icon.md-theme-default.md-icon-font.nav-abuse{
      color: #FF6237;
    }
  }
</style>
