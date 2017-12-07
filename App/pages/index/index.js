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
        let counter = 3;
        page.setData({
            recordButtonText: counter + 's'
        });
        let interval = setInterval(function () {
            counter -= 1;
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
        }, 1000);
        rm.start({
            format: 'mp3',
            duration: 3000
        });
        rm.onStop((res) => {
            wx.showModal({
                title: '提示',
                content: JSON.stringify(res),
            });
            let tmp = res.tempFilePath;
            wx.uploadFile({
                url: page.data.api.recordUpload,
                filePath: tmp,
                name: 'file',
                formData: {
                    'key': 'value'
                },
                success: function (res) {
                    res = res.data;
                    //
                },
                fail: function () {
                    //
                }
            })
        })
    }
});