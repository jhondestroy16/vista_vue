// src/services/ProductService.js
import axios from "axios";

const API_URL_BASE = "http://127.0.0.1:8000/products";
const API_URL = "http://127.0.0.1:8000/products/all";

class ProductService {
  getAll() {
    return axios.get(API_URL);
  }

  get(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  create(data) {
    return axios.post(`${API_URL_BASE}/save`, data);
  }

  update(id, data) {
    return axios.put(`${API_URL}/${id}`, data);
  }

  delete(id) {
    return axios.delete(`${API_URL}/${id}`);
  }

  uploadProducts(filePath) {
    return axios.post(`${API_URL_BASE}/save/masivo`, filePath, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}

export default new ProductService();
