/**
 * Created by acer on 2014/10/10.
 */
/*
*
* 飞机基类
* */

class Plain extends egret.Sprite
{

    public isdie:boolean;
    public canshoot:boolean;
    public typeid:any;
    public obj:any;
    public rect:Rect;
    public constructor(obj:any)
    {
        super();
        this.obj = obj;
    }

    public init()
    {
        this.rect = new Rect(0,0,0,0);
        this.canshoot = true;
        this.isdie = false;
        this.typeid = this.obj.typeid;
        this.shootX = this.x + this.offsetShootX;
        this.shootY = this.y + this.offsetShootY;
        this.curShootWayIndex = 0;
        this.fireTime = new egret.Timer(this.shootFrameTime);
        this.fireTime.addEventListener(egret.TimerEvent.TIMER,this.createBullet,this);
        this.addChild(this.obj);
    }
    public shootWay:number;//飞机射击子弹方式
    public offsetX:number = 0;
    public offsetY:number = 0;
    public shootX:number;
    public shootY:number;
    public offsetShootX:number;
    public offsetShootY:number;
    public hp:number;
    public speedX:number;
    public speedY:number;
    public code:any;//唯一识别码
    public fireTime:egret.Timer;
    public shootFrameTime:number = 60 ;
    public moveTrack:any; //移动路径
    public score:number;//怪物所属积分
    public dropPropNum:number; //掉落道具类型
    public curShootWayIndex:number;//当前射击方式的阵型
    public setShootWay(shootWay:number)
    {
        this.shootWay = shootWay;
    }
    public setScore(score:number)
    {
        this.score = score;
    }
    public setDropPropNum(dropPropNum:number)
    {
        this.dropPropNum = dropPropNum;
    }
    public setShootFrameTime(shootFrameTime:number = 60)
    {
        this.shootFrameTime = shootFrameTime;
    }

    public setOffsetShootX(startShootX:number)
    {
        this.offsetShootX = startShootX;
    }

    public setOffsetShootY(startShootY:number)
    {
        this.offsetShootY = startShootY;
    }

    public setHp(hp:number)
    {
        this.hp = hp;
    }

    public setSpeedX(speedx:number)
    {
        this.speedX = speedx;
    }

    public setSpeedY(speedy:number)
    {
        this.speedY = speedy;
    }

    /**
     * 唯一标识码
     * @param code
     */
    public setCode(code:number)
    {
        this.code = code;
    }

    public setX(startx:number)
    {
        this.x =startx;
    }

    public setY(starty:number)
    {
        this.y = starty;
    }

    public setOffsetX(offsetX:number)
    {
        this.offsetX = offsetX;
    }
    public setOffsetY(offsetY:number)
    {
        this.offsetY = offsetY;
    }
    public fire()
    {
        this.fireTime.start();
    }

    public stopfire()
    {
        this.fireTime.stop();
    }

    private createBullet()
    {
        this.dispatchEventWith("createBullet");
    }

    public updateHp(blood:number)
    {
        this.hp -= blood;
        this.checkIsDie();
    }


    public die()
    {
        this.fireTime.stop();
        this.fireTime.removeEventListener(egret.TimerEvent.TIMER,this.createBullet,this);
        this.dodie();
    }

    /**
     * 设置移动路径
     * @param moveTrack
     */
    public setMoveTrack(moveTrack:any)
    {
        this.moveTrack = moveTrack;
    }

    /**
     * 获取碰撞区域
     * @returns {Rect}
     */
    public getRect():Rect
    {
        this.rect.x = this.x;
        this.rect.y = this.y;
        this.rect.width = this.width;
        this.rect.height = this.height;
        return this.rect;
    }
//需要重写
    public dodie()
    {

    }
// 需要重写
    public checkIsDie()
    {

    }

    //需要重写
    public active()
    {

    }

}


/*
* 主角plain
*
* */
class LeadPlain extends Plain
{
    private event:DieEvent;
    public constructor( obj:any)
    {
        super(obj);
    }

    public active()
    {
        this.event = new DieEvent(PLAIN_DEFINED_EVENT);
        this.init();
    }

    public checkIsDie()
    {
        if( this.hp <= 0)
        this.die();
    }


    public dodie()
    {

        if(this.parent)
            this.parent.removeChild( this );

        this.event.eventObj = this;
        this.event.eventtype = DESTORY;
        Config.gkmanage.dispatchEvent( this.event );
    }
}


/*
*
* 敌人飞机
* */
class EnemyPlain extends Plain
{
    public event:DieEvent;

    private action:any;// 飞机轨迹移动管理类
    public constructor( obj:any)
    {
        super(obj);
    }

    public active()
    {

        this.init();
        this.event = new DieEvent(PLAIN_DEFINED_EVENT);
        this.dealEnemyTrack();

    }
    private isloop:any;
    private updatetime:any;
    private isratote:any;
    private isDie:any;
    private enemyTrackIndex:any;//怪物那一条路径
    private testMoveMode:MoveMode;
    public dealEnemyTrack()
    {
        this.enemyTrackIndex = ENEMY_TRACK_DATA[this.moveTrack];
        this.testMoveMode = new MoveMode();
        this.testMoveMode.clear();
        this.isDie = this.enemyTrackIndex[0]["isDie"];
        this.isloop = this.enemyTrackIndex[0]["isLoop"];
        this.isratote = this.enemyTrackIndex[0]["isRatote"];
        this.updatetime = this.enemyTrackIndex[0]["updatetime"];

        for(var i = 1; i < this.enemyTrackIndex.length; i++)
        {
            var obj = this.enemyTrackIndex[i];
            var nodex = obj["nodeX"];
            var nodey = obj["nodeY"];
            var distancetime = obj["distanceTime"];

            this.testMoveMode.addPoint(nodex,nodey,distancetime);
        }

        this.testMoveMode.road.loop=this.isloop; ///路劲是否循环
        this.testMoveMode.load.setWork(this.isratote);// 是否启动自传
        this.testMoveMode.road.toDie=this.isDie;//路劲到终点死亡
        this.testMoveMode.load.power=60;//  终点移动半径
        this.testMoveMode.load.angle=0;//开始角度
        this.testMoveMode.load.workAngle=60/1000;//    度数/1000毫秒

        this.addEventListener(egret.Event.ENTER_FRAME,this.onFrame,this);
    }
    public onFrame()
    {
        //this.x += this.speedX;
        //this.y += this.speedY;
        this.testMoveMode.moveTheObj(this,this.offsetX,this.offsetY,this.updatetime);
        //this.checkIsDie();
    }


    public checkIsDie()
    {
        if( this.hp <= 0||this.x  < 0 || this.x>480|| this.y< 0|| this.y> 800)
        {
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onFrame,this);
            this.die();
        }
    }


    public dodie()
    {
        if(this.parent)
            this.parent.removeChild( this );

        this.event.eventObj = this;
        this.event.eventtype = DESTORY;
        Config.gkmanage.dispatchEvent( this.event );

    }
}

 /*
* 子弹基类
*
* */

class Bullet extends egret.Sprite
{
    public json:any;
    public obj:any;
    public isdie:boolean;
    public speedX:number;
    public speedY:number;
    public typeid:number;//子弹种类
    public code:number;//唯一识别码
    public attackPower:number;
    public event:DieEvent;
    private action:any;// 子弹轨迹移动管理类
    private moveTrack:any;// 执行那种动作轨迹

    public constructor(obj:any)
    {
        super();
        this.obj = obj;
    }


    private init()
    {
        this.isdie = false;
        this.typeid = this.obj.typeid;
        this.event = new DieEvent(BULLET_DEFINED_EVENT);
        this.addChild(this.obj);
        this.getOut();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onFrame,this);
    }
    private bulletTweenTime:number;
    /**
     * 设置子弹进入场景时候渐变所用时间
     * @param time
     */
    public setBulletInTime(time:number)
    {
        this.bulletTweenTime = time;
    }
        /**
         * 子弹进入场景特效
         */
    private getOut()
    {   this.alpha = 0;
        egret.Tween.get( this ).to({alpha:1},this.bulletTweenTime);
    }
    /**
     * 设置子弹移动路径
     * @param moveTrack
     */
    public setMoveTrack(moveTrack:any)
    {
        this.moveTrack = moveTrack;
    }

    /**
     * 设置攻击力
     * @param attackPower
     */
    public setAttackPower(attackPower:number)
    {
        this.attackPower = attackPower;
    }

    public setSpeedX(speedx:number)
    {
        this.speedX = speedx;
    }

    public setSpeedY(speedy:number)
    {
        this.speedY = speedy;
    }

    public setCode(code:number)
    {
        this.code = code;
    }

    public setX(startx:number)
    {
        this.x =startx;
    }

    public setY(starty:number)
    {
        this.y = starty;
    }

    public active()
    {
        this.init();
    }

    public onFrame()
    {
        this.x += this.speedX;
        this.y += this.speedY;
        this.isDie();
    }

    public isDie()
    {
        if( this.x < 0 || this.x>480|| this.y< 0|| this.y> 800)
        {

            this.removeEventListener(egret.Event.ENTER_FRAME,this.onFrame,this);
            this.event.eventObj = this;
            this.event.eventtype = DESTORY;
            Config.gkmanage.dispatchEvent( this.event );

            if(this.parent)
                this.parent.removeChild(this);

        }
    }
}
/**
 * 道具基类
 */
class Prop extends egret.Sprite
{
    private obj:any;//皮肤
    private typeId:any;//识别皮肤
    private moveWay:any;//道具移动方式
    private moveWayManage:any;//移动方式管理类
    public rect:Rect;//碰撞区域
    private event:DieEvent;// 事件
    public constructor(obj:any)
    {
        super();
        this.obj = obj;
        this.event = new DieEvent(PROP_TYPE);
        this.rect = new Rect(0,0,0,0);
        this.init();
    }
    private init()
    {
        this.addChild(this.obj);

    }
    public setTypeId(typeId:any)
    {
        this.typeId = typeId;
    }
    public getRect():Rect
    {
        this.rect.x = this.x;
        this.rect.y = this.y;
        this.rect.width = this.width;
        this.rect.height = this.height;
        return this.rect;
    }
    public die()
    {

        if( this.parent )
        this.parent.removeChild( this );
        this.event.eventObj = this;
        this.event.eventtype = this.typeId;
        Config.DataDealLayer.dispatchEvent(this.event);
    }
}
/*
*  获取图片资源类
* */

class Numan extends egret.Sprite
{
    private _spriteSheet:egret.SpriteSheet;
    private map:egret.Bitmap;
    private _strP:string;
    private _str:string;

    public constructor(strP:string,str:string = null)
    {
        super();
        this._str = str;
        this._strP = strP;
        this.init();
    }

    private init()
    {
        this.map = this.createBitmap();
        this.addChild( this.map );

    }

    private createBitmap():egret.Bitmap
    {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture;
        if( this._str == null )
        {
            texture = RES.getRes(this._strP);
        }
        else
        {
            this._spriteSheet = RES.getRes(this._strP);
            texture = this._spriteSheet.getTexture(this._str);
        }
        result.texture = texture;
        return result;
    }

}

/*
* myplain 主角飞机图片
* */

class  myplainmap extends egret.Sprite
{
    private numan:Numan;
    public typeid:any;
    public constructor()
    {
        super();
        this.numan = new Numan("f1");
        this.typeid = PLAIN_LEAD_TYPE;
        this.addChild(this.numan);
    }
}

/*
* enemy  敌机飞机图片
* */

class  enemyplainmap extends egret.Sprite
{
    private numan:Numan;
    public typeid:any;
    public constructor()
    {
        super();
        this.numan = new Numan("f2");
        this.typeid = PLAIN_ENEMY_TYPE;
        this.addChild(this.numan);
    }
}


/*
 * 子弹  主角子弹图片
 * */

class  plainbulletmap extends egret.Sprite
{
    private numan:Numan;
    public typeid:any;
    public constructor()
    {
        super();
        this.numan = new Numan("b1");
        this.typeid = BULLET_TYPE_PLAIN_ONE;
        this.addChild(this.numan);
    }
}

//碰撞区域
class Rect
{
    public x:number = 0;
    public y:number = 0;
    public width:number = 0;
    public height:number = 0;
    public constructor(x:number,y:number,width:number,height:number)
    {
        this.x = x;
        this.y = y;
        this.width  = width;
        this.height = height;
    }
}