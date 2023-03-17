export class SpamAllowDto {
  // private String pKind;
  // private String idx;
  // private String keyWord;
  // private String comment;
  // private String replaceType;
  // private String regdate;
  constructor(initializer) {
    this.pKind = initializer.pKind;
    this.idx = initializer.idx;
    this.keyWord = initializer.keyWord;
    this.comment = initializer.comment;
    this.replaceType = initializer.replaceType;
    this.regdate = initializer.regdate;
  }
}
