var methods = {
  receiveMessage(message){
    alert(message)
    window.JavascriptActions.postMessage(message)
  },
  initInfo(message){
    alert(message)
    window.JavascriptActions.postMessage(message)
  }
};

export default methods;
