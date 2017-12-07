App({
    appData: {
        api: {
            visitorLogin: 'http://hb.shulailo.cn/index.php/home/index/login',
            getMerchantDetail: 'http://hb.shulailo.cn/index.php/home/index/sell',
            getHongbaoDetail: 'http://hb.shulailo.cn/index.php/home/index/gift',
            recordUpload: '',
        },
        img: {
            loading: '../../img/loading.svg'
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': ''
        }
    },
    alert: function (content, callback) {
        // callback is optional
        let f = function () {
            //
        };
        wx.showModal({
            confirmColor: '#ff6670',
            title: '大蜂窝',
            content: content,
            showCancel: false,
            success: callback || f
        });
    },
    confirm: function (content, callback) {
        // callback is optional
        let f = function () {
            //
        };
        wx.showModal({
            confirmColor: '#ff6670',
            title: '大蜂窝',
            content: content,
            success: callback || f
        });
    },
    get: function (obj) {
        let page = this;
        let f = function () {
            //
        };
        wx.request({
            method: 'GET',
            header: page.appData.header,
            url: obj.url,
            success: obj.success || f,
            fail: obj.fail || f,
            complete: obj.complete || f
        });
    },
    post: function (obj) {
        let page = this;
        let f = function () {
            //
        };
        wx.request({
            method: 'POST',
            header: page.appData.header,
            url: obj.url,
            data: obj.data || {},
            success: obj.success || f,
            fail: obj.fail || f,
            complete: obj.complete || f
        });
    },
    err: function () {
        this.alert('请求失败，请稍后重试');
    },
    nav2: function (obj) {
        wx.navigateTo({
            url: obj.url,
            success: obj.success || f,
            fail: obj.fail || f,
            complete: obj.complete || f
        })
    },
    red2: function (obj) {
        wx.redirectTo({
            url: obj.url,
            success: obj.success || f,
            fail: obj.fail || f,
            complete: obj.complete || f
        })
    },
    setTitle: function (s) {
        wx.setNavigationBarTitle({
            title: s
        });
    },
    store: function (key, data) {
        wx.setStorageSync(key, data);
    }
});