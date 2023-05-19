<template>
  <v-col cols="6">
    <div class="d-flex justify-content-between align-items-end pb-2">
      <h5>Tu progreso en medidas</h5>
      <FormSizes></FormSizes>
    </div>
    <v-card
      color="#0f0f0f"
      dark
      class="px-4 py-2"
      style="overflow-y: auto; height: auto"
    >
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat>
              <v-btn
                outlined
                dark
                class="mr-4 text-white"
                color=""
                @click="setToday"
              >
                Hoy
              </v-btn>
              <v-btn fab text small color="text-white" @click="prev">
                <v-icon small> fa-solid fa-chevron-left </v-icon>
              </v-btn>
              <v-btn fab text small color="text-white" @click="next">
                <v-icon small> fa-solid fa-chevron-right </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title.toUpperCase() }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="600">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              type="month"
              @click:event="showEvent"
            ></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-toolbar-title>{{
                    formatDate(
                      new Date(selectedEvent.start).toLocaleDateString()
                    )
                  }}</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <p class="fw-bold">Peso: {{ selectedEvent.weight }} kg</p>
                    </v-col>
                    <v-col cols="6">
                      <p class="fw-bold">
                        Altura: {{ selectedEvent.height }} metros
                      </p>
                    </v-col>
                    <v-col cols="6">
                      <p
                        class="fw-bold"
                        :class="getRangeIMC(selectedEvent?.imc)?.color"
                      >
                        IMC: {{ getRangeIMC(selectedEvent?.imc)?.message }}
                      </p>
                    </v-col>
                    <v-col cols="6" v-if="selectedEvent.chest !== null">
                      <p class="fw-bold">Pecho: {{ selectedEvent.chest }} cm</p>
                    </v-col>
                    <v-col cols="6" v-if="selectedEvent.waist !== null">
                      <p class="fw-bold">
                        Cintura: {{ selectedEvent.waist }} cm
                      </p>
                    </v-col>
                    <v-col cols="6" v-if="selectedEvent.thigh !== null">
                      <p class="fw-bold">Muslo: {{ selectedEvent.thigh }} cm</p>
                    </v-col>
                    <v-col cols="6" v-if="selectedEvent.bicep !== null">
                      <p class="fw-bold">Bicep: {{ selectedEvent.bicep }} cm</p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import axios from "axios";
import FormSizes from "./FormSizes.vue";
import { bus } from "../../main.js";

export default {
  components: { FormSizes },
  data() {
    return {
      sizes: null,
      message: "",
      focus: "",
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "pink",
        "purple",
      ],
    };
  },
  created() {
    bus.$on("reload-grid", (data) => {
      this.getSizes();
    });

    this.URL_GET_SIZES = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/clients/sizes/`;
    this.getSizes();
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    getRangeIMC(imc) {
      if (imc < 18.5) {
        return { message: `Bajo de peso (${imc})`, color: "text-primary" };
      }
      if (imc >= 18.5 && imc < 24.9) {
        return { message: `Peso normal (${imc})`, color: "text-success" };
      }
      if (imc >= 24.9 && imc < 29.9) {
        return { message: `Sobrepeso (${imc})`, color: "text-warning" };
      }
      if (imc >= 29.9 && imc < 34.9) {
        return { message: `Obesidad grado 1 (${imc})`, color: "text-warning" };
      }
      if (imc >= 34.9 && imc < 39.9) {
        return { message: `Obesidad grado 2 (${imc})`, color: "text-danger" };
      }
      if (imc >= 39.9 && imc < 39.9) {
        return { message: `Obesidad grado 3 (${imc})`, color: "text-danger" };
      }
    },
    async getSizes() {
      this.events = [];
      await axios
        .get(this.URL_GET_SIZES + localStorage.getItem("user"), {
          headers: { "x-access-token": localStorage.getItem("token") },
        })
        .then((response) => {
          this.sizes = response.data.rows;
        })
        .catch((error) => {
          this.message = "No hay registros";
        });

      this.sizes.forEach((size) => {
        this.events.push({
          name: "Ver más",
          start: new Date(size.date).toISOString().slice(0, 10),
          end: new Date(size.date).toISOString().slice(0, 10),
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          weight: size.weight,
          height: size.height,
          chest: size.chest,
          waist: size.waist,
          thigh: size.thigh,
          bicep: size.bicep,
          imc: size.imc,
        });
      });
    },
    formatDate(dateString) {
      const parts = dateString.split("/");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      const monthNames = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];

      const formattedDate = `${day} de ${monthNames[month - 1]} de ${year}`;

      return formattedDate;
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>

<style>
</style>