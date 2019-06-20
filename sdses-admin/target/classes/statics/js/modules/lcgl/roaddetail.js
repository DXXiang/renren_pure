var ajax; //ajax对象
$(function () {
    
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: null,
		operationType: 'V',	//操作类型 V:查看 U:修改 A:新增
		required: false,	//输入框必填标识
		title: null,
		searchParams: {operator:'', lac:'', ci:'', timeB: '', timeE: ''},	//查询条件
		roadDetail: {},
		operatorDictList: [	//运营商
			{code:'移动', value: '移动'},
			{code:'联通', value: '联通'},
			{code:'电信', value: '电信'}],
	},
	methods: {
		/*********************************** 多窗口操作 B ***********************************/
		/**
		 * 初始化页面
		 */
		initPage: function(){
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
						$("body input,select,textarea").attr("disabled","disabled");
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
				var id = type_id.split('-')[1];
				var roadDetail = vm.getInfo(id);
	            if(roadDetail == null){
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
		 * 关闭当前页面，并打开距离最近的页面
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
		 * 关闭按钮 关闭页面
		 * 只做关闭操作
		 */
		closePageOnly: function(){
			var iframeId = self.frameElement.getAttribute('id');
			window.parent.closeIframeOnly(iframeId);
		},
		/**
		 * 切换页面
		 * 关闭当前页面，跳转到主页面
		 */
		switchPage: function(){
			//主页面 url
			var url = self.frameElement.getAttribute('src');
			//一、指定了跳转的 iframeId
			var goIframeId = self.frameElement.getAttribute('goIframeId');
			if(goIframeId != ''){
				window.parent.goNextById(goIframeId, vm.person, url);
			} 
			//二、跳转到主页面（查询页面）
			else {
				//1、主页面为 打开状态， 更新主页面表格数据
				if(window.parent.frames[self.frameElement.getAttribute('fatherId')] != undefined){
					window.parent.frames[self.frameElement.getAttribute('fatherId')].window.vm.query();
				}
				//2、跳转到主页面
				window.parent.goNext(url);
			}
		
			//三、关闭当前页面
			vm.closePageOnly();
		},
		/*********************************** 多窗口操作 E ***********************************/
		loadingTable: function(){
			$("#jqGrid").jqGrid({
		        url: baseURL + 'lcgl/roaddetail/list',
		        datatype: "json",
		        colModel: [			
					{ label: 'id', name: 'id', index: 'ID', key: true ,hidden:true},
					{ label: '经度', align: 'center', name: 'longitude', index: 'Longitude', width: 80 }, 			
					{ label: '纬度', align: 'center', name: 'latitude', index: 'Latitude', width: 80 }, 			
					{ label: '高德经度', align: 'center', name: 'gdLongitude', index: 'GD_Longitude', width: 80 }, 			
					{ label: '高德纬度', align: 'center', name: 'gdLatitude', index: 'GD_Latitude', width: 80 }, 			
					{ label: '时间', align: 'center', name: 'time', index: 'Time', width: 100 }, 			
					{ label: '大区号', align: 'center', name: 'lac', index: 'LAC', width: 60 }, 			
					{ label: '小区号', align: 'center', name: 'ci', index: 'CI', width: 60 }, 			
					{ label: '运营商', align: 'center', name: 'operator', index: 'Operator', width: 60 },
					{ label: '操作',align: 'center',sortable: false, name: '', index: '', width: 80 , formatter: function(value, grid, row, state){
						var str = '';
							str += '<a style="cursor: pointer" title="查看" onclick="vm.jumpPage(\'V-'+ row.id +'\')" "><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
							str += '<a style="cursor: pointer" title="修改" onclick="vm.jumpPage(\'U-'+ row.id +'\')" "><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
							str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteById('+ row.id +')" "><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
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
		query: function () {
			vm.reload(1);
		},
		reset: function() {
			confirm('确定要重置当前页面？', function(){
				vm.roadDetail = {longitude:'', latitude: '', gdLongitude: '', gdLatitude: '',lac: '', ci: '', operator: ''};
				$("#timePicker").val('');
			});
		},
		add: function(){
			this.showList = false;
			this.title = "新增";
			this.roadDetail = {longitude:'', latitude: '', gdLongitude: '', gdLatitude: '',lac: '', ci: '', operator: ''};
			this.operationType = 'A';
			this.required = true;
		},
		update: function (id) {
			this.showList = false;
            this.title = "修改";
            this.roadDetail = this.getInfo(id);
            this.operationType = 'U';
            this.required = true;
            
            $("#timePicker").val(this.roadDetail.time);
		},
		saveOrUpdate: function (event) {
			if(vm.roadDetail.longitude == ''){
	    		alert("请填写经度");
	    		return;
	    	} else {
	    		var msg = checkLong(vm.roadDetail.longitude);
	    		if(msg != true) {
	    			alert("经度格式错误</br>"+msg);
	    			return;
	    		}
	    	}
			if(vm.roadDetail.latitude == ''){
	    		alert("请填写纬度");
	    		return;
	    	} else {
	    		var msg = checkLat(vm.roadDetail.latitude);
	    		if(msg != true) {
	    			alert("纬度格式错误</br>"+msg);
	    			return;
	    		}
	    	}
			if(vm.roadDetail.gdLongitude == ''){
	    		alert("请填写高德经度");
	    		return;
	    	} else {
	    		var msg = checkLong(vm.roadDetail.gdLongitude);
	    		if(msg != true) {
	    			alert("高德经度格式错误</br>"+msg);
	    			return;
	    		}
	    	}
			if(vm.roadDetail.gdLatitude == ''){
	    		alert("请填写高德纬度");
	    		return;
	    	} else {
	    		var msg = checkLat(vm.roadDetail.gdLatitude);
	    		if(msg != true) {
	    			alert("高德纬度格式错误</br>"+msg);
	    			return;
	    		}
	    	}
			if(vm.roadDetail.lac == ''){
	    		alert("请填写大区号");
	    		return;
	    	} else {
	    		if(isPositiveInteger(vm.roadDetail.lac) != true) {
	    			alert("大区号格式不正确");
	    			return;
	    		}
	    	}
			if(vm.roadDetail.ci == ''){
	    		alert("请填写小区号");
	    		return;
	    	} else {
	    		if(isPositiveInteger(vm.roadDetail.ci) != true) {
	    			alert("小区号格式不正确");
	    			return;
	    		}
	    	}
			vm.roadDetail.time = $("#timePicker").val();
			if(vm.roadDetail.time == ''){
				alert("请选择通知时间");
	    		return;
	    	}
			if(vm.roadDetail.operator == ''){
				alert("请选择运营商");
	    		return;
	    	}
			
			var url = vm.roadDetail.id == null ? "lcgl/roaddetail/save" : "lcgl/roaddetail/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
			    contentType: "application/json;charset=utf-8",
			    data: JSON.stringify(vm.roadDetail),
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
		del: function (ids) {
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "lcgl/roaddetail/delete",
                    contentType: "application/json;charset=utf-8",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
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
		 * 逐条删除
		 */
		deleteById: function(id){
			vm.del([id]);
		},
		deleteBatch: function(){
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			vm.del(ids);
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
			var roadDetail = {};
			$.ajaxSettings.async = false;
			$.get(baseURL + "lcgl/roaddetail/info/"+id, function(r){
				roadDetail = r.roadDetail;
            });
			$.ajaxSettings.async = true;
			return roadDetail;
		},
		view:function(id){
			this.title = '查看';
			this.roadDetail = this.getInfo(id);
			this.operationType = 'V';
			this.showList = false;
			
			$("#timePicker").val(this.roadDetail.time);
		},
		reload: function (pageNum) {
			var timePickerSearch = $("#timePickerSearch").val().split(" - ");
			vm.searchParams.timeB=timePickerSearch[0];
			vm.searchParams.timeE=timePickerSearch[1] != undefined ? timePickerSearch[1] : '';
			if(vm.searchParams.operator == undefined){
				vm.searchParams.operator = '';
			}
			
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			if(pageNum != null && pageNum != undefined){
				page = pageNum;
			}
			$("#jqGrid").jqGrid('setGridParam',{ 
				postData:vm.searchParams,
                page:page
            }).trigger("reloadGrid");
		},
		resetSearch: function () {
			$("#timePickerSearch").val('');
			vm.searchParams = {operator:'', lac:'', ci:'', timeB: '', timeE: ''};
		},
		uploadFile: function(){
			$("#progress-bar").css("width", 0);
			var bool = false;  //加个锁
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "数据导入",
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
						url: baseURL + 'lcgl/roaddetail/uploadFile',
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
			            	console.log("data: " + JSON.stringify(data));
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
		dateDefind: function () {
			laydate.render({
			  elem: '#timePickerSearch',
			  range: true,
			  trigger: 'click'
			});
			laydate.render({
			  elem: '#timePicker',
			  type: 'datetime',
    		  format: 'yyyy-MM-dd HH:mm:ss',
    		  trigger: 'click'
			});
		},
		/******** 父页面调用 B ********/
		resize: function(){
			$(window).resize();
		},
		/******** 父页面调用 E ********/
	},
	created: function () {
		//页面参数
		var params = self.frameElement.getAttribute('params');
		//点击菜单列表进入 ，防止表格加载时 展示区域未定义
		if(params == 'undefined' || params == 'null'){
			this.showList = true;
		} else {
			this.showList = false;
		}
	},
	mounted: function () {
		this.initPage();
	}
});

//校验经度是否符合规范 //校验经度 
function checkLong(lng) {
	var longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,8})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,8}|180)$/;
	if (!longrg.test(lng)) {
		return '经度整数部分为0-180,小数部分为0到8位!';
	}
	return true;
}
//校验纬度是否符合规范 //纬度 
function checkLat(lat) {
	var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,8}|90\.0{0,8}|[0-8]?\d{1}|90)$/;
	if (!latreg.test(lat)) {
		return '纬度整数部分为0-90,小数部分为0到8位!';
	}
	return true;
}
function progressHandlingFunction(e) {
	if (e.lengthComputable) {
		var percent = e.loaded / e.total;
        $("#progress-bar").css("width", (percent * 450));
	} 
}
