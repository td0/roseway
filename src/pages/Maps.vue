<template>
  <div id="wrapper">
    <h1>
      Maps
      <button @click="testPrint">test</button>
    </h1>
    <gmap-map :center="center"
      :zoom="zoom"
      :options="{minZoom: 12, scrollwheel: true}"
      map-type-id="roadmap"
      class="markgoMap" >
      <gmap-cluster :grid-size="50">
        <gmap-info-window :opened="ifwOpen"
          :position="ifwPosition"
          :options="ifwOptions"
          @closeclick="ifwOpen=false">
          <div class="iw-wrapper">
            <div class="iw-img">
              <img :src="ifwImg" class='iw-img-preview' />
            </div>
            <div class="iw-text">
              <h4>{{ifwTitle}}</h4>
              <span>{{ifwText}}</span>
            </div>
          </div>
        </gmap-info-window>
        <gmap-marker v-for="m in markers"
          :position="m.position"
          :draggable="m.draggable"
          @position_changed="updateChild(m, 'position', $event)"
          @click="toggleIfw(m)"
          :key="m.id">
        </gmap-marker>
      </gmap-cluster>
    </gmap-map>
  </div>
</template>

<script>
import {reportsRef} from '../fbHelper'

export default {
  name: 'maps',
  methods: {
    testPrint: function () {
      console.log(this.markers)
    },
    toggleIfw: function (marker) {
      this.ifwImg = '../assets/img/100x100.png'
      this.ifwPosition = marker.position
      this.ifwText = marker.desc
      this.ifwTitle = marker.name
      if (this.currentIfw === marker.id) this.ifwOpen = !this.ifwOpen
      else {
        this.ifwOpen = true
        this.currentIfw = marker.id
        this.ifwImg = marker.imgUrl
      }
    },
    moveToMarker: function () {
      this.queriedMarker = this.markers.filter(obj => Object.keys(obj)
        .find(key => key === 'id' && obj[key] === this.query))[0]
      if (this.queriedMarker !== undefined) {
        this.center = this.queriedMarker.position
        this.zoom = 17
        this.toggleIfw(this.queriedMarker)
      } else console.log('can\'t find report with ID of : ' + this.query)
    }
  },
  data () {
    return {
      center: {lat: -7.966620, lng: 112.632632},
      zoom: 12,
      markers: [],
      currentIfw: null,
      ifwOpen: false,
      ifwImg: '../assets/img/100x100.png',
      ifwTitle: '',
      ifwText: '',
      ifwPosition: {lat: 0, lng: 0},
      ifwOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      query: '',
      queriedMarker: {}
    }
  },
  created () {
    if (this.$route.params.reportId) this.query = this.$route.params.reportId
  },
  mounted: function () {
    reportsRef.on('value', snap => {
      this.markers = []
      for (let key in snap.val()) {
        let snapItem = snap.val()[key]
        let tmpObj = {}
        tmpObj.id = key
        tmpObj.name = snapItem.reporterName
        tmpObj.position = {
          lat: snapItem.coordinate.latitude,
          lng: snapItem.coordinate.longitude
        }
        tmpObj.opacity = 1
        tmpObj.enabled = true
        tmpObj.draggable = false
        tmpObj.imgUrl = snapItem.imageUrl
        if (snapItem.description !== '') tmpObj.desc = snapItem.description

        this.markers.push(tmpObj)
      }
      if (this.query !== '') this.moveToMarker()
    })
  },
  beforeDestroy: function () {
    reportsRef.off()
  }
}
</script>

<style lang="scss" scoped>
.markgoMap {
  height: calc(100vh - 160px);
  width: 100%;
}
.iw-wrapper {
  max-height:100px;
  .iw-img {
    display: table;
    height:100%;
    max-width: 80px;
    margin-top: 2px;
    margin-bottom: 2px;
    float: left;
    .iw-img-preview{
      display: table-cell;
      vertical-align: middle;
      height: 80px;
      width: 80px;
    }
  }
  .iw-text {
    float: right;
    max-width: 150px;
    margin-left: 20px;
    margin-bottom: 2px;
    h4{
      margin-top:2px;
      margin-bottom:5px;
    }
  }
}
</style>
