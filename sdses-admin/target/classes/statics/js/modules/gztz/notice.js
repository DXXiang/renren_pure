var ajax; //ajax对象
//操作类型:0查看 1修改 2新增
var operation="";
$(function () {
	initPage();
});
/**
 * 初始化页面 加载 bootstraptable 
 * @returns
 */
function initPage(){
	//附件
    if(vm.notice.fileList && vm.notice.fileList.length>0){
		$('#noticeFileTable').bootstrapTable('append', vm.notice.fileList);
	}
    //反馈内容
    if(vm.notice.feedbackList && vm.notice.feedbackList.length>0){
		$('#feedbackTable').bootstrapTable('append', vm.notice.feedbackList);
	}
	if(vm.operationType == 'V'){
        //隐藏复选框列
		$('#noticeFileTable').bootstrapTable('hideColumn', 'checkBox');
		$('#feedbackTable').bootstrapTable('hideColumn', 'checkBox');
	}
}

/*************** bootstrap操作按钮 ***************/
//附件上传 操作列
function  noticeFileUploadFormatter (value, row){
	if(operation=="0")
		return '<a style="cursor: pointer" title="详情" onclick="vm.checkNoticeFileUploadById('+row.fileId+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
	else
		return '<a style="cursor: pointer" title="详情" onclick="vm.checkNoticeFileUploadById('+row.fileId+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>'+'<a style="cursor: pointer" title="删除" onclick="vm.delFile('+row.fileId+')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
}
//反馈内容 操作列
function feedbackFormatter(value, row){
	return '<a onclick="vm.viewFeedbackDetail('+row.feedbackId+')" style="cursor: pointer" title="详情"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
	/*if(operation=="0")
		return '<a onclick="vm.viewFeedbackDetail('+row.feedbackId+')" style="cursor: pointer" title="详情"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
	else 			 		
	    return '<a style="cursor: pointer" title="修改" onclick="vm.editFeedback(\''+row.feedbackId+'\')" ><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>'+'<a style="cursor: pointer" title="删除" onclick="vm.delFeedback(\''+row.feedbackId+'\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
	 */
	}
/*************** bootstrap操作按钮 ***************/

//用户信息
var user = window.parent.vm.user;
//组织树
var ztree;
//机构组织树配置
var Setting = {
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
	noticeback: { 
	 	onClick: function (e, treeId, treeNode, clickFlag) { 
	 		ztree.checkNode(treeNode, !treeNode.checked, true); 
	 	} 
	},
	view: {
		nameIsHTML: true
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
	noticeback: { 
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
		titleSecond: null,
		optType : "add",
		searchType:'1', //查询类型 【 0：全文检索；1：高级查询】	
		changeSearchButtonText: "高级查询", //切换按钮文字展示
		searchParams: {title:"",info:""}, //查询条件
		isFeedbackDictList:[		//活跃指数
			{code:0, value: '不反馈'},
			{code:1, value: '反馈'}], //是否反馈列表		
		notice: {},
		feedback:{},
		isShowUserTreeDisable : false,
		showButtonFeedback: false,		//反馈
		showButtonReset: false,		    //重置
		showNoticePanel : true,
		noticeDate: "",
		

	},
	methods: {
		/*********************************** 多窗口操作 B ***********************************/
		/**
		 * 初始化页面
		 */
		initPage: function(){
			this.dateDefind();
			/*$("body").click(function(e){
		    	//e.stopImmediatePropagation();
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
					this.showButtonFeedback = false;
					this.optType = "add";			
					this.showPage = 1;
					this.title = "新增工作通知";
					this.showNoticePanel = true;
					this.showButtonReset = true;
					this.initGlobalNotice();		
				} else {
					var paramArr = params.split('-');
					var noticeId = paramArr[1];
					this.showNoticePanel = true;
					this.showButtonFeedback = false;
					$("#noticeFileTable").bootstrapTable('removeAll');
					$("#feedbackTable").bootstrapTable('removeAll');
					
					if(paramArr[0] == 'V'){//查看             	     	
	                	this.optType = "query";            
	                	this.title = "工作通知查看"; 
	                	$("#noticeFileTable").bootstrapTable('hideColumn', 'checkBox');
	               		$("#feedbackTable").bootstrapTable('hideColumn', 'checkBox');
	               		operation="0";
	               		$("#noticeForm :input:not(.userTree)").attr("disabled", "disabled");
					} else if(paramArr[0] == 'U'){//修改
						this.optType = "update";
						this.title = "工作通知修改";
	               		operation="1";
	            	} else if(paramArr[0] == 'FEEDBACK'){//反馈
	            		this.optType = "feedback";
	    				//反馈
	            		this.showNoticePanel = true;
	            		this.showButtonFeedback = true;
	            		this.titleSecond = "工作通知反馈";
	    				$("#noticeFileTable").bootstrapTable('hideColumn', 'checkBox');
	               		$("#feedbackTable").bootstrapTable('hideColumn', 'checkBox');
	                	operation="0";
	                	$("#noticeForm :input:not(.userTree)").attr("disabled", "disabled");
	                	this.title = "工作通知查看";
	    				$("#feedbackPanel").hide();
	    				$('#feedbackInfoPanel').show();
	            	}
					
					$.get(baseURL + "gztz/notice/info/"+noticeId+"/51", function(r){
		                vm.notice = r.notice;
		                $("#noticeTimePicker").val(vm.notice.noticeDate);
		                //发起人
		                if(vm.notice.userList != null && vm.notice.userList.length>0){
		        			var userIds = [];
		        			var nodeNames = '';
		        			for (var index in vm.notice.userList) {
		        				userIds.push(vm.notice.userList[index].userId);
		        				nodeNames += vm.notice.userList[index].userName + ";";
		        			}
		        			vm.notice.userNames = nodeNames;
		        			vm.notice.userIds = userIds;
		        		}
		                //接收人 
		        		if(vm.notice.receiveUserList != null && vm.notice.receiveUserList.length>0){
		        			var receiveUserIds = [];
		        			var nodeNames = '';
		        			for (var index in vm.notice.receiveUserList) {
		        				receiveUserIds.push(vm.notice.receiveUserList[index].userId);
		        				nodeNames += vm.notice.receiveUserList[index].userName + ";";
		        			}
		        			vm.notice.receiveUserNames = nodeNames;
		        			vm.notice.receiveUserIds = receiveUserIds;
		        		}
		        		if(paramArr[0] == 'V'){//查看             	     	
		                	vm.optType = "query";            
		                	vm.title = "工作通知查看"; 
		                	$("#noticeFileTable").bootstrapTable('hideColumn', 'checkBox');
		               		$("#feedbackTable").bootstrapTable('hideColumn', 'checkBox');
		                	operation="0";
		                	vm.setIsEnableEdit();
		                	if(vm.notice.noticeUser.userType != 4){
		                		//当前用户 不只是 接收人，
		                		$("#feedbackPanel").show();
		                	} else {
		                		//当前用户 只是接收人，不显示反馈列表
		                		
		                		for(var index in vm.notice.feedbackList){
		                			if(vm.notice.feedbackList[index].userId == vm.notice.noticeUser.userId){
		                				vm.feedback = vm.notice.feedbackList[index];
		                				break;
		                			}
		                		}
		                		if(JSON.stringify(vm.feedback) != "{}"){
		                			vm.titleSecond = "工作通知反馈";
		                			$("#feedbackInfoPanel").show();
		                			$("#feedbackInfoPanel textarea").attr("disabled","disabled");
		                		}
		                	}
		        		} else if(paramArr[0] == 'U'){//修改
		                	vm.optType = "update";
		               		vm.title = "工作通知修改";
		               		operation="1";
		               		vm.notice.deleteFeedbackIds = [];
		            	} else if(paramArr[0] == 'FEEDBACK'){//反馈
		            		vm.optType = "feedback";
		    				//反馈
		    				vm.showNoticePanel = true;
		    				vm.showButtonFeedback = true;
		    				vm.titleSecond = "工作通知反馈";
		    				$("#noticeFileTable").bootstrapTable('hideColumn', 'checkBox');
		               		$("#feedbackTable").bootstrapTable('hideColumn', 'checkBox');
		                	operation="0";
		                	vm.setIsEnableEdit();
		    				vm.feedback = {
		    					noticeId: noticeId,
		    					userId: user.userId,
		    					userName: user.realname,
		    					createTime: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
		    					content: ''
		    				}
		    				vm.title = "工作通知查看";
		    				$("#feedbackPanel").hide();
		    				$('#feedbackInfoPanel').show();
		            	}
		                //附件
		                if(vm.notice.fileList && vm.notice.fileList.length>0){
		            		$('#noticeFileTable').bootstrapTable('append', vm.notice.fileList);
		            	}
		                //反馈内容
		                if(vm.notice.feedbackList && vm.notice.feedbackList.length>0){
		            		$('#feedbackTable').bootstrapTable('append', vm.notice.feedbackList);
		            	}
		                vm.showPage = 1;
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
				var noticeId = type_id.split('-')[1];
				var noticeId = vm.getInfo(noticeId);
	            if(noticeId.delFlag != 0){
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
			/*var dictListMap = window.parent.vm.dictListMap;
			this.isFeedbackDictList = dictListMap.get('isFeedback');*/
		},
		/**
		 * 加载表格
		 */
		loadingTable: function(){
			$("#jqGrid").jqGrid({
		        url: baseURL + 'gztz/notice/list/68',
		        datatype: "json",
		        colModel: [
		                { label: '序号', hidden: true, name: 'noticeId', index: 'NOTICE_ID', key: true },	  
			            { label: '标题', name: 'title', index: 'TITLE', width: 120, formatter:function(value, grid, row){
		       				var str = '<a style="cursor: pointer" onclick="vm.jumpPage(\'V-'+ row.noticeId +'\')">'+ value +'</a>';
		       				return str;
		       			}},						
		    			{ label: '内容', sortable: false, name: 'info', index: 'INFO', width: 200}, 
		    			{ label: '通知时间', align: 'center', name: 'noticeDate', index: 'NOTICE_DATE', width: 80, formatter:"date",formatoptions: {srcformat:'Y-m-d H:i:s',newformat:'Y-m-d H:i'}}, 			
		    			{ label: '状态', align: 'center', name: '', sortable:false, index: '', width: 80 , formatter: function(value, options, row){
		    				/*$.ajaxSettings.async = false;
		    				$.get(baseURL + "gztz/notice/getStatus/"+ row.noticeId,{id: row.id,userType: row.userType}, function(r){
		    	                vm.status = r.status;
		    	            });
		    				$.ajaxSettings.async = true;	 
		    		        	return vm.status;*/
		    				//创建人、发起人 可以看 已签收人数/未签收人数
		    				/*if(row.userType & 1 == 1 || row.userType & 2 == 2){
		    					return row.numReceived + "/"row.numAll
		    				} 
		    				//接收人 只能看 未签收、已签收、已反馈
		    				else if (row.userType & 4 == 4){
		    					
		    				} 
		    				//通过部门权限查看的
		    				else if (){
		    					
		    				}*/
		    				
		    				//只是接收人 只能看 未签收、已签收、已反馈
		    				if(row.userType == 4){
		    					if(row.isReceived == '0'){
		    						return "未签收";
		    					} else if (row.feedback == '0'){
		    						return  "已签收";
		    					} else {
		    						return row.feedback;
		    					}
		    				} else {
		    					//如果 用户类型包含 接收人，先判断是否签收
		    					if((row.userType & 4) == 4 && row.isReceived == '0'){
		    						return "未签收";
		    					} else {
				       				var numReceived = '<span style="color: red">'+ row.numReceived +'</span>';

		    						return numReceived + "/" + row.numAll;
		    					}
		    				}
		    			}},
		    			{ label: '操作', sortable: false,align: 'center', name: '', index: '', width: 90 , formatter: function(value, grid, row){
		    				var str = "";
		    				str += '<a style="cursor: pointer" title="查看" onclick="vm.jumpPage(\'V-'+ row.noticeId +'\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
		    				//创建人
		    				if((row.userType & 1) == 1){
		    					str += '<a style="cursor: pointer" title="修改" onclick="vm.jumpPage(\'U-'+ row.noticeId +'\')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
		    					str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteNoticeById('+ row.noticeId +',0)"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
		    				}
		    				if((row.userType & 4) == 4 && row.isReceived == '0'){
			    				str += '<a style="cursor: pointer" title="签收" onclick="vm.receive('+ row.noticeId +')"><span class="glyphicon glyphicon-import" aria-hidden="true"></span></a>';
		    				}
			    			if(row.isFeedback==1 && row.isReceived == '1' && row.feedback== 0){
								str += '<a style="cursor: pointer" title="反馈" onclick="vm.jumpPage(\'FEEDBACK-'+ row.noticeId + '\')"><span class="glyphicon glyphicon-send" aria-hidden="true"></span></a>';
			    			}
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
		   
		    var newDate = new Date();
		    var t = newDate.toJSON();
		    
		    laydate.render({
				elem: '#TimePicker',
				range: true,
				//closeStop: '#TimePicker' //这里代表的意思是：点击 test1 所在元素阻止关闭事件冒泡。如果不设定，则无法弹出控件
				trigger: 'click'
			});
		    laydate.render({
		    	elem: '#noticeTimePicker' ,
		    	type: 'datetime',
		    	format: 'yyyy-MM-dd HH:mm',
		    	//closeStop: '#noticeTimePicker'
	    		trigger: 'click'
		    });
		    //通知时间
//		    $("#noticeTimePicker").datetimepicker({	
//		    	startDate:new Date(t),
//		        format: "yyyy-mm-dd hh:ii",
//		        weekStart:1,
//		        todayHighlight:1,
//		        startView:2,
//		        forceParse:0,
//		        showMeridian:1,
//		        minuteStep: 5,
//			    language: 'zh-CN',
//			    autoclose: true,
//			    todayBtn: true
//		    });
		    
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
//		    
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
		    
//		    $('#noticeTimePicker').datetimepicker().on('show', function(ev){
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
//		    });  
//		    $('#beginTimePicker').datetimepicker().on('show', function(ev){
//		    	$('#endTimePicker').datetimepicker("hide");
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
//		    });
//		    $('#endTimePicker').datetimepicker().on('show', function(ev){
//		    	$('#beginTimePicker').datetimepicker("hide");
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
//		    });
	    },

		//重置查询条件
		resetSearch: function() {
			$("#TimePicker").val("");

			vm.searchParams = {title:"",info:""};
			//查询出原来的传递参数，并逐个清空 
			var postData1 = $("#jqGrid").jqGrid("getGridParam", "postData");
			delete postData1["title"];
			delete postData1["info"];				
			delete postData1["noticeTimeBegin"];				
			delete postData1["noticeTimeEnd"];				
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
			var beginTime=timePicker[0];
			var endTime=timePicker[1];
			if(beginTime != "" && endTime != ""){
				if(beginTime > endTime){
					alert("起始时间应该小于截止时间");
					return;
				}
			}
			if(beginTime != ""){
				vm.searchParams.noticeTimeBegin=beginTime;
			}
			if(endTime != ""){
				vm.searchParams.noticeTimeEnd=endTime;
			}
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			if(pageNum != null && pageNum != undefined){
				page = 1;
			}
			$("#jqGrid").jqGrid('setGridParam',{ 
				postData:vm.searchParams,
                page:page
            }).trigger("reloadGrid");
		},
		
		//返回
        back: function() {
        	if(window.parent.vm.isEditted) {
        		confirm('页面尚未保存，您确定要离开页面吗？', function(){
        			//清空ckeditor数据
        			/*if(vm.showPage==1){
        				$("#noticeTimePicker").datetimepicker("hide");
        			}*/
        			layer.closeAll();
        			vm.reload();
        			window.parent.vm.isEditted = false;
        		});
        	} else {
        		/*if(vm.showPage==1){
        			$("#noticeTimePicker").datetimepicker("hide");
        		}*/
        		layer.closeAll();
        		vm.reload();
        	}
        },
        //初始化工作通知对象
		initGlobalNotice:function(){
			this.notice = {
				noticeId: null,             //主键ID
				title:"",                //标题
				info:"",                 //内容
				noticeDate:"",
				isFeedback:"",           //是否反馈				
				numReceived:"",          //签收人数
				numFeedback:"",          //反馈人数
				numAll:"",               //总人数
				userId:user.userId,      //创建人ID
				userName:user.realname,  //创建人姓名
				deptId:user.deptId,      //所属部门ID
				deptName:user.deptName,  //所属部门名称
				createTime:"",           //创建时间
				delFlag:"",              //删除标准
			    receiveUserNames:"",     //接收人列表
			    receiveUserIds: [],      //接收人ID
			    userNames:"",            //发起人列表
			    userIds: [],             //发起人ID
			    feedbackList:[],         //反馈内容列表
			    userIds : [user.userId], // 发起人Id
				userNames : user.realname, // 发起人
			};
			
		},
		//清理数据
		clearPage:function(){
			vm.notice = {},
			
			$("#noticeFileTable").bootstrapTable('removeAll');
			$("#feedbackTable").bootstrapTable('removeAll');
					
			
			$(".disabledAll").attr("disabled","disabled");
			
			vm.showButtonFeedback= false,		//反馈
		    vm.showButtonReset= false,	     //重置
			
			vm.noticeDate = '',			//发起时间
						
			vm.showNoticePanel = true;
			vm.titleSecond = null;
		},
        //新增工作通知
        addNotice: function(){   
        	vm.clearPage();
        	vm.showButtonFeedback = false;
			$("#noticeForm select").bind("change",function(e){
				if(e.target.value != ""){
					window.parent.vm.isEditted = true;
				}
    			
    		});
			window.parent.vm.isEditted = true;
			vm.optType = "add";			
			operation="2";
			vm.setIsEnableEdit("0");
			vm.showPage = 1;
			vm.title = "新增工作通知";
			vm.showNoticePanel = true;
			vm.showButtonReset = true;
			vm.initGlobalNotice();			
		},
		//设置是否可以编辑
		setIsEnableEdit:function(flag){
			if(vm.optType == "add" || vm.optType == "update"){
				$("#noticeForm :input").removeAttr("disabled");
			}else if(vm.optType == "query" || vm.optType == "feedback"){
				$("#noticeForm :input:not(.userTree)").attr("disabled", "disabled");
			}
		},
		saveOrUpdate: function (event) {
			var url = vm.notice.noticeId == null ? "gztz/notice/save" : "gztz/notice/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
			    contentType: "application/json;charset=utf-8",
			    data: JSON.stringify(vm.notice),
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
		//新增工作通知-保存
	    saveOrUpdateNotice: function (event) {
//	    	vm.notice.intro = CKEDITOR.instances.noticeIntroEditor.getData();
	    	if(vm.notice.title.trim() == ''){
	    		alert("请填标题");
	    		return;
	    	}else if((vm.notice.title.trim()).length > 50){
	    		alert("标题最多50个字");
	    		return;
	    	}
	    	if(vm.notice.info.trim() == ''){
	    		alert("请填写内容");
	    		return;
	    	}else if((vm.notice.info.trim()).length > 1000){
	    		alert("内容最多1000个字");
	    		return;
	    	}
	    	if (vm.notice.receiveUserIds.length == 0) {
				alert("请选择接收人");
				return;
			}
	    	if (vm.notice.userIds.length == 0) {
				alert("请选择发起人");
				return;
			}
	    	vm.notice.noticeDate = $("#noticeTimePicker").val();
	    	if(vm.notice.noticeDate.trim() == ''){
	    		alert("请选择通知时间");
	    		return;
	    	}
	    	if(vm.notice.isFeedback != 0 && vm.notice.isFeedback != 1){
	    		alert("请选择是否反馈");
	    		return;
	    	}
	    	//【表格数据】附件
			vm.notice.fileList = $("#noticeFileTable").bootstrapTable('getData');

	    	//【表格数据】反馈内容
			var feedbackList = $("#feedbackTable").bootstrapTable('getData');
//			var feedbackListUpdate = [];
//			
//			for (var index in feedbackList) {
//				console.log(feedbackList[index].feedbackId);
//				//新增
//    			if(feedbackList[index].feedbackId.toString().startsWith('T')){
//    				feedbackList[index].feedbackId = null;
//    				feedbackListUpdate.push(feedbackList[index]);
//    				
//    			} 
//    			//修改
//    			else if(feedbackList[index].hasOwnProperty("isUpdate")) {
//    				feedbackListUpdate.push(feedbackList[index]);
//    				
//    			}
//			}
			
//			vm.notice.feedbackList = feedbackListUpdate;
			vm.notice.feedbackList = feedbackList
			var url = vm.notice.noticeId == null ? "gztz/notice/save" : "gztz/notice/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json;charset=utf-8",
			    data: JSON.stringify(vm.notice),
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
		//工作通知重置
		noticeReset:function(){
			confirm('确定要重置当前页面？', function(){
				vm.initGlobalNotice();				
				window.parent.vm.isEditted = false;
				$("#noticeTimePicker").val("");
				$("#noticeFileTable").bootstrapTable('removeAll');
			});
		},
		//查看或修改境内外涉恐通联
		queryOrUpdateNoticeInfo: function(noticeId,flag){
			vm.clearPage();
			vm.showNoticePanel = true;
			vm.showButtonFeedback = false;
			$("#feedbackPanel").css('display','block');
			$("#noticeFileTable").bootstrapTable('removeAll');
			$("#feedbackTable").bootstrapTable('removeAll');
			$.get(baseURL + "gztz/notice/info/"+noticeId+"/51", function(r){
                vm.notice = r.notice;
//              CKEDITOR.instances.noticeIntroEditor.setData(vm.notice.intro);
                //初始化附件
//    			$("#noticeFileTable").bootstrapTable('append', vm.notice.fileList);
                $("#noticeTimePicker").val(vm.notice.noticeDate);
                //发起人
                if(vm.notice.userList != null && vm.notice.userList.length>0){
        			var userIds = [];
        			var nodeNames = '';
        			for (var index in vm.notice.userList) {
        				//console.log(vm.notice.userList[index].userId);
        				userIds.push(vm.notice.userList[index].userId);
        				nodeNames += vm.notice.userList[index].userName + ";";
        				//console.log(vm.notice.userList[index].userName);
        			}
        			vm.notice.userNames = nodeNames;
        		
        			vm.notice.userIds = userIds;
        		}
                //接收人 
        		if(vm.notice.receiveUserList != null && vm.notice.receiveUserList.length>0){
        			var receiveUserIds = [];
        			var nodeNames = '';
        			for (var index in vm.notice.receiveUserList) {
        				//console.log(vm.notice.receiveUserList[index].userId);
        				receiveUserIds.push(vm.notice.receiveUserList[index].userId);
        				nodeNames += vm.notice.receiveUserList[index].userName + ";";
        				//console.log(vm.notice.receiveUserList[index].userName);
        			}
        			vm.notice.receiveUserNames = nodeNames;
        			vm.notice.receiveUserIds = receiveUserIds;
        		}
                //console.log(JSON.stringify(vm.notice.fileList));
                if(flag == "0"){//查看             	
                	window.parent.vm.isEditted = false;
                	vm.optType = "query";            
                	vm.title = "工作通知查看"; 
                	$("#noticeFileTable").bootstrapTable('hideColumn', 'checkBox');
               		$("#feedbackTable").bootstrapTable('hideColumn', 'checkBox');
                	operation="0";
            	}else if(flag == "1"){//修改
            		window.parent.vm.isEditted = true;
                	vm.optType = "update";
               		vm.title = "工作通知修改";
               		operation="1";
               		vm.notice.deleteFeedbackIds = [];
            	}
                //附件
                if(vm.notice.fileList && vm.notice.fileList.length>0){
            		$('#noticeFileTable').bootstrapTable('append', vm.notice.fileList);
            	}
                //反馈内容
                if(vm.notice.feedbackList && vm.notice.feedbackList.length>0){
            		$('#feedbackTable').bootstrapTable('append', vm.notice.feedbackList);
            	}
                vm.showPage = 1;
            	vm.setIsEnableEdit("0");
            });
		},
		//批量删除
		deleteNoticeBatch: function (event) {
			var noticeIds = getSelectedRows();
			if(noticeIds == null){
				return ;
			}
			var deleteIdArray = (""+noticeIds).split(",");

			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "gztz/notice/delete",
                    contentType: "application/json;charset=utf-8",
				    data: JSON.stringify(noticeIds),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								/*var gridIds = $("#jqGrid").jqGrid('getDataIDs');
								if(JSON.stringify(noticeIds) == JSON.stringify(gridIds) 	//删除当前页全部数据
										&& $(".ui-pg-input").val() == $("#sp_1_jqGridPager").html() 	//当前页为最后一页
										&& $("#sp_1_jqGridPager").html() != '1'){	//当期页不是第一页
									var page = $("#jqGrid").jqGrid('getGridParam','page');
									$("#jqGrid").jqGrid('setGridParam',{ 
										postData:vm.searchParams,
						                page:page - 1
						            }).trigger("reloadGrid");
								} else {
									$("#jqGrid").trigger("reloadGrid");
								}*/
								vm.delReload(noticeIds, $("#jqGrid"));
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
		
		//根据Id删除单个境内外涉恐通联
		deleteNoticeById:function (noticeId){
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "gztz/notice/delete",
		            contentType: "application/json;charset=utf-8",
				    data: '["' + noticeId + '"]',
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								//$("#jqGrid").trigger("reloadGrid");
								vm.delReload([noticeId], $("#jqGrid"));
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		//签收
		receive:function (noticeId){
			var notice = vm.getInfo(noticeId);
            if(notice.delFlag != 0){
				alert('数据已被删除，无法操作！');
				vm.reload(1);
				return;
			}
			confirmText = '确定要签收该记录？';
			alertText = '工作通知签收成功！';
			confirm(confirmText, function(){
				$.get(baseURL + "gztz/notice/receive/"+noticeId, function(r){
			        if(r.code == 0) {
			        	alert(alertText);
			        	$("#jqGrid").trigger("reloadGrid");
			        } else {
			        	alert(r.msg);
			        }
			    });
			});
		},
		//查询已签收人数
		getReceivedCount:function (noticeId){
			$.get(baseURL + "gztz/notice/getReceivedCount/"+noticeId, function(r){
                vm.notice = r.notice;
            });
		},
		//查询总人数
		getSumCount:function (noticeId){
			$.get(baseURL + "gztz/notice/getSumCount/"+noticeId, function(r){
                vm.notice = r.notice;
            });
		},
		del: function (event) {
			var noticeIds = getSelectedRows();
			if(noticeIds == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "gztz/notice/delete",
				    contentType: "application/json;charset=utf-8",
				    data: JSON.stringify(noticeIds),
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
		/*getInfo: function(noticeId){
			$.get(baseURL + "gztz/notice/info/"+noticeId, function(r){
                vm.notice = r.notice;
            });
		},*/
		getInfo: function(noticeId){
			var notice = {};
			$.ajaxSettings.async = false;
			$.get(baseURL + "gztz/notice/info/"+noticeId, function(r){
				notice = r.notice;
            });
			$.ajaxSettings.async = true;
			return notice;
		},
		/**
		 * showPage 0：列表；1：新增
		 * detailOrEdit  0:detail;1:edit
		 */
		changePage: function(showPage, detailOrEdit){
			if(showPage == 0) {
				window.parent.vm.isEditted = false;
			} else if (showPage == 1 || showPage == 2){
				if(detailOrEdit == 1){
					window.parent.vm.isEditted = true;
				}
			} else {
				window.parent.vm.isEditted = true;
			}
			layer.closeAll();
			vm.showPage = showPage;
			
			//$('.timePicker').datetimepicker('hide');
		},
		/******************* 反馈内容 B *******************/
		
		feedbackPage: function(noticeId,isReceived){
			if(isReceived==0){
				alert("请先签收工作通知");
				return;
			}else{
				$('#feedbackInfoPanel').show();
				//跳转到明细页面
				vm.queryOrUpdateNoticeInfo(noticeId,0);
				//反馈
				vm.showButtonFeedback = true;
				
				vm.showNoticePanel = false;
				vm.titleSecond = "反馈内容";
				console.log(noticeId);
				vm.feedback = {
					noticeId: noticeId,
					userId: user.userId,
					userName: user.realname,
					createTime: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
					content: ''
				}
				$("#feedbackInfoPanel textarea").removeAttr("disabled");
			}
 			
		},
		/**
		 * 核查处理（点击底部“核查”按钮触发）
		 * @param type 页面跳转类型，-1：不跳转；其他：跳转到查询界面
		 * @returns
		 */
		feedbackHandler: function(type){
			if(vm.feedback.content.trim().length <= 0){
				alert("请填写反馈内容");
				return;
			}else if((vm.feedback.content.trim()).length > 500){
	    		alert("反馈内容最多500个字");
	    		return;
	    	}
			console.log(JSON.stringify(vm.feedback));
			$.ajax({
				type: "POST",
			    url: baseURL + "gztz/notice/saveFeedback",
			    data: JSON.stringify(vm.feedback),
			    contentType: "application/json;charset=utf-8",
			    success: function(result){
					if(result.code == 0){
						layer.alert('反馈成功', function(index){
							vm.switchPage();
							/*//清空页面数据
							if(type == -1){	//明细页面
								vm.showFeedbackTable = true;
								$("#feedbackInfoPanel").bootstrapTable('append', result.feedback);
								window.parent.vm.isEditted = false;
							} else {	//查询页面
								vm.changePage(0);
								vm.reload();
								$('.footerPanel').hide();
							}*/
						});
					}else{
						layer.alert(result.msg, function(index){
							vm.reload();
							$('.footerPanel').hide();
							
						});
					}
				}
			});
		},
		addFeedback: function(){
			//预制数据
			vm.feedback = {};
			//需要更新数据库
			vm.feedback = {createTime: (new Date()).Format("yyyy-MM-dd hh:mm:ss"), userName:user.realname, isUpdate: true};
			$('#feedbackLayer input').attr("disabled","disabled");
			$('#feedbackLayer textarea').removeAttr("disabled");
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "反馈内容新增",
				area: ['700px', '330px'],
				shadeClose: false,
				content: jQuery("#feedbackLayer"),
				btn: ['确认','取消'],
				btn1: function (index) {
					if(!vm.feedback.hasOwnProperty("content") || vm.feedback.content == ''){
						alert("请填写内容");
						return;
					}
					layer.close(index);
					vm.feedback.feedbackId = "T" + new Date().getTime();
					
					$("#feedbackTable").bootstrapTable('append', vm.feedback);
					vm.feedback = {};
				},
				btn2: function (index) {
					//清空数据
					vm.feedback = {};
				}
			});
		},
		editFeedback: function(feedbackId){
			vm.feedback = JSON.parse(JSON.stringify($("#feedbackTable").bootstrapTable('getRowByUniqueId', feedbackId)));
			//需要更新数据库
			vm.feedback.isUpdate = true;
			$('#feedbackLayer textarea').removeAttr("disabled");
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "案件日志修改",
				area: ['780px', '330px'],
				shadeClose: false,
				content: jQuery("#feedbackLayer"),
				btn: ['确认','取消'],
				btn1: function (index) {
					layer.close(index);
					$("#feedbackTable").bootstrapTable('updateByUniqueId', {id: vm.feedback.feedbackId, row: vm.feedback});
					vm.feedback = {};
				},
				btn2: function (index) {
					//清空数据
					vm.feedback = {};
				}
			});
		},

		delFeedback: function(feedbackId){
			confirm('确定要删除该记录？', function(){
				$("#feedbackTable").bootstrapTable('removeByUniqueId', feedbackId);
				//数据库已有数据，删除需要插入到 deleteFeedbackIds 属性中
				if(!feedbackId.toString().startsWith('T')){
					vm.notice.deleteFeedbackIds.push(feedback);			
				}
				alert("删除成功！");
			});
		},
		delBatchFeedback:function(){
			var selects = $('#feedbackTable').bootstrapTable('getSelections');
			if(selects.length < 1){
				alert("请至少选择一条记录");
				return;
			}
			confirm('确定要删除选中的案件日志？', function(){
				var feedbackIds = [];
				for(var i=0; i<selects.length; i++){
					feedbackIds.push(selects[i].feedbackId);
					if(!selects[i].feedbackId.toString().startsWith('T'))
					  vm.notice.deleteFeedbackIds.push(selects[i].feedbackId);
				}		
				$('#feedbackTable').bootstrapTable('remove', {field: 'feedbackId', values: feedbackIds}); 			
				alert("删除成功");
			});
		},
		viewFeedbackDetail: function(feedbackId){
			vm.feedback = $("#feedbackTable").bootstrapTable('getRowByUniqueId', feedbackId);
			$('#feedbackLayer input,#feedbackLayer textarea').attr("disabled","disabled");
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "反馈内容查看",
				area: ['580px', '340px'],
				shadeClose: false,
				content: jQuery("#feedbackLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
					//清空数据
					vm.feedback = {};
				}
			});
		},
		/******************* 反馈内容 E *******************/
		
		/******************* 附件 B *******************/
		//打开文件上传页面
		uploadFilePage: function(){
			$("#progress-bar").css("width", 0);
			var bool = false;  //加个锁
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "附件上传",
				area: ['550px', '200px'],
				shadeClose: false,
				content: jQuery("#fileLayer"),
				btn: ['上传','取消'],
				btn1: function (index) {
					if(bool) {
						return;
					}
					bool = true;
					var files = vm.$refs.noticefile.files;
					if(files.length < 1){
						alert("请选择上传的文件");
						bool = false;
						return;
					}
					var date = new Date();
					
					var formData = new FormData();  
					formData.append('files', files[0]);
					ajax = $.ajax({
						url: baseURL + 'common/comfile/uploadFile/5',
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
			            		$('#noticeFileTable').bootstrapTable('append', data.file);			            						            		
			            	} else {
			            		alert(data.msg);
			            	}
			            	layer.close(index);
			            },
			            error:function (data, status, e){   
		                	if(data.statusText == 'abort') {
		                		alert('已取消上传');
		                	} else {
		                		alert('上传文件失败')
		                	}
		                	layer.close(index);
			            },
			            complete: function(){
			            	$("#progress-bar").css("width", 0);
			            	$("#progressBar").css('display','none');
			            	bool = false;
			            }
			        });
	            },
	            btn2:function () {
	            	if(ajax) {
	            		ajax.abort();
	            	}
	            },
	            end: function () {
	            	$("#noticeFileUploadInput").val("");
	            	$("#progress").val("");
	            }
			});
		},
		checkNoticeFileUploadById : function(fileId){
			if(!fileId || fileId == ""){
				return;
			}
			
		    var selectFile = $('#noticeFileTable').bootstrapTable('getRowByUniqueId', fileId);
			var fileType = selectFile.type;
			if(fileType.substring(0,5) == "audio"){
				$("#audioPlay").attr("src", baseURL + selectFile.path);
				var audio = document.getElementById("audioPlay");
				layer.open({
					type: 1,
					skin: 'layui-layer-molv',
					title: "查看附件",
					area: ['550px', '200px'],
					shadeClose: false,
					//shade:false,
					content: jQuery("#audioLayer"),
					btn: ['关闭']
				});
			}else if(fileType.substring(0,5) == "image"){
				$("#imgContainer").attr("src", baseURL + selectFile.path);
				layer.open({
					type: 1,
					skin: 'layui-layer-molv',
					title: "查看附件",
					area: ['600px', '450px'],
					shadeClose: false,
					//shade:false,
					content: jQuery("#imageLayer"),
					btn: ['关闭']
				});
			}else if(fileType.substring(0,5) == "video"){
				$("#videoContainer").attr("src", baseURL + selectFile.path);
				layer.open({
					type: 1,
					skin: 'layui-layer-molv',
					title: "查看附件",
					area: ['600px', '450px'],
					shadeClose: false,
					//shade:false,
					content: jQuery("#videoLayer"),
					btn: ['关闭'],
					btn1: function (index) {
						var myVideo = document.getElementById('videoContainer');
						myVideo.pause();
						layer.close(index);
					}
				});
			}else{				
//				var form = $("<form method='get'></form>");
//				form.attr("action",baseURL + selectFile.path);
//	            $(document.body).append(form);
//	            form.submit();
	            download(projectName+"/" + selectFile.path,null,null);
			}
		},
		delFile: function(fileId){
			confirm('确定要删除这条记录？', function(){
				$("#noticeFileTable").bootstrapTable('removeByUniqueId', fileId);
				
				if(vm.notice.deleteFileIds == null){
					vm.notice.deleteFileIds = [];
				}
				vm.notice.deleteFileIds.push(fileId);
				alert("删除成功！");
			});
		},
		delBatchFile: function(){
			if(vm.notice.deleteFileIds == null){
				vm.notice.deleteFileIds = [];
			}
			var selectPersons=[];
			
			selectPersons = $('#noticeFileTable').bootstrapTable('getSelections');
			
			if(selectPersons.length < 1){
				alert("请至少选择一条记录");
				return;
			}
			confirm('确定要删除选中的记录？', function(){
				var fileId = '';
				if(vm.showPage == 1){	//线索
					var fileIds = [];
					for(var i=0; i<selectPersons.length; i++){
						fileIds.push(selectPersons[i].fileId);
					}
					$('#noticeFileTable').bootstrapTable('remove', {field: 'fileId', values: fileIds});
					vm.notice.deleteFileIds=fileIds;
				} else {	//案件
					var fileIds = [];
					for(var i=0; i<selectPersons.length; i++){
						fileIds.push(selectPersons[i].fileId);
					}
					$('#noticeFileTable').bootstrapTable('remove', {field: 'fileId', values: fileIds});
					vm.notice.deleteFileIds=fileIds;
				}
				//vm.notice.deleteFileIds.push(fileId);
				alert("删除成功！");
			});
		},
		/******************* 附件 B *******************/
		
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
		showUserTree: function(flag, viewOrEdit){
			vm.isShowUserTreeDisable = true;
			var showUsers = [];
			if(flag == '1' || flag == '2' || flag == '4'){
				type = '-1';
				showUsers = window.parent.vm.selectUsers;
			} else if (flag == '3'){
				type = '0';
				showUsers = window.parent.vm.selectUsers2;
			}
			//$.get(baseURL + "qbfx/common/deptTree/" + type, function(r){
				vm.isShowUserTreeDisable = false;
		    	var title = "";
		    	//1:接收人;2:发起人
		    	if(flag == '1'){
		    		if(operation == "0"){		    			
		    			title = '接收人';		    			
		    			if(vm.notice.hasOwnProperty('receiveUserIds') && vm.notice.receiveUserIds.length>0){
		    				//var selectUsers = vm.getDeptAndUserTreeByUserId(r, vm.notice.receiveUserIds);
		    				var selectUsers = vm.getDeptAndUserTreeByUserId(showUsers, vm.notice.receiveUserIds);
		    				//console.log("selectUsers : " + JSON.stringify(selectUsers));
		    				//console.log("vm.notice.receiveUserList : " + JSON.stringify(vm.notice.receiveUserList));
		    				for(var i=0; i<selectUsers.length; i++){
		    					//已反馈的 人员 名称高亮显示
		    					for(var j in vm.notice.receiveUserList){
		    						//找到对应 接收人 信息
		    						if(vm.notice.receiveUserList[j].userId == selectUsers[i].deptId){
		    							//已反馈
		    							if(vm.notice.receiveUserList[j].isFeedback == 1){
		    								//高亮显示
		    								selectUsers[i].name = "<font style='background:yellow'>"+selectUsers[i].name+"</font>";
		    								break;
		    							}
		    						}
		    					}
		    				}
		    				Setting.check.enable = false;
							ztree = $.fn.zTree.init($("#userTree"), Setting, selectUsers);
							ztree.expandAll(true);
		    			}else{
		    				return;
		    			}
					}else{						
						title = '选择接收人';						
						Setting.check.enable = true;
						ztree = $.fn.zTree.init($("#userTree"), Setting, showUsers);
				    	ztree.checkAllNodes(false);//全部不选中
				    	if(vm.notice.hasOwnProperty('receiveUserIds') && vm.notice.receiveUserIds.length>0){
		    				for(var i=0; i<vm.notice.receiveUserIds.length; i++){
	    						var node = ztree.getNodeByParam("deptId", vm.notice.receiveUserIds[i]);
	    						ztree.checkNode(node,true);
							}
			    		}
				    	ztree.expandAll(true);
					}
		    		vm.popUserTree(flag,title);
				}
		    	if(flag == '2'){
		    		if(operation == "0"){		    			
		    			title = '发起人';		    			
		    			if(vm.notice.hasOwnProperty('userIds') && vm.notice.userIds.length>0){
		    				var selectUsers = vm.getDeptAndUserTreeByUserId(showUsers, vm.notice.userIds);
		    				Setting.check.enable = false;
							ztree = $.fn.zTree.init($("#userTree"), Setting, selectUsers);
							ztree.expandAll(true);
		    			}else{
		    				return;
		    			}
					}else{						
						title = '选择发起人';						
						Setting.check.enable = true;
						ztree = $.fn.zTree.init($("#userTree"), Setting, showUsers);
				    	ztree.checkAllNodes(false);//全部不选中
				    	if(vm.notice.hasOwnProperty('userIds') && vm.notice.userIds.length>0){
		    				for(var i=0; i<vm.notice.userIds.length; i++){
	    						var node = ztree.getNodeByParam("deptId", vm.notice.userIds[i]);
	    						ztree.checkNode(node,true);
							}
						   ztree.expandAll(true);
			    		}
					}
		    		vm.popUserTree(flag,title);
				}
		    	
		    //});
		},
		popUserTree:function(flag,title){
			if(operation != "0" || vm.optType != "query") {
				layer.open({
			        type: 1,
			        offset: '50px',
			        skin: 'layui-layer-molv',
			        title: title,
			        area: ['350px', '460px'],
			        shadeClose: false,
					//shade:false,
			        content: jQuery("#userLayer"),
			        btn: ['确定', '取消'],
			        btn1: function (index) {
			        	//初始化参数
			        	var nodeNames = "";
			        	var nodes = ztree.getCheckedNodes();
		        		if(flag == '1') {
		        			window.parent.vm.isEditted = true;
		        			vm.notice.receiveUserIds = [];
		        			for(var i=0; i<nodes.length; i++){
		        				if(nodes[i].deptId.substring(0,1) == "D"){
             					   continue;
             				   }
		        				vm.notice.receiveUserIds.push(nodes[i].deptId);
			    				nodeNames += nodes[i].name + ";";
			    			}
		        		}else if(flag == '2') {
		        			window.parent.vm.isEditted = true;
		        			vm.notice.userIds = [];
		        			for(var i=0; i<nodes.length; i++){
		        				if(nodes[i].deptId.substring(0,1) == "D"){
             					   continue;
             				   }
		        				vm.notice.userIds.push(nodes[i].deptId);
			    				nodeNames += nodes[i].name + ";";
			    			}
		        		} 
			    		//页面赋值
			    		if(flag == '1'){		    			
			    			vm.notice.receiveUserNames = nodeNames;
			    			$("#receiveUserNames").val(nodeNames);	//接收人
			    		}else if(flag == '2'){
			    			vm.notice.userNames = nodeNames;
			    			$("#userNames").val(nodeNames);	//发起人			    		
			    		} 
			    		
			            layer.close(index);
			        }
			    });
			} else {
				layer.open({
			        type: 1,
			        offset: '50px',
			        skin: 'layui-layer-molv',
			        title: title,
			        area: ['350px', '460px'],
			        shadeClose: false,
					//shade:false,
			        content: jQuery("#userLayer"),
			        btn: ['关闭'],
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
		} else {
			this.showPage = 1;
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
