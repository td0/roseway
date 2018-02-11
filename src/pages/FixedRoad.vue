<template>
  <div id="wrapper">
    <!-- <button @click="testPrint" >Test </button>
    <br> <br> -->

    <md-dialog :md-active.sync="showDialog" class="image-preview">
      <img v-bind:src="imagePreviewUrl" >
    </md-dialog>

    <center v-if="loading">
      <br/>
      <md-progress-spinner md-mode="indeterminate" class="md-primary"/>
    </center>

    <md-table v-else v-model="fixedReports" md-sort="streetName" md-sort-order="asc">
      <md-table-toolbar>
        <h1 class="md-title">Fixed Road Issues</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Photo">
          <img :src="item.imageUrl" height="40" width="40" @click="imagePreview(item.imageUrl)"/>
        </md-table-cell>
        <md-table-cell md-label="Street" md-sort-by="streetName">{{item.streetName}}</md-table-cell>
        <md-table-cell md-label="Reporter" md-sort-by="reporterName"><b>{{item.reporterName}}</b></md-table-cell>
        <md-table-cell md-label="Issuer">
          <ul>
            <li v-for="(issuer, idx) in item.issuers" :key="idx">> <b>{{issuer}}</b></li>
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
// import {userList} from '../fbHelper'

export default {
  name: 'FixedRoad',
  data () {
    return {
      showDialog: false,
      loading: true,
      imagePreviewUrl: 'https://www.wonderplugin.com/videos/demo-image0.jpg',
      fixedReports: []
    }
  },
  methods: {
    testPrint: function () {
      console.log(this.fixedReports)
    },
    imagePreview: function (imgUrl) {
      this.imagePreviewUrl = imgUrl
      this.showDialog = true
    }
  },
  mounted: function () {
    fixedIssueRef.on('value', snap1 => {
      this.fixedReports = []
      for (let key in snap1.val()) {
        reportsRef.child(key).once('value').then(snap2 => {
          let tmpObj = snap2.val()
          tmpObj.issuers = {}
          for (let userKey in snap1.val()[key]) {
            tmpObj.issuers[userKey] = userList[userKey].name
          }
          this.fixedReports.push(tmpObj)
        })
      }
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
  color: green;
}
.btn-orange .md-icon.md-theme-default.md-icon-font{
  color: orange;
}
</style>
