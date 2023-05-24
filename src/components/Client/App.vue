<template>
  <v-app class="">
    <v-row v-if="logged" style="background-color: #000000">
      <Navbar :class="navbarDesktopClass"></Navbar>
      <!-- <NavbarPhone :class="navbarPhoneClass"></NavbarPhone> -->
      <v-col
        class="text-white"
        cols="12"
        lg="11"
        xl="11"
        style="background-color: #000000"
      >
        <div class="d-flex flex-column">
          <NavbarSuperior :user="user"></NavbarSuperior>
          <v-main style="background-color: #000000" class="container mt-5">
            <h5>{{ this.$route.meta.name }}</h5>
            <router-view class="container" />
          </v-main>
        </div>
      </v-col>
    </v-row>

    <div v-else class="row m-0 p-0">
      <Login></Login>
    </div>
  </v-app>
</template>

<script>
import Navbar from "../commons/Navbar.vue";
import NavbarPhone from "../commons/NavbarPhone.vue";
import NavbarSuperior from "../commons/NavbarSuperior.vue";
import Login from "./Login.vue";
import axios from "axios";
export default {
  name: "App",
  components: { Navbar, NavbarSuperior, Login, NavbarPhone },
  data: () => ({
    logged: false,
    user: {},
    isMobileScreen: false,
  }),
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
  },
  computed: {
    navbarDesktopClass() {
      return this.isMobileScreen ? "d-none" : "";
    },
    navbarPhoneClass() {
      return this.isMobileScreen ? "" : "d-none";
    },
  },
  created() {
    this.URL_VALID = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/is-logged`;

    let token = { token: localStorage.getItem("token") };

    axios.post(this.URL_VALID, token).then((response) => {
      if (response.data.success) {
        this.logged = true;
        axios
          .get(
            `${process.env.VITE_API_URL.replace(/"/g, "")}/api/clients/` +
              localStorage.getItem("user"),
            {
              headers: { "x-access-token": localStorage.getItem("token") },
            }
          )
          .then((response) => {
            this.user = response.data;
          });
      } else {
        this.logged = false;
      }
    });
  },
};
</script>
