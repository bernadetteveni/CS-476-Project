<template>
  <div>
    <!-- alert -->
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

    <b-card title="Create Awesome 🙌">
      <b-card-text>This is employee dashboard page.</b-card-text>
      <b-card-text
        >Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin.
        Carrot cake dragée chupa chups jujubes. Macaroon liquorice cookie wafer
        tart marzipan bonbon. Gingerbread jelly-o dragée chocolate.</b-card-text
      >
    </b-card>

    <b-button
      v-ripple.400="'rgba(113, 102, 240, 0.15)'"
      @click="showForm()"
      variant="outline-primary"
    >
      Edit Employee Details
    </b-button>

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
    console.log("beforeMount");
    // Check if we neeed to update employee info
    // console.log("needsDATA",store.state.user.user.employeeForm)
    if (store.state.user.user.employeeFormData == null) {
      this.showEmployeeGetAdditionalData = true;
    }
  },
  data() {
    return {
      value: "",
      showEmployeeGetAdditionalData: false,
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
    showForm() {
      this.$refs["modal-login"].show();
    },
    async validationForm() {
      this.$refs.employeeForm.validate().then(async (success) => {
        if (success) {
          console.log("SUCCESS");
          console.log("jobDescription", this.jobDescription);
          console.log("department", this.department);
          console.log("roomNumber", this.roomNumber);
          console.log("phone", this.phone);
          console.log("extNumber", this.extNumber);

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