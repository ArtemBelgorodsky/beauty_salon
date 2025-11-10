<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useServicesStore } from '../stores/services'
import { useAuthStore } from '../stores/auth'
import { CalendarDays, Clock3, User, CheckCircle, Sparkles, X } from 'lucide-vue-next'

const servicesStore = useServicesStore()
const authStore = useAuthStore()
const router = useRouter()

const selectedServiceId = ref(null)
const selectedSlotId = ref(null)
const bookingError = ref('')
const bookingSuccess = ref('')
const showSuccessModal = ref(false)
const completedBooking = ref(null)

const selectedService = computed(() =>
  servicesStore.services.find((s) => s.id === selectedServiceId.value)
)

const availableSlots = computed(() =>
  selectedService.value
    ? selectedService.value.slots.filter((s) => !s.isBooked)
    : []
)

function formatDateRu(dateStr) {
  if (!dateStr) return ''
  // если уже в формате "11 ноября 2025" — возвращаем как есть
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  const [year, month, day] = dateStr.split('-').map(Number)
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ]
  return `${day} ${months[month - 1]} ${year}`
}

function openBooking(serviceId) {
  bookingError.value = ''
  bookingSuccess.value = ''
  selectedSlotId.value = null
  selectedServiceId.value = serviceId
}

function confirmBooking() {
  bookingError.value = ''
  bookingSuccess.value = ''

  if (!authStore.isAuthenticated) {
    bookingError.value = 'Для записи необходимо авторизоваться.'
    router.push('/login')
    return
  }

  if (!selectedServiceId.value || !selectedSlotId.value) {
    bookingError.value = 'Выберите услугу и время для записи.'
    return
  }

  const ok = servicesStore.bookSlot({
    serviceId: selectedServiceId.value,
    slotId: selectedSlotId.value,
    clientId: authStore.currentUser.id,
    clientName: authStore.currentUser.fullName,
  })

  if (!ok) {
    bookingError.value = 'Не удалось записаться на выбранное время. Попробуйте другое.'
    return
  }

  // Сохраняем данные о записи для модального окна
  const selectedService = servicesStore.services.find(s => s.id === selectedServiceId.value)
  const selectedSlot = selectedService?.slots.find(s => s.id === selectedSlotId.value)
  
  completedBooking.value = {
    serviceTitle: selectedService?.title || '',
    master: selectedService?.master || '',
    date: formatDateRu(selectedSlot?.date || ''),
    time: selectedSlot?.time || '',
    price: selectedService?.price || 0
  }

  selectedSlotId.value = null
  selectedServiceId.value = null
  showSuccessModal.value = true
  

  setTimeout(() => {
    showSuccessModal.value = false
  }, 5000)
}

function closeSuccessModal() {
  showSuccessModal.value = false
}

function goToMyBookings() {
  closeSuccessModal()
  router.push('/my-bookings')
}
</script>

<template>
  <div class="services-page">
    <div class="d-flex justify-content-between align-items-end gap-3 mb-4">
      <div>
        <h1 class="h3 fw-semibold mb-1">Онлайн-запись в салон «Натали»</h1>
        <p class="text-muted mb-0 small">
          Выберите услугу и удобное время. Для подтверждения записи потребуется авторизация.
        </p>
      </div>
    </div>

    <div class="row g-3">
      <div
        v-for="service in servicesStore.services"
        :key="service.id"
        class="col-md-4"
      >
        <div class="card h-100 border-0 shadow-sm service-card">
          <div class="card-body d-flex flex-column">
            <h2 class="h5 fw-semibold mb-1">{{ service.title }}</h2>
            <div class="d-flex align-items-center gap-2 mb-2">
              <div class="master-avatar">
                <img
                  v-if="service.masterAvatar"
                  :src="service.masterAvatar"
                  :alt="`Мастер ${service.master}`"
                />
                <span v-else>
                  {{ service.master.charAt(0) }}
                </span>
              </div>
              <div class="small text-muted">
                Мастер: <span class="fw-semibold">{{ service.master }}</span>
              </div>
            </div>
            <p class="small flex-grow-1">{{ service.description }}</p>

            <div class="d-flex flex-wrap gap-2 small text-muted mb-3">
              <span class="d-inline-flex align-items-center gap-1">
                <Clock3 size="16" /> {{ service.duration }} мин
              </span>
              <span class="d-inline-flex align-items-center gap-1">
                <Ruble size="16" /> от {{ service.price }} ₽
              </span>
            </div>

            <div class="small mb-2">
              <strong>Доступные слоты:</strong>
              <span v-if="service.slots.filter(s => !s.isBooked).length === 0" class="text-danger ms-1">
                нет свободных дат
              </span>
              <div v-else class="mt-1 d-flex flex-wrap gap-1">
                <span
                  v-for="slot in service.slots.filter(s => !s.isBooked)"
                  :key="slot.id"
                  class="badge bg-light text-dark border d-inline-flex align-items-center gap-1"
                >
                  <CalendarDays size="14" /> {{ formatDateRu(slot.date) }} {{ slot.time }}
                </span>
              </div>
            </div>

            <button
              class="btn btn-sm btn-outline-primary mt-auto"
              type="button"
              :disabled="service.slots.filter(s => !s.isBooked).length === 0"
              @click="openBooking(service.id)"
            >
              Выбрать время
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="selectedService"
      class="booking-panel mt-4 p-3 rounded-4 border bg-white shadow-sm"
    >
      <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
        <div>
          <h2 class="h5 fw-semibold mb-1">Запись на услугу: {{ selectedService.title }}</h2>
          <p class="small text-muted mb-0">
            Выберите доступное окно и подтвердите запись.
          </p>
        </div>
        <div class="small text-muted">
          <User size="16" class="me-1" />
          {{ authStore.isAuthenticated ? authStore.currentUser.fullName : 'Гость (не авторизован)' }}
        </div>
      </div>

      <div class="d-flex flex-wrap gap-2 mb-3">
        <button
          v-for="slot in availableSlots"
          :key="slot.id"
          class="btn btn-sm"
          :class="[
            'btn-outline-primary',
            { active: selectedSlotId === slot.id },
          ]"
          type="button"
          @click="selectedSlotId = slot.id"
        >
          {{ formatDateRu(slot.date) }} {{ slot.time }}
        </button>
      </div>

      <div class="d-flex flex-wrap gap-2 align-items-center">
        <button
          class="btn btn-primary btn-sm"
          type="button"
          @click="confirmBooking"
        >
          Подтвердить запись
        </button>
        <button
          class="btn btn-outline-secondary btn-sm"
          type="button"
          @click="selectedServiceId = null; selectedSlotId = null; bookingError = ''; bookingSuccess = ''"
        >
          Отмена
        </button>
      </div>

      <p v-if="bookingError" class="text-danger small mt-2">{{ bookingError }}</p>
      <p v-if="bookingSuccess" class="text-success small mt-2">{{ bookingSuccess }}</p>
    </div>

    <!-- Модальное окно успешной записи -->
    <div
      v-if="showSuccessModal"
      class="success-modal-overlay"
      @click="closeSuccessModal"
    >
      <div
        class="success-modal"
        @click.stop
      >
        <button
          class="modal-close"
          @click="closeSuccessModal"
        >
          <X size="20" />
        </button>
        
        <div class="success-animation">
          <div class="success-circle">
            <CheckCircle size="48" class="success-icon" />
          </div>
          <div class="sparkles">
            <Sparkles
              v-for="i in 6"
              :key="i"
              :size="16"
              class="sparkle"
              :style="{ '--delay': `${i * 0.2}s` }"
            />
          </div>
        </div>

        <h3 class="success-title">Запись подтверждена!</h3>
        <p class="success-subtitle">Вы успешно записаны на услугу</p>

        <div v-if="completedBooking" class="booking-details">
          <div class="detail-item">
            <strong>{{ completedBooking.serviceTitle }}</strong>
          </div>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Мастер:</span>
              <span class="detail-value">{{ completedBooking.master }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Дата:</span>
              <span class="detail-value">{{ completedBooking.date }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Время:</span>
              <span class="detail-value">{{ completedBooking.time }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Стоимость:</span>
              <span class="detail-value">{{ completedBooking.price }} ₽</span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button
            class="btn btn-primary"
            @click="goToMyBookings"
          >
            Мои записи
          </button>
          <button
            class="btn btn-outline-secondary"
            @click="closeSuccessModal"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.services-page {
  min-height: 60vh;
}

.service-card {
  border-radius: 1.1rem;
  transition: all 0.18s ease;
}

.service-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.19);
}

/* Аватар мастера на карточках услуг */
.master-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 0%, #ffe9f3, #b0276c);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(176, 39, 108, 0.35);
  overflow: hidden;
}

.master-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Стили для модального окна успешной записи */
.success-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

.success-modal {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: slideInScale 0.4s ease-out;
  text-align: center;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f8f9fa;
  color: #495057;
}

.success-animation {
  position: relative;
  margin-bottom: 1.5rem;
}

.success-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #28a745, #20c997);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  animation: successPulse 0.6s ease-out;
}

.success-icon {
  color: white;
  animation: checkmarkDraw 0.8s ease-out;
}

.sparkles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sparkle {
  position: absolute;
  color: #ffd700;
  animation: sparkleFloat 2s ease-in-out infinite;
  animation-delay: var(--delay);
}

.sparkle:nth-child(1) { top: -30px; left: -15px; }
.sparkle:nth-child(2) { top: -20px; right: -20px; }
.sparkle:nth-child(3) { bottom: -25px; left: -10px; }
.sparkle:nth-child(4) { bottom: -15px; right: -15px; }
.sparkle:nth-child(5) { top: 5px; left: -35px; }
.sparkle:nth-child(6) { top: 5px; right: -35px; }

.success-title {
  color: #28a745;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

.success-subtitle {
  color: #6c757d;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.5s ease-out 0.3s both;
}

.booking-details {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.5s ease-out 0.4s both;
}

.detail-item {
  margin-bottom: 0.5rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.detail-label {
  color: #6c757d;
  font-size: 0.875rem;
}

.detail-value {
  font-weight: 600;
  color: #495057;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  animation: fadeInUp 0.5s ease-out 0.5s both;
}

.modal-actions .btn {
  flex: 1;
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-radius: 10px;
}

/* Анимации */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInScale {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes successPulse {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes checkmarkDraw {
  0% {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dasharray: 100;
    stroke-dashoffset: 0;
  }
}

@keyframes sparkleFloat {
  0%, 100% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  50% {
    transform: translateY(-10px) scale(1);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>