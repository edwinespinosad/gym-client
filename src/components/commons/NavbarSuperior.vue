<template>
  <div
    class="d-flex justify-content-between align-items-center align-content-center px-5 py-3"
    style="background-color: #0f0f0f"
  >
    <NavbarPhone
      v-if="isMobileScreen"
      @collapsed="handleCollapse"
    ></NavbarPhone>

    <div class="messages" v-if="dismiss">
      <p>{{ message }}</p>
      <h5>Bienvenido de vuelta</h5>
    </div>
    <div
      class="user d-flex align-content-center align-items-center gap-2"
      v-if="dismiss"
    >
      <v-icon color="#FFFFFF" v-if="user.image === null"
        >fa-regular fa-circle-user</v-icon
      >
      <v-img
        v-else
        :src="user.image"
        class="rounded-circle"
        width="60"
        aspect-ratio="1"
      ></v-img>

      <h5 class="mt-1">
        {{ user.name }}
        {{ user.last_name }}
      </h5>
    </div>
  </div>
</template>

<script>
import NavbarPhone from "./NavbarPhone.vue";
export default {
  components: { NavbarPhone },
  props: {
    user: { type: Object, required: true },
  },
  data() {
    return {
      collapsedState: false,
      dismiss: true,
      message: "",
      time: new Date(),
      isMobileScreen: false,
    };
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.isMobileScreen = window.innerWidth < 991;
    },
    handleCollapse(isCollapsed) {
      this.collapsedState = isCollapsed;
      if (isCollapsed) {
        this.dismiss = false;
      } else {
        this.dismiss = true;
      }
    },
  },
  computed: {
    navbarPhoneClass() {
      return this.isMobileScreen ? "" : "d-none";
    },
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