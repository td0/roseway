<template>
  <div id="wrapper">

    <md-dialog-confirm
      :md-active.sync="cDialog.show"
      :md-title="cDialog.title"
      :md-content="cDialog.text"
      md-confirm-text="Yes"
      md-cancel-text="No"
      @md-cancel="cDialog.show = false"
      @md-confirm="dialogConfirmed" />

    <md-dialog :md-active.sync="showDialog" class="image-preview">
      <img v-bind:src="imagePreviewUrl" >
    </md-dialog>

    <center v-if="loading">
      <br/>
      <md-progress-spinner md-mode="indeterminate" class="md-primary"/>
    </center>

    <md-table v-else v-model="searched" md-sort="streetName" md-sort-order="asc">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Fixed Road Issues</h1>
        </div>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>
      <md-table-empty-state
        md-label="No data found"
        :md-description="`No data found for '${this.search}' query. Try a different search term.`">
      </md-table-empty-state>
      <md-table-row slot="md-table-row" slot-scope="{item}">
        <md-table-cell md-label="Reporter" md-sort-by="reporterName">
          <b>{{item.reporterName}}</b>
        </md-table-cell>
        <md-table-cell md-label="Photo">
          <div class="img-thumb">
            <div class="crop">
              <img :src="item.imageUrl"
              @click="imagePreview(item.imageUrl)"/>
            </div>
          </div>
        </md-table-cell>
        <md-table-cell md-label="Street" md-sort-by="streetName">
          <md-icon class="location">location_on</md-icon>
          <router-link :to="'/maps/i/'+item.id"><u>{{item.streetName}}</u></router-link>
        </md-table-cell>
        <md-table-cell md-label="Issuer">
          <ul>
            <li v-for="(issuer, idx) in item.issuers" :key="idx">
              <span v-if="Object.keys(item.issuers).length>1">-</span>
              <b>{{issuer}}</b>
            </li>
          </ul>
        </md-table-cell>
        <md-table-cell>
          <md-button class="md-icon-button btn-green" @click="actionBtn(true, item.idx)">
            <md-icon>done</md-icon>
            <md-tooltip md-direction="top">Confirm Fixed Road</md-tooltip>
          </md-button>
          <md-button class="md-icon-button btn-orange" @click="actionBtn(false, item.idx)">
            <md-icon>remove_circle_outline</md-icon>
            <md-tooltip md-direction="top">Remove This Issue</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>

    <md-snackbar md-position="center" :md-duration="2000" :md-active.sync="showSnackbar" md-persistent>
      <span>{{snackBarText}}</span>
      <md-button class="md-accent" @click="showSnackbar = false">close</md-button>
    </md-snackbar>
  </div>
</template>

<script>
import {fixedIssueRef, userFixIssueRef,
  reportsRef, userList} from '../fbHelper'

export default {
  name: 'FixedRoad',
  methods: {
    testPrint: function () {
      console.log(this.fixedIssues)
    },
    imagePreview: function (imgUrl) {
      this.imagePreviewUrl = imgUrl
      this.showDialog = true
    },
    searchOnTable: function () {
      let skey = this.search.toLowerCase()
      this.searched = this.fixedIssues
        .filter(obj => Object.keys(obj).some(key => {
          if (key !== 'reporterName' && key !== 'streetName') return false
          else return obj[key].toLowerCase().includes(skey)
        }))
    },
    actionBtn: function (fixMode, idx) {
      if (fixMode) {
        this.cDialog.title = 'Confirm Fixed Road'
        this.cDialog.text = 'Change the status to fixed?'
        this.cDialog.fixMode = true
      } else {
        this.cDialog.title = 'Clear Issue'
        this.cDialog.text = 'Clear the issued fixed road?'
        this.cDialog.fixMode = false
      }
      this.cDialog.idx = idx
      this.cDialog.show = true
    },
    dialogConfirmed: function () {
      const issued = this.fixedIssues[this.cDialog.idx]
      if (this.cDialog.fixMode) {
        this.confirmFix(issued)
      } else {
        this.clearIssue(issued)
      }
    },
    confirmFix: function (issued) {
      reportsRef.child(issued.id).child('fixed').set(true).then(snap => {
        this.snackBarText = 'Report status : Fixed'
        this.showSnackbar = true
      })
      this.cDialog.show = false
    },
    clearIssue: function (issued) {
      let issuers = Object.keys(issued.issuers)
      issuers.forEach(id => {
        userFixIssueRef.child(id).child(issued.id).remove()
      })
      this.cDialog.show = false
      fixedIssueRef.child(issued.id).remove().then(snap => {
        this.snackBarText = 'Issue removed'
        this.showSnackbar = true
      })
      this.cDialog.show = false
    }
  },
  data () {
    let cDialog = {
      show: false,
      title: '',
      text: '',
      fixMode: true,
      idx: ''
    }
    return {
      cDialog,
      showDialog: false,
      showSnackbar: false,
      snackBarText: '',
      loading: true,
      imagePreviewUrl: 'https://www.wonderplugin.com/videos/demo-image0.jpg',
      search: '',
      searched: [],
      fixedIssues: []
    }
  },
  mounted: function () {
    fixedIssueRef.on('value', snap1 => {
      this.fixedIssues = []
      let idx = 0
      for (let key in snap1.val()) {
        reportsRef.child(key).once('value').then(snap2 => {
          let tmpObj = snap2.val()
          delete tmpObj.fixed
          delete tmpObj.description
          tmpObj.id = key
          tmpObj.idx = idx++
          tmpObj.issuers = {}
          for (let userKey in snap1.val()[key]) {
            tmpObj.issuers[userKey] = userList[userKey].name
          }
          this.fixedIssues.push(tmpObj)
        })
      }
      this.searched = this.fixedIssues
      this.loading = false
    })
  },
  beforeDestroy: function () {
    fixedIssueRef.off()
    reportsRef.off()
  }
}
</script>

<style lang="scss" scoped>
.md-field {
  max-width: 300px;
}
.md-content.md-table-content.md-scrollbar.md-theme-default {
  height: calc(100vh - 200px) !important;
}
ul {
  list-style-type: none;
  padding:0;
}
.image-preview {
  max-width: 400px;
  img {
    width: 100%;
    height: auto;
  }
}
.btn-green .md-icon.md-theme-default.md-icon-font{
  color: #27BA77;
}
.btn-orange .md-icon.md-theme-default.md-icon-font{
  color: orange;
}
.location.md-icon {
  color: #FF4747 !important;
  font-size: 18px !important;
}
td.md-table-cell {
  .location.md-icon {
    color: #FF4747 !important;
    font-size: 15px !important;
    margin-right: -7px;
  }
  .img-thumb{
    background: #fff;
    display: inline-block;
    vertical-align: top;
    width: 45px;
    height: 45px;
    .crop{
      height: 100%;
      overflow: hidden;
      position: relative;
      img {
        display: block;
        min-width: 100%;
        min-height: 100%;
        margin: auto;
        position: absolute;
        top: -100%;
        right: -100%;
        bottom: -100%;
        left: -100%;
      }
    }
  }
}
</style>
