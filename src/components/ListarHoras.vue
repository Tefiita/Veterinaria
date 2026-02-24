<template>
  <div class="listar-horas">
    <div v-if="citas.length === 0">
      <h2 class="mx-3 mb-3">Próximas Citas</h2>
      <p>No hay citas disponibles.</p>
    </div>

    <ul v-else>
      <h2 class="mx-3 mb-3">Próximas Citas</h2>
      <div class="cards-container">
        <div v-for="cita in citas" :key="cita.id">
          <div class="card card-lista mb-3 p-3 shadow rounded bg-white border-0 ">
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <h4><strong>Información Paciente</strong></h4>
                <p class="info"><strong>Mascota:</strong> {{mascotas.find(mascota => mascota.id ===
                  cita.mascotaId)?.nombre.charAt(0).toUpperCase() + mascotas.find(mascota => mascota.id ===
                    cita.mascotaId)?.nombre.slice(1) || 'Desconocida'}}</p>
                <p class="info"><strong>Especie:</strong> {{mascotas.find(mascota => mascota.id ===
                  cita.mascotaId)?.especie.charAt(0).toUpperCase() + mascotas.find(mascota => mascota.id ===
                    cita.mascotaId)?.especie.slice(1) || 'Desconocida'}}</p>
                <p class="info"><strong>Sexo:</strong> {{mascotas.find(mascota => mascota.id === cita.mascotaId)?.sexo
                  ||
                  'Desconocido'}}</p>
                <p class="info"><strong>Tutor:</strong> {{usuarios.find(usuario => usuario.id ===
                  cita.ownerId)?.nombre.charAt(0).toUpperCase() + usuarios.find(usuario => usuario.id ===
                    cita.ownerId)?.nombre.slice(1) || 'Desconocido'}}
                </p>
              </li>
              <li class="list-group-item">
                <h4><strong>Información Cita</strong></h4>
                <p class="info"><strong>Fecha de la cita:</strong> {{ cita.fecha }}</p>
                <p class="info"><strong>Hora de la cita:</strong> {{ cita.hora }}</p>
                <p class="info"><strong>Tipo de cita:</strong> {{ cita.tipoCita.charAt(0).toUpperCase() +cita.tipoCita.slice(1) }}</p>
                <p class="info"><strong>Detalle:</strong> {{ cita.detalle ? cita.detalle.charAt(0).toUpperCase() + cita.detalle.slice(1) : 'Sin detalle' }}</p>
                <p v-show="cita.especialista" class="info"><strong>Especialista:</strong> {{ cita.especialista }}</p>
              </li>
            </ul>

            <EliminarCita :citaId="cita.id" @cita-eliminada="onCitaEliminada" />
          </div>

        </div>
      </div>
    </ul>
  </div>

</template>

<script>
import { auth } from "../../src/assets/utils/firebase";
import { db } from "../../src/assets/utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import EliminarCita from "./EliminarCita.vue";
export default {
  name: "ListarHoras",
  components: {
    EliminarCita
  },

  data() {
    return {
      citas: [],
      mascotas: [],
      usuarios: []
    }
  },

  mounted() {
    this.obtenerCitas();
    this.obtenerMascotas();
    this.obtenerTutor();
    this.listenCitas();
  },

  methods: {
    async obtenerCitas() {
      try {
        // Obtener fechas de hoy y mañana en formato YYYY-MM-DD
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        const fechaHoy = `${yyyy}-${mm}-${dd}`;

        const manana = new Date(hoy);
        manana.setDate(hoy.getDate() + 1);
        const yyyyM = manana.getFullYear();
        const mmM = String(manana.getMonth() + 1).padStart(2, '0');
        const ddM = String(manana.getDate()).padStart(2, '0');
        const fechaManana = `${yyyyM}-${mmM}-${ddM}`;

        const user = auth.currentUser;
        if (!user) return;

        // Consultar todas las citas para hoy o mañana
        const citasRef = collection(db, "citasRegistradas");
        const queryCitas = query(
          citasRef,
          where("fecha", "in", [fechaHoy, fechaManana])
        );
        const snapshot = await getDocs(queryCitas);
        this.citas = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

      } catch (error) {
        console.error("Error al obtener citas: ", error);
      }
    },

    async obtenerMascotas() {
      const snapshot = await getDocs(collection(db, "mascotas"));
      this.mascotas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },

    async obtenerTutor() {
      const snapshot = await getDocs(collection(db, "users"));
      this.usuarios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },

    listenCitas() {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, '0');
      const dd = String(hoy.getDate()).padStart(2, '0');
      const fechaHoy = `${yyyy}-${mm}-${dd}`;

      const manana = new Date(hoy);
      manana.setDate(hoy.getDate() + 1);
      const yyyyM = manana.getFullYear();
      const mmM = String(manana.getMonth() + 1).padStart(2, '0');
      const ddM = String(manana.getDate()).padStart(2, '0');
      const fechaManana = `${yyyyM}-${mmM}-${ddM}`;

      const citasRef = collection(db, "citasRegistradas");
      const queryCitas = query(citasRef, where("fecha", "in", [fechaHoy, fechaManana]));

      onSnapshot(queryCitas, (snapshot) => {
        this.citas = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      })
    },

    onCitaEliminada(citaId) {
      if (Array.isArray(this.citas)) {
        this.citas = this.citas.filter(cita => cita.id !== citaId);
      }
    }
  }

}

</script>

<style>
.card {
  margin-left: 50px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  /* Espacio entre cards */
  justify-content: center;
}

.cards-container>div {
  flex: 1 1 300px;
  max-width: 400px;
}

.card-lista {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card-lista:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.card-lista {
  padding: 24px;
  margin-bottom: 24px;
}
.cards-container {
  gap: 24px;
}

.card-lista h4 {
  color: #15803d;
  margin-bottom: 12px;
}
.card-lista p {
  margin-bottom: 8px;
  color: #444;
}

.listar-horas {
  background: #f7fafd;
  padding: 32px 0;
  min-height: 100vh;
}

.info {
  margin-bottom: 5px;
  margin-left: 5px;
}
</style>