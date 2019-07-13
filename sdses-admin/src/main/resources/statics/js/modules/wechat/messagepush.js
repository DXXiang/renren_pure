
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


        objectParams.messCont=mess_cont;
        objectParams.openids=openids;



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

}
function but3(){
    if($('#c-query').is(':hidden')){
        $('#c-box').toggle();
        $('#c-cont').toggle();
        $('#c-butt').toggle();


    }else{

        alert('正在搜索')

    }


}
function but4(){

    if($('#c-box').is(':hidden')){
        $('#c-query').toggle();


    }else{

        alert('正在新增')

    }

}
$(function(){
    $("#jqGrid").jqGrid({
        url: baseURL + 'wechat/message/list',
        datatype: "json",
        colModel: [
            { label: '', name: 'messNum', index: 'mess_num', width: 50, key: true },
            { label: '消息内容', name: 'messCont', index: 'mess_cont', width: 80 },

            { label: '', name: 'openid', index: 'openid', width: 80 },
            { label: '推送时间', name: 'deliveryTime', index: 'delivery_time', width: 80 },
            { label: '推送结果', name: 'pushResults', index: 'push_results', width: 80,
                formatter : function(cellValue, options, rowObject) {
                    return cellValue === '0' ? '成功' : '不成功';
                }
            }
        ],
        viewrecords: true,
        height: 150,
        rowNum: 5,
        rowList : [5,30,50],
        rownumbers: true,
        rownumWidth: 20,
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page",
            rows:"limit",
            order: "order"
        },
        gridComplete:function(){
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
        }
    });
    $.ajax({
        type:"get",
        async : false,
        url:  "/sdses-admin/wechat/message/getMpopenid",
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
var vm = new Vue({
    el:'#rrapp',
    data:{
        showList: true,
        title: null,
        message: {}
    },
    methods: {
        query: function () {
            vm.reload();
        },

        del: function (event) {
            var messNums = getSelectedRows();
            if(messNums == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "wechat/message/delete",
                    contentType: "application/json",
                    data: JSON.stringify(messNums),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                $("#jqGrid").trigger("reloadGrid");
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        // getInfo: function(messNum){
        //     $.get(baseURL + "wechat/message/info/"+messNum, function(r){
        //         vm.message = r.message;
        //     });
        // },
        reload: function (event) {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                page:page
            }).trigger("reloadGrid");
        }
    }
});