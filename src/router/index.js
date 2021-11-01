import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'Home',
            active: true,
          },
        ],
      },
    },
    {
      path: '/second-page',
      name: 'second-page',
      component: () => import('@/views/SecondPage.vue'),
      meta: {
        pageTitle: 'Second Page',
        breadcrumb: [
          {
            text: 'Second Page',
            active: true,
          },
        ],
      },
    },
    {
      path: '/student-dashboard',
      name: 'student-dashboard',
      component: () => import('@/views/StudentDash.vue'),
      meta: {
        pageTitle: 'Student Dashboard',
        rule: 'studentOnly',
        breadcrumb: [
          {
            text: 'Student Dashboard',
            active: true,
          },
        ],
      },
    },
    {
      path: '/create-appointment',
      name: 'create-appointment',
      component: () => import('@/views/CreateAppointment.vue'), 
      meta: {
        pageTitle: 'Create Appointment',
        breadcrumb: [
          {
            text: 'Create Appointment',
            active: true,
          },
        ],
      },
    },
    {
      path: '/live-chat-view',
      name: 'live-chat-view',
      component: () => import('@/views/LiveChat.vue'), 
      meta: {
        pageTitle: 'Live Chat',
        breadcrumb: [
          {
            text: 'Live Chat',
            active: true,
          },
        ],
      },
    },
    {
      path: '/employee-dashboard',
      name: 'employee-dashboard',
      component: () => import('@/views/EmployeeDash.vue'),
      meta: {
        pageTitle: 'Employee Dashboard',
        rule: 'employeeOnly',
        breadcrumb: [
          {
            text: 'Employee Dashboard',
            active: true,
          },
        ],
      },
    },
    {
      path: '/employee-form',
      name: 'employee-form',
      component: () => import('@/views/EmployeeForm.vue'), 
      meta: {
        rule: 'employeeOnly',
        pageTitle: 'Employee Form',
        breadcrumb: [
          {
            text: 'Employee Form',
            active: true,
          },
        ],
      },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/Forgot.vue'),
      meta: {
        layout: 'full',
        rule: 'public',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
        rule: 'public',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: {
        layout: 'full',
        rule: 'public',
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
        rule: 'public',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

import { getAuth, onAuthStateChanged } from "firebase/auth";
import store from '@/store'

router.beforeEach((to, _, next) => {
  // console.log(store.state.user.user.SelectedStudentOrEmployee)
  const auth = getAuth();
  onAuthStateChanged(auth, (isLoggedIn) => {
      if (to.meta.rule !== 'public' && !isLoggedIn) {
         next({ name: 'login' }) 
      }
      if (!store.state.user.user.SelectedStudentOrEmployee) {
        store.dispatch('user/getUserProfile').then(() => {

          console.log("Router: role=", store.state.user.user.SelectedStudentOrEmployee)
          if (to.meta.rule == "studentOnly" && store.state.user.user.SelectedStudentOrEmployee != "Student") {
            //console.log("Not a student going to a student only page")
            next({ name: 'error-404' }) 
          }

          if (to.meta.rule == "employeeOnly" && store.state.user.user.SelectedStudentOrEmployee != "Employee") {
            //console.log("Not employee going to a employee page")
            next({ name: 'error-404' }) 
          }
          next ()

        })
      } else {
        
        console.log("Router: role=", store.state.user.user.SelectedStudentOrEmployee)
        if (to.meta.rule == "studentOnly" && store.state.user.user.SelectedStudentOrEmployee != "Student") {
          //console.log("Not a student going to a student only page")
          next({ name: 'error-404' }) 
        }

        if (to.meta.rule == "employeeOnly" && store.state.user.user.SelectedStudentOrEmployee != "Employee") {
          //console.log("Not employee going to a employee page")
          next({ name: 'error-404' }) 
        }
        next ()
      }
  })
})

export default router
