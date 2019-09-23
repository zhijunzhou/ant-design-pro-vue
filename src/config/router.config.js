// eslint-disable-next-line
import { BasicLayout, RouteView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, hiddenHeaderContent: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true, hiddenHeaderContent: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/dashboard/workplace/:pageid',
            name: 'Workplace2',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台2', hiddenHeaderContent: true, permission: [ 'dashboard' ] }
          }
        ]
      }
    ]
  }
]
