<template>
  <template v-if="vista == 1">
    <table class="table table-hover">
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
          <button type="submit" class="btn btn-success mt-4">Subir Archivo</button>
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
          this.$emit("productCreated");
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
        Swal.fire({
          title: 'Error!',
          text: 'Por favor selecciona un archivo',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "¿Esta Seguro?",
        text: "Desea agregar estos registros",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Llamar al servicio para subir el archivo
          Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera mientras se completa el proceso',
            icon: 'info',
            allowOutsideClick: false, // Evita que se cierre al hacer clic fuera de la alerta
            showConfirmButton: false, // Oculta el botón de confirmación
            didOpen: () => {
              Swal.showLoading(); // Muestra el ícono de carga
            }
          });
          ProductService.uploadProducts(formData)
            .then(() => {
              Swal.close();
              swalWithBootstrapButtons.fire({
                title: "Exito",
                text: "Archivo subido con éxito.",
                icon: "success"
              });
              this.vista = 1;
              this.fetchProducts();
            })
            .catch(error => {
              Swal.fire({
                title: 'Error!',
                text: 'Error al guardar la información',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              })
              console.error("Error al subir el archivo:", error);
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error"
          });
        }
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
