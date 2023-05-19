<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <button v-bind="attrs" v-on="on" class="btn text-dark bg-green">
          Actualiza tus medidas
        </button>
      </template>

      <v-card color="#000000">
        <v-card-text class="p-4 text-white">
          <v-row>
            <v-col cols="11">
              <h5 class="">Actualiza tus medidas</h5>
            </v-col>
            <v-col cols="1" @click="close()">
              <v-icon @click="dialog = false" dark>fa-solid fa-close</v-icon>
            </v-col>
          </v-row>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-row>
              <v-col cols="12">
                <p>Fecha</p>
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="size.date"
                      required
                      dense
                      dark
                      outlined
                      :rules="rules.dateRule"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="size.date"
                    @input="menu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <p>Peso</p>
                <v-text-field
                  v-model="size.weight"
                  required
                  dense
                  dark
                  outlined
                  suffix="kg"
                  :rules="rules.weightRule"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <p>Altura</p>
                <v-text-field
                  v-model="size.height"
                  required
                  dense
                  dark
                  suffix="metros"
                  outlined
                  :rules="rules.heightRule"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <p>Pecho</p>
                <v-text-field
                  v-model="size.chest"
                  required
                  dense
                  dark
                  outlined
                  suffix="cm"
                  :rules="rules.chestRule"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <p>Cintura</p>
                <v-text-field
                  v-model="size.waist"
                  required
                  dense
                  dark
                  outlined
                  suffix="cm"
                  :rules="rules.waistRule"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <p>Muslo</p>
                <v-text-field
                  v-model="size.thigh"
                  required
                  dense
                  dark
                  outlined
                  suffix="cm"
                  :rules="rules.thighRule"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <p>Bicep</p>
                <v-text-field
                  v-model="size.bicep"
                  required
                  dense
                  dark
                  outlined
                  suffix="cm"
                  :rules="rules.bicepRule"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <div class="text-center">
            <button class="btn text-dark bg-green" @click="save()">
              Subir
            </button>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
  
  
<script>
import axios from "axios";
import { bus } from "../../main";
export default {
  data() {
    return {
      dialog: false,
      valid: false,
      menu: false,
      size: {
        fk_id_client: "",
        date: "",
        weight: "",
        height: "",
        chest: "",
        waist: "",
        thigh: "",
        bicep: "",
      },
      rules: {
        dateRule: [(v) => !!v || "Fecha es requerida"],
        weightRule: [
          (v) => !!v || "El peso es requerido",
          (v) => (v && v > 0) || "Peso debe ser mayor a 0",
        ],
        heightRule: [
          (v) => !!v || "La altura es requerida",
          (v) => (v && v > 0) || "Altura debe ser mayor a 0",
        ],
        chestRule: [
          (v) => v === "" || (v && v > 0) || "La medida debe ser mayor a 0",
        ],
        waistRule: [
          (v) => v === "" || (v && v > 0) || "La medida debe ser mayor a 0",
        ],
        thighRule: [
          (v) => v === "" || (v && v > 0) || "La medida debe ser mayor a 0",
        ],
        bicepRule: [
          (v) => v === "" || (v && v > 0) || "La medida debe ser mayor a 0",
        ],
      },
    };
  },
  created() {
    this.URL_CREATE = `${process.env.VITE_API_URL.replace(
      /"/g,
      ""
    )}/api/clients/create-size`;
  },
  methods: {
    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.size = {
        fk_id_client: "",
        date: "",
        weight: "",
        height: "",
        chest: "",
        waist: "",
        thigh: "",
        bicep: "",
      };
    },
    async save() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.size.fk_id_client = localStorage.getItem("user");
        for (let key in this.size) {
          if (this.size.hasOwnProperty(key) && this.size[key] === "") {
            delete this.size[key];
          }
        }
        await axios
          .post(this.URL_CREATE, this.size, {
            headers: { "x-access-token": localStorage.getItem("token") },
          })
          .then((response) => {
            if (response.data.success) {
              this.$swal.fire({
                title: "Medidas agregadas!",
                icon: "success",
                confirmButtonText: "Ok",
                timer: 1500,
              });
              bus.$emit("reload-grid");
              this.dialog = false;
              // this.$refs.form.reset();
            } else {
              if (response.data.height) {
                this.$swal.fire({
                  title: "Error!",
                  text: response.data.message,
                  icon: "error",
                  timer: 2000,
                });
              } else {
                this.$swal.fire({
                  title: "Error!",
                  text: "Verifica los campos ingresados",
                  icon: "error",
                  timer: 2000,
                });
              }
            }
          });
        this.size = {
          fk_id_client: "",
          date: "",
          weight: "",
          height: "",
          chest: "",
          waist: "",
          thigh: "",
          bicep: "",
        };
        // this.dialog = false;
      }
    },
  },
};
</script>
  
  <style>
</style>