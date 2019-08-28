

// 封装一个小球
class Ball{
    constructor(options){
        this.x = 0; //小球x坐标
        this.y = 0; //小球y坐标
        this.r = 20; //小球半径

        this.scaleX = 1;  //小球x轴的缩放
        this.scaleY = 1; //小球y轴的缩放
        this.strokeStyle = 'rgba(0,0,0,0)';  //小球的描边颜色
        this.fillStyle = '#abcdef'; //小球填充色
        this.opacity = 1; //小球透明度

        this.g  = 3;//小于的重力加速度

        this.x3d = 0;
        this.y3d = 0;
        this.z3d = 0;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;

        Object.assign(this,options); //将实例化的参数覆盖默认参数
        return this;  //返回当前对象，以实现链式调用
    }
    render(context){
        let {x, y, r, scaleX, scaleY, fillStyle, strokeStyle, opacity } = this;
        context.save()
        context.strokeStyle = strokeStyle
        context.fillStyle = fillStyle
        context.translate(x, y)
        context.globalAlpha = opacity
        context.scale(scaleX, scaleY)
        context.beginPath()
        context.arc(0,0,r,0,Math.PI*2,false)
        context.fill()
        context.stroke()
        context.restore();
        return this
    }
}

//矩形类
class Rect {
    constructor(options) {
        this.x = 0;//x坐标
        this.y = 0;//y坐标
        this.w = 100;//半径
        this.h = 50;//半径
        this.strokeStyle = 'rgba(0,0,0,0)';//的描边颜色
        this.fillStyle = '#abcdef';//填充颜色
        this.opacity = 1;//透明度
        Object.assign(this, options);//将实例化的参数覆盖默认参数
        return this;//返回当前对象，以实现链式调用
    }

    render(context, pointX, pointY) {
        let { x, y, w,h, scaleX, scaleY, fillStyle, strokeStyle, opacity } = this;
        context.save();
        context.strokeStyle = strokeStyle;
        context.fillStyle = fillStyle;
        context.translate(x, y);
        context.globalAlpha = opacity;
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(w,0);
        context.lineTo(w,h);
        context.lineTo(0,h);
        context.closePath();
        if (pointX && pointY) {
            this.isPointInPath = context.isPointInPath(pointX, pointY);
        }
        context.fill();
        context.stroke();
        context.restore();
        return this;
    }
}

//直线类
class Line {
    constructor(options) {
        this.x = 0;//x坐标
        this.y = 0;//y坐标

        this.x1 = 0;//线条起点X坐标
        this.y1 = 0;//线条起点Y坐标

        this.x2 = 0;//线条终点X坐标
        this.y2 = 0;//线条终点Y坐标

        this.rotation = 0;//旋转角度
        this.lineWidth = 1;//线条粗细

        this.strokeStyle = 'rgba(0,0,0,1)';//直线的描边颜色

        Object.assign(this, options);//将实例化的参数覆盖默认参数

        return this;//返回当前对象，以实现链式调用
    }

    render(context) {
        let { x, y, x1, y1, x2, y2, lineWidth, strokeStyle, rotation } = this;
        context.save();
        context.translate(x, y);
        context.rotate(rotation);
        context.lineWidth = lineWidth;
        context.strokeStyle = strokeStyle;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.restore();
        return this;
    }
}

//封装
var util = {
    dis(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    },
    range(min, max){
        return min + Math.random() * (max - min);
    },
    decodePolygon(coordinate,encodeOffsets,encodeScale){
        const result = [];
        let prevX = encodeOffsets[0];
        let prevY = encodeOffsets[1];

        for(let i =0 ; i < coordinate.length; i++){
            let x = corrdinate.charCodeAt(i) - 64;
            let y = corrdinate.charCodeAt(i+1) - 64;

            x = x >> 1 ^ - (x & 1);
            x = y >> 1 ^ - (y & 1);

            x += prevX;
            y += prevY;

            result.push([x / encodeScale,y / encodeScale])
        }

        return result;
    },
    decode(json){
        if(!json.UFT8Encoding){
            return json;
        }
        let encodeScale = json.UTF8Scale;
        if(!encodeScale){
            encodeScale = 1024;

        }

        let features = json.features;

        features.forEach(feature=>{
            let geometry = feature.geometry;
            let coordinates =  geometry.coordinates;
            let encodeOffsets = geometry.encodeOffsets;
            coordinates.forEach((coordinate,i)=>{
                if(geometry.type === 'Polygon'){
                    coordinates[i] = this.decodePolygon(coordinate,encodeOffsets[i],encodeScale);
                }else if(geometry.type === 'MultiPolygon'){
                    coordinate.forEach((ploygon,k)=>{
                        coordinate[k] = this.decodePolygon(ploygon,encodeOffsets[i][k],encodeScale);
                    })
                }
            })
        })

        json.UTF8coding = false;

        return json;
    }
};
