$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'wechat/message/list',
        datatype: "json",
        colModel: [			
			{ label: 'messNum', name: 'messNum', index: 'mess_num', width: 50, key: true },
			{ label: '', name: 'messCont', index: 'mess_cont', width: 80 }, 			
			{ label: '', name: 'userName', index: 'user_name', width: 80 }, 			
			{ label: '', name: 'openid', index: 'openid', width: 80 }, 			
			{ label: '', name: 'deliveryTime', index: 'delivery_time', width: 80 }, 			
			{ label: '', name: 'sendResults', index: 'send_results', width: 80 }, 			
			{ label: '', name: 'pushResults', index: 'push_results', width: 80 }			
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
		message: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.message = {

			};
		},
		update: function (event) {
			var messNum = getSelectedRow();
			if(messNum == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(messNum)
		},
		saveOrUpdate: function (event) {
			var url = vm.message.messNum == null ? "wechat/message/save" : "wechat/message/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.message),
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
		getInfo: function(messNum){
			$.get(baseURL + "wechat/message/info/"+messNum, function(r){
                vm.message = r.message;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:page
            }).trigger("reloadGrid");
		}
	}
});