<template>
  <div>
    <!-- alert for more employee info-->
    <b-alert
      v-height-fade.appear
      variant="warning"
      :show="showEmployeeGetAdditionalData"
      class="mb-3"
    >
      <div class="alert-body">
        <feather-icon icon="InfoIcon" class="mr-50" />
        <!-- modal login button -->
        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          v-b-modal.modal-login
          variant="outline-warning"
          class="mx-2"
        >
          Fill Out Employee Form
        </b-button>

        Please fill in your Employee details.
      </div>
    </b-alert>
    <!-- alert -->

    <!-- alert for walk in requests-->
    <div v-for="(walkin, index) in walkInsList" :key="index">
    <b-alert
      v-height-fade.appear
      variant="warning"
      :show="walkInsList.length>0"
      class="mb-3 d-flex flex-row justify-content-between"
    >
      <div class="alert-body">
        <feather-icon
          icon="MessageSquareIcon"
          class="mr-50"
          style="height: 23px; width: 23px"
        />

        Chat request from student {{walkin.studentName}} now.
      </div>

      <div>
        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="outline-success"
          class="mx-2"
          @click="goToMeetingRoom(walkin.id)"
        >
          Accept
        </b-button>

        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="outline-danger"
          @click="cancelWalkIn(walkin.id)"
        >
          Deny
        </b-button>
      </div>
    </b-alert>
  </div>
    <!-- alert -->

    <b-button
      v-ripple.400="'rgba(113, 102, 240, 0.15)'"
      @click="showForm()"
      variant="outline-primary"
      class="mb-2"
    >
      Edit Employee Details
    </b-button>

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
                    <div>Student Name: {{ appointment.studentName }}</div>
                    <div>Student Email: {{ appointment.studentEmail }}</div>
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

                    <b-button block variant="outline-secondary"
                    @click="cancelAppointment(appointment.id)" >
                      
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

    <!-- Employee Form Edit Button -->
    <!-- <b-card
      title="Live Chat Request"
      img-src="https://source.unsplash.com/collection/3579737/600x300"
      img-alt="Image"
      img-top
      tag="article"
      style="max-width: 20rem"
      class="mb-2"
    >
      <b-card-text>
        Accept live chat request from student: [student name]
      </b-card-text>

      <b-card-text> </b-card-text>
      <p class="font-weight-light">Requested on: 2021.01.01 0:00</p>
      <div class="d-flex justify-content-between">
        <b-button href="#" variant="danger">Deny</b-button>
        <b-button href="#" variant="success">Accept</b-button>
      </div>
    </b-card> -->

    <!-- modal login-->
    <b-modal
      hide-footer
      ref="modal-login"
      id="modal-login"
      cancel-variant="outline-secondary"
      centered
      title="Employee Form"
    >
      <validation-observer ref="employeeForm">
        <b-form>
          <b-form-group label="Job Description:">
            <validation-provider
              #default="{ errors }"
              name="Job Description:"
              rules="required"
            >
              <b-form-input
                v-model="jobDescription"
                :state="errors.length > 0 ? false : null"
                placeholder="ie. Front Desk Staff"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <b-form-group label="Faculty/Department:">
            <validation-provider
              #default="{ errors }"
              name="Faculty/Department:"
              rules="required"
            >
              <b-form-input
                v-model="department"
                :state="errors.length > 0 ? false : null"
                placeholder="ie. Student Success Centre"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <b-form-group label="Room Number">
            <validation-provider
              #default="{ errors }"
              name="Room Number"
              rules="required"
            >
              <b-form-input
                v-model="roomNumber"
                :state="errors.length > 0 ? false : null"
                type="number"
                placeholder=""
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <b-form-group label="Phone Number:">
            <validation-provider
              #default="{ errors }"
              name="Phone Number"
              rules="required"
            >
              <b-form-input
                label="Phone Number:"
                v-model="phone"
                type="number"
                :state="errors.length > 0 ? false : null"
                placeholder="1 (306) 123-4567"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>

          <b-form-group label="Ext.:">
            <validation-provider
              #default="{ errors }"
              name="Extention Number"
              rules="required"
            >
              <b-form-input
                label="Ext.:"
                v-model="extNumber"
                type="number"
                :state="errors.length > 0 ? false : null"
                placeholder="0000"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
          <!-- submit button -->

          <b-button
            variant="primary"
            type="submit"
            @click.prevent="validationForm"
          >
            Submit
          </b-button>
        </b-form>
      </validation-observer>
    </b-modal>
  </div>
</template>

<script>
import store from "@/store/index";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import {
  BMedia,
  BAvatar,
  BAlert,
  BCard,
  BCardText,
  BButton,
  BModal,
  VBModal,
  BForm,
  BFormInput,
  BFormGroup,
} from "bootstrap-vue";
import { required, email, confirmed, password } from "@validations";
import { heightFade } from "@core/directives/animations";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import { onMounted } from "vue";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    BCard,
    BAlert,
    BMedia,
    BAvatar,
    BCardText,
    BButton,
    BModal,
    BForm,
    BFormInput,
    BFormGroup,
    vSelect,
  },
  directives: {
    "b-modal": VBModal,
    "height-fade": heightFade,
    Ripple,
  },
  beforeMount() {
    // console.log("beforeMount");
    // Check if we neeed to update employee info
    // console.log("needsDATA",store.state.user.user.employeeForm)
    if (store.state.user.user.employeeFormData == null) {
      this.showEmployeeGetAdditionalData = true;
    }

    this.$store
      .dispatch(
        "database/downloadMyEmployeeAppointments",
        this.$store.state.user.user.userEmail
      )
      .then(() => {
        this.appointmentsList =
          this.$store.getters["database/getMyEmployeeAppointments"];
        // console.log(this.appointmentsList)
        this.appointmentsList = JSON.parse(
          JSON.stringify(this.appointmentsList)
        );
      });

      this.$store
      .dispatch(
        "database/downloadMyEmployeeWalkIns",
        this.$store.state.user.user.userEmail
      )
      .then(() => {
        this.walkInsList = [];
        this.walkInsList = this.$store.getters["database/getMyEmployeeWalkIns"];
        // console.log(this.walkInsList);
        this.walkInsList = JSON.parse(JSON.stringify(this.walkInsList));
        // console.log(this.walkInsList);
      });


  },
  data() {
    return {
      appointmentsList: [],
      walkInsList: [],
      value: "",
      showEmployeeGetAdditionalData: false,
      showWalkInRequests: true,
      selected: "USA",
      option: ["USA", "Canada", "Maxico"],
      emailValue: "",
      name: "",
      PasswordValue: "",
      passwordCon: "",
      required,
      password,
      email,
      confirmed,

      jobDescription: "",
      department: "",
      roomNumber: "",
      phone: "",
      extNumber: "",
    };
  },
  methods: {
    goToMeetingRoom(eventID) {
      // console.log("in got to meeting with ", eventID)
      // Set user to unavailable
      this.$store.dispatch('user/setStatusToUnavailable')
       
      this.$router.push({
          name: 'live-chat-view',
          params: {
            roomID: eventID
          }
        })

     
    },
    cancelWalkIn(arg) {
      // CALL VUEX
      this.$store.dispatch("database/cancelWalkIn", arg).then(() => {
        this.$store.dispatch("database/downloadMyEmployeeWalkIns",
          this.$store.state.user.user.userEmail
      )
      .then(() => {
        this.walkInsList =
          this.$store.getters["database/getMyEmployeeWalkIns"];
        this.walkInsList = JSON.parse(JSON.stringify(this.walkInsList));
      });
      });
    },
    cancelAppointment(arg) {
      // CALL VUEX
      this.$store.dispatch("database/cancelAppointment",arg).then(()=> {
        this.$store
      .dispatch(
        "database/downloadMyEmployeeAppointments",
        this.$store.state.user.user.userEmail
      )
      .then(() => {
        this.appointmentsList =
          this.$store.getters["database/getMyEmployeeAppointments"];
        // console.log(this.appointmentsList)
        this.appointmentsList = JSON.parse(
          JSON.stringify(this.appointmentsList)
        );
      });
      })
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

    },
    showForm() {
      this.$refs["modal-login"].show();
    },
    async validationForm() {
      this.$refs.employeeForm.validate().then(async (success) => {
        if (success) {
          // console.log("SUCCESS");
          // console.log("jobDescription", this.jobDescription);
          // console.log("department", this.department);
          // console.log("roomNumber", this.roomNumber);
          // console.log("phone", this.phone);
          // console.log("extNumber", this.extNumber);

          await this.$store.dispatch("user/updateEmployeeForm", {
            jobDescription: this.jobDescription,
            department: this.department,
            roomNumber: this.roomNumber,
            phone: this.phone,
            extNumber: this.extNumber,
          });

          this.showEmployeeGetAdditionalData = false;
          // this.$bvModal.hide(modal-login)
          this.$refs["modal-login"].hide();
        }
      });
    },
  },
};
</script>