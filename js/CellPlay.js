//玩家类
function CellPlay(gold, id) {
	this.gold = gold;
	this.id = id;
	this.m_blackList = [];
	this.m_whiteList = [];
	this.m_outList = [];

	this.mocard = null; //摸牌？
	this.outcard = null;
	this.is_menqing = true;
	this.clickpos = this.m_blackList.length - 1;
}

CellPlay.prototype.clearList = function () {
	this.m_blackList = [];
	this.m_whiteList = [];
	this.m_outList = [];

	this.mocard = null;
	this.outcard = null;
}

CellPlay.prototype.updateGold = function() {

}

CellPlay.prototype.addBlack = function (cards) {
    this.m_blackList = this.m_blackList.concat(cards);
}
CellPlay.prototype.addWhite = function(cards) {
    this.m_whiteList = this.m_whiteList.concat(cards);
}