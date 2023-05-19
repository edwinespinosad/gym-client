<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          v-if="update"
          @click="getData(dataUpdate)"
          color="green"
          v-bind="attrs"
          v-on="on"
        >
          fa-solid fa-pencil
        </v-icon>
        <button v-else v-bind="attrs" v-on="on" class="btn text-dark bg-green">
          Agregar meta +
        </button>
      </template>

      <v-card color="#000000">
        <v-card-text class="p-4 text-white">
          <v-row>
            <v-col cols="11">
              <h5 class="">
                {{ this.update ? "Editar meta" : "Agregar meta" }}
              </h5>
            </v-col>
            <v-col cols="1" @click="close()">
              <v-icon @click="dialog = false" dark>fa-solid fa-close</v-icon>
            </v-col>
          </v-row>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row>
              <v-col cols="12">
                <p>Categoría</p>
                <v-text-field
                  v-model="goal.category"
                  required
                  dense
                  dark
                  outlined
                  :rules="rules.categoryRule"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <p>Descripción</p>
                <v-text-field
                  v-model="goal.description"
                  required
                  dense
                  dark
                  outlined
                  :rules="rules.descriptionRule"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <div class="text-center">
            <button class="btn text-dark bg-green" @click="save()">
              {{ this.update ? "Guardar meta" : "Agregar meta" }}
            </button>
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
  props: {
    update: Boolean,
    dataUpdate: Object,
  },
  data() {
    return {
      dialog: false,
      valid: true,
      goal: {
        id: "",
        category: "",
        description: "",
        fk_id_client: "",
      },

      rules: {
        categoryRule: [(v) => !!v || "La categoría es requerida"],
        descriptionRule: [(v) => !!v || "La descripción es requerida"],
      },
    };
  },
  created() {
    this.URL_CREATE = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/clients/create-goal`;
    this.URL_UPDATE = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/users/`;
  },
  methods: {
    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
    },
    getData(data) {
      this.goal.id = data.id;
      this.goal.category = data.category;
      this.goal.description = data.description;
    },
    save() {
      if (this.$refs.form.validate()) {
        this.goal.fk_id_client = localStorage.getItem("user");
        if (this.update) {
          axios
            .patch(this.URL_UPDATE + this.user.id, this.user, {
              headers: { "x-access-token": localStorage.getItem("token") },
            })
            .then((response) => {
              if (response.data.success) {
                this.$swal.fire({
                  title: "Usuario modificado!",
                  icon: "success",
                  confirmButtonText: "Ok",
                  timer: 1500,
                });
                bus.$emit("reload-grid");
                this.dialog = false;
                this.$refs.form.reset();
              } else {
                this.$swal.fire({
                  title: "Error!",
                  text: "Verifica los campos ingresados",
                  icon: "error",
                  timer: 2000,
                });
              }
            });
        } else {
          axios
            .post(this.URL_CREATE, this.goal, {
              headers: { "x-access-token": localStorage.getItem("token") },
            })
            .then((response) => {
              if (response.data.success) {
                this.$swal.fire({
                  title: "Meta agregada!",
                  icon: "success",
                  confirmButtonText: "Ok",
                  timer: 1500,
                });
                bus.$emit("reload-grid");
                this.dialog = false;
                this.$refs.form.reset();
              } else {
                this.$swal.fire({
                  title: "Error!",
                  text: "Verifica los campos ingresados",
                  icon: "error",
                  timer: 2000,
                });
              }
            });
        }
      }
    },
  },
};
</script>

<style>
</style>