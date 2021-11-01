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
              alt="placeholder"
            />
          </template>
          <h4 class="media-heading">
            {{ employee.firstName }}
            {{ employee.lastName }}
            (status:{{ employee.status }})
          </h4>
          <b-card-text class="mb-0">
            <div class="container">
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
                    v-if="employee.status == true"
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

    <!-- modal -->
    <b-modal
      size="lg"
      id="modal-primary"
      ok-only
      ok-title="Accept"
      modal-class="modal-primary"
      centered
      title="Select an appointment time"
    >
      <div>
        <label for="example-datepicker">Choose a date</label>
        <b-form-datepicker
          id="example-datepicker"
          v-model="date"
          class="mb-1"
          @
        />
        <p>Showing available times for: '{{ date }}'</p>
      </div>


<div>
      <b-button
        v-for="(app,index) in employeeListOfAppointments"
        :key="'time'+'a'+index" 
        variant="primary"
        @click=""
        class="m-2"
      >
        {{app}}
      </b-button>





      <b-button
        v-for="(available,index) in availableTimeSlots"
        :key="'time'+'b'+index" 
        variant="success"
        @click=""
        class="m-2"
      >
        {{available}}
      </b-button>

<div>
{{availableTimeSlots}}
</div>

<div>
{{employeeListOfAppointments}}
</div>



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
  BCardText,
  BButton,
  BFormDatepicker,
} from "bootstrap-vue";
import BCardCode from '@core/components/b-card-code'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default {
  components: {
    BFormDatepicker,
    BCard,
    BCardCode,
    BButton,
    BFormTimepicker,
    BMedia,
    BImg,
    BCardText,
  },
  watch: {
    date: function(newDate) {
        console.log('Current vaules:' + newDate);
        this.querryAppointments(newDate)
    },
  },
  methods: {
    // TODO MAKE THIS INTO A VUEX dispatch call and get the data into this.employeeListOfAppointments from VUEX
    // create a vuex module firestore
    
    async querryAppointments(date){
      console.log("Checking the date", date)
      console.log("employee email", this.employeeList[this.employeePicked].userEmail)


      const q = query(collection(db, "appointments"), 
        where("employeeEmail", "==", this.employeeList[this.employeePicked].userEmail),
        where("date", "==", date));
      
      
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        this.employeeListOfAppointments.push(doc.data());
      });
      this.filterAvailableTimeSlots()
    },
    filterAvailableTimeSlots() {
      for (let i = 0; i< this.employeeListOfAppointments.length;i++){
        this.availableTimeSlots = this.availableTimeSlots.filter( ( el ) => {
          return this.employeeListOfAppointments[i].time != el
        });
      }
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
    resetAvailableTimeSlots(){
      this.availableTimeSlots = 
                  [   "09:00:00","09:30:00",
                      "10:00:00","10:30:00",
                      "11:00:00","11:30:00",
                      "12:00:00","12:30:00",
                      "13:00:00","13:30:00",
                      "14:00:00","14:30:00",
                      "15:00:00","15:30:00",
                      "16:00:00","16:30:00",
                        ]
    },
  },

  async beforeCreate() {
    const q = query(
      collection(db, "users"),
      where("employeeFormData", "!=", null)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      this.employeeList.push(doc.data());
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
    });
    this.randomize();
  },
  data() {
    return {
      employeePicked: "",
      date: "",
      time: "",
      employeeListOfAppointments: [], // gets from the server to see which time slots are avaialble
      employeeList: [],
      availableTimeSlots: [   "09:00:00","09:30:00",
                              "10:00:00","10:30:00",
                              "11:00:00","11:30:00",
                              "12:00:00","12:30:00",
                              "13:00:00","13:30:00",
                              "14:00:00","14:30:00",
                              "15:00:00","15:30:00",
                              "16:00:00","16:30:00",
    ],
      photos: [
        "https://source.unsplash.com/S3GrMiUhpNU/100x100",
        "https://source.unsplash.com/pAtA8xe_iVM/100x100",
        "https://source.unsplash.com/TACdQo62To0/100x100",
        "https://source.unsplash.com/iFgRcqHznqg/100x100",
        "https://source.unsplash.com/gyekewtnt2U/100x100",
        "https://source.unsplash.com/ivlw4orbruc/100x100",
        "https://source.unsplash.com/50TkCaP8M3A/100x100",
        "https://source.unsplash.com/OhKElOkQ3RE/100x100",
        "https://source.unsplash.com/sgZX15Da8YE/100x100",
        "https://source.unsplash.com/RiDxDgHg7pw/100x100",
      ],
    };
  },
};
</script>


