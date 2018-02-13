<template>
  <div id="wrapper">

    <md-dialog-confirm
      :md-active.sync="confirmDialog"
      :md-title="blockDialogTitle"
      :md-content="blockDialogText"
      md-confirm-text="Yes"
      md-cancel-text="No"
      @md-cancel="confirmDialog = false"
      @md-confirm="confirmBlock" />

    <center v-if="loading">
      <br/>
      <md-progress-spinner md-mode="indeterminate" class="md-primary"/>
    </center>

    <md-table v-else v-model="searched" md-sort="joinDate" md-sort-order="desc">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Users</h1>
        </div>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search User..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>
      <md-table-empty-state
        md-label="No data found"
        :md-description="`No user found for '${this.search}' query. Try a different search term.`">
      </md-table-empty-state>
      <md-table-row slot="md-table-row" slot-scope="{ item }" @click="testPrint">
        <md-table-cell md-label="Join Date" md-sort-by="joinDate">
          {{item.joinDate}}
        </md-table-cell>
        <md-table-cell md-label="Name" md-sort-by="name">
          <b>{{item.name}}</b>
        </md-table-cell>
        <md-table-cell md-label="Phone Number">
          {{item.phoneNumber}}
        </md-table-cell>
        <md-table-cell md-label="Report Count" md-sort-by="reportCount" md-numeric>
          {{item.reportCount}}
        </md-table-cell>
        <md-table-cell md-label="Status" md-sort-by="status">
          {{item.status}}
        </md-table-cell>
        <md-table-cell md-label="Action">
          <md-button v-if="item.status==='active'"
            class="md-icon-button btn-green"
            @click="blockUserPressed(true, item.id)">
            <md-icon>lock_open</md-icon>
            <md-tooltip md-direction="top">Block This User</md-tooltip>
          </md-button>
          <md-button v-else
            class="md-icon-button btn-red"
            @click="blockUserPressed(false, item.id)">
            <md-icon>lock_outline</md-icon>
            <md-tooltip md-direction="top">Unblock This User</md-tooltip>
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
    },
    searchOnTable: function () {
      let skey = this.search.toLowerCase()
      this.searched = this.usersList
        .filter(obj => Object.keys(obj).some(key => {
          if (typeof obj[key] !== 'string' && key !== 'name' &&
            key !== 'phoneNumber') return false
          else return obj[key].toLowerCase().includes(skey)
        }))
    },
    blockUserPressed: function (isBlock, uid) {
      this.blockDialogTitle = isBlock ? 'Block User' : 'Unblock User'
      this.blockDialogText = isBlock ? 'Do you really want to block this user?'
        : 'Do you really want to unblock this user?'
      this.blockUid = uid
      this.blockMode = isBlock
      this.confirmDialog = true
    },
    confirmBlock: function () {
      let status = this.blockMode ? 0 : 1
      usersRef.child(this.blockUid).child('status').set(status).then(snap => {
        console.log('' + this.blockUid + (this.blockMode ? ' blocked' : ' unblocked'))
      }).catch(err => {
        console.error(err)
      })
      this.confirmDialog = false
    }
  },
  data () {
    return {
      loading: true,
      confirmDialog: false,
      blockMode: true,
      blockDialogTitle: 'Block User',
      blockDialogText: 'Do you really want to block this user?',
      blockUid: '',
      search: '',
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
        tmpObj.id = key
        tmpObj.name = snapItem.name
        tmpObj.phoneNumber = snapItem.phoneNumber
        tmpObj.joinDate = this.getDate(snapItem.joinDate.timestamp)
        tmpObj.reportCount = snapItem.reportCount.toString()
        tmpObj.status = snapItem.status === 1 ? 'active' : 'blocked'
        this.usersList.push(tmpObj)
      }
      this.searched = this.usersList
      this.loading = false
    })
  },
  beforeDestroy: function () {
    usersRef.off()
  }

}
</script>

<style lang="scss" scoped>
.md-content.md-table-content.md-scrollbar.md-theme-default {
  height: calc(100vh - 200px) !important;
}
.btn-green .md-icon.md-theme-default.md-icon-font{
  color: green;
}
.btn-red .md-icon.md-theme-default.md-icon-font{
  color: #FF4747;
}
</style>
