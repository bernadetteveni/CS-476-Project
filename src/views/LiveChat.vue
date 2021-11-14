<template>
  <div>
    <!-- modal vertical center -->
    <b-modal
      ref="exit-modal"
      id="exit-modal"
      centered
      title="This Walk-in has been cancelled."
      ok-only
      ok-title="Dashboard"
      data-backdrop="static"
      data-keyboard="false"
      @ok="goToYourHome"
      @close="goToYourHome"
      @hide="goToYourHome"
    >
      <b-card-text>
      This Walk-in has been cancelled by the other person. You will be returned to your dashboard.
      </b-card-text>
    </b-modal>

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
import { db, realTimeDB } from "@/firebaseConfig";
import { BCard, BCardText, BButton, BModal } from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
export default {
  data() {
    return {
      unsub: null, // firestore document listener unsibstribe
      showExitPopup: false,
    };
  },
  directives: {
    Ripple,
  },
  components: {
    BCard,
    BButton,
    BModal,
    BCardText,
  },
  async mounted() {
    // Get walkin Info to fill out the data
    var q = query(
      collection(db, "walkIn"),
      where("id", "==", this.$route.params.roomID)
    );
    const querySnapshot = await getDocs(q);

    await querySnapshot.forEach((document) => {
      // console.log("deleting doc->", document.data())
      // console.log("doc.ref",document.ref.id)
      //  deleteDoc( doc(db, "appointments", document.ref.id) );

      // For the person getting cancelled on i.e neeeds to be kicked out
      // Listen for WalkIn cancellation then show a popup that it was cancelled with a link to go home
      // Every time this document changes, run this arrow function
      this.unsub = onSnapshot(
        doc(db, "walkIn", document.ref.id),
        this.handleEventUpdate
      );
    });
  },
  beforeDestroy() {
    this.$store.dispatch("user/getUserProfile"); // Set employee to status Available.
    this.unsub(); // Stop listening for cancellation of this walk in.
  },
  methods: {
    methodClose() {},
    handleEventUpdate(doc) {
      console.log("Current event document was updated to: ", doc.data());
      // Check if the document is empty then kick the user out.
      if (doc.data() == null) {
        // console.log("DOCUMENT DELETED")
        this.showExitPopup = true;
        this.$refs["exit-modal"].show();
      }
    },

    cancelWalkIn() {
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
};
</script>

<style>
</style>
