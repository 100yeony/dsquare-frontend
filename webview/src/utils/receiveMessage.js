import {NativeValueDto} from "@/class/NativeValueDto"
import store from "@/store";
var methods = {
  receiveMessage(message){
    alert(message)
    window.JavascriptActions.postMessage(message)
  },
  initInfo(message){
    alert(message)
    window.JavascriptActions.postMessage(message)
  },
  getNativeValueDto(key, value, type, preference){
    console.log("[getNativeValueDto] key : " , key)
    console.log("[getNativeValueDto] value : " , value)
    console.log("[getNativeValueDto] type : " , type)
    console.log("[getNativeValueDto] preference : " , preference)

    let nativeDto = new NativeValueDto({"key": key, "value": value, "type":type, "preference": preference});
    store.dispatch('info/setInfoValue',nativeDto);
    let item = store.getters['info/infoListByKey'](key);
    if(item != null) {
      console.log('[now store item] item: ' , item)
      console.log('[now store item] item.key: ' , item.key)
      console.log('[now store item] item.value: ' , item.value)
      console.log('[now store item] item.type: ' , item.type)
      console.log('[now store item] item.preference: ' , item.preference)
    }
  },
};

export default methods;
