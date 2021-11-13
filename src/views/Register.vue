<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">
      <!-- Brand logo-->
      <b-link class="brand-logo">
        <logo />

        <h2 class="brand-text text-primary ml-1">UR QnA &emsp;</h2>
        <div @click="skin = isDark ? 'light' : 'dark'">
          <feather-icon size="21" :icon="`${isDark ? 'Sun' : 'Moon'}Icon`" />
        </div>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col lg="8" class="d-none d-lg-flex align-items-center p-5">
        <div
          class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img fluid :src="imgUrl" alt="Register V2" />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Register-->
      <b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
        <b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
           <b-card-title
            title-tag="h2"
            class="brand-text text-primary font-weight-bold mb-1"
          >
            Welcome to UR QnA! 👋
          </b-card-title>
          <b-card-text class="mb-2">
            Please register your account
          </b-card-text>
          <!-- form -->
          <validation-observer ref="registerForm" #default="{ invalid }">
            <b-form class="auth-register-form mt-2" @submit.prevent="register">
              <!-- First name -->
              <b-form-group label="First Name" label-for="first-name">
                <validation-provider
                  #default="{ errors }"
                  name="first name"
                  vid="first-name"
                  rules="required"
                >
                  <b-form-input
                    id="first-name"
                    v-model="firstName"
                    name="first-name"
                    :state="errors.length > 0 ? false : null"
                    placeholder="John"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- Last name -->
              <b-form-group label="Last Name" label-for="last-name">
                <validation-provider
                  #default="{ errors }"
                  name="last name"
                  vid="last-name"
                  rules="required"
                >
                  <b-form-input
                    id="last-name"
                    v-model="lastName"
                    name="last-name"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Doe"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- email -->
              <b-form-group label="Email" label-for="register-email">
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  vid="email"
                  rules="required|email|ureginaEmail"
                >
                  <b-form-input
                    id="register-email"
                    v-model="userEmail"
                    name="register-email"
                    :state="errors.length > 0 ? false : null"
                    placeholder="john@uregina.ca"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- password -->
              <b-form-group label-for="register-password" label="Password">
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  vid="password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="register-password"
                      v-model="password"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      :state="errors.length > 0 ? false : null"
                      name="register-password"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        :icon="passwordToggleIcon"
                        class="cursor-pointer"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <div class="demo-inline-spacing mb-2">
                <b-form-radio
                  v-model="SelectedStudentOrEmployee"
                  name="student-employee"
                  value="Student"
                >
                  Student
                </b-form-radio>
                <b-form-radio
                  v-model="SelectedStudentOrEmployee"
                  name="student-employee"
                  value="Employee"
                >
                  Employee
                </b-form-radio>
              </div>

            <!-- ID  -->
              <b-form-group label-for="ID">
                <label>{{SelectedStudentOrEmployee}} ID</label>
                <validation-provider
                  #default="{ errors }"
                  name="ID"
                  vid="ID"
                  rules="required|digits:9|startsWith1or2"
                >
                  <b-form-input
                    id="ID"
                    v-model="ID"
                    name="ID"
                    :state="errors.length > 0 ? false : null"
                    placeholder=""
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              
              <b-form-group>
                <b-form-checkbox
                  id="register-privacy-policy"
                  v-model="status"
                  name="checkbox-1"
                >
                  I agree to
                  <b-link>privacy policy & terms</b-link>
                </b-form-checkbox>
              </b-form-group>

              <b-button
                variant="primary"
                block
                type="submit"
                :disabled="invalid"
              >
                Sign up
              </b-button>
            </b-form>
          </validation-observer>
          <b-card-text class="text-center mt-2">
            <span>Already have an account? </span>
            <b-link :to="{ name: 'login' }">
              <span>&nbsp;Login</span>
            </b-link>
          </b-card-text>
        </b-col>
      </b-col>
      <!-- /Register-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
extend('startsWith1or2', {
  validate(value){
    if (value) {
      return /^(1|2)([0-9]){8}/.test(value);
    }
    return false;
  },
  message: 'Please enter a valid ID',
})
extend('ureginaEmail', {
  validate(value){
    if (value) {
      return /^[A-Za-z0-9._%+-]+@uregina.ca$/.test(value);
    }
    return false;
  },
  message: 'Please enter a valid @uregina.ca email.',
})
import Logo from "@core/layouts/components/Logo.vue";
import {
  BRow,
  BCol,
  BLink,
  BButton,
  BForm,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BInputGroup,
  BInputGroupAppend,
  BImg,
  BCardTitle,
  BCardText,
} from "bootstrap-vue";
import { required, email } from "@validations";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import store from "@/store/index";
import { BFormRadio } from "bootstrap-vue";
import useAppConfig from "@core/app-config/useAppConfig";
import { computed } from "@vue/composition-api";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import router from '@/router';
import { usersCollection } from "@/firebaseConfig";
import { addDirToSelectors } from 'postcss-rtl/lib/selectors';
import { addDoc } from '@firebase/firestore';

export default {
  setup() {
    const { skin } = useAppConfig();

    const isDark = computed(() => skin.value === "dark");

    return { skin, isDark };
  },
  components: {
    Logo,
    BRow,
    BImg,
    BCol,
    BLink,
    BButton,
    BForm,
    BCardText,
    BCardTitle,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BInputGroup,
    BInputGroupAppend,
    // validations
    ValidationProvider,
    ValidationObserver,
    BFormRadio,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: "",
      firstName: "",
      lastName: "",
      username: "",
      userEmail: "",
      password: "",
      SelectedStudentOrEmployee: "",
      ID: "",
      sideImg: require("@/assets/images/pages/UR_Logo_Primary_Black.png"),
      required,
    };
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === "dark") {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require("@/assets/images/pages/UR_Logo_Primary_Reverse_White.png");
        return this.sideImg;
      } else if (store.state.appConfig.layout.skin === "light") {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require("@/assets/images/pages/UR_Logo_Primary_Black.png");
        return this.sideImg;
      }
      return this.sideImg;
    },
  },
  methods: {
    async register() {
      this.$refs.registerForm.validate().then(async (success) => {
        if (success) {
          const auth = getAuth();
          createUserWithEmailAndPassword(auth, this.userEmail, this.password).then(async (userCredential)=>{
            // Signed in
            const user = userCredential.user;
            // console.log(user);
            // Save all user data under 'users' collection
            try{
              const docRef = await addDoc(usersCollection, {
                status: "Not Available",
                firstName: this.firstName,
                lastName: this.lastName,
                userEmail: this.userEmail,
                SelectedStudentOrEmployee: this.SelectedStudentOrEmployee,
                ID: this.ID,
              })
              //console.log("Document written with ID ", docRef.id)
               store.dispatch('user/getUserProfile').then(() => {
                if (store.state.user.user.SelectedStudentOrEmployee == "Student"){
                  router.push({ name: 'student-dashboard' })
                } else {
                router.push({ name: 'employee-dashboard' })
                } 
            })
            } catch(e){
              console.error("Error adding a document on register page to usersCollection ", e);
            } 
          }).catch((error)=>{
            console.log(error.code);
            console.log(error.message);
            //TODO toastify
          })
        }
      });
    },
  },
};
/* eslint-disable global-require */
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
 </style>
