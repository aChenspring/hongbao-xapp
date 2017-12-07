let app = getApp();
let log = console.log.bind(console);

Page({
    data: {
        api: app.appData.api,
        img: app.appData.img,
        doneLoad: true,
        //
        merchantDetail: {},
        timeLeft: 20,
        recordButtonText: '点击录音'
    },
    onLoad: function () {
        let page = this;

        // get openId and sessionId, also visitor login
        wx.login({
            success: function (res) {
                app.post({
                    url: page.data.api.visitorLogin,
                    data: {
                        code: res.code
                    },
                    success: function (res) {
                        res = res.data;
                        if (res.code === 0) {
                            app.store('openId', res.data.openid);
                            app.appData.header.Cookie = 'JSESSIONID=' + res.data.session_user;
                        }
                        else {
                            //
                        }
                    },
                    fail: function () {
                        //
                    }
                });
            },
            fail: function () {
                //
            }
        });

        app.post({
            url: page.data.api.getMerchantDetail,
            success: function (res) {
                let aaa = {
                    addr: "环翠区同一路88号",
                    command: "我要红包",
                    id: "1",
                    logo: "http://hb.shulailo.cn/./public/20171202/sht.png",
                    name: "冠一阁禅茶文化中心",
                    number: 20
                };
                res = res.data;
                if (res.code === 0) {
                    page.setData({
                        merchantDetail: res.data
                    });
                }
                else {
                    //
                }
            },
            fail: function () {
                //
            }
        });
    },
    record: function () {
        let page = this;
        let rm = wx.getRecorderManager();
        let counter = 5;
        let interval = setInterval(function () {
            if (counter === 0) {
                clearInterval(interval);
                page.setData({
                    recordButtonText: '点击录音'
                });
                return;
            }
            page.setData({
                recordButtonText: counter + 's'
            });
            counter -= 1;
        }, 1000);
        rm.start({
            duration: 5000
        });
        rm.onStop = function (res) {
            log(res);
        }
    }
});