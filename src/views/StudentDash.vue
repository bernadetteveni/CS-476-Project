<template>
  <div>
        <b-card
        @click="$router.push('create-appointment')"
         style="object-fit: fill; width: 400px; height: 120px;"
        img-src="@/assets/images/avatars/11.jpg"
          overlay
          text-variant="white"
          img-alt="card img"
          body-class="bg-overlay"
          class="mx-auto "
        >
        <div class="h2 text-white mt-5"> Make an Appointment</div>
          
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
