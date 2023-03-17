import store from "@/store";
var methods = {
  postMessage(message,defaultValue){
    try {
      if (store.getters["info/infoSvcType"] === 'A') {
        return Android.postMessage(message);
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
        return Android.savePreference(message);
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
        return Android.forceFinish();
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
        return Android.removeServiceCancel();
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
        return Android.checkPermission(message);
      } else if (store.getters["info/infoSvcType"] === 'I') {
        return window.webkit.messageHandlers.webViewMessageHandler.checkPermission(message);
      } else {
        return window.opener.checkPermission(message);
      }
    } catch(e) {
      return defaultValue
    }
  }

};

export default methods;
