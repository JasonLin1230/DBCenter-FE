<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
export default {
  	name: 'App'
}
</script>

<style>
/*css初始样式*/
body,ol,ul,h1,h2,h3,h4,h5,h6,p,th,td,dl,dd,form,fieldset,legend,input,textarea,select{
    margin: 0;
    padding: 0;
}
body,textarea,select,button {
	background: #e7ebee;
	font-family: "Helvetica Neue",Helvetica,"PingFang SC","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
ul,li {
	list-style: none;
}
</style>

