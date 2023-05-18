import axios from 'axios'
import store from "@/store";
import router from "@/router/index";
import bridgeUtils from '@/utils/bridgeUtils';
import { NativeValueDto } from "@/class/NativeValueDto"
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
const baseURL = process.env.VUE_APP_BASE_URL
const pendingRequests = []
var apiInstance
var multiPartApiInstance
var noneTokenApiInstance
var textPlainApiInstance

function setAxiosInterceptor(instance) {
  instance.interceptors.request.use(
    (config) => {
      store.dispatch('info/setInfoWaitingNum', store.getters['info/infoWaitingNum'] + 1)

      const source = axios.CancelToken.source();
      config.cancelToken = source.token
      pendingRequests.push(source);

      return config
    },
    (error) => {
      return error
    }
  )
  instance.interceptors.response.use(
    async (response) => {
      store.dispatch('info/setInfoWaitingNum', store.getters['info/infoWaitingNum'] - 1)
      const requestToken = response.config.cancelToken;
      removePendingRequest(requestToken);

      return response
    },
    async (error) => {
      store.dispatch('info/setInfoWaitingNum', store.getters['info/infoWaitingNum'] - 1)
      const requestToken = error.config.cancelToken;
      removePendingRequest(requestToken);

      if (tokenExpiredCheck(error)) {
        cancelAllRequests()
        requestRefresh().then((res) => {
          if ([200, 201, 202].includes(res.status)) {
            setTokenState(res.data.accessToken, res.data.refreshToken)
            setDefaultToken()
            refreshPage()
          } else {
            console.log('you should go to login')
            expiredToken()
          }
        }).catch((err) => {
          console.log('you should go to login')
          expiredToken()
        })
      } else {
        cancelAllRequests()
        expiredToken()
      }
      return error
    }
  )
}
function refreshPage() {
  router.go();
}

function removePendingRequest(requestToken) {
  const index = pendingRequests.findIndex(source => source.token === requestToken);
  if (index !== -1) {
    pendingRequests.splice(index, 1);
  }
}

function cancelAllRequests() {
  pendingRequests.forEach(source => {
    source.cancel("request's canceled");
  });
  pendingRequests.length = 0;
}

function setDefaultToken() {
  var accessToken = store.getters['info/infoListByKey']('accessToken')
  var accessTokenValue = (typeof accessToken == 'undefined') ? '' : accessToken.value
  console.log('setDefaultToken=> ' + accessTokenValue)
  apiInstance = axios.create({
    baseURL: baseURL,
    headers: { Authorization: 'Bearer ' + accessTokenValue }
  })
  multiPartApiInstance = axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: 'Bearer ' + accessTokenValue,
      'Content-Type': 'multipart/form-data'
    }
  })
  setAxiosInterceptor(apiInstance)
  setAxiosInterceptor(multiPartApiInstance)
}

function setTokenState(accessToken, refreshToken) {
  let accessTokenNativeDto = new NativeValueDto({ "key": 'accessToken', "value": accessToken, "type": 'P', "preference": 'pref_key_access_token' });
  store.dispatch('info/setInfoValue', accessTokenNativeDto);
  bridgeUtils.saveAccessToken(accessToken);

  let refreshTokenNativeDto = new NativeValueDto({ "key": 'refreshToken', "value": refreshToken, "type": 'P', "preference": 'pref_key_refresh_token' });
  store.dispatch('info/setInfoValue', refreshTokenNativeDto);
  bridgeUtils.saveRefreshToken(refreshToken);
}

function tokenExpiredCheck(err) {
  if (err?.response?.data?.code == 401 || err?.response?.status == 401) {// 후에 code 변경
    console.log("it's token expired")
    return true
  } else {
    return false
  }
}

function expiredToken() {
  store.dispatch('info/setInfoListBlank'); // 토큰값을 제거해줍니다.
  console.log('expiredToken')
  router.push(process.env.VUE_APP_LOGIN);
}

async function requestRefresh() {
  let refreshToken = store.getters['info/infoListByKey']('refreshToken')
  const instance = axios.create({
    baseURL: baseURL
  })
  const res = await instance.post('auth/refresh', { refreshToken: refreshToken.value })
  return res
}

function createInstance() {
  var accessToken = store.getters['info/infoListByKey']('accessToken')
  var accessTokenValue = (typeof accessToken == 'undefined') ? '' : accessToken.value
  console.log(accessToken)
  console.log('baseURL', baseURL)
  //var token = store.getters["info/infoToken"]
  apiInstance = axios.create({
    baseURL: baseURL,
    headers: { Authorization: 'Bearer ' + accessTokenValue }
  })

  multiPartApiInstance = axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: 'Bearer ' + accessTokenValue,
      'Content-Type': 'multipart/form-data'
    }
  })

  noneTokenApiInstance = axios.create({
    baseURL: baseURL
  })

  textPlainApiInstance = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'text/plain'
    }
  })

  setAxiosInterceptor(apiInstance)
  setAxiosInterceptor(multiPartApiInstance)
  setAxiosInterceptor(noneTokenApiInstance)
  setAxiosInterceptor(textPlainApiInstance)


  return fn
}

const fn = {
  ResponsePayload(res) {
    console.log('ResponsePayload', res)
    return res
  },
  ErrorPayload(err) {
    if (axios.isCancel(err)) {
      console.log('is canceled')
    } else {
      console.log('ErrorPayload', err)
    }
    return err.response
  },
  async post(uri, params, headers) {
    try {
      const res = await apiInstance.post(`${prefix + uri}`, params, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      return this.ErrorPayload(err)
    }

  },
  async multiPartPost(uri, formData, headers) {
    try {
      const res = await multiPartApiInstance.post(`${prefix + uri}`, formData, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      return this.ErrorPayload(err)
    }

  },

  async multiPartPatch(uri, formData, headers) {
    try {
      const res = await multiPartApiInstance.patch(`${prefix + uri}`, formData, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      return this.ErrorPayload(err)
    }
  },

  async noneTokenPost(uri, params, headers) {
    try {
      const res = await noneTokenApiInstance.post(`${prefix + uri}`, params, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      return this.ErrorPayload(err)
    }
  },
  async noneTokenDel(uri, params, headers) {
    try {
      const res = await noneTokenApiInstance.delete(`${prefix + uri}`, { data: params }, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      return this.ErrorPayload(err)
    }
  },

  async textPlainPost(uri, params, headers) {
    try {
      const res = await textPlainApiInstance.post(`${prefix + uri}`, params, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      return this.ErrorPayload(err)
    }

  },
  async get(uri, params, headers) {
    try {
      const res = await apiInstance.get(`${prefix + uri}`, params, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      return this.ErrorPayload(err)
    }

  },

  async del(uri, params, headers) {
    try {
      const res = await apiInstance.delete(`${prefix + uri}`, { data: params }, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      return this.ErrorPayload(err)
    }

  },
  async patch(uri, params, headers) {
    try {
      const res = await apiInstance.patch(`${prefix + uri}`, params, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      return this.ErrorPayload(err)
    }

  },
  async noneTokenPatch(uri, params, headers) {
    try {
      const res = await noneTokenApiInstance.patch(`${prefix + uri}`, params, { headers: headers })
      return this.ResponsePayload(res)
    } catch (err) {
      return this.ErrorPayload(err)
    }

  },
}
export default createInstance()
