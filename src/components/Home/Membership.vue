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
            'text-danger':
              getDaysLeft(
                client.latest_purchase_date,
                client.membership_duration
              ) == 0,
            'text-warning':
              getDaysLeft(
                client.latest_purchase_date,
                client.membership_duration
              ) > 0 &&
              getDaysLeft(
                client.latest_purchase_date,
                client.membership_duration
              ) < 5,
            'text-success':
              getDaysLeft(
                client.latest_purchase_date,
                client.membership_duration
              ) >= 5,
          }"
        >
          {{
            getDaysLeft(client.latest_purchase_date, client.membership_duration)
          }}
          {{
            getDaysLeft(
              client.latest_purchase_date,
              client.membership_duration
            ) === 1
              ? "día"
              : "días"
          }}
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
    };
  },
  created() {
    this.getInfoClient();
  },
  methods: {
    async getInfoClient() {
      try {
        await axios
          .get(
            `${process.env.VITE_API_URL.replace(
              /"/g,
              ""
            )}/api/clients/membership/` + localStorage.getItem("user"),
            {
              headers: { "x-access-token": localStorage.getItem("token") },
            }
          )
          .then((response) => {
            this.client = response.data;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
    getDaysLeft(date, duration) {
      try {
        let fecha = new Date(date);

        if (duration.includes("mes")) {
          fecha.setMonth(fecha.getMonth() + parseInt(duration));
          let days = Math.floor((new Date(fecha) - new Date()) / 86400000);
          console.log(days < 0 ? 0 : days);
          return days < 0 ? 0 : days;
        } else {
          fecha.setDate(fecha.getDate() + parseInt(duration));
          let days = Math.floor((new Date(fecha) - new Date()) / 86400000);
          return days < 0 ? 0 : days;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>