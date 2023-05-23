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
          Agregar rutina +
        </button>
      </template>

      <v-card color="#000000">
        <v-card-text class="p-4 text-white">
          <v-row>
            <v-col cols="11">
              <h5 class="">
                {{ this.update ? "Editar rutina" : "Agregar rutina" }}
              </h5>
            </v-col>
            <v-col cols="1" @click="close()">
              <v-icon @click="dialog = false" dark>fa-solid fa-close</v-icon>
            </v-col>
          </v-row>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row>
              <v-col cols="12">
                <p>Día</p>
                <v-select
                  v-model="routine.day"
                  required
                  dense
                  dark
                  outlined
                  item-text="name"
                  item-value="name"
                  :items="days"
                  :rules="rules.dayRule"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <p>Ejercicio</p>
                <v-select
                  v-model="routine.fk_id_routine"
                  required
                  dense
                  dark
                  outlined
                  item-text="name"
                  item-value="id"
                  :items="routines"
                  :rules="rules.exerciseRule"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <p>Series</p>
                <v-text-field
                  v-model="routine.series"
                  required
                  dense
                  dark
                  outlined
                  suffix="serie(s)"
                  :rules="rules.seriesRule"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <p>Repeticiones</p>
                <v-text-field
                  v-model="routine.repetitions"
                  required
                  dense
                  dark
                  outlined
                  :rules="rules.repetitionsRule"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <p>Peso</p>
                <v-text-field
                  v-model="routine.weight"
                  required
                  dense
                  dark
                  outlined
                  suffix="kg"
                  :rules="rules.weightRule"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <div class="text-center">
            <button class="btn text-dark bg-green" @click="save()">
              {{ this.update ? "Guardar rutina" : "Agregar rutina" }}
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
      routines: [],
      days: [
        { name: "Lunes" },
        { name: "Martes" },
        { name: "Miercoles" },
        { name: "Jueves" },
        { name: "Viernes" },
        { name: "Sabado" },
        { name: "Domingo" },
      ],
      routine: {
        id: "",
        day: "",
        series: "",
        repetitions: "",
        weight: "",
        fk_id_client: "",
        fk_id_routine: "",
      },

      rules: {
        dayRule: [(v) => !!v || "El día es requerido"],
        seriesRule: [(v) => !!v || "Las series son requeridas"],
        repetitionsRule: [(v) => !!v || "Las repeticiones son requeridas"],
        weightRule: [(v) => !!v || "El peso es requerido"],
        exerciseRule: [(v) => !!v || "El ejercicio es requerido"],
      },
    };
  },
  created() {
    this.URL_ROUTINES = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/routines`;
    this.URL_CREATE = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/clients/create-routine`;
    this.URL_UPDATE = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/users/`;

    axios
      .get(this.URL_ROUTINES, {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((response) => {
        this.routines = response.data.rows;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
    },
    getData(data) {
      this.routine.id = data.id;
      this.routine.series = data.series;
      this.routine.repetitions = data.repetitions;
      this.routine.day = data.day;
      this.routine.weight = data.weight;
      this.routine.fk_id_client = data.fk_id_client;
      this.routine.fk_id_routine = data.fk_id_routine;
    },
    save() {
      if (this.$refs.form.validate()) {
        this.routine.fk_id_client = localStorage.getItem("user");

        if (this.update) {
          axios
            .patch(this.URL_UPDATE + this.user.id, this.user, {
              headers: { "x-access-token": localStorage.getItem("token") },
            })
            .then((response) => {
              if (response.data.success) {
                this.$swal.fire({
                  title: "Rutina modificada!",
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
            .post(this.URL_CREATE, this.routine, {
              headers: { "x-access-token": localStorage.getItem("token") },
            })
            .then((response) => {
              if (response.data.success) {
                this.$swal.fire({
                  title: "Rutina agregada!",
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