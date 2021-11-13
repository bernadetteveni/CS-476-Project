import firestore from './firestore/index.js'

export default {
    modules: {
        firestore,
    },
    namespaced: true, // names will not collide with other 
    state: {
        databaseTEST: "databaseTEST-WORKS"
    },
    getters: {
        
        getMyEmployeeAppointments: state => {
            return JSON.parse(JSON.stringify(state.firestore.employeeAppointments))
        },
        getMyStudentWalkIns: state => {
            return JSON.parse(JSON.stringify(state.firestore.studentWalkIns))
        },
        getMyStudentAppointments: state => {
            return JSON.parse(JSON.stringify(state.firestore.studentAppointments))
        },
        getdatabaseTEST: state => {
            return state.databaseTEST
        },
        getEmployeeListOfAppointments: state => {
            return JSON.parse(JSON.stringify(state.firestore.employeeListOfAppointments))
        },
        getEmployeeList: state => {
            return JSON.parse(JSON.stringify(state.firestore.employeeList))
        },
    },
    mutations: { // COMMIT NO LOGIC - ONLY CHANGE STATE
        UPDATE_databaseTEST(state, data) {
            state.databaseTEST = data
        },
    },
    actions: { // DISPATCH LOGIC + ASYNC fucntions (firebase)
        async cancelWalkIn({ dispatch },eventID) {
            return new Promise(async (resolve, reject) => {
                await dispatch('firestore/cancelWalkIn',eventID);
                resolve()
            }, response => {
                console.log("error line 40")
                // error in loading data
                reject()
            })
        },
        async cancelAppointment({ dispatch },eventID) {
            return new Promise(async (resolve, reject) => {
                await dispatch('firestore/cancelAppointment',eventID);
                resolve()
            }, response => {
                console.log("error line 40")
                // error in loading data
                reject()
            })
        },
        async downloadMyEmployeeAppointments({ dispatch },email) {
            return new Promise(async (resolve, reject) => {
                await dispatch('firestore/downloadMyEmployeeAppointments',email);
                resolve()
            }, response => {
                console.log("error line 36")
                // error in loading data
                reject()
            })
        },
        async downloadMyStudentWalkIns({ dispatch },email) {
            return new Promise(async (resolve, reject) => {
                await dispatch('firestore/downloadMyStudentWalkIns',email);
                resolve()
            }, response => {
                console.log("error line 36")
                // error in loading data
                reject()
            })
        },
        async downloadMyStudentAppointments({ dispatch },email) {
            return new Promise(async (resolve, reject) => {
                await dispatch('firestore/downloadMyStudentAppointments',email);
                resolve()
            }, response => {
                console.log("error line 36")
                // error in loading data
                reject()
            })
        },
        async getEmployeesList({ dispatch }) {
            return new Promise(async (resolve, reject) => {
                await dispatch('firestore/getEmployeesList');
                resolve()
            }, response => {
                // error in loading data
                reject()
            })
        },
        async createWalkIn({ dispatch }, data) {
            return new Promise(async (resolve, reject) => {
                await dispatch('firestore/createWalkIn', data);
                resolve()
            }, response => {
                // error in loading data
                reject()
            })
        },
        async createAppointment({ dispatch }, data) {
            return new Promise(async (resolve, reject) => {
                await dispatch('firestore/createAppointment', data);
                resolve()
            }, response => {
                // error in loading data
                reject()
            })
        },
        async queryEmployeeAppointments({ dispatch }, data) {
            return new Promise(async (resolve, reject) => {
                await dispatch('firestore/queryEmployeeAppointments', data);
                resolve()
            }, response => {
                // error in loading data
                reject()
            })
        },
        testDatabaseAction({ commit }, data) {
            commit('UPDATE_databaseTEST', data);
        },
    }
}

//dispatch('mobuleB/actionB', null, { root: true })