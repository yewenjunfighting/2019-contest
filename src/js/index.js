$(function() {
    Game.init( $('#map') ); // 游戏开始
});

let Game = {
    gameLevel: [ // 关卡的数据
        {
            map: [ // 用不同的数字来区分格子的种类: 墙, 目标位置, 路
                1,1,2,2,2,2,1,1,
                1,1,2,3,3,2,1,1,
                1,2,2,4,3,2,2,1,
                1,2,4,4,4,3,2,1,
                2,2,4,4,4,4,2,2,
                2,4,4,2,4,4,4,2,
                2,4,4,4,4,4,4,2,
                2,2,2,2,2,2,2,2
            ]
        }
    ],
    init: function(map) {   // 初始化, map为整个项目的根元素
        this.map = map;
        this.createMap(0); // 建图
    },
    createMap: function(level) { // level代表当前的关数, 0代表第一关
        this.nowLevel = this.gameLevel[level];// 获取到第level + 1关的数据, 遍历map关键地图
        this.map.css('width', Math.sqrt(this.nowLevel.map.length) * 50) // 我们要绘制的地图是个矩形, 宽和高是相等的,所以根据map的长度来确定map元素的宽度
        $.each(this.nowLevel.map, $.proxy(function(i, elem) { // 用proxy来修正this指向
            switch(elem) { // 根据elem的值来应用样式
                case 1 : this.map.append('<div class="cell"></div>'); break; // 普通格子
                case 2 : this.map.append('<div class="wall"></div>'); break; // 墙
                case 3 : this.map.append('<div class="target"></div>'); break; // 目标格子
                case 4 : this.map.append('<div class="road"></div>'); break; // 可以走的路
                default: break;
            }
        }, this) );
    }
}
