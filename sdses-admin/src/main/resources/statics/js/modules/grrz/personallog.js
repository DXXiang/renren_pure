var ajax; //ajax对象
$(function () {
	initPage();
	var searchParams = self.frameElement.getAttribute('dataParams');
	if(searchParams != 'undefined' && searchParams != 'null'){
		var params = JSON.parse(searchParams);
		$("#remindBeginTimePicker").val(params.remindTimeB.substring(0,10));
		$("#remindEndTimePicker").val(params.remindTimeE.substring(0,10));
	}
});
/**
 * 初始化页面 加载 bootstraptable 
 * @returns
 */
function initPage(){
	vm.dateDefind();
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
			vm.add();
		} else {
			var paramArr = params.split('-');
			var logId = paramArr[1];
			vm.initFileUploadTable();
			if(paramArr[0] == 'V'){//查看             	
				vm.title = "查看";
            	vm.optType = "query";
            	vm.setIsEnableEdit(false);
            	$("#fileUploadTable").bootstrapTable('hideColumn', 'checkBox');
            }else if(paramArr[0] == 'U'){//修改
            	vm.title = "修改";
            	vm.optType = "update";
            	vm.setIsEnableEdit(true);
            	$("#fileUploadTable").bootstrapTable('showColumn', 'checkBox');
            }
			$.get(baseURL + "grrz/personallog/info/"+logId, function(r){
                vm.personalLog = r.personalLog;
                $("#finishTimePicker").val(vm.personalLog.finishTime);
                $("#remindTimePicker").val(vm.personalLog.remindTime);
                
                if(vm.personalLog.fileList && vm.personalLog.fileList.length>0){//附件
            		$('#fileUploadTable').bootstrapTable('append', vm.personalLog.fileList);
            	}
                vm.showList = false;
            });
		}
	} else {
		vm.loadingTable();
	}
//	if(vm.personalLog.fileList && vm.personalLog.fileList.length>0){//附件
//		$('#fileUploadTable').bootstrapTable('append', vm.personalLog.fileList);
//	}
//	if(vm.operationType == 'V'){
//		vm.title = "查看";
//		vm.optType = "query";
//		vm.setIsEnableEdit(false);
//        //隐藏复选框列
//		$('#fileUploadTable').bootstrapTable('hideColumn', 'checkBox');
//	}
}

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: '',
		title: "",
		personalLog: {},
		searchParams: {},
		optType: "",                //操作类型
		globalDateTimePickerId: "" //时间控件Id
	},
	methods: {
		/*********************************** 多窗口操作 B ***********************************/
		/**
		 * 初始化页面
		 */
		initPage: function(){
			this.dateDefind();
			/*$("body").click(function(e){
		    	e.stopImmediatePropagation();
		    	var classNames = e.target.className;
		    	if(!classNames || classNames == "" || classNames.indexOf("datetimepicker") < 0){
		    		$("#"+vm.globalDateTimePickerId).datetimepicker("hide");
		    	}
		    });
			*/
			//页面参数
			var params = self.frameElement.getAttribute('params');
			if(params != 'undefined' && params != 'null'){
				//新增
				if(params == 'A'){		
					this.add();
				} else {
					var paramArr = params.split('-');
					var logId = paramArr[1];
					if(paramArr[0] == 'V'){//查看             	
	                	this.title = "查看";
	                	this.optType = "query";
	                	this.setIsEnableEdit(false);
	                	$("#fileUploadTable").bootstrapTable('hideColumn', 'checkBox');
	                }else if(paramArr[0] == 'U'){//修改
	                	this.title = "修改";
	                	this.optType = "update";
	                	this.setIsEnableEdit(true);
	                	$("#fileUploadTable").bootstrapTable('showColumn', 'checkBox');
	                }
					$.get(baseURL + "grrz/personallog/info/"+logId, function(r){
		                vm.personalLog = r.personalLog;
		                $("#finishTimePicker").val(vm.personalLog.finishTime);
		                $("#remindTimePicker").val(vm.personalLog.remindTime);
		                vm.initFileUploadTable();
		                
		                if(vm.personalLog.fileList && vm.personalLog.fileList.length>0){//附件
		            		$('#fileUploadTable').bootstrapTable('append', vm.personalLog.fileList);
		            	}
		                vm.showList = false;
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
				var logId = type_id.split('-')[1];
				var personalLog = vm.getInfo(logId);
	            if(personalLog.delFlag == -1){
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
			//TODO
		},
		/**
		 * 加载表格
		 */
		loadingTable: function(){
			//表格查询参数
			var postData = {};
			//页面参数
			var searchParams = self.frameElement.getAttribute('dataParams');
			if(searchParams != 'undefined' && searchParams != 'null'){
				//console.log( "  searchParams : " + searchParams);
				postData = JSON.parse(searchParams);
			}
			$("#jqGrid").jqGrid({
		        url: baseURL + 'grrz/personallog/query',
		        datatype: "json",
		        colModel: [			
					{ label: 'logId', name: 'logId', index: 'LOG_ID',  key: true, hidden:true },
					{ label: '标题', name: 'title', index: 'TITLE', width: 80 , sortable: false}, 			
					{ label: '内容', name: 'content', index: 'CONTENT', width: 80 , sortable: false,formatter: function(value, grid, row, state){
						if(value.indexOf("\n") > -1){
							value = value.replace(/\n/g,"");
						}
						return value;
					}}, 			
					{ label: '类型', align: 'center', name: 'type', index: 'TYPE', width: 50 }, 			
					{ label: '完成时间', align: 'center', name: 'finishTime', index: 'FINISH_TIME', width: 50 }, 			
					{ label: '提醒时间', align: 'center', name: 'remindTime', index: 'REMIND_TIME', width: 50 },
					{ label: '操作', sortable: false, align: 'center', name: '', index: '', width: 40 , formatter: function(value, grid, row, state){
						var str = "";
						str += '<a style="cursor: pointer" title="查看" onclick="vm.jumpPage(\'V-'+ row.logId + '\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
						str += '<a style="cursor: pointer" title="修改" onclick="vm.jumpPage(\'U-'+ row.logId + '\')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
						str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteLogById('+ row.logId +')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
						return str;
					}},
		        ],
		        cellEdit: false,
		        sortable: true,
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
		        },
		        postData: postData
		    });
		},
		getInfo: function(logId){
			var personalLog = {};
			$.ajaxSettings.async = false;
			$.get(baseURL + "grrz/personallog/info/"+logId, function(r){
				personalLog = r.personalLog;
            });
			$.ajaxSettings.async = true;
			return personalLog;
		},
		
		query: function () {
			vm.reload(1);
		},
		//重置查询条件
		resetSearch: function() {
//			$("#beginTimePicker").val("");
//			$("#endTimePicker").val("");
//			$("#remindBeginTimePicker").val("");
//			$("#remindEndTimePicker").val("");
			$("#TimePicker").val("");
			$("#remindRangTimePicker").val("");
			vm.searchParams = {};
			//查询除原来的传递参数，并逐个清空 B
			var postData1 = $("#jqGrid").jqGrid("getGridParam", "postData");
			delete postData1["title"];
			delete postData1["content"];
			delete postData1["type"];
			delete postData1["finishTimeB"];
			delete postData1["finishTimeE"];
			delete postData1["remindTimeB"];
			delete postData1["remindTimeE"];
			//查询除原来的传递参数，并逐个清空 E
			
			//传递新的查询参数
			$("#jq").jqGrid("setGridParam", { postData: postData1 });
		},
		reload: function (pageNum) {
			vm.showList = true;
//			var beginTime = $("#beginTimePicker").val();
//			var endTime = $("#endTimePicker").val();
			if($("#TimePicker").val() != ''){
				var timePicker = $("#TimePicker").val().split(" - ");
				var beginTime=timePicker[0];
				var endTime =timePicker[1];
				
				if(beginTime != "" && endTime != ""){
					if(beginTime > endTime){
						alert("完成时间起始时间应该小于截止时间");
						return;
					}
				}
				if(beginTime != ""){
					vm.searchParams.finishTimeB=beginTime;
				}
				if(endTime != ""){
					vm.searchParams.finishTimeE=endTime;
				}
			} else {
				vm.searchParams.finishTimeB = '';
				vm.searchParams.finishTimeE = '';
			}
			
			if($("#remindRangTimePicker").val() != ''){
				var remindRtimePicker = $("#remindRangTimePicker").val().split(" - ");
				var remindBeginTime = remindRtimePicker[0];
				var remindEndTime = remindRtimePicker[1];
				if(remindBeginTime != "" && remindEndTime != ""){
					if(remindBeginTime > remindEndTime){
						alert("提醒时间起始时间应该小于截止时间");
						return;
					}
				}
				if(remindBeginTime != ""){
					vm.searchParams.remindTimeB=remindBeginTime + " 00:00:00";
				}
				if(remindEndTime != ""){
					vm.searchParams.remindTimeE=remindEndTime + " 23:59:59";
				}
			} else {
				vm.searchParams.remindTimeB = '';
				vm.searchParams.remindTimeE = '';
			}
			
			var page;
			if(pageNum != null && pageNum != undefined){
				page = pageNum;
			}else{
				page = $("#jqGrid").jqGrid('getGridParam','page');
			}
			//console.log("vm.searchParams : " + JSON.stringify(vm.searchParams))
			$("#jqGrid").jqGrid('setGridParam',{ 
				postData:vm.searchParams,
                page:page
            }).trigger("reloadGrid");
		},
		//新增页面
		add: function(){
			this.showList = false;
			this.title = "新增";
			this.personalLog = {};
			this.optType = "add";
			this.setIsEnableEdit(true);
			this.initFileUploadTable();
			var today = (new Date()).Format("yyyy-MM-dd");
			$("#finishTimePicker").val(today);
		    $("#remindTimePicker").val("");
		    $("#fileUploadTable").bootstrapTable('showColumn', 'checkBox');
		},
		//批量删除
		del: function (event) {
			var logIds = getSelectedRows();
			if(logIds == null){
				return ;
			}
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "grrz/personallog/delete",
                    contentType: "application/json;charset=utf-8",
				    data: JSON.stringify(logIds),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
								vm.delReload(logIds, $("#jqGrid"));
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		//根据Id删除
		deleteLogById: function(logId){
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "grrz/personallog/delete",
		            contentType: "application/json;charset=utf-8",
				    data: '["' + logId + '"]',
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								//$("#jqGrid").trigger("reloadGrid");
								vm.delReload([logId], $("#jqGrid"));
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
		//查看或修改页面
		queryOrUpdateLog: function(logId,flag){
			vm.showList = false;
			if(flag == 0){ //查看
            	vm.title = "查看";
            	vm.optType = "query";
            	vm.setIsEnableEdit(false);
            	$("#fileUploadTable").bootstrapTable('hideColumn', 'checkBox');
            	window.parent.vm.isEditted = false;
            }else if(flag == 1){ //修改
            	vm.title = "修改";
            	vm.optType = "update";
            	vm.setIsEnableEdit(true);
            	$("#fileUploadTable").bootstrapTable('showColumn', 'checkBox');
            }
			$.get(baseURL + "grrz/personallog/info/"+logId, function(r){
                vm.personalLog = r.personalLog;
                $("#finishTimePicker").val(vm.personalLog.finishTime);
                $("#remindTimePicker").val(vm.personalLog.remindTime);
                vm.initFileUploadTable();
                
                if(vm.personalLog.fileList && vm.personalLog.fileList.length>0){//附件
            		$('#fileUploadTable').bootstrapTable('append', vm.personalLog.fileList);
            	}
            });
		},
		//保存按钮
		saveOrUpdate: function (event) {
			if(!vm.personalLog.title || vm.personalLog.title.trim() == ''){
	    		alert("请填写标题");
	    		return;
	    	}else if((vm.personalLog.title.trim()).length > 50){
	    		alert("标题最多50个字");
	    		return;
	    	}
	    	if(!vm.personalLog.content || vm.personalLog.content.trim() == ''){
	    		alert("请填写内容");
	    		return;
	    	}else if((vm.personalLog.content.trim()).length > 1000){
	    		alert("内容最多1000个字");
	    		return;
	    	}
	    	if($("#finishTimePicker").val().trim() == ''){
	    		alert("请选择完成时间");
	    		return;
	    	}
	    	if(!vm.personalLog.type || vm.personalLog.type.trim() == ''){
	    		alert("请填写类型");
	    		return;
	    	}else if((vm.personalLog.type.trim()).length > 50){
	    		alert("类型最多50个字");
	    		return;
	    	}
			vm.personalLog.finishTime = $("#finishTimePicker").val();
			vm.personalLog.remindTime = $("#remindTimePicker").val();
//			if(vm.personalLog.remindTime != "" && vm.personalLog.remindTime.length > 10){
//				vm.personalLog.remindTime = vm.personalLog.remindTime + ":00";
//			}
			var fileTableData = $('#fileUploadTable').bootstrapTable('getData');
	    	vm.personalLog.fileList = fileTableData;
	    	var url = vm.personalLog.logId == null ? "grrz/personallog/save" : "grrz/personallog/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
			    contentType: "application/json;charset=utf-8",
			    data: JSON.stringify(vm.personalLog),
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
		//重置
		reset:function(){
			confirm('确定要重置当前页面？', function(){
				vm.personalLog = {};
				vm.initFileUploadTable();
				window.parent.vm.isEditted = false;
				var today = (new Date()).Format("yyyy-MM-dd");
				$("#finishTimePicker").val(today);
			    $("#remindTimePicker").val("");
			});
		},
		//返回
		back: function() {
        	if(window.parent.vm.isEditted) {
        		confirm('页面尚未保存，您确定要离开页面吗？', function(){
        			/*$("#finishTimePicker").datetimepicker("hide");
        			$("#remindTimePicker").datetimepicker("hide");*/
        			layer.closeAll();
        			vm.reload();
        			window.parent.vm.isEditted = false;
        		});
        	} else {
        		/*$("#finishTimePicker").datetimepicker("hide");
        		$("#remindTimePicker").datetimepicker("hide");*/
        		layer.closeAll();
        		vm.reload();
        	}
        },
		//设置是否可以编辑
		setIsEnableEdit:function(flag){
			if(flag){
				$("#logForm :input").not("a[type='button']").removeAttr("disabled");
			}else{
				$("#logForm :input").not("a[type='button']").attr("disabled", "disabled");
			}
		},
		//初始化附件表格
		initFileUploadTable: function(){
			if($("#fileUploadTable").html() == ""){
				$('#fileUploadTable').bootstrapTable({
					locale:"zh-CN",
					uniqueId: "fileId",                     
				    columns: [
				    {
				    	field: 'checkBox',
				    	checkbox: true,
				    	visible: true 
				    }, 
					{
				        field: 'name',
				        title: '名称',
				        width: '75%'
				    }, {
				        field: 'createTime',
				        title: '上传时间',
				        visible:true,
				        width: '15%',
				        align: 'center'
				    }, {
				        field: 'fileId',
				        title: '操作',
				        visible:true,
				        formatter:this.fileUploadFormatter,
				        align:"center",
				        width: '10%'
				    }],
				    data: []
				});
			}else{
				$('#fileUploadTable').bootstrapTable("removeAll");
			}
		},
		fileUploadFormatter:function(code){
	    	   var str = "";
	    	   if(vm.optType == "add" || vm.optType == "update"){
	    		   str = '<a style="cursor: pointer" title="查看" onclick="vm.checkFileUploadById(\''+ code +'\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
	        	   str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteFileUploadById(\''+ code +'\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
	    	   }else if(vm.optType == "query"){
	    		   str = '<a style="cursor: pointer" title="查看" onclick="vm.checkFileUploadById(\''+ code +'\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
	    	   }
	    	   return str;
	    },
	    //新增附件
		addFileUpload: function(){
			vm.popUpFileUploadLayer();
		},
		//附件上传
		popUpFileUploadLayer:function(){
			$("#progress-bar").css("width", 0);
			var bool = false;  //加个锁
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "新增附件",
				area: ['550px', '190px'],
				shadeClose: false,
				content: jQuery("#fileUploadModal"),
				btn: ['上传','取消'],
				btn1: function (index) {
					if(bool) {
						return;
					}
					bool = true;
					var files = vm.$refs.uploadFile.files;
					if(files.length < 1){
						alert("请选择上传的文件");
						bool = false;
						return;
					}
					var formData = new FormData();  
					formData.append('files', files[0]);
					ajax = $.ajax({
						url: baseURL + 'common/comfile/uploadFile/6',
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
								$('#fileUploadTable').bootstrapTable('append', data.file);
							} else {
								alert(data.msg);
							}
							layer.close(index);
						},
			            error:function (data, status, e){   
			            	//console.log("data " + JSON.stringify(data)); 
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
	            	$("#fileUploadInput").val("");
	            	$("#progress").val("");
	            }
			});
		},
		//批量删除附件
		deleteFileUpload: function(){
			var selectFiles = $('#fileUploadTable').bootstrapTable('getSelections');
			if(selectFiles.length < 1){
				alert("请至少选择一条记录");
				return;
			}
			confirm('确定要删除选中的附件？', function(){
				var fileIds = [];
				vm.personalLog.deleteFileIds = [];
				for(var i=0; i<selectFiles.length; i++){
					fileIds.push(selectFiles[i].fileId);
					vm.personalLog.deleteFileIds.push(selectFiles[i].fileId);
				}
				$('#fileUploadTable').bootstrapTable('remove', {field: 'fileId', values: fileIds}); 
				alert("删除成功");
			});
		
		},
		//根据Id删除附件
		deleteFileUploadById:function(fileId){
			if(!fileId || fileId == ""){
				return;
			}
			confirm('确定要删除选中的附件？', function(){
				vm.personalLog.deleteFileIds = [];
				vm.personalLog.deleteFileIds.push(fileId);
				$('#fileUploadTable').bootstrapTable('removeByUniqueId', fileId); 
				alert("删除成功");
			});
		},
	    //查看附件
	    checkFileUploadById : function(fileId){
			if(!fileId || fileId == ""){
				return;
			}
			var selectFile = $('#fileUploadTable').bootstrapTable('getRowByUniqueId', fileId);
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
					content: jQuery("#audioLayer"),
					btn: ['关闭'],
					btn1: function (index) {
						var myAudio = document.getElementById('audioPlay');
						myAudio.pause();
						layer.close(index);
					}
				});
			}else if(fileType.substring(0,5) == "image"){
				$("#imgContainer").attr("src", baseURL + selectFile.path);
				layer.open({
					type: 1,
					skin: 'layui-layer-molv',
					title: "查看附件",
					area: ['600px', '450px'],
					shadeClose: false,
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
		//日期控件初始化
		dateDefind:function() {
			var date, today;
			date = new Date();
			today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " ";       
		    var pickerConfig = {
			    	format: "yyyy-mm-dd",
			        //日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
			        minView: "2",
			        language: 'zh-CN',
			        autoclose: true,
			        todayBtn: true
			};
		    var newDate = new Date();
		    var t = newDate.toJSON();
		    var pickerConfig2 = {
		    		startDate:new Date(t),
		    		format: "yyyy-mm-dd hh:ii",
			        weekStart:1,
			        todayHighlight:1,
			        startView:2,
			        forceParse:0,
			        showMeridian:1,
			        minuteStep: 5,
				    language: 'zh-CN',
				    autoclose: true,
				    todayBtn: true
			};
		    $("#finishTimePicker").val(today);
		    //$("#finishTimePicker").datetimepicker(pickerConfig);
		    //新增时间yjltTimePicker
		    laydate.render({
				 elem: '#finishTimePicker' ,
				 type: 'date',
				 format: 'yyyy-MM-dd',
				 trigger: 'click'
		    });
		    
		   // $("#remindTimePicker").datetimepicker(pickerConfig2);
			 laydate.render({
		    	  elem: '#remindTimePicker' ,
	    		  type: 'date',
	    		  type: 'datetime',
				  format: 'yyyy-MM-dd HH:mm',
	    		  trigger: 'click'
	    	});
//		    $('#finishTimePicker').datetimepicker().on('show', function(ev){
//		    	$('#remindTimePicker').datetimepicker("hide");
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
//		    });
//		    $('#remindTimePicker').datetimepicker().on('show', function(ev){
//		    	$('#finishTimePicker').datetimepicker("hide");
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
//		    });
		    
		    pickerConfig.pickerPosition="bottom-right";
			laydate.render({
				  elem: '#TimePicker',
				  range: true,
				  trigger: 'click'
			});
			laydate.render({
				  elem: '#remindRangTimePicker',
				  range: true,
				  trigger: 'click'
			});
//		    $("#beginTimePicker").datetimepicker(pickerConfig);
//		    $("#endTimePicker").datetimepicker(pickerConfig);
//		    $('#beginTimePicker').datetimepicker().on('show', function(ev){
//		    	$('#endTimePicker').datetimepicker("hide");
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
//		    });
//		    $('#endTimePicker').datetimepicker().on('show', function(ev){
//		    	$('#beginTimePicker').datetimepicker("hide");
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
//		    });
//		    $("#remindBeginTimePicker").datetimepicker(pickerConfig);
//		    $("#remindEndTimePicker").datetimepicker(pickerConfig);
//		    $('#remindBeginTimePicker').datetimepicker().on('show', function(ev){
//		    	$('#remindEndTimePicker').datetimepicker("hide");
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
//		    });
//		    $('#remindEndTimePicker').datetimepicker().on('show', function(ev){
//		    	$('#remindBeginTimePicker').datetimepicker("hide");
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
//		    });
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
			this.showList = true;
		}
	},
	mounted: function () {
//		this.initPage();
	}
});
function progressHandlingFunction(e) {
	if (e.lengthComputable) {
		var percent = e.loaded / e.total;
        $("#progress-bar").css("width", (percent * 500));
	} 
}