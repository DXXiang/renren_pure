<?php
require_once "jssdk.php";
$jssdk = new JSSDK("wx679677b804f19fcc", "73b6c99b7556e5a590347f6b6e8a7945");
$signPackage = $jssdk->GetSignPackage();
?>


<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>微信JS-SDK Demo</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">
  <link rel="stylesheet" href="./weui.css">
    <link rel="stylesheet" href="https://www.weixinsxy.com/jssdk/css/style.css">
</head>
<body ontouchstart="">
<div class="wxapi_container">
    <div class="lbox_close wxapi_form">
        <h3 id="menu-basic">基础接口</h3>
        <span class="desc">判断当前客户端是否支持指定JS接口</span>
        <a id="checkJsApi" class="weui-btn weui-btn_plain-default">checkJsApi</a>

        <h3 id="menu-image">图像接口</h3>
        <span class="desc">拍照或从手机相册中选图接口</span>
        <a id="chooseImage" class="weui-btn weui-btn_plain-default">chooseImage</a>
        <div>
            <img id="imgtest" src="url" alt="some_text">
        </div>

        <span class="desc">预览图片接口</span>
        <a id="previewImage" class="weui-btn weui-btn_plain-default">previewImage</a>
        <span class="desc">上传图片接口</span>
        <a id="uploadImage" class="weui-btn weui-btn_plain-default">uploadImage</a>
        <span class="desc">下载图片接口</span>
        <a id="downloadImage" class="weui-btn weui-btn_plain-default">downloadImage</a>
    </div>
    <div class="weui-uploader__bd">
        <ul class="weui-uploader__files" id="uploaderFiles">
            <li class="weui-uploader__file" style="background-image:url()"></li>
            <li class="weui-uploader__file" style="background-image:url()"></li>
            <li class="weui-uploader__file" style="background-image:url()"></li>
            <li class="weui-uploader__file weui-uploader__file_status" style="background-image:url()">
                <div class="weui-uploader__file-content">
                    <i class="weui-icon-warn"></i>
                </div>
            </li>
            <li class="weui-uploader__file weui-uploader__file_status" style="background-image:url()">
                <div class="weui-uploader__file-content">50%</div>
            </li>
        </ul>
        <div class="weui-uploader__input-box">
            <input id="uploaderInput" class="weui-uploader__input" type="file" accept="image/*" multiple="">
        </div>
    </div>
</div>
</body>

<script src="https://weui.io/zepto.min.js"></script>
<script src="http://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
<script src="./wx.js"></script>

<script>

  wx.config({
    debug: true,
    appId: '<?php echo $signPackage["appId"];?>',
    timestamp: <?php echo $signPackage["timestamp"];?>,
    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
    signature: '<?php echo $signPackage["signature"];?>',
    jsApiList: [
      'checkJsApi',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
    ]
  });

</script>

</html>
