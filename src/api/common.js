import { axios } from '@/utils/request'

export function retrieveMenus (parameter) {
  return axios({
    url: '/Project/ProjectView',
    method: 'post',
    data: parameter
  })
}
