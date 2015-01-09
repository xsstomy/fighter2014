/**
 * Created by acer on 2014/10/14.
 */
var MoveMode = (function () {
    //public x:number;
    //public y:number;
    function MoveMode() {
        this.setTotalTime(0);
        this._canWork = false;
        this._totalTime = 0;
        this.road = new MoveRoad();
        this.load = new LoadPoint();
    }
    /// 总时间
    MoveMode.prototype.setTotalTime = function (time) {
        if (time > 0) {
            this._totalTime = time;
            this._canWork = true;
        }
        else {
            this._totalTime = 0;
            this._canWork = false;
        }
    };
    /// 总时间
    MoveMode.prototype.getTotalTime = function () {
        return this._totalTime;
    };
    /// 字符串转数据
    MoveMode.prototype.stringToData = function (str) {
        var obj = str.split('Volue:');
        var num = obj.length;
        if (num == 3) {
            this.road.stringToData(obj[1]);
            this.load.stringToData(obj[2]);
            this.setTotalTime(this.road.getTotalTime());
        }
    };
    /// 数据转字符串
    MoveMode.prototype.dataToString = function () {
        var str = 'Volue:' + this.road.dataToString() + 'Volue:' + this.load.dataToString();
        return str;
    };
    /// 改变显示类的位置
    MoveMode.prototype.moveTheObj = function (obj, x, y, useTime, testId) {
        if (useTime === void 0) { useTime = 60; }
        if (testId === void 0) { testId = 0; }
        this.move(useTime);
        obj.x = this.road.x + this.load.loadx + x;
        obj.y = this.road.y + this.load.loady + y;
        //        if(testId==1){
        //            console.log( this.road.x, this.road.y,x,y);
        //        }
    };
    /// 根据时间移动
    MoveMode.prototype.move = function (useTime) {
        if (!this._canWork)
            return;
        this.road.move(useTime);
        this.load.setByTime(useTime);
    };
    MoveMode.prototype.setCurePointAt = function (pointId, cureX, cureY, user) {
        //        this.road.setCureAtPoint(pointId,cureX,cureY,user);
        if (user === void 0) { user = 1; }
    };
    /// 增加路径点
    //0 不转动 1 顺时针 -1 逆时针
    MoveMode.prototype.addPoint = function (x, y, workTime, isRote) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (workTime === void 0) { workTime = 1000; }
        if (isRote === void 0) { isRote = 0; }
        this.road.add(x, y, workTime, isRote);
        this.setTotalTime(this.road.getTotalTime());
    };
    /// 减少路径点
    MoveMode.prototype.subPointAt = function (pointId) {
        this.road.subAt(pointId);
        this.setTotalTime(this.road.getTotalTime());
    };
    MoveMode.prototype.copy = function () {
        return this;
    };
    MoveMode.prototype.clear = function () {
        this.road.clear();
        this.load.clear();
    };
    return MoveMode;
})();
MoveMode.prototype.__class__ = "MoveMode";
