/**
 * Created by acer on 2014/10/10.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/*
*
* 主游戏逻辑操作界面-游戏层
* */
var GameLayer = (function (_super) {
    __extends(GameLayer, _super);
    function GameLayer() {
        _super.call(this);
        this.init();
    }
    GameLayer.prototype.init = function () {
        Config.gkmanage = new GKManage(this);
        this.dataDealLayer = new DataDealLayer();
        this.event = new DieEvent(GAME_STARTED);
        this.width = egret.MainContext.instance.stage.stageWidth;
        this.height = egret.MainContext.instance.stage.stageHeight;
        Config.leadPlain = new LeadPlain(new myplainmap());
        Config.leadPlain.setX(200);
        Config.leadPlain.setY(700);
        Config.leadPlain.setOffsetShootX(30);
        Config.leadPlain.setOffsetShootY(0);
        Config.leadPlain.setShootFrameTime(60);
        this.addChild(Config.leadPlain);
        Config.leadPlain.active();
        this.dealWithLayer();
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchbegin, this, true);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchmove, this, true);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchend, this, true);
    };
    GameLayer.prototype.dealWithLayer = function () {
        Config.leadPlain.fire();
        Config.leadPlain.addEventListener("createBullet", this.docreateBullet, this);
        Config.gkmanage.start();
        this.dataDealLayer.dispatchEvent(this.event);
    };
    GameLayer.prototype.docreateBullet = function (evt) {
        Config.buttetCode++;
        if (evt.target == Config.leadPlain) {
            //            console.log("子弹发射类");
            //这里不需要子弹封装函数，因为子弹的表现形式在自己初始化成已经定好，属于自己的行为
            var tempx = Math.random() * 100;
            var x = evt.target.shootX;
            var y = evt.target.shootY;
            var speedx = 0;
            var speedy = -Math.max(50, tempx);
            var bullet = BulletManage.produce(new plainbulletmap(), 0);
            bullet.setAttackPower(1);
            bullet.setCode(Config.buttetCode);
            bullet.setSpeedX(speedx);
            bullet.setSpeedY(speedy);
            bullet.setX(x);
            bullet.setY(y);
            bullet.setBelond(LEAD_BULLET);
            Config.BulletLayer.addChild(bullet);
            Config.leadPlainBulletArray.push(bullet);
            Config.gkmanage.activeEnemyBulletArray.push(bullet);
            bullet.active();
        }
    };
    GameLayer.prototype.touchbegin = function (evt) {
        this.tempx = evt.stageX - Config.leadPlain.x;
        this.tempy = evt.stageY - Config.leadPlain.y;
        //        console.log("tempx = "+ this.tempx+"  tempy = "+ this.tempy);
    };
    GameLayer.prototype.touchmove = function (evt) {
        if (evt.type = egret.TouchEvent.TOUCH_MOVE) {
            var x = evt.stageX;
            var y = evt.stageY;
            Config.leadPlain.x = x - this.tempx;
            Config.leadPlain.y = y - this.tempy;
            Config.leadPlain.shootX = x - this.tempx + Config.leadPlain.offsetShootX;
            Config.leadPlain.shootY = y - this.tempy + Config.leadPlain.offsetShootY;
        }
    };
    GameLayer.prototype.touchend = function (evt) {
    };
    return GameLayer;
})(egret.Sprite);
var BulletLayer = (function (_super) {
    __extends(BulletLayer, _super);
    function BulletLayer(root) {
        _super.call(this);
        this.root = root;
        this.init();
    }
    BulletLayer.prototype.init = function () {
        this.root.addChild(this);
        this.width = egret.MainContext.instance.stage.stageWidth;
        this.height = egret.MainContext.instance.stage.stageHeight;
    };
    return BulletLayer;
})(egret.Sprite);
//数据处理层，即控制数据层
var DataDealLayer = (function (_super) {
    __extends(DataDealLayer, _super);
    function DataDealLayer() {
        _super.call(this);
        this.init();
    }
    DataDealLayer.prototype.init = function () {
        Config.DataDealLayer = this;
        this.addEventListener(PROP_TYPE, this.dealEvent, this);
    };
    DataDealLayer.prototype.dealEvent = function (evt) {
    };
    DataDealLayer.prototype.dealHit = function (evt) {
        this.addEventListener(egret.Event.ENTER_FRAME, this.testHit, this);
    };
    DataDealLayer.prototype.testHit = function () {
    };
    DataDealLayer.doTestHit = function (aimrect, hitrect) {
        var aim_cx = aimrect.x + aimrect.width / 2;
        var aim_cy = aimrect.y + aimrect.height / 2;
        var hit_cx = hitrect.x + hitrect.width / 2;
        var hit_cy = hitrect.y + hitrect.height / 2;
        var dx = Math.abs(aim_cx - hit_cx);
        var dy = Math.abs(aim_cy - hit_cy);
        if (dx <= Math.abs(hitrect.width / 2 + aimrect.width / 2) && dy <= Math.abs(hitrect.height / 2 + aimrect.height / 2))
            return true;
        return false;
    };
    return DataDealLayer;
})(egret.Sprite);
