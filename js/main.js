//@author Lenne  mail 623975749@qq.com
var textObj          = document.getElementById('content');
var nextSentenceTime = 1000;
var wordTime         = 240;
var nowChapter       = 1;
var auto             = 0;
var story;
var interval;


var d       = new Date();
var nowTime = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' '
              + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

function log(x) {
    console.log(x);
}

function getText(cb) {
    var url = 'script/' + nowChapter + '.json';
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
                core.beginNext();
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
        if (auto == 1 || core.toNext == 1) {
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
    textObj.className = 'fin';
    type('      F     i     n ');
}

function autoPlay(){

}



window.onload = function () {
    setTimeout(
        function(){
            start()
        },2000);
};

