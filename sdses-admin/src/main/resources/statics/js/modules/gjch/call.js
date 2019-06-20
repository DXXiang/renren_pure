var ajax; //ajax对象
//用户信息
var user = window.parent.vm.user;
//组织树
var ztree;
//机构组织树配置
var Setting = {
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
		callback: { 
		 	onClick: function (e, treeId, treeNode, clickFlag) { 
		 		ztree.checkNode(treeNode, !treeNode.checked, true); 
		 	} 
		}
};
//人员复选框组织树配置
var checkboxSetting = {
		check: {
			enable: true
		},
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
		callback: { 
		 	onClick: function (e, treeId, treeNode, clickFlag) { 
		 		ztree.checkNode(treeNode, !treeNode.checked, true); 
		 	} 
		}
};

var vm = new Vue({
	el:'#rrapp',
	data:{
		showPage: null, //0:列表；1：新增
		title: "",
		optType : "add",
		searchType:'1', //查询类型 【 0：全文检索；1：高级查询】	
		changeSearchButtonText: "高级查询", //切换按钮文字展示
		searchParams: {region:"",language:"",content:"",type:""}, //查询条件
		regionDictList:{}, //县市列表
		languageDictList:{}, //语种列表
		typeDictList:{}, //类型列表
		isPlatformDictList:{}, //是否上平台
		stare:{}, //盯办人
		stareUserNames:"",
		call: {},
		//线索附件
		callImport:{},
		isShowUserTreeDisable : false
	},
	methods: {
		/*********************************** 多窗口操作 B ***********************************/
		/**
		 * 初始化页面
		 */
		initPage: function(){
			//加载事件插件
			this.dateDefind();
			/*$("body").click(function(e){
		    	e.stopImmediatePropagation();
		    	var classNames = e.target.className;
		    	if(!classNames || classNames == "" || classNames.indexOf("datetimepicker") < 0){
		    		$("#"+vm.globalDateTimePickerId).datetimepicker("hide");
		    	}
		    });*/
			
			//页面参数
			var params = self.frameElement.getAttribute('params');
			if(params != 'undefined' && params != 'null'){
				//新增
				if(params == 'A'){		
					this.optType = "add";
					this.showPage = 1;
					this.title = "新增境内外涉恐通联";
					this.initGlobalCall();
				} else {
					var paramArr = params.split('-');
					var callId = paramArr[1];
					$.get(baseURL + "gjch/call/info/"+paramArr[1]+"/51", function(r){
						vm.call = r.call;
		                $("#callTimePicker").val(vm.call.callTime);
		                if(paramArr[0] == 'V'){//查看             	
		                	vm.optType = "query";            
		                	vm.title = "境内外涉恐通联查看"; 
		            	}else if(paramArr[0] == 'U'){//修改
		            		vm.optType = "update";
		            		vm.title = "境内外涉恐通联修改";
		            	}
		                vm.showPage = 1;
		                vm.setIsEnableEdit("0");
		            });
				}
			} else {
				this.loadingTable();
			}
		},
		/**
		 * 页面跳转（打开多页面）
		 */
		jumpPage: function(type_id){
			/**
			 * 判断数据是否被处理
			 */
			if(type_id != 'A'){
				var callId = type_id.split('-')[1];
				var call = vm.getInfo(callId);
	            if(call.delFlag != 0){
					alert('数据已被删除，无法操作！');
					vm.reload(1);
					return;
				}
			}
			
			//当前页面 url （与数据库中统一）
			var url = self.frameElement.getAttribute('src');
			var title = null;
			window.parent.goNext(url, type_id, title);
		},
		/**
		 * 关闭按钮 关闭页面
		 */
		closePage: function(){
			var iframeId = self.frameElement.getAttribute('id');
			window.parent.closeIframe(iframeId);
		},
		/**
		 * 关闭按钮 关闭页面 调用 父页面 带确认框的方法
		 */
		closePageWithConfirm: function(){
			var iframeId = self.frameElement.getAttribute('id');
			window.parent.closeIframeWithConfirm(iframeId, 1);
		},
		/**
		 * 切换页面
		 * 关闭当前页面，跳转到主页面
		 */
		switchPage: function(){
			//1、主页面为 打开状态， 更新主页面表格数据
			if(window.parent.frames[self.frameElement.getAttribute('fatherId')] != undefined){
				window.parent.frames[self.frameElement.getAttribute('fatherId')].window.vm.query();
			}
			//2、跳转到主页面
			var url = self.frameElement.getAttribute('src');
			window.parent.goNext(url);
			//window.parent.document.getElementById(self.frameElement.getAttribute('fatherId')).window.vm.query();
			//3、关闭当前页面
			vm.closePage();
		},
		/*********************************** 多窗口操作 E ***********************************/
		/**
		 * 加载字典值
		 */
		loadingDict: function(){
			var dictListMap = window.parent.vm.dictListMap;
			//县市
			if(dictListMap.has('region')){
				this.regionDictList = dictListMap.get('region');
			} else {
				$.get(baseURL + "sys/dict/listByType?type=region", function(r){
			    	vm.regionDictList = r.dictList;
			    	dictListMap.set('region', vm.regionDictList);
			    });
			}
			//语种                                                                                    
			if(dictListMap.has('callLanguage')){
				this.languageDictList = dictListMap.get('callLanguage');
			} else {
				$.get(baseURL + "sys/dict/listByType?type=callLanguage", function(r){
			    	vm.languageDictList = r.dictList;
			    	dictListMap.set('callLanguage', vm.languageDictList);
			    });
			}
			//通话类型
			if(dictListMap.has('callType')){
				this.typeDictList = dictListMap.get('callType');
			} else {
				$.get(baseURL + "sys/dict/listByType?type=callType", function(r){
			    	vm.typeDictList = r.dictList;
			    	dictListMap.set('callType', vm.typeDictList);
			    });
			}
			//是否上平台
		    if(dictListMap.has('isPlatform')){
				this.isPlatformDictList = dictListMap.get('isPlatform');
			} else {
				$.get(baseURL + "sys/dict/listByType?type=isPlatform", function(r){
			    	vm.isPlatformDictList = r.dictList;
			    	dictListMap.set('isPlatform', vm.isPlatformDictList);
			    });
			}
		},
		/**
		 * 加载表格
		 */
		loadingTable: function(){
			$("#jqGrid").jqGrid({
		        url: baseURL + 'gjch/call/list/68',
		        datatype: "json",
		        colModel: [
		                { label: '序号', hidden: true, name: 'callId', index: 'CALL_ID', key: true },	       						
		    			{ label: '县市', align: 'center', name: 'region', index: 'REGION', width: 80 , formatter: function(value, options, row){
		    				for(var i=0; i<vm.regionDictList.length; i++){
		    					if(vm.regionDictList[i].code == value){
		    						return vm.regionDictList[i].value;
		    					}
		    				}
		    				return "";
		    			}}, 
		    			{ label: '通联内容', sortable: false, name: 'content', index: 'CONTENT', width: 270, formatter:function(value, grid, row){
		       				var str = '<a style="cursor: pointer" onclick="vm.jumpPage(\'V-'+ row.callId +'\')">'+ value +'</a>';
		       				return str;
		       			}}, 
		    			{ label: '语种', align: 'center', name: 'language', index: 'LANGUAGE', width: 50 , formatter: function(value, options, row){
		    				for(var i=0; i<vm.languageDictList.length; i++){
		    					if(vm.languageDictList[i].code == value){
		    						return vm.languageDictList[i].value;
		    					}
		    				}
		    				return "";
		    			}}, 	
		    			{ label: '类型',  align: 'center',name: 'type', index: 'TYPE', width: 100 , formatter: function(value, options, row){
		    				for(var i=0; i<vm.typeDictList.length; i++){
		    					if(vm.typeDictList[i].code == value){
		    						return vm.typeDictList[i].value;
		    					}
		    				}
		    				return "";
		    			}}, 
		    			{ label: '时间', align: 'center', name: 'callTime', index: 'CALL_TIME', width: 110, formatter:"date",formatoptions: {srcformat:'Y-m-d H:i:s',newformat:'Y-m-d H:i:s'} }, 			
		    			{ label: '操作', align: 'center', name: '', index: '', width: 70 , formatter: function(value, grid, row){
		    				var str = "";
		    				str += '<a style="cursor: pointer" title="查看" onclick="vm.jumpPage(\'V-'+ row.callId +'\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
		    				str += '<a style="cursor: pointer" title="修改" onclick="vm.jumpPage(\'U-'+ row.callId +'\')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
		    				str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteCallById('+ row.callId +',0)"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
		    				return str;
		    			}},
		    			{ label: '删除权限', sortable: false, name: 'operation.allowDelete', index: 'operation.allowDelete', hidden:true }
		        ],
		        cellEdit: false,
		        sortable: true,
				viewrecords: true,
		        height: 370,
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
		        },
		        postData:{
		        	searchType:'0',
		        	createType:'1'
		        }
		    });
		},
		//时间插件
		dateDefind: function () {
		    var d, s;
		    var self = this;
		    d = new Date();
		    s = d.getFullYear() + "-";       // 取年份
		    s = s + (d.getMonth() + 1) + "-";// 取月份
		    s += d.getDate() + " ";     // 取日期
		   
		    s += d.getHours() + ":"; // 获取当前小时数(0-23) 
		    s += d.getMinutes() + ":"; // 获取当前分钟数(0-59) 
		    s += d.getSeconds(); // 获取当前秒数(0-59) m		   
//		    $("#callTimePicker").val(s);
		    
		   
		    //高级查询开始时间
//		    $("#beginTimePicker").datetimepicker({
//		    	//startDate: s,
//		    	format: "yyyy-mm-dd",
//		        //日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
//		        minView: "2",
//		        language: 'zh-CN',
//		        autoclose: true,
//		        todayBtn: true,
//		        pickerPosition: "bottom-right"
//		    });
//		    //高级查询结束时间
//		    $("#endTimePicker").datetimepicker({
//		    	//startDate: s,
//		    	format: "yyyy-mm-dd",
//		        //日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
//		        minView: "2",
//		        language: 'zh-CN',
//		        autoclose: true,
//		        todayBtn: true,
//		        pickerPosition: "bottom-right"
//		    });
//		    
		    
//		    $('#beginTimePicker').datetimepicker().on('show', function(ev){
//		    	$('#endTimePicker').datetimepicker("hide");
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
//		    });
//		    $('#endTimePicker').datetimepicker().on('show', function(ev){
//		    	$('#beginTimePicker').datetimepicker("hide");
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
//		    });
		    
		    laydate.render({
				elem: '#TimePicker',
				range: true,
				trigger: 'click'
			});
		    laydate.render({
		    	elem: '#callTimePicker' ,
		    	type: 'datetime',
		    	format: 'yyyy-MM-dd HH:mm:ss',
		    	trigger: 'click'
		    });
	    },

		//重置查询条件
		resetSearch: function() {
			$("#TimePicker").val("");
			vm.searchParams = {region:"",language:"",content:"",type:""};
			//查询出原来的传递参数，并逐个清空 
			var postData1 = $("#jqGrid").jqGrid("getGridParam", "postData");
			delete postData1["region"];
			delete postData1["language"];
			delete postData1["content"];
			delete postData1["type"];			
			delete postData1["callTimeBegin"];
			delete postData1["callTimeEnd"];	
			//传递新的查询参数
			$("#jq").jqGrid("setGridParam", { postData: postData1 });
		},
		//查询
		query: function () {
			vm.reload(1);
		},
		//刷新表格
		reload: function (pageNum) {
			vm.searchParams.searchType = vm.searchType;
			vm.showPage = 0;
			var timePicker = $("#TimePicker").val().split(" - ");
			beginTime=timePicker[0];
			endTime=timePicker[1];
			
			if(beginTime != "" && endTime != ""){
				if(beginTime > endTime){
					alert("起始时间应该小于截止时间");
					return;
				}
			}
			vm.searchParams.callTimeBegin=beginTime;
			vm.searchParams.callTimeEnd=endTime;
			/*if(beginTime != ""){
				vm.searchParams.callTimeBegin=beginTime;
			} else 
			if(endTime != ""){
				vm.searchParams.callTimeEnd=endTime;
			}*/
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			if(pageNum != null && pageNum != undefined){
				page = 1;
			}
			$("#jqGrid").jqGrid('setGridParam',{ 
				postData:vm.searchParams,
                page:page
            }).trigger("reloadGrid");
		},
		exportExcel: function () { 		
			
			var timePicker = $("#TimePicker").val().split(" - ");
			var beginTime=timePicker[0];
			var endTime=timePicker[1];
			vm.searchParams.callTimeBegin="";
			vm.searchParams.callTimeEnd="";
			if(beginTime != "" && endTime != ""){
				if(beginTime > endTime){
					alert("起始时间应该小于截止时间！");
					return;
				}
			}
			if(beginTime != ""){
				vm.searchParams.callTimeBegin=beginTime;
			}
			if(endTime != ""){
				vm.searchParams.callTimeEnd=endTime;
			}
			if(vm.searchParams.content != ""){
				alert("导出时通联内容不作为过滤条件！");
				return;
			}
			var url = baseURL + "gjch/call/exportExcel?callTimeBegin="+vm.searchParams.callTimeBegin+"&callTimeEnd="+vm.searchParams.callTimeEnd+"&type="+vm.searchParams.type+"&region="+vm.searchParams.region+"&language="+vm.searchParams.language;
			window.location.href = url;
		
			
		},
		//返回
        back: function() {
        	if(window.parent.vm.isEditted) {
        		confirm('页面尚未保存，您确定要离开页面吗？', function(){
        			/*if(vm.showPage==1){
        				$("#callTimePicker").datetimepicker("hide");
        			}*/
        			layer.closeAll();
        			vm.reload();
        			window.parent.vm.isEditted = false;
        		});
        	} else {
        		/*if(vm.showPage==1){
        			$("#callTimePicker").datetimepicker("hide");
        		}*/
        		layer.closeAll();
        		vm.reload();
        	}
        },
        //初始化境内外涉恐通联对象
		initGlobalCall:function(){
			this.call = {
				callId:"",               //主键ID
				region:"",               //县市（字典表）
				callTime:"",             //通话时间
				calledPlace:"",          //被叫地
				callerPlace:"",          //主叫地
				calledIdentify:"",       //被叫身份情况
				callerIdentify:"",       //主叫身份情况
				calledPhone:"",          //被叫手机号
				language:"",            //种语（字典表）
				content:"",              //联通内容
				type:"",                 //类型
				place:"",                //地属
				remark:"",               //备注
				isPlatform:"",           // 否是上平台
				createType:"",           // 建创类型（0:系统生成，1：导入）				
				userId:user.userId,      //发起人Id
				userName:user.realname,	 //发起人姓名
				deptId:user.deptId,	     //发起单位Id
				deptName:user.deptName,  //发起单位
				stareUser:"",
				stareUserIds:[],         //盯办人编号列表
				stareList:[]             //盯办列表
			};
			
//			vm.stareUserNames = "";
		},
        //新增境内外涉恐通联
        addCall: function(){        	
			$("#callForm select").bind("change",function(e){
				if(e.target.value != ""){
					window.parent.vm.isEditted = true;
				}
    			
    		});
			vm.optType = "add";			
			vm.setIsEnableEdit("0");
			vm.showPage = 1;
			vm.title = "新增境内外涉恐通联";
			vm.initGlobalCall();			
    		
		},
		//设置是否可以编辑
		setIsEnableEdit: function(flag){
			if(vm.optType == "add" || vm.optType == "update"){
				$("#callForm :input").removeAttr("disabled");
					
				
			}else if(vm.optType == "query"){
				$("#callForm :input").attr("disabled", "disabled");
				
			}
		},
		update: function (event) {
			var callId = getSelectedRow();
			if(callId == null){
				return ;
			}
			vm.showPage = 1;
            vm.title = "修改";
            
            vm.getInfo(callId);
		},
		saveOrUpdate: function (event) {
			var url = vm.call.callId == null ? "gjch/call/save" : "gjch/call/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
			    contentType: "application/json;charset=utf-8",
			    data: JSON.stringify(vm.call),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							vm.switchPage();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		//新增境内外涉恐通联-保存
	    saveCall: function (event) {
	    	console.log($("#callTimePicker").val());
	    	if(!vm.call.region){
	    		alert("请选择县市");
	    		return;
	    	}
	    	if($("#callTimePicker").val()==''){
	    		alert("请选择时间");
	    		return;
	    	}
	    	if(vm.call.callerPlace.trim() == ''){
	    		alert("请填写主叫地");
	    		return;
	    	}else if((vm.call.callerPlace.trim()).length > 20){
	    		alert("主叫地最多20个字");
	    		return;
	    	}
	    	if(vm.call.calledPlace.trim() == ''){
	    		alert("请填写被叫地");
	    		return;
	    	}else if((vm.call.calledPlace.trim()).length > 20){
	    		alert("被叫地最多20个字");
	    		return;
	    	}
	    	if(!vm.call.language){
	    		alert("请选择语种");
	    		return;
	    	}
	    	if(vm.call.calledPhone.trim() == ''){
	    		alert("请填写被叫手机号");
	    		return;
	    	}else if((vm.call.calledPhone.trim()).length > 20){
	    		alert("手机号最多20个字");
	    		return;
	    	}
	    	if(vm.call.calledIdentify.trim() == ''){
	    		alert("请填写被叫方身份情况");
	    		return;
	    	}else if((vm.call.calledIdentify.trim()).length > 500){
	    		alert("被叫方身份情况最多500个字");
	    		return;
	    	}
	    	
	    	if(vm.call.callerIdentify.trim() == ''){
	    		alert("请填写主叫方身份情况");
	    		return;
	    	}else if((vm.call.callerIdentify.trim()).length > 500){
	    		alert("主叫方身份情况最多500个字");
	    		return;
	    	}
	    	
	    	if(vm.call.content.trim() == ''){
	    		alert("请填写通联内容");
	    		return;
	    	}else if((vm.call.content.trim()).length > 500){
	    		alert("通联内容最多500个字");
	    		return;
	    	}
	    	if(!vm.call.type){
	    		alert("请选择类型");
	    		return;
	    	}
	    	if(vm.call.place.trim() == ''){
	    		alert("请填写属地");
	    		return;
	    	}else if((vm.call.place.trim()).length > 20){
	    		alert("属地最多20个字");
	    		return;
	    	}
	    	if(!vm.call.isPlatform){
	    		alert("请选择是否上平台");
	    		return;
	    	}
	    	if(vm.call.stareUser == ""){
	    		alert("请填写盯办人");
	    		return;
	    	}else if((vm.call.stareUser.trim()).length > 20){
	    		alert("盯办人最多20个字");
	    		return;
	    	}
//	    	vm.call.stareUserIds = [];
//        	if(vm.call.stareUserList && vm.call.stareUserList.length>0){
//        		var userId;
//        		for(var i=0; i<vm.call.stareUserList.length; i++){
//        			userId = vm.call.stareUserList[i].userId;
//        			for(var j=0; j<vm.selectUsers.length; j++){
//        				if(vm.selectUsers[j].deptId == userId){
//        					vm.stareUserNames = vm.stareUserNames + vm.selectUsers[j].name + ";";
//        					vm.call.stareUserIds.push(userId);
//        				}
//        			}
//        		}
//        	}

	    	vm.call.callTime = $("#callTimePicker").val();
	    	
			var url = "gjch/call/saveOrUpdate";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json;charset=utf-8",
			    data: JSON.stringify(vm.call),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							vm.switchPage();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		//境内外涉恐通联重置
		callReset:function(){
			confirm('确定要重置当前页面？', function(){
				vm.initGlobalCall();				
				window.parent.vm.isEditted = false;
				$("#callTimePicker").val("");
			});
		},
		//查看或修改境内外涉恐通联
		queryOrUpdateCallInfo: function(callId,flag){
			$.get(baseURL + "gjch/call/info/"+callId+"/51", function(r){
                vm.call = r.call;
                $("#callTimePicker").val(vm.call.callTime);
                if(flag == "0"){//查看             	
                	window.parent.vm.isEditted = false;
                	vm.optType = "query";            
                	vm.title = "境内外涉恐通联查看"; 
            	}else if(flag == "1"){//修改
            		window.parent.vm.isEditted = true;
                	vm.optType = "update";
               		vm.title = "境内外涉恐通联修改";
            	}
                vm.showPage = 1;
            	vm.setIsEnableEdit("0");
            });
		},
		//批量删除境内外涉恐通联
		deleteCallBatch: function (event) {
			var callIds = getSelectedRows();
			if(callIds == null){
				return ;
			}
			var deleteIdArray = (""+callIds).split(",");

			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "gjch/call/delete",
                    contentType: "application/json;charset=utf-8",
				    data: JSON.stringify(callIds),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								
								vm.delReload(callIds, $("#jqGrid"));
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		//根据Id删除单个境内外涉恐通联
		deleteCallById:function (callId){
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "gjch/call/delete",
		            contentType: "application/json;charset=utf-8",
				    data: '["' + callId + '"]',
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								vm.delReload([callId], $("#jqGrid"));
								
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		/**
		 * 删除刷新页
		 */
		delReload: function(ids, jqGrid){
			var gridIds = jqGrid.jqGrid('getDataIDs');
			if(ids.sort().toString() == gridIds.sort().toString() 	//删除当前页全部数据
					&& $(".ui-pg-input").val() == $("#sp_1_jqGridPager").html() 	//当前页为最后一页
					&& $("#sp_1_jqGridPager").html() != '1'){	//当期页不是第一页
				var page = jqGrid.jqGrid('getGridParam','page');
				jqGrid.jqGrid('setGridParam',{ 
	                page:page - 1
	            }).trigger("reloadGrid");
			} else {
				jqGrid.trigger("reloadGrid");
			}
		},
		del: function (event) {
			var callIds = getSelectedRows();
			if(callIds == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "gjch/call/delete",
                    contentType: "application/json",
				    data: JSON.stringify(callIds),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
//								$("#jqGrid").trigger("reloadGrid");
								vm.reload(1);
								conlose.log("===========");
							});
//							vm.reload(1);
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		/*getInfo: function(callId){
			$.get(baseURL + "gjch/call/info/"+callId, function(r){
                vm.call = r.call;
            });
		},*/
		getInfo: function(callId){
			var call = {};
			$.ajaxSettings.async = false;
			$.get(baseURL + "gjch/call/info/"+callId, function(r){
                call = r.call;
            });
			$.ajaxSettings.async = true;
			return call;
		},
		//导入
		addCallImport:function(){
			vm.initGlobalCallImport();
			vm.popCallImportLayer();
			
		},
		//初始化Excel上传
		initGlobalCallImport:function(){
			vm.callImport = {
				fileId:"",
				callId:"",
				userId:user.userId,
				name:"",
				path:"",
				delFlag:"0",
			};
		},
		//Excel增、删
		popCallImportLayer:function(){
			$("#progress-bar").css("width", 0);
			var bool = false;  //加个锁
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "导入Excel",
				area: ['550px', '190px'],
				shadeClose: false,
				content: jQuery("#callImportModal"),
				btn: ['上传','取消'],
				btn1: function (index) {
					if(bool) {
						return;
					}
					bool = true;
					var files = vm.$refs.callExcel.files;
					if(files.length < 1){
						alert("请选择上传的Excel");
						bool = false;
						return;
					}
					var formData = new FormData();  
					formData.append('files', files[0]);
					ajax = $.ajax({
						url: baseURL + 'gjch/call/importExcel',
						type: 'POST',
						dataType: 'json',
						cache: false,
						data: formData,
						xhr: function(){
			            	myXhr = $.ajaxSettings.xhr();
			            	if(myXhr.upload){
			            		myXhr.upload.addEventListener('progress',progressHandlingFunction, false);
			            	}  
			            	return myXhr; //xhr对象返回给jQuery使用  
			            },
						processData: false,
						contentType: false,
					    beforeSend: function(){
			                $("#progressBar").css('display','block');
			            },
						success: function(data){
							if(data.code=="0"){
								vm.callImport = data.file;
//								$('#clueFileUploadTable').bootstrapTable('append', vm.callImport);
								alert(data.msg);
							} else {
								alert(data.msg);
							}
							layer.close(index);
						},
			            error:function (data, status, e){   
		                	if(data.statusText == 'abort') {
		                		alert('已取消上传');
		                	} else {
		                		alert('上传Excel失败')
		                	}
		                	layer.close(index);
			            },
			            complete: function(){
			            	$("#progress-bar").css("width", 0);
			            	$("#progressBar").css('display','none');
			            	bool = false;
			            	vm.reload(1);
			            }
					});
				},
	            btn2:function () {
	            	if(ajax) {
	            		ajax.abort();
	            	}
	            },
	            end: function () {
	            	$("#callImportInput").val("");
	            	$("#progress").val("");
	            }
			});
		},
		//根据人员ID获取组织和人员树的数据
        getDeptAndUserTreeByUserId:function(users, ids){
			var tempSelectUsers = [];
	        var tempDepts = [];
			for(var i=0; i<users.length; i++){
				if(users[i].deptId.substring(0,1) == "D"){
					tempDepts.push(users[i]);
					continue;
				}
				for(var j=0; j<ids.length; j++){
					if(ids[j] == users[i].deptId){
						tempSelectUsers.push(users[i]);
					}
				}
			}
			var selectUsers = tempSelectUsers;
		    var depts = [];
			var isExist = false;
			for(var i=0; i<tempDepts.length; i++){
				for(var j=0; j<tempSelectUsers.length; j++){
					if(tempSelectUsers[j].parentId == tempDepts[i].deptId){
						if(depts.length == 0){
							depts.push(tempDepts[i]);
							selectUsers.push(tempDepts[i]);
							break;
						}
						isExist = false;
						for(var m=0; m<depts.length; m++){
							if(depts[m].deptId == tempDepts[i].deptId){
								isExist = true;
								break;
							}
						}
						if(isExist == false){
							depts.push(tempDepts[i]);
							selectUsers.push(tempDepts[i]);
						}
					}
				}
			}
			return selectUsers;
		},
	    //弹窗显示人员组织树
		showUserTree: function(flag,type){
			vm.isShowUserTreeDisable = true;
			$.get(baseURL + "qbfx/common/deptTree/" + type, function(retUsers){
				vm.isShowUserTreeDisable = false;
				if(!retUsers || retUsers.length < 1){
					alert("未查询到人员信息");
					return;
				}
				var title = "选择人员";
				if(flag == "4"){//单选（盯办人：表格）
					title = "选择盯办人";
					if(vm.call.stareUserIds && vm.call.stareUserIds.length > 0){
						var selectUsers = vm.getDeptAndUserTreeByUserId(retUsers, vm.call.stareUserIds);
						ztree = $.fn.zTree.init($("#userTree"), Setting, selectUsers);
						var node = ztree.getNodeByParam("deptId", vm.stare.userId);
						if(node != null){
							ztree.selectNode(node);
							ztree.expandAll(true);
						}
						vm.popUserTree(flag,title);
					}else{
						alert("该项中的人员为【盯办人】选项中选择的人员，请先填写【盯办人】选项");
					}
				}else if(flag == "6"){//多选（盯办人：非表格）
					if(vm.optType == "query"){
						title = "盯办人";
						if(vm.call.stareUserIds && vm.call.stareUserIds.length>0){
							var selectUsers = vm.getDeptAndUserTreeByUserId(retUsers, vm.call.stareUserIds);
							ztree = $.fn.zTree.init($("#userTree"), Setting, selectUsers);
							ztree.expandAll(true);
						}else{
							return;
						}
					}else{
						title = "选择盯办人";
						ztree = $.fn.zTree.init($("#userTree"), checkboxSetting, retUsers);
						ztree.checkAllNodes(false);
						if(vm.call.stareUserIds && vm.call.stareUserIds.length>0){
							for(var i=0; i<vm.call.stareUserIds.length; i++){
								var node = ztree.getNodeByParam("deptId", vm.call.stareUserIds[i]);
								ztree.checkNode(node,true);
							}
							ztree.expandAll(true);
						}
					}
					vm.popUserTree(flag,title);
				}
			});
	    },
	    popUserTree:function(flag,title){
	    	if(vm.optType == "query"){
	    		layer.open({
	                type: 1,
	                offset: '50px',
	                skin: 'layui-layer-molv',
	                title: title,
	                area: ['350px', '460px'],
	                shadeClose: false,
	                content: jQuery("#userLayer"),
	                btn: ['关闭']
	    		});
	    	}else{
	    		layer.open({
	                type: 1,
	                offset: '50px',
	                skin: 'layui-layer-molv',
	                title: title,
	                area: ['350px', '460px'],
	                shadeClose: false,
	                content: jQuery("#userLayer"),
	                btn: ['确定', '取消'],
	                btn1: function (index) {
	                    if(flag == "4"){//单选（盯办人）
	                		var nodes = ztree.getSelectedNodes();
	                		if(nodes.length < 1){
	                			alert("请选择盯办人");
	                			return;
	                		}
	                		var node = nodes[0].children;
	                		if(node && node.length > 0){
	                			alert("请选择人员，不能选择组织名称");
	                			return;
	                		}
	                        vm.stare.username = nodes[0].name;//盯办人
	                        vm.stare.userId = nodes[0].deptId; //盯办人id
	                	
	                    }else if(flag == "6"){//多选（盯办人）
	                		vm.call.stareUserIds=[];
	            			vm.stareUserNames = "";
	                		var nodes = ztree.getCheckedNodes();
	                		if(nodes && nodes.length>0){
	                			for(var i=0; i<nodes.length; i++){
	                				if(nodes[i].deptId.substring(0,1) == "D"){
	                					continue;
	                				}
	                				vm.stareUserNames = vm.stareUserNames + nodes[i].name + ";";
	                				vm.call.stareUserIds.push(nodes[i].deptId);
	                			}
	                			window.parent.vm.isEditted = true;
	                		}
	                	}
	                       
	                    layer.close(index);
	                }
	            });
	    	}
	    },
	    /******** 父页面调用 B ********/
		resize: function(){
			$(window).resize();
		},
		/******** 父页面调用 E ********/
	},	
	created: function () {
		this.loadingDict();
		
		//页面参数
		var params = self.frameElement.getAttribute('params');
		//点击菜单列表进入 ，防止表格加载时 展示区域未定义
		if(params == 'undefined' || params == 'null'){
			this.showPage = 0;
		}
	},
	mounted: function () {
		this.initPage();
	}
});
function progressHandlingFunction(e) {
	if (e.lengthComputable) {
		var percent = e.loaded / e.total;
        $("#progress-bar").css("width", (percent * 500));
	} 
}