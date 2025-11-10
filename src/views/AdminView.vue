<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useServicesStore } from '../stores/services'
import { CalendarDays, Clock3, Plus, Trash2, Edit3, Users, LogIn } from 'lucide-vue-next'

const authStore = useAuthStore()
const servicesStore = useServicesStore()
const router = useRouter()

const newService = ref({
  title: '',
  description: '',
  duration: 60,
  price: 1000,
  master: '',
})

const selectedServiceId = ref(null)
const slotDate = ref('')
const slotTime = ref('')

const editServiceId = ref(null)
const editPayload = ref({
  title: '',
  description: '',
  duration: 0,
  price: 0,
  master: '',
})

const isAdmin = computed(() => authStore.isAdmin)

const selectedService = computed(() =>
  servicesStore.services.find((s) => s.id === selectedServiceId.value)
)

function requireAdmin() {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return false
  }
  if (!authStore.isAdmin) {
    alert('Доступ к панели администратора только для роли "Администратор".')
    router.push('/')
    return false
  }
  return true
}

function createService() {
  if (!requireAdmin()) return

  if (!newService.value.title.trim()) return
  if (!newService.value.master.trim()) return

  servicesStore.createService({
    title: newService.value.title.trim(),
    description: newService.value.description.trim(),
    duration: Number(newService.value.duration) || 60,
    price: Number(newService.value.price) || 1000,
    master: newService.value.master.trim(),
  })

  newService.value = {
    title: '',
    description: '',
    duration: 60,
    price: 1000,
    master: '',
  }
}

function selectService(serviceId) {
  selectedServiceId.value = serviceId
  slotDate.value = ''
  slotTime.value = ''
}

function formatDateRu(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) return dateStr
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

function addSlot() {
  if (!requireAdmin()) return
  if (!selectedServiceId.value || !slotDate.value || !slotTime.value) return

  servicesStore.addSlot(selectedServiceId.value, {
    date: formatDateRu(slotDate.value),
    time: slotTime.value,
  })

  slotDate.value = ''
  slotTime.value = ''
}

function startEditService(service) {
  editServiceId.value = service.id
  editPayload.value = {
    title: service.title,
    description: service.description,
    duration: service.duration,
    price: service.price,
    master: service.master,
  }
}

function saveServiceEdit() {
  if (!requireAdmin()) return
  if (!editServiceId.value) return

  servicesStore.updateService(editServiceId.value, {
    title: editPayload.value.title.trim(),
    description: editPayload.value.description.trim(),
    duration: Number(editPayload.value.duration) || 60,
    price: Number(editPayload.value.price) || 0,
    master: editPayload.value.master.trim(),
  })

  editServiceId.value = null
}

function cancelServiceEdit() {
  editServiceId.value = null
}

function deleteService(serviceId) {
  if (!requireAdmin()) return
  if (!confirm('Удалить услугу и все связанные слоты?')) return
  servicesStore.deleteService(serviceId)
  if (selectedServiceId.value === serviceId) {
    selectedServiceId.value = null
  }
}

function clearSlotBooking(serviceId, slotId) {
  if (!requireAdmin()) return
  servicesStore.cancelBooking({ serviceId, slotId })
}
</script>

<template>
  <div class="admin-page">
    <div v-if="!isAdmin" class="alert alert-warning d-flex align-items-center gap-2">
      <LogIn size="16" />
      <span class="small">
        Доступ к функционалу панели ограничен. Войдите как администратор
        (admin@nataly.local / admin123), чтобы создавать и редактировать услуги.
      </span>
    </div>

    <div class="row g-3">
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 mb-3">
          <div class="card-body p-3 p-md-4">
            <h2 class="h6 fw-semibold mb-3 d-flex align-items-center gap-2">
              <Plus size="18" /> Создание услуги
            </h2>

            <div class="mb-2">
              <label class="form-label small">Название услуги</label>
              <input
                v-model="newService.title"
                type="text"
                class="form-control form-control-sm"
                placeholder="Например: Женская стрижка"
              />
            </div>

            <div class="mb-2">
              <label class="form-label small">Мастер</label>
              <input
                v-model="newService.master"
                type="text"
                class="form-control form-control-sm"
                placeholder="Имя мастера"
              />
            </div>

            <div class="mb-2">
              <label class="form-label small">Описание</label>
              <textarea
                v-model="newService.description"
                rows="3"
                class="form-control form-control-sm"
                placeholder="Краткое описание услуги"
              ></textarea>
            </div>

            <div class="row g-2 mb-3 small">
              <div class="col-6">
                <label class="form-label small">Длительность (мин)</label>
                <input
                  v-model.number="newService.duration"
                  type="number"
                  min="10"
                  class="form-control form-control-sm"
                />
              </div>
              <div class="col-6">
                <label class="form-label small">Цена (₽)</label>
                <input
                  v-model.number="newService.price"
                  type="number"
                  min="0"
                  class="form-control form-control-sm"
                />
              </div>
            </div>

            <button
              type="button"
              class="btn btn-dark w-100 btn-sm"
              :disabled="!isAdmin"
              @click="createService"
            >
              Создать услугу
            </button>
            <p v-if="!isAdmin" class="text-muted small mt-2 mb-0">
              Для создания услуг необходимо авторизоваться как администратор.
            </p>
          </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-3 p-md-4 small">
            <h2 class="h6 fw-semibold mb-2">Справка по использованию</h2>
            <ul class="mb-0 ps-3">
              <li>Создайте услуги салона с указанием мастера, цены и длительности.</li>
              <li>Выберите услугу слева, чтобы добавить слоты дат и времени.</li>
              <li>Пользователь после регистрации может выбрать слот и записаться на услугу.</li>
              <li>Список записавшихся отображается в блоке слотов услуги.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 mb-3">
          <div class="card-body p-3 p-md-4">
            <h2 class="h6 fw-semibold mb-3 d-flex align-items-center gap-2">
              <CalendarDays size="18" /> Услуги и слоты
            </h2>

            <div class="table-responsive small">
              <table class="table align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Название</th>
                    <th>Мастер</th>
                    <th>Длительность</th>
                    <th>Цена</th>
                    <th>Слоты</th>
                    <th class="text-end">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="service in servicesStore.services"
                    :key="service.id"
                    :class="{ 'table-active': selectedServiceId === service.id }"
                  >
                    <td>{{ service.title }}</td>
                    <td>{{ service.master }}</td>
                    <td>{{ service.duration }} мин</td>
                    <td>{{ service.price }} ₽</td>
                    <td>
                      <span class="badge bg-light text-dark border">
                        всего: {{ service.slots.length }}
                      </span>
                      <span class="badge bg-success-subtle text-success ms-1">
                        свободно:
                        {{
                          service.slots.filter(s => !s.isBooked).length
                        }}
                      </span>
                    </td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button
                          type="button"
                          class="btn btn-outline-primary"
                          :disabled="!isAdmin"
                          @click="selectService(service.id)"
                        >
                          Слоты
                        </button>
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          :disabled="!isAdmin"
                          @click="startEditService(service)"
                        >
                          <Edit3 size="14" />
                        </button>
                        <button
                          type="button"
                          class="btn btn-outline-danger"
                          :disabled="!isAdmin"
                          @click="deleteService(service.id)"
                        >
                          <Trash2 size="14" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div
          v-if="selectedService"
          class="card border-0 shadow-sm rounded-4 mb-3"
        >
          <div class="card-body p-3 p-md-4 small">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h6 fw-semibold mb-0 d-flex align-items-center gap-2">
                <Clock3 size="18" /> Слоты услуги: {{ selectedService.title }}
              </h2>
              <div class="d-flex gap-2">
                <input
                  v-model="slotDate"
                  type="date"
                  class="form-control form-control-sm"
                  :disabled="!isAdmin"
                />
                <input
                  v-model="slotTime"
                  type="time"
                  class="form-control form-control-sm"
                  :disabled="!isAdmin"
                />
                <button
                  type="button"
                  class="btn btn-sm btn-dark"
                  :disabled="!isAdmin"
                  @click="addSlot"
                >
                  Добавить
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Дата</th>
                    <th>Время</th>
                    <th>Статус</th>
                    <th>Клиент</th>
                    <th class="text-end">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="slot in selectedService.slots"
                    :key="slot.id"
                  >
                    <td>{{ slot.date }}</td>
                    <td>{{ slot.time }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="slot.isBooked ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'"
                      >
                        {{ slot.isBooked ? 'Занято' : 'Свободно' }}
                      </span>
                    </td>
                    <td>
                      <span v-if="slot.isBooked">
                        <Users size="14" class="me-1" />
                        {{ slot.clientName || 'Пользователь' }}
                      </span>
                      <span v-else class="text-muted">—</span>
                    </td>
                    <td class="text-end">
                      <button
                        v-if="slot.isBooked"
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        :disabled="!isAdmin"
                        @click="clearSlotBooking(selectedService.id, slot.id)"
                      >
                        Освободить
                      </button>
                      <span
                        v-else
                        class="text-muted small"
                      >
                        Ожидает записи
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div
          v-if="editServiceId"
          class="card border-0 shadow-sm rounded-4"
        >
          <div class="card-body p-3 p-md-4 small">
            <h2 class="h6 fw-semibold mb-3 d-flex align-items-center gap-2">
              <Edit3 size="18" /> Редактирование услуги
            </h2>

            <div class="row g-2 mb-2">
              <div class="col-md-6">
                <label class="form-label small">Название</label>
                <input
                  v-model="editPayload.title"
                  type="text"
                  class="form-control form-control-sm"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label small">Мастер</label>
                <input
                  v-model="editPayload.master"
                  type="text"
                  class="form-control form-control-sm"
                />
              </div>
            </div>

            <div class="mb-2">
              <label class="form-label small">Описание</label>
              <textarea
                v-model="editPayload.description"
                rows="3"
                class="form-control form-control-sm"
              ></textarea>
            </div>

            <div class="row g-2 mb-3 small">
              <div class="col-md-6">
                <label class="form-label small">Длительность (мин)</label>
                <input
                  v-model.number="editPayload.duration"
                  type="number"
                  min="10"
                  class="form-control form-control-sm"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label small">Цена (₽)</label>
                <input
                  v-model.number="editPayload.price"
                  type="number"
                  min="0"
                  class="form-control form-control-sm"
                />
              </div>
            </div>

            <div class="d-flex gap-2">
              <button
                type="button"
                class="btn btn-sm btn-dark"
                :disabled="!isAdmin"
                @click="saveServiceEdit"
              >
                Сохранить изменения
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                @click="cancelServiceEdit"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  min-height: 70vh;
}

.card {
  border-radius: 1.1rem;
}
</style>