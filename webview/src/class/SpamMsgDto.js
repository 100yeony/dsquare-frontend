import stringUtils from "@/utils/stringUtils";
export class SpamMsgDto {
  // private String key1;
  // private String key2;
  // private String id;
  // private String sPhone;
  // private String msg;
  // private String sTime;
  // private boolean check;
  // private String msgType;
  // private String rPhone;
  // // [v2.1.0] KISA 다중신고 관련 변수 추가
  // private String rTime;
  // // Detail 사용
  // private String filter;
  // private String filter_reason;
  // private String filter_condition;
  // private ArrayList<String> alBoundry = new ArrayList<String>();
  // private ArrayList<String> alFiletype = new ArrayList<String>();
  // private ArrayList<String> alMsgContent = new ArrayList<String>();
	constructor(initializer) {
  this.key1 = initializer.key1;
  this.key2 = initializer.key2;
  this.id = initializer.id;
  this.sPhone = initializer.sPhone;
  this.title = stringUtils.cutString(initializer.msg._cdata)
  this.msg = initializer.msg;
  this.sTime = initializer.sTime;
  this.check = initializer.check;
  this.msgType = initializer.msgType;
  this.rPhone = initializer.rPhone;
  this.rTime = initializer.rTime;
  this.filter = initializer.filter;
  this.filter_reason = initializer.filter_reason;
  this.filter_condition = initializer.filter_condition;
  this.alBoundry = initializer.alBoundry;
  this.alFiletype = initializer.alFiletype;
  this.alMsgContent = initializer.alMsgContent;
	}
}
