const convertXml2JS = require('xml-js');
import { convert } from 'html-to-text';

const options = {
  wordwrap: 130,
  // ...
};
var methods = {
	isEmptyBool(str) {
		if (typeof str == "undefined" || str == null || str == "") return true;
		else return false;
	},
	isEmpty(str, defaultStr) {
		if (typeof str == "undefined" || str == null || str == "") str = defaultStr;

		return str;
	},

	trimString(str, length) {
		return str.length > length ? str.substring(0,length) : str;
	},
	htmlDecodeString(str) {
		if(str==null||str==''){
			return '';
		}
		return str
			.replaceAll('&amp;', '&')
			.replaceAll('&lt;', '<')
			.replaceAll('&gt;', '>');
	},
	// 특수문자 코드 변환
	getSpecialChar(str){
		if(str !== undefined && str !== null && str !== '') {
			str = String(str);
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
			str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
			var element = document.createElement('div');
			element.innerHTML = str;
			str = element.textContent;
			element.textContent = '';
		}
		return str;
	},
	xml2Json(result) {
		return JSON.parse(convertXml2JS.xml2json(result, {compact: true, spaces: 4}));
	},
	htmlToText(html){
		return convert(html,options )
	},
	phoneNumMask(phoneNum){
		let result = ''
		if(phoneNum.length === 10 ) {
			result = phoneNum.slice(0, 3) + "-" + phoneNum.slice(3, 4) + "**-*" + phoneNum.slice(7, 10);

		} else if (phoneNum.length == 11) {
			result = phoneNum.slice(0, 3) + "-" + phoneNum.slice(3, 5) + "**-*" + phoneNum.slice(8, 11);

		} else {
			result = phoneNum;
		}
		return result;
	},
	cutString(str, length=15){
		if(str.length > length) {
			return str.slice(0,12) + "...";
		}
		return str;
	}

};

export default methods;
