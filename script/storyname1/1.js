 doScript = [
        {
            "text": "醒醒~,再不起来我打你啊！hey ya ~~~",
            "scene": "s1.jpg",
            "showName": "???",
            "bgm": "main.m4a",
            "role": [
                {
                    "name": "Reimu",
                    "img": "",
                    "action": [
                        {
                            "name": "shake",
                            "delay": 2,
                            "sound": "pencil.wav"
                        },
                        {
                            "name": "flipInY",
                            "delay": 13,
                            "sound": "hit.mp3"
                        }
                    ]
                }
            ]
        },
        {
            "showName": "我 HP-10",
            "text": "吓？你是谁，我在哪里，我在做什么，我的钱都去哪了？HP -10什么鬼啦？！"
        },
     {
         "option":[
             {
                 "text":"赶紧摸自己的钱包",
                 "var":"money = 100"
             },
             {
                 "text":"赶紧摸自己的脸",
                 "var":"money = 0",
                 "goto":10000
             }
         ]

     },
        {
            "text": "我是Reimu呀，客官刚刚不是塞了10w钱么····所以·诶呀··",
            "role": [
                {
                    "name": "Reimu",
                    "action": [
                        {
                            "name": "pulse",
                            "delay": 28
                        }
                    ]
                }
            ]
        },
        {
            "showName": "我",
            "text": "（10w？我什么时候有过这么多钱,嘛，但是现在重要的是，‘所以’后面是什么也，好在意···）",
            "scene": "s1.jpg",
            "hideRole": 1
        },
        {
            "scene": "s1.jpg",
            "showName": "我",
            "text": "咳咳····所···所以···什么呢··",
            "role": [
                {
                    "name": "Reimu"
                }
            ]
        }
    ]