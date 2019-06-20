$(function () {
	initPage();
});

/**
 * 初始化页面 加载 bootstraptable 
 * @returns
 */
function initPage(){
	var params = self.frameElement.getAttribute('params');
	//点击菜单列表进入 ，防止表格加载时 展示区域未定义
	if(params != 'undefined' && params != 'null'){
		//修改
		if(vm.operationType == 'U'){
			$("#telTable").bootstrapTable('append', vm.person.telList);
	        $("#chatTable").bootstrapTable('append', vm.person.chatList);
	        $("#familyPersonTable").bootstrapTable('append', vm.person.familyPersonList);
	        $("#majorPersonTable").bootstrapTable('append', vm.person.majorPersonList);
		} else if(vm.operationType == 'V'){
			$("#telTable").bootstrapTable('append', vm.person.telList);
	        $("#chatTable").bootstrapTable('append', vm.person.chatList);
	        $("#familyPersonTable").bootstrapTable('append', vm.person.familyPersonList);
	        $("#majorPersonTable").bootstrapTable('append', vm.person.majorPersonList);
	        //隐藏复选框列
			$("#telTable").bootstrapTable('hideColumn', 'checkBox');
			$("#chatTable").bootstrapTable('hideColumn', 'checkBox');
			$("#familyPersonTable").bootstrapTable('hideColumn', 'checkBox');
			$("#majorPersonTable").bootstrapTable('hideColumn', 'checkBox');
		}
		
		//更新 关系图谱
		vm.updateIframeTel();
		vm.updateIframePerson();
	}
}

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: null,
		operationType: 'V',	//操作类型 V:查看 U:修改 A:新增
		required: false,	//输入框必填标识
		title: null,
		person: {},
		originalPerson: {},		//原始的person对象，更新时校验使用
		
		tel: {},		//通讯工具
		chat: {},		//社交工具
		
		relation: {},	//关系（家庭、重要）
		
		relationType: '',	// 1：家族；2：重要
		
		/**** 字典值 B ****/
		sexDictList: null,				//性别
		keyPersonTypeDictList: null,	//重点人员类型
		religionDictList:null,			//宗教信仰
		fearTypeDictList:null,			//涉恐类型
		chatTypeDictList:null,			//社交工具
		
		isMarriedDictList: [	//婚姻状况
			{code:0, value: '未婚'},
			{code:1, value: '已婚'}],
		isSinDictList: [		//是否有前科
			{code:0, value: '否'},
			{code:1, value: '是'}],
		activeDictList: [		//活跃指数
			{code:1, value: '高'},
			{code:2, value: '中'},
			{code:3, value: '低'}],
		userTypeList : [		//用户类型
			{value:"发送人员", code:1, cssClass:'primary'},
			{value:"接收人员", code:2, cssClass:'success'},
			{value:"涉线人员", code:3, cssClass:'info'}],
		/**** 字典值 E ****/
		
		//查询条件
		searchParams: {name:'', sex:'', placeNative:'', numId:"", nickname:""},
		
		relationSearchParams: {},
		
		hostIP: window.location.host.split(":")[0],
		variableNeo4jHost: window.parent.vm.variableNeo4jHost,
		showButtonExport: false,		//是否显示导出按钮
	},
	methods: {
		
		/*********************************** 多窗口操作 B ***********************************/
		/**
		 * 初始化页面
		 */
		initPage: function(){
			//页面参数
			var params = self.frameElement.getAttribute('params');
			if(params != undefined && params != 'undefined' && params != 'null'){
				//新增
				if(params == 'A'){		
					this.add();
				} else {
					var paramArr = params.split('-');
					//修改
					if(paramArr[0] == 'U'){
						//1、自动识别
						if(paramArr[1].toString().startsWith('T')){
							this.updatePersonFromAuto(paramArr[1]);
						}
						//2、数据库
						else {
							this.updatePerson(paramArr[1]);
						}
					}
					//查看
					else if(paramArr[0] == 'V'){
						this.viewPerson(paramArr[1]);
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
				var personId = type_id.split('-')[1];
				var person = vm.getInfo(personId);
	            if(person.delFlag == -1){
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
		/**
		 * 加载字典值
		 */
		loadingDict: function(){
			var dictListMap = window.parent.vm.dictListMap;
			this.sexDictList = dictListMap.get('sex');						//性别
			this.keyPersonTypeDictList = dictListMap.get('keyPersonType');	//重点人员类型
			this.keyPersonNatureDictList = dictListMap.get('keyPersonNature');	//重点人员类型
			this.religionDictList = dictListMap.get('religion');			//宗教信仰
			this.fearTypeDictList = dictListMap.get('fearType');			//涉恐类型
			this.chatTypeDictList = dictListMap.get('chatType');			//社交工具
		},
		/**
		 * 加载表格
		 */
		loadingTable: function(){
		    $("#jqGrid").jqGrid({
		        url: baseURL + 'qxda/person/list',
		        datatype: "json",
		        colModel: [			
					{ label: '序号', hidden:true, name: 'personId', index: 'person_id', width: 50, key: true },
					{ label: '姓名', sortable: false, name: 'name', index: 'name', width: 80 }, 			
					{ label: '性别', align: 'center',name: 'sex', index: 'sex', width: 40, formatter: function(value, options, row){
						for(var i=0; i<vm.sexDictList.length; i++){
		 					if(vm.sexDictList[i].code == value){
		 						return vm.sexDictList[i].value;
		 					}
 						}
						return "";
					}}, 			
					{ label: '籍贯', sortable: false, name: 'placeNative', index: 'place_native', width: 180 }, 			
					{ label: '身份证号', sortable: false, align: 'center', name: 'numId', index: 'num_id', width: 100 }, 			
					{ label: '昵称', sortable: false, align: 'center', name: 'nickname', index: 'nickname', width: 80 },
					{ label: '操作', sortable: false, align: 'center', width: 80, formatter: function(value, grid, row, state){
						var str = "";
						str += '<a style="cursor: pointer" title="查看" onclick="vm.jumpPage(\'V-'+ row.personId + '\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
						str += '<a style="cursor: pointer" title="修改" onclick="vm.jumpPage(\'U-'+ row.personId + '\')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
						str += '<a style="cursor: pointer" title="删除" onclick="vm.deletePersonById('+ row.personId +')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
						str += '<a style="cursor: pointer" title="导出" onclick="vm.exportToWord('+ row.personId +')"><span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span></a>';
						return str;
					}},
		        ],
		        cellEdit: false,
		        rownumbers: true,
		        sortable: false,
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
		        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
		        }
		    });
		},
		
		/**
		 * 重置搜索条件
		 */
		resetSearch: function(){
			vm.searchParams = {name:'', sex:'', placeNative:'', numId:"", nickname:""};
			//查询除原来的传递参数，并逐个清空 B
			var postDataTemp = $("#jqGrid").jqGrid("getGridParam", "postData");
			delete postDataTemp["name"];
			delete postDataTemp["sex"];
			delete postDataTemp["placeNative"];
			delete postDataTemp["numId"];
			delete postDataTemp["nickname"];
		},
		userTypeClick: function(code){
			vm.person.userType = code;
		},
		/*clearInput: function(event){
			//获取点击对象      
			var el = event.currentTarget;
			alert("当前对象的内容："+JSON.stringify(event.target));
		},*/
		/**
		 * 清理数据
		 */
		clearPage:function(){
			vm.person = {pathHead: '', pathVoice: '', personType: '', personNature: ''};
			vm.originalPerson = {};
			vm.tel = {};		//通讯工具
			vm.chat = {};		//社交工具
			
			$("#telTable").bootstrapTable('removeAll');
			$("#chatTable").bootstrapTable('removeAll');
			$("#familyPersonTable").bootstrapTable('removeAll');
			$("#majorPersonTable").bootstrapTable('removeAll');
			
			$("#familyPersonTable").bootstrapTable('showColumn', 'checkBox');
			$("#majorPersonTable").bootstrapTable('showColumn', 'checkBox');
			
			$('#photoFile').val('');
			$('#voiceFile').val('');
		},
		query: function () {
			vm.reload(1);
		},
		reset: function() {
			confirm('确定要重置当前页面？', function(){
				vm.clearPage();
			});
		},
		//返回
		back: function() {
        	if(window.parent.vm.isEditted) {
        		confirm('页面尚未保存，您确定要离开页面吗？', function(){
        			layer.closeAll();
        			vm.reload();
        			window.parent.vm.isEditted = false;
        		});
        	} else {
        		layer.closeAll();
        		vm.reload();
        	}
        },
        /**
         * 导出
         */
        exportToWord: function(personId){
        	var url = baseURL + "qxda/person/exportToWord/"+personId;
        	window.location.href = url;
        },
        /**
         * 批量导出
         */
        batchExportToWord: function (event) {
			var personIds = getSelectedRows();
			if(personIds == null){
				return ;
			}
			var url = baseURL + "qxda/person/batchExportToWord?personIdsStr="+personIds;
			window.location.href = url;
		},
		add: function(){
			//vm.clearPage();
			this.showList = false;
			this.title = "新增";
			this.operationType = 'A';
			this.required = true;
			this.person = {pathHead: '', pathVoice: '', personType: '', personNature: ''};
		},
		update: function (event) {
			var personId = getSelectedRow();
			if(personId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            vm.operationType = 'U';
        	vm.required = true;
        	
            vm.getInfo(personId);
		},
		/**
		 * 更新页面
		 */
		updatePerson: function (personId) {
			//vm.clearPage();
			this.showList = false;
            this.title = "修改";
            this.operationType = 'U';
        	this.required = true;
        	this.person = this.getInfo(personId);
            
        	this.originalPerson = this.person;
		},
		/*
		 * 自动识别 用户更新
		 * 情报研判页面 涉案人员bootstrapTable表 的id
		 */
		updatePersonFromAuto: function(personIdTemp) {
			this.showList = false;
            this.title = "修改";
            this.operationType = 'U';
        	this.required = true;
        	var personTemp = self.frameElement.getAttribute('dataParams');
        	this.person = JSON.parse(personTemp);
        	console.log("this.person : " + JSON.stringify(this.person));
    		//清空 personId，保存时 执行新增操作
        	this.person.personId = null;
        	this.person.familyPersonList = [];
        	this.person.majorPersonList = [];
        	for(var i=0; i<this.sexDictList.length; i++){
				if(this.sexDictList[i].value == this.person.sex){
					this.person.sex = this.sexDictList[i].code;
					break;
				}
			}
        	this.person.personIdTemp = personIdTemp;
        	// 初始化 通讯工具
        	if(this.person.telList.length > 0){
        		for(var i in this.person.telList){
        			this.person.telList[i].id = "T" + i;
        			this.person.telList[i].owner = "";
        			this.person.telList[i].user = "";
        		}
        	}
        	// 初始化 社交工具
        	if(this.person.chatList.length > 0){
        		for(var i in this.person.chatList){
        			this.person.chatList[i].id = "T" + i;
        			this.person.chatList[i].type = "";
        			this.person.chatList[i].nickname = "";
        		}
        	}
		},
		
		saveOrUpdate: function (event) {
			//console.log("vm.person1 : " + JSON.stringify(vm.person));
			if((vm.person.name == undefined || vm.person.name.trim() == '') && 
					(vm.person.numId == undefined || vm.person.numId.trim() == '') && 
					(vm.person.nickname == undefined || vm.person.nickname.trim() == '')){
				alert('至少录入"姓名"、"身份证号"、"昵称"中的一项！');
				return;
			}
			if(vm.changePersonNumId(event) != true){
				return;
			}
			
			//获取通讯工具列表数据
			var telList = $("#telTable").bootstrapTable('getData');
			if(telList.length > 0){
				for (var index in telList) {
	    			if( telList[index].id == undefined || telList[index].id.toString().startsWith('T')){
	    				telList[index].id = null;
	    			}
				}
			}
			vm.person.telList = telList;
			//获取社交工具列表数据
			var chatList = $("#chatTable").bootstrapTable('getData');
			if(chatList.length > 0){
				for (var index in chatList) {
	    			if(chatList[index].id == undefined || chatList[index].id.toString().startsWith('T')){
	    				chatList[index].id = null;
	    			}
				}
			}
			vm.person.chatList = chatList;
			
			//获取家族关系列表数据
			var familyPersonList = $("#familyPersonTable").bootstrapTable('getData');
			if(familyPersonList.length > 0){
				for (var index in familyPersonList) {
	    			if(familyPersonList[index].id.toString().startsWith('T')){
	    				familyPersonList[index].id = null;
	    			}
				}
			}
			
			vm.person.familyPersonList = familyPersonList;
			
			//获取重要关系列表数据
			var majorPersonList = $("#majorPersonTable").bootstrapTable('getData');
			if(majorPersonList.length > 0){
				for (var index in majorPersonList) {
	    			if(majorPersonList[index].id.toString().startsWith('T')){
	    				majorPersonList[index].id = null;
	    			}
				}
			}
			vm.person.majorPersonList = majorPersonList;
			
			var url = vm.person.personId == null ? "qxda/person/save" : "qxda/person/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json;charset=utf-8",
			    data: JSON.stringify(vm.person),
			    success: function(r){
			    	if(r.code === 0){
			    		//数据保存后返回 personId，若跳转到 情报研判 模块则需要
			    		if(vm.person.personId == null){
			    			vm.person.personId = r.person.personId;
			    		}
			    		/*layer.msg('操作成功',{
			    			  icon: 1,
			    			  time: 2000 //2秒关闭（如果不配置，默认是3秒）
			    			}, function(index){
			    				vm.switchPage();
			    			}
		    			);*/
			    		alert('操作成功',function(){
			    			vm.switchPage();
			    		});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (personIds) {
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "qxda/person/delete",
                    contentType: "application/json;charset=utf-8",
				    data: JSON.stringify(personIds),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								//$("#jqGrid").trigger("reloadGrid");
								vm.delReload(personIds, $("#jqGrid"));
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
		/**
		 * 批量删除
		 */
		deletePersonBatch: function(event){
			var personIds = getSelectedRows();
			if(personIds == null){
				return ;
			}
			vm.del(personIds);
		},
		/**
		 * 逐条删除
		 */
		deletePersonById: function(personId){
			//console.log("personId: " + personId);
			//console.log("JSON.stringify(personIds): " + JSON.stringify(personId));
			vm.del([personId]);
		},
		getInfo: function(personId){
			var person = {};
			$.ajaxSettings.async = false;
			$.get(baseURL + "qxda/person/info/"+personId, function(r){
                //this.person = r.person;
                person = r.person;
            });
			$.ajaxSettings.async = true;
			return person;
		},
		viewPerson: function(personId){
			this.title = '查看';
			this.person = this.getInfo(personId);
			this.operationType = 'V';
			this.showList = false;
			this.showButtonExport = true;
		},
		reload: function (pageNum) {
			//删除查询条件前后空格
			vm.searchParams.name=vm.searchParams.name.trim();
			vm.searchParams.placeNative=vm.searchParams.placeNative.trim();
			vm.searchParams.numId=vm.searchParams.numId.trim();
			vm.searchParams.nickname=vm.searchParams.nickname.trim();
			
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			if(pageNum != null && pageNum != undefined){
				page = 1;
			}
			$("#jqGrid").jqGrid('setGridParam',{ 
				postData:vm.searchParams,
                page:page
            }).trigger("reloadGrid");
		},
		
		/****************************** 新增修改页面 B ******************************/
		/**
		 * 身份证号码 change事件
		 */
		changePersonNumId: function(event){
			event.stopPropagation();
			var checked = false;
			$.ajaxSettings.async = false;
			if(vm.person.numId == undefined || vm.person.numId == null || vm.person.numId.trim().length == 0) {
				checked = true;
			}
			//身份证校验成功，查询数据库
			else if(checkNumId(vm.person.numId.trim())){
				if(vm.person.numId.trim() != vm.originalPerson.numId) {
					$.get(baseURL + "qxda/person/infoByNumId/"+vm.person.numId.trim(), function(r){
		                if(r.person != null){
		                	//修改页面
		                	if(vm.operationType == 'U'){
		                		alert("身份证号已存在，请重新输入！");
		                	} else if(vm.operationType == 'A'){
		                		alert('身份证号已存在，信息自动带出，当前页变更为修改页！');
		                		vm.person = vm.getInfo(r.person.personId);
		                		vm.operationType = 'U';
		                		vm.originalPerson.numId = vm.person.numId;
								vm.title = "修改";
								//修改顶部标签页 为修改标签
								var iframeId = self.frameElement.getAttribute('id');
								var btnTag = $("#btn-"+iframeId , parent.document);
								btnTag.children(':first').html('全息档案<i class="fa fa-wrench" aria-hidden="true"></i>')
								
								initPage();
						        checked = false;
		                	}
		                } else {
		                	checked = true;
		                }
		            });
				} else {
					checked = true;
				}
			} 
			$.ajaxSettings.async = true;
			return checked;
		},
		
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
				url: baseURL + 'common/comfile/uploadFile/2',
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
						vm.person.pathHead = baseURL + data.file.path;
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
			console.log("vm.person : " + JSON.stringify(vm.person));
		},
		
		/**
		 * 上传声纹特征进度条
		 */
		voiceProgressHandlingFunction: function(e) {
			if (e.lengthComputable) {
				var percent = e.loaded / e.total;
		        $("#voiceProgressBar .progress-bar").css("width", (percent * parseInt($("#voiceProgressBar").css("width"))));
			} 
		},
		/**
		 * 声纹特征上传
		 */
		uploadPersonVoice: function(){
			var files = vm.$refs.voiceFile.files;
			if(files.length < 1){
				alert("请选择上传的文件");
				return;
			} else {
                //检验文件类型是否正确
                var exec = (/[.]/.exec(files[0].name)) ? /[^.]+$/.exec(files[0].name.toLowerCase()) : '';
                if (exec != "mp3" && exec != 'wav' && exec != 'ogg') {
                    alert("文件格式不正确，请上传MP3、Wav、Ogg类型文件!");
                    return false;
                }
            }
			
			var formData = new FormData();  
			formData.append('files', files[0]);
			ajax = $.ajax({
				url: baseURL + 'common/comfile/uploadFile/3',
				type: 'POST',
				dataType: 'json',
				cache: false,
				data: formData,
				xhr: function(){
	            	myXhr = $.ajaxSettings.xhr();
	            	if(myXhr.upload){
	            		myXhr.upload.addEventListener('progress',vm.voiceProgressHandlingFunction, false);
	            	}  
	            	return myXhr; //xhr对象返回给jQuery使用  
	            },
				processData: false,
				contentType: false,
			    beforeSend: function(){
			    	$("#voiceUploadBtn").hide();
			    	$("#voiceProgressBar").show();
	            },
				success: function(data){
					if(data.code=="0"){
						vm.person.pathVoice = baseURL + data.file.path;
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
	            	$("#voiceProgressBar .progress-bar").css("width", 0);
	            	$("#voiceProgressBar").hide();
	            	$("#voiceUploadBtn").show();
	            }
			});
		},
		/**
		 * 打开音频播放页面
		 */
		showVoiceModal: function(){
			$("#voiceModal").modal("show");
			$('audio')[0].play();
		},
		/**
		 * 隐藏音频播放页面
		 */
		hideVoiceModal: function(){
			$("#voiceModal").modal("hide");
			$('audio')[0].pause();
		},
		personTypeChange: function(){
			/*console.log(vm.person.personType);
			vm.keyPersonNatureDictList = window.parent.vm.dictListMap.get('keyPersonNature');*/
		},
		/****************************** 新增修改页面 E ******************************/
		
		/****************************** layer页面 B ******************************/
		/*************** 通讯工具layer B***************/
		/**
		 * 新增、修改通讯工具弹窗页面
		 * id 主键，-1：新增；其他：更新
		 */
		editTelLayer: function(telId){
			var title = '';
			if(telId == -1){
				title = '新增通讯工具';
				vm.tel = {
					id: "T" + new Date().getTime(),	
					num: '',
					owner: '',
					user: ''
				};
			} else {
				title = '修改通讯工具';
				vm.tel = $('#telTable').bootstrapTable('getRowByUniqueId', telId);
			}
			
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: title,
				area: ['350px', '270px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#telLayer"),
				btn: ['确认','取消'],
				btn1: function (index) {
					if(vm.tel.num.trim().length <= 0){
						alert('请填写"号码"!');
						return;
					} else if (vm.tel.owner.trim().length <= 0){
						alert('请填写"机主"!');
						return;
					}
					//新增
					if(telId == -1){
						$("#telTable").bootstrapTable('append', vm.tel);
					}
					//修改
					else {
						$("#telTable").bootstrapTable('updateByUniqueId', {id: vm.tel.id, row: vm.tel});
					}
					vm.updateIframeTel();
					layer.close(index);
					vm.tel = {};
				},
				btn2: function (index) {
					//清空页面数据
					$("#repulseReason").val("");
				}
			});
		},
		/**
		 * 查看通讯工具弹窗页面
		 */
		viewTelLayer: function(telId){
			vm.tel = $('#telTable').bootstrapTable('getRowByUniqueId', telId);
			$('#telLayer input').attr("disabled","disabled");
			
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: '查看通讯工具',
				area: ['350px', '270px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#telLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
					vm.tel = {};
				}
			});
		},
		/**
		 * 逐条删除
		 */
		removeTel: function(telId){
			confirm('确定要删除通讯工具？', function(){
				$("#telTable").bootstrapTable('removeByUniqueId', telId);
				alert("删除成功");
				vm.updateIframeTel();
			});
		},
		/**
		 * 批量删除
		 */
		removeBatchTel: function(){			
			var selectTels = $('#telTable').bootstrapTable('getSelections');
			if(selectTels.length < 1){
				alert("请至少选择一条记录");
				return;
			}
			confirm('确定要删除选中的通讯工具？', function(){
				var telIds = [];
				for(var i=0; i<selectTels.length; i++){
					telIds.push(selectTels[i].id);
				}
				$('#telTable').bootstrapTable('remove', {field: 'id', values: telIds}); 
				alert("删除成功");
				vm.updateIframeTel();
			});
		},
		/**
		 * 格式化操作栏
		 */
		telFormatter: function(value, row){
			if(vm.operationType=="V"){
				return '<a style="cursor: pointer" title="查看" onclick="vm.viewTelLayer('+row.id+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';		
			} else {
				return '<a style="cursor: pointer" title="修改" onclick="vm.editTelLayer(\''+row.id+'\')" ><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>'+'<a style="cursor: pointer" title="删除" onclick="vm.removeTel(\''+row.id+'\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
			}
		},
		//更新 通联关系图谱
		updateIframeTel: function(){
			var params = {};
			params.telList = $("#telTable").bootstrapTable('getData');
			$("#iframeTel").attr('src','http://'+vm.variableNeo4jHost+"/telephoneRelationship?params=" + JSON.stringify(params));
		},
		/*************** 通讯工具layer E***************/
		
		/*************** 社交工具layer B***************/
		/**
		 * 新增、修改社交工具弹窗页面
		 * id 主键，-1：新增；其他：更新
		 */
		editChatLayer: function(chatId){
			var title = '';
			if(chatId == -1){
				title = '新增社交工具';
				vm.chat = {
					id: "T" + new Date().getTime(),	
					type: '',
					nickname: '',
					num: ''
				};
			} else {
				title = '修改社交工具';
				vm.chat = $('#chatTable').bootstrapTable('getRowByUniqueId', chatId);
			}
			
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: title,
				area: ['350px', '270px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#chatLayer"),
				btn: ['确认','取消'],
				btn1: function (index) {
					if(vm.chat.type == undefined || vm.chat.type == ''){
						alert('请选择"类型"!');
						return;
					} else if (vm.chat.nickname.trim().length <= 0){
						alert('请填写"昵称"!');
						return;
					} else if (vm.chat.num.trim().length <= 0){
						alert('请填写"号码"!');
						return;
					}
					//新增
					if(chatId == -1){
						$("#chatTable").bootstrapTable('append', vm.chat);
					}
					//修改
					else {
						$("#chatTable").bootstrapTable('updateByUniqueId', {id: vm.chat.id, row: vm.chat});
					}
					layer.close(index);
					vm.chat = {};
				},
				btn2: function (index) {
					//清空页面数据
					$("#repulseReason").val("");
				}
			});
		},
		/**
		 * 查看社交工具弹窗页面
		 */
		viewChatLayer: function(chatId){
			vm.chat = $('#chatTable').bootstrapTable('getRowByUniqueId', chatId);
			$('#chatLayer input,#chatLayer select').attr("disabled","disabled");
			
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: '查看社交工具',
				area: ['350px', '270px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#chatLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
					vm.chat = {};
				}
			});
		},
		/**
		 * 逐条删除
		 */
		removeChat: function(chatId){
			confirm('确定要删除社交工具？', function(){
				$("#chatTable").bootstrapTable('removeByUniqueId', chatId);
				alert("删除成功");
			});
		},
		/**
		 * 批量删除
		 */
		removeBatchChat: function(){			
			var selectChats = $('#chatTable').bootstrapTable('getSelections');
			if(selectChats.length < 1){
				alert("请至少选择一条记录");
				return;
			}
			confirm('确定要删除选中的社交工具？', function(){
				var chatIds = [];
				for(var i=0; i<selectChats.length; i++){
					chatIds.push(selectChats[i].id);
				}
				$('#chatTable').bootstrapTable('remove', {field: 'id', values: chatIds}); 
				alert("删除成功");
			});
		},
		/**
		 * 格式化“类型”列
		 */
		chatTypeFormatter: function(value, row){
			if(value !=null && value != ""){
				for (var index in vm.chatTypeDictList) {
	    			if(vm.chatTypeDictList[index].code == value){
	    				return vm.chatTypeDictList[index].value;
	    			}
				}
			}
			return "";
		},
		/**
		 * 格式化“操作”列
		 */
		chatFormatter: function(value, row){
			if(vm.operationType=="V"){
				return '<a style="cursor: pointer" title="查看" onclick="vm.viewChatLayer('+row.id+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';		
			} else {
				return '<a style="cursor: pointer" title="修改" onclick="vm.editChatLayer(\''+row.id+'\')" ><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>'+'<a style="cursor: pointer" title="删除" onclick="vm.removeChat(\''+row.id+'\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
			}
		},
		/*************** 社交工具layer E***************/
		
		/*************** 关系(家族、重要)layer B***************/
		/**
		 * 人员查询
		 * type 1：家族；2：重要
		 */
		searchPersonLayer: function(relationType){
			vm.relationType = relationType;
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "人员查询",
				area: ['740px', '450px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#searchPersonLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
				}
			});
			
			vm.relationSearchParams = {};
			//获取已经选择的 编号列表，下次查询不再显示
			var familyPersonList = $("#familyPersonTable").bootstrapTable('getData');
			var majorPersonList = $("#majorPersonTable").bootstrapTable('getData');
			var selectedIds = [];
			if(vm.operationType == 'U'){	//页面为修改页面
				selectedIds.push(vm.person.personId);
			}
			if(familyPersonList.length > 0){
				for(var i in familyPersonList){
					selectedIds.push(parseInt(familyPersonList[i].relationPersonId));
				}	
			}
			if(majorPersonList.length > 0){
				for(var i in majorPersonList){
					selectedIds.push(parseInt(majorPersonList[i].relationPersonId));
				}	
			}
			//已选择的id列表
			if(selectedIds.length > 0){
				vm.relationSearchParams.selectedIds = JSON.stringify(selectedIds).replace('[','(').replace(']',')');
			}
			/********************** 再次加载 B **********************/
			if($("#jqGridRelatedPerson").jqGrid('getDataIDs').length > 0){
				$("#jqGridRelatedPerson").setGridWidth(697);
				//查询除原来的传递参数，并逐个清空 B
				var postData2 = $("#jqGridRelatedPerson").jqGrid("getGridParam", "postData");
				delete postData2["name"];
				delete postData2["numId"];
				delete postData2["selectedIds"];
				//查询除原来的传递参数，并逐个清空 E
				postData2 = vm.relationSearchParams;
				
				$("#jqGridRelatedPerson").jqGrid('setGridParam',{ 
					postData: postData2,
					//每次从 第一页开始查看
	                page: 1
	            }).trigger("reloadGrid");
				//$("#searchPersonLayer").resize();
			}
			
			$("#jqGridRelatedPerson").jqGrid({
				url: baseURL + 'qxda/person/list',
				datatype: "json",
				colModel: [
					{ label: '序号', name: 'personId', index: 'person_id', hidden:true, key: true },
					{ label: '姓名', align: 'center', sortable: false, name: 'name', index: 'name', width:100}, 			
					{ label: '性别', align: 'center', name: 'sex', index: 'sex', width:50, formatter: function(value, options, row){
						 for(var i=0; i<vm.sexDictList.length; i++){
		    					if(vm.sexDictList[i].code == value){
		    						return vm.sexDictList[i].value;
		    					}
		    				}
			        	   return "";
						}}, 
					{ label: '族别', align: 'center',sortable: false, name: 'nation', index: 'nation', width:100}, 
					{ label: '身份证号', align: 'center', sortable: false, name: 'numId', index: 'numId', width:150}, 
					{ label: '操作', name: 'operate', align: 'center',  sortable: false, width: 60,formatter: function(value, grid, row, state){
							return '<a onclick="vm.editRelationLayer('+grid.rowId+',-1)" style="cursor: pointer" title="增加"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>'
						}		
					}
				],
				viewrecords: true,
				height: 220,
				rowNum: 5,
				//rowList : [5,10,15],
				rownumbers: true, 
				rownumWidth: 25, 
				autowidth:true,
				width:'697px',
				//multiselect: true,
				pager: "#jqGridPagerRelatedPerson",
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
	        	   $("#jqGridRelatedPerson").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "auto" }); 
	        	 
	           },
	           postData: vm.relationSearchParams
			});
		},
		queryRelatedPerson: function(){
			//获取已经选择的 编号列表，下次查询不再显示
			var familyPersonList = $("#familyPersonTable").bootstrapTable('getData');
			var majorPersonList = $("#majorPersonTable").bootstrapTable('getData');
			var selectedIds = [];
			if(vm.operationType == 'U'){	//页面为修改页面
				selectedIds.push(vm.person.personId);
			}
			if(familyPersonList.length > 0){
				for(var i in familyPersonList){
					selectedIds.push(parseInt(familyPersonList[i].relationPersonId));
				}	
			}
			if(majorPersonList.length > 0){
				for(var i in majorPersonList){
					selectedIds.push(parseInt(majorPersonList[i].relationPersonId));
				}	
			}
			//已选择的id列表
			if(selectedIds.length > 0){
				vm.relationSearchParams.selectedIds = JSON.stringify(selectedIds).replace('[','(').replace(']',')');
			}
			
			/*var page = $("#jqGridRelatedPerson").jqGrid('getGridParam','page');
			if(pageNum != null && pageNum != undefined){
				page = 1;
			}*/
			$("#jqGridRelatedPerson").jqGrid('setGridParam',{ 
				postData:vm.relationSearchParams,
				page: 1
            }).trigger("reloadGrid");
		},
		/**
		 * 关系编辑页
		 */
		editRelationLayer: function(personId, relationId, relationType){
			if(relationType == null){
				relationType = vm.relationType;
			}
			var title = '';
			var rowData = $("#jqGridRelatedPerson").jqGrid('getRowData', personId);
			if(relationId == -1){	//新增
				title = '新增';
				vm.relation = {
						id: "T" + new Date().getTime(),	
						relationPersonId: rowData.personId,
						relationType: relationType,
						name: rowData.name,
						sex: rowData.sex,
						nation: rowData.nation,
						numId: rowData.numId,
						relationName: '',
						intimacy: ''
					};
			} else {	//修改
				title = '修改';
				if(relationType == 1){	//家族关系
					vm.relation = $('#familyPersonTable').bootstrapTable('getRowByUniqueId', relationId);
				} else {	//重要关系
					vm.relation = $('#majorPersonTable').bootstrapTable('getRowByUniqueId', relationId);
				}
			}
			if(relationType == 1){	//家族关系
				title += '家族关系';
			} else {
				title += '重要关系';
			}
			
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: title,
				area: ['700px', '260px'],
				shadeClose: false,
				content: jQuery("#relationLayer"),
				btn: ['保存','取消'],
				btn1: function (index) {
					if(relationId == -1){	//新增
						if(relationType == 1){	//家族关系
							$("#familyPersonTable").bootstrapTable('append', vm.relation);
						} else {	//重要关系
							$("#majorPersonTable").bootstrapTable('append', vm.relation);
						}
					} else {	//修改
						if(relationType == 1){	//家族关系
							$("#familyPersonTable").bootstrapTable('updateByUniqueId', {id: vm.relation.id, row: vm.relation});
						} else {	//重要关系
							$("#majorPersonTable").bootstrapTable('updateByUniqueId', {id: vm.relation.id, row: vm.relation});
						}
					}
					layer.close(index);
					vm.queryRelatedPerson();
					vm.relation = {};
					
					vm.updateIframePerson();
	            },
	            btn2: function (index) {
	            }
			});
		},
		/**
		 * 查看 关系弹窗
		 */
		viewRelationLayer: function(relationId, relationType){
			if(relationType == 1){	//家族关系
				vm.relation = $('#familyPersonTable').bootstrapTable('getRowByUniqueId', relationId);
				title = '查看家族关系';
			} else {	//重要关系
				vm.relation = $('#majorPersonTable').bootstrapTable('getRowByUniqueId', relationId);
				title = '查看重要关系';
			}
			
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: title,
				area: ['700px', '260px'],
				shadeClose: false,
				content: jQuery("#relationLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
					vm.relation = {};
	            }
			});
		},
		/**
		 * 逐条删除（家族关系、重要关系）
		 */
		removeRelation: function(id, relationType){
			if(relationType == 1){		//家族关系
				confirm('确定要删除家族关系？', function(){
					$("#familyPersonTable").bootstrapTable('removeByUniqueId', id);
					alert("删除成功");
					vm.updateIframePerson();
				});
			} else {	//重要关系
				confirm('确定要删除重要关系？', function(){
					$("#majorPersonTable").bootstrapTable('removeByUniqueId', id);
					alert("删除成功");
					vm.updateIframePerson();
				});
			}
		},
		/**
		 * 批量删除-家族关系
		 */
		removeBatchFamilyPerson: function(){			
			var selectedRecords = $('#familyPersonTable').bootstrapTable('getSelections');
			if(selectedRecords.length < 1){
				alert("请至少选择一条记录");
				return;
			}
			confirm('确定要删除选中的家族关系？', function(){
				var selectedIds = [];
				for(var i=0; i<selectedRecords.length; i++){
					selectedIds.push(selectedRecords[i].id);
				}
				$('#familyPersonTable').bootstrapTable('remove', {field: 'id', values: selectedIds}); 
				alert("删除成功");
				vm.updateIframePerson();
			});
		},
		/**
		 * 批量删除-重要关系
		 */
		removeBatchMajorPerson: function(){			
			var selectedRecords = $('#majorPersonTable').bootstrapTable('getSelections');
			if(selectedRecords.length < 1){
				alert("请至少选择一条记录");
				return;
			}
			confirm('确定要删除选中的重要关系？', function(){
				var selectedIds = [];
				for(var i=0; i<selectedRecords.length; i++){
					selectedIds.push(selectedRecords[i].id);
				}
				$('#majorPersonTable').bootstrapTable('remove', {field: 'id', values: selectedIds}); 
				alert("删除成功");
				vm.updateIframePerson();
			});
		},
		/**
		 * 格式化“操作”列(家族、重要)
		 */
		relationFormatter: function(value, row){
			if(vm.operationType=="V"){
				return '<a style="cursor: pointer" title="查看" onclick="vm.viewRelationLayer(\'' + row.id+ '\','+row.relationType+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';		
			} else {
				return '<a style="cursor: pointer" title="修改" onclick="vm.editRelationLayer(\''+row.relationPersonId+ '\',\'' + row.id+ '\','+row.relationType+')" ><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>'+'<a style="cursor: pointer" title="删除" onclick="vm.removeRelation(\''+row.id+'\','+row.relationType+')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
			}
		},
		sexFormatter: function(value, row){
			if(value !=null && value != ""){
				for (var index in vm.sexDictList) {
	    			if(vm.sexDictList[index].code == value){
	    				return vm.sexDictList[index].value;
	    			}
				}
			}
			return value;
		},
		//更新 虚拟关系图谱
		updateIframePerson: function(){
			var params = {};
			params.familyPersonList = $("#familyPersonTable").bootstrapTable('getData');
			params.majorPersonList = $("#majorPersonTable").bootstrapTable('getData');
			$("#iframePerson").attr('src','http://'+vm.variableNeo4jHost+"/peopleRelationship?params=" + JSON.stringify(params));
		
		},
		/*************** 关系(家族、重要)layer E***************/
		
		/****************************** layer页面 E ******************************/
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
		if(params == undefined || params == 'undefined' || params == 'null'){
			this.showList = true;
		} else {
			this.showList = false;
		}
	},
	mounted: function () {
		this.initPage();
	}
});