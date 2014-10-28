/**
 * Created by xiashishi on 14-10-10.
 */
var Config = (function () {
    function Config() {
    }
    Config.buttetCode = 0; //子弹唯一识别码
    Config.leadPlainBulletArray = [];
    Config.enemyPlainbulletArray = [];
    return Config;
})();
var LEAD_PLAIN = { x: 200, y: 700, speedx: 0, speedy: 0, hp: 10, shootx: 30, shooty: 0 }; //主角初始位置
var LEAD_PLAIN_DIE = "1";
var PLAIN_LEAD_TYPE = "LEAD"; //飞机类别
var PLAIN_DEFINED_EVENT = "1000";
var BULLET_DEFINED_EVENT = "999";
var PLAIN_ENEMY_TYPE = "ENEMY";
var PLAIN_ENEMY_BOOS = "BOSS";
var DESTORY = "2";
var PROP_TYPE = "propType";
var BULLET_TYPE_PLAIN_ONE = "LEADBULLET01"; //子弹类别 编号 01；
var ENEMY_GK_DATA = []; //关卡数据
var ENEMY_TRACK_DATA = []; //怪物轨迹数据
var BULLET_SHOOT_DATA = []; //子弹轨迹和阵型数据
