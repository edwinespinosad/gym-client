<template>
  <div
    class="d-flex justify-content-between align-items-center align-content-center px-5 py-3"
    style="background-color: #0f0f0f"
  >
    <div class="messages">
      <p>{{ message }}</p>
      <h5>Bienvenido de vuelta</h5>
    </div>
    <div class="user d-flex align-content-center align-items-center gap-2">
      <v-icon color="#FFFFFF">fa-regular fa-circle-user</v-icon>
      <h5 class="mt-1">
        {{ user.name }}
        {{ user.last_name }}
      </h5>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: { type: Object, required: true },
  },
  data() {
    return {
      message: "",
      time: new Date(),
    };
  },
  computed: {
    messageText() {
      const hour = this.time.getHours();
      if (hour >= 4 && hour < 12) {
        return "Buenos días!";
      } else if (hour >= 12 && hour < 19) {
        return "Buenas tardes!";
      } else {
        return "Buenas noches!";
      }
    },
  },
  watch: {
    time() {
      this.message = this.messageText;
    },
  },
  created() {
    this.message = this.messageText;
    setInterval(() => {
      this.time = new Date();
    }, 10000);
  },
};
</script>

<style>
</style>