import Vue from 'vue'
import Vuex from 'vuex'

// 持久化储存插件
import CreatePersistedState from 'vuex-persistedstate'

const vuexLocal = new CreatePersistedState()

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userInfo: {}
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
        }
    },
    plugins: [ vuexLocal ]
})