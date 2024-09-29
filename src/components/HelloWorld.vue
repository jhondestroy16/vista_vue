<template>
  <div class="container my-6">
    <template v-if="vista == 1">
      <div class="table-responsive">
        <table class="table table-hover table-bordered text-center">
          <thead class="thead-dark">
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio Venta</th>
              <th>Cantidad en Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="index">
              <td>{{ product.nombre }}</td>
              <td>{{ product.category.category }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.stock }}</td>
              <td>
                <span :class="['badge', product.active ? 'badge-success' : 'badge-danger']">
                  {{ product.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex justify-content-between">
        <button class="btn btn-primary btn-lg" @click="cambiarVista()">Crear Masivo</button>
        <button class="btn btn-success btn-lg" @click="cambiarVistaCrear()">Crear Registro</button>
      </div>
    </template>

    <template v-else-if="vista == 2">
      <div class="text-center">
        <h2 class="mb-4">Subir Archivo de Productos (.txt)</h2>
        <form @submit.prevent="uploadFile" class="form-upload">
          <div class="form-group">
            <label for="file" class="btn btn-outline-secondary">Seleccionar archivo</label>
            <input type="file" id="file" class="form-control-file" @change="onFileChange" accept=".txt" />
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-success mt-4">Subir Archivo</button>
            <button type="button" class="btn btn-primary mt-4" @click="volver()">Volver</button>
          </div>
        </form>
      </div>
    </template>

    <template v-if="vista == 3">
      <div class="text-center">
        <h2 class="mb-5">Crear producto</h2>
        <form @submit.prevent="saveProduct()" class="form-create-product">
          <div class="row">
            <div class="col-mb-3 mt-4">
              <label for="nombre">Nombre</label>
              <input type="text" class="form-control" v-model="product.nombre" placeholder="Nombre del producto"
                @blur="validateNombre" />
              <span v-if="errors.nombre" class="text-danger">{{ errors.nombre }}</span>
            </div>
            <div class="col-mb-3 mt-4">
              <label for="category">Categoría</label>
              <v-select :options="categories" v-model="product.categoryId" label="category"
                :reduce="category => category.categoryId" placeholder="Selecciona una categoría">
              </v-select>
              <span v-if="errors.categoryId" class="text-danger">{{ errors.categoryId }}</span>
            </div>
            <div class="col-mb-3 mt-4">
              <label for="price">Precio</label>
              <input type="text" class="form-control" v-model="product.price" placeholder="Precio de venta"
                @blur="validatePrice" />
              <span v-if="errors.price" class="text-danger">{{ errors.price }}</span>
            </div>
            <div class="col-mb-3 mt-4">
              <label for="stock">Stock</label>
              <input type="text" class="form-control" v-model="product.stock" placeholder="Cantidad en stock"
                @blur="validateStock" />
              <span v-if="errors.stock" class="text-danger">{{ errors.stock }}</span>
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-success mt-4">Guardar Producto</button>
            <button type="button" class="btn btn-primary mt-4" @click="volver()">Volver</button>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>

<script>
import ProductService from "../services/ProductService";
import Swal from 'sweetalert2';
import vSelect from 'vue-select';
export default {
  components: {
    vSelect,
  },
  data() {
    return {
      selectedFile: null,
      products: [],
      vista: 1,
      product: {
        nombre: '',
        categoryId: '',
        price: '',
        stock: '',
        active: true,
      },
      errors: {
        nombre: '',
        categoryId: '',
        price: '',
        stock: '',
      },
      categories: []
    };
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    validateNombre() {
      if (!this.product.nombre) {
        this.errors.nombre = 'El nombre es obligatorio';
      } else {
        this.errors.nombre = '';
      }
    },
    validateCategoryId() {
      if (!this.product.categoryId) {
        this.errors.categoryId = 'La categoría es obligatoria';
      } else if (isNaN(this.product.categoryId)) {
        this.errors.categoryId = 'La categoría debe ser un número válido';
      } else {
        this.errors.categoryId = '';
      }
    },
    validatePrice() {
      if (!this.product.price) {
        this.errors.price = 'El precio es obligatorio';
      } else if (isNaN(this.product.price)) {
        this.errors.price = 'El precio debe ser un número válido';
      } else if (this.product.price <= 0) {
        this.errors.price = 'El precio debe ser mayor a 0';
      } else {
        this.errors.price = '';
      }
    },
    validateStock() {
      if (!this.product.stock) {
        this.errors.stock = 'El stock es obligatorio';
      } else if (isNaN(this.product.stock)) {
        this.errors.stock = 'El stock debe ser un número válido';
      } else if (this.product.stock < 0) {
        this.errors.stock = 'El stock no puede ser negativo';
      } else {
        this.errors.stock = '';
      }
    },
    cambiarVistaCrear() {
      this.vista = 3;
      this.getCategories();
    },
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
        })
        .catch((error) => {
          console.error("Error al obtener productos:", error);
        });
    },
    getCategories() {
      ProductService.getAllCategories()
        .then((response) => {
          this.categories = response.data;
        })
        .catch((error) => {
          console.error("Error al obtener productos:", error);
        });
    },
    saveProduct() {
      this.validateNombre();
      this.validateCategoryId();
      this.validatePrice();
      this.validateStock();
      if (!this.errors.nombre && !this.errors.categoryId && !this.errors.price && !this.errors.stock) {
        ProductService.create(this.product)
          .then(() => {
            this.$emit("productCreated");
            this.resetForm();
            this.vista = 1;
            this.fetchProducts();
          })
          .catch((error) => {
            console.error("Error al crear el producto:", error);
          });
      } else {
        Swal.fire('Error', 'Por favor corrige los errores en el formulario', 'error');
      }
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    uploadFile() {
      if (!this.selectedFile) {
        Swal.fire({
          title: 'Error!',
          text: 'Por favor selecciona un archivo',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      Swal.fire({
        title: "¿Estás seguro?",
        text: "Desea agregar estos registros",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera mientras se completa el proceso',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          ProductService.uploadProducts(formData)
            .then(() => {
              Swal.close();
              Swal.fire({
                title: "Éxito",
                text: "Archivo subido con éxito.",
                icon: "success",
              });
              this.vista = 1;
              this.fetchProducts();
            })
            .catch((error) => {
              Swal.fire({
                title: 'Error!',
                text: 'Error al guardar la información',
                icon: 'error',
                confirmButtonText: 'Aceptar',
              });
              console.error("Error al subir el archivo:", error);
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.table {
  margin-top: 20px;
}

.thead-dark th {
  background-color: #343a40;
  color: white;
}

.btn {
  width: 100%;
}

.form-upload,
.form-create-product {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-top: 20px;
}
</style>
