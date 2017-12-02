let app = getApp();
let log = console.log.bind(console);

Page({
    data: {
        api: app.appData.api,
        img: app.appData.img,
        doneLoad: true,
    },
    onLoad: function () {
        let page = this;
        wx.login({
            success: function (res) {
                log(res.code)
                return;
                app.post({
                    url: page.data.api.visitorLogin,
                    data: {
                        code: res.code
                    },
                    success: function (res) {
                        log(res);
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
    },

});