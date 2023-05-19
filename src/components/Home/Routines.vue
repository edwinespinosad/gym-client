<template>
  <v-col cols="8">
    <div class="d-flex justify-content-between pb-2">
      <h5>Mis Rutinas</h5>
      <FormRoutines></FormRoutines>
    </div>
    <v-card
      color="#0f0f0f"
      dark
      class="px-4 py-2"
      style="max-height: 300px; overflow-y: auto; height: 300px"
    >
      <v-row v-if="routines !== null">
        <v-col
          cols="4"
          v-for="(group, day) in routines"
          :key="day"
          class="border border-gray"
        >
          <p class="color-green">{{ day }}</p>
          <v-row v-for="item in group" :key="item.id">
            <hr />
            <v-col cols="12">
              <h5>{{ item.name }}</h5>
            </v-col>
            <v-col cols="4">
              <h5>{{ item.series }} serie(s)</h5>
            </v-col>
            <v-col cols="4">
              <h5>{{ item.repetitions }} repeticiones</h5>
            </v-col>
            <v-col cols="4">
              <h5>{{ item.weight }} kg</h5>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div
        class="d-flex justify-content-center align-items-center"
        style="height: 280px"
      >
        <h5>
          {{ message }}
        </h5>
      </div>
    </v-card>
  </v-col>
</template>

<script>
import axios from "axios";
import FormRoutines from "./FormRoutines.vue";

import { bus } from "../../main";

export default {
  components: { FormRoutines },
  data() {
    return {
      routines: null,
      message: "",
    };
  },
  created() {
    bus.$on("reload-grid", (data) => {
      this.getRoutines();
    });

    this.URL_GET_ROUTINES = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/clients/routines/`;
  },
  mounted() {
    this.getRoutines();
  },
  methods: {
    async getRoutines() {
      await axios
        .get(this.URL_GET_ROUTINES + localStorage.getItem("user"), {
          headers: { "x-access-token": localStorage.getItem("token") },
        })
        .then((response) => {
          this.routines = response.data.rows;
          const dayOrder = {
            lunes: 1,
            martes: 2,
            miercoles: 3,
            jueves: 4,
            viernes: 5,
            sabado: 6,
            domingo: 7,
          };

          this.routines.sort((a, b) => {
            const diaA = a.day.toLowerCase();
            const diaB = b.day.toLowerCase();

            if (dayOrder[diaA] && dayOrder[diaB]) {
              return dayOrder[diaA] - dayOrder[diaB];
            }

            if (!dayOrder[diaA] && !dayOrder[diaB]) {
              return 0;
            }

            return dayOrder[diaA] ? -1 : 1;
          });

          this.routines = this.routines.reduce((agrupados, objeto) => {
            const { day } = objeto;
            if (!agrupados[day]) {
              agrupados[day] = [];
            }
            agrupados[day].push(objeto);
            return agrupados;
          }, {});
        })
        .catch((error) => {
          // console.log(error);
          this.message = "No hay rutinas";
        });
    },
  },
};
</script>

<style>
</style>