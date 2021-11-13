// THIS IS ALL AWONG THIS IS FIRESTORE MODULE

import { collection, query, where, getDocs, addDoc, orderBy, doc,deleteDoc } from "firebase/firestore";
import { db, realTimeDB } from "@/firebaseConfig";
import { set, ref } from "firebase/database";

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

export default {
  namespaced: true, // names will not collide with other modules
  state: {
    firebaseVariable: "firebase WORKS",
    employeeListOfAppointments: [],
    employeeList: [],
    studentAppointments: [],
    employeeAppointments: [],
    studentWalkIns: [],
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
    
    addToStudentWalkIns(state, data) {
      console.log("adding to student walkins in VUEX",data)
      state.studentWalkIns.push(data)
    },
    addToMyEmployeeAppointments(state, data) {
      state.employeeAppointments.push(data)
    },
    eraseMyEmployeeAppointments(state) {
      state.employeeAppointments = []
    },
    
    eraseStudentWalkIns(state) {
      state.studentWalkIns = []
    },
    eraseStudentAppointments(state) {
      state.studentAppointments = []
    },
    eraseEmployeeListOfAppointment(state) {
      state.employeeListOfAppointments = []
    },
    eraseEmployeeList(state) {
      state.employeeList = []
    },
    addToStudentAppointments(state, data) {
      state.studentAppointments.push(data)
    },
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

    async cancelWalkIn({ }, eventID) {
      // console.log("FROM firebase/cancelAppoiintment with ", eventID)

      // Remove a room (REALTIME_DB)
      set(ref(realTimeDB, eventID), null)
        .then(() => {
          console.log(" // Data removed successfully!")
        })
        .catch((error) => {
          console.log("error", error) // The write failed...
        });

      // REMOVE room in Firestore
      var q = query(
        collection(db,'walkIn'),
        where('id', '==', eventID)
      );
      const querySnapshot = await getDocs(q);
      await querySnapshot.forEach( (document) => {
        // console.log("deleting doc->", document.data())
        // console.log("doc.ref",document.ref.id)
         deleteDoc( doc(db, "walkIn", document.ref.id) );
      });
    },


    async cancelAppointment({ }, eventID) {
      // console.log("FROM firebase/cancelAppoiintment with ", eventID)

      // Remove a room (REALTIME_DB)
      set(ref(realTimeDB, eventID), null)
        .then(() => {
          console.log(" // Data removed successfully!")
        })
        .catch((error) => {
          console.log("error", error) // The write failed...
        });

      // REMOVE room in Firestore
      var q = query(
        collection(db,'appointments'),
        where('id', '==', eventID)
      );
      const querySnapshot = await getDocs(q);
      await querySnapshot.forEach( (document) => {
        // console.log("deleting doc->", document.data())
        // console.log("doc.ref",document.ref.id)
         deleteDoc( doc(db, "appointments", document.ref.id) );
      });
    },


    async downloadMyEmployeeAppointments({ commit }, email) {
      commit('eraseMyEmployeeAppointments');
      const date = formatDate(new Date())
      // console.log("USING TODAYS DATE AS", date)
      const q = query(
        collection(db, "appointments"),
        where("employeeEmail", "==", email),
        where("date", ">=", date),
        orderBy("date", "asc"),
        orderBy("time", "asc")
      );

      const querySnapshot = await getDocs(q);
      await querySnapshot.forEach((doc) => {
        // console.log("firebase appointment", doc.data())
        commit('addToMyEmployeeAppointments', doc.data());
      });
    },
    
    async downloadMyStudentWalkIns({ commit }, email) {
      console.log("INSIDE FIRESTORE walkins download", email)
      commit('eraseStudentWalkIns');
      const date = formatDate(new Date())
      // console.log("USING TODAYS DATE AS", date)
      const q = query(
        collection(db, "walkIn"),
        where("studentEmail", "==", email),
      );
      const querySnapshot = await getDocs(q);
      await querySnapshot.forEach((doc) => {
        console.log("firebase adding a walk in",doc.data())
        commit('addToStudentWalkIns', doc.data());
      });
    },




    async downloadMyStudentAppointments({ commit }, email) {
      commit('eraseStudentAppointments');
      const date = formatDate(new Date())
      // console.log("USING TODAYS DATE AS", date)
      const q = query(
        collection(db, "appointments"),
        where("studentEmail", "==", email),
        where("date", ">=", date),
        orderBy("date", "asc"),
        orderBy("time", "asc")
      );

      const querySnapshot = await getDocs(q);
      await querySnapshot.forEach((doc) => {
        // console.log("firebase appointment",doc.data())
        commit('addToStudentAppointments', doc.data());
      });
    },

    async getEmployeesList({ commit }) {
      commit('eraseEmployeeList');

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
    async createWalkIn({ }, data) {
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
      const docRef = await addDoc(collection(db, "walkIn"), data.newData);
      // console.log("Document written to firestore with ID: ", docRef.id);
    },
    async createAppointment({ }, data) {
      // console.log("FROM createAppointment", data)
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
      // console.log("Document written to firestore with ID: ", docRef.id);
    },
    async queryEmployeeAppointments({ commit, state }, data) {
      commit('eraseEmployeeListOfAppointment');
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