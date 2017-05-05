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

    static ini(n, c)
    {
        new this(n, c);
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
        let t    = {};
        t.direct = 0.1 + Math.random() * 0.4;
        t.x      = this.shifting();
        t.y      = Math.random() * this.cvs.height * 1.2;
        t.f_x    = t.x + (this.middle[0] - t.x) * t.direct;
        t.f_y    = t.y + (this.middle[1] - t.y) * t.direct;
        t.r      = 3 + Math.random() * 3; //半径
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

class audioCvs {
    constructor(filePath)
    {
        this.file         = '';
        this.audioContext = new AudioContext();
        this.loadSound(filePath);
    }

    static ini(p)
    {
        new this(p)
    }

    loadSound(url)
    {
        let request = new XMLHttpRequest();//建立一个请求
        request.open('GET', url, true); //配置好请求类型，文件路径等
        request.responseType = 'arraybuffer'; //配置数据返回类型
        // 一旦获取完成，对音频进行进一步操作，比如解码
        request.onload = () =>
        {
            this.file = request.response;
            this.loadAudioFile();
        };
        request.send();
    }


    log(x, y = 'normal')
    {
        console.log(y + ':' + x);
    }

    loadAudioFile()
    {
        let file = this.file;
        this.audioContext.decodeAudioData(file, (buffer)=>
        {
            this.getStart(buffer);
        });
    }


    getStart(buffer)
    {
        let audioBufferSourceNode = this.audioContext.createBufferSource(),
            analyser              = this.audioContext.createAnalyser();
        //connect the source to the analyser
        audioBufferSourceNode.connect(analyser);
        //connect the analyser to the destination(the speaker), or we won't hear the sound
        analyser.connect(this.audioContext.destination);
        //then assign the buffer to the buffer source node
        audioBufferSourceNode.buffer = buffer;
        //play the source
        if (!audioBufferSourceNode.start) {
            audioBufferSourceNode.start = audioBufferSourceNode.noteOn //in old browsers use noteOn method
            audioBufferSourceNode.stop = audioBufferSourceNode.noteOff //in old browsers use noteOff method
        }
        audioBufferSourceNode.start(0);
        audioBufferSourceNode.onended = ()=>
        {
            this.loadAudioFile();
        };
        this.canvasImg(analyser);
    }

    canvasImg(analyser)
    {

        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        log(array);
//        setTimeout(this.canvasImg(analyser), 1000/60);
    }

    _drawSpectrum(analyser)
    {
        var self              = this,
            canvas            = document.getElementById('canvas'),
            cwidth            = canvas.width,
            cheight           = canvas.height - 2,
            meterWidth        = 10, //width of the meters in the spectrum
            gap               = 2, //gap between meters
            capHeight         = 2,
            capStyle          = '#fff',
            meterNum          = 800 / (10 + 2), //count of the meters
            capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
        ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, '#0f0');
        gradient.addColorStop(0.5, '#ff0');
        gradient.addColorStop(0, '#f00');
        var drawMeter    = function ()
        {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            if (self.status === 0) {
                //fix when some sounds end the value still not back to zero
                for (var i = array.length - 1; i >= 0; i--) {
                    array[i] = 0;
                }
                ;
                allCapsReachBottom = true;
                for (var i = capYPositionArray.length - 1; i >= 0; i--) {
                    allCapsReachBottom = allCapsReachBottom && (capYPositionArray[i] === 0);
                }
                ;
                if (allCapsReachBottom) {
                    cancelAnimationFrame(self.animationId); //since the sound is stoped and animation finished, stop the requestAnimation to prevent potential memory leak,THIS IS VERY IMPORTANT!
                    return;
                }
                ;
            }
            ;
            var step = Math.round(array.length / meterNum); //sample limited data from the total array
            ctx.clearRect(0, 0, cwidth, cheight);
            for (var i = 0; i < meterNum; i++) {
                var value = array[i * step];
                if (capYPositionArray.length < Math.round(meterNum)) {
                    capYPositionArray.push(value);
                }
                ;
                ctx.fillStyle = capStyle;
                //draw the cap, with transition effect
                if (value < capYPositionArray[i]) {
                    ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
                } else {
                    ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                    capYPositionArray[i] = value;
                }
                ;
                ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
                ctx.fillRect(i * 12 /*meterWidth+gap*/, cheight - value + capHeight, meterWidth, cheight); //the meter
            }
            self.animationId = requestAnimationFrame(drawMeter);
        }
        this.animationId = requestAnimationFrame(drawMeter);
    }

}

rainDrop.ini('.img', '#canvas');

audioCvs.ini('bgm/ying.mp3');

