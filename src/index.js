import Vue from 'vue'
import App from './pages/app.vue'
import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui'

Vue.use(Element)

new Vue({
    el: '#root',
    render: h => h(App)
})