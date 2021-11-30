import Router from "vue-router"
import Vue from "vue"
Vue.use(Router)

let router = new Router({
    routes: [
        // {path: "/", component: () => import("./components/HelloWorld")},
        {path: "/", component: () => import("./components/Message.vue")},
        {path: "/file", component: () => import("./components/File.vue")},
    ]
})

export default router;