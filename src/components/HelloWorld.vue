<!-- src/components/ProductList.vue -->
<template>
  <template v-if="vista == 1">
    <table border="1" cellpadding="10" cellspacing="0" align="center">
      <thead>
        <tr>
          <th class="text-center">Nombre</th>
          <th class="text-center">Categoría</th>
          <th class="text-center">Precio Venta</th>
          <th class="text-center">Cantidad en Stock</th>
          <th class="text-center">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="index">
          <td>{{ product.nombre }}</td>
          <td>{{ product.category.category }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.stock }}</td>
          <td>{{ product.active }}</td>
        </tr>
      </tbody>
    </table>
    <button class="btn btn-success mt-4" @click="cambiarVista()">Crear Registro</button>
  </template>
  <template v-else>
    <div>
      <h2>Subir Archivo de Productos (.txt)</h2>
      <form @submit.prevent="uploadFile">
        <div>
          <label for="file">Seleccionar archivo:</label>
          <input type="file" id="file" @change="onFileChange" accept=".txt" />
        </div>
        <div>
          <button type="submit">Subir Archivo</button>
        </div>
      </form>
    </div>
  </template>
</template>

<script>
import ProductService from "../services/ProductService";
import Swal from 'sweetalert2'
export default {
  data() {
    return {
      selectedFile: null,
      products: [],
      vista: 1,
      product: {
        nombre: '',
        categoryId: '',
        price: 0,
        stock: 0,
        active: true
      }
    };
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    cambiarVista() {
      this.vista = 2;
    },
    volver() {
      this.vista = 1;
    },
    fetchProducts() {
      ProductService.getAll()
        .then((response) => {
          this.products = response.data;
          console.log(this.products);
        })
        .catch((error) => {
          console.error("Error al obtener productos:", error);
        });
    },
    saveProduct() {

      ProductService.create(this.product)
        .then(() => {
          Swal.fire({
            title: 'Error!',
            text: 'Do you want to continue',
            icon: 'error',
            confirmButtonText: 'Cool'
          })
          this.$emit("productCreated"); // Emite un evento para notificar al componente padre
          this.resetForm();
          this.vista = 1;
          this.fetchProducts();
        })
        .catch((error) => {
          console.error("Error al crear el producto:", error);
        });
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    uploadFile() {
      if (!this.selectedFile) {
        alert("Por favor selecciona un archivo");
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // Llamar al servicio para subir el archivo
      ProductService.uploadProducts(formData)
        .then(() => {
          alert("Archivo subido con éxito");
          this.vista = 1;
          this.fetchProducts();
        })
        .catch(error => {
          console.error("Error al subir el archivo:", error);
        });
    }
  },
};
</script>
<style scoped>
form {
  display: flex;
  flex-direction: column;
}

div {
  margin-bottom: 10px;
}
</style>
