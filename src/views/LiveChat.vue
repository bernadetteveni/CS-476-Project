<template>
  <div>
    <b-button
      v-ripple.400="'rgba(113, 102, 240, 0.15)'"
      variant="outline-warning"
      class="mx-2"
      @click="cancelWalkIn()"
    >
      Cancel this Appointment
    </b-button>

    <b-card :title="$route.params.roomID">
      {{ $route.params.roomID }}
      <b-card-text>This is the live chat page.</b-card-text>
      <b-card-text
        >Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin.
        Carrot cake dragée chupa chups jujubes. Macaroon liquorice cookie wafer
        tart marzipan bonbon. Gingerbread jelly-o dragée chocolate.</b-card-text
      >
    </b-card>
  </div>
</template>

<script>
import { BCard, BCardText ,BButton,} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
export default {
  directives: {
    Ripple,
  },
  components: {
    BCard,
    BButton,
    BCardText,
  },
  beforeDestroy() {
    this.$store.dispatch("user/getUserProfile");
  },
  methods: {
    cancelWalkIn() {

      // CALL VUEX
      this.$store.dispatch("database/cancelWalkIn", this.$route.params.roomID).then(() => {
        this.$store
          .dispatch(
            "database/downloadMyStudentWalkIns",
            this.$store.state.user.user.userEmail
          )
          .then(() => {
            if (this.$store.state.user.user.SelectedStudentOrEmployee == "Student"){
              this.$router.push({ name: 'student-dashboard' })
            } else {
              this.$router.push({ name: 'employee-dashboard' })
            } 
          });
      });
    },
  },
};
</script>

<style>
</style>
