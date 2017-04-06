!function ()
{


    var Visualizer       = function ()
    {
        this.file = null; //要处理的文件，后面会讲解如何获取文件
        this.fileName = null; //要处理的文件的名，文件名
        this.audioContext = null; //进行音频处理的上下文，稍后会进行初始化
        this.source = null;//保存音频
    };
    Visualizer.prototype = {
        _prepareAPI: function ()
        {
            //统一前缀，方便调用
            window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
            //这里顺便也将requestAnimationFrame也打个补丁，后面用来写动画要用
            window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
            //安全地实例化一个AudioContext并赋值到Visualizer的audioContext属性上，方便后面处理音频使用
            try {
                this.audioContext = new AudioContext();
            } catch (e) {
                console.log('!妳的浏览器不支持AudioContext:(');
                console.log(e);
            }
        },
        _updateInfo: function (text, processing)
        {
            console.log(text + '<=' + processing);
        },
        _start: function ()
        {
            //read and decode the file into audio array buffer
            var that   = this,
                file   = this.file,
                fr     = new FileReader();
            fr.onload  = function (e)
            {
                var fileResult   = e.target.result;
                var audioContext = that.audioContext;
                if (audioContext === null) {
                    return;
                }
                that._updateInfo('Decoding the audio', true);
                audioContext.decodeAudioData(fileResult, function (buffer)
                {
                    that._updateInfo('Decode succussfully,start the visualizer', true);
                    that._visualize(audioContext, buffer);
                }, function (e)
                {
                    that._updateInfo('!Fail to decode the file', false);
                    console.log(e);
                });
            };
            fr.onerror = function (e)
            {
                that._updateInfo('!Fail to read the file', false);
                console.log(e);
            };
            //assign the file to the reader
            this._updateInfo('Starting read the file', true);
            fr.readAsArrayBuffer(file);
        },
        _visualize: function (audioContext, buffer)
        {
            var audioBufferSouceNode = audioContext.createBufferSource(),
                analyser             = audioContext.createAnalyser(),
                that                 = this;
            //connect the source to the analyser
            audioBufferSouceNode.connect(analyser);
            //connect the analyser to the destination(the speaker), or we won't hear the sound
            analyser.connect(audioContext.destination);
            //then assign the buffer to the buffer source node
            audioBufferSouceNode.buffer = buffer;
            //play the source
            if (!audioBufferSouceNode.start) {
                audioBufferSouceNode.start = audioBufferSouceNode.noteOn;//in old browsers use noteOn method
                audioBufferSouceNode.stop = audioBufferSouceNode.noteOff;//in old browsers use noteOn method
            }
            audioBufferSouceNode.start(0);
            audioBufferSouceNode.onended = function ()
            {
                that._audioEnd(that);
            };
            //stop the previous sound if any
            if (this.source !== null) {
                this.forceStop = true;
                this.source.stop(0);
            }
            this.source = audioBufferSouceNode;
            this._updateInfo('Playing ' + this.fileName, false);
            this.info                                            = 'Playing ' + this.fileName;
            document.getElementById('fileWrapper').style.opacity = 0.2;
            this._drawSpectrum(analyser);
        }
    };

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

    function shifting()
    {
        var x    = Math.random() * width * 1.4;
        var l    = Math.abs(middle[0] - x);
        var maxL = width * 1.2 - middle[0];
        if (l / maxL < 0.4) {
            x = Math.random() * width * 1.2;
        }
        return x;
    }

    function OriRainDrop()
    {
        var t = this;

        function init()
        {
            t.direct = 0.1 + Math.random() * 0.4;
            t.x      = shifting();
            t.y      = Math.random() * height * 1.2;
            t.f_x    = t.x + (middle[0] - t.x) * t.direct;
            t.f_y    = t.y + (middle[1] - t.y) * t.direct;
            t.r      = 3 + Math.random() * 3; //半径
            t.color    =  //t.x <= width / 2 ? [getRandNum(150, 255), 0, 0] :
                getRandNum(200, 255);
            t.color    = [t.color, t.color, t.color];
            t.alpha    = MathR(0.6);
            t.life     = 20 + parseInt(Math.random() * 40);
            t.xCal     = (t.f_x - t.x) / t.life;
            t.yCal     = (t.f_y - t.y) / t.life;
            t.rCal     = (t.r - t.r * Math.random()*0.5) /t.life;
            t.alphaCal = 1.1 * t.alpha / t.life
        }

        this.draw = function ()
        {
            if (typeof t.life == 'undefined' || t.life <= 0) {
                init();
                return;
            } else {
                t.life--;
                t.x += t.xCal;
                t.y += t.yCal;
                t.r -= t.rCal;
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