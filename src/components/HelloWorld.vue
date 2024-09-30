<template>
  <div class="container my-10">
    <template v-if="vista == 1">
      <div class="text-center">
        <h2 class="mb-4">Productos en una API</h2>
        <div class="table-responsive">
          <table class="table table-hover table-bordered text-center">
            <thead class="thead-dark">
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio Venta</th>
                <th>Cantidad en Stock</th>
                <th>Estado</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="products">
                <tr v-for="(product, index) in products" :key="index">
                  <td v-text="product.nombre"></td>
                  <td v-text="product.category.category"></td>
                  <td v-text="product.price"></td>
                  <td v-text="product.stock"></td>
                  <td>
                    <span :class="['badge', product.active ? 'text-bg-success' : 'text-bg-danger']"
                      v-text="product.active ? 'Activo' : 'Inactivo'">
                    </span>
                  </td>
                  <td>
                    <div class="d-flex justify-content-between">
                      <button class="btn btn-danger me-2" @click="eliminar(product.productId)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                          <path fill="currentColor"
                            d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                        </svg>
                      </button>
                      <button class="btn btn-warning me-2" @click="editar(product.productId, product)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                          <g fill="none" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                              d="M4.333 16.048L16.57 3.81a2.56 2.56 0 0 1 3.62 3.619L7.951 19.667a2 2 0 0 1-1.022.547L3 21l.786-3.93a2 2 0 0 1 .547-1.022" />
                            <path d="m14.5 6.5l3 3" />
                          </g>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="6">No se encontraron registros</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <!-- Controles de paginación -->
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">Anterior</button>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <button class="page-link" @click="changePage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="changePage(currentPage + 1)">Siguiente</button>
            </li>
          </ul>
        </nav>

        <div class="d-flex justify-content-between">
          <button class="btn btn-primary btn-lg me-2" @click="cambiarVista()">Crear Masivo</button>
          <button class="btn btn-success btn-lg" @click="cambiarVistaCrear()">Crear Registro</button>
        </div>
      </div>
    </template>
    <template v-else-if="vista == 2">
      <div class="text-center">
        <h2 class="mb-4">Subir Archivo de Productos (.txt)</h2>
        <form @submit.prevent="uploadFile" class="form-upload" enctype="multipart/form-data">
          <div class="form-group">
            <label for="file" class="btn btn-outline-secondary">Seleccionar archivo</label>
            <input type="file" id="file" class="form-control-file mt-4" @change="onFileChange" accept=".txt" />
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-success mt-4 me-2">Subir Archivo</button>
            <button type="button" class="btn btn-primary mt-4" @click="volver()">Volver</button>
          </div>
        </form>
      </div>
    </template>
    <template v-else-if="vista == 3">
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
            <button type="submit" class="btn btn-success mt-4 me-2">Guardar Producto</button>
            <button type="button" class="btn btn-primary mt-4" @click="volver()">Volver</button>
          </div>
        </form>
      </div>
    </template>
    <template v-else-if="vista == 4">
      <div class="text-center">
        <h2 class="mb-5">Crear producto</h2>
        <form @submit.prevent="updateProduct()" class="form-create-product">
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
            <button type="submit" class="btn btn-success mt-4 me-2">Guardar Producto</button>
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
      categories: [],
      currentPage: 1,         // Página actual
      itemsPerPage: 10,        // Número de elementos por página
      totalProducts: 0,
      id: 0
    };
  },
  computed: {
    // Calcula los productos que se deben mostrar en la página actual
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.products.slice(start, end);
    },
    // Calcula el número total de páginas
    totalPages() {
      return Math.ceil(this.totalProducts / this.itemsPerPage - 1);
    }
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    editar(id, producto) {
      this.getCategories();
      this.product = {
        nombre: producto.nombre,
        categoryId: producto.category.categoryId,
        price: producto.price,
        stock: producto.stock,
      }
      this.id = id;
      this.vista = 4;
    },
    // Cambia la página actual  
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchProducts();
      }
    },

    fetchProducts() {
      ProductService.getAll(this.currentPage, this.itemsPerPage)
        .then((response) => {
          console.log(this.products);

          this.products = response.data.content || [];
          this.totalProducts = response.data.totalElements;
        })
        .catch((error) => {
          console.error("Error al obtener productos:", error);
        });
    },

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
      this.validatePrice();
      this.validateStock();
      if (!this.errors.nombre && !this.errors.categoryId && !this.errors.price && !this.errors.stock) {
        ProductService.create(this.product)
          .then(() => {
            Swal.fire({
              title: "Éxito",
              text: "Producto guardado exitosamente.",
              icon: "success",
            });
            this.product = [];
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
    updateProduct() {
      this.validateNombre();
      this.validatePrice();
      this.validateStock();
      if (!this.errors.nombre && !this.errors.categoryId && !this.errors.price && !this.errors.stock) {
        ProductService.update(this.id, this.product)
          .then(() => {
            Swal.fire({
              title: "Éxito",
              text: "Producto actualizado exitosamente.",
              icon: "success",
            });
            this.product = [];
            this.vista = 1;
            this.fetchProducts();
            this.id = 0;
          })
          .catch((error) => {
            console.error("Error al actualizar el producto:", error);
          });
      } else {
        Swal.fire('Error', 'Por favor corrige los errores en el formulario', 'error');
      }
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    eliminar(id) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Desea eliminar este producto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          ProductService.delete(id)
            .then(() => {
              Swal.fire({
                title: "Éxito",
                text: "Producto guardado exitosamente.",
                icon: "success",
              });
              this.product = [];
              this.vista = 1;
              this.fetchProducts();
            })
            .catch((error) => {
              console.error("Error al crear el producto:", error);
            });
        }
      });
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
              console.log(error);
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

.pagination {
  margin-top: 20px;
}

.page-link {
  cursor: pointer;
}
</style>
