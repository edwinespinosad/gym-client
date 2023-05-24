<template>
  <v-row class="p-0 m-0">
    <Membership></Membership>
    <Routines></Routines>

    <Goals></Goals>
    <v-col cols="12" lg="8" xl="8">
      <h5>Instructores</h5>

      <swiper
        ref="mySwiper"
        :slidesPerView="slidesPerView"
        :spaceBetween="30"
        :freeMode="true"
        :pagination="{
          clickable: true,
        }"
        class="mySwiper h-90"
      >
        <swiper-slide v-for="(item, i) in instructors" :key="i">
          <v-card
            color="#0f0f0f"
            class="p-4 d-flex flex-column justify-content-center align-items-center text-white h-100"
          >
            <h5 class="fst-italic">{{ item.name }}</h5>

            <v-img :width="150" :height="250" :src="item.image" cover></v-img>
          </v-card>
        </swiper-slide>
      </swiper>
    </v-col>
  </v-row>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

import axios from "axios";
import { Navigation, Pagination } from "swiper";

import { SwiperCore, Swiper, SwiperSlide } from "swiper-vue2";
// Import Swiper styles
import "swiper/swiper-bundle.css";

import Goals from "../components/Home/Goals.vue";
import Routines from "../components/Home/Routines.vue";
import Membership from "../components/Home/Membership.vue";

SwiperCore.use([Navigation, Pagination]);
export default {
  components: {
    Bar,
    Swiper,
    SwiperSlide,
    Goals,
    Routines,
    Membership,
  },
  data() {
    return {
      instructors: [],
      chart: null,
      chartNewClients: null,
      example: [
        { name: "nombre 1", image: "/perfil.jpg" },
        { name: "nombre 3", image: "/perfil.jpg" },
        { name: "nombre 2", image: "/perfil.jpg" },
        { name: "nombre 2", image: "/perfil.jpg" },
        { name: "nombre 2", image: "/perfil.jpg" },
        { name: "nombre 2", image: "/perfil.jpg" },
      ],

      check: false,
      periodIncome: "Mensual",
      periodMembershipSales: "Mensual",
      periodNewClients: "Mensual",
      filters: ["Semanal", "Mensual", "Anual"],
      incomes: null,
      membershipSales: null,
      newClients: null,

      months: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
    };
  },
  mounted() {
    this.getInstructors();
  },
  created() {
    this.getInstructors();
  },
  computed: {
    slidesPerView() {
      return this.$vuetify.breakpoint.smAndDown ? 1 : 3;
    },
  },
  watch: {
    periodIncome: function (newVal, oldVal) {
      this.getIncomes();
    },
    periodMembershipSales: function (newVal, oldVal) {
      this.getMembershipSales();
    },
    periodNewClients: function (newVal, oldVal) {
      this.getNewClients();
    },
  },
  methods: {
    onSlideChange() {},
    async getInstructors() {
      try {
        await axios
          .get(
            `${process.env.VITE_API_URL.replace(/"/g, "")}/api/instructors`,
            {
              headers: { "x-access-token": localStorage.getItem("token") },
            }
          )
          .then((response) => {
            response.data.rows.forEach((element) => {
              this.instructors.push(element);
            });
            const swiper = document.querySelector(".mySwiper").swiper;
            swiper.update();
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },

    async getIncomes() {
      try {
        const response = await axios
          .get(
            `${process.env.VITE_API_URL.replace(
              /"/g,
              ""
            )}/api/incomes?periodo=${this.periodIncome.toLowerCase()}`,
            {
              headers: { "x-access-token": localStorage.getItem("token") },
            }
          )
          .then((response) => {
            this.incomes =
              response.data.incomes[response.data.incomes.length - 1].total;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
.remove .v-input__control .v-text-field__details {
  display: none !important;
}
.remove .v-input__control .v-input__slot {
  min-height: 0px !important;
}
</style>