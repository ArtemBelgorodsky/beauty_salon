<script setup>
import { RouterLink } from 'vue-router'
import { useServicesStore } from '../stores/services'
import { Scissors, Sparkles, Clock3, MapPin, Phone, Star, Award, Heart } from 'lucide-vue-next'

const servicesStore = useServicesStore()
const previewServices = servicesStore.services.slice(0, 3)

// Примеры работ (в реальном проекте можно загружать из API)
const portfolioWorks = [
  {
    id: 1,
    title: 'Женская стрижка и укладка',
    image: 'https://i.pinimg.com/originals/d8/eb/89/d8eb89ca02ce63c6aea4b34d6be18752.jpg',
    category: 'Стрижки'
  },
  {
    id: 2,
    title: 'Маникюр с покрытием',
    image: 'https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_680283c5f866d62001639d2c_680283c5f866d62001639d2d/scale_1200',
    category: 'Маникюр'
  },
  {
    id: 3,
    title: 'Окрашивание волос',
    image: 'https://yandex-images.clstorage.net/9UEu8J354/dd1a16cyqFd/5xNdkrJ1bZrarqN8VY_o3fzBDz3U2TzA_T7G0SZ9ZzTYHGI9DpjbU7pCtTEiW0cXRz5VDGkqLYSBt3x23Ex1zjJDSQJl5K2bn7xh71MM7Nivxl_4hF99wSt9xwq9dDrpFoH79lEH0YDuVXTlZdxVxFwxxVO07uAb0edy8UpYqFQmW5gVuqDn35S8KLlbyG-V7UTP9c9Qp8s6KhkBMH43Zd9ON7EcCF5P4pP_YKMK1coRdBPcueLgU1mpMTzNlGCYLpAYnTfs4Jtd_OQ9UkdjWCWDTXGLG-WDN6XWyDpweuTfxnH_lAfeA-1eNmipgxkPn_3cH3chLlpf6733TdXkEWNQW9c2Kq4RmrtudR1EYNHnj0--hpcoCzcimYQxuflsWYO9uB6OmAIqE71ibs-YQ5-0XxK3p6DYny54f4fdK1bkWhVVemtg2RV7LL8bCqtdrYsDOUkfI8Q6Y5NN_n96KdpB83zRQJiDZV-47-7N0odbP1XV_GeoXJXot_ZJE-eTrdTb3LCvZZEe9CV_04LjXmOJAHKFECaOvO8fxPlxPyNfS_T5XYecT-xYv6nqS1XEVvJT271qL9BWIrp4BNzgXaoWl1U46GzeWrEs9xVAbBdjj88-i57jxndpEo6_-fEt3Ir_8VtGHIznkLCuag2Qz1d8G1l4o2Df1-s2_UPVoxpm0tuTvWasFt23bHSazGSSLIlMNE2fqESwoJ6MfnD5K5sENTXbDNeLKpO3Ja_FW80ds5md8CGmWJUiv7lBma3dbpxQE_LnrRiU9id30sTvFmZOiHzBkyVEvOqdwD79_mJYDHR42U5bR6BStSfgQhUJWz-Xm_sq7x2W6b9-TZzh0-yc0dTz5yURE3QgPhNI5RsiSU20xFEpwv8oUUizNDnrlEF9-V7P2U_gFfdip0mZz191kJqx7idVFSi6_0UVpdlmHtPadCDmVVz0pv4Yi2xdbEAMfEGQLQA0oh9PMI',
    category: 'Окрашивание'
  },
  {
    id: 4,
    title: 'Укладка волос',
    image: 'https://i.pinimg.com/originals/46/a9/0a/46a90ad8e1c49a38c4c8029d8526f865.jpg',
    category: 'Укладка'
  },
  {
    id: 5,
    title: 'Педикюр',
    image: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1GTkSW.img?w=728&h=690&m=6',
    category: 'Педикюр'
  },
  {
    id: 6,
    title: 'Свадебный образ',
    image: 'https://i.pinimg.com/736x/13/f7/32/13f732d469cab5f4d71f07eb10d1d8e1.jpg',
    category: 'Стилизация'
  }
]

// Отзывы клиентов
const reviews = [
  {
    id: 1,
    name: 'Анна К.',
    rating: 5,
    text: 'Прекрасный салон! Делала окрашивание у Екатерины - результат превосходный. Очень внимательное отношение и профессиональный подход.',
    service: 'Окрашивание волос'
  },
  {
    id: 2,
    name: 'Мария С.',
    rating: 5,
    text: 'Лучший маникюр в городе! Марина - настоящий профессионал. Все стерильно, красиво и долго держится.',
    service: 'Маникюр'
  },
  {
    id: 3,
    name: 'Елена П.',
    rating: 5,
    text: 'Хожу в этот салон уже полгода. Всегда довольна результатом. Администратор очень вежливая, цены адекватные.',
    service: 'Женская стрижка'
  }
]
</script>

<template>
  <!-- Hero секция -->
  <section class="hero hero-light rounded-4 p-4 p-md-5 mb-5 shadow-sm">
    <div class="hero-bg-animated"></div>
    <div class="row align-items-center g-4 position-relative">
      <div class="col-lg-7">
        <p class="text-uppercase fw-semibold mb-1 small text-beauty-accent">
          Премиум салон красоты
        </p>
        <h1 class="display-5 fw-semibold mb-3 text-beauty-title">
          Салон красоты «Натали»
          <span class="d-block fs-4 fw-normal text-beauty-muted">Ростов-на-Дону</span>
        </h1>
        <p class="lead mb-4 text-beauty-text">
          Преобразитесь в нашем уютном салоне! Профессиональные мастера, современные техники, 
          качественные материалы и индивидуальный подход к каждому клиенту.
        </p>
        <div class="d-flex flex-wrap gap-2">
          <RouterLink to="/services" class="btn btn-beauty btn-lg fw-semibold">
            Записаться онлайн
          </RouterLink>
          <a href="#portfolio" class="btn btn-outline-primary btn-lg fw-semibold">
            Наши работы
          </a>
        </div>
      </div>
      <div class="col-lg-5 img-fon">
      </div>
    </div>
  </section>

  <!-- Преимущества -->
  <section class="mb-5">
    <div class="row g-3">
      <div class="col-md-3 col-6">
        <div class="info-tile-light text-center h-100">
          <Award class="icon mx-auto mb-2 text-beauty-accent" />
          <h3>Опытные мастера</h3>
          <p>Профессионалы с многолетним опытом</p>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="info-tile-light text-center h-100">
          <Sparkles class="icon mx-auto mb-2 text-beauty-accent" />
          <h3>Премиум материалы</h3>
          <p>Только качественная косметика</p>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="info-tile-light text-center h-100">
          <Clock3 class="icon mx-auto mb-2 text-beauty-accent" />
          <h3>Удобная запись</h3>
          <p>Онлайн-бронирование 24/7</p>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="info-tile-light text-center h-100">
          <Heart class="icon mx-auto mb-2 text-beauty-accent" />
          <h3>Индивидуальный подход</h3>
          <p>Учитываем все пожелания</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Популярные услуги -->
  <section class="mb-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h3 fw-semibold mb-0">Наши услуги</h2>
      <RouterLink to="/services" class="btn btn-sm btn-outline-dark">Все услуги</RouterLink>
    </div>
    <div class="row g-4">
      <div
        v-for="service in previewServices"
        :key="service.id"
        class="col-md-4"
      >
        <div class="card h-100 shadow-sm border-0 service-card">
          <div class="card-body d-flex flex-column">
            <h3 class="h5 card-title mb-2">{{ service.title }}</h3>
            <div class="d-flex align-items-center gap-2 mb-2">
              <div class="master-avatar">
                <img
                  v-if="service.masterAvatar"
                  :src="service.masterAvatar"
                  :alt="`Мастер ${service.master}`"
                />
                <span v-else>{{ service.master.charAt(0) }}</span>
              </div>
              <div class="small text-muted">
                Мастер: <span class="fw-semibold">{{ service.master }}</span>
              </div>
            </div>
            <p class="card-text small flex-grow-1">{{ service.description }}</p>
            <div class="d-flex flex-wrap gap-2 small text-muted mb-3">
              <span>⏱ {{ service.duration }} мин</span>
              <span>💰 от {{ service.price }} ₽</span>
            </div>
          </div>
          <div
            class="card-footer bg-white border-0 d-flex justify-content-between align-items-center"
          >
            <span class="fw-semibold text-beauty-accent">от {{ service.price }} ₽</span>
            <RouterLink
              class="btn btn-sm btn-outline-primary"
              to="/services"
            >
              Записаться
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Портфолио работ -->
  <section id="portfolio" class="mb-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h3 fw-semibold mb-0">Наши работы</h2>
      <a href="#contacts" class="btn btn-sm btn-outline-dark">Записаться</a>
    </div>
    <div class="row g-3">
      <div
        v-for="work in portfolioWorks"
        :key="work.id"
        class="col-md-4 col-sm-6"
      >
        <div class="portfolio-item position-relative overflow-hidden rounded-3">
          <img
            :src="work.image"
            :alt="work.title"
            class="w-100"
            style="height: 250px; object-fit: cover;"
          />
          <div class="portfolio-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-3">
            <div class="text-white">
              <h5 class="h6 mb-1">{{ work.title }}</h5>
              <span class="badge bg-light text-dark">{{ work.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Отзывы -->
  <section class="mb-5">
    <h2 class="h3 fw-semibold mb-4 text-center">Отзывы наших клиентов</h2>
    <div class="row g-4">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="col-md-4"
      >
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="reviewer-avatar">
                <span>{{ review.name.charAt(0) }}</span>
              </div>
              <div>
                <h6 class="mb-0">{{ review.name }}</h6>
                <div class="d-flex gap-1">
                  <Star
                    v-for="i in review.rating"
                    :key="i"
                    size="14"
                    class="text-warning fill-current"
                  />
                </div>
              </div>
            </div>
            <p class="small mb-2">«{{ review.text }}»</p>
            <span class="badge bg-light text-dark">{{ review.service }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Контакты -->
  <section id="contacts" class="mb-5">
    <div class="row g-4">
      <div class="col-md-8">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h2 class="h4 fw-semibold mb-4">Контакты и запись</h2>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="d-flex align-items-center gap-2">
                  <MapPin class="text-beauty-accent" size="20" />
                  <div>
                    <h6 class="mb-0">Адрес</h6>
                    <p class="small text-muted mb-0">г. Ростов-на-Дону, ул. Красина, 15</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex align-items-center gap-2">
                  <Phone class="text-beauty-accent" size="20" />
                  <div>
                    <h6 class="mb-0">Телефон</h6>
                    <p class="small text-muted mb-0">+7 (863) 123-45-67</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex align-items-center gap-2">
                  <Clock3 class="text-beauty-accent" size="20" />
                  <div>
                    <h6 class="mb-0">Время работы</h6>
                    <p class="small text-muted mb-0">Пн-Вс: 9:00 - 21:00</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex align-items-center gap-2">
                  <Scissors class="text-beauty-accent" size="20" />
                  <div>
                    <h6 class="mb-0">Онлайн запись</h6>
                    <RouterLink to="/services" class="small text-beauty-accent text-decoration-none">
                      Записаться →
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center">
            <h3 class="h5 fw-semibold mb-3">Готовы преобразиться?</h3>
            <p class="small text-muted mb-4">
              Запишитесь на консультацию или выберите удобное время онлайн
            </p>
            <RouterLink to="/services" class="btn btn-beauty w-100">
              Записаться онлайн
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-light {
  position: relative;
  overflow: hidden;
  background: linear-gradient(
      135deg,
      rgba(255, 246, 252, 0.96),
      rgba(255, 239, 247, 0.98)
    );
  border: 1px solid rgba(214, 51, 132, 0.14);
}

.hero-bg-animated {
  position: absolute;
  inset: -12%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.hero-bg-animated::before,
.hero-bg-animated::after {
  content: '';
  position: absolute;
  border-radius: 999px;
  opacity: 0;
  transform: scale(0.4);
  animation: circlePulse 7.5s ease-in-out infinite;
}

.hero-bg-animated::before {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(176, 39, 108, 0.45), transparent);
  top: -40px;
  left: -20px;
  animation-delay: 0s;
}

.hero-bg-animated::after {
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(240, 35, 144, 0.45), transparent);
  bottom: -60px;
  right: -10px;
  animation-delay: 1s;
}

.hero-bg-animated span {
  position: absolute;
  display: block;
  border-radius: 999px;
  opacity: 0;
  transform: scale(0.22);
  animation: circlePulse 9s ease-in-out infinite;
}

.hero-bg-animated span:nth-child(1) {
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(214, 51, 132, 0.35), transparent);
  top: 5%;
  left: 8%;
  animation-delay: 0.5s;
}

.hero-bg-animated span:nth-child(2) {
  width: 210px;
  height: 210px;
  background: radial-gradient(circle, rgba(91, 47, 62, 0.4), transparent);
  top: 0%;
  right: 6%;
  animation-delay: 1.3s;
}

.hero-bg-animated span:nth-child(3) {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(176, 39, 108, 0.32), transparent);
  top: 30%;
  left: 35%;
  animation-delay: 2.1s;
}

.hero-bg-animated span:nth-child(4) {
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(59, 42, 51, 0.38), transparent);
  top: 28%;
  right: 18%;
  animation-delay: 2.7s;
}

.hero-bg-animated span:nth-child(5) {
  width: 190px;
  height: 190px;
  background: radial-gradient(circle, rgba(214, 51, 132, 0.3), transparent);
  bottom: -4%;
  left: 6%;
  animation-delay: 3.4s;
}

.hero-bg-animated span:nth-child(6) {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(91, 47, 62, 0.36), transparent);
  bottom: 2%;
  right: 10%;
  animation-delay: 4s;
}

.hero-bg-animated span:nth-child(7) {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(176, 39, 108, 0.28), transparent);
  top: 18%;
  left: 26%;
  animation-delay: 1.8s;
}

.hero-bg-animated span:nth-child(8) {
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(255, 182, 193, 0.28), transparent);
  bottom: 14%;
  right: 26%;
  animation-delay: 3.1s;
}

@keyframes circlePulse {
  0% {
    opacity: 0;
    transform: scale(0.22) translate3d(0, 8px, 0);
  }
  15% {
    opacity: 0.95;
    transform: scale(0.8) translate3d(4px, -6px, 0);
  }
  40% {
    opacity: 0.6;
    transform: scale(1.05) translate3d(-6px, 6px, 0);
  }
  70% {
    opacity: 0.32;
    transform: scale(1.3) translate3d(4px, 12px, 0);
  }
  100% {
    opacity: 0;
    transform: scale(1.55) translate3d(0, 20px, 0);
  }
}

.hero-light .row {
  position: relative;
  z-index: 1;
}

.text-beauty-accent {
  color: #d63384;
  letter-spacing: 0.16em;
}

.text-beauty-title {
  color: #2b1c24;
}

.text-beauty-muted {
  color: #8e6b80;
}

.text-beauty-text {
  color: #5c3e4c;
}

.btn-beauty {
  background-color: #d63384;
  border-color: #d63384;
  color: #fff;
  box-shadow: 0 10px 26px rgba(214, 51, 132, 0.35);
}

.btn-beauty:hover {
  background-color: #b0276c;
  border-color: #b0276c;
  color: #fff;
}

.info-tile-light {
  padding: 1.5rem 1.1rem;
  border-radius: 1rem;
  background: rgba(255, 251, 253, 0.98);
  border: 1px solid rgba(214, 51, 132, 0.16);
  box-shadow: 0 10px 26px rgba(59, 42, 51, 0.06);
  color: #3b2a33;
}

.info-tile-light h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.info-tile-light p {
  font-size: 0.875rem;
  margin: 0;
  color: #6c757d;
}

.icon {
  width: 28px;
  height: 28px;
}

.service-card {
  border-radius: 1.1rem;
  transition: all 0.18s ease;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(59, 42, 51, 0.18);
}

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

.portfolio-item {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.portfolio-item:hover {
  transform: scale(1.03);
}

.portfolio-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.portfolio-item:hover .portfolio-overlay {
  opacity: 1;
}

.reviewer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
}

.img-fon {
  background-image: url(/fon.png);
  background-size: cover;
  height: 400px;
  border-radius: 1rem;
}
</style>
