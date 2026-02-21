import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegistrarMascotaView from '../views/RegistrarMascotaView.vue'
import RegistrarTutorView from '../views/RegistrarTutorView.vue'
import PerfilTutorView from '../views/PerfilTutorView.vue'
import PedirHoraView from '../views/PedirHoraView.vue'
import PerfilVeterinarioView from '../views/PerfilVeterinarioView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/registrar-mascota',
      name: 'registrar-mascota',
      component: RegistrarMascotaView,
    },
    {
      path: '/registrar-tutor',
      name: 'registrar-tutor',
      component: RegistrarTutorView,
    },
    {
      path: '/perfil-tutor',
      name: 'perfil-tutor',
      component: PerfilTutorView,
    },
    {
      path: '/pedir-hora',
      name: 'pedir-hora',
      component: PedirHoraView,
    },
    {
      path: '/veterinario',
      name: 'veterinario',
      component: PerfilVeterinarioView,
    },
  ],
})

export default router
