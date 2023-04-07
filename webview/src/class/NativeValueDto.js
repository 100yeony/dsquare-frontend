/**
 * @author kkw
 * @do data native-> web 시 전달 기초 구조.
 */
export class NativeValueDto {
  constructor(initializer) {
    this.key = initializer.key;
    this.value = initializer.value;
    this.type = initializer.type;
    this.preference = initializer.preference;
  }
  toString(){
    return "key="+this.key+"&value="+this.value+"&type="+this.type+"&preference"+this.preference
  }
}
