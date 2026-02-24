<template>
  <div class="contenedor card mx-auto mt-5 p-4 rounded bg-white border-0">
    <div class="card mx-auto mt-5 p-4 shadow rounded bg-white border-0 text-center w-50">
      <h2 class="text-center mb-4 fw-bold text-uppercase">Registrar Mascota</h2>

      <input class="form-control mb-3" v-model="nombre" placeholder="Nombre de mascota" />
      <select class="form-select mb-3" v-model="especie">
        <option disabled value="">Seleccione especie</option>
        <option value="perro">Perro</option>
        <option value="gato">Gato</option>
        <option value="otro">Otro</option>
      </select>
      <input class="form-control mb-3" v-show="especie === 'otro'" v-model="especiePersonalizada"
        placeholder="Ingrese especie" />

      <select class="form-select mb-3" v-model="sexo">
        <option disabled value="">Seleccione sexo</option>
        <option value="macho">Macho</option>
        <option value="hembra">Hembra</option>
      </select>

      <select class="form-select mb-3" v-show="especie !== 'gato' && especie !== 'otro'" v-model="raza">
        <option disabled value="">Seleccione raza</option>
        <option value="beagle">Beagle</option>
        <option value="bulldog">Bulldog</option>
        <option value="chihuahua">Chihuahua</option>
        <option value="golden_retriever">Golden Retriever</option>
        <option value="labrador">Labrador Retriever</option>
        <option value="pastor_aleman">Pastor Alemán</option>
        <option value="poodle">Poodle</option>
        <option value="pug">Pug</option>
        <option value="rottweiler">Rottweiler</option>
        <option value="mestizo_perro">Mestizo</option>
      </select>

      <input class="form-control mb-3" v-model="color" type="text" placeholder="Color">
      <label class="form-label">Fecha de nacimiento / Fecha de Cumpleaños</label>
      <input class="form-control mb-3" v-model="fechaNacimiento" type="date" />
      <div>
        <button class="btn btn-primary w-100" @click="registrarMascota">
          Guardar Mascota
        </button>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { auth } from '../../src/assets/utils/firebase';
import { db } from '../../src/assets/utils/firebase';
import { collection, addDoc } from 'firebase/firestore';
export default {
  name: 'RegistrarMascota',

  data() {
    return {
      nombre: '',
      especie: '',
      raza: '',
      sexo: '',
      fechaNacimiento: '',
      color: '',
      especiePersonalizada: '',
      error: null
    };
  },

  methods: {
    async registrarMascota() {
      if (
        !this.nombre ||
        !this.especie ||
        (this.especie === "otro" && !this.especiePersonalizada) ||
        (this.especie !== "gato" && !this.raza) ||
        !this.sexo ||
        !this.fechaNacimiento
      ) {
        this.error = "Por favor, completa los campos requeridos";
        return;
      }
      try {
        this.error = null;

        const user = auth.currentUser;

        if (!user) {
          this.error = 'Usuario no autenticado. Por favor, inicia sesión.';
          return;
        }

        await addDoc(collection(db, 'mascotas'), {
          nombre: this.nombre,
          especie: this.especie === 'otro' ? this.especiePersonalizada : this.especie,
          raza: this.raza,
          fechaNacimiento: this.fechaNacimiento,
          sexo: this.sexo,
          ownerId: user.uid,
          color: this.color,
          createdAt: new Date()
        });

        alert('Mascota registrada exitosamente');

        this.$router.push('/pedir-hora');

      } catch (error) {
        this.error = 'Error al registrar la mascota: ' + error.message;
      }
    }
  }
}
</script>