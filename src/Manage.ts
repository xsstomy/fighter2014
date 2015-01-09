///<reference path="../libs/core/core.d.ts"/>
/**
 * Created by acer on 2014/10/10.
 */

class PlainManage
{

    private static cacheDict:Object = {};
    /**生产*/
    public static produce(plain:any):Plain
    {
        if(PlainManage.cacheDict[plain.typeid] == null)
            PlainManage.cacheDict[plain.typeid] = [];
        var dict:Plain[] = PlainManage.cacheDict[plain.typeid];
        var theFighter:Plain;
        if(dict.length>0) {
            theFighter = dict.pop();
        } else {
            theFighter = new EnemyPlain(plain);
        }
        return theFighter;
    }
    /**回收*/
    public static reclaim(plain:any):void
    {
        if(PlainManage.cacheDict[plain.typeid]==null)
            PlainManage.cacheDict[plain.typeid] = [];
        var dict:Plain[] = PlainManage.cacheDict[plain.typeid];
        if(dict.indexOf(plain)==-1)
            dict.push(plain);
    }


}


class BulletManage
{
    public static cacheDict:Object = {};
    /**生产*/
    public static produce(bullet:any,actionid:any =0):any
    {
        if(BulletManage.cacheDict[bullet.typeid]==null)
            BulletManage.cacheDict[bullet.typeid] = [];
        var dict:Bullet[] = BulletManage.cacheDict[bullet.typeid];
        var theBullet:Bullet;
        if(dict.length>0) {
            theBullet = dict.pop();
        } else {
            theBullet = new Bullet(bullet);
        }
        return theBullet;
    }
    /**回收*/
    public static reclaim(bullet:any):void
    {
        if(BulletManage.cacheDict[bullet.typeid]==null)
            BulletManage.cacheDict[bullet.typeid] = [];
        var dict:Bullet[] = BulletManage.cacheDict[bullet.typeid];
        if(dict.indexOf(bullet)==-1)
            dict.push(bullet);
    }

}

class DieEvent extends egret.Event
{
    public static DIE:string = "die";
    public eventObj:any = null;//传递对象
    public eventtype:any = null;//事件类型
    public constructor (type:string,bubbles:boolean=false, cancelable:boolean=false)
    {
        super(type,bubbles,cancelable);

    }
}


class GKManage extends egret.Sprite
{
    private code:number;//飞机唯一识别码
    private GKindex:number;//当前关卡数
    private Bindex:number;//当前波数
    private root:any;// 父亲容器   飞机层
    private activeEnemyArray:Array<any>;
    public activeEnemyBulletArray:Array<any>;
    private actionManage:ActionManage;
    public constructor(root:any)
    {
        super();
        this.root = root;
        Config.gkmanage = this;
    }
    //  子弹回收
    private dealBullet(evt:DieEvent)
    {

        if(evt.eventtype == DESTORY )
        {
//            console.log("子弹diaoyongle");
            var bullet:Bullet;
            var index:number = 0;
            while( this.activeEnemyBulletArray.length > 0)
            {
                if( this.activeEnemyBulletArray[index].typeid == evt.eventObj.typeid  && this.activeEnemyBulletArray[index].code == evt.eventObj.code)
                {
                    bullet = this.activeEnemyBulletArray[index];
                    this.activeEnemyBulletArray.splice(index,1);
                    break;
                }
                index++;
                if( index >= this.activeEnemyBulletArray.length)
                    break;
            }
            //console.log("子弹数量 "+BulletManage.cacheDict);
            BulletManage.reclaim( bullet );
        }
    }
    //  敌人飞机回收
    private dealEnemy(evt:DieEvent)
    {

        if(evt.eventtype == DESTORY )
        {
//            console.log("敌人diaoyongle");
            var enemy:EnemyPlain;
            var index:number = 0;
            while( this.activeEnemyArray.length > 0 )
            {
                if(this.activeEnemyArray[index].typeid == evt.eventObj.typeid
                    && this.activeEnemyArray[index].code == evt.eventObj.code )
                {

                    enemy = this.activeEnemyArray[index];
                    this.activeEnemyArray.splice(index,1);
                    break;
                }
                index++;
                if( index >= this.activeEnemyArray.length)
                break;
            }

            PlainManage.reclaim(enemy);
//            console.log("飞机"+PlainManage.cacheDict );
            if( 0 == this.activeEnemyArray.length  )
            {
                this.Bindex++;
                if( this.Bindex == ENEMY_GK_DATA[this.GKindex].length )
                {
//                    this.GKindex++;
//                    if( this.GKindex == this.gkdata.length)
//                    console.log("游戏结束");
                    this.Bindex = 0;
                    //this.GKindex++;
                    if( this.GKindex == ENEMY_GK_DATA.length)
                    {
                        //关卡打穿
                        this.end();
                        //通知主游戏场景，游戏结束
                    }
                }
                this.doGKStart( this.GKindex );
            }


        }
    }

    /**
     * 初始化管理类
     */
    private init()
    {
        this.actionManage = new ActionManage();
        this.code = 0;
        this.activeEnemyArray = [];
        this.activeEnemyBulletArray = [];
        this.GKindex = 0;
        this.Bindex = 0;
        this.addEventListener(PLAIN_DEFINED_EVENT,this.dealEnemy,this);
        this.addEventListener(BULLET_DEFINED_EVENT,this.dealBullet,this);
        this.doGKStart(this.GKindex);

    }

    //游戏开始，初始化数据
    public start()
    {
        this.init();
    }
    //游戏结束，清理数据
    public end()
    {
        this.actionManage = null;
        this.code = 0;
        this.activeEnemyArray = [];
        this.activeEnemyBulletArray = [];
        this.GKindex = 0;
        this.Bindex = 0;
        this.removeEventListener(PLAIN_DEFINED_EVENT,this.dealEnemy,this);
        this.removeEventListener(BULLET_DEFINED_EVENT,this.dealBullet,this);
    }

    public getActiveEnemy():any
    {
        return this.activeEnemyArray;
    }

    //调用第几关
    private doGKStart(num:number)
    {

        var gknumdata = ENEMY_GK_DATA[num];
        this.GKdealBStart(gknumdata[this.Bindex]);
    }
    //调用第几关的第几啵怪物
    public  GKdealBStart(array:any)
    {
        for( var i = 0 ; i < array.length ; i++)
        {
            var obj = array[i];
            var startPosOffsetX = obj["startPosOffsetX"];//开始位置相对X偏移量
            var startPosOffsetY = obj["startPosOffsetY"];//开始位置相对Y偏移量
            var hp = obj["hp"];// 血量
            var shootx = obj["offsetShootX"];//  射击位置相对飞机左上角X偏移量
            var shooty = obj["offsetShootY"];//  射击位置相对飞机左上角Y偏移量
            var track = obj["track"];//移动路径
            var dropPropNum = obj["dropPropNum"];// 掉落道具类型
            var score = obj["score"];//怪物所属积分
            var shootFrameTime = obj["shootFrameTime"];
            var shootWay = obj["shootWay"];
            var enemy = PlainManage.produce(new enemyplainmap());
            enemy.setScore(score);
            enemy.setDropPropNum(dropPropNum);
            enemy.setCode(this.code++);
            enemy.setHp(hp);
            enemy.setOffsetShootX(shootx);
            enemy.setOffsetShootY(shooty);
            enemy.setOffsetX(startPosOffsetX);
            enemy.setOffsetY(startPosOffsetY);
            enemy.setMoveTrack(track);
            enemy.setShootWay(shootWay);
            this.activeEnemyArray.push(enemy);
            this.root.addChild( enemy );
            enemy.setShootFrameTime(1000);
            enemy.addEventListener("createBullet",this.doCreateBullet,this);
            enemy.active();
            enemy.fire();

        }

    }

    private doCreateBullet(evt:egret.Event)
    {
        Config.bulletCode++;//子弹唯一识别码

        var shootWay = evt.target.shootWay;// 射击方式，从配置文件中读取子弹的组合数据

        if( BULLET_SHOOT_DATA[shootWay].length == evt.target.curShootWayIndex )
            {
                evt.target.curShootWayIndex = 0;
            }
        var bulletArray = BULLET_SHOOT_DATA[shootWay][evt.target.curShootWayIndex];
        evt.target.curShootWayIndex++;

        for(var i =0 ; i< bulletArray.length ; i++)
        {
            var shootWayData = bulletArray[i];
            var bullet:Bullet = BulletManage.produce(new plainbulletmap(),0);
            var tempy =100;
            var offsetShootPosX = shootWayData["offsetShootPosX"];
            var offsetShootPosY = shootWayData["offsetShootPosY"];
            var speedx = shootWayData["speedX"];
            var speedy = Math.min(shootWayData["speedY"],tempy);
            var attackPower = shootWayData["bulletAttackPower"];
            var x = evt.target.shootX+evt.target.x+offsetShootPosX;
            var y = evt.target.shootY+evt.target.y+offsetShootPosY;

            bullet.setBulletInTime(200);
            bullet.setAttackPower(attackPower);
            bullet.setCode(Config.bulletCode);
            bullet.setSpeedX(speedx);
            bullet.setSpeedY(speedy);
            bullet.setX(x);
            bullet.setY(y);
            bullet.setBelond(ENEMY_BULLET);

            Config.BulletLayer.addChild( bullet );
            Config.enemyPlainbulletArray.push(bullet);
            this.activeEnemyBulletArray.push(bullet);
            bullet.active();
        }






    }
}

// 轨迹管理
class ActionManage
{
    public static getInstance():ActionManage
    {

        return new ActionManage();
    }

    private obj:any;
    private isloop:any;
    private updatetime:any;
    private isratote:any;
    private isDie:any;
    private enemyTrackIndex:any;//怪物那一条路径
    private testMoveMode:MoveMode;

    public dealEnemyTrack(obj:any)
    {
        this.obj = obj;
        this.enemyTrackIndex = ENEMY_TRACK_DATA[this.obj.moveTrack];
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

        this.obj.addEventListener(egret.Event.ENTER_FRAME,this.onFrame,this);
    }
    public onFrame()
    {
        //this.x += this.speedX;
        //this.y += this.speedY;
        if( !this.obj.getIsDie() )
        this.testMoveMode.moveTheObj(this.obj,this.obj.offsetX,this.obj.offsetY,this.updatetime);
        else
        {
            this.obj.removeEventListener(egret.Event.ENTER_FRAME,this.onFrame,this);
            this.testMoveMode = null;
        }

        //this.obj.checkIsDie();
    }

}