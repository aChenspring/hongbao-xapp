let app = getApp();
let log = console.log.bind(console);
let recordDuration = 15000;
let openId;
let recordManager;
let token;

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
        timeLeft: 16,
        //
        merchantDetail: {},
        giftArr: [],
        hongbaoRecordsArr: [],
        countDown: '',
        isRecording: false,
        isProcessing: false,
        //
        showIntro: false,
        showWinning: false,
        showMyWins: false,
        showLogin: true,
        myWinsArr: [],
        tokenButton: '获取验证码',
        tokenButtonDisabled: false,
        phone: '',
        token: '',
        //
        headUrl: '',
        winningInfo: {
            img_url: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIkO5ZkM3Gr0MBvdWRTqMvkK9j5QFDBNlYQuja6W8NqQu0RniazicZMyEUnEWr6qPv0pfAECL1CAIjg/0',
            company: '冠一阁禅茶文化中心',
            match: 50,
            message: 'apple watch',
            voice_time: 7,
            voice_url: ''
        }
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
                                    app.appData = res;
                                    page.setData({
                                        headUrl: res.avatarUrl
                                    });
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
    // record
    recordStart: function () {
        let page = this;
        if (page.data.timeLeft <= 0) {
            return;
        }
        if (page.data.isRecording) {
            return;
        }
        recordManager = wx.getRecorderManager();
        let counter = recordDuration / 1000;
        page.setData({
            isRecording: true,
            countDown: '剩余' + counter + 's'
        });
        let interval = setInterval(function () {
            counter -= 1;
            if (counter === 0) {
                clearInterval(interval);
                page.setData({
                    isRecording: false
                });
                recordManager.stop();
                return;
            }
            page.setData({
                countDown: '剩余' + counter + 's'
            });
        }, 1000);
        recordManager.start({
            format: 'mp3',
            sampleRate: 16000,
            numberOfChannels: 1,
            duration: recordDuration
        });
        recordManager.onStop((res) => {
            page.setData({
                isRecording: false,
                isProcessing: true,
                timeLeft: page.data.timeLeft - 1
            });
            clearInterval(interval);
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
                    page.setData({
                        winningInfo: res.data
                    });
                },
                fail: function () {
                    //
                },
                complete: function () {
                    page.setData({
                        isProcessing: false
                    })
                }
            })
        });
    },
    recordStop: function () {
        this.setData({
            isRecording: false
        });
        recordManager.stop();
    },
    // intro
    introShow: function () {
        this.setData({
            showIntro: true
        });
    },
    introHide: function () {
        this.setData({
            showIntro: false
        });
    },
    // winning
    closeWinning: function () {
        this.setData({
            showWinning: false
        })
    },
    closeMyWins: function () {
        this.setData({
            showMyWins: false
        })
    },
    showMyWins: function () {
        let page = this;
        app.post({
            url: this.data.api.getMyWins,
            data: {
                openId: openId
            },
            success: function (res) {
                res = res.data;
                if (res.code === 0) {
                    page.setData({
                        myWinsArr: res.data.result,
                        showMyWins: true
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
    },
    // login
    closeLogin: function () {
        this.setData({
            showLogin: false
        })
    },
    getToken: function () {
        let page = this;
        if (page.data.phone.trim() === '') {
            app.alert('请输入手机号');
            return;
        }
        let counter = 10;
        page.setData({
            tokenButton: counter + 's后重试',
            tokenButtonDisabled: true
        });
        let interval = setInterval(function () {
            counter -= 1;
            if (counter === 0) {
                clearInterval(interval);
                page.setData({
                    tokenButton: '获取验证码',
                    tokenButtonDisabled: false
                });
                return;
            }
            page.setData({
                tokenButton: counter + 's后重试'
            });
        }, 1000);
        app.post({
            url: page.data.api.getToken,
            data: {
                phone: page.data.phone
            },
            success: function (res) {
                res = res.data;
                if (res.code === 0) {
                    token = res.data.token;
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
    changePhone: function (e) {
        this.data.phone = e.detail.value
    },
    changeToken: function (e) {
        this.data.token = e.detail.value;
    },
    submitLogin: function () {
        let page = this;
        let p = page.data.phone.trim();
        let t = page.data.token.trim();
        if (p === '') {
            app.alert('请输入手机号');
            return;
        }
        if (t === '') {
            app.alert('请输入验证码');
            return;
        }
        if (parseInt(t) !== parseInt(token)) {
            app.alert('验证码不正确');
            return;
        }
        app.post({
            url: page.data.api.login,
            data: {
                openId: openId,
                phone: p
            },
            success: function (res) {
                res = res.data;
                if (res.code === 0) {
                    //
                }
                else {
                    app.alert('用户不存在，请联系客服');
                }
            },
            fail: function () {
                //
            }
        });
    }
});