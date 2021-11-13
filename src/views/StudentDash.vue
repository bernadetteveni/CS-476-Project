<template>
  <div>
    <div>
      <b-card
        @click="$router.push({ name: 'create-appointment' })"
        style="
          object-fit: fill;
          width: 400px;
          height: 120px;
          margin-bottom: 100px;
        "
        img-src="@/assets/images/avatars/11.jpg"
        overlay
        text-variant="white"
        img-alt="card img"
        body-class="bg-overlay"
        class="mx-auto"
      >
        <div class="h2 text-white mt-5">Make an Appointment</div>

        <b-card-text class="h5 text-white">
          Book a free online session with a University of Regina employee today!
        </b-card-text>
        <a href="#" class="stretched-link"></a>
      </b-card>
    </div>

    <div>
      <b-card title="Your Upcoming Appointments List">
        <div class="media-list media-bordered">
          <b-media
            vertical-align="center"
            v-for="(appointment, index) in appointmentsList"
            :key="'A' + index"
          >
            <template #aside>
              <feather-icon icon="CalendarIcon" size="37" />
            </template>
            <h4 class="ml-2 media-heading">
              {{ appointment.date }} at {{ appointment.time }}
            </h4>
            <b-card-text >
              <div class="">
                <div class="row ml-1">
                  <div class="col">
                    <div>Employee: {{ appointment.employeeName }}</div>
                    <div>Employee Email: {{ appointment.employeeEmail }}</div>
                    <div>Appointment Description: {{ appointment.title }}</div>
                  </div>
                  <div class="col"></div>

                  <div class="col">
                    <b-button
                      :disabled="disableButton(appointment.date)"
                      variant="primary"
                      block
                      v-b-modal.modal-primary
                      @click="goToMeetingRoom(appointment.id)"
                    >
                      Join Meeting
                    </b-button>

                    <b-button block variant="outline-secondary" @click="cancelAppointment(appointment.id)">
                      Cancel Appointment
                    </b-button>
                  </div>
                </div>
              </div>
            </b-card-text>
          </b-media>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import {
  BMedia,
  BFormTimepicker,
  BImg,
  BCard,
  BFormInput,
  BCardText,
  BButton,
  BFormDatepicker,
} from "bootstrap-vue";

// v-for="index in 10" :key="index"
export default {
  components: {
    BFormDatepicker,
    BCard,
    BFormInput,
    BButton,
    BFormTimepicker,
    BMedia,
    BImg,
    BCardText,
  },
  data() {
    return {
      appointmentsList: [],
    };
  },
  beforeCreate() {
    this.$store
      .dispatch(
        "database/downloadMyStudentAppointments",
        this.$store.state.user.user.userEmail
      )
      .then(() => {
        this.appointmentsList =
          this.$store.getters["database/getMyStudentAppointments"];
        // console.log(this.appointmentsList)
        this.appointmentsList = JSON.parse(
          JSON.stringify(this.appointmentsList)
        );
      });
  },
  
  methods: {
    goToMeetingRoom(eventID) {
      console.log("in got to meeting with ", eventID)

    },
    cancelAppointment(arg) {
      // CALL VUEX
      this.$store.dispatch("database/cancelAppointment",arg)

      this.$store
      .dispatch(
        "database/downloadMyStudentAppointments",
        this.$store.state.user.user.userEmail
      )
      .then(() => {
        this.appointmentsList =
          this.$store.getters["database/getMyStudentAppointments"];
        // console.log(this.appointmentsList)
        this.appointmentsList = JSON.parse(
          JSON.stringify(this.appointmentsList)
        );
      });
      // console.log("In cancel appointment with ",arg)
    },
    disableButton(date) {
      // console.log(date);
      var d = new Date(),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      const today = [year, month, day].join("-");

      // console.log("today",today);
      
      if (date > today) {
        return true;
      } else {
        return false
      }

    }
  },
};
</script>

<style>
</style>
