<template>
  <div id="wrapper">
    <!-- <button @click="testPrint" >Test </button>
    <br> <br> -->

    <md-dialog :md-active.sync="showDialog" class="image-preview">
      <img v-bind:src="imagePreviewUrl" >
    </md-dialog>

    <center v-if="loading">
      <br/>
      <md-progress-spinner md-mode="indeterminate" class="md-accent"/>
    </center>

    <md-table v-else v-model="abusiveReports" md-sort="streetName" md-sort-order="asc">
      <md-table-toolbar>
        <h1 class="md-title">Abusive Post</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Photo">
          <img :src="item.imageUrl" height="40" width="40" @click="imagePreview(item.imageUrl)"/>
        </md-table-cell>
        <md-table-cell md-label="Street" md-sort-by="streetName">{{item.streetName}}</md-table-cell>
        <md-table-cell md-label="Reporter" md-sort-by="reporterName"><b>{{item.reporterName}}</b></md-table-cell>
        <md-table-cell md-label="Issuer">
          <ul>
            <li v-for="(issuer, idx) in item.issuers" :key="idx">
              > <b>{{issuer}}</b><br/>
              <i v-if="item.reasoning[idx]!=''">"{{item.reasoning[idx]}}"</i>
            </li>
          </ul>
        </md-table-cell>
        <md-table-cell md-label="Action" class="action-cell">
          <md-button class="md-icon-button btn-red">
            <md-icon>delete</md-icon>
            <md-tooltip md-direction="top">Delete This Report</md-tooltip>
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
import {abusivePostRef, reportsRef, userList} from '../fbHelper'

export default {
  name: 'Abuse',
  methods: {
    testPrint: function () {
      console.log(this.abusiveReports)
    },
    imagePreview: function (imgUrl) {
      this.imagePreviewUrl = imgUrl
      this.showDialog = true
    }
  },
  data () {
    return {
      showDialog: false,
      loading: true,
      imagePreviewUrl: 'https://www.wonderplugin.com/videos/demo-image0.jpg',
      abusiveReports: []
    }
  },
  mounted: function () {
    abusivePostRef.on('value', snap1 => {
      this.abusiveReports = []
      // console.log(snap1.val())
      for (let key in snap1.val()) {
        // console.log(key)
        reportsRef.child(key).once('value').then(snap2 => {
          let tmpObj = snap2.val()
          tmpObj.issuers = {}
          tmpObj.reasoning = {}
          for (let userKey in snap1.val()[key]) {
            tmpObj.issuers[userKey] = userList[userKey].name
            tmpObj.reasoning[userKey] = snap1.val()[key][userKey].reasoning
          }
          this.abusiveReports.push(tmpObj)
        })
      }
      this.loading = false
    })
  },
  beforeDestroy: function () {
    abusivePostRef.off()
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
.action-cell .md-table-cell-container {
  padding: 0px;
}
.btn-red .md-icon.md-theme-default.md-icon-font{
  color: #FF4747;
}
.btn-orange .md-icon.md-theme-default.md-icon-font{
  color: orange;
}
</style>
