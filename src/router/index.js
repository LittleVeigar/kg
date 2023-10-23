import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login/index.vue'
import { getStorageExpire } from "../utils/index"


export const constantRoutes = [{
    path: '/login',
    name: 'login',
    component: Login,
    meta: { title: '登录', hidden: true }
}]

/** 使用 shallowRef 消除 警告 */
export const asyncRoutes = [{
    path: '/',
    redirect: '/home',
    children: [{
        path: '/home',
        name: 'home',
        component: () =>
            import ('../components/KG.vue'),
        meta: { title: '首页', icon: 'home', requireAuth: true }
    }, {
        path: '/template',
        name: 'template',
        component: () =>
            import ('../components/template.vue'),
        meta: { title: '自动填报', icon: 'template', requireAuth: true }
    }, {
        path: '/recommend',
        name: 'recommend',
        component: () =>
            import ('../components/recommend.vue'),
        meta: { title: '智能推荐', icon: 'recommend', requireAuth: true }
    }, {
        path: '/login',
        name: 'login',
        component: () =>
            import ('../views/login/index.vue'),
        meta: { title: '登陆', icon: 'home' }
    }]
}]
const router = createRouter({
    history: createWebHistory('/'),
    routes: asyncRoutes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
        // localStorage.clear();
        let token = getStorageExpire('token');
        if (token) { // 通过localStorage.getItem()获取当前的 token 是否存在
            next()
        } else {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath // 将跳转的路由path作为参数，登录成功后跳转到该路由
                }
            })
        }
    } else {
        next()
    }
})
export default router