<template>
  <div class="boton-eliminar">
    <button @click="eliminarCita(citaId)" class="btn btn-danger w-100">Eliminar Cita</button>
  </div>
</template>

<script>
import { auth, firebaseApp } from '@/assets/utils/firebase';
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../src/assets/utils/firebase";

export default {
  name: "EliminarCita",
  props: {
    citaId: {
      type: String,
      required: true
    }
  },
  methods: {
    async eliminarCita(citaId) {
      try {
        const citaRef = doc(db, "citasRegistradas", citaId);
        await deleteDoc(citaRef);
        console.log("Cita eliminada con éxito");
        alert("Cita eliminada con éxito");
        this.$emit('cita-eliminada', citaId);
      } catch (error) {
        console.error("Error al eliminar la cita:", error);
      }
    }
  }
}
</script>