//玩家类
function CellPlay(gold, id) {
	this.gold = gold;
	this.id = id;
	this.m_blackList = [];
	this.m_whiteList = [];
	this.m_outList = [];

	this.mocard = null;
	this.outcard = null;
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
CellPlay.prototype.addBlack = function (card) {

}