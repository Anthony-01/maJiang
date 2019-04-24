var staticAry = [
    {
        type: 0,
        value: 2
    },
    {
        type: 0,
        value: 2
    },
    {
        type: 0,
        value: 2
    },
    {
        type: 1,
        value: 6
    },
    {
        type: 1,
        value: 7
    },
    {
        type: 1,
        value: 8
    },
    {
        type: 2,
        value: 1
    },
    {
        type: 2,
        value: 1
    },
    {
        type: 2,
        value: 1
    },
    {
        type: 2,
        value: 4
    },
    {
        type: 2,
        value: 4
    },
    {
        type: 2,
        value: 4
    },
    {
        type: 2,
        value: 5
    },
    {
        type: 2,
        value: 5
    },
]
function test() {
    //将配置好的麻将顺入数组
    computer.addBlack(getAryCards());
    //判断是否能胡牌
    // checkHu(computer, getCard(2, 9));
    countScore(computer);
}

function getAryCards() {
    let back = [];
    staticAry.forEach(value => {
        if (value.type == 0 && value.value == 0) return back;
        back.push(getCard(value.type, value.value));
    });
    return back;
}

function countScore(p) {
    let count = 0;
    let zcard = null;
    for (let n = 0; n < p.m_blackList.length; n++) {
        if (zcard == null) {
            zcard = p.m_blackList[n];
            if (countCard(p.m_blackList, zcard) == 3) count++;
        } else if ((zcard.value != p.m_blackList[n].value) && (zcard.type != p.m_blackList[n].type)) {
            zcard = p.m_blackList[n];
            if (countCard(p.m_blackList, zcard) == 3) count++;
        }
    }
    return count;
}