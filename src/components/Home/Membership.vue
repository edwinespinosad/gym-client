<template>
  <v-col cols="2">
    <h5>Membresía</h5>
    <v-card
      color="#0f0f0f"
      dark
      class="d-flex flex-column justify-content-center align-items-center h-90"
    >
      <div
        v-if="client.membership_name !== null"
        class="d-flex flex-column justify-content-center align-items-center"
      >
        <p>{{ client.membership_name }}</p>

        <h5
          class="text-center"
          :class="{
            'text-danger': daysLeft === 0,
            'text-warning': daysLeft > 0 && daysLeft < 5,
            'text-success': daysLeft >= 5,
          }"
        >
          {{ daysLeft }} {{ daysLeft === 1 ? "día" : "días" }}
        </h5>
      </div>
      <p v-else class="p-5 text-center">No tienes ninguna membresía activa</p>
    </v-card>
  </v-col>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      client: {},
      daysLeft: 0,
    };
  },
  created() {
    this.getInfoClient();
  },
  methods: {
    async getInfoClient() {
      try {
        const response = await axios.get(
          `${process.env.VITE_API_URL.replace(
            /"/g,
            ""
          )}/api/clients/membership/` + localStorage.getItem("user"),
          {
            headers: { "x-access-token": localStorage.getItem("token") },
          }
        );
        this.client = response.data;
        this.calculateDaysLeft();
      } catch (error) {
        console.log(error);
      }
    },
    calculateDaysLeft() {
      const latestPurchaseDate = this.client.latest_purchase_date;
      const membershipDuration = this.client.membership_duration;

      if (latestPurchaseDate && membershipDuration) {
        const fecha = new Date(latestPurchaseDate);

        if (membershipDuration.includes("mes")) {
          fecha.setMonth(fecha.getMonth() + parseInt(membershipDuration));
        } else {
          fecha.setDate(fecha.getDate() + parseInt(membershipDuration));
        }

        const daysLeft = Math.floor((new Date(fecha) - new Date()) / 86400000);
        this.daysLeft = daysLeft < 0 ? 0 : daysLeft;
      } else {
        this.daysLeft = 0;
      }
    },
  },
};
</script>

<style>
</style>