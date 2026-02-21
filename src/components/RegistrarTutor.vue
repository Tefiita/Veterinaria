<template>
  <div class="contenedor card mx-auto mt-5 p-4 rounded bg-white border-0">
    <div class="card mx-auto mt-5 p-4 shadow rounded bg-white border-0 text-center w-50">
      <h2 class="text-center mb-4 fw-bold text-uppercase">Registro Tutor</h2>

      <input class="form-control mb-3" v-model="nombre" placeholder="Nombre completo" />
      <input class="form-control mb-3" v-model="email" type="email" placeholder="Correo" />
      <input class="form-control mb-3" v-model="password" type="password" placeholder="Contraseña" />
      <input class="form-control mb-3" v-model="telefono" type="text" placeholder="Teléfono" />

      <button class="btn btn-primary w-100" @click="register">
        Registrarse
      </button>

      <p class="mt-3 text-center mb-0 text-muted small text-decoration-none text-dark fw-bold">
          <RouterLink to="/">¿Tienes cuenta? Inicia sesión</RouterLink>
        </p>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../src/assets/utils/firebase';
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from '../../src/assets/utils/firebase';

export default {
  name: "RegistrarTutor",

  data() {
    return {
      nombre: "",
      email: "",
      password: "",
      telefono: "",
      error: null
    };
  },

  methods: {
    async register() {
      try {
        this.error = null;

        //  Crear usuario en Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );

        const user = userCredential.user;

        // Crear documento en Firestore
        await setDoc(doc(db, "users", user.uid), {
          nombre: this.nombre,
          email: this.email,
          telefono: this.telefono,
          rol: false, // Por defecto, no es admin
          createdAt: new Date()
        });

        // Redirigir
        setTimeout(() => {
          alert("Registro exitoso. Redirigiendo al login...");
          this.$router.push("/");
        }, 1000);


      } catch (err) {
        this.error = err.message;
        console.error(err);
      }
    }
  }
};
</script>
