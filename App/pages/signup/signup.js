let log = console.log.bind(console);
let app = getApp();

Page({
    data: {
        api: app.appData.api,
        img: app.appData.img,
        doneLoad: true,
        merchantTypeArr: ['口令红包模式', '联盟商家模式','非联盟商家模式'],
        merchantTypeValue: '口令红包模式',
        switchIconSelected: false
    },
    onLoad: function () {
        //
    },
    changeMerchantType: function (e) {
        let page = this;
        let i = e.detail.value;
        page.setData({
            merchantTypeValue: page.data.merchantTypeArr[i]
        })
    }
});