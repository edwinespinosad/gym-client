<template>
  <div class="container-fluid bg-dark text-white">
    <v-row class="vh-100">
      <v-col cols="5" class="m-0 p-0">
        <v-img
          lazy-src="https://picsum.photos/id/11/10/6"
          class="vh-100"
          src="/main.jpg"
        ></v-img>
      </v-col>
      <v-col cols="7" class="py-5 my-5">
        <v-img
          lazy-src="https://picsum.photos/id/11/10/6"
          max-width="80%"
          contain
          class="mx-auto"
          src="/GadGymPerfil.png"
        ></v-img>

        <h1 class="text-center fw-bolder">Bienvenido</h1>
        <v-form ref="form" lazy-validation v-model="valid">
          <v-card-text>
            <v-row>
              <v-col cols="6" offset="3">
                <p>Correo Electrónico</p>
                <v-text-field
                  v-model="user.email"
                  required
                  dense
                  dark
                  outlined
                  :rules="rules.emailRule"
                ></v-text-field>
              </v-col>
              <v-col cols="6" offset="3">
                <p>Contraseña</p>
                <v-text-field
                  v-model="user.password"
                  type="password"
                  dense
                  dark
                  outlined
                  :rules="rules.passwordRule"
                ></v-text-field>
              </v-col>

              <v-col
                cols="12"
                class="d-flex justify-content-center align-items-center"
              >
                <v-btn class="text-dark" color="#e3ffa8" @click="signIn()">
                  Iniciar Sesión
                </v-btn>
              </v-col>

              <v-col cols="12">
                <v-divider inset dark style="opacity: 1 !important"></v-divider>
              </v-col>
              <v-col
                cols="12"
                class="d-flex justify-content-center align-items-center"
              >
                <SignUp></SignUp>
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";

import SignUp from "./SignUp.vue";

export default {
  name: "Login",
  components: { SignUp },
  data() {
    return {
      user: {
        email: "",
        password: "",
        type: 2,
      },
      valid: false,
      rules: {
        emailRule: [(v) => !!v || "El correo es requerido"],
        passwordRule: [(v) => !!v || "La contraseña es requerida"],
      },
    };
  },
  created() {
    this.URL_CREATE = `${process.env.VITE_API_URL.replace(/"/g, "")}/api/login`;
    this.URL_VALID = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/is-logged`;
  },
  methods: {
    signIn() {
      if (this.$refs.form.validate()) {
        axios.post(this.URL_CREATE, this.user).then((response) => {
          if (response.data.success) {
            this.$swal.fire({
              title: "Inicio de sesion correcto!",
              icon: "success",
              confirmButtonText: "Ok",
              timer: 1500,
            });
            let token = response.data.token;
            let user = response.data.user;
            localStorage.setItem("token", token);
            localStorage.setItem("user", user);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            this.$swal.fire({
              title: "Lo sentimos!",
              text: response.data.message,
              icon: "error",
              timer: 2000,
            });
          }
        });
      }
    },
  },
};
</script>
