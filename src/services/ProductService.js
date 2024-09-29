import axios from "axios";

const API_URL_BASE = "http://127.0.0.1:8000/products";
const API_URL_BASE_CREAR = "http://127.0.0.1:8000/products/save";
const API_URL = "http://127.0.0.1:8000/products/all";
const API_URL_CATEGORIES = "http://127.0.0.1:8000/category/getCategory";

// Configurar axios con las credenciales de autenticación básica
axios.defaults.auth = {
  username: "user",
  password: "dbe44e57-09e2-4e07-abf1-95a8f9cf0f92",
};

// Incluir credenciales en todas las solicitudes
axios.defaults.withCredentials = true; // Esto es importante para que se envíen cookies o credenciales

class ProductService {
  getAll() {
    return axios.get(API_URL, {
      withCredentials: true, // Asegura el envío de credenciales
    });
  }

  getAllCategories() {
    return axios.get(API_URL_CATEGORIES, {
      withCredentials: true, // Asegura el envío de credenciales
    });
  }

  get(id) {
    return axios.get(`${API_URL}/${id}`, {
      withCredentials: true, // Asegura el envío de credenciales
    });
  }

  create(data) {
    return axios.post(API_URL_BASE_CREAR, data, {
      withCredentials: true, // Asegura el envío de credenciales
    });
  }

  update(id, data) {
    return axios.put(`${API_URL}/${id}`, data, {
      withCredentials: true, // Asegura el envío de credenciales
    });
  }

  delete(id) {
    return axios.delete(`${API_URL}/${id}`, {
      withCredentials: true, // Asegura el envío de credenciales
    });
  }

  uploadProducts(filePath) {
    return axios.post(`${API_URL_BASE}/save/masivo`, filePath, {
      headers: {
        'Content-Type': 'application/json' // Cambia esto si es necesario
      },
    });
  }
}

export default new ProductService();
