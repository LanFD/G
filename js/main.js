//@author Ht  mail 382354412@qq.com
var textObj          = document.getElementById('content');
var nextSentenceTime = 1000; //句子间隔时间
var wordTime         = 240;  //字间隔时间
var nowChapter       = 1;    //第几章节
var auto             = 0;    //是否auto play
var storyname        = 'storyname1';


var story;
var interval;
var end;
var d       = new Date();
var nowTime = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' '
              + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

function log(x) {
    console.log(x);
}

function getText(cb) {
    var url = 'script/' +storyname +'/' + nowChapter + '.json';
    $.ajax({
               type:     'get',
               url:      url,
               dataType: 'json',
               //async:    false,
               success:  function (d) {
                   if (d) {
                       story = d;
                       log(d);
                       cb();
                   } else {
                       fin();
                   }

               },
               error:    function (d) {
                   alert(d.status);
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
            fin();
        }
    }
};
var core = {
    arr:       [],
    length:    0,
    pos:       0,
    toNext:    0,
    toType:    '',
    getArr:    function () {
        log(this.toType);
        if(typeof (this.toType['text'])=='string'){
            this.arr = this.toType['text'].split('');
        }else {
            this.arr = this.toType.split('');
        }

    },
    getLength: function () {
        this.length = this.arr.length;
    },
    start:     function () {
        interval = setInterval(function () {
            if (typeof(core.arr[core.pos]) == 'undefined') {
                clearInterval(interval);
                core.ini();
                if(end != 1){
                    core.beginNext();
                }

            } else {
                textObj.innerHTML += core.arr[core.pos];
                core.pos++;
            }

        }, wordTime)
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
        if (auto == 1){
            setTimeout(function(){
                textClear();
                sentences.charge();
            },nextSentenceTime);
        } else if(core.toNext == 1) {
            sentences.charge();
        } else {
            core.toNext = 1;
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
    core.getArr();
    core.getLength();
    core.start();
}

function start() {
    sentences.getStory();
}

function finish() {
    if(end == 1){
        return;
    }
    if(core.toNext == 1){
        textClear();
        core.toNext = 0;
        sentences.charge();
    }else {
        core.finish();
    }

}

function textClear() {
    textObj.innerHTML = '';
}

function fin() {
    textClear();
    auto = 0;
    end  = 1;
    textObj.className = 'fin';
    type('      F     i     n ');
}

function autoPlay(){
   if(auto == 0){
       auto = 1;
       if(core.toNext == 1){
           textClear();
           sentences.charge();
       }
   }else {
       auto = 0;
   }
    showAuto();
}

function showAuto(){
    var html;
    if(auto == 1){
        html = 'on';
    }else {
        html ='off';
    }
    $('#autoPlay').html(html)
}

window.onload = function () {
    setTimeout(
        function(){
            start()
        },2000);
};

