//@author Ht  mail 382354412@qq.com
var textObj          = document.getElementById('content');
var nextSentenceTime = 1000; //句子间隔时间
var wordTime         = 240;  //字间隔时间
var nowChapter       = 1;    //第几章节
var auto             = 0;    //是否auto play
var begin            = 0;    //是否开始阅读
var storyName        = 'storyname1';
var tkl;                    //click 闪烁
var story;
var interval;
var end;
var scenePath        = 'img/scene/';
var d                = new Date();
var nowTime          = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' '
                       + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

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

function changeScene(x) {

    var rand = parseInt(Math.random() * 10);
   //  rand = 1;
    log(rand);
    switch (rand) {
        case 0 :
            $('#scene').fadeOut(nextSentenceTime / 2, function () {
                $('#scene').attr('src', scenePath + x);
                $('#scene').fadeIn(0)
            });
            break;

        case 1:
            $('#scene').animate({right:'200%', opacity: 0.1}, nextSentenceTime/2, function(){
                $('#scene').attr('src', scenePath + x);
                $('#scene').animate({left:'0%' , opacity: 1}, 0);
            });

            break;
        default:
            $('#scene').fadeOut(nextSentenceTime / 2, function () {
                $('#scene').attr('src', scenePath + x);
                $('#scene').fadeIn(0)
            });
    }




    $('#scene').fadeOut(nextSentenceTime / 2, function () {
        $('#scene').attr('src', scenePath + x);
        $('#scene').fadeIn(nextSentenceTime / 2)
    });
}
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
                textClear();
                sentences.charge();
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
}

function fin() {
    textClear();
    auto              = 0;
    end               = 1;
    textObj.className = 'fin';
    type('      F     i     n ');
}

function autoPlay() {
    if (auto == 0) {
        auto = 1;
        if (core.toNext == 1) {
            textClear();
            sentences.charge();
        }
    } else {
        auto = 0;
    }
    showAuto();
}

function twinkle(x) {
    tkl = setInterval(function () {
        if (core.toNext == 1) {
            x.fadeIn(1000).fadeOut(1000);
        } else {
            clearInterval(tkl);
        }

    }, 2000);
}

function waitToClick() {
    var c     = '<span id="waitToClick" style="color: cyan;display: none;position: absolute;bottom: 5px;right: 10px">   click</span>';
    textObj.innerHTML += c;
    var toTkl = $('#waitToClick');
    twinkle(toTkl);

}

function showAuto() {
    var html;
    if (auto == 1) {
        html = 'on';
    } else {
        html = 'off';
    }
    $('#autoPlay').html(html)
}

window.onload = function () {
    setTimeout(
        function () {
            start()
        }, 1000);
};

