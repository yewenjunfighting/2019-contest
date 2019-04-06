$(function() {
    Game.init( $('#map') ); // 游戏开始
});

let Game = {
    level: 0,
    gameLevel: [ // 关卡的数据
        {
            map: [
                1,1,2,2,2,1,
                1,2,2,3,3,2,
                1,2,1,1,1,2,
                1,2,1,1,1,2,
                2,1,1,1,1,2,
                1,2,2,2,2,2
            ],
            box: [
                { x: 3, y: 2 },
                { x: 4, y: 2 }
            ],
            tortoise: {x : 2, y : 2}
        },
        {
            map: [ // 用不同的数字来区分格子的种类: 1 -> 普通的格子  2 -> 墙, 3 -> 目标位置
                1,1,2,2,2,2,1,1,
                1,1,2,3,3,2,1,1,
                1,2,2,1,3,2,2,1,
                1,2,1,1,1,3,2,1,
                2,2,1,1,1,1,2,2,
                2,1,1,2,1,1,1,2,
                2,1,1,1,1,1,1,2,
                2,2,2,2,2,2,2,2
            ],
            box: [
                { x: 4, y: 3 },
                { x: 3, y: 3 },
                { x: 5, y: 4 },
                { x: 4, y: 5 }
            ],
            tortoise: { x: 3, y: 6 }
        },
        {
            map: [
                1,1,1,1,2,2,2,2,2,2,2,1,
                1,1,1,1,2,1,1,2,1,1,2,1,
                1,1,1,1,2,1,1,1,1,1,2,1,
                2,2,2,2,2,1,1,2,1,1,2,1,
                3,3,3,2,2,1,1,1,1,1,2,2,
                3,1,1,2,1,1,1,1,2,1,1,2,
                3,1,1,1,1,1,1,1,1,1,1,2,
                3,1,1,2,1,1,1,1,2,1,1,2,
                3,3,2,2,2,2,1,2,1,1,2,2,
                2,2,2,2,2,1,1,1,1,1,2,1,
                1,1,1,1,2,1,1,2,1,1,2,1,
                1,1,1,1,2,2,2,2,2,2,2,1
            ],
            box: [
                { x: 5, y: 6 },
                { x: 6, y: 3 },
                { x: 6, y: 5 },
                { x: 6, y: 7 },
                { x: 6, y: 9 },
                { x: 7, y: 2 },
                { x: 8, y: 2 },
                { x: 9, y: 6 }
            ],
            tortoise: { x: 5, y: 10}
        }
    ],

    init: function(map) {   // 初始化, map为整个项目的根元素
        this.map = map;
        this.createMap(this.level); // 建图
    },

    createMap: function(level) { // level代表当前的关数, 0代表第一关
        this.map.empty(); // 先把前面关卡里的元素清空
        this.nowLevel = this.gameLevel[level];// 获取到第level + 1关的数据, 遍历map关键地图
        this.map.css('width', Math.sqrt(this.nowLevel.map.length) * 50) // 我们要绘制的地图是个矩形, 宽和高是相等的,所以根据map的长度来确定map元素的宽度

        $.each(this.nowLevel.map, $.proxy(function(i, elem) { // 用proxy来修正this指向
            switch(elem) { // 根据elem的值来应用样式
                case 1 : this.map.append('<div class="cell"></div>'); break; // 普通格子
                case 2 : this.map.append('<div class="wall"></div>'); break; // 墙
                case 3 : this.map.append('<div class="target"></div>'); break; // 目标格子
                default: break;
            }
        }, this) );
        this.createBox();
        this.createTortoise();
    },

    createBox: function() { // 创建箱子, 根据当前level中box对象的x, y为box设置left和top值, 进行绝对定位
        $.each(this.nowLevel.box, $.proxy(function(i, elem) {
            let box = $('<div class="box"></div>');
            box.css('left', elem.x * 50);
            box.css('top', elem.y * 50);
            this.map.append(box);
        }, this));
    },

    createTortoise: function() { // 创建乌龟, 根据当前level中的tortoise对象的x, y设置left和top值, 进行决定定位
        let tortoise = $('<div class="tortoise"></div>');
        tortoise.css('left', this.nowLevel.tortoise.x * 50);
        tortoise.css('top', this.nowLevel.tortoise.y * 50);
        tortoise.data('x', this.nowLevel.tortoise.x); // 存储乌龟的坐标, 在移动的时候使用
        tortoise.data('y', this.nowLevel.tortoise.y);
        this.map.append(tortoise);
        this.bindTortoise(tortoise); // 敲击上下左右四个方向时,改变乌龟的朝向
    },

    bindTortoise: function(tortoise) { // 根据键盘事件对乌龟的朝向进行变换, 实际上就是设置背景图x方向的值
        $(document).keydown($.proxy(function(event) {
            switch(event.which) { //
                case 37 : // 👈
                    tortoise.css('backgroundPosition', '-150px 0 '); // 改变乌龟朝向
                    this.walkTortoise(tortoise, { x: -1 }); // 控制乌龟走动
                    break;
                case 38 : // 👆
                    tortoise.css('backgroundPosition', '0 0 ');
                    this.walkTortoise(tortoise, { y: -1 });
                    break;
                case 39 : // 👉
                    tortoise.css('backgroundPosition', '-50px 0 ');
                    this.walkTortoise(tortoise, { x: 1 });
                    break;
                case 40 : // 👇
                    tortoise.css('backgroundPosition', '-100px 0 ');
                    this.walkTortoise(tortoise, { y: 1 });
                    break;
            }
        }, this) )
    },

    walkTortoise: function(tortoise, walk) { // 乌龟移动
        let walkX = walk.x || 0; // 传下来的walk中只有x或者只有y, 如果没有的值就为0, 那么就不会对位置产生影响
        let walkY = walk.y || 0;
        let rowNum = Math.sqrt(this.nowLevel.map.length); // map每行的格子个数
        let kind = this.nowLevel.map[(tortoise.data('y') + walkY) * rowNum + tortoise.data('x') + walkX];
        if(kind !== 2) {
            tortoise.data('y', tortoise.data('y') + walkY); // 设置乌龟的坐标
            tortoise.data('x', tortoise.data('x') + walkX);

            tortoise.css('top', tortoise.data('y') * 50); // 移动乌龟
            tortoise.css('left', tortoise.data('x') * 50);

            $('.box').each($.proxy(function(i, elem) {
                if(this.impactCheck(tortoise, $(elem))) { // 如果碰上box了, 那么当前乌龟的位置和某个box的位置是相同的, 接下来就看这个box是否可以往乌龟来的那个方向移动
                    kind = this.nowLevel.map[(tortoise.data('y') + walkY) * rowNum + tortoise.data('x') + walkX];
                    if(kind !== 2) { // 如果和乌龟碰撞的那个箱子可以往指定方向移动的话, 就改变箱子的left和top, 就相当于把在乌龟身上干做过的,在box身上再做一次, 让box移动
                        $(elem).css('left', (tortoise.data('x') + walkX) * 50);
                        $(elem).css('top', (tortoise.data('y') + walkY) * 50);
                        $('.box').each($.proxy(function(j, Elem ){ // 对刚才移动的那个box再做一次碰撞检测(这里要注意只有真正的移动了才可以做碰撞检测),如果有碰撞(排除自身的干扰),就撤回刚才对box的移动
                            if(elem !== Elem && this.impactCheck($(elem), $(Elem))) {
                                $(elem).css('left', (tortoise.data('x')) * 50); // 把box移动到乌龟所在的位置
                                $(elem).css('top', (tortoise.data('y')) * 50);

                                tortoise.data('y', tortoise.data('y') - walkY); // 重新设置乌龟的坐标
                                tortoise.data('x', tortoise.data('x') - walkX);

                                tortoise.css('top', tortoise.data('y') * 50);   // 把乌龟移动到原来的位置
                                tortoise.css('left', tortoise.data('x') * 50);
                            }
                        }, this));

                    }else { // 如果box无法移动就撤回乌龟的移动
                        tortoise.data('y', tortoise.data('y') - walkY);
                        tortoise.data('x', tortoise.data('x') - walkX);

                        tortoise.css('top', tortoise.data('y') * 50);
                        tortoise.css('left', tortoise.data('x') * 50);
                    }
                }else {

                }
            }, this));
        }

        this.nextLevel(); // 检测是否该进入下一关
    },

    impactCheck: function(elem1, elem2) { // 碰撞检测
        let left1 = elem1.offset().left;
        let right1 = elem1.offset().left + elem1.width();
        let top1 = elem1.offset().top;
        let bottom1 = elem1.offset().top + elem1.height();

        let left2 = elem2.offset().left;
        let right2 = elem2.offset().left + elem2.width();
        let top2 = elem2.offset().top;
        let bottom2 = elem2.offset().top + elem2.height();

        if(left1 >= right2 || right1 <= left2 || top1 >= bottom2 || bottom1 <= top2) { // 不发生碰撞的四种情况,正好两两相反
            return false;
        }else {
            return true;
        }
    },
    nextLevel: function() {
        let numberOfCoincidences = 0;
        $('.target').each($.proxy(function(i, elem){ // 如果目标位置被box全部占满就通关成功
            $('.box').each($.proxy(function(j, Elem){
                if($(elem).offset().top === $(Elem).offset().top && $(elem).offset().left === $(Elem).offset().left) {
                    numberOfCoincidences ++;
                }
            }, this));
        }, this));
        if(numberOfCoincidences === $('.target').length) {
           this.createMap(++ this.level)
        }
    }
};
