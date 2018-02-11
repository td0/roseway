<template>
  <div id="wrapper">

    <md-dialog :md-active.sync="showDialog" class="image-preview">
      <img v-bind:src="imagePreviewUrl" >
    </md-dialog>

    <center v-if="loading">
      <br/>
      <md-progress-spinner md-mode="indeterminate" class="md-primary"/>
    </center>

    <md-table v-else v-model="searched" md-sort="streetName" md-sort-order="asc" md-fixed-header>
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
          <img :src="item.imageUrl" height="40" width="40" @click="imagePreview(item.imageUrl)"/>
        </md-table-cell>
        <md-table-cell md-label="Street" md-sort-by="streetName">
          <md-icon class="location">location_on</md-icon>
          <u>{{item.streetName}}</u>
        </md-table-cell>
        <md-table-cell md-label="Issuer">
          <ul>
            <li v-for="(issuer, idx) in item.issuers" :key="idx">
              <span v-if="Object.keys(item.issuers).length>1">-</span>
              <b>{{issuer}}</b>
            </li>
          </ul>
        </md-table-cell>
        <md-table-cell md-label="Action">
          <md-button class="md-icon-button btn-green">
            <md-icon>done</md-icon>
            <md-tooltip md-direction="top">Change Status to Fixed</md-tooltip>
          </md-button>
          <md-button class="md-icon-button btn-orange">
            <md-icon>clear</md-icon>
            <md-tooltip md-direction="top">Remove This Issue</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>

  </div>
</template>

<script>
import {fixedIssueRef, reportsRef, userList} from '../fbHelper'

export default {
  name: 'FixedRoad',
  methods: {
    testPrint: function () {
      console.log(this.fixedReports)
    },
    imagePreview: function (imgUrl) {
      this.imagePreviewUrl = imgUrl
      this.showDialog = true
    },
    searchOnTable: function () {
      let skey = this.search.toLowerCase()
      this.searched = this.fixedReports
        .filter(obj => Object.keys(obj).some(key => {
          if (key !== 'reporterName' && key !== 'streetName') return false
          else return obj[key].toLowerCase().includes(skey)
        }))
    }
  },
  data () {
    return {
      showDialog: false,
      loading: true,
      imagePreviewUrl: 'https://www.wonderplugin.com/videos/demo-image0.jpg',
      search: '',
      searched: [],
      fixedReports: []
    }
  },
  mounted: function () {
    fixedIssueRef.on('value', snap1 => {
      this.fixedReports = []
      for (let key in snap1.val()) {
        reportsRef.child(key).once('value').then(snap2 => {
          let tmpObj = snap2.val()
          delete tmpObj.date
          delete tmpObj.fixed
          delete tmpObj.description
          tmpObj.issuers = {}
          for (let userKey in snap1.val()[key]) {
            tmpObj.issuers[userKey] = userList[userKey].name
          }
          this.fixedReports.push(tmpObj)
        })
      }
      this.searched = this.fixedReports
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
  height: calc(100vh - 220px) !important;
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
</style>
