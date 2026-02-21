import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import  {VueFire, VueFireAuth}  from 'vuefire'

import {firebaseApp} from './assets/utils/firebase.js'

const app = createApp(App)

app.use(router)
app.use(VueFire, {
  firebaseApp,
  modules: [
    // include only the modules you need
    VueFireAuth()
  ]
})

app.mount('#app')
