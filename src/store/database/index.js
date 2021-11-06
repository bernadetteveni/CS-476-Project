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
        async getEmployeesList({ dispatch }) {
            return new Promise(async (resolve, reject) => {
                await dispatch('firestore/getEmployeesList');
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