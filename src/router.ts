import Vue from 'vue';
import Router, {Location} from 'vue-router';
import Login from '@/views/Login.vue';
import Admin from '@/views/Admin.vue';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      beforeEnter: (from, to, next) => {
        if (localStorage.getItem('jwt')) {
          return next();
        }

        return next({
          name: 'login',
          params: {msg: 'YOU NEED TO LOGIN FIRST!'}
        });
      },
    },
    {
      path: '/login',
      props: true,
      name: 'login',
      component: Login,
    },
  ],
});
