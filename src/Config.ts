/**
 * Created by xiashishi on 14-10-10.
 */

   class Config
{
    public static buttetCode:number = 0;//子弹唯一识别码
    public static leadPlain:LeadPlain;//主角飞机
    public static gkmanage:GKManage ;//  关卡控制管理类
    public static BulletLayer:egret.Sprite;  //子弹层
    public static ScoreLayer:egret.Sprite;//积分层
    public static DataDealLayer:egret.Sprite;//数据处理层
    public static leadPlainBulletArray:Array<any> = [];
    public static enemyPlainbulletArray:Array<any> = [];
}


var LEAD_PLAIN = {x:200,y:700,speedx:0,speedy:0,hp:10,shootx:30,shooty:0};//主角初始位置

var LEAD_PLAIN_DIE = "1";

var PLAIN_LEAD_TYPE = "LEAD";  //飞机类别

var PLAIN_DEFINED_EVENT = "1000";

var BULLET_DEFINED_EVENT = "999";

var PLAIN_ENEMY_TYPE ="ENEMY";

var PLAIN_ENEMY_BOOS ="BOSS";

var DESTORY = "2";

var PROP_TYPE = "propType";

var BULLET_TYPE_PLAIN_ONE = "LEADBULLET01";   //子弹类别 编号 01；

var ENEMY_GK_DATA = [];//关卡数据

var ENEMY_TRACK_DATA = [];//怪物轨迹数据

var BULLET_SHOOT_DATA = [];//子弹轨迹和阵型数据