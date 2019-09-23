import { axios } from '@/utils/request'

export function retrieveMenus (parameter) {
  return axios({
    url: '/Project/ProjectView',
    method: 'post',
    data: parameter
  })
}

export function retrieveProjects (parameter) {
  return axios({
    url: '/Project/list',
    method: 'post',
    data: parameter
  })
}
