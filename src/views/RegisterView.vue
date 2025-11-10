<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { User, Mail, Lock } from 'lucide-vue-next'

const fullName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()
const authStore = useAuthStore()

function handleRegister() {
  error.value = ''

  if (!fullName.value.trim()) {
    error.value = 'Введите ФИО.'
    return
  }

  if (!email.value.trim()) {
    error.value = 'Введите e-mail.'
    return
  }

  if (password.value.length < 4) {
    error.value = 'Пароль должен содержать не менее 4 символов.'
    return
  }

  try {
    authStore.register({
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(),
    })
    router.push('/')
  } catch (e) {
    error.value = e.message || 'Ошибка регистрации'
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-4 p-md-5">
          <h1 class="h4 fw-semibold mb-1 text-center">Регистрация</h1>
          <p class="text-muted text-center small mb-4">
            Создайте аккаунт пользователя для онлайн-записи в салон «Натали».
          </p>

          <form @submit.prevent="handleRegister" class="d-flex flex-column gap-3">
            <div>
              <label class="form-label small fw-semibold">ФИО</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">
                  <User size="16" />
                </span>
                <input
                  v-model="fullName"
                  type="text"
                  required
                  class="form-control border-start-0"
                  placeholder="Иванова Мария Петровна"
                />
              </div>
            </div>

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
                  placeholder="Минимум 4 символа"
                />
              </div>
            </div>

            <button type="submit" class="btn btn-dark w-100 mt-2">
              Зарегистрироваться
            </button>
          </form>

          <p v-if="error" class="text-danger small mt-3 mb-0 text-center">
            {{ error }}
          </p>

          <p class="small mt-3 mb-0 text-center text-muted">
            Уже есть аккаунт?
            <router-link to="/login">Войти</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>