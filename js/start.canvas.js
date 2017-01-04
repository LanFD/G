!function ()
{
    var obj = $('.img');
    var height, width, eleArr, middle;
    height  = obj.height();
    width   = obj.width();
    middle  = [width / 2, height * (1 - 0.618)];//黄金比例

    canvas        = document.getElementById('canvas');
    canvas.width  = width;
    canvas.height = height;
    ctx           = canvas.getContext('2d');
    eleArr        = [];
    for (var i = 0; i < Math.sqrt(width * height); i += 5) {
        eleArr.push(new OriRainDrop());
    }
    startAni();
    var eLength = eleArr.length;
    var eCount  = 0;

    function startAni()
    {
        ctx.clearRect(0, 0, width, height);
        for (var i = 0; i <= eCount && i <= (eLength - 1); i++) {
            eleArr[i].draw();
        }
        requestAnimationFrame(startAni);
        if (eCount < eLength) {
            eCount++;
        }
    }
    function MathR(x)
    {
        return x + Math.random() * (1 - x);
    }

    function shifting(){
        var x = Math.random() * width * 1.2;
        var l = Math.abs(middle[0] - x);
        var maxL = width * 1.2 - middle[0];
        if(l/maxL<0.4){
            x = Math.random() * width * 1.2;
        }
        return x;
    }

    function OriRainDrop()
    {
        var t = this;

        function init()
        {
            t.x   = shifting();
            t.y   = Math.random() * height * 1.2;
            t.f_x = t.x + (middle[0] - t.x) * (0.1 + Math.random() * 0.4);
            t.f_y = t.y + (middle[1] - t.y) * (0.1 + Math.random() * 0.4);
            t.r   = 3 + Math.random() * 5; //半径
            t.color    =  //t.x <= width / 2 ? [getRandNum(150, 255), 0, 0] :
                getRandNum(200, 255);
            t.color    = [t.color, t.color, t.color];
            t.alpha    = MathR(0.6);
            t.life     = 50 + parseInt(Math.random() * 100);
            t.xCal     = (t.f_x - t.x) / t.life;
            t.yCal     = (t.f_y - t.y) / t.life;
            t.rCal     = t.r / (t.life * 5);
            t.alphaCal = 1.1 * t.alpha / t.life
        }

        this.draw = function ()
        {
            if (typeof t.life == 'undefined' || t.life <= 0) {
                init();
            } else {
                t.life--;
                t.x += t.xCal;
                t.y += t.yCal;
                t.r = t.r / (1 + t.rCal);
                t.alpha -= t.alphaCal;
            }
            ctx.beginPath();


            var grd = ctx.createRadialGradient(t.x, t.y, t.r / 10, t.x, t.y, t.r);
            grd.addColorStop(0, "rgba(148,255,255," + t.alpha + ")");
            grd.addColorStop(0.7, "rgba(" + t.color[0] + "," + t.color[0] + "," + t.color[0] + "," + t.alpha + ")");
            grd.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = grd;
            ctx.fillRect(t.x - t.r, t.y - t.r, t.r * 2, t.r * 2);

//                ctx.arc(t.x, t.y, t.r, 0, 2 * Math.PI, false);
//                ctx.fillStyle = 'rgba(' + t.color[0] + ',' + t.color[1] + ',' + t.color[2] + ',' + t.alpha + ')';
            ctx.fill();
        }
    }

}();