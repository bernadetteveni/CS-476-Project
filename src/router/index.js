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
      component: () => import('@/views/SecondPage.vue'), // TODO
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
      component: () => import('@/views/SecondPage.vue'), // TODO
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
      component: () => import('@/views/SecondPage.vue'), // TODO
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
      component: () => import('@/views/SecondPage.vue'), // TODO
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
      component: () => import('@/views/SecondPage.vue'), // TODO
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
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
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

export default router
