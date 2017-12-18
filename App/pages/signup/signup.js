let log = console.log.bind(console);
let app = getApp();

Page({
    data: {
        api: app.appData.api,
        img: app.appData.img,
        doneLoad: true,
        merchantTypeArr: ['山海通', '微商'],
        merchantTypeValue: '山海通',
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