$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'wechat/usercheckresult/list',
        datatype: "json",
        colModel: [
        	{ label: 'id', name: 'id', index: 'id', width: 50, key: true },
			{ label: '', name: 'openid', index: 'openid', width: 80 }, 			
			{ label: '', name: 'idname', index: 'idname', width: 80 }, 			
			{ label: '', name: 'idnum', index: 'idnum', width: 80 },
			{ label: '', name: 'picture', index: 'picture', width: 80 }, 			
			{ label: '', name: 'result', index: 'result', width: 80 }, 			
			{ label: '', name: 'failReason', index: 'fail_reason', width: 80 }, 			
			{ label: '', name: 'date', index: 'date', width: 80 }			
        ],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
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
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
		userCheckresult: {},
		//查询条件
		searchParams: {idname:'', idnum:'', date:'', result:""}
	},
	methods: {
		query: function () {
			vm.reload(1);
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.userCheckresult = {};
		},
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
			var url = vm.userCheckresult.id == null ? "wechat/usercheckresult/save" : "wechat/usercheckresult/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.userCheckresult),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (event) {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "wechat/usercheckresult/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
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
		getInfo: function(id){
			$.get(baseURL + "wechat/usercheckresult/info/"+id, function(r){
                vm.userCheckresult = r.userCheckresult;
            });
		},
		reload: function (pageNum) {
			//删除查询条件前后空格
			vm.searchParams.idname=vm.searchParams.idname.trim();
			vm.searchParams.idnum=vm.searchParams.idnum.trim();
			vm.searchParams.date=vm.searchParams.date.trim();
			vm.searchParams.result=vm.searchParams.result.trim();
			// alert(vm.searchParams.idname);
			vm.showList = true;
			// var page = $("#jqGrid").jqGrid('jqGrid','page');
			// $("#jqGrid").jqGrid('setGridParam',{
            //     page:page
            // }).trigger("reloadGrid");
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			if(pageNum != null && pageNum != undefined){
				page = 1;
			}
			$("#jqGrid").jqGrid('setGridParam',{
				postData:vm.searchParams,
				page:page
			}).trigger("reloadGrid");
		},
		resetSearch: function(){
			vm.searchParams = {idname:'', idnum:'', date:'', result:""};
			//查询除原来的传递参数，并逐个清空 B
			var postDataTemp = $("#jqGrid").jqGrid("getGridParam", "postData");
			delete postDataTemp["name"];
			delete postDataTemp["sex"];
			delete postDataTemp["placeNative"];
			delete postDataTemp["numId"];
			delete postDataTemp["nickname"];
		},
		exportToExcel:function (event) {
			window.location.href = baseURL + "wechat/export/exportToExcel";
		}

	}
});