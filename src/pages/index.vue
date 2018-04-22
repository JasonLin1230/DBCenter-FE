<template>
<div>
	<el-header class="header">
        <router-link class="logo-box" to="/">
            <img src="../assets/images/header/logo.png" alt="logo">
        </router-link>

        <ul class="tools">
            <li>
                <a class="topic" href="https://github.com/wrz199306/DECenter-BE" target="_blank">接口文档</a>
            </li>

            <li>
                <el-dropdown placement="bottom" trigger="click" @command="handleAccount">
                    <span class="topic">
                        {{ userInfo.phone }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="getSecret">获取secret</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </li>
        </ul>
    </el-header>

    <el-main class="main">
        <main-content></main-content>
    </el-main>
</div>
</template>

<script>
import mainContent from '../components/main'

export default {
    data() {
        return {
            targetPath: '/'
        }
    },

    computed: {
        userInfo() {
            return this.$store.state.userInfo;
        }
    },

    methods: {
        handleAccount(type) {
            if (type === 'getSecret') {

                this.$alert(this.userInfo.secret, 'secret');

            } else if (type === 'logout') {

                this.$store.commit('setUserInfo', {});
                this.$router.push('/login');

            }
        },

        selectMenu(index) {
            this.targetPath = '/';
        }
    },

    beforeRouteEnter (to, from, next) {

        const { userInfo } = localStorage.vuex ? JSON.parse(localStorage.vuex) : {};
        const { phone, secret } = userInfo || {};

        if (phone || secret) {
            next();
        } else {
            next('/login');
        }
        
    },

    components: { mainContent }
}
</script>

<style scoped>
.header {
    background: #545c64;
    overflow: hidden;
}

.logo-box {
    float: left;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}

.logo-box img {
    display: block;
    height: 38px;
}

.menu {
    float: left;
    padding-left: 100px;
}

.tools {
    float: right;
}
.tools>li {
    float: left;
    padding: 21px;
}
.tools .topic {
    font-size: 14px;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
}

.main {
    position: absolute;
    top: 80px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    overflow: hidden;
}

.trans {
    transition: all .1s;
}

.slide-left-enter,
.slide-right-leave-active {
	opacity: 0;
	transform: translate(50px, 0);
    position: absolute;
    top: 20px;
}

.slide-left-leave-active,
.slide-right-enter {
	opacity: 0;
	transform: translate(-50px, 0);
    position: absolute;
    top: 20px;
}

</style>
