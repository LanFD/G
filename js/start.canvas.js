function startCanvas() {

    var width, height, largeHeader, canvas, ctx, circles, target, animateHeader = true;
    var htmlObj = $('#canvas');
    // Main
    initHeader();

    function initHeader() {
        width         = htmlObj.width();
        height        = htmlObj.height();
        if(height > width){
            height = width ^ height;
            width  = height ^ width;
            height = width ^ height;
        }
        canvas        = document.getElementById('canvas');
        canvas.width  = width;
        canvas.height = height;
        ctx           = canvas.getContext('2d');
        // create particles
        circles = [];
        for (var x = 0; x < width * 0.9; x++) {
            circles.push(new Circle());
        }
        animate();
    }

    function animate() {
        if (animateHeader) {
            ctx.clearRect(0,0, width, height);

            for (var i in circles) {
                circles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }

    // Canvas manipulation
    function Circle() {
        var _this = this;
        var w20000 = width/20000;
        var w2     = width/2;

        // constructor
        (function () {
            _this.pos = {};
            init();
        })();

        function init() {
            _this.pos.x    = Math.random() * width *1.2;
            _this.pos.y    = height +Math.random()*100;
            _this.alpha    = 0.1 + Math.random() * 0.9;
            _this.scale    = w20000 + Math.random() * 0.4;
            _this.velocity = Math.random()*1.3;
            _this.color    = _this.pos.x < w2 ? [getRandNum(150,255),0,0]: [255,255,255];
        }

        this.draw = function () {
            if (_this.alpha <= 0.05) {
                init();
            }
            _this.pos.y -= _this.velocity;
            _this.alpha -= 0.001 + _this.alpha*0.002;
            _this.color[0] > 0 ?  _this.color[0]-- : '';
            _this.color[1] > 0 ?  _this.color[1]-- : '';
            _this.color[2] > 0 ?  _this.color[2]-- : '';
            ctx.beginPath();
            ctx.arc(_this.pos.x--, _this.pos.y, _this.scale * 10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba('+_this.color[0]+','+_this.color[1]+','+_this.color[2]+',' + _this.alpha + ')';
            ctx.fill();
        };
    }

};

startCanvas();