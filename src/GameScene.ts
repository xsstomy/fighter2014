/**
 * Created by acer on 2014/10/10.
 */

    /*
    *
    * 主游戏逻辑操作界面-游戏层
    * */
class GameLayer extends egret.Sprite
{
//    private myLeadPlain:any;//主角
//    private plainManage:PlainManage;
//    private bulletMange:BulletManage;

    private leadPlainBulletArray:Array<any>;
    private enemybulletArray:Array<any>;
    private enemyplainArray:Array<any>;
    private gkmanage:GKManage;
    public constructor()
    {
        super();
        this.init();
    }

    private init()
    {

        this.gkmanage = new GKManage(this);


        this.width = egret.MainContext.instance.stage.stageWidth;
        this.height  = egret.MainContext.instance.stage.stageHeight;
        Config.leadPlain = new LeadPlain(new myplainmap());

        Config.leadPlain.setX(200);
        Config.leadPlain.setY(700);
        Config.leadPlain.setOffsetShootX(30);
        Config.leadPlain.setOffsetShootY(0);
        Config.leadPlain.setShootFrameTime(60);

        this.addChild( Config.leadPlain );
        Config.leadPlain.active();
        this.dealWithLayer();


        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchbegin,this,true);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchmove,this,true);
        this.addEventListener(egret.TouchEvent.TOUCH_END,this.touchend,this,true);

    }

    private dealWithLayer()
    {
        Config.leadPlain.fire();
        Config.leadPlain.addEventListener("createBullet",this.docreateBullet,this);

        this.gkmanage.start();
    }

    private docreateBullet(evt:egret.Event)
    {
        Config.buttetCode++;
        if( evt.target == Config.leadPlain )
        {
//            console.log("子弹发射类");
            //这里不需要子弹封装函数，因为子弹的表现形式在自己初始化成已经定好，属于自己的行为
            var tempx = Math.random()*100;
            var x = evt.target.shootX;
            var y = evt.target.shootY;
            var speedx = 0;
            var speedy = -Math.max(50,tempx);

            var bullet:Bullet = BulletManage.produce(new plainbulletmap(),0);
            bullet.setAttackPower(1);
            bullet.setCode(Config.buttetCode);
            bullet.setSpeedX(speedx);
            bullet.setSpeedY(speedy);
            bullet.setX(x);
            bullet.setY(y);
            Config.BulletLayer.addChild( bullet );

            this.gkmanage.activeEnemyBulletArray.push(bullet);
            bullet.active();
        }
    }
    private tempx:number;
    private tempy:number;
    public touchbegin(evt:egret.TouchEvent)
    {

        this.tempx = evt.stageX - Config.leadPlain.x;
        this.tempy = evt.stageY - Config.leadPlain.y;
//        console.log("tempx = "+ this.tempx+"  tempy = "+ this.tempy);
    }

    public touchmove(evt:egret.TouchEvent)
    {
        if( evt.type = egret.TouchEvent.TOUCH_MOVE)
        {
            var x:number = evt.stageX;
            var y:number = evt.stageY;
            Config.leadPlain.x = x - this.tempx;
            Config.leadPlain.y = y - this.tempy;
            Config.leadPlain.shootX = x - this.tempx+Config.leadPlain.offsetShootX;
            Config.leadPlain.shootY = y - this.tempy+Config.leadPlain.offsetShootY;
        }
    }

    public touchend(evt:egret.TouchEvent)
    {

    }
}


class BulletLayer extends egret.Sprite
{
    private root:any;
    public constructor(root:any)
    {
        super();
        this.root = root;
        this.init();
    }
    private init()
    {
        this.root.addChild(this);
        this.width = egret.MainContext.instance.stage.stageWidth;
        this.height = egret.MainContext.instance.stage.stageHeight;
    }

}
//数据处理层，即控制数据层
class DataDealLayer extends egret.Sprite
{
    public constructor()
    {
        super();
        this.init();
    }
    private init()
    {
        Config.DataDealLayer = this;
        this.addEventListener(PROP_TYPE,this.dealEvent,this);
    }
    private dealEvent(evt:DieEvent)
    {

    }
}