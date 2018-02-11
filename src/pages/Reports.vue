<template>
  <div id="wrapper">

    <md-dialog :md-active.sync="showDialog" class="image-preview">
      <img v-bind:src="imagePreviewUrl" >
    </md-dialog>

    <center v-if="loading">
      <br/>
      <md-progress-spinner md-mode="indeterminate" class="md-primary"/>
    </center>

    <md-table v-else v-model="searched" md-sort="date" md-sort-order="asc" md-fixed-header>
      <md-table-toolbar>
        <!-- <button @click="testPrint" >Test </button>
        <br> <br> -->
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Reports</h1>
        </div>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>
      <md-table-empty-state
        md-label="No reports found"
        :md-description="`No data found for '${this.search}' query. Try a different search term.`">
      </md-table-empty-state>
      <md-table-row slot="md-table-row" slot-scope="{item}">
        <md-table-cell md-label="Date" md-sort-by="date">
          {{item.date}}
        </md-table-cell>
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
        <md-table-cell md-label="Upvote" md-sort-by="upvoteCount">
          {{item.upvoteCount}}
        </md-table-cell>
        <md-table-cell md-label="Fixed" md-sort-by="fixed">
          <span v-if="item.fixed === 'no'" class="text-orange">No</span>
          <span v-else class="text-green">Fixed</span>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import moment from 'moment'
import {reportsRef} from '../fbHelper'

export default {
  name: 'Reports',
  methods: {
    testPrint: function () {
      console.log(this.searched)
    },
    imagePreview: function (imgUrl) {
      this.imagePreviewUrl = imgUrl
      this.showDialog = true
    },
    searchOnTable: function () {
      let skey = this.search.toLowerCase()
      this.searched = this.reportsList
        .filter(obj => Object.keys(obj).some(key => {
          if (key === 'imageUrl' || key === 'reporterId' ||
            key === 'upvoteCount' || key === 'coord') return false
          else return obj[key].toLowerCase().includes(skey)
        }))
    },
    getDate: function (epoch) {
      return moment(epoch).format('YYYY-MM-DD')
    }
  },
  data () {
    return {
      loading: true,
      showDialog: false,
      imagePreviewUrl: 'https://www.wonderplugin.com/videos/demo-image0.jpg',
      search: '',
      searched: [],
      reportsList: []
    }
  },
  mounted: function () {
    reportsRef.on('value', snap => {
      this.reportsList = []
      this.searched = []
      for (let key in snap.val()) {
        let snapItem = snap.val()[key]
        let tmpObj = {}
        tmpObj.coord = snapItem.coordinate
        tmpObj.date = this.getDate(snapItem.date.reportTime)
        tmpObj.desc = snapItem.description
        tmpObj.fixed = snapItem.fixed ? 'fixed' : 'no'
        tmpObj.imageUrl = snapItem.imageUrl
        tmpObj.reporterId = snapItem.reporterId
        tmpObj.reporterName = snapItem.reporterName
        tmpObj.streetName = snapItem.streetName
        tmpObj.upvoteCount = snapItem.upvoteCount
        this.reportsList.push(tmpObj)
      }
      this.reportsList = this.reportsList.reverse()
      this.searched = this.reportsList
      this.loading = false
    })
  },
  beforeDestroy: function () {
    reportsRef.off()
  }
}
</script>

<style lang="scss">
.md-field {
  max-width: 300px;
}
.md-content.md-table-content.md-scrollbar.md-theme-default {
  height: calc(100vh - 220px) !important;
}
.text-green{
  color: #27BA77;
}
.text-orange{
  color: orangered;
}
.location.md-icon {
  color: #FF4747 !important;
  font-size: 18px !important;
}
</style>
