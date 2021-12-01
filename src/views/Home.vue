<template>
  <div>
  <h1 @click="updateTest"> {{TEST}}  </h1>
    <b-card title="Kick start your project 🚀">
      <b-card-text>All the best for your new project.</b-card-text>
      <b-card-text>Please make sure to read our to understand where to go from here and how to use our template.</b-card-text>
    </b-card>

    <div v-if="isStudent">Student</div>
    <div v-else>GUI for Not a student</div>
    <h1 @click="getProfile">UPDATE PROFILE</h1>

     <h1 @click="callFBFunction1">CALL FB FUNCTION</h1>
     <h1 @click="callAI">CALL AI</h1>
   

  </div>
</template>

<script>
import { BCard, BCardText, BLink } from 'bootstrap-vue'
import { functions } from '@/firebaseConfig.js'
import {  httpsCallable } from 'firebase/functions';

export default {
  
  components: {
    BCard,
    BCardText,
    BLink,
  },
  methods : {
    async callFBFunction1() {
            // const addMessage = httpsCallable(functions, 'helloWorld');
            const addMessage = httpsCallable(functions, 'addMessage');


            const result = await addMessage({ text: "MESSAGE TO FIREBASE" })
            console.log("RESULT FROM FIREBASE",(result))
            // const data = result.data;
            //...
    },
     async callAI() {
            // const addMessage = httpsCallable(functions, 'dialogflowGateway');

            const addMessage = httpsCallable(functions, 'dialogFlowMiddle');

            const result = await addMessage({ 
              sessionId: 'temp-session', 
              // uid will be the ai chat room
              queryInput: "update firebase"
            })
            console.log("RESULT FROM FIREBASE",(result))
            // const data = result.data;
            //...
    },
  
    updateTest () {
      console.log("hello from updates")
      store.dispatch('user/updateText')
    },
    getProfile() {
      store.dispatch('user/getUserProfile')
    }
  },
  computed: {
    TEST() {
      return this.$store.state.user.TEST
    },
    isStudent () {
      return this.$store.state.user.user.SelectedStudentOrEmployee == 'Student'
    },
  },
  created() {
    if(this.$store.state.user.user.SelectedStudentOrEmployee == "Student"){
      this.$router.push({ name: 'student-dashboard' })
    } else {
      this.$router.push({ name: 'employee-dashboard' })
    }
  },
  mounted() {
    console.log("in setup")


      // Testing DATABASE module
      console.log("this.$store.state.database.databaseTEST",
            this.$store.state.database.databaseTEST)

      this.$store.dispatch('database/testDatabaseAction',"HelloData")

      console.log("this.$store.state.database.databaseTEST",
      this.$store.state.database.databaseTEST)

      console.log("this.$store.getters['database/getdatabaseTEST']",
            this.$store.getters['database/getdatabaseTEST'])

      console.log(this.$store)



      // Testing FIREABASE sub-module

      console.log("this.$store.state.database.firestore.databaseTEST",
            this.$store.state.database.firestore.firebaseVariable)

      this.$store.dispatch('database/firestore/testFirebaseAction',"HelloFirebaseData")

      console.log("this.$store.state.database.databaseTEST",
      this.$store.state.database.firestore.firebaseVariable)

      console.log("this.$store.getters['database/firestore/getdatabaseTEST']",
            this.$store.getters['database/firestore/getFirebaseVariable'])


      // ACTUAL DATABASE USE
      const data = { 
          "employeeEmail": "employee2@uregina.ca",
          "studentEmail": "student@uregina.ca",
          "date": "2021-10-21",
          "time": "09:30:00",
          "id": "1", // ref from REALTIME DB
          "title": "hello1",
        }

     // this.$store.dispatch('database/createAppointment',data)


  },
}
</script>

<style>

</style>
