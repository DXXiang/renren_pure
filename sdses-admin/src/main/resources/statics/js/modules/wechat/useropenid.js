$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'wechat/useropenid/list',
        datatype: "json",
        colModel: [			
			{ label: 'openid', name: 'openid', index: 'openid', width: 50, key: true },
			{ label: '', name: 'type', index: 'type', width: 80 ,
				formatter : function(cellValue, options, rowObject) {
					return cellValue === '1' ? '公众号' : '小程序';
				}
			}
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
		userOpenid: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.userOpenid = {};
		},
		update: function (event) {
			var openid = getSelectedRow();
			if(openid == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(openid)
		},
		saveOrUpdate: function (event) {
			var url = vm.userOpenid.openid == null ? "wechat/useropenid/save" : "wechat/useropenid/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.userOpenid),
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
			var openids = getSelectedRows();
			if(openids == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "wechat/useropenid/delete",
                    contentType: "application/json",
				    data: JSON.stringify(openids),
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
		getInfo: function(openid){
			$.get(baseURL + "wechat/useropenid/info/"+openid, function(r){
                vm.userOpenid = r.userOpenid;
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