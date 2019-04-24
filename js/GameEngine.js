var zhuang;
var cards = [];
var canvas;
var cxt
function initGame() {
	canvas = document.getElementById('box');
	cxt = canvas.getContext('2d');
	initCards();
	LoadImage();
	LoadAudio();

	//庄家
	zhuang = 1;
}

/**
 * 加载图片资源
 */
function LoadImage() {
	cardbg_img = new Image();
	cardbg_img.src = "./images/card_bg.png";
	img_hu = new Image(); img_hu.src = "./images/bt_hu.png";
	img_hu1 = new Image(); img_hu1.src = "./images/bt_hu1.png";
	img_peng = new Image();img_peng.src = "./images/bt_peng.png";
	img_peng1 = new Image();img_peng1.src = "./images/bt_peng1.png";
	img_gang = new Image();img_gang.src = "./images/bt_gang.png";
	img_gang1 = new Image();img_gang1.src = "./images/bt_gang1.png";
	img_zhuang = new Image();img_zhuang.src = "./images/zhuang.png";
}

function LoadAudio() {
	mp3_getcard = new Audio("./mp3/getcard.mp3"); 
	mp3_click = new Audio("./mp3/click.mp3");
	mp3_peng = new Audio("./mp3/gpeng.mp3");
	mp3_gang = new Audio("./mp3/ggang.mp3");
	mp3_zimo = new Audio("./mp3/gzimo.mp3");
	mp3_fangpao = new Audio("./mp3/gfangpao.mp3");
}

function initCards() {
	for (let n = 0; n < 4; n++) {
		for (let m = 1; m < 10; m++) {
			if (n == 3 && m > 7) 
				break;
			let card = getCard(n, m);
			cards.push(card, card, card, card);//顺入4张
		}

	}
}

function getCard(type, value) {
	let img = new Image();
	img.src = "./png/" + type + "_" + value + ".png";
	let audio = new Audio("./mp3/" + type + "_" + value + ".mp3" );
	let card = new Card(type, value, img, audio);
	return card;
}