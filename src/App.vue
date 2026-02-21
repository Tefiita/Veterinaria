<template>
  <NavBar />
  <RouterView />
</template>

<script>

import { RouterView } from 'vue-router'
import LoginView from './views/LoginView.vue';
import NavBar from './components/NavBar.vue';


export default {
  name: 'App',
  components: {
    RouterView,
    LoginView,
    NavBar
  }
}
</script>
