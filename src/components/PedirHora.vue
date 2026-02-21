<template>


  <div class="contenedor card mx-auto mt-5 p-4 shadow rounded bg-white border-0">
    <h2 class="text-center mb-4">Agendar Cita</h2>

    <!-- Mascota -->
    <div class="card ">
      <label>Mascota</label>
      <select v-model="mascotaSeleccionada">
        <option disabled value="">Seleccione mascota</option>
        <option v-for="m in mascotas" :key="m.id" :value="m.id">
          {{ m.nombre }}
        </option>
      </select>
    </div>

    <!-- Fecha y Hora -->
    <div v-show="mascotaSeleccionada">
      <div class="card fila">
        <div>
          <label>Fecha</label>
          <input type="date" :min="hoy" v-model="fecha" />
        </div>

        <div>
          <label>Hora</label>
          <input type="time" v-model="hora" min="08:30" max="21:00" />
        </div>
      </div>

      <!-- Tipo de cita -->
      <div class="card">
        <label>Tipo de cita</label>
        <select v-model="tipoCita">
          <option disabled value="">Seleccione tipo</option>
          <option value="control">Control</option>
          <option value="vacuna">Vacuna</option>
          <option value="esterilizacion">Esterilización</option>
          <option value="chequeos">Chequeos Preventivos</option>
          <option value="especializacion">Especialización</option>
        </select>
        <select v-show="tipoCita === 'especializacion'" v-model="especializacion">
          <option disabled value="">Seleccione especialización</option>
          <option value="dermatologia">Dermatología</option>
          <option value="cardiologia">Cardiología</option>
          <option value="oftalmologia">Oftalmología</option>
          <option value="cirugia">Cirugía</option>
        </select>
      </div>

      <!-- Detalle -->
      <div class="card">
        <label>Detalle</label>
        <textarea v-model="detalle"></textarea>
      </div>

      <button @click="agendar">Agendar</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>

import { auth } from "../../src/assets/utils/firebase";
import { db } from "../../src/assets/utils/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export default {
  name: 'PedirHora',
  data() {
    return {
      mascotas: [],
      mascotaSeleccionada: "",
      fecha: "",
      hoy: new Date().toISOString().split('T')[0],
      hora: "",
      tipoCita: "",
      especializacion: "",
      detalle: "",
      error: ""
    };
  },
  mounted() {
    this.obtenerMascotas();
  },

  methods: {
    async agendar() {
      if (!this.mascotaSeleccionada || !this.fecha || !this.hora || !this.tipoCita) {
        this.error = "Completa todos los campos";
        return;
      }

      try {
        this.error =null;

        const user = auth.currentUser;
        if (!user) return;

        await addDoc(collection(db, "citasRegistradas"),{
          mascotaId: this.mascotaSeleccionada,
          fecha : this.fecha,
          hora: this.hora,
          tipoCita: this.tipoCita,
          especializacion: this.tipoCita === "especializacion" ? this.especializacion : null,
          detalle: this.detalle,
          ownerId: user.uid,
          createdAt: new Date()
        })

        alert("Cita agendada con éxito");
        this.$router.push('/perfil-tutor');

      } catch (error) {
        console.error("Error al agendar la cita:", error);
        this.error = "Hubo un error al agendar la cita. Intenta nuevamente.";
      }
    },


    async obtenerMascotas() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "mascotas"),
          where("ownerId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        this.mascotas = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

      } catch (error) {
        console.error("Error al obtener las mascotas:", error);
      }
    }
  }
}

</script>

<style scoped>
.contenedor {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}

.card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.fila {
  flex-direction: row;
  gap: 15px;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select,
textarea {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}

.error {
  color: red;
  margin-top: 10px;
}

.card {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
</style>


<script setup>
import { ref, computed } from 'vue';

// 1. Obtener la fecha de hoy en formato YYYY-MM-DD
const today = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const selectedDate = ref('');
</script>
