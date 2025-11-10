<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const { isAdmin, isAuthenticated, currentUser } = storeToRefs(authStore)

function handleLogout() {
  authStore.logout()
}
</script>

<template>
  <div id="app" class="min-vh-100 d-flex flex-column bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <RouterLink class="navbar-brand fw-semibold text-uppercase" to="/">
          Натали
          <small class="d-block text-muted fw-normal text-lowercase">
            салон красоты, Ростов-на-Дону
          </small>
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNavbar">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-2">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">Главная</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/services">Услуги</RouterLink>
            </li>
            <li v-if="isAuthenticated && !isAdmin" class="nav-item">
              <RouterLink class="nav-link" to="/my-bookings">Мои записи</RouterLink>
            </li>
            <li v-if="isAdmin" class="nav-item">
              <RouterLink class="nav-link" to="/admin">Панель администратора</RouterLink>
            </li>
            <li v-if="!isAuthenticated" class="nav-item">
              <RouterLink class="nav-link" to="/login">Вход</RouterLink>
            </li>
            <li v-if="!isAuthenticated" class="nav-item">
              <RouterLink class="nav-link" to="/register">Регистрация</RouterLink>
            </li>
            <li
              v-if="isAuthenticated"
              class="nav-item dropdown"
            >
              <button
                class="nav-link dropdown-toggle bg-transparent border-0"
                id="userMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                type="button"
              >
                {{ currentUser?.fullName || 'Пользователь' }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                <li>
                  <button class="dropdown-item" type="button" @click="handleLogout">
                    Выйти
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="flex-fill py-4">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <footer class="bg-dark text-light py-3 mt-auto">
      <div
        class="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2"
      >
        <span class="small">© 2025 Салон красоты «Натали», Ростов-на-Дону</span>
        <span class="small text-muted">
          Информационная система-конструктор учёта записей на предоставление услуг
        </span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
#app {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #212529;
}

.navbar-brand small {
  font-size: 0.6rem;
}

.nav-link.active,
.nav-link.router-link-active {
  font-weight: 600;
}
</style>
