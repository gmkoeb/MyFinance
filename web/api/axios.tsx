import axios from 'axios'
import Cookies from 'js-cookie'

export const api = axios.create({
  baseURL: 'https://finance-api.bosswatchtower.com'
})

if (Cookies.get('token')) {
  api.defaults.headers.common = {
    'Authorization': `${Cookies.get('token')}`
  }
}