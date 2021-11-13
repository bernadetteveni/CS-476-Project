import { usersCollection,db } from "@/firebaseConfig"
import {getDocs,query, where,doc,updateDoc} from 'firebase/firestore'
import { getAuth } from "firebase/auth";


export default {
  namespaced: true, // names will not collide with other modules
  state: {
    TEST: 'Dashboard',
    user: { // User Default Values
        firstName: '',
        avatar: '',
    }
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
    async logout ({ commit }) {
      console.log("Logging out in VUEX")
      var email = '1'
      const auth = getAuth();
      const user = auth.currentUser;
      if (user !== null) {
        email = user.auth.currentUser.email;
      }
      
      const q = query(usersCollection, where("userEmail", "==", email));

      const querySnapshot = await getDocs(q);
      await querySnapshot.forEach(async (document) => {
        commit('SET_USER_PROFILE', null);
        // console.log("Updating firebase user to Not available",document.data())
        await updateDoc( doc(db, "users", document.ref.id),
          {
            status: "Not available"
          })
        
      });
    },
    
    
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
        await querySnapshot.forEach(async (document) => {
          commit('SET_USER_PROFILE', document.data());
          await updateDoc( doc(db, "users", document.ref.id),
          {
            status: "Available"
          } )
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