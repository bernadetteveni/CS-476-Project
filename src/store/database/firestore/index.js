// THIS IS ALL AWONG THIS IS FIRESTORE MODULE

import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, realTimeDB } from "@/firebaseConfig";
import { set, ref } from "firebase/database";


export default {
  namespaced: true, // names will not collide with other modules
  state: {
    firebaseVariable: "firebase WORKS",
    employeeListOfAppointments: [],
    employeeList: [],
  },
  getters: {
    getFirebaseVariable: state => {

      return state.firebaseVariable
    },
    getEmployeeListOfAppointments: state => {
      return Object.assign([], state.employeeListOfAppointments)
    },
  },
  mutations: { // COMMIT NO LOGIC - ONLY CHANGE STATE
    UPDATE_firebaseVariable(state, data) {
      state.firebaseVariable = data
    },
    addToEmployeeListOfAppointments(state, appt) {
      // mutate state
      state.employeeListOfAppointments.push(appt)
    },
    addToEmployeeList(state, employee) {
      // mutate state
      state.employeeList.push(employee)
    }

  },
  actions: { // DISPATCH LOGIC + ASYNC fucntions (firebase)
    async getEmployeesList({ commit }) {
      const q = query(
        collection(db, "users"),
        where("employeeFormData", "!=", null)
      );
  
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // this.employeeList.push(doc.data());
        commit('addToEmployeeList', doc.data());
      });
    },
    testFirebaseAction({ commit }, data) {
      commit('UPDATE_firebaseVariable', data);
    },
    async createAppointment({ }, data) {
      console.log("FROM createAppointment", data)
      // API CALL TO firebase and set the data
        // Create a room (REALTIME_DB)
  
        set(ref(realTimeDB, data.RTDBLocation), data.newData)
          .then(() => {
            console.log(" // Data saved successfully!")
          })
          .catch((error) => {
            console.log("error", error) // The write failed...
  
          });

        // TODO add newData to firestore (appoinments collection )
        // Add a new document in collection "cities"
        const docRef = await addDoc(collection(db, "appointments"), data.newData);
        console.log("Document written to firestore with ID: ", docRef.id);
    },
    async queryEmployeeAppointments({ commit, state }, data) {
      const date = data.date;
      const employeeEmail = data.employeeEmail;

      console.log("Checking the date", date);
      console.log("employee email", employeeEmail);

      const q = query(
        collection(db, "appointments"),
        where(
          "employeeEmail",
          "==",
          employeeEmail
        ),
        where("date", "==", date)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        commit('addToEmployeeListOfAppointments', doc.data());
      });
    },
  },
}