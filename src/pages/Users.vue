<template>
  <div id="wrapper">
    <button @click="testPrint" >Test </button>
    <br> <br>

    <center v-if="loading">
      <br/>
      <md-progress-spinner md-mode="indeterminate" class="md-primary"/>
    </center>

    <md-table v-else v-model="usersList" md-sort="joinDate" md-sort-order="desc" md-fixed-header>
      <md-table-toolbar>
        <h1 class="md-title">Users</h1>
      </md-table-toolbar>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Join Date" md-sort-by="joinDate">{{item.joinDate}}</md-table-cell>
        <md-table-cell md-label="Name" md-sort-by="name"><b>{{item.name}}</b></md-table-cell>
        <md-table-cell md-label="Phone Number">{{item.phoneNumber}}</md-table-cell>
        <md-table-cell md-label="Report Count" md-sort-by="reportCount" md-numeric>{{item.reportCount}}</md-table-cell>
        <md-table-cell md-label="Status">{{(item.status)}}</md-table-cell>
        <md-table-cell md-label="Action">
          <md-button v-if="item.status!=='active'" class="md-icon-button btn-green">
            <md-icon>check_circle</md-icon>
            <md-tooltip md-direction="top">Unblock This User</md-tooltip>
          </md-button>
          <md-button v-else class="md-icon-button btn-red">
            <md-icon>block</md-icon>
            <md-tooltip md-direction="top">Block This User</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import {usersRef} from '../fbHelper'
import moment from 'moment'

export default {
  name: 'Users',
  methods: {
    testPrint: function () {
      console.log(this.usersList)
    },
    getDate: function (epoch) {
      return moment(epoch).format('YYYY-MM-DD')
    }
  },
  data () {
    return {
      loading: true,
      search: null,
      searched: [],
      usersList: []
    }
  },
  mounted: function () {
    usersRef.on('value', snap => {
      this.usersList = []
      for (let key in snap.val()) {
        let tmpObj = {}
        let snapItem = snap.val()[key]
        tmpObj.name = snapItem.name
        tmpObj.phoneNumber = snapItem.phoneNumber
        tmpObj.joinDate = this.getDate(snapItem.joinDate.timestamp)
        tmpObj.reportCount = snapItem.reportCount.toString()
        tmpObj.status = snapItem.status === 1 ? 'active' : 'blocked'
        this.usersList.push(tmpObj)
      }
      this.loading = false
    })
  },
  beforeDestroy: function () {
    usersRef.off()
  }

}
</script>

<style lang="scss" scoped>
.btn-green .md-icon.md-theme-default.md-icon-font{
  color: green;
}
.btn-red .md-icon.md-theme-default.md-icon-font{
  color: #FF4747;
}
</style>
