<template>
  <div
    class="text-white position-fixe"
    style="background-color: #0f0f0f; z-index: 1; top: 0; right: 0"
  >
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        id="btn-navbar"
        :class="{ collapsed: isCollapsed }"
        @click="toggleCollapse"
      >
        <v-icon color="white"> fa-solid fa-bars </v-icon>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div
          class="text-white d-flex flex-column align-items-start ml-5 mt-2 gap-4"
        >
          <div
            class="d-flex align-items-center gap-1"
            v-for="(link, index) in links"
            :key="index"
            @click="closeNav"
          >
            <router-link :to="{ name: link.name }" class="router">
              <div class="d-flex align-items-baseline router-text">
                <div
                  class="d-flex justify-content-center align-items-center"
                  id="div-a"
                >
                  <v-icon color="#7B7B7B">
                    {{ link.icon }}
                  </v-icon>
                </div>
                <h5 style="color: white" class="ml-2">{{ link.title }}</h5>
              </div>
            </router-link>
          </div>

          <FormSuggestion></FormSuggestion>

          <div
            class="d-flex justify-content-center align-items-center cursor-pointer ml-2"
            id="div-a"
            @click="logout()"
          >
            <v-icon color="#FFFFFF"> fa-solid fa-right-from-bracket </v-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormSuggestion from "../Suggestion/FormSuggestion.vue";

export default {
  components: { FormSuggestion },
  data: () => {
    return {
      isCollapsed: false,
      links: [
        {
          name: "home",
          title: "Inicio",
          icon: "fa-solid fa-home",
        },
        {
          name: "progress",
          title: "Mi Progreso",
          icon: "fa-solid fa-bars-progress",
        },
        {
          name: "meals",
          title: "Comidas",
          icon: "fa-solid fa-bowl-rice",
        },
      ],
    };
  },
  methods: {
    closeNav() {
      const btn = document.getElementById("btn-navbar");

      btn.addEventListener("click", function () {});

      btn.click();
    },
    async redirect() {
      try {
        await this.$router.push("/");
        window.location.reload();
      } catch (err) {
        if (err.name !== "NavigationDuplicated") {
          throw err;
        } else {
          window.location.reload();
        }
      }
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      this.$emit("collapsed", this.isCollapsed);
    },

    logout() {
      this.$swal
        .fire({
          icon: "warning",
          title: "¿Deseas cerrar sesion?",
          showCancelButton: true,
          confirmButtonText: "Cerrar",
          cancelButtonText: `Cancelar`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            localStorage.clear();
            if (this.$route.path !== "/") {
              this.redirect();
            } else {
              window.location.reload();
            }
          }
        });
    },
  },
};
</script>

<style>
</style>