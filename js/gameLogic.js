//可以用枚举实现
var gameStatus = {
    sessioninit: 1,    //游戏开始状态，清空和计数清零
    sendcard: 2,	   //发牌阶段
    com1: 7,		   //电脑处理阶段
    com2: 8,           //电脑出牌阶段
    human1: 9,		   //玩家处理阶段
    human2: 10,        //玩家出牌阶段
    seamo: 11,		   //自摸？
    nohu: 12,    	   //荒庄阶段
    sessionend: 13,
    score: 14 		   //和牌计分
}

//当前游戏状态
var m_gameStatus = gameStatus.sessioninit;

var computer = new CellPlay(10000, 1);
var play = new CellPlay(5000, 2);
var desktop;
var sendtick = 0;
var jiang;
var winner;
var loser;
var clickpos;

var can_peng;
var can_gang;
var can_hu;

//游戏属性
var is_mengqing;
var is_qing;
var is_hun;
var ke_zi;
var sscore;
var tcls;
var xxs;
var zipai;
var gangpai;

//游戏主计时器
//计时器1,负责游戏界面的刷新
var m_timeout_0 = window.setInterval("display()", 50);
//计时器2,负责游戏逻辑的判断，通过状态来进行相应的处理
var m_timeout_1 = window.setInterval("runGame()", 500);

function runGame() {
    // console.log(computer.m_blackList.length);
    // console.log(play.m_blackList.length);
    switch (m_gameStatus) {
        case gameStatus.sessioninit: {
            initSessionInit();
            m_gameStatus = gameStatus.sendcard;//进入发牌阶段
            break;
        }
        case gameStatus.sendcard: {
            sendCard();
            break;
        }
        case gameStatus.com1: { //电脑的碰，杠阶段
            //初始化碰、杠、胡的状态
            can_peng = false;
            can_gang = false;
            can_hu = false;
            //电脑进行
            comProcess(computer);
            break;
        }
        case gameStatus.com2: { //等待电脑出牌状态
            comShowCard(computer); //电脑进行出牌
            break;
        }
        case gameStatus.human1: { //进入玩家操作阶段
            if (checkPeng(play, computer.outcard)) {
                can_peng = true;
            }
            if (checkGang(play, 3, computer.outcard)) {
                can_gang = true;
            }
            if (checkHu(play, computer.outcard)) {
                can_hu = true;
            }
            comProcess(play);
            break;
        }
        case gameStatus.human2: {//等待玩家出牌阶段
            can_peng = false;
            comShowCard(play);
            break
        }
        case gameStatus.score: { //计分阶段
            scoreSession();
            m_gameStatus = gameStatus.sessionend
            break;
        }

    }
}

//碰牌检测
function checkPeng(p, xcard) {
    if (xcard == null) return false;
    var count = 0;
    for (let n = 0; n < p.m_blackList.length; n++) {
        if (p.m_blackList[n].type == xcard.type && p.m_blackList[n].value == xcard.value) {
            count++;
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
    for (let i = 0; i < p.m_blackList.length; i++) {
        var index = p.m_blackList[i].value + p.m_blackList[i].type * 10;
        mk[index]++;
    }
    if (xcard != null) {
        mk[xcard.value + xcard.type * 10]++;
    }
    jiang = 0;
    if (isHu()) {
        return true;
    } else if (Is_Qidui()) {
        return true;
    }
    return false;
}

function Is_Qidui() {
    var ps = 0;
    for (var i = 0; i < 38; i++) {
        if (mk[i] > 0) {
            if (mk[i] == 2) {
                ps = ps + 1;
            }
            else if (mk[i] == 4) {
                ps = ps + 2;

            }
            else {
                return false;
            }
        }
    }

    if (ps == 7)
        return true;
    else
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
    if (flag % 10 < 8 && mk[flag + 1] >= 1 && mk[flag + 2] >= 1) {
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
function comoutcard(list) {
    var mk = [];
    for (let n = 0; n < 38; n++) {
        mk[n] = 0;
    }

    for (let n = 0; n < list.length; n++) {
        let index = list[n].value + list[n].type * 10;
        mk[index]++;
    }
    //找到单张的字牌，有则返回字牌的下标
    for (let n = 31; n < 38; n++) {
        if (mk[n] == 1)
            return findIndex(list, 3, n - 30);
    }
    //排除组成刻字或者顺子的牌,不用考虑字牌
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 10; j++) {
            if (mk[i * 10 + j] >= 3)
                mk[i * 10 + j] -= 3;
            if (j < 8 && mk[i * 10 + j] >= 1 && mk[i * 10 + j + 1] >= 1 && mk[i * 10 + j + 2] >= 1) {
                mk[i * 10 + j] -= 1;
                mk[i * 10 + j + 1] -= 1;
                mk[i * 10 + j + 2] -= 1
            }
        }
    }

    //找到单张的万、筒、条
    for (let n = 0; n < 30; n++) {
        //优先不能组成连续的
        let ary = [];
        let ary1 = [];
        if (mk[n] == 1) {
            if (n > 0) {
                if (mk[n + 1] == 0 && mk[n - 1] == 0) {
                    ary.push(findIndex(list, Math.floor(n / 10), n % 10));
                } else {
                    ary1.push(findIndex(list, Math.floor(n / 10), n % 10));
                }
            } else {
                if (mk[n + 1] == 0) {
                    ary.push(findIndex(list, Math.floor(n / 10), n % 10));
                } else {
                    ary1.push(findIndex(list, Math.floor(n / 10), n % 10));
                }
            }
            if (ary.length > 0) {
                return ary[Math.floor(Math.random() * ary.length)];
            } else {
                return ary1[Math.floor(Math.random() * ary1.length)];
            }
            // return findIndex(list, Math.floor(n / 10), n % 10);
        }
    }

    //找到双张的牌
    for (let i = 3; i > 0; i--) {
        for (let j = 0; j < 10; j++) {
            if (mk[i * 10 + j] == 2)
                return findIndex(list, i, j);
        }
    }

    //随机找一张牌打出
    let k = Math.floor(Math.random() * list.length);
    return k;
}

function findIndex(list, type, value) {
    let index = -1;
    for (let n = 0; n < list.length; n++) {
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
// function sortCard(L) {
// 	for (let n = 0; n < L.length; n++) {
// 		for (let m = n + 1; m < L.length; m++) {
// 			if (L[n].type > L[m].type || (L[n].type == L[m].type && L[n].value > L[m].value) ) {
// 				let temp = L[n];
// 				L[n] = L[m];
// 				L[m] = L[n];
// 			}
// 		}
// 	}
// }

/**
 * 统计某一张牌的个数
 * @return count 牌的个数
 */
function countCard(L, xcard) {
    let count = 0;
    for (let n = 0; n < L.length; n++) {
        if (L[n].type == xcard.type && L[n].value == xcard.value) {
            count++;
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
    computer = new CellPlay(10000, 1);
    play = new CellPlay(5000, 2);
    desktop = new DeskTop();//初始化桌面

    if (winner != null) {
        zhuang = winner.id;
    }
    winner = null;
    loser = null;
    is_mengqing = false;

    is_qing = false;
    is_hun = false;
    ke_zi = 0;
    sscore = 0;
    xxs = 0;
    zipai = 0;
    gangpai = 0;
    // sscore = 0;
    // clickpos = 0;
    //清空玩家暗牌和已出的牌

    computer.clearList();
    play.clearList();

    can_peng = false;
    can_gang = false;
    can_hu = false;

    // test();
    // return;

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
    //游戏发牌函数进行操作
    sendtick += 1;
    if (sendtick < 4) {
        for (let n = 0; n < 4; n++) {
            computer.m_blackList.push(desktop.cardList.pop());
            play.m_blackList.push(desktop.cardList.pop());
        }
    } else if (sendtick == 4) {
        computer.m_blackList.push(desktop.cardList.pop());
        play.m_blackList.push(desktop.cardList.pop());

        //庄家补牌
        if (zhuang == 1) { //
            computer.m_blackList.push(desktop.cardList.pop());
        } else {
            play.m_blackList.push(desktop.cardList.pop());
        }
    } else if (sendtick == 5) {
        sortCard(computer.m_blackList);
        sortCard(play.m_blackList);
        //修改游戏状态
        if (zhuang == 1) {
            //进入电脑出牌状态
            computer.clickpos = computer.m_blackList.length - 1;
            m_gameStatus = gameStatus.com2;
            //按钮的处理
        } else {
            //进入玩家出牌状态
            play.clickpos = play.m_blackList.length - 1;
            m_gameStatus = gameStatus.human2;
            //按钮的处理
        }
        sendtick = 0;
    }
}

/**
 * 玩家牌进行排序
 */
function sortCard(list) {
    //首先是牌型，然后是牌值
    list.sort(function (a, b) {
        if (a.type > b.type) return 1;
        if (a.type == b.type && a.value > b.value) return 1;
        return -1;
    })
}

/**
 * events of mouseClick
 */
function mouseclick() {
    //对方出牌以及自己摸牌
    if (m_gameStatus == gameStatus.human1) { //对方打出的牌
        //click out card btn
        if (can_peng) {
            //call peng function
            pengCard();
        }
        //click gang button
        if (can_gang) {
            gangCard();
        }
        if (can_hu) {
            huCard();
        }
        //to get card
        moCard();

    } else if (m_gameStatus == gameStatus.human2) { //the status of out card.why can operate?
        //click the gang btn
        if (can_gang) {
            if (play.moCard != null) {
                if (checkGang(play, 2, play.moCard)) {
                    doGang(play, 2, play.moCard);
                    moCard();
                }
            }

            //black gang
            if (checkGang(play, 1, null)) {
                doGang(play, 1, null);
                moCard();
            }
        }
        //click the hu btn
        if (can_hu) {
            //win by own
            ziHuCard();
        }
        //play out own cards
        let length = play.m_blackList.length;
        //change the clickpos
        clickpos = Math.floor((x - 20) / 80);

        //click the out card part
        if (clickpos >= 0 && clcikpos < length) {
            playoutcard(clickpos);
        }

    } else if (m_gameStatus == gameStatus.nohu) {
        gameStatus = gameStatus.sessioninit;
    } else if (m_gameStatus == gameStatus.sessionend) {
        gameStatus = gameStatus.sessioninit;
    }
}


/**
 * play get card
 */
function moCard() {

    let temp = desktop.cardList.pop();
    play.moCard = temp;
    desktop.outCount += 1;
    if (checkGang(play, 2, temp)) {
        can_gang = true;
    } else {
        can_gang = false;

    }
    //检查胡牌
    if (checkHu(play, 2, temp)) {
        can_hu = true;
    } else {
        can_hu = false;
    }
    play.m_blackList.push(temp);
    //检查暗杠
    if (checkGang(play, 1, null)) {
        can_gang = true;
    }
    clickpos = play.m_blackList.length - 1;
    m.gameStatus = gameStatus.human2;
    //按钮处理

}

/**
 * play out card
 */
function outcard() {
    if (clickpos >= 0 && clcikpos < length) {
        playoutcard(clickpos);
    }
}

/**
 * @parem card index
 */
function playShowCard(pos) {
    if (checkSession()) {
        return;
    }
    let temp = play.m_blackList.splice(pos, 1);
    play.m_outList = play.m_outList.concat(temp);
    play.outcard = temp[0];
    play.moCard = null;
    desktop.outedList = desktop.outedList.concat(temp);
    //if the outCount++?
    sortCard(play.m_blackList);
    m_gameStatus = gameStatus.com1;
}

/**
 * check if the sesstion
 */
function checkSession() {
    if (desktop.outCount > 64) {
        m_gameStatus = gameStatus.nohu;
        return true;
    }
    return false;
}

/**
 * the function of peng btn
 */
function pengCard() {
    if (computer.outcard != null) {
        if (checkPeng(play, computer.outcard)) {
            doPeng(play, computer.outcard);
            computer.outedList.pop();
            clcikpos = play.m_blackList.length;
            m_gameStatus = gameStatus.human2;
            can_hu = false;
            can_gang = false;
        }
    }
}

/**
 *the function of hu btn
 */
function playHuCard() {
    if (m_gameStatus == gameStatus.human1) { //opponent fangPao
        huCard();
    } else if (m_gameStatus == gameStatus.human2) { //zimo
        ziHuCard();
    }
}

function huCard() {
    if (computer.outcard) {
        if (checkHu(play, computer.outcard)) {
            let temp = computer.outedList.pop();
            play.m_blackList.push(temp);
            sortCard(play.m_blackList);
            winner = play;
            loser = computer;
            m_gameStatus = gameStatus.score;
        }
    }
}

function ziHuCard() {
    if (checkHu(play, null)) {
        sortCard(play.m_blackList);
        winner = play;
        loser = computer;
        m_gameStatus = gameStatus.score;
    }
}

/**
 *
 */
function gangCard() {
    if (can_gang) {
        //gang opponent
        if (computer.outcard != null) {
            if (checkGnag(palyer, 3, computer.outcard)) {
                doGang(play, 3, computer.outcard);
                computer.outedList.pop();
                moCard();
            }
        }
        if (play.moCard != null) {
            if (checkGang(play, 2, play.moCard)) {
                doGang(play, 2, palyer.moCard);
                moCard();
            }
        }
        if (checkGang(play, 1, null)) {
            doGang(play, 1, null);
            moCard();
        }
    }
    //the handle of btn

}

function scoreSession() {
    let rate = 1;
    let gangCard = null;
    let gang = 0;
    for (let n = 0; n < winner.m_whiteList.length; n++) {
        if (gangCard == null) {
            gangCard = winner.m_whiteList[n];
            if (countCard(winner.m_whiteList, gangCard) == 4) {
                gang++;
            }
        }
        if (winner.m_whiteList[n] != gangCard) {
            gangCard = winner.m_whiteList[n];
            if (countCard(winner.m_whiteList, gangCard) == 4) {
                gang++;
            }
        }
    }
    gangpai = gang;
    //门清是否
    if (winner.is_menqing == true) {
        is_mengqing = true;
        gang++;
    }
    //清一色、混一色
    tcls = [];
    var classes = 0;
    for (let n = 0; n < 4; n++) {
        tcls[n] = clsCount(winner.m_blackList, n) + clsCount(winner.m_whiteList, n);
        if (tcls[n] > 0) {
            classes++;
        }
    }
    if (classes == 1) {
        is_qing = true;
        gang += 3;
    } else if (classes == 2 && tcls[3] > 0) {
        is_hun = true;
        gang++;
    }
    //暗刻子

    let zcard = null;
    for (let n = 0; n < winner.m_blackList.length; n++) {
        if (zcard == null) {
            zcard = winner.m_blackList[n];
            if (countCard(winner.m_blackList, zcard) == 3) zipai++;
        } else if ((zcard.value != winner.m_blackList[n].value) && (zcard.type != winner.m_blackList[n].type)) {
            zcard = winner.m_blackList[n];
            if (countCard(winner.m_blackList, zcard) == 3) zipai++;
        }
    }
    gang += zipai;
    xxs += Math.pow(2, gang);
    sscore = 100 * xxs;
    winner.gold += sscore;
    loser.gold -= sscore;
}

function clsCount(list, type) {
    let count = 0;
    list.forEach(card => {
        if (card.type == type) {
            count++;
        }
    })
    return count;
}


function findOther(p) {
    if (play === p) {
        return computer;
    } else {
        return play;
    }
}

/**
 * computer aotu handle
 */
function comProcess(p) {
    let opponent = findOther(p);
    if (opponent.outcard != null) {
        if (checkHu(p, opponent.outcard)) {
            let temp = opponent.m_outList.pop();
            p.m_blackList.push(temp);
            sortCard(p.m_blackList);
            p.is_menqing = false;
            winner = p;
            loser = opponent;
            m_gameStatus = gameStatus.score;
            return
        } else if (checkGang(p, 3, opponent.outcard)) {
            doGang(p, 3, opponent.outcard);
            p.is_menqing = false;
            opponent.m_outList.pop();
        } else if (checkPeng(p, opponent.outcard)) {
            doPeng(p, opponent.outcard);
            p.is_menqing = false;
            opponent.m_outList.pop();
            if (p === computer) {
                m_gameStatus = gameStatus.com2;
            } else {
                m_gameStatus = gameStatus.human2;
            }
            return
        }
    }

    let mo = desktop.cardList.pop();
    desktop.outCount++;
    p.moCard = mo;
    p.m_blackList.push(mo);
    p.clickpos = p.m_blackList.length - 1;
    // sortCard(p.m_blackList);
    if (p === computer) {
        m_gameStatus = gameStatus.com2;
    } else {
        m_gameStatus = gameStatus.human2;
    }
}


/**
 * 电脑出牌
 */
function comShowCard(p) {
    if (checkHu(p, null)) {
        winner = p;
        loser = play;
        m_gameStatus = gameStatus.score;
    } else if (checkSession()) {
        return;
    } else if (checkGang(p, 1, p.moCard)) { //能否暗杠
        doGang(p, 1, p.moCard);
        var temp = desktop.cardList.pop();
        p.moCard = temp;
        p.m_blackList.push(temp);
        sortCard(p.m_blackList);
    } else if (checkGang(p, 2, p.moCard)) {
        doGang(p, 2, p.moCard);
        var temp = desktop.cardList.pop();
        p.moCard = temp;
        p.m_blackList.push(temp);
        sortCard(p.m_blackList);
    } else {
        let index = comoutcard(p.m_blackList);
        let temp = p.m_blackList.splice(index, 1);
        p.outcard = temp[0];
        p.m_outList = p.m_outList.concat(temp);
        desktop.outedList = desktop.outedList.concat(temp);
        sortCard(p.m_blackList);
        if (p === computer) {
            m_gameStatus = gameStatus.human1;
        } else {
            m_gameStatus = gameStatus.com1;
        }
    }
}

function doPeng(p, xcard) {
    let count = 0;
    p.m_whiteList.push(xcard);
    for (let n = 0; n < p.m_blackList.length; n++) {
        if (p.m_blackList[n].type == xcard.type && p.m_blackList[n].value == xcard.value) {
            if (count < 2) {
                count++;
                let temp = p.m_blackList.splice(n, 1);
                p.m_whiteList = p.m_whiteList.concat(temp);
                n--;
            } else if (count == 2) {
                break;
            }
        }
    }
    sortCard(p.m_whiteList);
    console.log(`%c${p.id == 1 ? "电脑" : "玩家"}碰：`, "color: red; font-size:1,5em");
    console.log(p.m_whiteList)
}

/**
 * gang:
 * black gang
 * two types of white gang
 */
function checkGang(p, type, xcard) {
    switch (type) {
        case 1 : { //black gang
            if (xcard != null) {
                let count = countCard(p.m_blackList, xcard);
                if (count == 4) return true;
                return false;
            } else {
                for (let n = 0; n < p.m_blackList.length; n++) {
                    if (countCard(p.m_blackList, p.m_blackList[n]) == 4) return true;
                }
                return false;
            }
        }
        case 2 : { //gang from whiteList
            if (xcard != null) {
                let count = countCard(p.m_whiteList, xcard);
                if (count == 3) return true;
                return false;
            } else {
                return false;
            }
        }
        case 3 : {
            if (xcard != null) {
                if (countCard(p.m_blackList, xcard) == 3) return true;
                return false;
            } else {
                return false;
            }
        }
    }
}

function doGang(p, type, xcard) {
    sortCard(p.m_blackList);
    switch (type) {
        case 1 : {
            //暗杠
            if (xcard != null) {
                let index = findIndex(p.m_blackList, xcard.type, xcard.value);
                let temp = p.m_blackList.splice(index, 4);
                p.m_whiteList = p.m_whiteList.concat(temp);
                break;
            } else {
                for (let n = 0; n < p.m_blackList.length; n++) {
                    if (countCard(p.m_blackList, p.m_blackList[n]) == 4) {
                        let index = n;
                        let temp = p.m_blackList.splice(index, 4);
                        p.m_whiteList = p.m_whiteList.concat(temp);
                        break;
                    }
                    ;
                }
                break;
            }

        }
        case 2 : { //过路杠
            p.m_whiteList.push(xcard);
            let index = findIndex(p.m_blackList, xcard.type, xcard.value);
            let temp = p.m_blackList.splice(index, 1);
            p.is_menqing = false;
            break;
        }
        case 3: {
            p.m_whiteList.push(xcard);
            p.is_menqing = false;
            let index = findIndex(p.m_blackList, xcard.type, xcard.value);
            let temp = p.m_blackList.splice(index, 3);
            p.m_whiteList = p.m_whiteList.concat(temp);
            break;
        }
    }
    sortCard(p.m_whiteList);
}