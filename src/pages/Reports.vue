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

    <md-table v-else v-model="searched" md-sort="date" md-sort-order="asc">
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
          <div class="img-thumb">
            <div class="crop">
              <img :src="item.imageUrl"
              @click="imagePreview(item.imageUrl)"/>
            </div>
          </div>
        </md-table-cell>
        <md-table-cell md-label="Street" md-sort-by="streetName" class="col-description">
          <md-icon class="location">location_on</md-icon>
          <router-link :to="'/maps/i/'+item.id"><u>{{item.streetName}}</u></router-link>
          <div v-if="item.desc!==''" class="description-text"><i>"{{item.desc}}"</i></div>
        </md-table-cell>
        <md-table-cell md-label="Upvote" md-sort-by="upvoteCount">
          {{item.upvoteCount}}
        </md-table-cell>
        <md-table-cell md-label="Fixed" md-sort-by="fixed">
          <span v-if="item.fixed !== 'fixed'" class="text-orange">No</span>
          <span v-else class="text-green">Fixed</span>
        </md-table-cell>
        <md-table-cell>
          <md-button class="md-icon-button btn-green" v-if="item.fixed!=='fixed'" @click="actionBtn('fix',item.idx)">
            <md-icon>done</md-icon>
            <md-tooltip md-direction="top">Change status to Fixed</md-tooltip>
          </md-button>
          <md-button class="md-icon-button btn-orange" v-else @click="actionBtn('unfix',item.idx)">
            <md-icon>clear</md-icon>
            <md-tooltip md-direction="top">Change status to Not Fixed</md-tooltip>
          </md-button>
          <md-button class="md-icon-button btn-red" @click="actionBtn('del',item.idx)">
            <md-icon>delete_forever</md-icon>
            <md-tooltip md-direction="top">Delete This Report</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>

    <md-snackbar md-position="center" :md-duration="2000" :md-active.sync="showSnackbar" md-persistent>
      <span>{{snackbarText}}</span>
      <md-button class="md-accent" @click="showSnackbar = false">close</md-button>
    </md-snackbar>
  </div>
</template>

<script>
import moment from 'moment'
import {reportsRef, userReportsRef, storageRef} from '../fbHelper'

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
          if (key !== 'date' && key !== 'reporterName' &&
            key !== 'streetName' && key !== 'fixed') return false
          else return obj[key].toLowerCase().includes(skey)
        }))
    },
    getDate: function (epoch) {
      return moment(epoch).format('YYYY-MM-DD')
    },
    actionBtn: function (mode, idx) {
      if (mode === 'fix') {
        this.cDialog.title = 'Confirm Fix'
        this.cDialog.text = 'Do you want to change the status to fixed?'
      } else if (mode === 'unfix') {
        this.cDialog.title = 'Cancel Fix'
        this.cDialog.text = 'Do you want to remove fixed status?'
      } else {
        this.cDialog.title = 'Confirm Delete'
        this.cDialog.text = 'Do you really want to delete this report?'
      }
      this.cDialog.mode = mode
      this.cDialog.idx = idx
      this.cDialog.show = true
    },
    dialogConfirmed: function () {
      const report = this.reportsList[this.cDialog.idx]
      if (this.cDialog.mode === 'fix') {
        this.fixReport(report, true)
      } else if (this.cDialog.mode === 'unfix') {
        this.fixReport(report, false)
      } else {
        this.deleteReport(report)
      }
      this.cDialog.show = false
    },
    fixReport: function (report, fixMode) {
      reportsRef.child(`${report.id}/fixed`).set(fixMode).then(snap => {
        if (fixMode) this.snackbarText = 'Report status : Fixed'
        else this.snackbarText = 'Report status : Not Fixed'
        this.showSnackbar = true
      })
    },
    deleteReport: function (report) {
      storageRef.child(`${report.reporterId}/${report.id}.jpg`).delete().then(() => {
        return userReportsRef.child(`${report.reporterId}/${report.id}`).remove()
      }).then(() => {
        return reportsRef.child(report.id).remove()
      }).then(() => {
        this.snackbarText = 'Report deleted'
        this.showSnackbar = true
      }).catch(err => {
        alert(err)
      })
    }
  },
  data () {
    let cDialog = {
      show: false,
      title: '',
      text: '',
      mode: '', // fix, unfix, del
      idx: ''
    }
    return {
      cDialog,
      loading: true,
      showDialog: false,
      showSnackbar: false,
      snackbarText: '',
      imagePreviewUrl: 'https://www.wonderplugin.com/videos/demo-image0.jpg',
      search: '',
      searched: [],
      reportsList: []
    }
  },
  mounted: function () {
    reportsRef.orderByKey().on('value', snap => {
      this.reportsList = []
      this.searched = []
      let idx = Object.keys(snap.val()).length - 1
      for (let key in snap.val()) {
        let snapItem = snap.val()[key]
        let tmpObj = {}
        tmpObj.id = key
        tmpObj.idx = idx--
        tmpObj.coord = snapItem.coordinate
        tmpObj.date = this.getDate(snapItem.date.reportTime)
        tmpObj.desc = snapItem.description
        tmpObj.fixed = snapItem.fixed ? 'fixed' : 'broken'
        tmpObj.imageUrl = snapItem.imageUrl
        tmpObj.reporterId = snapItem.reporterId
        tmpObj.reporterName = snapItem.reporterName
        tmpObj.streetName = snapItem.streetName
        tmpObj.upvoteCount = snapItem.upvoteCount.toString()
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
  height: calc(100vh - 200px) !important;
}
.text-green {
  color: #27BA77;
}
.text-orange {
  color: orange;
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
.btn-red .md-icon.md-theme-default.md-icon-font{
  color: #FF4747;
}
.md-button.md-icon-button.md-theme-default {
  width: 30px;
  min-width: 30px;
  height: 30px;
}
td.md-table-cell.col-description {
  max-width: 250px;
  .description-text {
    margin-left: 18px;
  }
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
