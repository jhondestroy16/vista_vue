import axios from "axios";

const API_URL_BASE = "http://127.0.0.1:8000/products";
const API_URL_BASE_CREAR = "http://127.0.0.1:8000/products/save";
const API_URL_BASE_EDITAR = "http://127.0.0.1:8000/products/update";
const API_URL_BASE_ELIMINAR = "http://127.0.0.1:8000/products/delete";
const API_URL = "http://127.0.0.1:8000/products/all";
const API_URL_CATEGORIES = "http://127.0.0.1:8000/category/getCategory";

// Configurar axios con las credenciales de autenticación básica
axios.defaults.auth = {
  username: "user",
  password: "838618d8-f75f-4200-9b88-052f0f86d032",
};

// Incluir credenciales en todas las solicitudes
axios.defaults.withCredentials = true; // Esto es importante para que se envíen cookies o credenciales

class ProductService {
  getAll(page = 1, size = 5) {
    return axios.get(`${API_URL}?page=${page}&size=${size}`, {
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
    return axios.put(`${API_URL_BASE_EDITAR}/${id}`, data, {
      withCredentials: true, // Asegura el envío de credenciales
    });
  }

  delete(id) {
    return axios.delete(`${API_URL_BASE_ELIMINAR}/${id}`, {
      withCredentials: true, // Asegura el envío de credenciales
    });
  }

  uploadProducts(filePath) {
    return axios.post(`${API_URL_BASE}/save/masivo`, filePath, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new ProductService();
