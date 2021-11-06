<template>
  <div>
  <h1 @click="updateTest"> {{TEST}}  </h1>
    <b-card title="Kick start your project 🚀">
      <b-card-text>All the best for your new project.</b-card-text>
      <b-card-text>Please make sure to read our to understand where to go from here and how to use our template.</b-card-text>
    </b-card>

    <div v-if="isStudent">STudent</div>
    <div v-else>GUI for Not a student</div>
    <h1 @click="getProfile">UPDATE PROFILE</h1>
   
  </div>
</template>

<script>
import { BCard, BCardText, BLink } from 'bootstrap-vue'


export default {
  
  components: {
    BCard,
    BCardText,
    BLink,
  },
  methods : {
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
  mounted() {
    console.log("in setup")


      // Testing Database module
      console.log("this.$store.state.database.databaseTEST",
            this.$store.state.database.databaseTEST)

      this.$store.dispatch('database/testDatabaseAction',"HelloData")

      console.log("this.$store.state.database.databaseTEST",
      this.$store.state.database.databaseTEST)

      console.log("this.$store.getters['database/getdatabaseTEST']",
            this.$store.getters['database/getdatabaseTEST'])

      console.log(this.$store)



      // Testing firebase module
      



  },
}
</script>

<style>

</style>
