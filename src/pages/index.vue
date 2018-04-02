<template>
<div>
	<el-header class="header">
        <router-link class="logo-box" to="/">
            <img src="../assets/images/header/logo.png" alt="logo">
        </router-link>

        <el-menu
            class="menu"
            :default-active="targetPath"
            mode="horizontal"
            :router="true"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">

            <el-menu-item index="/">数据定义</el-menu-item>

            <el-menu-item index="/document">接口文档</el-menu-item>            
        </el-menu>

        <ul class="tools">
            <li>
                <a class="topic" href="https://github.com/wrz199306/dbcenter" target="_blank">Github</a>
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

    <el-scrollbar 
        class="main-wrapper">
        
        <el-main>
            <transition :name="transitionName">
                <router-view class="main"></router-view>
            </transition>
        </el-main>

    </el-scrollbar>
</div>
</template>

<script>
export default {
    data() {
        return {
            targetPath: '/',

            transitionName: ''
        }
    },

    computed: {
        userInfo() {
            return this.$store.state.userInfo
        }
    },

    methods: {
        handleAccount(type) {
            if (type === 'getSecret') {

                this.$alert(this.userInfo.secret, 'secret')

            } else if (type === 'logout') {

                this.$store.commit('setUserInfo', {})
                this.$router.push('/login')

            }
        }
    },

    watch: {
        "$route": {
            handler(to, from) {
                if (!(this.userInfo.phone)) this.$router.push('/login')

                this.targetPath = to.path

                if (from) {
                    const pathArr = ['/', '/document']
                    const toIndex = pathArr.indexOf(to.path)
                    const fromIndex = pathArr.indexOf(from.path)
                    this.transitionName = toIndex < fromIndex ? 'slide-right' : 'slide-left'
                }
                
            },
            immediate: true
        }
    }
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


.main-wrapper {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: -17px;
}

.main {
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
