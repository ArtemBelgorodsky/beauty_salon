import { defineStore } from 'pinia';

const MOCK_USERS = [
  {
    id: 1,
    role: 'admin',
    fullName: 'Администратор Натали',
    email: 'admin@nataly.local',
    password: 'admin123',
  },
];

let idCounter = MOCK_USERS.length + 1;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null,
    users: [...MOCK_USERS],
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    isAdmin: (state) => state.currentUser?.role === 'admin',
  },

  actions: {
    login(email, password) {
      const user = this.users.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) {
        throw new Error('Неверный e-mail или пароль');
      }
      this.currentUser = { ...user, password: undefined };
    },

    register({ fullName, email, password }) {
      const exists = this.users.some((u) => u.email === email);
      if (exists) {
        throw new Error('Пользователь с таким e-mail уже зарегистрирован');
      }
      const newUser = {
        id: idCounter++,
        role: 'user',
        fullName,
        email,
        password,
      };
      this.users.push(newUser);
      this.currentUser = { ...newUser, password: undefined };
    },

    logout() {
      this.currentUser = null;
    },
  },
});
