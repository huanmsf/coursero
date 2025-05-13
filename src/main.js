import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import { initUserStore } from './store/user'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 先使用 Pinia
app.use(pinia)

// 初始化用户状态
initUserStore(app)

// 然后使用路由
app.use(router)
app.use(ElementPlus)

app.mount('#app') 