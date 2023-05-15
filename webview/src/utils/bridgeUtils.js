import store from "@/store";
var methods = {
  postMessage(message,defaultValue){
    try {
      if (store.getters["info/infoSvcType"] === 'A') {
        return window.JavascriptActions.postMessage(message);
      } else if (store.getters["info/infoSvcType"] === 'I') {
        return window.webkit.messageHandlers.webViewMessageHandler.postMessage(message);
      } else {
        return window.opener.postMessage(message);
      }
    } catch(e) {
      return defaultValue
    }
  },
  savePreference(message,defaultValue){
    try {
      if (store.getters["info/infoSvcType"] === 'A') {
        return window.JavascriptActions.savePreference(message);
      } else if (store.getters["info/infoSvcType"] === 'I') {
        return window.webkit.messageHandlers.webViewMessageHandler.savePreference(message);
      } else {
        return window.opener.savePreference(message);
      }
    } catch(e) {
      return defaultValue
    }
  },
  forceFinish(){
    try {
      if (store.getters["info/infoSvcType"] === 'A') {
        return window.JavascriptActions.forceFinish();
      } else if (store.getters["info/infoSvcType"] === 'I') {
        return window.webkit.messageHandlers.webViewMessageHandler.forceFinish();
      } else {
        return window.opener.forceFinish();
      }
    } catch(e) {
      return defaultValue
    }
  },
  removeServiceCancel(){// 서비스 해제 시 호출.
    try {
      if (store.getters["info/infoSvcType"] === 'A') {
        return window.JavascriptActions.removeServiceCancel();
      } else if (store.getters["info/infoSvcType"] === 'I') {
        return window.webkit.messageHandlers.webViewMessageHandler.removeServiceCancel();
      } else {
        return window.opener.removeServiceCancel();
      }
    } catch(e) {
      return defaultValue
    }

  },
  checkPermission(message, defaultValue){
    try {
      if (store.getters["info/infoSvcType"] === 'A') {
        return window.JavascriptActions.checkPermission(message);
      } else if (store.getters["info/infoSvcType"] === 'I') {
        return window.webkit.messageHandlers.webViewMessageHandler.checkPermission(message);
      } else {
        return window.opener.checkPermission(message);
      }
    } catch(e) {
      return defaultValue
    }
  },
  saveAccessToken(token){
    try {
      // if (store.getters["info/infoSvcType"] === 'A') {
      //   return window.JavascriptActions.saveAccessToken(token);
      // } else if (store.getters["info/infoSvcType"] === 'I') {
      //   return window.webkit.messageHandlers.webViewMessageHandler.saveAccessToken(token);
      // } else {
      //   return window.opener.saveAccessToken(token);
      // }
      // 지금은 android only만 남겨둠.
      return window.JavascriptActions.saveAccessToken(token);
    } catch(e) {
      console.log(e)
      return 
    }
  },
  saveRefreshToken(token){
    try {
      // if (store.getters["info/infoSvcType"] === 'A') {
      //   return window.JavascriptActions.saveRefreshToken(token);
      // } else if (store.getters["info/infoSvcType"] === 'I') {
      //   return window.webkit.messageHandlers.webViewMessageHandler.saveRefreshToken(token);
      // } else {
      //   return window.opener.saveRefreshToken(token);
      // }  
      // 지금은 android only만 남겨둠.
      return window.JavascriptActions.saveRefreshToken(token);
    } catch(e) {
      console.log(e)
      return 
    }
  },
  sendRegistrationToken(userId){
    try {
      return window.JavascriptActions.sendRegistrationToken(userId);
    } catch(e) {
      console.log(e)
      return 
    }
  }

};

export default methods;
