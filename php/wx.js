wx.ready(function () {
    // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
    document.querySelector('#checkJsApi').onclick = function () {
        wx.checkJsApi({
            jsApiList: [
                'chooseimage',
                'previewImage',
                'uploadImage',
                'downloadImage'
            ],
            success: function (res) {
                alert(JSON.stringify(res));
            }
        });
    };

    // 5.1 拍照、本地选图
    var images = {
        localId: [],
        serverId: []
    };
    document.querySelector('#chooseImage').onclick = function () {
        wx.chooseImage({
            count: 1,
            success: function (res) {
                images.localId = res.localIds;
                //document.querySelector('imgtest').src = localId[0];
                alert('已选择 ' + res.localIds.length + ' 张图片');
            }
        });
    };

    // 5.2 图片预览
    document.querySelector('#previewImage').onclick = function () {
        wx.previewImage({
            current: 'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
            urls: [
                'http://img3.douban.com/view/photo/photo/public/p2152117150.jpg',
                'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
                'http://img3.douban.com/view/photo/photo/public/p2152134700.jpg'
            ]
        });
    };

    // 5.3 上传图片
    document.querySelector('#uploadImage').onclick = function () {
        if (images.localId.length == 0) {
            alert('请先使用 chooseImage 接口选择图片');
            return;
        }
        var i = 0, length = images.localId.length;
        images.serverId = [];
        function upload() {
            wx.uploadImage({
                localId: images.localId[i],
                success: function (res) {
                    i++;
                    alert('已上传：' + i + '/' + length);
                    images.serverId.push(res.serverId);
                    if (i < length) {
                        upload();
                    }
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        }
        upload();
    };

    // 5.4 下载图片
    document.querySelector('#downloadImage').onclick = function () {
        if (images.serverId.length === 0) {
            alert('请先使用 uploadImage 上传图片');
            return;
        }
        var i = 0, length = images.serverId.length;
        images.localId = [];
        function download() {
            wx.downloadImage({
                serverId: images.serverId[i],
                success: function (res) {
                    i++;
                    alert('已下载：' + i + '/' + length);
                    images.localId.push(res.localId);
                    if (i < length) {
                        download();
                    }
                }
            });
        }
        download();
    };
/*
    var shareData = {
        title: '方倍工作室 微信JS-SDK DEMO',
        desc: '微信JS-SDK,帮助第三方为用户提供更优质的移动web服务',
        link: 'http://www.cnblogs.com/txw1958/',
        imgUrl: 'http://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRt8Qia4lv7k3M9J1SKqKCImxJCt7j9rHYicKDI45jRPBxdzdyREWnk0ia0N5TMnMfth7SdxtzMvVgXg/0'
    };
    wx.onMenuShareAppMessage(shareData);
    wx.onMenuShareTimeline(shareData);*/
});

wx.error(function (res) {
    alert(res.errMsg);
});