/**
 * 麻将牌类
 * @param type 类型
 * @param value 数值
 * @param img 图片
 * @param ado 音频
 */
function Card(type, value, img, ado) {
	this.type = type;
	this.value = value;
	this.img = img;
	this.ado = ado;
	this.draw = function(x, y) {
		cxt.drawImage(this.img, x. y);
	}
	this.drawex = function(x, y, w, h) {

	}
	this.drawbg = function() {

	}
	this.play = function() {
		this.ado.play();
	}
}