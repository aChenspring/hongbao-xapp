let app = getApp();
let log = console.log.bind(console);
let recordDuration = 3000;
let openId;

Page({
    data: {
        api: app.appData.api,
        img: app.appData.img,
        doneLoad: true,
        //
        merchantDetail: {},
        timeLeft: 20,
        recordButtonText: '点击录音',
    },
    onLoad: function () {
        let page = this;

        // get openId, also visitor login
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
                            openId = res.data.openid;
                            app.store('openId', res.data.openid);
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

        // get merchant detail, with merchant id, then we get hongbao detail
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
                    // get hongbao detail
                    app.post({
                        url: page.data.api.getHongbaoDetail,
                        data: {
                            id: page.data.merchantDetail.id
                        },
                        success: function (res) {
                            res = res.data;
                            if (res.code === 0) {
                                //
                            }
                            else {
                                //
                            }
                        },
                        fail: function () {
                            //
                        }
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
        let counter = recordDuration / 1000;
        page.setData({
            recordButtonText: '剩余' + counter + '秒'
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
                recordButtonText: '剩余' + counter + '秒'
            });
        }, 1000);
        rm.start({
            format: 'mp3',
            duration: recordDuration
        });
        rm.onStop((res) => {
            let tmp = res.tempFilePath;
            wx.uploadFile({
                url: page.data.api.recordUpload,
                filePath: tmp,
                name: 'file',
                formData: {
                    'merchantId': page.data.merchantDetail.id,
                    'openId': openId
                },
                success: function (res) {
                    res = res.data;
                    wx.showModal({
                        title: '提示',
                        content: JSON.stringify(res),
                    });
                },
                fail: function () {
                    //
                }
            })
        })
    }
});