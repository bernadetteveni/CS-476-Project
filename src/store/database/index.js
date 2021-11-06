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
    getdatabaseTEST : state => {
      return state.databaseTEST
    },
  },
  mutations: { // COMMIT NO LOGIC - ONLY CHANGE STATE
    UPDATE_databaseTEST(state, data) {
      state.databaseTEST = data
    },
  },
  actions: { // DISPATCH LOGIC + ASYNC fucntions (firebase)
    testDatabaseAction({commit},data){
        commit('UPDATE_databaseTEST', data);
    }
  }
}