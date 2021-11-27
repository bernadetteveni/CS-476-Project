<template>
  <div>
    <!-- modal vertical center -->
    <b-modal
      ref="exit-modal"
      id="exit-modal"
      centered
      title="This Chat has been cancelled."
      ok-only
      ok-title="Dashboard"
      data-backdrop="static"
      data-keyboard="false"
      @ok="goToYourHome"
      @close="goToYourHome"
      @hide="goToYourHome"
    >
      <b-card-text>
        This Chat has been cancelled by the other person. You will be returned
        to your dashboard.
      </b-card-text>
    </b-modal>

    <b-button
      v-ripple.400="'rgba(113, 102, 240, 0.15)'"
      variant="outline-primary"
      class="btn-block mb-2"
      @click="isWalkIn ? cancelWalkIn() : cancelAppointment()"
    >
      Cancel this Chat
    </b-button>
    <h5 class="mx-auto" style="width: 200px;">Appointment will end in:</h5>
    <div v-if="isAppointment">
      <flip-countdown :showDays="false" :showHours="false" :deadline="countdown" @timeElapsed="timeElapsedHandler"></flip-countdown>
    </div>
    <card-advance-chat :room="$route.params.roomID" :event="eventDocument" />
  </div>

</template>

<script>
var unsubFromWalkin;
var unsubFromAppointment;
// <b-input-group>
//         <b-form-input placeholder="Button on right" v-model="userMessage"/>
//         <b-input-group-append>
//           <b-button variant="outline-primary"

//           @click="sendAMessage">
//             SEND
//           </b-button>
//         </b-input-group-append>
//       </b-input-group>

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { getDatabase, ref, push, set } from "firebase/database";
import { db, realTimeDB } from "@/firebaseConfig";

import FlipCountdown from "vue2-flip-countdown";

import {
  BCard,
  BCardText,
  BButton,
  BModal,
  BInputGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroupPrepend,
  BRow,
  BCol,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import CardAdvanceChat from "@/views/CardAdvanceChat.vue";
export default {
  data() {
    return {
      countdown: "2020-11-11 00:00:00",
      countdownToBeginning: "2020-11-11 00:00:00",
      currentTime: "",
      eventDocument: null,
      isWalkIn: false,
      isAppointment: false,
    };
  },
  directives: {
    Ripple,
  },
  components: {
    FlipCountdown,
    CardAdvanceChat,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroupPrepend,
    BRow,
    BCol,
    BCard,
    BButton,
    BModal,
    BCardText,
  },
  async mounted() {
    // Check if we are a walkin or appointment
    if (this.$route.params.roomID[0] == "a") {
      // console.log("WERE IN AN APPOINTMENT")
      this.isAppointment = true;
    } else {
      // console.log("WERE IN WALKIN")
      this.isWalkIn = true;
    }

    if (this.isWalkIn) {
      // Get walkin Info to fill out the data
      var q = query(
        collection(db, "walkIn"),
        where("id", "==", this.$route.params.roomID)
      );
      const querySnapshot = await getDocs(q);

      await querySnapshot.forEach((document) => {
        this.eventDocument = document.data();
        // console.log("deleting doc->", document.data())
        // console.log("doc.ref",document.ref.id)
        //  deleteDoc( doc(db, "appointments", document.ref.id) );

        // For the person getting cancelled on i.e neeeds to be kicked out
        // Listen for WalkIn cancellation then show a popup that it was cancelled with a link to go home
        // Every time this document changes, run this arrow function
        unsubFromWalkin = onSnapshot(
          doc(db, "walkIn", document.ref.id),
          this.handleEventUpdate
        );
      });
    } else {
      // APPOINTMENT
      var q = query(
        collection(db, "appointments"),
        where("id", "==", this.$route.params.roomID)
      );
      const querySnapshot = await getDocs(q);

      await querySnapshot.forEach((document) => {
        this.eventDocument = document.data();
        var time = [...document.data().time]; // appointment start time
        this.countdownToBeginning = document.data().date + " " + time.join("");
        // var time = ['1', '6', ':', '0', '0'];
        // 2021-11-28 00:00:00

        console.log("Appointment time", time.join(""));

        if (time[3] == "3") {
          time[3] = String.fromCharCode("0".charCodeAt()); // Change from 30 to 00 minutes
          // Need to update the hour
          if (time[1] == 9) {
            time[0] = String.fromCharCode("1".charCodeAt());
            time[1] = String.fromCharCode("0".charCodeAt());
          } else {
            time[1] = String.fromCharCode(time[1].charCodeAt() + 1);
          }
        } else {
          // No need to update the hour
          time[3] = String.fromCharCode("3".charCodeAt());
        }
        console.log("Countdown to the end of appointment", time.join(""));

        this.countdown = document.data().date + " " + time.join("");

        // console.log("deleting doc->", document.data())
        // console.log("doc.ref",document.ref.id)
        //  deleteDoc( doc(db, "appointments", document.ref.id) );

        // For the person getting cancelled on i.e neeeds to be kicked out
        // Listen for WalkIn cancellation then show a popup that it was cancelled with a link to go home
        // Every time this document changes, run this arrow function
        unsubFromAppointment = onSnapshot(
          doc(db, "appointments", document.ref.id),
          this.handleEventUpdate
        );
      });
    }
  },
  unmounted() {
    this.$store.dispatch("user/getUserProfile"); // Set employee to status Available.
    unsubFromWalkin; // Stop listening for cancellation of this walk in.
    unsubFromAppointment;
  },
  methods: {
    timeElapsedHandler() {
      console.log("Timer ran out, Cancelling Appointment")
      this.cancelAppointment()
    },
    cancelAppointment() {
      console.log("cancelling appointment");
      // For the person cancelling
      this.$store
        .dispatch("database/cancelAppointment", this.$route.params.roomID)
        .then(() => {
          this.goToYourHome();
        });
    },
    handleEventUpdate(doc) {
      // this.$store.commit('database/firestore/updateCurrentChatEvent',doc.data)
      // console.log("Current event document was updated to: ", doc.data());
      // Check if the document is empty then kick the user out.
      if (doc.data() == null) {
        // console.log("DOCUMENT DELETED")
        this.showExitPopup = true;
        this.$refs["exit-modal"].show();
      }
    },
    cancelWalkIn() {
      console.log("cancelling WALKIN");

      // For the person cancelling
      this.$store
        .dispatch("database/cancelWalkIn", this.$route.params.roomID)
        .then(() => {
          this.goToYourHome();
        });
    },
    goToYourHome() {
      if (this.$store.state.user.user.SelectedStudentOrEmployee == "Student") {
        this.$router.push({ name: "student-dashboard" });
      } else {
        this.$router.push({ name: "employee-dashboard" });
      }
    },
  },
  computed: {
    countdown2() {
      return new Date();
    },
  },
};
</script>

<style>
</style>
