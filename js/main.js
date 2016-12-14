//@author Ht  mail 382354412@qq.com
var nextSentenceTime = 1000; //句子间隔时间
var wordTime         = 70;  //字间隔时间

var textObj       = document.getElementById('content');
var nowChapter    = 1;    //第几章节
var auto          = 0;    //是否auto play
var begin         = 0;    //是否开始阅读
var storyName     = 'storyname1';
var tkl;                    //click 闪烁
var skipping      = 0;   //是否正在快进
var doScript      = 0;   //读取的剧本
var getScriptType = 'jsReload';  //jsonp 和jsReload方式
var story;
var end;
var scenePath     = 'img/scene/';
var saves         = window.localStorage;
var canSave       = 0;
var varTmp        = {};

//判断设备
(function(){
    $('.roleImg').css('height',$(window).height() - $('#text').height());
    $(".roleImg").css("bottom", $("#text").height() + 'px');

    if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
        //移动端
        $('.main').css({"width":"100%","height":"100%"});
        $('.img').css({"top":"0","height":"100%"});
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
            judgeScreen(0);
        }, false);
    }
})();


window.onload = function() {
    judgeScreen(1000);
};

function judgeScreen(i){
    var v = $(window).height() / $(window).width();
    if (v > 1.1) {
        $('#onload').empty();
        $('#onload').append('<span>请横屏</span>');
        $('#onload').show();
    } else {
        $('.roleImg').css('height',$(window).height() - $('#text').height());
        $(".roleImg").css("bottom", $("#text").height() + 'px');
        $('#onload').empty();
        $('#onload').hide(i);
    }
}

//清除存档
//saves.clear();
if (saves) {
    canSave = 1;
    if (typeof saves.saves == 'undefined') {
        //初始化
        saves.saves  = arrToJson(['init']);
    }
} else {
    alert('此浏览器不支持localStorage，读存档功能将无法使用');
}
function udToEp(x){
    if(typeof x == 'undefined'){
        return '';
    }
    return x;
}

function getDate() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' '
           + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}

/*
 本地存档
 @param info 存档信息
 @param key  档位
 @return void
 */
function saveGame(info, key) {
    if (canSave != 1) {
        alert('此浏览器无法存档');
        return;
    }
    var d = jsonToArr(saves.saves);
    var l = d.length;
    if (key) {
        d[key] = info;
    } else {
        d[l] = info;
    }
    saves.saves = arrToJson(d);
}

//删除存档 i 第几个存档
function delSave(i){
    var d = jsonToArr(saves.saves);
    var l = d.length;
    if(l > i){
        d.splice(i,1);
        saves.saves = arrToJson(d);
    }
}

function openLoadUI(saveOrLoad) {
    event.stopPropagation();
    if (auto) {
        autoPlay();
    }
    if (skipping) {
        skipPlay();
    }
    $(".savesDel").remove();
    var data = jsonToArr(saves.saves);
    var html = '';
    var cf;
    if (saveOrLoad == 'save') {
        cf = function (x) {
            return 'confirmSave(' + x + ')';
        }
    } else {
        cf = function (x) {
            return 'confirmLoad(' + x + ')';
        }

    }
    $.each(data, function (i, v) {
        if (i > 0) {
            html += '<div class="saves savesDel" >\n\
                          <div class="inner">\n\
                            <div onclick="' + cf(i) + '" class="imgBox" style="background: url(' + v['img'] + ')">'+v['text']+'</div>\n\
                            <div  class="innerMsg">存档' + i + ' ' + v['time'] + '\n\
                              <img onclick="confirmDelSave(' + i + ', this)" class="delButton" src="img/button/close.png">\n\
                            </div>\n\
                          </div>\n\
                         </div>'
        }
    });
    $('.savesZone').prepend(html);
    showMask();
    $("#loadUI").show();
    $(function () {
        $("#closeLoadUI").css("right", -$('#closeLoadUI').width() / 2);
        $('.imgBox').css({'width': $('.inner').width(), 'height': $('.inner').height() * 0.8})
    });
}

function closeLoadUI() {
    $("#loadUI").hide();
    hideMask();
}

function openLoadPage() {
    openLoadUI('load');
    $('#newSave').hide();
}

function openSavePage() {
    openLoadUI('save');
    $('#newSave').show();
}

function confirmSave(key) {
    var info = {
        "chapter": nowChapter,
        "sentence": sentences.pos,
        "text":$("#content").text().replace('click__', ''),
        "img": $(".pt-page-current img").attr("src"),
        "time": getDate(),
        "bgm":$('#audio').attr('src'),
        "var":varTmp,
        "role":[
            {
            "class": $('#position').attr('class'),
            "img":$('#position img').attr('src')
            },
            {
                "class": $('#position2').attr('class'),
                "img":$('#position2 img').attr('src')
            },
            {
                "class": $('#position3').attr('class'),
                "img":$('#position3 img').attr('src')
            }
        ]
    };
    if (key) {
        saveGame(info, key);
    } else {
        saveGame(info);
    }
    alert("存档完毕");
    closeLoadUI();
}

function confirmDelSave(x,t) {
    event.stopPropagation();
    if (confirm('确认删除此存档吗？')) {
        delSave(x);
        $(t).parent().parent().parent().fadeOut(1000);
    }
}

function confirmLoad(i) {
    var data = jsonToArr(saves.saves);
    data = data[i];
    nowChapter = data.chapter;
    $('#audio').attr('src', data.bgm);
    $(".pt-page-current img").attr("src", data.img);
    $('#position').attr('class',data.role[0]['class']);
    $('#position img').attr('src', udToEp(data.role[0]['img']));
    $('#position2').attr('class',data.role[1]['class']);
    $('#position2 img').attr('src', udToEp(data.role[1]['img']));
    $('#position3').attr('class',data.role[2]['class']);
    $('#position3 img').attr('src', udToEp(data.role[2]['img']));
    varTmp = data.var;
    closeLoadUI();
    sentences.pos = data.sentence - 1;
    if (begin == 1 || end == 1) {
        //已开始或已结束
        story = '';
        textObj.className = 'content';
        end = 0;
        textClear();
        core.toNext = 0;
        core.ini();
        start();
    } else {
        start();
    }
}

var sentences = {
    pos: 0,
    length: 0,
    toType: '',
    ajaxFunc:function(url, cb){
        $.ajax({
                type: 'get',
                url: url,
                dataType: 'JSONP',
                jsonp: "callback",
                jsonpCallback:"doScript",
                //async:    false,
                success: function (d) {
                    if (d) {
                        story = d;
                        //log(d);
                        cb();
                    } else {
                        fin();
                    }

                },
                error: function (d) {
                    log(d);
                    //alert(d.status);
                    if (d.status == 404) {
                        fin();
                    }
                }
            }
        );
    },
    getStory: function () {
        var url = 'script/' + storyName + '/' + nowChapter + '.js';
        if (getScriptType == 'jsonp') {
            this.ajaxFunc(url, function () {
                sentences.getScript(function () {
                    story = doScript;
                    //log(d);
                    sentences.getLength();
                    sentences.charge();
                }, 0);
            })
        } else if (getScriptType == 'jsReload') {
            this.reloadAbleJSFn('script', url, function () {
                sentences.getScript(function () {
                    story = doScript;
                    //log(d);
                    sentences.getLength();
                    sentences.charge();
                }, 0);
            });
        }
        //以script src方式访问，解决跨域
        //$('#script').attr("src", url);

    },
    reloadAbleJSFn: function (id, newJS, cb) {
        var oldjs = document.getElementById(id);
        if (oldjs) oldjs.parentNode.removeChild(oldjs);
        var scriptObj  = document.createElement("script");
        scriptObj.src  = newJS;
        scriptObj.type = "text/javascript";
        scriptObj.id   = id;
        document.getElementsByTagName("head")[0].appendChild(scriptObj);
        setTimeout(function () {
            cb();
        }, 340);
    },
    getScript: function (cb, t) {
        if (!t) {
            t = 1;
        }
        if (typeof doScript != 'object') {
            if (t > 5) {
                fin();
            } else {
                setTimeout(this.getScript(cb, ++t), 1000);
            }
        } else {
            if (story === doScript) {
                fin();
            } else {
                cb();
            }
        }
    },
    getLength: function () {
        this.length = story.length;
    },
    charge: function () {
        if (this.pos < this.length) {
            this.toType = story[this.pos];
            this.pos++;
            core.type(this.toType);
        } else {
            this.pos = 0;
            nowChapter++;
            this.getStory();
        }
    }
};
var core = {
    process:'',
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
        if(typeof (this.toType['option']) == 'object'){
            this.showChoose();
            return;
        }
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
            this.roleHide();
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
            this.roleHide();
            switch (this.toType['role'].length) {
                case 1:
                    $('#position').removeClass().addClass('roleImg r1 left_15');
                    this.roleControl(this.toType['role'][0], '', 1);
                    break;
                case 2:
                    $('#position').removeClass().addClass('roleImg r2 left_4');
                    $('#position2').removeClass().addClass('roleImg r2 right_4 filter-gray');
                    this.roleControl(this.toType['role'][0], '', 1);
                    this.roleControl(this.toType['role'][1], '2', 0);
                    break;
                default:
                    $('#position').removeClass().addClass('roleImg r3 ');
                    $('#position2').removeClass().addClass('roleImg r3 left_33 filter-gray');
                    $('#position3').removeClass().addClass('roleImg r3 left_66 filter-gray');
                    this.roleControl(this.toType['role'][0], '', 1);
                    this.roleControl(this.toType['role'][1], '2', 0);
                    this.roleControl(this.toType['role'][2], '3', 0);
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

        core.process = setInterval(function () {
            if (typeof(core.arr[core.pos]) == 'undefined') {
                clearInterval(core.process);
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
    showChoose:function(){
        $('#mask').show();
        $('.tbs').css('display','table');
        $('#choice').css('display','table-cell');
        $('#choice').empty();
        var opts ='';
        $(this.toType['option']).each(function(i,v){
            opts += '<a onclick="core.chooseOpt('+i+')"><div class="choseOption">\n\
                           <span>\n\
                           '+v['text'] +'\n\
                           </span>\n\
                           </div></a>';
        });
        $('#choice').append(opts);
    },
    hideChoose:function(){
        $('#mask').hide();
        $('.tbs').css('display','none');
        $('#choice').css('display','none');
        $('#choice').empty();
    },
    chooseOpt:function(x){
        var chosen = this.toType['option'][x];
        if (udToEp(chosen.var) != '') {
            var reg       = /[\*+=%-\/]+/;
            var operation = reg.exec(chosen.var)[0];
            var keyW      = chosen.var.split(operation);
            var value     = parseFloat(keyW[1]);
                keyW      = $.trim(keyW[0]);
                keyW      = 'chosen_'+keyW;

            if(typeof varTmp[keyW] =='undefined'){
                varTmp[keyW] = 0;
            }
            var toExt     = "varTmp[keyW]"+operation+value;
            eval(toExt);
        }
        core.hideChoose();
        if(udToEp(chosen.goto) != ''){
            story      = '';
            nowChapter = chosen.goto;
            sentences.pos = 0;
            sentences.getStory();
        }else {
            finish();
            finish();
        }

    },
    roleHide:function(){
        $(".roleImg img").each(function(){
            $(this).attr('src', '');
        });
    },
    roleControl:function(role, pos, isshowName){
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
    },
    finish: function () {
        clearInterval(core.process);
        (function () {
            for (var i = core.pos; i < core.length; i++) {
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
    type:function (c) {
        if (c) {
            core.toType = c;
        }
        this.ini();
        this.start();
    },
    ini: function () {
        this.arr    = [];
        this.pos    = 0;
        this.length = 0;
        this.next   = 0;
        clearInterval(core.process);
    }
};

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

function hideCover() {
    $("#canvas").remove();
    $("#start-scene").remove();
    $("#text").fadeIn(1000);
    clearInterval(initStartButton);
    clearInterval(initLoadButton);
}

function start() {
    if (!begin) {
        hideCover();
    }
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
    core.type('      F     i     n ');
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
        var c = '<span id="waitToClick" class="right-corner">click<span style="display: none">__</span></span>';
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



