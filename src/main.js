import { createApp } from 'vue'
import 'vuetify/styles'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
// import 'vuetify/styles'
// import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import { createVuetify } from 'vuetify'
const vuetify = createVuetify()
    // import store from './store'
import router from './router'
import 'aframe'
import 'aframe-html-shader'
import "./assets/aframe-environment-component.min.js"


const Vue = createApp(App);
// 使用vuetify
Vue.use(vuetify);
Vue.use(ElementPlus);
// Vue.use(store);
Vue.use(router);

Vue.mount('#app');