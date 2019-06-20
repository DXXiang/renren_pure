var ajax; //ajax对象
function view(yjltId){
	
	vm.showList = false;
	vm.title = "查看详情";
	$.get(baseURL + "yjlt/yjlt/info/"+yjltId, function(r){
        vm.yjlt = r.yjlt;
        $("#yjltTimePicker").val(vm.yjlt.yjltDate);
    });
	
	//页面输入框、下拉框等，全部禁用
	$('#casePage input,#casePage select,#casePage textarea').attr("disabled","disabled");
	$('#savebut').hide();
	
	//$('#resetbut').hide();
	
}
function edit(yjltId){
	vm.showList = false;
	vm.title = "修改";
	$('#casePage input,#casePage select,#casePage textarea').removeAttr("disabled");
	$('#savebut').show();
	//$('#resetbut').hide();inputnumid
	$('#inputnumid').attr("disabled","disabled");
	$.get(baseURL + "yjlt/yjlt/info/"+yjltId, function(r){
        vm.yjlt = r.yjlt;
        $("#yjltTimePicker").val(vm.yjlt.yjltDate);
    });
}
var vm = new Vue({
	el:'#rrapp',
	data:{
		 q:{
	            name: '',
	          //  launchTimeB:null,
	           // launchTimeE:null,
	            numId:'',
	            remark:'',
	            isThree:'',
	            searchType:''
	        },
	    changeSearchButtonText: "高级查询",
	  //查询类型 0：全文检索；1：高级查询 【默认：0】
		searchType: '1',
		showList: null,
		title: null,
		yjlt: {},
		//性别
		sexList:{},
		outReasonList:{},
		familyReligionList:{},
	    optType : ""
	},
	methods: {
		/*********************************** 多窗口操作 B ***********************************/
		/**
		 * 初始化页面
		 */
		initPage: function(){
			//页面参数
			var params = self.frameElement.getAttribute('params');
			if(params != 'undefined' && params != 'null'){
				//新增
				if(params == 'A'){		
					this.showList = false;
					this.title = "新增";
					$('#resetbut').show();
				} else {
					var paramArr = params.split('-');
					var yjltId = paramArr[1];
					//修改
					if(paramArr[0] == 'U'){
						$('#resetbut').hide();
						this.showList = false;
						this.title = "修改";
						$('#casePage input,#casePage select,#casePage textarea').removeAttr("disabled");
						
						$('#savebut').show();
						this.yjlt = this.getInfo(yjltId);
						$("#yjltTimePicker").val(this.yjlt.yjltDate);
					}
					//查看
					else if(paramArr[0] == 'V'){
						$('#resetbut').hide();
						this.showList = false;
						this.title = "查看详情";
						this.yjlt = this.getInfo(yjltId);
						$("#yjltTimePicker").val(this.yjlt.yjltDate);
						//页面输入框、下拉框等，全部禁用
						$('#casePage input,#casePage select,#casePage textarea').attr("disabled","disabled");
						$('#savebut').hide();
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
			var yjltId = type_id.split('-')[1];
			/**
			 * 判断数据是否被处理
			 */
			vm.getInfo(yjltId);
            if(vm.yjlt.delFlag == -1){
				alert('数据已被删除，无法操作！');
				vm.reload(1);
				return;
			}
			
			//当前页面 url （与数据库中统一）
			var url = self.frameElement.getAttribute('src');
			var paramArr = type_id.split('-');
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
		    //性别
			if(dictListMap.has('sex')){
				this.sexList = dictListMap.get('sex');
			} else {
				$.get(baseURL + "sys/dict/listByType?type=sex", function(r){
			    	vm.sexList = r.dictList;
			    	dictListMap.set('sex', vm.sexList);
			    });
			}
		    //外出原因
		    if(dictListMap.has('outReason')){
				this.outReasonList = dictListMap.get('outReason');
			} else {
				$.get(baseURL + "sys/dict/listByType?type=outReason", function(r){
			    	vm.outReasonList = r.dictList;
			    	dictListMap.set('outReason', vm.outReasonList);
			    });
			}
		    //家庭宗教氛围
		    if(dictListMap.has('familyReligion')){
				this.familyReligionList = dictListMap.get('familyReligion');
			} else {
				$.get(baseURL + "sys/dict/listByType?type=familyReligion", function(r){
			    	vm.familyReligionList = r.dictList;
			    	dictListMap.set('familyReligion', vm.familyReligionList);
			    });
			}
		},
		/**
		 * 加载表格
		 */
		loadingTable: function(){
			$("#jqGrid").jqGrid({
		        url: baseURL + 'yjlt/yjlt/list/57',
		        datatype: "json",
		        colModel: [	
		        	{ label: 'id', name: 'yjltId', index: 'yjlt_id', hidden:true, key: true },
					{ label: '姓名',sortable: false, align: 'center',name: 'name', index: 'name', width: 80 }, 					
					{ label: '身份证号',sortable: false, align: 'center',name: 'numId', index: 'num_id', width: 80 }, 							
					{ label: '时间', align: 'center',name: 'yjltDate', index: 'yjlt_date', width: 80 }, 					
					{ label: '外出原因',align: 'center', name: 'outReason', index: 'out_reason', width: 80, formatter: function(value, options, row){
						 for(var i=0; i<vm.outReasonList.length; i++){
		 					if(vm.outReasonList[i].code == value){
		 						return vm.outReasonList[i].value;
		 					}
		 				}
			        	   return "";
						} }, 			
					{ label: '是否为"三类人员"亲属',align: 'center', name: 'isThree', index: 'is_three', width: 80 , formatter: function(value, options, row){
						 if(value=='0')
				        	   return "否";
						 else if(value=='1')
							   return "是";
						 else
							  return "";
					}		
					},
					{ label: '操作',sortable: false,align: 'center', name: '', index: '', width: 80 , formatter: function(value, grid, row, state){
						var str = '';
						//if(row.operation.allowView)
							str += '<a style="cursor: pointer" title="详情" onclick="vm.jumpPage(\'V-'+ row.yjltId +'\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
						//if(row.operation.allowEdit)
							str += '<a style="cursor: pointer" title="修改" onclick="vm.jumpPage(\'U-'+ row.yjltId +'\')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
						//if(row.operation.allowDelete)
							str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteById('+ row.yjltId +')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
//							str+= '<a style="cursor: pointer" title="详情" onclick="view('+ row.yjltId +')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
//							str += '<a style="cursor: pointer" title="修改" onclick="edit('+ row.yjltId +')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
//							str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteById('+ row.yjltId +')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
						return str;	
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
		},
		getInfo: function(yjltId){
			var yjlt = {};
			$.ajaxSettings.async = false;
			$.get(baseURL + "yjlt/yjlt/info/"+yjltId, function(r){
                //this.yjlt = r.yjlt;
                yjlt = r.yjlt;
            });
			$.ajaxSettings.async = true;
			return yjlt;
		},
		query: function () {
			vm.reload(1);
		},
		resetSearch: function () {
			$("#TimePicker").val("");
			vm.q={name: '', numId:'',remark:'', isThree:'',searchType:''};
			//查询除原来的传递参数，并逐个清空 B
			var postDataTemp = $("#jqGrid").jqGrid("getGridParam", "postData");
			delete postDataTemp["name"];
			delete postDataTemp["numId"];
			delete postDataTemp["remark"];
			delete postDataTemp["isThree"];
			delete postDataTemp["searchType"];
		},
	
		changeSearchType:function () {
			//当前为“全文检索”，切换为“高级查询”
			vm.searchType = (vm.searchType == '0' ? '1' : '0');
			vm.changeSearchButtonText = (vm.searchType == '0' ? '高级查询' : '全文检索');
		},
		add: function(){
			vm.clearPage();
			vm.showList = false;
			vm.title = "新增";
			vm.optType = "add";	
		},
		
		update: function (event) {
			var yjltId = getSelectedRow();
			if(yjltId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(yjltId)
		},
		saveOrUpdate: function (event) {
			vm.yjlt.yjltDate=$("#yjltTimePicker").val();
			vm.yjlt.createType='0';
			if(vm.yjlt.name==null||vm.yjlt.name.trim() == ''){
				alert("请填写姓名");
		        return false;
			}
			if(!vm.yjlt.sex){
				alert("请选择性别");
		        return false;
			}
			if(vm.yjlt.age==null||vm.yjlt.age.trim() == ''){
				alert("请填写年龄");
		        return false;
			}
		    if (!/^[-+]?\d+$/.test(vm.yjlt.age)||vm.yjlt.age<=0) {
		    	alert("请填写正确的年龄");
		        return false;
		    }
			if(!checkNumId(vm.yjlt.numId)||vm.yjlt.numId.trim() == ''){
                return false;
			} 
			if(vm.yjlt.homePlace==null||vm.yjlt.homePlace.trim() == ''){
				alert("请填写户籍地");
		        return false;
			}
			if(vm.yjlt.yjltDate==null||vm.yjlt.yjltDate.trim() == ''){
				alert("请填写时间");
		        return false;
			}
			if(vm.yjlt.outReason==null||vm.yjlt.outReason.trim() == ''){
				alert("请填写外出原因");
		        return false;
			}
			
			var url = vm.yjlt.yjltId == null ? "yjlt/yjlt/save" : "yjlt/yjlt/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json;charset=utf-8",
			    data: JSON.stringify(vm.yjlt),
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
		batchDel: function () {
			var yjltIds = getSelectedRows();
			if(yjltIds == null){
				return ;
			}
			
		
			confirm('确定要删除选中的记录？', function(){
				
				$.ajax({
					type: "POST",
				    url: baseURL + "yjlt/yjlt/delete",
                    contentType: "application/json;charset=utf-8",
				    data: JSON.stringify(yjltIds),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								//$("#jqGrid").trigger("reloadGrid");
								//vm.reload(1);
								vm.delReload(yjltIds, $("#jqGrid"));
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		deleteById: function (yjltId) {
			confirm('确定要删除当前记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "yjlt/yjlt/delete",
                    contentType: "application/json;charset=utf-8",
				    data: '["' + yjltId + '"]',
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								//$("#jqGrid").trigger("reloadGrid");
								vm.delReload([yjltId], $("#jqGrid"));
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
				shade:false,
				content: jQuery("#fileLayer"),
				btn: ['上传','取消'],
				btn1: function (index) {
					if(bool) {
						return;
					}
					bool = true;
					var files = vm.$refs.yjltfile.files;
					if(files.length < 1){
						alert("请选择上传的文件");
						bool = false;
						return;
					}
	                var date = new Date();
					
					var formData = new FormData();  
					formData.append('files', files[0]);
					
					ajax = $.ajax({
						url: baseURL + 'yjlt/yjlt/importFile',
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
			            	
			            		
			            		alert("上传成功");
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
		reload: function (pageNum) {
			vm.showList = true;
			var timePicker = $("#TimePicker").val().split(" - ");
			vm.q.searchType = vm.searchType;
			vm.q.launchTimeB=timePicker[0];
			vm.q.launchTimeE=timePicker[1];
			vm.q.name=vm.q.name.trim();
			vm.q.numId=vm.q.numId.trim();
			vm.q.remark=vm.q.remark.trim();
			if(vm.q.launchTimeB != "" && vm.q.launchTimeE != ""){
				if(vm.q.launchTimeB > vm.q.launchTimeE){
					alert("起始时间应该小于截止时间");
					return;
				}
			}
			
		//	me)alert(JSON.stringify(vm.q.na);
			
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			if(pageNum != null && pageNum != undefined){
				page = 1;
			}
			
			$("#jqGrid").jqGrid('setGridParam',{ 
				postData:vm.q,
                page:page
            }).trigger("reloadGrid");
			
		},
		//清理数据
		clearPage:function(){
			 vm.yjlt={};
			//页面输入框、下拉框等，全部解禁
			$('#casePage input,#casePage select,#casePage textarea').removeAttr("disabled");
			$('#savebut').show();
			//$('#resetbut').show();
			 $("#yjltTimePicker").val('');
		},
		
		dateDefind: function () {
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
			laydate.render({
				  elem: '#TimePicker',
				  range: true,
				  trigger: 'click'
				});
			
		    //新增时间yjltTimePicker
			 laydate.render({
		    	  elem: '#yjltTimePicker' ,
		    		  type: 'date',
		    		  format: 'yyyy-MM-dd',
		    		  trigger: 'click'
		    	});
			
			
//		    $("#yjltTimePicker").datetimepicker({
//		    	//startDate: s,
//		    	format: "yyyy-mm-dd",
//		        //日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
//		        minView: "2",
//		        language: 'zh-CN',
//		        autoclose: true,
//		        todayBtn: true,
//		        pickerPosition: "bottom-right"
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
		this.dateDefind();
		//初始化页面
		this.initPage();
	}
	
});

function progressHandlingFunction(e) {
	if (e.lengthComputable) {
		var percent = e.loaded / e.total;
        $("#progress-bar").css("width", (percent * 450));
	} 
}