import { createApp } from 'vue';
import App from './App.vue';
import VueSelect from "vue-select";

// Importar Bootstrap y sus estilos
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Opcional: Importar Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';

// Importar estilos de vue-select
import 'vue-select/dist/vue-select.css';

const app = createApp(App);

// Registrar globalmente el componente "v-select"
app.component("v-select", VueSelect);

// Montar la aplicación en el elemento con id "app"
app.mount('#app');
