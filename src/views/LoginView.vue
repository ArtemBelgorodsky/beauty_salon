<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Lock, Mail } from 'lucide-vue-next'

const email = ref('admin@nataly.local')
const password = ref('admin123')
const error = ref('')

const router = useRouter()
const authStore = useAuthStore()

function handleLogin() {
  error.value = ''
  try {
    authStore.login(email.value.trim(), password.value.trim())
    router.push('/')
  } catch (e) {
    error.value = e.message || 'Ошибка авторизации'
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-4 p-md-5">
          <h1 class="h4 fw-semibold mb-1 text-center">Вход в систему</h1>
          <p class="text-muted text-center small mb-4">
            Для примера используйте администратора:
            <span class="d-block">admin@nataly.local / admin123</span>
          </p>

          <form @submit.prevent="handleLogin" class="d-flex flex-column gap-3">
            <div>
              <label class="form-label small fw-semibold">E-mail</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">
                  <Mail size="16" />
                </span>
                <input
                  v-model="email"
                  type="email"
                  required
                  class="form-control border-start-0"
                  placeholder="example@mail.ru"
                />
              </div>
            </div>

            <div>
              <label class="form-label small fw-semibold">Пароль</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">
                  <Lock size="16" />
                </span>
                <input
                  v-model="password"
                  type="password"
                  required
                  class="form-control border-start-0"
                  placeholder="Введите пароль"
                />
              </div>
            </div>

            <button type="submit" class="btn btn-dark w-100 mt-2">
              Войти
            </button>
          </form>

          <p v-if="error" class="text-danger small mt-3 mb-0 text-center">
            {{ error }}
          </p>

          <p class="small mt-3 mb-0 text-center text-muted">
            Нет аккаунта?
            <router-link to="/register">Зарегистрироваться</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>