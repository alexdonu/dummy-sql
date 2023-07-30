import { createApp } from 'vue'
import App from './App.vue'
import './styles.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'

createApp(App).use(VueMonacoEditorPlugin).mount('#app')
