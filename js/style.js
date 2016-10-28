//@author Ht  mail 382354412@qq.com
var textObj          = document.getElementById('content');
var nextSentenceTime = 1000; //句子间隔时间
var wordTime         = 100;  //字间隔时间
var nowChapter       = 1;    //第几章节
var nowSentence      = 0;    //第几句
var auto             = 0;    //是否auto play
var begin            = 0;    //是否开始阅读
var storyName        = 'storyname1';
var tkl;                    //click 闪烁
var skipping         = 0;   //是否正在快进
var doScript         = 0;   //读取的剧本
var intS;                   //start按钮动画
var story;
var interval;
var end;
var scenePath        = 'img/scene/';
var d                = new Date();
var saves            = window.localStorage;
var canSave          = 0;
var nowTime          = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' '
                       + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
function log(x) {
    console.log(x);
}
function arrToJson(x){
    return JSON.stringify(x);
}
function jsonToArr(x){
    return JSON.parse(x);
}
//清除存档
saves.clear();
if(saves){
    canSave = 1;
    if(typeof saves.saves == 'undefined'){
        //初始化
        saves.saves = arrToJson(['init']);
        log(saves);
    }
}else{
    alert('此浏览器不支持localStorage，存档功能将无法使用');
}

/*
 本地存档
 @param info 存档信息
 @param key  档位
 @return void
 */
function saveGame(info, key) {
    var d = jsonToArr(saves.saves);
    var l = d.length;
    if(key == ''){
        d[l] = info;
    }else {
        d[key] = info;
    }
    saves.saves = arrToJson(d);
}

/*
读取进度
 */
function loadGame(chapter, sentence){
    nowChapter  = chapter;
    nowSentence = sentence;
}

log(jsonToArr(saves.saves));

$("#closeLoadUI").css("right", -$('#closeLoadUI').width()/2);

/*
关闭按钮点击关闭 parentx 的x层parent
 */
$(".func_closeButton").click(function(){
    var parent = $(this).attr("class").match(/parent\d/);
    if (parent[0]) {
        parent = parseInt(parent.replace('parent', ''));
        var p = $(this);
        for (var i = 0; i < parent; i++) {
            p = p.parent();
        }
        p.hide();
    }
});

$(".toolMask").mouseover(function () {
    $(".tool").stop();
    $(".tool").fadeIn(300);
});
$(".toolMask").mouseleave(function () {
    $(".tool").stop();
    $(".tool").fadeOut(300);
});

$("#startButton span").mouseover(function () {
    clearInterval(intS);
    aniCls('#startButton', 'pulse infinite');
});

$("#startButton span").mouseleave(function () {
    $("#startButton").removeClass();
    aniStartButton();
});

(function () {
    $(".roleImg").css("bottom", $("#text").height() + 'px');
    aniStartButton();
})();


var sentences = {
    pos: nowSentence,
    length: 0,
    toType: '',
    getStory: function () {
        var cb = function () {
            sentences.getLength();
            sentences.charge();
        };
        getText(cb);
    },
    getSentence: function () {
        this.toType = story[this.pos];
    },
    getLength: function () {
        this.length = story.length;
    },
    charge: function () {
        if (this.pos < this.length) {
            this.getSentence();
            this.pos++;
            type(this.toType);
        } else {
            this.pos = 0;
            nowChapter++;
            this.getStory();
        }
    }
};

var core = {
    arr: [],
    length: 0,
    pos: 0,
    toNext: 0,
    toType: '',
    toAct: [],
    showName: '',
    sound: $('#sound')[0],
    start: function () {
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
        if (typeof (this.toType['bgm']) == 'string') {
            //bgm切换
            $('#audio')[0].pause();
            $('#audio').attr("src", "bgm/" + this.toType['bgm']);
            $('#audio')[0].play();
        }

        if (typeof (this.toType['hideRole']) == 'number') {
            //隐藏角色
            $("#roleDiv div").hide();
        }

        if (typeof (this.toType['showName']) == 'string') {
            //显示名称
            this.showName = this.toType['showName'];
            if (this.showName) {
                showName(this.showName, 0);
            } else {
                showName(this.showName, 1);
            }
        } else {
            this.showName = '';
        }


        if (typeof (this.toType['role']) == 'object') {
            //角色出场
            switch (this.toType['role'].length) {
                case 1:
                    $('#position').removeClass().addClass('roleImg r1 left_15');
                    roleControl(this.toType['role'][0], '', 1);
                    break;
                case 2:
                    $('#position').removeClass().addClass('roleImg r2 left_4');
                    $('#position2').removeClass().addClass('roleImg r2 right_4 filter-gray');
                    roleControl(this.toType['role'][0], '', 1);
                    roleControl(this.toType['role'][1], '2', 0);
                    break;
                default:
                    $('#position').removeClass().addClass('roleImg r3 ');
                    $('#position2').removeClass().addClass('roleImg r3 left_33 filter-gray');
                    $('#position3').removeClass().addClass('roleImg r3 left_66 filter-gray');
                    roleControl(this.toType['role'][0], '', 1);
                    roleControl(this.toType['role'][1], '2', 0);
                    roleControl(this.toType['role'][2], '3', 0);
                    break;
            }
            if (typeof (this.toType['role'][0]['action']) == 'object') {
                //人物动作
                $(this.toType['role'][0]['action']).each(function (i, e) {
                    core.toAct[e['delay'] - 1] = {"act": e['name']};
                    if (typeof (e["sound"]) != 'undefined') {
                        core.toAct[e['delay'] - 1].sound = e["sound"];
                    }
                });
            }
            $("#roleDiv div").show();


        } else {
            this.toAct = {};
        }

        interval = setInterval(function () {
            if (typeof(core.arr[core.pos]) == 'undefined') {
                clearInterval(interval);
                core.ini();
                if (end != 1) {
                    core.beginNext();
                }

            } else {
                if (typeof (core.toAct[core.pos]) == "object") {
                    //有动作
                    aniCls('#position', core.toAct[core.pos]['act']);
                    if (typeof (core.toAct[core.pos]['sound']) != 'undefined') {
                        //音效
                        $("#sound").attr("src", "sound/" + core.toAct[core.pos]['sound']);
                        core.sound.play();
                    }
                }
                textObj.innerHTML += core.arr[core.pos];
                core.pos++;
            }

        }, wordTime);
        // log('i=' + interval);
    },
    finish: function () {
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
                if (textClear()) {
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
    ini: function () {
        this.arr    = [];
        this.pos    = 0;
        this.length = 0;
        this.next   = 0;
    }
};

function aniStartButton() {
    var aniArr = [
        'bounce',
        'flash',
        'rubberBand',
        'shake',
        'swing',
        'tada',
        'wobble',
        'bounceIn'
    ];
    intS       = setInterval(function () {
        aniCls('#startButton', aniArr[getRandNum(0, aniArr.length)])
    }, 2000);
}

function aniCls(e, c) {
    $(e).attr("class", $(e).attr("class").replace(/^animated.+/, ''));
    $(e).addClass("animated " + c);
}

function getRandNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function nowTimeStamp() {
    return Date.parse(new Date());
}

function reloadAbleJSFn(id, newJS) {
    var oldjs = document.getElementById(id);
    if (oldjs) oldjs.parentNode.removeChild(oldjs);
    var scriptObj  = document.createElement("script");
    scriptObj.src  = newJS;
    scriptObj.type = "text/javascript";
    scriptObj.id   = id;
    document.getElementsByTagName("head")[0].appendChild(scriptObj);
}

function getScript(cb, t) {
    if (!t) {
        t = 1;
    }
    $(document).ready(function () {
        if (typeof doScript != 'object') {
            if (t > 5) {
                fin();
            } else {
                setTimeout(getScript(cb, ++t), 1000);
            }
        } else {
            //解决有服务器环境时新剧本不加载的问题
            setTimeout(function () {
                if (story === doScript) {
                    fin();
                } else {
                    cb();
                }
            }, 340);
        }

    });
}

function getText(cb) {
    var url = 'script/' + storyName + '/' + nowChapter + '.js';
    //$.ajax({
    //        type: 'get',
    //        url: url,
    //        dataType: 'JSONP',
    //        jsonp: "callback",
    //        jsonpCallback:"doScript",
    //        //async:    false,
    //        success: function (d) {
    //            if (d) {
    //                story = d;
    //                //log(d);
    //                cb();
    //            } else {
    //                fin();
    //            }
    //
    //        },
    //        error: function (d) {
    //            //alert(d.status);
    //            if (d.status == 404) {
    //                fin();
    //            }
    //        }
    //    }
    //);
    //ajax方式访问剧本

    reloadAbleJSFn('script', url);

    //以script src方式访问，解决跨域
    //$('#script').attr("src", url);
    getScript(function () {
        story = doScript;
        //log(d);
        cb();
    }, 0);

}

function showName(name, hide) {
    if (hide == 1) {
        $('#roleName').hide();
        return;
    }
    $('#name').html(name);
    if ($('#roleName').is(":hidden")) {
        $('#roleName').show();
    }
}

function roleControl(role, pos, isshowName) {
    var idName = role.name;
    var rObj   = roles[idName];
    var rPath  = rObj.path;
    var rImg   = '';
    if (rObj) {
        //角色存在
        if (role['img']) {
            rImg = role['img'];
        } else {
            rImg = rPath + 'default.png';
        }
        $('#position' + pos + ' img').eq(0).attr('src', rImg);
        if (isshowName) {
            if (core.showName == '') {
                showName(role.name, 0);
            }
        }

    }
}

function type(toType) {
    if (toType) {
        core.toType = toType;
    }
    core.ini();
    core.start();
}

function start() {
    $("#canvas").remove();
    $("#start-scene").remove();
    $("#text").fadeIn(1000);
    clearInterval(intS);
    setTimeout(function () {
        begin = 1;
        sentences.getStory();
    }, 1000);
}

function finish() {
    if (skipping == 1) {
        skipPlay();
        return;
    }
    if (auto == 1) {
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
    showName('', 1);
    textClear();
    auto              = 0;
    end               = 1;
    textObj.className = 'fin';
    type('      F     i     n ');
}

function bgmSwitch() {
    var audio = $('#audio')[0];
    event.stopPropagation();
    if (audio.paused) {
        audio.play();
        $('#bgm').html('on');
    } else {
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
function skipPlay() {
    event.stopPropagation();
    var rate = 10;

    if (skipping == 0) {
        skipping         = 1;
        auto             = 1;
        nextSentenceTime = nextSentenceTime / rate;
        wordTime         = wordTime / rate;
        if (core.toNext == 1) {
            textClear();
            core.toNext = 0;
            sentences.charge();
        }
        $('#skipPlay').html('on');
        showWord(' Skipping', 2, '#76EEC6');

    } else {
        skipping         = 0;
        auto             = 0;
        nextSentenceTime = nextSentenceTime * rate;
        wordTime         = wordTime * rate;
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
    if ($('#waitToClick').length > 0) {
        twinkle($('#waitToClick'));
    } else {
        var c = '<span id="waitToClick" class="right-corner">   click</span>';
        textObj.innerHTML += c;
        twinkle($('#waitToClick'));
    }
}

function showWord(word, rate, color) {
    var id = '#showAuto';
    if ($(id).length <= 0) {
        var c = '<span id="showAuto" class="right-corner" style="color:' + color + ';font-size: 20px"> ' + word + '</span>';
        $('.img').append(c);
    }
    tkAuto = setInterval(function () {
        if (auto == 1) {
            $(id).fadeIn(1000 / rate).fadeOut(1000 / rate);
        } else {
            $(id).remove();
            clearInterval(tkAuto);
        }
    }, 1000 / rate);

}


//window.onload = function () {
//    setTimeout(
//        function () {
//            start()
//        }, 1000);
//};

