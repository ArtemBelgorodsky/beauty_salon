import { defineStore } from 'pinia';

const initialServices = [
  {
    id: 1,
    title: 'Женская стрижка и укладка',
    description:
      'Индивидуальный подбор формы, мытьё головы, уход и профессиональная укладка. Длительность 60 минут.',
    duration: 60,
    price: 1800,
    master: 'Марина',
    masterAvatar:
      'https://photo10.wambacdn.net/64/45/51/1813155446/2187398399_huge.jpg?hash=5hXxfBjBjZZD3ZT_aQYnBw&expires=64060578000&updated=1717116505',
    slots: [
      {
        id: 1,
        date: '2025-11-11',
        time: '10:00',
        isBooked: false,
        clientName: null,
        clientId: null,
      },
      {
        id: 2,
        date: '2025-11-11',
        time: '12:00',
        isBooked: false,
        clientName: null,
        clientId: null,
      },
      {
        id: 3,
        date: '2025-11-12',
        time: '15:00',
        isBooked: false,
        clientName: null,
        clientId: null,
      },
    ],
  },
  {
    id: 2,
    title: 'Маникюр с покрытием гель-лаком',
    description:
      'Гигиенический маникюр, выравнивание ногтевой пластины и стойкое покрытие. Длительность 90 минут.',
    duration: 90,
    price: 2200,
    master: 'Анна',
    masterAvatar:
      'https://i.pinimg.com/736x/59/6c/58/596c585b52a9982cba9588e94a63e321.jpg',
    slots: [
      {
        id: 4,
        date: '2025-11-11',
        time: '11:00',
        isBooked: false,
        clientName: null,
        clientId: null,
      },
      {
        id: 5,
        date: '2025-11-12',
        time: '14:00',
        isBooked: false,
        clientName: null,
        clientId: null,
      },
      {
        id: 6,
        date: '2025-11-13',
        time: '17:00',
        isBooked: false,
        clientName: null,
        clientId: null,
      },
    ],
  },
  {
    id: 3,
    title: 'Окрашивание волос "Полное преображение"',
    description:
      'Комплекс: консультация, окрашивание, уход и укладка. Используем профессиональные материалы премиум-класса.',
    duration: 180,
    price: 5200,
    master: 'Екатерина',
    masterAvatar: 'https://cdn1.flamp.ru/d50bbab98fdd93d2ae343c5cdcfe60a0.jpg',
    slots: [
      {
        id: 7,
        date: '2025-11-12',
        time: '10:00',
        isBooked: false,
        clientName: null,
        clientId: null,
      },
      {
        id: 8,
        date: '2025-11-14',
        time: '13:00',
        isBooked: false,
        clientName: null,
        clientId: null,
      },
      {
        id: 9,
        date: '2025-11-15',
        time: '16:00',
        isBooked: false,
        clientName: null,
        clientId: null,
      },
    ],
  },
];

let nextServiceId = initialServices.length + 1;
let nextSlotId =
  initialServices.reduce(
    (acc, s) => Math.max(acc, ...s.slots.map((sl) => sl.id)),
    0
  ) + 1;

export const useServicesStore = defineStore('services', {
  state: () => ({
    services: [...initialServices],
  }),

  getters: {
    getServiceById: (state) => (id) => state.services.find((s) => s.id === id),
  },

  actions: {
    createService({
      title,
      description,
      duration,
      price,
      master,
      masterAvatar,
    }) {
      const newService = {
        id: nextServiceId++,
        title,
        description,
        duration,
        price,
        master,
        masterAvatar: masterAvatar || null,
        slots: [],
      };
      this.services.push(newService);
      return newService;
    },

    addSlot(serviceId, { date, time }) {
      const service = this.services.find((s) => s.id === serviceId);
      if (!service) return;
      service.slots.push({
        id: nextSlotId++,
        date,
        time,
        isBooked: false,
        clientName: null,
        clientId: null,
      });
    },

    updateService(serviceId, payload) {
      const service = this.services.find((s) => s.id === serviceId);
      if (!service) return;
      Object.assign(service, payload);
    },

    deleteService(serviceId) {
      this.services = this.services.filter((s) => s.id !== serviceId);
    },

    bookSlot({ serviceId, slotId, clientId, clientName }) {
      const service = this.services.find((s) => s.id === serviceId);
      if (!service) return false;
      const slot = service.slots.find((sl) => sl.id === slotId);
      if (!slot || slot.isBooked) return false;

      slot.isBooked = true;
      slot.clientId = clientId;
      slot.clientName = clientName;
      return true;
    },

    cancelBooking({ serviceId, slotId }) {
      const service = this.services.find((s) => s.id === serviceId);
      if (!service) return;
      const slot = service.slots.find((sl) => sl.id === slotId);
      if (!slot) return;
      slot.isBooked = false;
      slot.clientId = null;
      slot.clientName = null;
    },
  },
});
