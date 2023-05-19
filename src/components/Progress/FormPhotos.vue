<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <button v-bind="attrs" v-on="on" class="btn text-dark bg-green">
          Sube tu foto!
        </button>
      </template>

      <v-card color="#000000">
        <v-card-text class="p-4 text-white">
          <v-row>
            <v-col cols="11">
              <h5 class="">Subir foto</h5>
            </v-col>
            <v-col cols="1" @click="close()">
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
            </v-row>
          </v-form>
          <div class="text-center">
            <v-btn
              class="btn text-dark bg-green"
              @click="save()"
              :loading="loading"
            >
              Subir
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import axios from "axios";
import { bus } from "../../main.js";
export default {
  data() {
    return {
      dialog: false,
      image: null,
      view_image: "",
      validImage: false,
      loading: false,
      change_image: false,
      valid: true,
      client: {
        fk_id_client: "",
      },
    };
  },
  created() {
    this.URL_CREATE = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/clients/upload-photo`;
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
      this.$refs.form.validate();
      if (this.$refs.form.validate() && this.image !== null) {
        this.loading = true;
        const formData = new FormData();
        formData.append("file", this.image);
        formData.append("fk_id_client", localStorage.getItem("user"));

        axios
          .post(this.URL_CREATE, formData)
          .then((response) => {
            this.loading = false;
            if (response.data.success) {
              this.$swal.fire({
                title: "Foto subida!",
                icon: "success",
                confirmButtonText: "Ok",
                timer: 1500,
              });
              bus.$emit("reload-grid");
              this.close();
              this.image = null;
              this.view_image = "";
            } else {
              this.$swal.fire({
                title: "Error!",
                text: "Verifica los campos ingresados",
                icon: "error",
                timer: 2000,
              });
            }
          })
          .catch((error) => {
            console.error("Error al cargar la imagen:", error);
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