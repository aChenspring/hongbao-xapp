let log = console.log.bind(console);
let app = getApp();

Page({
    data: {
        api: app.appData.api,
        img: app.appData.img,
        doneLoad: false,
    },
    onLoad: function () {
        //
    }
});