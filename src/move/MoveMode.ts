/**
 * Created by acer on 2014/10/14.
 */
class MoveMode{

    private _totalTime:number;
    private _canWork:boolean;
    public road:MoveRoad;
    public load:LoadPoint;
    //public x:number;
    //public y:number;
    public constructor(){
        this.setTotalTime(0);
        this._canWork=false;
        this._totalTime=0;
        this.road=new MoveRoad();
        this.load=new LoadPoint();
    }
    /// 总时间
    public setTotalTime(time:number):void{
        if(time>0){
            this._totalTime=time;
            this._canWork=true;
        }else{
            this._totalTime=0;
            this._canWork=false;
        }
    }
    /// 总时间
    public getTotalTime():number{
        return this._totalTime;
    }
    /// 字符串转数据
    public stringToData(str:string):void{
        var obj:Array<string>=str.split('Volue:');
        var num:number=obj.length;
        if(num==3){
            this.road.stringToData(obj[1]);
            this.load.stringToData(obj[2]);
            this.setTotalTime(this.road.getTotalTime());
            //var i:egret.Ease;
            //egret.Ease.circInOut(0);
        }
    }
    /// 数据转字符串
    public dataToString():string{
        var str:string='Volue:'+this.road.dataToString()+'Volue:'+this.load.dataToString();
        return str
    }
    /// 改变显示类的位置
    public moveTheObj(obj:egret.DisplayObject,x:number,y:number,useTime:number=60,testId:number=0):void{
        this.move(useTime);

        obj.x=this.road.x+this.load.loadx+x;
        obj.y=this.road.y+this.load.loady+y;
//        if(testId==1){
//            console.log( this.road.x, this.road.y,x,y);
//        }
    }
    /// 根据时间移动
    public move(useTime:number):void{
        if(!this._canWork)
        return;
        this.road.move(useTime);
        this.load.setByTime(useTime);
    }
    public setCurePointAt(pointId:number,cureX:number,cureY:number,user:number=1):void{
//        this.road.setCureAtPoint(pointId,cureX,cureY,user);


    }
    /// 增加路径点
    //0 不转动 1 顺时针 -1 逆时针
    public addPoint(x:number=0,y:number=0,workTime:number=1000,isRote:number=0):void{
        this.road.add(x,y,workTime,isRote);
        this.setTotalTime(this.road.getTotalTime());
    }
    /// 减少路径点
    public subPointAt(pointId:number):void{
        this.road.subAt(pointId);
        this.setTotalTime(this.road.getTotalTime());
    }
    public copy():MoveMode{
        return this
    }
    public clear():void{
        this.road.clear();
        this.load.clear();
    }
}