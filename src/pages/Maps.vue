<template>
  <div id="wrapper">
    <h1>
      Maps
      <button @click="testPrint">test</button>
    </h1>
    <gmap-map :center="center"
      :zoom="zoom"
      map-type-id="roadmap"
      class="markgoMap" >
      <gmap-cluster :grid-size="30">
        <gmap-info-window :opened="ifwOpen"
          :position="ifwPosition"
          :options="ifwOptions"
          @closeclick="infoWinOpen=false">
          <img :src="ifwImg" height="100" width="100" />
          {{ifwText}}
        </gmap-info-window>
        <gmap-marker v-for="(m, i) in markers"
          :position="m.position"
          :draggable="m.draggable"
          @position_changed="updateChild(m, 'position', $event)"
          @click="toggleIfw(m, i)"
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
    toggleIfw: function (marker, idx) {
      this.ifwPosition = marker.position
      this.ifwText = marker.desc
      if (this.currentIfw === idx) this.ifwOpen = false
      else {
        this.ifwOpen = true
        this.currentIfw = idx
        this.ifwImg = marker.imgUrl
      }
    },
    moveToMarker: function () {
      this.queriedMarker = this.markers.filter(obj => Object.keys(obj)
        .find(key => key === 'id' && obj[key] === this.query))[0]
      if (this.queriedMarker !== undefined) {
        this.center = this.queriedMarker.position
        this.zoom = 15
        this.ifwPosition = this.queriedMarker.position
        this.ifwImg = this.queriedMarker.imgUrl
        this.ifwText = this.queriedMarker.desc
        this.ifwOpen = true
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
      ifwImg: 'https://placeholdit.co//i/100x100?bg=000000&fc=FFFFFF&text=Loading...',
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
    this.query = this.$route.params.reportId
  },
  mounted: function () {
    reportsRef.on('value', snap => {
      this.markers = []
      for (let key in snap.val()) {
        let snapItem = snap.val()[key]
        let tmpObj = {}
        tmpObj.id = key
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
</style>
