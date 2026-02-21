<template>
  <div class="contenedor">
    <div class="card mx-auto mt-5 p-4 shadow rounded bg-white border-0 text-center w-50">
      <div v-if="nombre" class="h4 mb-4 fw-bold text-uppercase">
        Bienvenido/a {{ nombre }}
      </div>
      <div class="text-center mt-3">
        <button class="btn btn-primary me-2" @click="$router.push('/registrar-mascota')">Registrar Mascota</button>
        <button class="btn btn-primary" @click="$router.push('/pedir-hora')">Pedir Hora</button>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "../../src/assets/utils/firebase";
import { db } from "../../src/assets/utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export default {
  name: "PerfilTutor",

  data() {
    return {
      nombre: ""
    };
  },

  async mounted() {
    await this.obtenerNombre();
  },

  methods: {
    async obtenerNombre() {
      try {
        const user = auth.currentUser;

        if (!user) return;

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          this.nombre = userDoc.data().nombre;
        }

      } catch (error) {
        console.error("Error al obtener el nombre del tutor:", error);
      }
    }
  }
};
</script>