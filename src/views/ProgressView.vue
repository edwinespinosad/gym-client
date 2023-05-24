<template>
  <v-row class="p-0 m-0">
    <Photos></Photos>
    <Sizes></Sizes>
  </v-row>
</template>

<script>
import Photos from "../components/Progress/Photos.vue";
import Sizes from "../components/Progress/Sizes.vue";

export default {
  components: { Photos, Sizes },
};
</script>

<style>
</style>