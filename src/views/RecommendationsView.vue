<template>
  <div>
    <h5>Comidas</h5>
    <div class="d-flex justify-content-center align-items-center flex-wrap">
      <v-card
        :loading="loading"
        class="mx-auto my-5 bg-gray text-white"
        max-width="374"
        max-height="500"
        min-height="500"
        dark
        v-for="(item, i) in meals"
        :key="i"
      >
        <v-img height="250" :src="item.image">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row> </template
        ></v-img>

        <v-card-title class="text-white fw-bold">{{ item.name }}</v-card-title>

        <v-card-text>
          <div class="text-white">
            {{ item.meal_preparation }}
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      meals: [],
      loading: false,
      selection: 1,
    };
  },
  mounted() {
    this.getMeals();
  },
  methods: {
    async getMeals() {
      try {
        const response = await axios.get(
          `${process.env.VITE_API_URL.replace(/"/g, "")}/api/meals`,
          {
            headers: { "x-access-token": localStorage.getItem("token") },
          }
        );
        this.meals = response.data.rows;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>