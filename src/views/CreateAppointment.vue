<template>
  <div>
    <b-card title="University of Regina Employees">
      <div class="media-list media-bordered">
        <b-media
          vertical-align="center"
          v-for="(employee, index) in employeeList"
          :key="employee.userEmail"
        >
          <template #aside>
            <b-img
              :src="photos[index]"
              blank-color="#ccc"
              width="100"
              height="100"
              style="object-fit: cover; width: 100px; height: 100px"
              alt="placeholder"
            />
          </template>
          <h4 class="media-heading">
            {{ employee.firstName }}
            {{ employee.lastName }}
            ({{ employee.status }})
          </h4>
          <b-card-text class="mb-0">
            <div>
              <div class="row">
                <div class="col">
                  <div>Employee ID: {{ employee.ID }}</div>
                  <div>Email: {{ employee.userEmail }}</div>
                  <div>
                    Job Description:
                    {{ employee.employeeFormData.jobDescription }}
                  </div>
                </div>
                <div class="col">
                  <div>
                    Phone:
                    {{ employee.employeeFormData.phone }} ext
                    {{ employee.employeeFormData.extNumber }}
                  </div>

                  <div>
                    Department: {{ employee.employeeFormData.department }}
                  </div>

                  <div>
                    Room Number: {{ employee.employeeFormData.roomNumber }}
                  </div>
                </div>

                <div class="col">
                  <b-button
                    variant="primary"
                    block
                    v-b-modal.modal-primary
                    @click="setEmployee(index)"
                  >
                    Book an Appointment
                  </b-button>

                  <b-button
                    v-if="employee.status == 'Available'"
                    block
                    variant="outline-secondary"
                  >
                    Chat Now
                  </b-button>
                </div>
              </div>
            </div>
          </b-card-text>
        </b-media>
      </div>
    </b-card>

    <!-- modal  
     -->
    <b-modal
      size="lg"
      id="modal-primary"
      ok-only
      ok-title="Cancel"
      modal-class="modal-primary"
      centered
      title="Select an appointment time"
    >
      <div>
      <label>What is this appointment about?</label>
      <b-form-input
                    id="login-email"
                    v-model="titleForAppointment"
                    name="login-email"
                    placeholder=""
                  />


        <label for="example-datepicker">Choose a date</label>
        <b-form-datepicker
          id="example-datepicker"
          v-model="date"
          class="mb-1"

        />
        <label>Showing available times for: {{ date }}</label>
      </div>

      <div v-if="showTimePicker">
        

        <b-button
          v-for="(available, index) in availableTimeSlots"
          :key="'time' + 'b' + index"
          variant="success"
          @click="setAppointment(available)"
          class="m-2"

        >
          {{ available }}
        </b-button>

  
      </div>
    </b-modal>
  </div>
</template>

<script>
// date 2021-mm-dd   2021-10-21
// time 18:mm:ss      09:30:00
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
import BCardCode from "@core/components/b-card-code";
import { collection, query, where, getDocs,addDoc } from "firebase/firestore";
import { db,realTimeDB } from "@/firebaseConfig";
import { set , ref} from "firebase/database";


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
  watch: {
    date: function (newDate) {
      console.log("Current vaules:" + newDate);
      this.queryAppointments(newDate);
    },
  },
  methods: {
    async queryAppointments(date) {
      var data = {}
      data.date = date;
      data.employeeEmail = this.employeeList[this.employeePicked].userEmail;

      await this.$store.dispatch('database/queryEmployeeAppointments',data).then( () => {
        this.employeeListOfAppointments = this.$store.getters['database/getEmployeeListOfAppointments'];
        this.employeeListOfAppointments = JSON.parse(JSON.stringify(this.employeeListOfAppointments))
        this.filterAvailableTimeSlots();
      })
    },
    filterAvailableTimeSlots() {
      for (let i = 0; i < this.employeeListOfAppointments.length; i++) {
        this.availableTimeSlots = this.availableTimeSlots.filter((el) => {
          return this.employeeListOfAppointments[i].time != el;
        });
      }
      this.showTimePicker = true
    },

     async setAppointment(time) {
      // console.log("in set appointment index=",time)
      // console.log("email of employee picked",this.employeeList[this.employeePicked].userEmail)
      // console.log("the date selected is",this.date)
      // console.log("student email", this.$store.state.user.user.userEmail)

      // var data = {}
      // data.time= time
      // data.date = date
      // data.studentEmail =this.$store.state.user.user.userEmail
      // data.employeePicked = this.employeeList[this.employeePicked].userEmail


    //   { APPOINTMENT OBJECT FIRESTORE
    //     "employeeEmail": "employee2@uregina.ca",
    //     "studentEmail": "student@uregina.ca"
    //     "date": "2021-10-21",
    //     "time": "09:30:00",
    //     "id": "1", // ref from REALTIME DB
    //     "title": "hello1",
    // }

      const RTDBLocation = 'rooms/' + this.employeeList[this.employeePicked].ID
                                  +"_"+this.employeeList[this.employeePicked].lastName 
                                  +"_"+this.$store.state.user.user.lastName 
                                  +"_"+ this.date
                                  +"_"+ time;

      // console.log("!!!!!!!!!!!!!!RTDBLocation",RTDBLocation)
      const newData = {
        "employeeEmail": this.employeeList[this.employeePicked].userEmail,
        "studentEmail": this.$store.state.user.user.userEmail,
        "date": this.date,
        "time": time,
        "id": RTDBLocation,
        "title": this.titleForAppointment,
        "employeeName": this.employeeList[this.employeePicked].firstName +' '+ this.employeeList[this.employeePicked].lastName,
        "studentName":this.$store.state.user.user.firstName + " "+ this.$store.state.user.user.lastName
      }

      var data = {}
      data.RTDBLocation = RTDBLocation
      data.newData = newData;
      await this.$store.dispatch('database/createAppointment',data).then( () => {
         // set(ref(realTimeDB, RTDBLocation, newData))
          this.$bvModal.hide('modal-primary') // close modal
          // TODO Redirect to your student home page
          this.$router.push({ name: 'student-dashboard' })
          // Add appointment document with room name (FIRESTORE)
      })
    },
    setEmployee(index) {
      this.employeePicked = index;
    },
    randomize() {
      let numbers = [...this.photos];
      let first,
        second,
        temp,
        count = numbers.length;
      for (let i = 0; i < 10; i++) {
        first = Math.floor(Math.random() * count);
        second = Math.floor(Math.random() * count);
        temp = numbers[first];
        numbers[first] = numbers[second];
        numbers[second] = temp;
      }
      this.photos = numbers;
    },
    resetAvailableTimeSlots() {
      this.availableTimeSlots = [
        "09:00:00",
        "09:30:00",
        "10:00:00",
        "10:30:00",
        "11:00:00",
        "11:30:00",
        "12:00:00",
        "12:30:00",
        "13:00:00",
        "13:30:00",
        "14:00:00",
        "14:30:00",
        "15:00:00",
        "15:30:00",
        "16:00:00",
        "16:30:00",
      ];
    },
  },

  beforeCreate() {
     this.$store.dispatch('database/getEmployeesList').then( () => {
      this.employeeList = this.$store.getters['database/getEmployeeList'];
      this.employeeList = JSON.parse(JSON.stringify(this.employeeList)) // remove observer
      this.randomize();// randomize images for employees
    })
  },
  data() {
    return {
      titleForAppointment: "",
      showTimePicker: false,
      employeePicked: "",
      date: "",
      time: "",
      employeeListOfAppointments: [], // gets from the server to see which time slots are avaialble
      employeeList: [],
      availableTimeSlots: [
        "09:00:00",
        "09:30:00",
        "10:00:00",
        "10:30:00",
        "11:00:00",
        "11:30:00",
        "12:00:00",
        "12:30:00",
        "13:00:00",
        "13:30:00",
        "14:00:00",
        "14:30:00",
        "15:00:00",
        "15:30:00",
        "16:00:00",
        "16:30:00",
      ],
      photos: [
        require("@/assets/images/avatars/1.jpg"),
        require("@/assets/images/avatars/2.jpg"),
        require("@/assets/images/avatars/3.jpg"),
        require("@/assets/images/avatars/4.jpg"),
        require("@/assets/images/avatars/5.jpg"),
        require("@/assets/images/avatars/6.jpg"),
        require("@/assets/images/avatars/7.jpg"),
        require("@/assets/images/avatars/8.jpg"),
        require("@/assets/images/avatars/9.jpg"),
        require("@/assets/images/avatars/10.jpg"),
      ],
      // photos: [
      //   "https://source.unsplash.com/S3GrMiUhpNU/100x100",
      //   "https://source.unsplash.com/pAtA8xe_iVM/100x100",
      //   "https://source.unsplash.com/TACdQo62To0/100x100",
      //   "https://source.unsplash.com/iFgRcqHznqg/100x100",
      //   "https://source.unsplash.com/gyekewtnt2U/100x100",
      //   "https://source.unsplash.com/ivlw4orbruc/100x100",
      //   "https://source.unsplash.com/50TkCaP8M3A/100x100",
      //   "https://source.unsplash.com/OhKElOkQ3RE/100x100",
      //   "https://source.unsplash.com/sgZX15Da8YE/100x100",
      //   "https://source.unsplash.com/RiDxDgHg7pw/100x100",
      // ],
    };
  },
};
</script>


