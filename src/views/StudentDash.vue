<template>
  <div>
    <div v-for="(walkin, index) in walkInsList" :key="index">
      <!-- alert for walk in requests-->
      <b-alert
        v-height-fade.appear
        :show="walkInsList.length>0"
        variant="warning"
        class="mb-3 d-flex flex-row justify-content-between"
      >
        <div class="alert-body">
          <feather-icon
            icon="MessageSquareIcon"
            class="mr-50"
            style="height: 23px; width: 23px"
          />
          You have a pending walk-in appointment with
          {{ walkin.employeeName }} now.
        </div>

        <div>
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            v-b-modal.modal-login
            variant="outline-success"
            class="mx-2"
            @click="goToMeetingRoom(walkin.id)"
          >
            Chat
          </b-button>

          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            v-b-modal.modal-login
            variant="outline-danger"
            @click="cancelWalkIn(walkin.id)"
          >
            Cancel
          </b-button>
        </div>
      </b-alert>
    </div>
    <!-- alert -->

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
            <b-card-text>
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

                    <b-button
                      block
                      variant="outline-secondary"
                      @click="cancelAppointment(appointment.id)"
                    >
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
import Ripple from "vue-ripple-directive";
import { heightFade } from "@core/directives/animations";
import {
  BMedia,
  BFormTimepicker,
  BImg,
  BCard,
  BAlert,
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
    BAlert,
    BButton,
    BFormTimepicker,
    BMedia,
    BImg,
    BCardText,
  },
  directives: {
    "height-fade": heightFade,
    Ripple,
  },
  data() {
    return {
      appointmentsList: [],
      walkInsList: [],
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
        // console.log(this.appointmentsList);
        this.appointmentsList = JSON.parse(
          JSON.stringify(this.appointmentsList)
        );
      });

    this.$store
      .dispatch(
        "database/downloadMyStudentWalkIns",
        this.$store.state.user.user.userEmail
      )
      .then(() => {
        this.walkInsList = [];
        this.walkInsList = this.$store.getters["database/getMyStudentWalkIns"];
        // console.log(this.walkInsList);
        this.walkInsList = JSON.parse(JSON.stringify(this.walkInsList));
        console.log(this.walkInsList);
      });
  },

  methods: {
    goToMeetingRoom(eventID) {
      // console.log("in got to meeting with ", eventID);
      this.$router.push({
        name: "live-chat-view",
        params: {
          roomID: eventID,
        },
      });
    },
    cancelWalkIn(arg) {
      // CALL VUEX
      this.$store.dispatch("database/cancelWalkIn", arg).then(() => {
        this.$store
      .dispatch(
        "database/downloadMyStudentWalkIns",
        this.$store.state.user.user.userEmail
      )
      .then(() => {
        this.walkInsList =
          this.$store.getters["database/getMyStudentWalkIns"];
        // console.log(this.appointmentsList)
        this.walkInsList = JSON.parse(JSON.stringify(this.walkInsList));
      });
      });
    },
    cancelAppointment(arg) {
      // CALL VUEX
      this.$store.dispatch("database/cancelAppointment", arg).then(() => {
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
      });
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
        return false;
      }
    },
  },
};
</script>

<style>
</style>
