$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'sys/dict/list',
        datatype: "json",
        colModel: [			
			{ label: '字典名称', name: 'name', index: 'name', width: 80 },
			{ label: '字典类型', name: 'type', index: 'type', width: 80 }, 			
			{ label: '字典码', name: 'code', index: 'code', width: 80 }, 			
			{ label: '字典值', name: 'value', index: 'value', width: 80 }, 			
			{ label: '排序', name: 'orderNum', index: 'order_num', width: 80 }, 			
			{ label: '备注', name: 'remark', index: 'remark', width: 80 }
		],
		viewrecords: true,
        height: 350,
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
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "auto" }); 
        }
    });
});

var vm = new Vue({
	el:'#rrapp',
	data:{
        q:{
            name: null
        },
		showList: true,
		title: null,
		dict: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.dict = {};
			 window.parent.vm.isEditted = false;
		},
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
            window.parent.vm.isEditted = false;
		},
		saveOrUpdate: function (event) {
			//校验
        	if(vm.dict.name == null || vm.dict.name == '') {
        		alert('字典名称不能为空');
        		return false;
        	}
        	if(vm.dict.type == null || vm.dict.type == '') {
        		alert('字典类型不能为空');
        		return false;
        	}
        	if(vm.dict.code == null || vm.dict.code == '') {
        		alert('字典码不能为空');
        		return false;
        	}
        	if(vm.dict.value == null || vm.dict.value == '') {
        		alert('字典值不能为空');
        		return false;
        	}
        	if(vm.dict.orderNum && vm.dict.orderNum.length>3) {
        		alert('排序号最大为999');
        		return false;
        	}
			var url = vm.dict.id == null ? "sys/dict/save" : "sys/dict/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json;charset=utf-8",
			    data: JSON.stringify(vm.dict),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							window.parent.vm.isEditted = false;
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
				    url: baseURL + "sys/dict/delete",
                    contentType: "application/json;charset=utf-8",
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
			$.get(baseURL + "sys/dict/info/"+id, function(r){
                vm.dict = r.dict;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
                postData:{'name': vm.q.name},
                page:page
            }).trigger("reloadGrid");
		},
        back: function() {
        	if(window.parent.vm.isEditted) {
        		confirm('页面尚未保存，您确定要离开页面吗？', function(){
        			window.parent.vm.isEditted = false;
        			vm.reload();
        		});
        	} else {
        		vm.reload();
        	}
        }
	}
});