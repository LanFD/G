//@author Ht  mail 382354412@qq.com
var textObj          = document.getElementById('content');
var nextSentenceTime = 1000; //句子间隔时间
var wordTime         = 200;  //字间隔时间
var nowChapter       = 1;    //第几章节
var auto             = 0;    //是否auto play
var begin            = 0;    //是否开始阅读
var storyName        = 'storyname1';
var tkl;                    //click 闪烁
var skipping         = 0;   //是否正在快进
var story;
var interval;
var end;
var scenePath        = 'img/scene/';
var d                = new Date();
var nowTime          = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' '
                       + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
$(".toolMask").mouseover(function(){
    $(".tool").fadeIn(300);
});

$(".toolMask").mouseleave(function(){
    $(".tool").fadeOut(300);
});
(function(){
    $(".roleImg").css("bottom",$("#text").height()+'px');
})();


function log(x) {
    console.log(x);
}

function getText(cb) {
    var url = 'script/' + storyName + '/' + nowChapter + '.json';
    $.ajax({
               type:     'get',
               url:      url,
               dataType: 'json',
               //async:    false,
               success:  function (d) {
                   if (d) {
                       story = d;
                       //log(d);
                       cb();
                   } else {
                       fin();
                   }

               },
               error:    function (d) {
                   //alert(d.status);
                   if (d.status == 404) {
                       fin();
                   }
               }
           }
    );
}

function showName(name){
    $('#name').html(name);
    if($('#roleName').is(":hidden")){
        $('#roleName').show();
    }
}

var sentences = {
    pos:         0,
    length:      0,
    toType:      '',
    getStory:    function () {
        var cb = function () {
            sentences.getLength();
            sentences.charge();
        };
        getText(cb);
    },
    getSentence: function () {
        this.toType = story[this.pos];
    },
    getLength:   function () {
        this.length = story.length;
    },
    charge:      function () {
        if (this.pos < this.length) {
            this.getSentence();
            this.pos++;
            type(this.toType);
        } else {
            this.pos = 0;
            // alert('now:'+nowChapter);
            nowChapter++;
            this.getStory();
        }
    }
};

var core = {
    arr:       [],
    length:    0,
    pos:       0,
    toNext:    0,
    toType:    '',
    start:     function () {
        //log(this.toType);
        if (typeof (this.toType['text']) == 'string') {
            this.arr = this.toType['text'].split('');
        } else {
            this.arr = this.toType.split('');
        }
        this.length = this.arr.length;

        if (typeof (this.toType['scene']) == 'string') {
            //场景切换
            changeScene(this.toType['scene']);
        }

        if (typeof (this.toType['role']) == 'object') {
            //角色出场

        }

        interval = setInterval(function () {
            if (typeof(core.arr[core.pos]) == 'undefined') {
                clearInterval(interval);
                core.ini();
                if (end != 1) {
                    core.beginNext();
                }

            } else {
                textObj.innerHTML += core.arr[core.pos];
                core.pos++;
            }

        }, wordTime);
       // log('i=' + interval);
    },
    finish:    function () {
        clearInterval(interval);
        (function () {
            for (i = core.pos; i < core.length; i++) {
                textObj.innerHTML += core.arr[i];
            }
        })();
        this.ini();
        core.beginNext();
    },
    beginNext: function () {
        if (auto == 1) {
            setTimeout(function () {
                if(textClear()){
                    sentences.charge();
                }
            }, nextSentenceTime);
        } else if (core.toNext == 1) {
            sentences.charge();
            //  waitToClick();
        } else {
            core.toNext = 1;
            setTimeout(function () {
                waitToClick();
            }, nextSentenceTime);
        }
    },
    ini:       function () {
        this.arr    = [];
        this.pos    = 0;
        this.length = 0;
        this.next   = 0;
    }
};

function type(toType) {
    if (toType) {
        core.toType = toType;
    }
    core.ini();
    core.start();
}

function start() {
    begin = 1;
    sentences.getStory();
}

function finish() {
    if(skipping == 1){
        skipPlay();
        return;
    }
    if(auto == 1){
        autoPlay();
        return;
    }
    if(auto == 1){
        autoPlay();
        return;
    }
    if (end == 1 || begin == 0 || auto == 1) {
        return;
    }
    if (core.toNext == 1) {
        textClear();
        core.toNext = 0;
        clearInterval(tkl);
        sentences.charge();
    } else {
        core.finish();
    }

}

function textClear() {
    textObj.innerHTML = '';
    return true;
}

function fin() {
    textClear();
    auto              = 0;
    end               = 1;
    textObj.className = 'fin';
    type('      F     i     n ');
}

function bgmSwitch(){
    var audio = $('#audio')[0];
    event.stopPropagation();
    if(audio.paused){
        audio.play();
        $('#bgm').html('on');
    }else {
        audio.pause();
        $('#bgm').html('off');
    }
}

function autoPlay() {
    event.stopPropagation();
    if (auto == 0) {
        auto = 1;
        if (core.toNext == 1) {
            textClear();
            core.toNext = 0;
            sentences.charge();
        }
        $('#autoPlay').html('on');
        showWord(' Auto', 1, 'lightpink');
    } else {
        auto = 0;
        $('#autoPlay').html('off');
    }
}
//快进
function skipPlay(){
    event.stopPropagation();
    var rate = 10;

    if(skipping == 0){
        skipping = 1;
        auto     = 1;
        nextSentenceTime = nextSentenceTime/rate;
        wordTime         = wordTime/rate;
        if (core.toNext == 1) {
            textClear();
            core.toNext = 0;
            sentences.charge();
        }
        $('#skipPlay').html('on');
        showWord(' Skipping', 2, '#76EEC6');

    }else {
        skipping = 0;
        auto     = 0;
        nextSentenceTime = nextSentenceTime*rate;
        wordTime         = wordTime*rate;
        $('#skipPlay').html('off');
    }

}

function twinkle(x) {
    var tkl = setInterval(function () {
        if (core.toNext == 1) {
            x.fadeIn(1000).fadeOut(1000);
        } else {
            clearInterval(tkl);
        }

    }, 2000);
}

function waitToClick() {
    if($('#waitToClick').length > 0){
        twinkle($('#waitToClick'));
    }else {
        var c     = '<span id="waitToClick" class="right-corner">   click</span>';
        textObj.innerHTML += c;
        twinkle($('#waitToClick'));
    }
}

function showWord(word, rate, color) {
    var id = '#showAuto';
    if($(id).length <= 0){
        var c     = '<span id="showAuto" class="right-corner" style="color:'+color+';font-size: 20px"> '+word+'</span>';
        $('.img').append(c);
    }

     tkAuto = setInterval(function(){
        if(auto == 1){
            $(id).fadeIn(1000/rate).fadeOut(1000/rate);
        }else {
            $(id).remove();
            clearInterval(tkAuto );
        }
    }, 1000/rate);

}


window.onload = function () {
    setTimeout(
        function () {
            start()
        }, 1000);
};

