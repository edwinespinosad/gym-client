<template>
  <v-col cols="12" lg="6" xl="6" class="mb-ph-5">
    <div class="d-flex justify-content-between align-items-end pb-2">
      <h5>Tu progreso en fotos</h5>
      <FormPhotos></FormPhotos>
    </div>
    <v-card color="#0f0f0f" dark style="overflow-y: auto; height: 700px">
      <div
        class="d-flex flex-wrap gap-2 align-items-center justify-content-center"
        v-if="photos !== null"
      >
        <div v-for="item in photos" :key="item.id">
          <v-img
            :src="item.image"
            class="mb-0 rounded-4"
            max-width="200"
            max-height="200"
            width="200"
            height="200"
            cover
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <p class="text-center">{{ formatDate(item.timestamps) }}</p>
        </div>
      </div>
      <p v-else class="text-center py-5 my-5">{{ message }}</p>
    </v-card>
  </v-col>
</template>

<script>
import axios from "axios";
import FormPhotos from "./FormPhotos.vue";

import { bus } from "../../main.js";

export default {
  components: { FormPhotos },
  data() {
    return {
      photos: null,
      message: "",
    };
  },
  created() {
    bus.$on("reload-grid", (data) => {
      this.getPhotos();
    });

    this.URL_GET_PHOTOS = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/clients/photos/`;
  },
  mounted() {
    this.getPhotos();
  },
  methods: {
    async getPhotos() {
      await axios
        .get(this.URL_GET_PHOTOS + localStorage.getItem("user"), {
          headers: { "x-access-token": localStorage.getItem("token") },
        })
        .then((response) => {
          if (response.data.success) {
            this.photos = response.data.rows;
          } else {
            this.message = response.data.message;
          }
        });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
};
</script>

<style>
</style>