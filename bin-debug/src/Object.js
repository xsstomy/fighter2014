/**
 * Created by acer on 2014/10/10.
 */
/*
*
* 飞机基类
* */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Plain = (function (_super) {
    __extends(Plain, _super);
    function Plain(obj) {
        _super.call(this);
        this.offsetX = 0;
        this.offsetY = 0;
        this.shootFrameTime = 60;
        this.obj = obj;
    }
    Plain.prototype.init = function () {
        this.rect = new Rect(0, 0, 0, 0);
        this.canshoot = true;
        this.isdie = false;
        this.typeid = this.obj.typeid;
        this.shootX = this.x + this.offsetShootX;
        this.shootY = this.y + this.offsetShootY;
        this.curShootWayIndex = 0;
        this.fireTime = new egret.Timer(this.shootFrameTime);
        this.fireTime.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
        this.addChild(this.obj);
    };
    Plain.prototype.setShootWay = function (shootWay) {
        this.shootWay = shootWay;
    };
    Plain.prototype.setScore = function (score) {
        this.score = score;
    };
    Plain.prototype.setDropPropNum = function (dropPropNum) {
        this.dropPropNum = dropPropNum;
    };
    Plain.prototype.setShootFrameTime = function (shootFrameTime) {
        if (shootFrameTime === void 0) { shootFrameTime = 60; }
        this.shootFrameTime = shootFrameTime;
    };
    Plain.prototype.setOffsetShootX = function (startShootX) {
        this.offsetShootX = startShootX;
    };
    Plain.prototype.setOffsetShootY = function (startShootY) {
        this.offsetShootY = startShootY;
    };
    Plain.prototype.setHp = function (hp) {
        this.hp = hp;
    };
    Plain.prototype.setSpeedX = function (speedx) {
        this.speedX = speedx;
    };
    Plain.prototype.setSpeedY = function (speedy) {
        this.speedY = speedy;
    };
    /**
     * 唯一标识码
     * @param code
     */
    Plain.prototype.setCode = function (code) {
        this.code = code;
    };
    Plain.prototype.setX = function (startx) {
        this.x = startx;
    };
    Plain.prototype.setY = function (starty) {
        this.y = starty;
    };
    Plain.prototype.setOffsetX = function (offsetX) {
        this.offsetX = offsetX;
    };
    Plain.prototype.setOffsetY = function (offsetY) {
        this.offsetY = offsetY;
    };
    Plain.prototype.fire = function () {
        this.fireTime.start();
    };
    Plain.prototype.stopfire = function () {
        this.fireTime.stop();
    };
    Plain.prototype.createBullet = function () {
        this.dispatchEventWith("createBullet");
    };
    Plain.prototype.updateHp = function (blood) {
        this.hp -= blood;
        this.checkIsDie();
    };
    Plain.prototype.die = function () {
        this.fireTime.stop();
        this.fireTime.removeEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
        this.dodie();
    };
    /**
     * 设置移动路径
     * @param moveTrack
     */
    Plain.prototype.setMoveTrack = function (moveTrack) {
        this.moveTrack = moveTrack;
    };
    /**
     * 获取碰撞区域
     * @returns {Rect}
     */
    Plain.prototype.getRect = function () {
        this.rect.x = this.x;
        this.rect.y = this.y;
        this.rect.width = this.width;
        this.rect.height = this.height;
        return this.rect;
    };
    //需要重写
    Plain.prototype.dodie = function () {
    };
    // 需要重写
    Plain.prototype.checkIsDie = function () {
        console.log("sile");
    };
    //需要重写
    Plain.prototype.active = function () {
    };
    return Plain;
})(egret.Sprite);
/*
* 主角plain
*
* */
var LeadPlain = (function (_super) {
    __extends(LeadPlain, _super);
    function LeadPlain(obj) {
        _super.call(this, obj);
    }
    LeadPlain.prototype.active = function () {
        this.event = new DieEvent(PLAIN_DEFINED_EVENT);
        this.init();
    };
    LeadPlain.prototype.checkIsDie = function () {
        if (this.hp <= 0)
            this.die();
    };
    LeadPlain.prototype.dodie = function () {
        this.x = -100;
        this.y = -100;
        console.log("死亡");
        if (this.parent)
            this.parent.removeChild(this);
        this.event.eventObj = this;
        this.event.eventtype = DESTORY;
        Config.gkmanage.dispatchEvent(this.event);
    };
    return LeadPlain;
})(Plain);
/*
*
* 敌人飞机
* */
var EnemyPlain = (function (_super) {
    __extends(EnemyPlain, _super);
    function EnemyPlain(obj) {
        _super.call(this, obj);
    }
    EnemyPlain.prototype.active = function () {
        this.isDing = false;
        this.init();
        this.event = new DieEvent(PLAIN_DEFINED_EVENT);
        //this.dealEnemyTrack();
        this.action = ActionManage.getInstance().dealEnemyTrack(this);
    };
    EnemyPlain.prototype.checkIsDie = function () {
        if (this.hp <= 0 || this.x < 0 || this.x > 480 || this.y < 0 || this.y > 800) {
            this.die();
        }
    };
    EnemyPlain.prototype.getIsDie = function () {
        return this.isDing;
    };
    EnemyPlain.prototype.dodie = function () {
        //console.log("敌人死亡");
        if (this.parent)
            this.parent.removeChild(this);
        this.isDing = true;
        this.x = -100;
        this.y = -100;
        this.event.eventObj = this;
        this.event.eventtype = DESTORY;
        Config.gkmanage.dispatchEvent(this.event);
    };
    return EnemyPlain;
})(Plain);
/*
* 子弹基类
*
* */
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(obj) {
        _super.call(this);
        this.isDoTestHit = false; //是否正在检测碰撞
        this.obj = obj;
    }
    Bullet.prototype.init = function () {
        this.rect = new Rect(0, 0, 0, 0);
        this.isdie = false;
        this.typeid = this.obj.typeid;
        this.event = new DieEvent(BULLET_DEFINED_EVENT);
        this.addChild(this.obj);
        this.getOut();
        this.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
    };
    /**
     * 设置子弹进入场景时候渐变所用时间
     * @param time
     */
    Bullet.prototype.setBulletInTime = function (time) {
        this.bulletTweenTime = time;
    };
    /**
     * 子弹进入场景特效
     */
    Bullet.prototype.getOut = function () {
        this.alpha = 0;
        egret.Tween.get(this).to({ alpha: 1 }, this.bulletTweenTime);
    };
    /**
     * 设置子弹移动路径
     * @param moveTrack
     */
    Bullet.prototype.setMoveTrack = function (moveTrack) {
        this.moveTrack = moveTrack;
    };
    /**
     * 设置攻击力
     * @param attackPower
     */
    Bullet.prototype.setAttackPower = function (attackPower) {
        this.attackPower = attackPower;
    };
    Bullet.prototype.setSpeedX = function (speedx) {
        this.speedX = speedx;
    };
    Bullet.prototype.setSpeedY = function (speedy) {
        this.speedY = speedy;
    };
    Bullet.prototype.setCode = function (code) {
        this.code = code;
    };
    Bullet.prototype.setX = function (startx) {
        this.x = startx;
    };
    Bullet.prototype.setY = function (starty) {
        this.y = starty;
    };
    /**
     * 设置子弹归属
     * @param str
     */
    Bullet.prototype.setBelond = function (str) {
        this.typeBelond = str;
    };
    Bullet.prototype.active = function () {
        this.init();
    };
    Bullet.prototype.onFrame = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (!this.isDoTestHit) {
            this.typeBelond == LEAD_BULLET ? this.doTestHitEnemy() : this.doTestHitLead();
        }
        this.isDie();
    };
    Bullet.prototype.isDie = function () {
        if (this.x < 0 || this.x > 480 || this.y < 0 || this.y > 800) {
            this.die();
        }
    };
    Bullet.prototype.die = function () {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
        this.event.eventObj = this;
        this.event.eventtype = DESTORY;
        Config.gkmanage.dispatchEvent(this.event);
        if (this.parent)
            this.parent.removeChild(this);
    };
    /**
     * 获取碰撞区域
     * @returns {Rect}
     */
    Bullet.prototype.getRect = function () {
        this.rect.x = this.x;
        this.rect.y = this.y;
        this.rect.width = this.width;
        this.rect.height = this.height;
        return this.rect;
    };
    Bullet.prototype.doTestHitEnemy = function () {
        this.isDoTestHit = true;
        var i = 0;
        var activeEnemyArr = Config.gkmanage.getActiveEnemy();
        while (activeEnemyArr.length > 0) {
            if (DataDealLayer.doTestHit(this.getRect(), activeEnemyArr[i].getRect())) {
                this.die();
                activeEnemyArr[i].updateHp(this.attackPower);
                break;
            }
            i++;
            if (i >= activeEnemyArr.length)
                break;
        }
        this.isDoTestHit = false;
    };
    Bullet.prototype.doTestHitLead = function () {
        this.isDoTestHit = true;
        if (DataDealLayer.doTestHit(this.getRect(), Config.leadPlain.getRect())) {
            this.die();
            Config.leadPlain.updateHp(this.attackPower);
        }
        this.isDoTestHit = false;
    };
    return Bullet;
})(egret.Sprite);
/**
 * 道具基类
 */
var Prop = (function (_super) {
    __extends(Prop, _super);
    function Prop(obj) {
        _super.call(this);
        this.obj = obj;
        this.event = new DieEvent(PROP_TYPE);
        this.rect = new Rect(0, 0, 0, 0);
        this.init();
    }
    Prop.prototype.init = function () {
        this.addChild(this.obj);
    };
    Prop.prototype.setTypeId = function (typeId) {
        this.typeId = typeId;
    };
    Prop.prototype.getRect = function () {
        this.rect.x = this.x;
        this.rect.y = this.y;
        this.rect.width = this.width;
        this.rect.height = this.height;
        return this.rect;
    };
    Prop.prototype.die = function () {
        if (this.parent)
            this.parent.removeChild(this);
        this.event.eventObj = this;
        this.event.eventtype = this.typeId;
        Config.DataDealLayer.dispatchEvent(this.event);
    };
    return Prop;
})(egret.Sprite);
/*
*  获取图片资源类
* */
var Numan = (function (_super) {
    __extends(Numan, _super);
    function Numan(strP, str) {
        if (str === void 0) { str = null; }
        _super.call(this);
        this._str = str;
        this._strP = strP;
        this.init();
    }
    Numan.prototype.init = function () {
        this.map = this.createBitmap();
        this.addChild(this.map);
    };
    Numan.prototype.createBitmap = function () {
        var result = new egret.Bitmap();
        var texture;
        if (this._str == null) {
            texture = RES.getRes(this._strP);
        }
        else {
            this._spriteSheet = RES.getRes(this._strP);
            texture = this._spriteSheet.getTexture(this._str);
        }
        result.texture = texture;
        return result;
    };
    return Numan;
})(egret.Sprite);
/*
* myplain 主角飞机图片
* */
var myplainmap = (function (_super) {
    __extends(myplainmap, _super);
    function myplainmap() {
        _super.call(this);
        this.numan = new Numan("f1");
        this.typeid = PLAIN_LEAD_TYPE;
        this.addChild(this.numan);
    }
    return myplainmap;
})(egret.Sprite);
/*
* enemy  敌机飞机图片
* */
var enemyplainmap = (function (_super) {
    __extends(enemyplainmap, _super);
    function enemyplainmap() {
        _super.call(this);
        this.numan = new Numan("f2");
        this.typeid = PLAIN_ENEMY_TYPE;
        this.addChild(this.numan);
    }
    return enemyplainmap;
})(egret.Sprite);
/*
 * 子弹  主角子弹图片
 * */
var plainbulletmap = (function (_super) {
    __extends(plainbulletmap, _super);
    function plainbulletmap() {
        _super.call(this);
        this.numan = new Numan("b1");
        this.typeid = BULLET_TYPE_PLAIN_ONE;
        this.addChild(this.numan);
    }
    return plainbulletmap;
})(egret.Sprite);
//碰撞区域
var Rect = (function () {
    function Rect(x, y, width, height) {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return Rect;
})();
