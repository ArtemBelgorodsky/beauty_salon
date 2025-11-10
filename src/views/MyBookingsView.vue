<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useServicesStore } from '../stores/services'
import { CalendarDays, Clock3, Trash2 } from 'lucide-vue-next'

const authStore = useAuthStore()
const servicesStore = useServicesStore()
const router = useRouter()

// Массив месяцев вынесен наружу для повторного использования
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

// Универсальное форматирование для отображения (поддерживает оба формата)
function formatDateDisplay(dateStr) {
  if (!dateStr) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number)
    return `${day} ${months[month - 1]} ${year}`
  }
  return dateStr
}

// Универсальный парсер даты+времени для сортировки
function parseDateTime(dateStr, timeStr) {
  if (!dateStr) return new Date(0)

  // Формат YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(`${dateStr}T${timeStr || '00:00'}`)
  }

  // Формат "11 ноября 2025"
  const parts = dateStr.split(' ')
  if (parts.length === 3) {
    const [dayStr, monthName, yearStr] = parts
    const day = Number(dayStr)
    const year = Number(yearStr)
    const idx = months.indexOf(monthName)
    if (day && year && idx >= 0) {
      const mm = String(idx + 1).padStart(2, '0')
      const dd = String(day).padStart(2, '0')
      return new Date(`${year}-${mm}-${dd}T${timeStr || '00:00'}`)
    }
  }

  return new Date(0)
}

const myBookings = computed(() => {
  // ВАЖНО: всегда читаем из реактивного стора, не кэшируем currentUser/ID отдельно,
  // чтобы изменения после записи сразу попадали сюда.
  const user = authStore.currentUser
  if (!authStore.isAuthenticated || !user) return []

  const userId = user.id
  const bookings = []

  servicesStore.services.forEach((service) => {
    service.slots.forEach((slot) => {
      if (slot.isBooked && slot.clientId === userId) {
        bookings.push({
          serviceId: service.id,
          slotId: slot.id,
          serviceTitle: service.title,
          master: service.master,
          dateDisplay: formatDateDisplay(slot.date),
          time: slot.time,
          sortDate: parseDateTime(slot.date, slot.time),
        })
      }
    })
  })

  bookings.sort((a, b) => a.sortDate - b.sortDate)

  return bookings
})

function cancelBooking(booking) {
  if (!authStore.isAuthenticated || !authStore.currentUser) return
  if (!confirm('Отменить эту запись?')) return

  servicesStore.cancelBooking({
    serviceId: booking.serviceId,
    slotId: booking.slotId,
  })
}
</script>

<template>
  <div class="my-bookings-page">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h1 class="h4 fw-semibold mb-1">Мои записи</h1>
        <p class="small text-muted mb-0">
          Здесь отображаются все записи, созданные с вашей учётной записи.
        </p>
      </div>

      <div v-if="authStore.isAuthenticated" class="text-end small text-muted">
        <div>Вы вошли как:</div>
        <strong>{{ authStore.currentUser.fullName }}</strong>
      </div>
    </div>

    <div v-if="!authStore.isAuthenticated" class="alert alert-warning small d-flex justify-content-between align-items-center">
      <span>Для просмотра записей необходимо авторизоваться.</span>
      <button
        type="button"
        class="btn btn-sm btn-outline-dark"
        @click="router.push('/login')"
      >
        Войти
      </button>
    </div>

    <div v-else>
      <div v-if="myBookings.length === 0" class="alert alert-info small">
        У вас пока нет активных записей. Перейдите в раздел «Услуги», чтобы выбрать удобное время.
      </div>

      <div v-else class="row g-3">
        <div
          v-for="booking in myBookings"
          :key="booking.slotId"
          class="col-md-6 col-lg-4"
        >
          <div class="card h-100 border-0 shadow-sm booking-card">
            <div class="card-body d-flex flex-column">
              <h3 class="h6 fw-semibold mb-2">{{ booking.serviceTitle }}</h3>
              <div class="d-flex align-items-center gap-2 mb-2">
                <div class="master-avatar">
                  <img
                    v-if="servicesStore.services.find(s => s.id === booking.serviceId)?.masterAvatar"
                    :src="servicesStore.services.find(s => s.id === booking.serviceId).masterAvatar"
                    :alt="`Мастер ${booking.master}`"
                  />
                  <span v-else>
                    {{ booking.master.charAt(0) }}
                  </span>
                </div>
                <div class="small text-muted">
                  Мастер: <span class="fw-semibold">{{ booking.master }}</span>
                </div>
              </div>
              <div class="d-flex flex-wrap gap-2 small text-muted mb-3">
                <span class="d-inline-flex align-items-center gap-1">
                  <CalendarDays size="16" /> {{ booking.dateDisplay }}
                </span>
                <span class="d-inline-flex align-items-center gap-1">
                  <Clock3 size="16" /> {{ booking.time }}
                </span>
              </div>
              <button
                class="btn btn-sm btn-outline-danger mt-auto d-inline-flex align-items-center gap-1"
                type="button"
                @click="cancelBooking(booking)"
              >
                <Trash2 size="14" />
                Отменить запись
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-bookings-page {
  min-height: 60vh;
}

.booking-card {
  border-radius: 1.1rem;
  transition: all 0.18s ease;
}

.booking-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.19);
}

/* Аватар мастера на карточках записей */
.master-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 0%, #ffe9f3, #b0276c);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.8rem;
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
</style>