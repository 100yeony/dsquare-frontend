const sendMessage = (message) => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('android') !== -1) { // IOS 인 경우
    return WebViewBridge.showMessage(message);
  } else if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipad') !== -1) { // Android인 경우
    //return window.webkit.messageHandlers.webViewMessageHandler.postMessage(message);
    return window.Android.postMessage(message);
  } else { // 안드로이드, IOS 가 아닌 경우
     return window.opener.postMEssage(message);
  }
}
