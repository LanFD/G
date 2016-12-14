
function log(x) {
    console.log(x);
}
function arrToJson(x){
    return JSON.stringify(x);
}
function jsonToArr(x){
    return JSON.parse(x);
}

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
    initStartButton       = setInterval(function () {
        aniCls('#startButton', aniArr[getRandNum(0, aniArr.length)])
    }, 2000);

}

function aniLoadButton(){
    var aniArr2 = [
        'swing',
        ''
    ];
    initLoadButton        = setInterval(function () {
        aniCls('#loadButton', aniArr2[getRandNum(0, aniArr2.length)])
    }, 1000);
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

function showMask(){
    $('#mask').show();
}
function showBlackMask(){
    $('.mask').css('opacity',1);
    $('#mask').show();
}

function hideMask(){
    $('.mask').css('opacity',0.7);
    $('#mask').hide();
}

(function () {
    $(".roleImg").css("bottom", $("#text").height() + 'px');
    aniStartButton();
    aniLoadButton();
    /*
     关闭按钮点击关闭 parentx 的x层parent
     */
    $(".func_closeButton").click(function(){
        event.stopPropagation();
        var parent = $(this).attr("class").match(/parent\d/);
        if (parent) {
            parent = parseInt(parent[0].replace('parent', ''));
            var p = $(this);
            for (var i = 0; i < parent; i++) {
                p = p.parent();
            }
            p.hide();
        }
        hideMask();
    });



    $("#startButton span, #loadButton span").mouseover(function () {
        var Bid = $(this).parent().attr("id");
        switch  (Bid){
            case 'startButton':
                clearInterval(initStartButton);
                break;
            case 'loadButton':
                clearInterval(initLoadButton);
                break;
        }
        aniCls('#'+Bid, 'pulse infinite');
        $(this).addClass('changeWordColor');
    });

    $("#startButton span, #loadButton span").mouseleave(function () {
        var Bid = $(this).parent().attr("id");
        $("#"+Bid).removeClass();
        $(this).removeClass();
        switch  (Bid){
            case 'startButton':
                aniStartButton();
                break;
            case 'loadButton':
                aniLoadButton();
                break;
        }
    });
})();

