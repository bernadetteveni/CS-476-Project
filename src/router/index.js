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
        pageTitle: 'Create Apoointment',
        breadcrumb: [
          {
            text: 'Create Apoointment',
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
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
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

// TODO ADD LATER
// router.beforeEach((to, _, next) => {
//   firebase.auth().onAuthStateChanged(isLoggedIn => {
    
//     // Redirect to login if not logged in
//     if (!isLoggedIn) return next({ name: 'login' })

//     // Redirect if logged in
//     if (to.meta.redirectIfLoggedIn && isLoggedIn) {
//       // TODO get user data here from the firebase use store
//       const userData = getUserData()
//       return next({ name: 'home' })
//     }

//     return next()
//   })
// })

// import { getAuth, onAuthStateChanged } from "firebase/auth";

// const auth = getAuth();
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });

export default router
