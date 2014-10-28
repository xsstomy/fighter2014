/**
 * Created by acer on 2014/10/13.
 */
var LoadPoint = (function () {
    function LoadPoint() {
        this.x = 0;
        this.y = 0;
        this.power = 0;
        this.angle = 0;
        this.workAngle = 0;
        this.loadx = 0;
        this.loady = 0;
        this._canWork = false;
    }
    LoadPoint.prototype.setWork = function (bool) {
        this._canWork = bool;
    };
    LoadPoint.prototype.getWork = function () {
        return this._canWork;
    };
    /// 删除
    LoadPoint.prototype.gc = function () {
        this.clear();
    };
    // 清除
    LoadPoint.prototype.clear = function () {
        this.x = 0;
        this.y = 0;
    };
    //// 根据时间，改变数据
    LoadPoint.prototype.setByTime = function (timeId) {
        if (!this._canWork)
            return;
        var angle = this.angle + this.workAngle * timeId * LoadPoint.tranRa;
        this.loady = Math.cos(angle) * this.power;
        this.loadx = Math.sin(angle) * this.power;
        return;
        ///var p:egret.Point=new egret.Point(this.loadx+this.x,this.loady+this.y);
        /// return p;
    };
    /// 字符串转数据   LP:power=1;angle=0;workAngle=0;setWork=true;
    LoadPoint.prototype.stringToData = function (str) {
        var obj = str.split('LP:');
        var num = obj.length;
        if (num == 2) {
            var obj2 = obj[1].split(';');
            num = obj2.length;
            for (var i = 0; i < num; i++) {
                this.setVule(obj2[i]);
            }
        }
        return;
    };
    LoadPoint.prototype.copy = function () {
        var copyObj = new LoadPoint();
        copyObj.x = this.x;
        copyObj.y = this.y;
        copyObj.power = this.power;
        copyObj.angle = this.angle;
        copyObj.workAngle = this.workAngle;
        copyObj.loadx = this.loadx;
        copyObj.loady = this.loady;
        copyObj.setWork(this._canWork);
        return copyObj;
    };
    LoadPoint.prototype.setVule = function (str) {
        var obj = str.split('=');
        if (obj.length == 2) {
            switch (obj[0]) {
                case 'power':
                    this.power = Number(obj[1]);
                    break;
                case 'angle':
                    this.angle = Number(obj[1]);
                    break;
                case 'workAngle':
                    this.workAngle = Number(obj[1]);
                    break;
                case 'setWork':
                    var b = (obj[1] == 'true');
                    this.setWork(b);
                    break;
            }
        }
    };
    /// 数据转字符串
    LoadPoint.prototype.dataToString = function () {
        var str = 'LP:';
        str += 'power=' + this.power;
        str += ';angle=' + this.angle;
        str += ';workAngle=' + this.workAngle;
        str += ';setWork=' + this._canWork;
        return str;
    };
    /// 引导点 控制转动
    LoadPoint.tranRa = Math.PI / 180;
    return LoadPoint;
})();
