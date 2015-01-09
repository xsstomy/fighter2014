/**
 * Created by acer on 2014/10/13.
 */
class LoadPoint{
    /// 引导点 控制转动
    private static tranRa:number=Math.PI/180;
    public x:number;
    public y:number;
    public power:number;
    public angle:number;
    public workAngle:number;
    public loadx:number;
    public loady:number;
    private _canWork:boolean;
    public setWork(bool:boolean):void{

        this._canWork=bool;
    }
    public getWork():boolean{
        return this._canWork;

    }
    public constructor(){
        this.x=0;
        this.y=0;
        this.power=0;
        this.angle=0;
        this.workAngle=0;
        this.loadx=0;
        this.loady=0;
        this._canWork=false;
    }
   /// 删除
    public gc():void{
        this.clear();
    }
    // 清除
    public clear():void{
        this.x=0;
        this.y=0;
    }
    //// 根据时间，改变数据
    public setByTime(timeId:number):void{
        if(!this._canWork)
        return;
        var angle=this.angle+this.workAngle*timeId*LoadPoint.tranRa;
        this.loady=Math.cos(angle)*this.power;
        this.loadx=Math.sin(angle)*this.power;
        return;
        ///var p:egret.Point=new egret.Point(this.loadx+this.x,this.loady+this.y);
       /// return p;
    }
    /// 字符串转数据   LP:power=1;angle=0;workAngle=0;setWork=true;
    public stringToData(str:string):void{
            var obj:Array<string>=str.split('LP:');

            var num:number=obj.length;
            if(num==2){
                var obj2:Array<string>=obj[1].split(';');
                num=obj2.length;
                for(var i:number=0;i<num;i++){
                    this.setVule(obj2[i])
                }
            }
        return
    }
    private copy():LoadPoint{
        var copyObj:LoadPoint=new LoadPoint();
        copyObj.x=this.x;
        copyObj.y=this.y;
        copyObj.power=this.power;
        copyObj.angle=this.angle;
        copyObj.workAngle=this.workAngle;
        copyObj.loadx=this.loadx;
        copyObj.loady=this.loady;
        copyObj.setWork(this._canWork);
        return copyObj
    }
    private setVule(str:string):void{
        var obj:Array<string>=str.split('=');
        if(obj.length==2){
           switch (obj[0]){
               case 'power':
                   this.power=Number(obj[1]);
                   break;
               case 'angle':
                   this.angle=Number(obj[1]);
                   break;
               case 'workAngle':
                   this.workAngle=Number(obj[1]);
                   break;
               case 'setWork':
                   var b:boolean=(obj[1]=='true');
                   this.setWork(b);
                   break;
           }
        }
    }
    /// 数据转字符串
    public dataToString():string{
        var str:string='LP:';
        str+='power='+this.power;
        str+=';angle='+this.angle;
        str+=';workAngle='+this.workAngle;
        str+=';setWork='+this._canWork;
        return str
    }
}