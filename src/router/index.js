import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';
import ServicesView from '../views/ServicesView.vue';
import AdminView from '../views/AdminView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import MyBookingsView from '../views/MyBookingsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/services', name: 'services', component: ServicesView },
    { path: '/my-bookings', name: 'my-bookings', component: MyBookingsView },
    { path: '/admin', name: 'admin', component: AdminView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
  ],
});

export default router;
