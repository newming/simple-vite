<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
  <div class="test-css">测试vue中css效果1</div>
  <img src="./assets/logo.png" alt="">
  <!-- 静态资源文件 -->
  <!-- <img src="/logo.png" alt=""> -->
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
.test-css {
  color: blue;
}
/* $color: magenta;

.pug {
  color: $color;
} */
</style>
