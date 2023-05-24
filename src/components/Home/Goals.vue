<template>
  <v-col cols="12" lg="4" xl="4" class="">
    <div class="d-flex justify-content-between pb-2">
      <h5>Metas</h5>
      <FormGoals></FormGoals>
    </div>

    <v-card
      color="#0f0f0f"
      dark
      class="px-4 py-2"
      style="max-height: 300px; overflow-y: auto; height: 300px"
    >
      <div v-if="goals !== null">
        <div v-for="(item, i) in goals" :key="i">
          <v-row>
            <v-col cols="10">
              <p class="color-green">{{ item.category }}</p>
              <h5>{{ item.description }}</h5>
            </v-col>
            <v-col cols="2">
              <v-checkbox
                v-model="item.active"
                @click="status(item.id)"
              ></v-checkbox>
            </v-col>
          </v-row>
          <hr />
        </div>
      </div>
      <div
        v-else
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
import FormGoals from "./FormGoals.vue";
import { bus } from "../../main";

export default {
  components: { FormGoals },
  data() {
    return {
      check: true,
      goals: null,
      message: null,
    };
  },
  created() {
    bus.$on("reload-grid", (data) => {
      this.getRoutines();
    });

    this.URL_GOALS = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/clients/goals/`;

    this.URL_STATUS = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/goals/status/`;
  },
  mounted() {
    this.getRoutines();
  },
  methods: {
    status(id) {
      axios
        .post(this.URL_STATUS + id, [], {
          headers: { "x-access-token": localStorage.getItem("token") },
        })
        .then((response) => {
          if (!response.data.success) {
            console.log("falla");
          }
        });
    },
    getRoutines() {
      axios
        .get(this.URL_GOALS + localStorage.getItem("user"), {
          headers: { "x-access-token": localStorage.getItem("token") },
        })
        .then((response) => {
          if (!response.data.success) {
            this.message = error;
          } else {
            this.goals = response.data.rows;
          }
        })
        .catch((error) => {
          this.message = "No hay metas";
        });
    },
  },
};
</script>

<style>
</style>