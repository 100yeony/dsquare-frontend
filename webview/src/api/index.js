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
var apiInstance
var multiPartApiInstance
var noneTokenApiInstance
var textPlainApiInstance

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

  return fn
}

const fn = {
  ResponsePayload(res) {
    console.log('ResponsePayload', res)
    return res
  },
  ErrorPayload(err) {
    console.log('ErrorPayload', err)
    return err.response
  },
  tokenErrorCheck(err) {
    if (err?.response?.data?.code == 401 || err?.response?.status == 401) {// 후에 code 변경
      console.log("it's token expired")
      return true
    } else {
      return false
    }
  },
  async requestRefresh() {
    let refreshToken = store.getters['info/infoListByKey']('refreshToken')
    console.log('requestRefresh', refreshToken)
    apiInstance = axios.create({
      baseURL: baseURL
    })
    const res = await apiInstance.post('auth/refresh', { refreshToken: refreshToken.value })
    console.log(res.data.accessToken)
    return res
  },
  async doRefreshWork(doRequest, uri, params, headers) {
    var flag = true
    try {
      var res = await this.requestRefresh()
    } catch(error) {
      console.log(error)
      if ([400, 409].includes(error.response.status)){
        flag = false
      } else {
        this.expiredToken()
        return 
      }
    }

    console.log(flag)

    if (flag) {
      this.setTokenState(res.data.accessToken, res.data.refreshToken)
      this.setDefaultToken()
    } 

    try {
      const res = await doRequest(uri, params, headers)
    console.log(res)
    return this.ResponsePayload(res)
    } catch(error) {
      console.log(error)
      this.expiredToken()
    }
  },
  getBaseUrl() {
    return apiInstance.defaults.baseURL
  },
  setDefaultToken() {
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
  },
  setTokenState(accessToken, refreshToken) {
    let accessTokenNativeDto = new NativeValueDto({ "key": 'accessToken', "value": accessToken, "type": 'P', "preference": 'pref_key_access_token' });
    store.dispatch('info/setInfoValue', accessTokenNativeDto);
    bridgeUtils.saveAccessToken(accessToken);

    let refreshTokenNativeDto = new NativeValueDto({ "key": 'refreshToken', "value": refreshToken, "type": 'P', "preference": 'pref_key_refresh_token' });
    store.dispatch('info/setInfoValue', refreshTokenNativeDto);
    bridgeUtils.saveRefreshToken(refreshToken);
  },
  expiredToken() {
    store.dispatch('info/setInfoListBlank'); // 토큰값을 제거해줍니다.
    router.push(process.env.VUE_APP_LOGIN);
  }
  ,
  async post(uri, params, headers) {

    const doPost = async (uri, params, headers) => {
      return await apiInstance.post(`${prefix + uri}`, params, { headers: headers })
    }
    try {
      const res = await doPost(uri, params, headers)
      return this.ResponsePayload(res)
    } catch (err) {
      if (this.tokenErrorCheck(err)) {
        var r = await this.doRefreshWork(doPost, uri, params, headers)
        console.log(r)
        return r
      } else {
        return this.ErrorPayload(err)
      }
    }

  },
  async multiPartPost(uri, formData, headers) {

    const doMultiPartPost = async (uri, formData, headers) => {
      return await multiPartApiInstance.post(`${prefix + uri}`, formData, { headers: headers })
    }
    try {
      const res = await doMultiPartPost(uri, formData, headers)
      return this.ResponsePayload(res)
    } catch (err) {
      if (this.tokenErrorCheck(err)) {
        return await this.doRefreshWork(doMultiPartPost, uri, formData, headers)
      } else {
        return this.ErrorPayload(err)
      }
    }

  },

  async noneTokenPost(uri, params, headers) {
    const doNoneTokenPost = async (uri, params, headers) => {
      return await noneTokenApiInstance.post(`${prefix + uri}`, params, { headers: headers })
    }
    try {
      const res = await doNoneTokenPost(uri, params, headers)
      return this.ResponsePayload(res)
    } catch (err) {
      return this.ErrorPayload(err)

    }
  },
  async noneTokenDel(uri, params, headers) {
    const doNoneTokenDel = async (uri, params, headers) => {
      return await noneTokenApiInstance.delete(`${prefix + uri}`, { data: params }, { headers: headers })
    }
    try {
      const res = await doNoneTokenDel(uri, params, headers)
      return this.ResponsePayload(res)
    } catch (err) {
      return this.ErrorPayload(err)

    }
  },
  
  async textPlainPost(uri, params, headers) {

    const doTextPlainPost = async (uri, params, headers) => {
      return await textPlainApiInstance.post(`${prefix + uri}`, params, { headers: headers })
    }
    try {
      const res = await doTextPlainPost(uri, params, headers)
      return this.ResponsePayload(res)
    } catch (err) {
      if (this.tokenErrorCheck(err)) {
        return await this.doRefreshWork(doTextPlainPost, uri, params, headers)
      } else {
        return this.ErrorPayload(err)
      }
    }

  },
  async get(uri, params, headers) {

    const doGet = async (uri, params, headers) => {
      return await apiInstance.get(`${prefix + uri}`, params, { headers: headers })
    }
    try {
      console.log('[GET]', uri, params)
      console.log(apiInstance.config)
      const res = await doGet(uri, params, headers)
      return this.ResponsePayload(res)
    } catch (err) {
      if (this.tokenErrorCheck(err)) {
        return await this.doRefreshWork(doGet, uri, params, headers)
      } else {
        return this.ErrorPayload(err)
      }
    }

  },

  async del(uri, params, headers) {

    const doDel = async (uri, params, headers) => {
      return await apiInstance.delete(`${prefix + uri}`, { data: params }, { headers: headers })
    }
    try {
      const res = await doDel(uri, params, headers)
      return this.ResponsePayload(res)
    } catch (err) {
      if (this.tokenErrorCheck(err)) {
        return await this.doRefreshWork(doDel, uri, params, headers)
      } else {
        return this.ErrorPayload(err)
      }
    }

  },
  async patch(uri, params, headers) {

    const doPatch = async (uri, params, headers) => {
      return await apiInstance.patch(`${prefix + uri}`, params, { headers: headers })
    }
    try {
      const res = await doPatch(uri, params, headers)
      return this.ResponsePayload(res)
    } catch (err) {
      if (this.tokenErrorCheck(err)) {
        return await this.doRefreshWork(doPatch, uri, params, headers)
      } else {
        return this.ErrorPayload(err)
      }
    }

  },
  async noneTokenPatch(uri, params, headers) {

    const doPatch = async (uri, params, headers) => {
      return await noneTokenApiInstance.patch(`${prefix + uri}`, params, { headers: headers })
    }
    try {
      const res = await doPatch(uri, params, headers)
      return this.ResponsePayload(res)
    } catch (err) {
      
        return this.ErrorPayload(err)
      
    }

  },
}
export default createInstance()
