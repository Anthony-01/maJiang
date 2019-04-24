function display() {
	cxt.clearRect(0, 0, canvas.width, canvas.height);
	//显示两家麻将
    //m_gameStatus < gameStatus.nohu &&
	if ( m_gameStatus >= gameStatus.sendcard) {
		//显示玩家的暗牌
		for (let n = 0; n < play.m_blackList.length; n++) {
			play.m_blackList[n].draw(20 + n * 80, n == clickpos ? 620 : 640);
		}
		//show the cards player outed
		for (let n = 0; n < play.m_outList.length; n++) {
			play.m_outList[n].draw(20 + (n % 16) * 80, n < 16 ? 390 : 500 );
		}
		let off = Math.floor(play.m_blackList.length / 3) * 3 + 2;
		for (let n = 0; n < play.m_whiteList.length; n++) {
			play.m_whiteList[n].draw(60 + (n + off) * 80, 650);
		}

		//show the computer
		for (let n = 0; n < computer.m_blackList.length; n++) {
			computer.m_blackList[n].draw(20 + n * 80, n == clickpos ? 20 : 10);
		}
		//show the cards computer outed
		for (let n = 0; n < computer.m_outList.length; n++) {
			computer.m_outList[n].draw(20 + (n % 16) * 80, n < 16 ? 140 : 250 );
		}
		off = Math.floor(computer.m_blackList.length / 3) * 3 + 2;
		for (let n = 0; n < computer.m_whiteList.length; n++) {
			computer.m_whiteList[n].draw(60 + (n + off) * 80, 10);
		}
	}
	if (m_gameStatus == gameStatus.score || m_gameStatus == gameStatus.sessionend){
        cxt.fillStyle = "#ffffff";
		cxt.fillRect(350, 120, 700, 500);
		cxt.fillStyle="#f000f0";
		cxt.font = "50px 宋体";
		if(is_mengqing)
		{	
			cxt.fillText("门清 1 翻",400,200);
		}
		else
		{	
			cxt.fillText("门清 0 翻",400,200);
		}
		if (is_qing)
		{	
			cxt.fillText("清一色 3 翻",400,280);
		}
		else if (is_hun)
		{	
			cxt.fillText("混一色 1 翻",400,280);
		}
		else
		{
			cxt.fillText("清（混）一色 0 翻",400,280);
		}
		cxt.fillText("字牌 "+ zipai+" 翻",400,360);
		cxt.fillText("杠牌 "+ gangpai+" 翻",400,440);
		cxt.fillText("共计 "+ xxs + " 翻",400,520);
		cxt.fillStyle="#f0f000";
		if(winner.id==2)
			cxt.fillText("本局你共赢了 "+sscore +"金币" ,400,590);
		else
			cxt.fillText("本局你输掉了 "+sscore +"金币" ,400,590);
	} else if (m_gameStatus == gameStatus.nohu) {
		cxt.fillStyle="#909090";
		cxt.fillRect(350,200,700,450);

		cxt.fillStyle="#f000f0";
		cxt.font = "180px 宋体";
		cxt.fillText("流局",400,400);
	}
}