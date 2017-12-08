let app = getApp();
let log = console.log.bind(console);
let recordDuration = 3000;
let openId;
let isRecording;
let recordManager;

Page({
    data: {
        api: app.appData.api,
        img: app.appData.img,
        doneLoad: true,
        giftTypeMap: {
            "0": "￥", // 现金
            "1": "券", // 代金券
            "2": "蜜", // 诚信蜜
            "3": "折", // 折扣
            "4": "礼", // 实物
        },
        //
        merchantDetail: {},
        giftArr: [],
        hongbaoRecordsArr: [],
        timeLeft: 20,
        recordButtonText: '开始录音',
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
                            // get user info
                            wx.getUserInfo({
                                success: function (res) {
                                    res = res.userInfo;
                                    app.post({
                                        url: page.data.api.setVisitorHeadUrl,
                                        data: {
                                            openId: openId,
                                            headUrl: res.avatarUrl
                                        },
                                        success: function (res) {
                                            // res = res.data;
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

        // get merchant detail, with merchant id, then we get hongbao detail and hongbao records
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
                                page.setData({
                                    giftArr: res.data.result
                                })
                            }
                            else {
                                //
                            }
                        },
                        fail: function () {
                            //
                        }
                    });
                    // get hongbao records
                    app.post({
                        url: page.data.api.getHongbaoRecords,
                        data: {
                            merchantId: page.data.merchantDetail.id
                        },
                        success: function (res) {
                            res = res.data;
                            if (res.code === 0) {
                                page.setData({
                                    hongbaoRecordsArr: res.data.result
                                })
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
        if (!isRecording) {
            let page = this;
            isRecording = true;
            recordManager = wx.getRecorderManager();
            page.setData({
                recordButtonText: '结束录音'
            });
            recordManager.start({
                format: 'mp3',
                duration: recordDuration
            });
            recordManager.onStop((res) => {
                isRecording = false;
                page.setData({
                    recordButtonText: '开始录音'
                });
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
    }
});