// THIS IS ALL AWONG THIS IS FIRESTORE MODULE

import { usersCollection,db } from "@/firebaseConfig"
import {getDocs,query, where} from 'firebase/firestore'
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

export default {
  namespaced: true, // names will not collide with other modules
  state: {
    employeeList: ""
  },
  getters: {
    getStudentOrEmployee : state => {
      return state.user.user.SelectedStudentOrEmployee
    },
    employeeRequiresAdditionalData : state => {
      return ( state.user.user.employeeForm? true:false)
    }
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
      async getUserProfile ({ commit }) {
        console.log("Getting user profile")
        var email = '1'
        const auth = getAuth();
        const user = auth.currentUser;
        if (user !== null) {
          email = user.auth.currentUser.email;
        }
        
        const q = query(usersCollection, where("userEmail", "==", email));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          commit('SET_USER_PROFILE', doc.data());
        //   if(doc.data().SelectedStudentOrEmployee == "Employee"){
        //     console.log(doc.data().SelectedStudentOrEmployee);
        //     commit('UPDATE_TEXT', "Employee Dashboard");
        //  }
        });
      }, 


      async updateEmployeeForm ({state, dispatch},formData){
        // console.log("formData in store", formData)
        // commit('UPDATE_TEXT', "hello")
        // console.log(state.user.userEmail)
        
        var email = '1'
        const auth = getAuth();
        const user = auth.currentUser;
        if (user !== null) {
          email = user.auth.currentUser.email;
        }
        
        var userDocID;
        const q = query(usersCollection, where("userEmail", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {userDocID = doc.id})

        const myUserDocRef = doc(db, "users", userDocID);
        await updateDoc(myUserDocRef,{employeeFormData: formData});
        dispatch('getUserProfile')
      }
  },
}