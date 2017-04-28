//es6写法
class canvasAni {
    constructor(objName, objCvs)
    {
        this.obj        = $(objName);
        this.cvs        = $(objCvs)[0];
        this.cvs.width  = this.obj.width();
        this.cvs.height = this.obj.height();
        this.ctx        = this.cvs.getContext('2d');
    }
}

class rainDrop extends canvasAni {
    constructor(n, c)
    {
        super(n, c);
        this.eleArr = [];
        this.middle = [this.cvs.width / 2, this.cvs.height * (1 - 0.618)];
        for (var i = 0; i < Math.sqrt(this.cvs.width * this.cvs.height); i += 5) {
            this.eleArr.push(this.setRainDrop());
        }
        this.aniCount = 1;
        this.startAni();
    }
    static ini(n,c){
        new this(n,c);
    }

    startAni()
    {
        let t = this;
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        for (let i = 0; i <= this.aniCount && i < this.eleArr.length; i++) {
            this.aniRainDrop(this.eleArr[i], i);
        }
        this.aniCount < this.eleArr.length ? this.aniCount++ : '';
        requestAnimationFrame(()=>t.startAni());
    }

    shifting()
    {
        let x    = Math.random() * this.cvs.width * 1.4;
        let l    = Math.abs(this.middle[0] - x);
        let maxL = this.cvs.width * 1.2 - this.middle[0];
        if (l / maxL < 0.4) {
            x = Math.random() * this.cvs.width * 1.2;
        }
        return x;
    }

    mathR(x)
    {
        return x + Math.random() * (1 - x);
    }

    setRainDrop()
    {
        let t       = {};
        t.direct    = 0.1 + Math.random() * 0.4;
        t.x         = this.shifting();
        t.y         = Math.random() * this.cvs.height * 1.2;
        t.f_x       = t.x + (this.middle[0] - t.x) * t.direct;
        t.f_y       = t.y + (this.middle[1] - t.y) * t.direct;
        t.r         = 3 + Math.random() * 3; //半径
        t.color    =  //t.x <= width / 2 ? [getRandNum(150, 255), 0, 0] :
            getRandNum(200, 255);
        t.color    = [t.color, t.color, t.color];
        t.alpha    = this.mathR(0.6);
        t.life     = 20 + parseInt(Math.random() * 40);
        t.xCal     = (t.f_x - t.x) / t.life;
        t.yCal     = (t.f_y - t.y) / t.life;
        t.rCal     = (t.r - t.r * Math.random() * 0.5) / t.life;
        t.alphaCal = 1.1 * t.alpha / t.life;
        return t;
    }

    aniRainDrop(t, num)
    {
        if (typeof t.life == 'undefined' || t.life <= 0) {
                this.eleArr[num] = this.setRainDrop();
                return;
            } else {
                t.life--;
                t.x += t.xCal;
                t.y += t.yCal;
                t.r -= t.rCal;
                t.alpha -= t.alphaCal;
            }
            this.ctx.beginPath();
            let grd = this.ctx.createRadialGradient(t.x, t.y, t.r / 10, t.x, t.y, t.r);
            grd.addColorStop(0, "rgba(148,255,255," + t.alpha + ")");
            grd.addColorStop(0.7, "rgba(" + t.color[0] + "," + t.color[0] + "," + t.color[0] + "," + t.alpha + ")");
            grd.addColorStop(1, "rgba(255,255,255,0)");
            this.ctx.fillStyle = grd;
            this.ctx.fillRect(t.x - t.r, t.y - t.r, t.r * 2, t.r * 2);

//                ctx.arc(t.x, t.y, t.r, 0, 2 * Math.PI, false);
//                ctx.fillStyle = 'rgba(' + t.color[0] + ',' + t.color[1] + ',' + t.color[2] + ',' + t.alpha + ')';
            this.ctx.fill();
    }
}

rainDrop.ini('.img', '#canvas');

//
//
//!function ()
//{
//
//    var obj = $('.img');
//    var height, width, eleArr, middle;
//    height  = obj.height();
//    width   = obj.width();
//    middle  = [width / 2, height * (1 - 0.618)];//黄金比例
//
//    canvas        = document.getElementById('canvas');
//    canvas.width  = width;
//    canvas.height = height;
//    ctx           = canvas.getContext('2d');
//    eleArr        = [];
//    for (var i = 0; i < Math.sqrt(width * height); i += 5) {
//        eleArr.push(new OriRainDrop());
//    }
//    startAni();
//    var eLength = eleArr.length;
//    var eCount  = 0;
//
//    function startAni()
//    {
//        ctx.clearRect(0, 0, width, height);
//        for (var i = 0; i <= eCount && i <= (eLength - 1); i++) {
//            eleArr[i].draw();
//        }
//        requestAnimationFrame(startAni);
//        if (eCount < eLength) {
//            eCount++;
//        }
//    }
//
//    function MathR(x)
//    {
//        return x + Math.random() * (1 - x);
//    }
//
//    function shifting()
//    {
//        var x    = Math.random() * width * 1.4;
//        var l    = Math.abs(middle[0] - x);
//        var maxL = width * 1.2 - middle[0];
//        if (l / maxL < 0.4) {
//            x = Math.random() * width * 1.2;
//        }
//        return x;
//    }
//
//    function OriRainDrop()
//    {
//        var t = this;
//
//        function init()
//        {
//            t.direct = 0.1 + Math.random() * 0.4;
//            t.x      = shifting();
//            t.y      = Math.random() * height * 1.2;
//            t.f_x    = t.x + (middle[0] - t.x) * t.direct;
//            t.f_y    = t.y + (middle[1] - t.y) * t.direct;
//            t.r      = 3 + Math.random() * 3; //半径
//            t.color    =  //t.x <= width / 2 ? [getRandNum(150, 255), 0, 0] :
//                getRandNum(200, 255);
//            t.color    = [t.color, t.color, t.color];
//            t.alpha    = MathR(0.6);
//            t.life     = 20 + parseInt(Math.random() * 40);
//            t.xCal     = (t.f_x - t.x) / t.life;
//            t.yCal     = (t.f_y - t.y) / t.life;
//            t.rCal     = (t.r - t.r * Math.random() * 0.5) / t.life;
//            t.alphaCal = 1.1 * t.alpha / t.life
//        }
//
//        this.draw = function ()
//        {
//            if (typeof t.life == 'undefined' || t.life <= 0) {
//                init();
//                return;
//            } else {
//                t.life--;
//                t.x += t.xCal;
//                t.y += t.yCal;
//                t.r -= t.rCal;
//                t.alpha -= t.alphaCal;
//            }
//            ctx.beginPath();
//            var grd = ctx.createRadialGradient(t.x, t.y, t.r / 10, t.x, t.y, t.r);
//            grd.addColorStop(0, "rgba(148,255,255," + t.alpha + ")");
//            grd.addColorStop(0.7, "rgba(" + t.color[0] + "," + t.color[0] + "," + t.color[0] + "," + t.alpha + ")");
//            grd.addColorStop(1, "rgba(255,255,255,0)");
//            ctx.fillStyle = grd;
//            ctx.fillRect(t.x - t.r, t.y - t.r, t.r * 2, t.r * 2);
//
////                ctx.arc(t.x, t.y, t.r, 0, 2 * Math.PI, false);
////                ctx.fillStyle = 'rgba(' + t.color[0] + ',' + t.color[1] + ',' + t.color[2] + ',' + t.alpha + ')';
//            ctx.fill();
//        }
//    }
//
//}();
