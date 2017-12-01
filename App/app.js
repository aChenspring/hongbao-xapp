App({
    appData: {
        //
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
        let f = function () {
            //
        };
        wx.request({
            method: 'GET',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: obj.url,
            success: obj.success || f,
            fail: obj.fail || f,
            complete: obj.complete || f
        });
    },
    post: function (obj) {
        let f = function () {
            //
        };
        wx.request({
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
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
    }
});