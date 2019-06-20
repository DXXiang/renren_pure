var ajax; //ajax对象
$(function () {
    
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
		cdrDetail: {},
		basestationfact:{},
		area:{},
		q:{
			recordType:'',
			phoneNumber:'',
			otherNumber:'',
		},
		cdrTypeList:{},
		typeCodeList:{},
		releaseReasonList:{},
		getTypeList:{},
		turnFlagList:{},
		resourceTypeList:{},
		recordTypeList:{},
		hungupTypeList:{}
		
	},
	methods: {
		/*********************************** 多窗口操作 B ***********************************/
		/**
		 * 初始化页面
		 */
		initPage: function(){
			/*$("body").click(function(e) {
		        e.stopImmediatePropagation();
		    });*/
			this.dateDefind();
			//页面参数
			var params = self.frameElement.getAttribute('params');
			if(params != 'undefined' && params != 'null'){
				//新增
				if(params == 'A'){		
					this.add();
				} else {
					var paramArr = params.split('-');
					//修改
					if(paramArr[0] == 'U'){
						this.update(paramArr[1]);
					}
					//查看
					else if(paramArr[0] == 'V'){
						this.view(paramArr[1]);
					}
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
				var cdrDetailId = type_id.split('-')[1];
				var cdrDetail = vm.getInfo(cdrDetailId);
	            if(cdrDetail.delFlag == -1){
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
			this.cdrTypeList = dictListMap.get('cdrType');
			this.typeCodeList = dictListMap.get('typeCode');
			this.releaseReasonList = dictListMap.get('releaseReason');
			this.getTypeList = dictListMap.get('getType');
			this.turnFlagList = dictListMap.get('turnFlag');
			this.resourceTypeList = dictListMap.get('resourceType');
			this.hungupTypeList = dictListMap.get('hungupType');
			this.recordTypeList = dictListMap.get('recordType');
		},
		/**
		 * 加载表格
		 */
		loadingTable: function(){
			var q = {};
			//q.launchTimeB=this.getCurrentMonthFirst();
			//q.launchTimeE=this.getCurrentDate();
			$("#jqGrid").jqGrid({
		        url: baseURL + 'hdfx/cdrdetail/list/80',
		        postData:q,
		        datatype: "json",
		        colModel: [			
					{ label: 'id', name: 'id', index: 'id', width: 50, key: true ,hidden:true},
					{ label: '本方号码',align: 'center', name: 'phonenumber', index: 'phoneNumber', width: 80 }, 					
					{ label: '本方归属地',align: 'center', name: 'callingareacode', index: 'callingAreaCode', width: 80 },
					{ label: '通话时长',align: 'center', name: 'duration', index: 'duration', width: 80 }, 			
					{ label: 'LAC',align: 'center', name: 'lac', index: 'LAC', width: 80 }, 			
					{ label: 'CI', align: 'center',name: 'ci', index: 'CI', width: 80 }, 					
					{ label: '对方号码',align: 'center', name: 'othernumber', index: 'otherNumber', width: 80 }, 					
					{ label: '对方归属地',align: 'center', name: 'calledareacode', index: 'calledAreaCode', width: 80 },
					{ label: '交换机ID',align: 'center', name: 'switcherid', index: 'switcherId', width: 80 }, 			
					{ label: '事件发生地',align: 'center', name: 'eventplace', index: 'eventPlace', width: 80 }, 			
					{ label: '记录类型', align: 'center',name: 'recordtype', index: 'recordtype', width: 80 , formatter: function(value, options, row){
						 for(var i=0; i<vm.recordTypeList.length; i++){
			 					if(vm.recordTypeList[i].code == value){
			 						return vm.recordTypeList[i].value;
			 					}
			 				}
				        	   return "";
							} }, 			
					{ label: '操作',align: 'center',sortable: false, name: '', index: '', width: 100 , formatter: function(value, grid, row, state){
							var str = '';
								str += '<a style="cursor: pointer" title="查看" onclick="vm.jumpPage(\'V-'+ row.id +'\')" "><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
								str += '<a style="cursor: pointer" title="修改" onclick="vm.jumpPage(\'U-'+ row.id +'\')" "><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
								str += '<a style="cursor: pointer" title="删除" onclick="vm.delById('+ row.id +')" "><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
							return str;	
						} 		
					}
					
		        ],
				viewrecords: true,
				cellEdit: false,
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
		        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "auto" }); 
		        }
		    });
		},
		query: function () {
			vm.reload(1);
		},
		//清理数据
		clearPage:function(){
			 vm.cdrDetail={};
			 vm.basestationfact={};
			//页面输入框、下拉框等，全部解禁
			$('#casePage input,#casePage select,#casePage textarea').removeAttr("disabled");
			$('#savebut').show();
			$('#resetbut').show();
			 $("#connectTimePicker").val('');
			 $("#evenTimePicker").val('');
			    $("#evenDatePicker").val('');
		},
		resetSearch: function () {
			$("#TimePicker").val('');
			vm.q={recordType: '',  phoneNumber:'',otherNumber:''};
		},
		add: function(){
			this.showList = false;
			this.title = "新增";
			this.cdrDetail = {};
		},
		update: function (id) {
			this.showList = false;
			this.title = "修改";
			this.cdrDetail = this.getInfo(id);
			this.basestationfact = this.getBasestationFactInfoByCGI(this.cdrDetail.cgi);
			$('#resetbut').hide();
			$('#cgiid').attr("disabled","disabled");
			$("#connectTimePicker").val(this.cdrDetail.connectiontime);
			//$("#evenTimePicker").val(this.cdrDetail.eventtime);
			$("#evenDatePicker").val(this.cdrDetail.eventdate);
			$("#hangUpTimePicker").val(this.cdrDetail.hanguptime);
			$("#releasetTimePicker").val(this.cdrDetail.releasetime);
		},
		saveOrUpdate: function (event) {
			vm.cdrDetail.connectiontime= $("#connectTimePicker").val();
			vm.cdrDetail.eventdate=$("#evenDatePicker").val();
			vm.cdrDetail.eventtime=vm.cdrDetail.eventdate;
			//vm.cdrDetail.eventtime=$("#evenTimePicker").val();
		    vm.cdrDetail.hanguptime=$("#hangUpTimePicker").val();
		    vm.cdrDetail.releasetime=$("#releasetTimePicker").val();
		    if (vm.cdrDetail.phonenumber == null || vm.cdrDetail.phonenumber == "") {
		        alert("请填写本方手机号");
		        return;
		    }
		    if (vm.cdrDetail.connectiontime == null || vm.cdrDetail.connectiontime.trim() == '') {
		        alert("请填写连接时间");
		        return false;
		    }
		   /* if (vm.cdrDetail.othernumber == null || vm.cdrDetail.othernumber == "") {
		        alert("请填写对方手机号");
		        return false;
		    }*/
		    if (vm.cdrDetail.cdrtype == null || vm.cdrDetail.cdrtype == "") {
		        alert("请选择话单类型");
		        return false;
		    }
		    if (vm.cdrDetail.eventdate == null || vm.cdrDetail.eventdate == "") {
		    	alert("请选择日期时间");
		    	return false;
		    }
		    if (vm.cdrDetail.hanguptime == null || vm.cdrDetail.hanguptime.trim() == '') {
		        alert("请填写挂断时间");
		        return false;
		    }
		    if (vm.cdrDetail.releasetime == null || vm.cdrDetail.releasetime.trim() == '') {
		        alert("请填写释放时间");
		        return false;
		    }
		    /*if (vm.cdrDetail.eventtime == null || vm.cdrDetail.eventtime == "") {
		    	alert("请选择时间");
		    	return false;
		    }*/
		    if (vm.cdrDetail.resourcetype == null || vm.cdrDetail.resourcetype == "") {
		        alert("请选择运营商");
		        return false;
		    }
		    if (vm.cdrDetail.recordtype == null || vm.cdrDetail.recordtype == "") {
		    	alert("请选择记录类型");
		    	return false;
		    }
		   
		    if (vm.cdrDetail.callid == null || vm.cdrDetail.callid == "") {
		        alert("请填写会话识别号");
		        return false;
		    }
		    if (vm.basestationfact.cgi == null || vm.basestationfact.cgi == "") {
		        alert("请填写CGI");
		        return false;
		    }
		    if (vm.cdrDetail.lac == null || vm.cdrDetail.lac == "") {
		        alert("请填写LAC");
		        return false;
		    }
		    if (vm.cdrDetail.ci == null || vm.cdrDetail.ci == "") {
		        alert("请填写CI");
		        return false;
		    }
		    if (vm.basestationfact.phoneoperator == null || vm.basestationfact.phoneoperator == "") {
		        alert("请填写地址");
		        return false;
		    }
		    if (vm.basestationfact.cgi != vm.cdrDetail.resourcetype + '-' + vm.cdrDetail.lac + '-' + vm.cdrDetail.ci) {
		    	alert("CGI不正确（CGI：'运营商编码-LAC-CI'）");
		    	vm.cdrDetail.cgi = vm.basestationfact.cgi;
		        return false;
		    }
			
			var url = vm.cdrDetail.id == null ? "hdfx/cdrdetail/save" : "hdfx/cdrdetail/update";
			var cdrflag=false;
			var baseflag=false;
			$.ajax({
				type: "POST",
			    url: baseURL + url,
			    async: false,
                contentType: "application/json;charset=utf-8",
			    data: JSON.stringify(vm.cdrDetail),
			    success: function(r){
			    	if (r.code == 0) {
						cdrflag = true;
					} else {
						alert("话单详情：" + r.msg);
					}
				}
			});
			
			if(cdrflag){
			vm.basestationfact.lac=vm.cdrDetail.lac;
			vm.basestationfact.ci=vm.cdrDetail.ci;
				
			var url ="hdfx/basestationfact/save" ;
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json;charset=utf-8",
                async: false,
			    data: JSON.stringify(vm.basestationfact),
			    success: function(r){
			    	if(r.code === 0){
			    		baseflag=true;
						alert('操作成功', function(index){
							vm.switchPage();
						});
					}else{
						alert('操作成功', function(index){
							vm.switchPage();
						});
						
					}
				}
			});
			}
		},
		getBaseByCgi:function(){
			$.get(baseURL + "hdfx/basestationfact/infoByCgi?cgi="+vm.basestationfact.cgi, function(r){
				if(r.basestationFact != null){
					vm.basestationfact = r.basestationFact;
					vm.cdrDetail.lac=vm.basestationfact.lac;
					vm.cdrDetail.ci=vm.basestationfact.ci;
				}
            });
		},
		delById:function(id){
			if(id == null){
				return ;
			}
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "hdfx/cdrdetail/delete",
                    contentType: "application/json;charset=utf-8",
				    data: '["' + id + '"]',
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								//$("#jqGrid").trigger("reloadGrid");
								vm.delReload([id], $("#jqGrid"));
							});
						}else{
							alert(r.msg);
						}
					}
				});
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
				    url: baseURL + "hdfx/cdrdetail/delete",
                    contentType: "application/json;charset=utf-8",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								//$("#jqGrid").trigger("reloadGrid");
								vm.delReload(ids, $("#jqGrid"));
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
		getInfo: function(id){
			var cdrDetail = {};
			$.ajaxSettings.async = false;
			$.get(baseURL + "hdfx/cdrdetail/info/"+id, function(r){
				cdrDetail = r.cdrDetail;
            });
			$.ajaxSettings.async = true;
			return cdrDetail;
		},
		getBasestationFactInfo: function(lac, ci){
			var basestationfact = {};
			$.ajaxSettings.async = false;
			$.get(baseURL + "hdfx/basestationfact/info?lac="+lac+"&ci="+ci, function(r){
				basestationfact = r.basestationFact;
            });
			$.ajaxSettings.async = true;
			return basestationfact;
		},
		getBasestationFactInfoByCGI: function(cgi){
			var basestationfact = {};
			$.ajaxSettings.async = false;
			$.get(baseURL + "hdfx/basestationfact/info/"+cgi, function(r){
				basestationfact = r.basestationFact;
            });
			$.ajaxSettings.async = true;
			return basestationfact;
		},
		view:function(id){
			this.title = '查看';
			this.showList = false;
			this.cdrDetail = this.getInfo(id);
			this.basestationfact = this.getBasestationFactInfoByCGI(this.cdrDetail.cgi);
			
		    $("#connectTimePicker").val(this.cdrDetail.connectiontime);
		    //$("#evenTimePicker").val(this.cdrDetail.eventtime);
		    $("#evenDatePicker").val(this.cdrDetail.eventdate);
			$("#hangUpTimePicker").val(this.cdrDetail.hanguptime);
			$("#releasetTimePicker").val(this.cdrDetail.releasetime);
			$('#casePage input,#casePage select,#casePage textarea').attr("disabled","disabled");
			$('#savebut').hide();
			$('#resetbut').hide();
		},
		uploadFilePage: function(){
			$("#progress-bar").css("width", 0);
			var bool = false;  //加个锁
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "附件上传",
				area: ['550px', '200px'],
				shadeClose: false,
				shade:false,
				content: jQuery("#fileLayer"),
				btn: ['上传','取消'],
				btn1: function (index) {
					if(bool) {
						return;
					}
					bool = true;
					var files = vm.$refs.cdrfile.files;
					if(files.length < 1){
						alert("请选择上传的文件");
						bool = false;
						return;
					}
	                var date = new Date();
					
					var formData = new FormData();  
					formData.append('files', files[0]);
					
					ajax = $.ajax({
						url: baseURL + 'hdfx/cdrdetail/importFile',
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
			            		alert(data.msg);
			            	} else {
			            		alert(data.msg);
			            	}
			            	layer.close(index);
			            	$("#jqGrid").trigger("reloadGrid");
			            	
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
	            	$("#FileUploadInput").val("");
	            	$("#progress").val("");
	            }
			});
		},
		exportFile:function(){
//			vm.q.launchTimeB=$("#beginTimePicker").val();
//			vm.q.launchTimeE=$("#endTimePicker").val();
			var timePicker = $("#TimePicker").val().split(" - ");
			if(timePicker!=null&&timePicker!=""){
			vm.q.launchTimeB=timePicker[0];
			vm.q.launchTimeE=timePicker[1];
			
			}else{
				vm.q.launchTimeB="";
				vm.q.launchTimeE="";
			}
			if(vm.q.recordType == undefined){
				vm.q.recordType = "";
			}
		
			if(vm.q.launchTimeB != "" && vm.q.launchTimeE != ""){
				if(vm.q.launchTimeB > vm.q.launchTimeE){
					alert("起始时间应该小于截止时间");
					return;
				}
			}
			
			var url = "hdfx/cdrdetail/querySum";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
			    async: false,
                contentType: "application/json;charset=utf-8",
			    data:JSON.stringify(vm.q),
			    success: function(r){
			    	if (r.code == 0) {
			    		 window.location.href= baseURL + 'hdfx/cdrdetail/exportFile?launchTimeB='+vm.q.launchTimeB+'&launchTimeE='+vm.q.launchTimeE+'&recordType='+vm.q.recordType+'&phoneNumber='+vm.q.phoneNumber+'&otherNumber='+vm.q.otherNumber;
					} else {
						alert(r.msg);
					}
				}
			});
			
		},
		reload: function (pageNum) {
			vm.showList = true;
			
//			vm.q.launchTimeB=$("#beginTimePicker").val();
//			vm.q.launchTimeE=$("#endTimePicker").val();
			var timePicker = $("#TimePicker").val().split(" - ");
			vm.q.launchTimeB=timePicker[0];
			vm.q.launchTimeE=timePicker[1] != undefined ? timePicker[1] : '';
			
			vm.q.phoneNumber=vm.q.phoneNumber.trim();
			vm.q.otherNumber=vm.q.otherNumber.trim();
			console.log("vm.q" + JSON.stringify(vm.q));
			if(vm.q.recordType == undefined){
				vm.q.recordType = "";
			}
			if(vm.q.launchTimeB != "" && vm.q.launchTimeE != ""){
				if(vm.q.launchTimeB > vm.q.launchTimeE){
					alert("起始时间应该小于截止时间");
					return;
				}
			}
		
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			if(pageNum != null && pageNum != undefined){
				page = pageNum;
			}
			$("#jqGrid").jqGrid('setGridParam',{ 
				postData:vm.q,
                page:page
            }).trigger("reloadGrid");
		},
		dateDefind: function () {
			laydate.render({
				  elem: '#TimePicker',
				  range: true,
				  trigger: 'click'
				});
			
		    laydate.render({
		    	  elem: '#connectTimePicker' ,
	    		  type: 'datetime',
	    		  format: 'yyyy-MM-dd HH:mm:ss',
    			  trigger: 'click'
	    	});
		    //});
		    laydate.render({
		    	  elem: '#hangUpTimePicker',
	    		  type: 'datetime',
	    		  format: 'yyyy-MM-dd HH:mm:ss',
	    		  trigger: 'click'
	    	});
			laydate.render({
				elem: '#releasetTimePicker' ,
				type: 'datetime',
				format: 'yyyy-MM-dd HH:mm:ss',
				trigger: 'click'
	    	});
		  //新增时间yjltTimePicker
			laydate.render({
				elem: '#evenDatePicker' ,
				type: 'date',
				format: 'yyyy-MM-dd HH:mm:ss',
				trigger: 'click'
	    	});
			 /*laydate.render({
		    	  elem: '#evenTimePicker' ,
	    		  type: 'time',
	    		  format: 'HH:mm:ss',
	    		  trigger: 'click'
	    	});*/
			
//		    $("#evenDatePicker").datetimepicker({
//		    	//startDate: s,
//		    	format: "yyyy-mm-dd",
//		        //日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
//		        minView: "2",
//		        language: 'zh-CN',
//		        autoclose: true,
//		        todayBtn: true,
//		        pickerPosition: "bottom-right"
//		    });
		    //高级查询结束时间
//		    $("#evenDatePicker").datetimepicker({
//		    	//startDate: s,
//		    	format: "yyyy-mm-dd HH:mm:ss",
//		        //日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
//		        minView: "2",
//		        language: 'zh-CN',
//		        autoclose: true,
//		        todayBtn: true,
//		        pickerPosition: "bottom-right"
//		    });
		},
		 getCurrentMonthFirst: function (){ 
		    	var date = new Date(); 
		    	date.setDate(1); 
		    	var month = parseInt(date.getMonth()+1); 
		    	var day = date.getDate(); 
		    	if (month < 10) { 
		    		month = '0' + month 
		    	} if (day < 10) { 
		    		day = '0' + day 
		    	} 
		    	return date.getFullYear() + '-' + month + '-' + day; 
		    },
		    getCurrentDate: function (){
		    var date=new Date();//伤害发生日期：用户可以按照伤害发生日期进行查询，必输项，默认为当天
		    var year = date.getFullYear();
		    var month = date.getMonth()+1;
		    var day = date.getDate();
		    if (month < 10) {
		        month = "0" + month;
		    }
		    if (day < 10) {
		        day = "0" + day;
		    }
		    return  year+"-"+month+"-"+day;
		},
	},
	created: function () {
		this.loadingDict();
	},
	mounted: function () {
		this.initPage();
	}
});
function progressHandlingFunction(e) {
	if (e.lengthComputable) {
		var percent = e.loaded / e.total;
        $("#progress-bar").css("width", (percent * 450));
	} 
}