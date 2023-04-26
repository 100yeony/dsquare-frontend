import axios from 'axios'
import store from "@/store";
import router from "@/router/index";
// import router from '@/router/index'
// import dayjs from "dayjs";
// import { v4 } from 'uuid';

// const prefix = ''
// var apiInstance
// var vocInstance
// function setAxiosInterceptor(instance) {
//   instance.interceptors.request.use(
//     (config) => {
//       addApiCall(config.url)
//       return config
//     },
//     (error) => {
//       console.debug(error)
//       return false
//     }
//   )
//   instance.interceptors.response.use(
//     async (response) => {
//       removeApiCall(response.config.url)
//       return Promise.resolve(response.data)
//     },
//     (error) => {
//       console.log(error)
//       if (!error.status && !error.response) {
//         removeApiCall(null, true)
//       } else if (error.code === 'ECONNABORTED') {
//         removeApiCall(error.config.url)
//       } else {
//         if (error.response.status == '503') {
//           sessionStorage.clear()
//           localStorage.clear()
//           removeApiCall(error.response.config.url)
//           return Promise.resolve(error?.response?.data)
//         }
//         removeApiCall(error?.response?.config.url)
//         return Promise.resolve(error?.response?.data)
//       }
//     }
//   )
//   return instance
// }

// function createInstance() {
//   //let apiUrl = ''// process.env.VUE_APP_API
//   apiInstance = axios.create({
//     baseURL: 'http://localhost:8090',
//   })
//   vocInstance = axios.create({
//     headers: {
//       'Content-Type': 'text/html;charset=UTF-8'
//     },
//   })
//   //setAxiosInterceptor(apiInstance)
//   return fn
// }

// //import store from '@/store/index'

// const apiCallList = []
// function addApiCall(url) {
//   apiCallList.push(url)
//   /*if (apiCallList.length > 0) {
//     store.dispatch('auth/toggleOverlay', true)
//   }*/
// }

// function removeApiCall(url, force = false) {
//   if (!force) {
//     const idx = apiCallList.indexOf(url)
//     apiCallList.splice(idx, 1)
//   } else {
//     apiCallList.pop()
//   }
//   /*if (apiCallList.length < 1) {
//     store.dispatch('auth/toggleOverlay', false)
//   }*/
// }

// const fn = {
//   ResponsePayload(res) {
//     console.log('ResponsePayload', res)
//     return res
//   },
//   ErrorPayload(err) {
//     console.log('ErrorPayload', err)
//     return {
//       code: err?.code,
//       msg: err?.msg || 'FAIL',
//       messageCode: '',
//       messageInfo: '서비스 요청이 실패하였습니다.',
//       resData: null,
//     }
//   },
//   getBaseUrl() {
//     return apiInstance.defaults.baseURL
//   },
//   setDefaultToken(token) {
//     apiInstance.defaults.headers = {
//       Pragma: 'no-cache',
//       'X-AUTH-TOKEN': token,
//     }
//   },

//   async get(uri, params, headers) {
//     try {
//       console.log('[GET]', uri, params)
//       if (!headers) headers = {}
//       headers['Authorization'] = localStorage.getItem('Authorization')
//       headers['routPath'] = location.pathname
//       headers['routName'] = router.currentRoute.name
//       const res = await apiInstance.get(`${prefix + uri}`, { params, headers }, { withCredentials: true })
//       return this.ResponsePayload(res)
//     } catch (err) {
//       return this.ErrorPayload(err)
//     }

//   },

//   async post(uri, params, headers) {
//     try {
//       console.log('[POST]', uri, params)
//       console.log('auth :::::::::::::::', headers)
//       const res = await apiInstance.post(`${prefix + uri}`, params, { headers: headers})
//       return this.ResponsePayload(res)
//     } catch (err) {
//       return this.ErrorPayload(err)
//     }
//   },

//   async put(uri, params, headers) {
//     try {
//       console.log('[PUT]', uri, params)
//       if (!headers) headers = {}
//       headers['Authorization'] = localStorage.getItem('Authorization')
//       headers['routPath'] = location.pathname
//       headers['routName'] = router.currentRoute.name
//       const res = await apiInstance.put(`${prefix + uri}`, params, { headers })
//       return this.ResponsePayload(res)
//     } catch (err) {
//       return this.ErrorPayload(err)
//     }
//   },

//   async del(uri, params, headers) {
//     try {
//       console.log('[DEL]', uri, params)
//       if (!headers) headers = {}
//       headers['Authorization'] = localStorage.getItem('Authorization')
//       headers['routPath'] = location.pathname
//       headers['routName'] = router.currentRoute.name
//       const res = await apiInstance.delete(`${prefix + uri}`, { params, headers })
//       return this.ResponsePayload(res)
//     } catch (err) {
//       return this.ErrorPayload(err)
//     }
//   },
// }
// export default createInstance()

const prefix = ''
var apiInstance
var multiPartApiInstance
var noneTokenApiInstance

function createInstance() {
  var token = store.getters["info/infoToken"]
  apiInstance = axios.create({
    baseURL: 'http://localhost:8090',
    headers: { Authorization: 'Bearer ' + token.accessToken }
  })

  multiPartApiInstance = axios.create({
    baseURL: 'http://localhost:8090',
    headers: {
      Authorization: 'Bearer ' + token.accessToken,
      'Content-Type': 'multipart/form-data'
    }
  })

  noneTokenApiInstance = axios.create({
    baseURL: 'http://localhost:8090'
  })

  return fn
}

const fn = {
  ResponsePayload(res) {
    console.log('ResponsePayload', res)
    return res
  },
  ErrorPayload(err) {
    console.log('ErrorPayload', err)
    return {
      code: err?.code,
      msg: err?.msg || 'FAIL',
      messageCode: '',
      messageInfo: '서비스 요청이 실패하였습니다.',
      resData: null,
    }
  },
  tokenErrorCheck(err) {
    if (err?.response?.data?.code == '401001') {
      console.log("it's token expired")
      return true
    } else {
      return false
    }
  },
  async requestRefresh() {
    var token = store.getters["info/infoToken"]
    apiInstance = axios.create({
      baseURL: 'http://localhost:8090'
    })
    const res = await apiInstance.post('auth/refresh', { refreshToken: token.refreshToken })
    return res
  },
  getBaseUrl() {
    return apiInstance.defaults.baseURL
  },

  setDefaultToken() {
    var token = store.getters["info/infoToken"]
    console.log('setDefaultToken=> ' + token.accessToken)
    apiInstance = axios.create({
      baseURL: 'http://localhost:8090',
      headers: { Authorization: 'Bearer ' + token.accessToken }
    })
    multiPartApiInstance = axios.create({
      baseURL: 'http://localhost:8090',
      headers: {
        Authorization: 'Bearer ' + token.accessToken,
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  expiredToken() {
    store.dispatch('info/setInfoToken', { accessToken: '', refreshToken: '' }); // 토큰값을 제거해줍니다.
    router.push(process.env.VUE_APP_LOGIN);
  }
  ,
  async post(uri, params, headers) {
    try {
      console.log('[POST]', uri, params)
      console.log('auth :::::::::::::::', headers)
      const res = await apiInstance.post(`${prefix + uri}`, params, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      if (this.tokenErrorCheck(err)) {
        var flag = await this.requestRefresh().then(
          (res) => {
            store.dispatch('info/setInfoToken', { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken });
            this.setDefaultToken()
            console.log(res)
            return true
          }
        ).catch(
          (err) => {
            return false
          }
        )
        if (flag) {
          const res = await apiInstance.post(`${prefix + uri}`, params, { headers: headers })
          return this.ResponsePayload(res)
        } else {
          this.expiredToken()
        }

      } else {
        return this.ErrorPayload(err)
      }
    }
  },
  async multiPartPost(uri, formData, headers) {
    try {
      console.log('[POST]', uri, formData)
      console.log('auth :::::::::::::::', headers)
      const res = await multiPartApiInstance.post(`${prefix + uri}`, formData, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      if (this.tokenErrorCheck(err)) {
        var flag = await this.requestRefresh().then(
          (res) => {
            store.dispatch('info/setInfoToken', { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken });
            this.setDefaultToken()
            console.log(res)
            return true
          }
        ).catch(
          (err) => {
            return false
          }
        )
        if (flag) {
          const res = await multiPartApiInstance.post(`${prefix + uri}`, formData, { headers: headers })
          return this.ResponsePayload(res)
        } else {
          this.expiredToken()
        }

      } else {
        return this.ErrorPayload(err)
      }
    }
  },

  async noneTokenPost(uri, params, headers){
    try {
      console.log('[POST]', uri, params)
      console.log('auth :::::::::::::::', headers)
      const res = await noneTokenApiInstance.post(`${prefix + uri}`, params, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      return this.ErrorPayload(err)
    }
  },

  async get(uri, params, headers) {
    try {
      console.log('[GET]', uri, params)
      const res = await apiInstance.get(`${prefix + uri}`, params, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      if (this.tokenErrorCheck(err)) {
        var flag = await this.requestRefresh().then(
          (res) => {
            store.dispatch('info/setInfoToken', { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken });
            this.setDefaultToken()
            console.log(res)
            return true
          }
        ).catch(
          (err) => {
            return false
          }
        )
        if (flag) {
          const res = await apiInstance.get(`${prefix + uri}`, params, { headers: headers })
          return this.ResponsePayload(res)
        } else {
          this.expiredToken()
        }

      } else {
        return this.ErrorPayload(err)
      }
    }
  },

  async del(uri, params, headers) {
    try {
      console.log('[DEL]', uri, params)
      const res = await apiInstance.delete(`${prefix + uri}`, { data: params }, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      if (this.tokenErrorCheck(err)) {
        var flag = await this.requestRefresh().then(
          (res) => {
            store.dispatch('info/setInfoToken', { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken });
            this.setDefaultToken()
            console.log(res)
            return true
          }
        ).catch(
          (err) => {
            return false
          }
        )
        if (flag) {
          const res = await apiInstance.delete(`${prefix + uri}`, params, { headers: headers })
          return this.ResponsePayload(res)
        } else {
          this.expiredToken()
        }

      } else {
        return this.ErrorPayload(err)
      }
    }
  },
}
export default createInstance()