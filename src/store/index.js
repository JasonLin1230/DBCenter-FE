import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../ajax';

// 持久化储存插件
import CreatePersistedState from 'vuex-persistedstate';

const vuexLocal = new CreatePersistedState();

Vue.use(Vuex);

async function getTableDesc(targetTable) {
    if (!targetTable) return [];

    const res = await axios.get(`table/${targetTable}`);

    return res.data;
}

async function getTableData(targetTable) {
    if (!targetTable) return [];

    const res = await axios.get(`data/${targetTable}`);

    return res.data;
}

export default new Vuex.Store({
    state: {
        userInfo: {},

        targetTable: '',

        tableDesc: [],

        tableData: []
    },

    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },

        setTargetTable(state, targetTable) {
            state.targetTable = targetTable;
        },

        setTableDesc(state, tableDesc) {
            state.tableDesc = tableDesc;
        },

        setTableData(state, tableData) {
            state.tableData = tableData;
        }
    },

    actions: {
        async setTableDesc({ state, commit }) {
            commit('setTableDesc', await getTableDesc(state.targetTable));
        },

        async setTableData({ state, commit }) {
            commit('setTableData', await getTableData(state.targetTable));
        }
    },

    plugins: [ vuexLocal ]
})