<template>
  <div class="text-center">
    <v-tooltip
      right
      color="#E3FFA8"
      :class="navbarDesktopClass"
      v-if="!isMobileScreen"
    >
      <template v-slot:activator="{ on, attrs }">
        <div
          class="cursor-pointer"
          id="div-a"
          v-bind="attrs"
          v-on="on"
          @click="dialog = true"
        >
          <v-icon color="#7B7B7B"> fa-solid fa-exclamation </v-icon>
        </div>
      </template>
      <span class="text-dark">Enviar sugerencias</span>
    </v-tooltip>

    <div
      @click="dialog = true"
      :class="navbarPhoneClass"
      class="d-flex align-items-baseline cursor-pointer"
      v-else
    >
      <div class="d-flex justify-content-center align-items-center" id="div-a">
        <v-icon color="#7B7B7B"> fa-solid fa-exclamation </v-icon>
      </div>
      <h5 style="color: white">Enviar Sugerencias</h5>
    </div>

    <v-dialog v-model="dialog" width="500">
      <v-card color="#000000">
        <v-card-text class="p-4 text-white">
          <v-row>
            <v-col cols="11">
              <h5 class="">Enviar sugerencia</h5>
            </v-col>
            <v-col cols="1" @click="close()">
              <v-icon @click="dialog = false" dark>fa-solid fa-close</v-icon>
            </v-col>
          </v-row>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row>
              <v-col cols="12">
                <p>Descripción</p>
                <v-textarea
                  v-model="suggestion.description"
                  required
                  auto-grow
                  dense
                  dark
                  outlined
                  :rules="rules.descriptionRule"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
          <div class="text-center">
            <button class="btn text-dark bg-green" @click="save()">
              Enviar
            </button>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
  
<script>
import axios from "axios";
export default {
  data() {
    return {
      isMobileScreen: false,

      dialog: false,
      valid: true,
      suggestion: {
        description: "",
      },
      rules: {
        descriptionRule: [(v) => !!v || "La descripción es requerida"],
      },
    };
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  created() {
    this.URL_CREATE = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/suggestions`;
  },
  computed: {
    navbarDesktopClass() {
      return this.isMobileScreen ? "d-none" : "";
    },
    navbarPhoneClass() {
      return this.isMobileScreen ? "" : "d-none";
    },
  },
  methods: {
    handleResize() {
      this.isMobileScreen = window.innerWidth < 991;
    },
    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
    },
    save() {
      if (this.$refs.form.validate()) {
        axios
          .post(this.URL_CREATE, this.suggestion, {
            headers: { "x-access-token": localStorage.getItem("token") },
          })
          .then((response) => {
            if (response.data.success) {
              this.$swal.fire({
                title: "Sugerencia enviada!",
                icon: "success",
                confirmButtonText: "Ok",
                timer: 1500,
              });
              this.dialog = false;
              this.$refs.form.reset();
            } else {
              this.$swal.fire({
                title: "Error!",
                text: "Verifica los campos ingresados",
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
  
  <style>
</style>