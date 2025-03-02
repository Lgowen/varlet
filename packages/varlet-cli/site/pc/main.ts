import App from './App.vue'
import '@varlet/touch-emulator'
import routes from '@pc-routes'
import config from '@config'

import Icon from '../components/icon'
import Cell from '../components/cell'
import Ripple from '../components/ripple'
import Button from '../components/button'
import Popup from '../components/popup'
import CodeExample from '../components/code-example'
import Snackbar from '../components/snackbar'

import '../components/styles/common.less'
import '../components/styles/elevation.less'

import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { get } from 'lodash-es'

const defaultLanguage = get(config, 'defaultLanguage')
const redirect = get(config, 'pc.redirect')
const mobileRedirect = get(config, 'mobile.redirect')

Snackbar.allowMultiple(true)

redirect &&
  routes.push({
    path: '/:pathMatch(.*)*',
    redirect: `/${defaultLanguage}${redirect}`,
  })

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to: any) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 100
      };
    }

    return { top: 0 };
  },
})

router.beforeEach((to: any, from: any) => {
  if (to.fullPath === from.fullPath) {
    return false
  }

  // @ts-ignore
  if (window._hmt) {
    if (to.path) {
      // @ts-ignore
      window._hmt.push(['_trackPageview', `/#${to.fullPath}`])
    }
  }
})


Object.defineProperty(window, 'onMobileRouteChange', {
  value: (path: string, language: string, replace: string, hash: string) => {
    if (path === mobileRedirect) {
      router.replace(`/${language}/${replace}${hash}`)
      return
    }

    router.replace(`/${language}${path}${hash}`)
  }
})

Object.defineProperty(window, 'scrollToMenu', {
  value: (docName: string) => {
    setTimeout(() => {
      const cell = document.getElementById(docName) as HTMLElement
      const scroller = cell.parentNode as HTMLElement
      scroller.scrollTo({ top: cell.offsetTop - scroller.offsetHeight / 2 })
    })
  }
})

createApp(App)
  .use(router)
  // @ts-ignore
  .use(Cell)
  .use(Ripple)
  // @ts-ignore
  .use(Icon)
  // @ts-ignore
  .use(CodeExample)
  .use(Snackbar)
  // @ts-ignore
  .use(Popup)
  // @ts-ignore
  .use(Button)
  .mount('#app')
