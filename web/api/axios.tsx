import axios from 'axios'
import Cookies from 'js-cookie'

export const api = axios.create({
  baseURL: 'https://finance-api.bosswatchtower.com/api/v1'
})

if (Cookies.get('token')) {
  api.defaults.headers.common = {
    'Authorization': `${Cookies.get('token')}`
  }
}