let log = console.log.bind(console);
let app = getApp();

Page({
    data: {
        api: app.appData.api,
        img: app.appData.img,
        userInfo: {},
        doneLoad: true,
    },
    onLoad: function () {
        let page = this;
        wx.getUserInfo({
            success: function (res) {
                page.setData({
                    userInfo: res.userInfo
                })
            }
        })
    }
});