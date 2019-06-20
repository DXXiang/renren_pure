$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'sys/role/list',
        datatype: "json",
        colModel: [
            { label: '角色ID', hidden:true, name: 'roleId', index: "role_id", width: 45, key: true },
            { label: '角色名称', name: 'roleName', index: "role_name", width: 75 },
            { label: '所属机构', name: 'deptName', sortable: false, width: 75 },
            { label: '备注', name: 'remark', width: 100 },
            { label: '创建时间', name: 'createTime', index: "create_time", width: 80}
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

//菜单树
var menu_ztree;
var menu_setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "menuId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    },
    check:{
        enable:true,
        nocheckInherit:true
    },
    callback: { 
	 	onClick: function (e, treeId, treeNode, clickFlag) { 
	 		menu_ztree.checkNode(treeNode, !treeNode.checked, true); 
	 	} 
	}
};

//部门结构树
var dept_ztree;
var dept_setting = {
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

//数据树
var data_ztree;
var data_setting = {
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
    },
    check:{
        enable:true,
        nocheckInherit:true,
        chkboxType:{ "Y" : "ss", "N" : "ss" }
    },
    callback: { 
	 	onClick: function (e, treeId, treeNode, clickFlag) { 
	 		data_ztree.checkNode(treeNode, !treeNode.checked, true); 
	 	} 
	}
};

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            roleName: null
        },
        showList: true,
        title:null,
        role:{
            deptId:null,
            deptName:null
        },
        menuList:[],
        deptList:[]
    },
    created: function() {
        $.get(baseURL + "sys/menu/listByUser", function(r){
        	vm.menuList = r;
        });
        $.get(baseURL + "sys/dept/list", function(r){
        	vm.deptList = r;
        });
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.role = {deptName:null, deptId:null};
            this.initMenuTree();
            this.initDeptTree();
            this.initDataTree();

            window.parent.vm.isEditted = false;
        },
        update: function () {
            var roleId = getSelectedRow();
            if(roleId == null){
                return ;
            }
            vm.title = "修改";
            vm.showList = false;
            this.initMenuTree();
            this.initDataTree();
            this.initDeptTree();
            vm.getRole(roleId);
            window.parent.vm.isEditted = false;
        },
        del: function () {
            var roleIds = getSelectedRows();
            if(roleIds == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/role/delete",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(roleIds),
                    success: function(r){
                        if(r.code == 0){
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
        getRole: function(roleId){
            $.get(baseURL + "sys/role/info/"+roleId, function(r){
                vm.role = r.role;
                vm.getDept();
                //console.log(JSON.stringify(vm.role));
                //勾选角色所拥有的部门数据权限
                var deptIds = vm.role.deptIdList;
        		for(var i=0; i<deptIds.length; i++) {
                    var node = data_ztree.getNodeByParam("deptId", deptIds[i]);
                    data_ztree.checkNode(node, true, false);
            	}
                //勾选角色所拥有的菜单
                var menuIds = vm.role.menuIdList;
                for(var i=0; i<menuIds.length; i++) {
                	var node = menu_ztree.getNodeByParam("menuId", menuIds[i]);
                    menu_ztree.checkNode(node, true, false);
                }
        		//console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            });
        },
        saveOrUpdate: function () {
        	//校验
        	if(vm.role.roleName == null || vm.role.roleName == '') {
        		alert('角色名称不能为空');
        		return false;
        	}
        	if(vm.role.deptId == null || vm.role.deptId == '') {
        		alert('所属机构不能为空');
        		return false;
        	}
        	
            //获取选择的菜单
            var nodes = menu_ztree.getCheckedNodes(true);
            var menuIdList = new Array();
            for(var i=0; i<nodes.length; i++) {
                menuIdList.push(nodes[i].menuId);
            }
            vm.role.menuIdList = menuIdList;
            //获取选择的数据
            var nodes = data_ztree.getCheckedNodes(true);
            //var nodes = dept_ztree.getSelectedNodes();
            var deptIdList = new Array();
            for(var i=0; i<nodes.length; i++) {
                deptIdList.push(nodes[i].deptId);
            }
            vm.role.deptIdList = deptIdList;

            var url = vm.role.roleId == null ? "sys/role/save" : "sys/role/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(vm.role),
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
        initMenuTree: function() {
            menu_ztree = $.fn.zTree.init($("#menuTree"), menu_setting, this.menuList);
            menu_ztree.expandAll(true);
        },
        initDataTree: function() {
        	 data_ztree = $.fn.zTree.init($("#dataTree"), data_setting, vm.deptList);
        	 data_ztree.expandAll(true);
        },
        initDeptTree:function() {
        	dept_ztree = $.fn.zTree.init($("#deptTree"), dept_setting, vm.deptList);
        },
        getDept: function(){
            var node = dept_ztree.getNodeByParam("deptId", vm.role.deptId);
            if(node != null){
                dept_ztree.selectNode(node);
                vm.role.deptName = node.name;
            }
        },
        deptTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择部门",
                area: ['300px', '450px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#deptLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = dept_ztree.getSelectedNodes();
                    //选择上级部门
                    vm.role.deptId = node[0].deptId;
                    vm.role.deptName = node[0].name;

                    layer.close(index);
                }
            });
        },
        reload: function () {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'roleName': vm.q.roleName},
                page:null
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