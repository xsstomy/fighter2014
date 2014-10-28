/**
 * Created by acer on 2014/10/14.
 */
class  MoveRoad{
    private static tranRa:number=Math.PI/180;
    public xArray:Array<number>;
    public yArray:Array<number>;
    public cureXArray:Array<number>;
    public cureYArray:Array<number>;
    public timeArray:Array<number>;
    public useCureArray:Array<number>;
    public curId:number; /// 现在所在的点
    public curIdTime:number;   /// 现在所在点的时间
    private _canWork:boolean;
    public num:number;
    private _totalTime:number;
    public loop:boolean;
    public toDie:boolean;
    public isDie:boolean;
    public x:number;
    public y:number;
    private end:boolean;
    public constructor(){
    this.setTotalTime(0);
    this.curIdTime=0;
    this.curId=0;
    this.num=0;
    this.xArray=[];
    this.yArray=[];
    this.timeArray=[];
    this.cureXArray=[];
    this.cureYArray=[];
    this.useCureArray=[];
    this.loop=true;
    this.x=0;
    this.y=0;
    this.end=false;
    this.toDie=false;
    this.isDie=false;
}
    /// 增加点

    public add(x:number,y:number,time:number,isRote:number=0):void{
        this.xArray.push(x);
        this.yArray.push(y);
        this.timeArray.push(time);
        this.num=this.xArray.length;
        if(this.num>1){
            this.cureXArray.push(this.xArray[this.num-2]+0.5*(this.xArray[this.num-1]-this.xArray[this.num-2]));
            this.cureYArray.push(this.yArray[this.num-2]+0.5*(this.yArray[this.num-1]-this.yArray[this.num-2]));
        }else{

            this.cureXArray.push(0);
            this.cureYArray.push(0);
         }
        this.useCureArray.push(isRote);
        this.setTotalTime(this.getTotalTime()+time);
    }

    /// 总时间
    public setTotalTime(time:number):void{
        if(time<=0){
            this._totalTime=0;
            this._canWork=false;
        }else{
            this._totalTime=time;
            this._canWork=true;
        }

        if(this.num<2){
            this._canWork=false;
        }
    }

    /// 总时间
    public getTotalTime():number{
        return this._totalTime;
    }
    /// 设置某点
    public setAt(id:number,x:number,y:number,time:number):void{
        if(id<this.num){
            this.xArray[id]=x;
            this.yArray[id]=y;

            if(time>=0){
                var changeTime:number=time-this.timeArray[id];
                this.timeArray[id]=time;
                this.setTotalTime(this.getTotalTime()+changeTime);
            }
        }
    }

    /// 删除某点
    public subAt(id:number):void{
        if(id<this.num){
            var objTime=this.timeArray[id];
            this.xArray.splice(id,1);
            this.yArray.splice(id,1);
            this.cureXArray.splice(id,1);
            this.cureYArray.splice(id,1);
            this.useCureArray.splice(id,1);
            this.timeArray.splice(id,1);
            this.setTotalTime(this.getTotalTime()-objTime);
            this.num=this.xArray.length;
        }
    }
    /// 检查经过这段时间后所在位置
    private checkTimeId(useTime:number):number{
        if(useTime==0)
            return useTime;
        /// 现在所在点
        var nowTime=this.curIdTime+useTime; /// 现在所在点的时间段；
        var leaveTime=nowTime-this.timeArray[this.curId]; /// 是否多出时间
        if(leaveTime<0){
            //否
            return useTime;
        }else{
            //是
            //跳下个点
            this.curId++;
            this.curIdTime=0;
            //剩下时间
            useTime=leaveTime;
            // 下个点到最后点
            if(this.curId>this.num-2){
                // 是否循环
                if(this.loop){
                    this.end=false;
                    if(this.num>1)
                    this.curId=1;
                    else
                    this.curId=0;
                }else{
                    this.curId=this.num-2;
                    useTime=this.timeArray[this.curId];
                    this.end=true;
                    if(this.toDie){
                        this.isDie=true;
                    }
                    return useTime;
                }
            }else{
                return useTime;
            }
            this.checkTimeId(useTime);
            return useTime;
        }

    }
    private cureTempAX:number;
    private cureTempAY:number;
    private cureTempBX:number;
    private cureTempBY:number;
    //// 路径移动
    public move(useTime:number):void{
        if(!this._canWork || this.end)
            return;
        var time:number=this.checkTimeId(useTime);
        var nextId:number=this.curId+1;
        this.curIdTime+=time;
        var timePer=this.curIdTime/this.timeArray[this.curId];
        //   var x:number=this.xArray[nextId]-this.xArray[this.curId];
        //   var y:number=this.yArray[nextId]-this.yArray[this.curId];
        //   this.x=x*timePer+this.xArray[this.curId];
        //   this.y=y*timePer+this.yArray[this.curId];

        if(this.useCureArray[this.curId]==0){
            var x:number=this.xArray[nextId]-this.xArray[this.curId];
            var y:number=this.yArray[nextId]-this.yArray[this.curId];
            this.x=x*timePer+this.xArray[this.curId];
            this.y=y*timePer+this.yArray[this.curId];
        }else{

            // this.cureTempAX=timePer*(this.cureXArray[this.curId]-this.xArray[this.curId])+this.xArray[this.curId];
            // this.cureTempAY=timePer*(this.cureYArray[this.curId]-this.yArray[this.curId])+this.yArray[this.curId];
            // this.cureTempBX=timePer*(this.xArray[nextId]-this.cureXArray[this.curId])+this.cureXArray[this.curId];
            // this.cureTempBY=timePer*(this.yArray[nextId]-this.cureYArray[this.curId])+this.cureYArray[this.curId];
            // this.x=this.cureTempAX+timePer*(this.cureTempBX-this.cureTempAX);
            // this.y=this.cureTempAY+timePer*(this.cureTempBY-this.cureTempAY);


            var midx=this.xArray[this.curId]+0.5*(this.xArray[nextId]-this.xArray[this.curId]);
            var midy=this.yArray[this.curId]+0.5*(this.yArray[nextId]-this.yArray[this.curId]);
            var oldAngle=Math.atan2(this.yArray[this.curId]-this.yArray[nextId],this.xArray[this.curId]-this.xArray[nextId]);
            var angle=oldAngle+Math.PI*timePer*this.useCureArray[this.curId];
            var leng:number=0.5*egret.Point.distance(new egret.Point(this.xArray[nextId],this.yArray[nextId]),new egret.Point(this.xArray[this.curId],this.yArray[this.curId]));
            this.x=midx+Math.cos(angle)*leng;
            this.y=midy+Math.sin(angle)*leng

        }
    }
    private testID:number=0;
    // 清楚
    public clear():void{
        this.curIdTime=0;
        this.curId=0;
        this.setTotalTime(0);
        this.curIdTime=0;
        this.curId=0;
        this.num=0;
        this.xArray=[];
        this.yArray=[];
        this.timeArray=[];
        this.cureXArray=[];
        this.cureYArray=[];
        this.useCureArray=[];
        this.loop=true;
        this.x=0;
        this.y=0;
        this.end=false;
        this.toDie=false;
        this.isDie=false;
    }
    /// 删除
    public gc():void{
        this.clear();
    }
    //// 数据转字符串
    public dataToString():string{
        var str:string='MR:';
        str+='xArray='+this.xArray.toString();
        str+=';yArray='+this.yArray.toString();
        str+=';timeArray='+this.timeArray.toString();
        str+=';cureXArray='+this.cureXArray.toString();
        str+=';cureYArray='+this.cureYArray.toString();
        str+=':useCureArray='+this.useCureArray.toString();
        str+=';loop='+this.loop;
        str+=';curId='+this.curId;
        str+=';curIdTime='+this.curIdTime;
        str+=';_totalTime='+this._totalTime;
        str+=';num='+this.num;
        str+=';work='+this._canWork;
        str+=';end='+this.end;
        str+=':toDie='+this.toDie;
        return str;
    }
    //// 字符串转数据
    public stringToData(str:string):void{
        var obj:Array<string>=str.split('MR:');

        var num:number=obj.length;
        if(num==2){
            var obj2:Array<string>=obj[1].split(';');
            num=obj2.length;

            for(var i:number=0;i<num;i++){
                this.setVule(obj2[i])
            }
        }
    }
    private setArr(str:string):Array<number>{
        var obj:Array<string>=str.split(',');
        var obj2:Array<number>=[];
        var num:number=obj.length;
        for(var i:number=0;i<num;i++){
            obj2.push(Number(obj[i]));
        }
        return obj2;
    }
    private setVule(str:string):void{
        var obj:Array<string>=str.split('=');

        if(obj.length==2){
            switch (obj[0]){
                case 'xArray':
                    this.xArray=this.setArr(obj[1]);
                    break;
                case 'yArray':
                    this.yArray=this.setArr(obj[1]);
                    break;
                case 'timeArray':
                    this.timeArray=this.setArr(obj[1]);
                    break;
                case 'cureXArray':
                    this.cureXArray=this.setArr(obj[1]);
                    break;
                case 'cureYArray':
                    this.cureYArray=this.setArr(obj[1]);
                    break;
                case 'useCureArray':
                    this.useCureArray=this.setArr(obj[1]);
                    break;
                case 'angleArray':
                    this.useCureArray=this.setArr(obj[1]);
                    break;
                case 'curId':
                    this.curId=Number(obj[1]);
                    break;
                case 'curIdTime':
                    this.curIdTime=Number(obj[1]);
                    break;
                case '_totalTime':
                    this._totalTime=Number(obj[1]);
                    break;
                case 'num':
                    this.num=Number(obj[1]);
                    break;
                case 'work':
                    this._canWork=(obj[1]=='true');
                    break;
                case 'end':
                    this.end=(obj[1]=='true');
                    break;
                case 'loop':
                    this.loop=(obj[1]=='true');
                    break;
                case 'toDie':
                    this.toDie=(obj[1]=='true');
                    break;
            }
        }
    }
    private copy():MoveRoad{
        var copyObj:MoveRoad=new MoveRoad();
        copyObj.xArray=this.setArr(this.xArray.toString());
        copyObj.yArray=this.setArr(this.yArray.toString());
        copyObj.timeArray=this.setArr(this.timeArray.toString());
        copyObj.cureXArray=this.setArr(this.cureXArray.toString());
        copyObj.cureYArray=this.setArr(this.cureYArray.toString());
        copyObj.useCureArray=this.setArr(this.useCureArray.toString());
        copyObj.curId=this.curId;
        copyObj.curIdTime=this.curIdTime;
        copyObj._canWork=this._canWork;
        copyObj.num=this.num;
        copyObj._totalTime=this._totalTime;
        copyObj.loop=this.loop;
        copyObj.x=this.x;
        copyObj.y=this.y;
        copyObj.end=this.end;
        copyObj.toDie=this.toDie;
        copyObj.isDie=this.isDie;
        return copyObj
    }
}