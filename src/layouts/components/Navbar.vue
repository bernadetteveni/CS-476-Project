<template>
  <div class="navbar-container d-flex content align-items-center">

    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
      <dark-Toggler class="d-none d-lg-block" />
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content>
          <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">
              {{userName}}
            </p>
            <span class="user-status">{{role}}</span>
          </div>
          <b-avatar
            size="40"
            variant="light-primary"
            badge
            :src="require('@/assets/images/avatars/8.jpg')"
            class="badge-minimal"
            badge-variant="success"
          />
        </template>

        <b-dropdown-item link-class="d-flex align-items-center" @click="profile">
          <feather-icon
            size="16"
            icon="UserIcon"
            class="mr-50"
          />
          <span>Dashboard</span>
        </b-dropdown-item>

        <b-dropdown-item link-class="d-flex align-items-center" 
        @click="logout">
          <feather-icon
            size="16"
            icon="LogOutIcon"
            class="mr-50"
          />
          <span>Logout</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav, BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar,
} from 'bootstrap-vue'
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue'
import {getAuth, onAuthStateChanged,signOut} from 'firebase/auth'
import store from '@/store'

export default {
  components: {
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,

    // Navbar Components
    DarkToggler,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    profile() {
      if(store.state.user.user.SelectedStudentOrEmployee == "Student"){
        this.$router.push({ name: 'student-dashboard' })
      } else {
        this.$router.push({ name: 'employee-dashboard' })
      }
    },
    logout() {
      this.$store.dispatch('user/setStatusToUnavailable')
      const auth = getAuth();
      signOut(auth).then(()=>{
        // Sign out successful
      }).catch((error)=>{
    console.log(error.message,"ERROR logging out.")
    })
    }
  },
  computed: {
    userName () {
      return store.state.user.user.firstName + " " + store.state.user.user.lastName
    },
    role() {
      return store.state.user.user.SelectedStudentOrEmployee
    }
  }
}
</script>
