//@author Lenne  mail 623975749@qq.com
var textObj          = document.getElementById('content');
var nextSentenceTime = 1000;
var wordTime         = 240;
var nowChapter       = 1;
var story;
var interval;
function log(x) {
    console.log(x);
}
var core = {
    arr:       [],
    length:    0,
    pos:       0,
    next:      0,
    toType:    '这是示例文本 aya ~~~ OAO',
    getArr:    function () {
        this.arr = this.toType.split('');
    },
    getLength: function () {
        this.length = this.arr.length;
    },
    start:     function () {
        interval = setInterval(function () {
            log(core.arr[core.pos]);
            if (typeof(core.arr[core.pos]) == 'undefined') {
                clearInterval(interval);
                core.ini();
                core.beginNext();
            }else {
                textObj.innerHTML += core.arr[core.pos];
                core.pos++;
            }

        }, wordTime)
    },
    finish:    function () {
        clearInterval(interval);
        (function () {
            for (i = core.pos; i < core.length ; i++) {
                textObj.innerHTML += core.arr[i];
            }
        })();
        this.ini();
        core.beginNext();
    },
    beginNext: function () {
        this.next = 1;
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
    core.getArr();
    core.getLength();
    core.start();
}

function finish() {
    core.finish();
}

function textClear() {
    textObj.innerHTML = '';
}

function fin() {
    textClear();
    textObj.className = 'fin';
    type('      F     i     n ');
}

var d     = new Date();
var today = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' '
            + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();


function auto(story) {
    var l   = story.length;
    var p   = 0;
    var txt = story[p];
    var cb  = function () {
        p++;
        if (p < l) {
            textClear();
            var txt = story[p];
            type(txt, cb)
        } else {
            fin();
        }
    };
    type(txt);
}

function getText(cb) {
    var url = 'script/' + nowChapter + '.json';
    $.ajax({
               type:     'get',
               url:      url,
               dataType: 'json',
               //async:    false,
               success:  function (d) {
                   if(d){
                       story = d;
                       cb();
                   }else {
                       fin();
                   }

               },
               error:function(d){
                   if(d.status ==404){
                       fin();
                   }
               }

           }
    );
}

window.onload = function () {
    var then = setTimeout(function () {
        type();
    }, 2000);
    getText(then);

};

