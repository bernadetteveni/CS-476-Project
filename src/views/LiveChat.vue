<template>
  <b-card :title='$route.params.roomID'>
    {{ $route.params.roomID }}
    <b-card-text>This is the live chat page.</b-card-text>
    <b-card-text>Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin. Carrot cake dragée chupa chups jujubes. Macaroon liquorice cookie wafer tart marzipan bonbon. Gingerbread jelly-o dragée chocolate.</b-card-text>
   
  </b-card>
</template>

<script>
import { BCard, BCardText } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardText,
  },
  beforeDestroy() {
    this.$store.dispatch('user/getUserProfile')
  }
}
</script>

<style>

</style>
