import Vue from 'vue'
import Router from 'vue-router'

import index from '@/pages/index'
import login from '@/pages/login'

import main from '@/components/main.vue'
import document from '@/components/document.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/login',
			name: 'login',
			component: login
		},
		{
			path: '/',
			component: index,
			children: [
				{
					path: '',
					name: 'main',
					component: main
				},
				{
					path: 'document',
					name: 'document',
					component: document
				}
			]
		}
	]
})
