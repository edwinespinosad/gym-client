<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="red lighten" dark v-bind="attrs" v-on="on">
          ¿Aún no tienes cuenta? Crea una
        </v-btn>
      </template>

      <v-card color="#000000">
        <v-card-text class="p-4 text-white">
          <v-row>
            <v-col cols="11">
              <h5 class="">Crear cuenta</h5>
            </v-col>
            <v-col cols="1" @click="dialog = false">
              <v-icon @click="dialog = false" dark>fa-solid fa-close</v-icon>
            </v-col>
          </v-row>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row>
              <v-col
                cols="12"
                class="d-flex flex-column justify-content-center align-items-center"
              >
                <input
                  required
                  v-show="false"
                  ref="photo"
                  type="file"
                  accept="image/*"
                  @change="onFileChanged"
                />
                <div
                  class="drop text-center"
                  style="margin-bottom: 4px; cursor: pointer; display: flex"
                >
                  <div
                    class="mb-2 row d-flex justify-content-center align-items-center"
                    style="height: 110px; width: 110px"
                  >
                    <v-img
                      class="rounded-circle"
                      :src="
                        view_image.includes('blob')
                          ? view_image
                          : URL + '/' + view_image
                      "
                      v-if="image !== null"
                      @click="selectImage"
                      max-width="109"
                      max-height="109"
                      width="109"
                      height="109"
                      style="
                        cursor: pointer;
                        margin-top: -2px;
                        margin-right: -1px;
                      "
                    ></v-img>
                    <v-icon v-else @click="selectImage" color="#000000"
                      >fa-solid fa-image
                    </v-icon>
                  </div>
                </div>
                <p v-if="validImage" class="text-danger">
                  La imagen es necesaria
                </p>
              </v-col>
              <v-col cols="6">
                <p>Nombre</p>
                <v-text-field
                  v-model="client.name"
                  required
                  dense
                  dark
                  outlined
                  :rules="rules.nameRule"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <p>Apellidos</p>
                <v-text-field
                  v-model="client.last_name"
                  required
                  dense
                  dark
                  outlined
                  :rules="rules.lastNameRule"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <p>Teléfono</p>
                <v-text-field
                  v-model="client.phone"
                  type="phone"
                  required
                  dense
                  dark
                  outlined
                  :rules="rules.phoneRule"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <p>Correo Electrónico</p>
                <v-text-field
                  v-model="client.email"
                  required
                  dense
                  dark
                  outlined
                  :rules="rules.emailRule"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <p>Contraseña</p>
                <v-text-field
                  v-model="client.password"
                  type="password"
                  required
                  dense
                  dark
                  outlined
                  :rules="rules.passwordRule"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <div class="text-center">
            <v-btn
              class="btn text-dark bg-green"
              @click="save()"
              :loading="loading"
            >
              Crear cuenta
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      URL: process.env.VITE_API_URL.replace(/"/g, ""),
      dialog: false,
      client: {
        id: "",
        name: "",
        last_name: "",
        phone: "",
        email: "",
        password: "",
        type: 2,
      },
      image: null,
      view_image: "",
      validImage: false,
      loading: false,
      change_image: false,
      valid: true,

      rules: {
        nameRule: [(v) => !!v || "El nombre es requerido"],
        lastNameRule: [(v) => !!v || "Los apellidos son requeridos"],
        phoneRule: [
          (v) => !!v || "El teléfono es requerido",
          (v) => (v && v.length == 10) || "El teléfono debe tener 10 dígitos",
        ],
        emailRule: [(v) => !!v || "El correo es requerido"],
      },
    };
  },
  created() {
    this.URL_CREATE = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/clients`;
    this.URL_LOGIN = `${process.env.VITE_API_URL.replace(/"/g, "")}/api/login`;
  },
  watch: {
    image(file) {
      if (file) {
        if (typeof file !== "string")
          this.view_image = URL.createObjectURL(file);
        else this.view_image = file;
      } else {
        this.view_image = null;
      }
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
    },
    onFileChanged(e) {
      this.image = e.target.files[0];
      this.validImage = false;
      this.change_image = true;
    },
    selectImage() {
      this.$refs.photo.click();
    },
    save() {
      if (this.$refs.form.validate() && this.image !== null) {
        this.loading = true;
        const formData = new FormData();
        formData.append("file", this.image);
        formData.append("name", this.client.name);
        formData.append("last_name", this.client.last_name);
        formData.append("phone", this.client.phone);
        formData.append("email", this.client.email);
        formData.append("password", this.client.password);
        formData.append("change_image", this.change_image);

        axios.post(this.URL_CREATE, formData).then((response) => {
          this.loading = false;
          if (response.data.success) {
            this.$swal.fire({
              title: "Cuenta creada!",
              icon: "success",
              confirmButtonText: "Ok",
              timer: 1500,
            });

            axios.post(this.URL_LOGIN, this.client).then((response) => {
              if (response.data.success) {
                let token = response.data.token;
                let user = response.data.user;
                localStorage.setItem("token", token);
                localStorage.setItem("user", user);
                // setTimeout(() => {
                  window.location.reload();
                // }, 1500);
              }
            });
            this.dialog = false;
            this.change_image = false;
            this.$refs.form.reset();
          } else {
            if (response.data.duplicated) {
              this.$swal.fire({
                title: "Error!",
                text: response.data.message,
                icon: "error",
                timer: 2000,
              });
            } else {
              this.$swal.fire({
                title: "Error!",
                text: "Verifica los campos ingresados",
                icon: "error",
                timer: 2000,
              });
            }
          }
        });
      } else if (this.image === null) {
        this.validImage = true;
      }
    },
  },
};
</script>

<style>
</style>