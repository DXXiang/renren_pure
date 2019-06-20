var roleTree;
var deptTree;
//角色复选框组织树配置
var checkboxSetting = {
		check: {
			enable: true
		},
	    data: {
	        simpleData: {
	            enable: true,
	            idKey: "roleId",
	           
	            rootPId: -1
	        },
	        key: {
	        	 name : "roleName",
	            url:"nourl"
	        }
	    },
	    callback: { 
		 	onClick: function (e, treeId, treeNode, clickFlag) { 
		 		roleTree.checkNode(treeNode, !treeNode.checked, true); 
		 	} 
		}
};

$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'sys/user/list',
        datatype: "json",
        colModel: [			
			{ label: '用户ID', hidden:true, name: 'userId', index: "user_id", width: 45, key: true },
			{ label: '用户名', name: 'username', width: 75 },
			{ label: '姓名', name: 'realname', width: 75 },
            { label: '所属机构', name: 'deptName', sortable: false, width: 150 },
			{ label: '邮箱', name: 'email', width: 90 },
			{ label: '手机号', name: 'mobile', width: 75 },
			{ label: '性别', name: 'sex', width: 40, formatter: function(value, options, row){
				   if (value === '0') 
					//return '<span class="label label-danger">女</span>'
					   return '女';
				   else if(value == 1)
					//return '<span class="label label-success">男</span>';
					   return '男';
				   else
					//return '<span class="label label-warning">未知</span>';
					   return '未知';
			}},
			{ label: '状态', name: 'status', width: 40, formatter: function(value, options, row){
//				return value === 0 ? 
//					'<span class="label label-danger">禁用</span>' : 
//					'<span class="label label-success">正常</span>';
				return value === 0 ? '禁用' : '正常';
			}},
			{ label: '创建时间', name: 'createTime', index: "create_time", width: 110}
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
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            username: null
        },
        showList: true,
        title:null,
        roleList:{},
        IdList:[],
        rolename:"",
        bool : false, //加个锁
        addUser : true,
        user:{
            status:1,
            username:'',
            deptId:null,
            deptName:null,
            roleIdList:[],
            password:'111111',
            pathHead: null
        },
        baseURL: baseURL,
    },
    watch:{
    	'user.username':function() {
			this.user.username=this.user.username.replace(/[^\w\.\/]/ig,'');
		}
//    	user:{
//              handler(val, oldVal){
//            	 var newValue = val.username;
//            	 console.log(newValue);
//                 vm.user.username = newValue.replace(/[^\w\.\/]/ig,'');
//                 console.log(vm.user.username);
//             },
//             deep:true
//        }
   },
    created:function(){
    	window.parent.vm.isEditted = false;
    	this.getRoleList();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function(){
        	window.parent.vm.isEditted = false;
            vm.showList = false; 
            vm.addUser = true;
            vm.title = "新增";   
            $('#rolese').empty();
            vm.user = {deptName:null,username:'',deptId:null, status:1, roleIdList:[], password:'111111',pathHead:null};
            
			vm.rolename="";
            //获取角色信息
            //this.getRoleList();

            vm.getDept();

        },
        getDept: function(){
            //加载机构树
            $.get(baseURL + "sys/dept/list", function(r){
                deptTree = $.fn.zTree.init($("#deptTree"), setting, r);
                var node = deptTree.getNodeByParam("deptId", vm.user.deptId);
                if(node != null){
                	deptTree.selectNode(node);
                    vm.user.deptName = node.name;
                }
            })
        },
        update: function () {
        	window.parent.vm.isEditted = false;
            var userId = getSelectedRow();
            if(userId == null){
                return ;
            }
            vm.showList = false;
            vm.addUser = false;
            vm.title = "修改";
          	vm.rolename = "";
       	 	$('#rolese').empty();
            //获取角色信息
            //this.getRoleList();
            vm.getUser(userId);
           
        },
        del: function () {
            var userIds = getSelectedRows();
            if(userIds == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/user/delete",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(userIds),
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
        saveOrUpdate: function () {
        	if(vm.user.username == null || vm.user.username == '') {
        		alert('用户名不能为空');
        		return false;
        	}
        	if(vm.user.realname == null || vm.user.realname == '') {
        		alert('姓名不能为空');
        		return false;
        	}
        	if(vm.user.deptId == null || vm.user.deptId == '') {
        		alert('所属机构不能为空');
        		return false;
        	}
//        	if(vm.user.password == null || vm.user.password == '') {
//        		alert('密码不能为空');
//        		return false;
//        	}
        	if(vm.user.email == null || vm.user.email == '') {
        		alert('邮箱不能为空');
        		return false;
        	} else {
        		 var reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$"); 
        		 if(!reg.test(vm.user.email)){
            		alert("邮箱格式不正确");
    		        return false;
            	 }
        	}
        	if(vm.user.mobile == null || vm.user.mobile == '') {
        		alert("用户电话不能为空");
        		return false;
        	}
        	
            var url = vm.user.userId == null ? "sys/user/save" : "sys/user/update";
			if(vm.bool) {
				return;
			}
			vm.bool = true;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(vm.user),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(){
                        	window.parent.vm.isEditted = false;
                        	//修改的是当前，更新当前用户信息
                        	if(vm.user.userId == window.parent.vm.user.userId){
                        		window.parent.vm.getUser();
                        	}
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                },
                complete: function() {
                	vm.bool = false;
                }
            });
        },
        getUser: function(userId){
            $.get(baseURL + "sys/user/info/"+userId, function(r){
                vm.user = r.user;
                vm.user.password = null;
                vm.getDept();
                vm.roleTree();
            });
        },
        getRoleList: function(){
            $.get(baseURL + "sys/role/select", function(r){   	
                vm.roleList = r.list;
//                for (var i = 0; i < vm.roleList.length; i++) {
//                    $('#rolese').append("<option value=" + vm.roleList[i].roleId + ">" + vm.roleList[i].roleName + "</option>");
//                }
//                $('#rolese').selectpicker('refresh');
//                $('#rolese').selectpicker('render');
             
              
            });

        },
        roleTree:function(){
        	  roleTree = $.fn.zTree.init($("#roleTree"), checkboxSetting, vm.roleList);//selectUsers
        	  roleTree.checkAllNodes(false);
 			  //console.log("==========================111>"+JSON.stringify(vm.roleList));
 			  //console.log("==========================222>"+JSON.stringify(vm.user.roleIdList));
 			  if(vm.user.roleIdList.length>0){
				   for(var i=0; i<vm.user.roleIdList.length; i++){
					   var node = roleTree.getNodeByParam("roleId", vm.user.roleIdList[i]);
					   if(node) {
						   roleTree.checkNode(node,true);
					   }
				   }
			   }
 			   roleTree.expandAll(true);
 			   var nodes = roleTree.getCheckedNodes();
 			   //console.log("==========================111>"+nodes.length);
		       if(nodes && nodes.length>0){
		    	   vm.user.roleIdList=[];
	   			   vm.rolename="";
	   			   for(var i=0; i<nodes.length; i++){
	   				   vm.rolename = vm.rolename + nodes[i].roleName + ";";
	   				   vm.user.roleIdList.push(nodes[i].roleId);
	   				   rolename = rolename + nodes[i].roleName + ";";
	   			   }
	   			   $("#rolename").val(rolename);
	   		   }    
        },
        
        showRoleTree:function(){
        	 this.roleTree();
        	 layer.open({
	               type: 1,
	               offset: '50px',
	               skin: 'layui-layer-molv',
	               title: "选择角色",
	               area: ['350px', '450px'],
	               shade: 0,
	               shadeClose: false,
	               content: jQuery("#roleLayer"),
	               btn: ['确定', '取消'],
	               btn1: function (index) {
	            		   var nodes = roleTree.getCheckedNodes();
	            		   if(nodes && nodes.length>0){
	            			   vm.user.roleIdList=[];
	            			   vm.rolename="";
	            			   for(var i=0; i<nodes.length; i++){
	            				   vm.rolename = vm.rolename + nodes[i].roleName + ";";
	            				   vm.user.roleIdList.push(nodes[i].roleId);
	            				   rolename = rolename + nodes[i].roleName + ";";
	            			   }
	            			   $("#rolename").val(rolename);
	            		   }else{
	            			   vm.user.roleIdList=[];
	            			   vm.rolename="";
	            		   }
	            	 
	                   layer.close(index);
	               }
	           });
        },
        deptTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择机构",
                area: ['300px', '450px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#deptLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = deptTree.getSelectedNodes();
                    //选择上级机构
                    vm.user.deptId = node[0].deptId;
                    vm.user.deptName = node[0].name;
                    $("#deptName").val(node[0].name);
                    
                    layer.close(index);
                }
            });
        },
        reload: function () {
            vm.showList = true;
            //var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'username': vm.q.username}
                ,page:null
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
        },
        /************************* 上传头像B *************************/
        /**
		 * 上传头像进度条
		 */
		photoProgressHandlingFunction: function(e) {
			if (e.lengthComputable) {
				var percent = e.loaded / e.total;
		        $("#photoProgressBar .progress-bar").css("width", (percent * parseInt($("#photoProgressBar").css("width"))));
			} 
		},
		/**
		 * 头像上传
		 */
		uploadPersonPhoto: function(){
			var files = vm.$refs.photoFile.files;
			if(files.length < 1){
				alert("请选择上传的文件");
				return;
			} else {
                //检验文件类型是否正确
                var exec = (/[.]/.exec(files[0].name)) ? /[^.]+$/.exec(files[0].name.toLowerCase()) : '';
                if (exec != "png" && exec != 'jpg' && exec != 'jpeg') {
                    alert("文件格式不正确，请上传png、jpg、jpeg类型文件!");
                    return false;
                }
            }
			
			var formData = new FormData();  
			formData.append('files', files[0]);
			ajax = $.ajax({
				url: baseURL + 'common/comfile/uploadFile/1',
				type: 'POST',
				dataType: 'json',
				cache: false,
				data: formData,
				xhr: function(){
	            	myXhr = $.ajaxSettings.xhr();
	            	if(myXhr.upload){
	            		myXhr.upload.addEventListener('progress',vm.photoProgressHandlingFunction, false);
	            	}  
	            	return myXhr; //xhr对象返回给jQuery使用  
	            },
				processData: false,
				contentType: false,
			    beforeSend: function(){
			    	$("#photoUploadBtn").hide();
			    	$("#photoProgressBar").show();
	            },
				success: function(data){
					if(data.code=="0"){
						vm.user.pathHead = data.file.path;
					} else {
						alert(data.msg);
					}
				},
	            error:function (data, status, e){   
                	if(data.statusText == 'abort') {
                		alert('已取消上传');
                	} else {
                		alert('上传文件失败')
                	}
	            },
	            complete: function(){
	            	$("#photoProgressBar .progress-bar").css("width", 0);
	            	$("#photoProgressBar").hide();
	            	$("#photoUploadBtn").show();
	            }
			});
		},
		
		/**
		 * 显示头像大图预览
		 */
		showImageModel: function(){
			$("#imageModal").modal("show");
			$("#imageModal").css("display","flex");
		}
        /************************* 上传头像E *************************/
    }
});
//window.onunload = onunload_message;   
//function onunload_message(e){ 
//	console.log("===============");
//	var msg="真的要离开么？";
//    e.returnValue=msg;
//    return msg;   
//	console.log("========222=======");
//}  
