import store from "@/store";
import bridgeUtils from '@/utils/bridgeUtils'
var methods = {
  async dialogMsgBoxOK(context , content='', title='', acceptText='확인' ){
    await context.$alert( {
      title : title,
      text : content,
      acceptText : acceptText
    })
  },
  dialogMsgConfirm(context , content='', title='', acceptText='확인', cancelText='취소'){
    const result = context.$confirm( {
      title : title,
      text : content,
      acceptText : acceptText,
      cancelText : cancelText
    }).then(res => {
      return true;
    })
    .catch(err => {
      return false;
    })
    return result;
  },
  async dialogLoginPage(){
  },

  async dialogParserFail(context, content) {
    await context.$alert( {
      title : "안내",
      text : content,
      acceptText : "확인"
    })
  },
  async dialogSystemExit(context, content){
    await context.$alert( {
      title : "알림",
      text : content,
      acceptText : "확인"
    })
    bridgeUtils.forceFinish();
  }

};

export default methods;
