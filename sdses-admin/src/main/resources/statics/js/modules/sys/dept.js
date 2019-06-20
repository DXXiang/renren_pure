var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    }
};
var ztree;

var vm = new Vue({
    el:'#rrapp',
    data:{
        showList: true,
        title: null,
        dept:{
            parentName:null,
            parentId:0,
            orderNum:0
        },
        
        //结构类型列表
		typeDictList: {},
    },
    created: function () {
	    /**
	     * 加载字典数据
	     */
		//机构类型
	    $.get(baseURL + "sys/dict/listByType?type=deptType", function(r){
	    	vm.typeDictList = r.dictList;
	    });
    },
    methods: {
        getDept: function(){
            //加载机构树
            $.get(baseURL + "sys/dept/select", function(r){
                ztree = $.fn.zTree.init($("#deptTree"), setting, r.deptList);
                var node = ztree.getNodeByParam("deptId", vm.dept.parentId);
                ztree.selectNode(node);

                vm.dept.parentName = node.name;
            })
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            //vm.dept = {parentName:null,parentId:0,orderNum:0};
            var user = window.parent.vm.user;
            vm.dept = {parentName:user.deptName,parentId:user.deptId,orderNum:0};
            vm.getDept();
            window.parent.vm.isEditted = false;
        },
        update: function () {
            var deptId = getDeptId();
            if(deptId == null){
                return ;
            }
            console.log("====>"+window.parent.vm.user.deptId);
            if(deptId == window.parent.vm.user.deptId) {
            	alert('没有权限修改所在机构');
            	return;
            }
            
            $.get(baseURL + "sys/dept/info/"+deptId, function(r){
                vm.showList = false;
                vm.title = "修改";
                vm.dept = r.dept;

                vm.getDept();
            });
            window.parent.vm.isEditted = false;
        },
        del: function () {
            var deptId = getDeptId();
            if(deptId == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/dept/delete",
                    data: "deptId=" + deptId,
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        saveOrUpdate: function (event) {
        	if(vm.dept.name == null || vm.dept.name == '') {
        		alert('机构名称不能为空');
        		return false;
        	}
        	if(vm.dept.type == null || vm.dept.type == '') {
        		alert('机构类型不能为空');
        		return false;
        	}
        	if(vm.dept.orderNum.length>3) {
        		alert('排序号最大为999');
        		return false;
        	}
//        	console.log("====>"+vm.dept.orderNum);
//        	if(vm.dept.orderNum == null || vm.dept.orderNum == '') {
//        		alert('排序号不能为空111111');
//        		return false;
//        	}
            var url = vm.dept.deptId == null ? "sys/dept/save" : "sys/dept/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(vm.dept),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(){
                        	window.parent.vm.isEditted = false;
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        deptTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择机构",
                area: ['350px', '450px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#deptLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级机构
                    vm.dept.parentId = node[0].deptId;
                    vm.dept.parentName = node[0].name;

                    layer.close(index);
                }
            });
        },
        reload: function () {
            vm.showList = true;
            Dept.table.refresh();
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

var Dept = {
    id: "deptTable",
    table: null,
    layerIndex: -1
};

/**
 * 初始化表格的列
 */
Dept.initColumn = function () {
    var columns = [
        {field: 'selectItem', radio: true},
        {title: '机构ID', field: 'deptId', visible: false, align: 'center', valign: 'middle', width: '80px'},
        {title: '机构名称', field: 'name', align: 'center', valign: 'middle', sortable: true, width: '180px'},
        {title: '上级机构', field: 'parentName', align: 'center', valign: 'middle', sortable: true, width: '100px'},
        {title: '排序号', field: 'orderNum', align: 'center', valign: 'middle', sortable: true, width: '100px'}]
    return columns;
};


function getDeptId () {
    var selected = $('#deptTable').bootstrapTreeTable('getSelections');
    if (selected.length == 0) {
        alert("请选择一条记录");
        return null;
    } else {
        return selected[0].id;
    }
}


$(function () {
    $.get(baseURL + "sys/dept/info", function(r){
        var colunms = Dept.initColumn();
        var table = new TreeTable(Dept.id, baseURL + "sys/dept/list", colunms);
        table.setRootCodeValue(r.deptId);
        table.setExpandColumn(2);
        table.setIdField("deptId");
        table.setCodeField("deptId");
        table.setParentCodeField("parentId");
        table.setExpandAll(false);
        table.init();
        Dept.table = table;
    });
});
