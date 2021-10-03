import { usersCollection } from "@/firebaseConfig"
import {getDocs} from 'firebase/firestore'


export default {
  namespaced: true, // names will not collide with other modules
  state: {
    TEST: 'from VUEX',
    user: { // User Default Values
        firstName: '',
        avatar: '',
    }
  },
  getters: {
    // doneTodos: state => {
    //   return state.todos.filter(todo => todo.done)
    // }
  },
  mutations: { // COMMIT NO LOGIC - ONLY CHANGE STATE
    UPDATE_TEXT(state, val) {
      state.TEST = val
    },
    SET_USER_PROFILE(state, val) {
        state.user = val
      },
  },
  actions: { // DISPATCH LOGIC + ASYNC fucntions (firebase)
    updateText ({ commit }) {
        // do some firebase stuff
        commit('UPDATE_TEXT', "updated 222222")
      },
      async getUserProfile ({ commit }) {
        console.log("getting a user profile")
        // do some firebase stuff
        const querySnapshot = await getDocs(usersCollection);
        
        querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data()}`);
            commit('SET_USER_PROFILE', doc.data())

        });
      }
  },
}
/* 
Component would call action GET_USER_DATA > mutation SET_USER_DATA > then call getter GET_USER_DATA > */