//可以用枚举实现
var gameStatus = {
	sessioninit: 1, //游戏开始状态，清空和计数清零
	sendcard: 2,
	com1: 7,
	com2: 8,
	human1: 9,
	human2: 10,
	seamo: 11,
	nohu: 12,
	sessionend: 13,
	score: 14 //和牌计分
}

//当前游戏状态
var m_gameStatus = gameStatus.sessioninit;

var computer = new CellPlay(10000, 1);
var play = new CellPlay(5000, 2);
var desktop;
//游戏主计时器
//计时器1,负责游戏界面的刷新
// var m_timeout_0 = window.setInterval("display()", 50);
//计时器2,负责游戏逻辑的判断，通过状态来进行相应的处理
var m_timeout_1 = window.setInterval("runGame()", 500);
function runGame() {
	console.log("游戏状态:", m_gameStatus);
	switch(m_gameStatus) {
		case gameStatus.sessioninit: {
			initSessionInit();
			m_gameStatus = gameStatus.sendcard;//进入发牌阶段
			break;
		}
		case gameStatus.sendcard: {
			sendCard();
			//状态的更新在哪里?
			break;
		}
		case gameStatus.com1: { //电脑的碰，杠阶段
			//初始化碰、杠、胡的状态
			can_peng = false;
			can_gang = false;
			can_hu = false;
			//电脑进行
			comProcess();
			break;
		}
		case gameStatus.com2: { //等待电脑出牌状态
			comShowCard(); //电脑进行出牌
			break;
		}
		case gameStatus.human1: { //进入玩家操作阶段
			if (checkPeng(player, computer.outcard)) {
				can_peng = true;
			}
			if (checkGang(player,3, computer.outcard)) {
				can_gang = true;
			}
			if (checkHu(player, computer.outcard)) {
				can_hu = true;
			}
			break;
		}
		case gameStatus.human2: {//等待玩家出牌阶段
			can_peng = false;
			break
		}
		case gameStatus.sessionend: { //计分阶段
			scoreSession();
			break;
		}

	}
}

//碰牌检测
function checkPeng(p, xcard) {
	if (xcard = null) return false;
	var count = 0;
	for (let n = 0; n < p.blackList.length; n++) {
		if (p.blackList[i].type == xcard.type  && p.blackList[i].value == xcard.value ) {
			count ++;
		} 
	} 
	if (count == 2) return true;
	return false;
}

/**
 * 吃牌检测；判断**1、*1*、1**成立的情况返回true
 */
function checkEat(p, xcard) {

}

/**
 * 和牌算法
 * @param p: 玩家
 * @param xcard: 牌
 */
 var mk = [];
 function checkHu(p, xcard) {
 	//统计所有手牌以及对方刚出的牌和总和
 	for (let n = 0; n < 38; n++) {
 		mk[n] = 0;
 	}
 	for (let i = 0; i < p.blackList.length; p++) {
 		var index = p.blackList[i].value + p.blackList[i].type * 10;
 		mk[index] ++;
 	}
 	if (xcard != null) {
 		mk[xcard.value + xcard.type * 10] ++;
 	}
 	var jiang = 0;
 	if (isHu()) return true;
 	return false;
 }

 /**
  * 利用递归的形式来判断是否胡牌
  * 胡牌的标准是mk数组中的牌数量为0;
  */
 function isHu() {
 	var flag = 0;
 	if (mkCount() == 0) return true;
 	for (let n = 0; n < mk.length; n++) {
 		if (mk[n] > 0) {
 			flag = n;
 			break;
 		}
 	}
 	//判断组成刻字的情况能否胡牌
 	if (mk[flag] >= 3) {
 		mk[flag] -= 3;
 		if (isHu()) return true;
 		mk[flag] += 3;
 	}
 	if (mk[flag] >= 2 && jiang == 0) {
 		jiang == 1;
 		mk[flag] -= 2;
 		if (isHu()) return true;
 		jiang == 0;
 		mk[flag] += 2;
 	}

 	//字牌以后不需要进行顺子判断
 	if (flag >= 30) return false;
 	if (flag < 8 && mk[flag + 1] >= 1 && mk[flag + 2] >=1) {
 		mk[flag] -= 1;
 		mk[flag + 1] -= 1;
 		mk[flag + 2] -= 1;
 		if (isHu()) return true;
 		mk[flag] += 1;
 		mk[flag + 1] += 1;
 		mk[flag + 2] += 1;
 	}
 	return false;
 }

 /**
  * @return mk数组中的牌数
  */
 function mkCount() {
 	let count = 0;
 	for (let n = 0; n < mk.length; n++) {
 		count += mk[n];
 	}
 	return count;
 }

 /**
  * 电脑的智能出牌
  * @param lsit: 出牌玩家的暗牌列表
  * @return 返回出牌的list下标
  */
 function comOutCard(list) {
 	var mk = [];
 	for (let n = 0; n < 38; n++) {
 		mk[n] = 0;
 	}

 	for (let n = 0; n < list.length; n++) {
 		let index = list[n].value + list[n].type * 10;
 		mk[index] ++;
 	}
	//找到单张的字牌，有则返回字牌的下标
 	for (let n = 30; n < 38; n++) {
 		if (mk[n] == 1)
 			return findIndex(list, 3, n - 30);
 	}
 	//排除组成刻字或者顺子的牌,不用考虑字牌
 	for (let i = 0; i < 3; i++) {
 		for (let j = 0; j < 10; j++) {
 			if (mk[i * 10 + j] >=3)
 				mk[i * 10 + j] -=3;
 			if (j < 8 && mk[i * 10 + j] >= 1 && mk[i * 10 + j + 1] >= 1 && mk[i * 10 + j + 2] >= 1 ) {
 				mk[i * 10 + j] -= 1;
 				mk[i * 10 + j + 1] -= 1;
 				mk[i * 10 + j + 2] -= 1
 			}
 		}
 	}

 	//找到单张的万、筒、条
 	for (let n = 0; n < 30; n++) {
 		if (mk[n] == 1)
 			return findIndex(list, Math.floor(n / 10), n % 10);
 	}

 	//找到双张的牌
 	for (let i = 3; i > 0; i--) {
 		for (let j = 0; j < 10; j++) {
 			if (mk[i * 10 + j] ==2)
 				return findIndex(list, i, j);
 		}
 	}

 	//随机找一张牌打出
 	let k = Math.floor(Math.random() * list.length);
 	return k;
 }

 function findIndex(list, type, value) {
 	let index = -1;
 	for (let n = 0; n< list.length; n++) {
 		if (list[n].value == value && list[n].type == type) {
 			index = n;
 			break;
 		}
 	}
 	return index;
 }


/**
 * 冒泡排序
 */
 function sortList(L) {
 	for (let n = 0; n < L.length; n++) {
 		for (let m = n + 1; m < L.length; m++) {
 			if (L[n].type > L[m].type || (L[n].type == L[m].type && L[n].value > L[m].value) ) {
 				let temp = L[n];
 				L[n] = L[M];
 				L[m] = L[n];
 			}
 		}
 	}
 }

 /**
  * 统计某一张牌的个数
  * @return count 牌的个数
  */
  function countCard(L, xcard) {
  	let count = 0;
  	for (let n = 0; n < L.length; n++) {
  		if (L[n].type == xcard.type && L[n].value == xcard.value) {
  			count ++;
  		}
  	}
  	return count;
  }

 /**
  * 统计索引号为index的牌的个数
  */
  function cardCountList(L, index) {
  	if (index < 0 || index >= L.lentgh) {
  		console.warn("index is out!");
  	}
  	return countCard(L, L[index]);
  }

  // var play;
  // var computer;
  function initSessionInit() {
  	// computer = new CellPlay(10000, 1);
  	// play = new CellPlay(5000, 2);
  	desktop = new DeskTop();//初始化桌面

  	// if (winner != null) {
  	// 	zhuang = winner.id;
  	// }
  	// winner = null;
  	// loser = null;
  	// xxs = 0;
  	// zipai = 0;
  	// gangpai = 0;
  	// sscore = 0;
  	// clickpos = 0;
  	//清空玩家暗牌和已出的牌

  	computer.clearList();
  	play.clearList();

  	can_peng = false;
  	can_gang = false;
  	can_hu = false;

  	//加入初始的136张牌
  	for (let n = 0; n < cards.length; n++) {
  		desktop.cardList.push(cards[n]);
  	}
  	//洗牌
  	desktop.cardList.sort(function (a, b) {
  		return Math.random() > 0.5 ? 1 : -1;
  	})
  	//清理出最后的16张牌
  	for (let n = 0; n < 16; n++) {
  		let card = desktop.cardList.pop();
  		desktop.seaList.push(card);
  	}
  	console.log("%c牌桌信息:", "color: red;font-size:2em");
  	console.log(desktop);
  }

/**
 * 发牌
 */
 function sendCard() {
 	
 }