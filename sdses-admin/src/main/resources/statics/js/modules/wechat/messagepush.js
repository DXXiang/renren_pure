
function but1() {
    window.location.href = "./message.html";
}
function but2() {
    var mess_cont=$('#text').val();
    var objectParams={}
    var openid = document.getElementsByName("tb"); //  获取checkbox对象,是一个数组对象
    var openids = new Array(); //用于存储已选择的选项值
    for (let i = 0; i < openid.length; ++i) { //遍历数组中的对象，查看有没有被选择的值
        if (openid[i].checked) {  //checked代表被选择
            openids.push(openid[i].value) ;  //把被选择的数据复制给hobby变量
        }
    }
    if (openids == "") {  //hobby为空代表没有选择
        alert("plece choose one!!");     }
    else {

    }
    // var messages = {
    //     'messages':[
    //         {
    //             "messNum" : "1000",
    //             "messCont" : 'asdasd',
    //             "userName" : 'w',
    //             "openid" : 'sdsadsad' ,
    //             "deliveryTime" : '2019-12-12',
    //             "sendResults" : '成功',
    //             "pushResults" : '成功'
    //         }
    //         ]
    // };
     //遍历数组中的对象，查看有没有被选择的值

        objectParams.messCont='asdasd';
        objectParams.openids=openids;
        objectParams.deliveryTime="2000-12-20 00:00:00";


        $.ajax({
            type: "POST",
            url: "/sdses-admin/wechat/message/sendMessages",
            // contentType: "application/json;charset=utf-8",

            dataType: "json",
            data: JSON.stringify(objectParams),//重点
            contentType:"application/json" ,    //指定类
            success: function (result) {
                alert(result)
            }

        })





}

$(function(){
    $.ajax({
        type:"get",
        async : false,
        url:  "/sdses-admin/wechat/message/getAllopenid",
        success: function (result) {
            var html = '';
            for(var i=0;i<result.length;i++){
                html += '<p><input type="checkbox" value="'+result[i].openid+'" name="tb">'+result[i].openid+'</p>'

            }
            document.getElementById('table').innerHTML=html;
        },
        error: function (errorMsg) {
            console.log(errorMsg);
        }
    })
});


function setAll() {
    var All = document.getElementsByName("tb");
    for (var i = 0; i < All.length; i++) {
        All[i].checked = true;
    }
}

//全不选函数
function setNo() {
    var No = document.getElementsByName("tb");
    for (var i = 0; i < No.length; i++) {
        No[i].checked = false;
    }
}

//反选
function setOthers() {
    var Others = document.getElementsByName("tb");
    for (var i = 0; i < Others.length; i++) {
        if (Others[i].checked == false)
            Others[i].checked = true;
        else
            Others[i].checked = false;
    }
}

//全选/全不选操作
function setAllNo(){
    var box = document.getElementById("boxid");
    var AllNo = document.getElementsByName("tb");
    if(box.checked == false){
        for (var i = 0; i < AllNo.length; i++) {
            AllNo[i].checked = false;
        }
    }else{
        for (var i = 0; i < AllNo.length; i++) {
            AllNo[i].checked = true;
        }
    }
}
