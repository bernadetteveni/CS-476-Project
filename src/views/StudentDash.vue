<template>
  <div>
        <b-card
        @click="$router.push('create-appointment')"
        style="height: 200px;width:500px;"
        img-src="https://source.unsplash.com/lp1AKIUV3yo/500x200"
          overlay
          text-variant="white"
          img-alt="card img"
          body-class="bg-overlay"
          class="mx-auto "
        >
        <div class="h2 text-white mt-4"> Make an Appointment</div>
          
          <b-card-text class="h5 text-white">
            Book a free online session with a University of Regina employee today!
          </b-card-text>
          <a href="#" class="stretched-link"></a>
        </b-card>

  </div>
</template>

<script>
import { BRow, BCol, BCard, BCardText, BButton, BCardTitle } from "bootstrap-vue";

// v-for="index in 10" :key="index"
export default {
  components: {
    BRow, BCol,
    BCard,
    BButton,
    BCardText,
    BCardTitle,
  },
};
</script>

<style>
</style>
