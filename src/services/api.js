import axios from 'axios'

const api = axios.create({
  baseURL: 'https://newsapi.org/v2/',
  headers: {
    'X-Api-Key': import.meta.env.VITE_NEWS_API_KEY,
  },
})

export default api
