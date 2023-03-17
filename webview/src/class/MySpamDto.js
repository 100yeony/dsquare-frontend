export class MySpamDto {
  // private String pKind;
  // private String idx;
  // private boolean check;
  // private String keyword;
  // private String body;
  // private String date;
  // private String time;
	constructor(initializer) {
  this.pKind = initializer.pKind;
  this.idx = initializer.idx;
  this.check = initializer.check;
  this.keyword = initializer.keyword;
  this.body = initializer.body;
  this.date = initializer.date;
  this.time = initializer.time;
	}
}
