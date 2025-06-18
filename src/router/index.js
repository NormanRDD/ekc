import { createRouter, createWebHistory } from 'vue-router'

// Auth views
import LoginView from '../views/auth/LoginView.vue'

// Dashboard views
import DashboardView from '../views/dashboard/DashboardView.vue'

// Ticket views
import TicketsListView from '../views/tickets/TicketsListView.vue'
import TicketCreateView from '../views/tickets/TicketCreateView.vue'
import TicketDetailView from '../views/tickets/TicketDetailView.vue'

// Report views
import ReportsView from '../views/reports/ReportsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { 
      layout: 'auth',
      requiresAuth: false 
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { 
      requiresAuth: true,
      title: 'Главная'
    }
  },
  {
    path: '/tickets',
    name: 'TicketsList',
    component: TicketsListView,
    meta: { 
      requiresAuth: true,
      title: 'Список обращений'
    }
  },
  {
    path: '/tickets/new',
    name: 'TicketCreate',
    component: TicketCreateView,
    meta: { 
      requiresAuth: true,
      permissions: ['create_ticket'],
      title: 'Создать обращение'
    }
  },
  {
    path: '/tickets/:id',
    name: 'TicketDetail',
    component: TicketDetailView,
    meta: { 
      requiresAuth: true,
      title: 'Обращение'
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
    meta: { 
      requiresAuth: true,
      permissions: ['reports'],
      title: 'Отчеты'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})
