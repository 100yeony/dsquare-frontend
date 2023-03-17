var methods = {
  isEmptyToNull(obj){
    if(obj === null || obj === undefined || obj === '') return null;
    return obj;
  },
	isEmpty(obj) {
    if(obj === null || obj === undefined || obj === '') return false;
		return Object.keys(obj).length === 0 && obj.constructor === Object
	},

};

export default methods;
