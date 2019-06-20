var user = window.parent.vm.user;
//操作类型:0查看 1修改 2新增
var operation="";
var transferFlag = '0';
var ajax; //ajax对象
var intelligenceStatisticsBarChart;
$(function () {
	initIntelligenceStatisticsBarChart();
});


/**
 * 内容区域 点击方法
 * @param obj
 * @returns
 */
function personJS(obj) {
	vm.showRightPanel = true;
	
}

function initIntelligenceStatisticsBarChart(){
	intelligenceStatisticsBarChart = echarts.init(document.getElementById('intelligenceStaDiv'));
	
	intelligenceStatisticsBarChart.setOption({
	    title: {
	        text: '全州技侦大队完成情报信息任务图',
	        textAlign: 'auto',
	        left:'center'
	    },
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : { // 坐标轴指示器，坐标轴触发有效
				type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
			}
	    },	
	    grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
	    xAxis: {
	    	type: 'category',
	        data: []
	    },
	    yAxis: {
	    	type: 'value'
	    },
	    series: [{
	        name: '情报数量',
	        type: 'bar',
	        barWidth: '60%',
	        itemStyle:{ 
	        	normal:{ 
	        		color: new echarts.graphic.LinearGradient(
							0, 0, 0, 1,
							[
								{offset: 0, color: '#1E9BEB'},
								{offset: 0.5, color: '#2C61E3'},
								{offset: 1, color: '#2F1E9D'}
							])
	        	},emphasis: {
					color: new echarts.graphic.LinearGradient(
							0, 0, 0, 1,
							[
								{offset: 0, color: '#2F1E9D'},
								{offset: 0.5, color: '#2C61E3'},
								{offset: 1, color: '#1E9BEB'}
							])
				}
	        },	  
	        data: []
	    }]
	});
}
//组件--涉案人员分布图
Vue.component('ses-chart', {
	template: '<div></div>',
	 data:function () {
		return{
			saryLabel: {
			      type: Array,
			      default:  function () {
			          return []
			      }
			    },
			    saryData: {
				    type: Array,
				    default:  function () {
				          return []
				      }
				}
		}
	 },
	mounted:function () {	
		this.getSaryData();
	},
	beforeDestroy:function () {
		if (!this.chart) {
		  return;
		}
		this.chart.dispose();
		this.chart = null;
	},
	methods: {	  
	   getSaryData: function(){
		  var timePicker = $("#TimePicker").val().split(" - ");
		  var launchTimeB=timePicker[0].trim();
		  var launchTimeE=timePicker[1].trim();
		 
		  var params = {"launchTimeB":launchTimeB,"launchTimeE":launchTimeB}
		  var _self = this;
			$.ajax({
				type: "POST",
			    url: baseURL+"tjfx/qbxx/listForChart",
			    dataType: "json",
			    data: JSON.stringify(params),
			    success: function(result){
					if(result.code == 0){
						var saryLabelArray = [];
						var saryDataArray = [];
						var saryGetData =  result.listForChart;
						for(var i=0;i<saryGetData.length;i++){
							if(saryGetData[i].deptName == null ||  saryGetData[i].num == null){
								 continue;
							}
							if(saryGetData[i].deptName == '' ||  saryGetData[i].num === ''){
								 continue;
							}
							if(saryGetData[i].deptName == '支队'){
								 continue;
							}
							saryLabelArray.push(saryGetData[i].deptName);
							saryDataArray.push(saryGetData[i].num);
						}
						_self.saryLabel = saryLabelArray;
						_self.saryData = saryDataArray;
						_self.initChart();
					}else{
						_self.$emit('error-sarymsg', result.msg);
					}
				}
			});
		},
		
		initChart : function() {
			// 把配置和数据放这里
			this.chart = echarts.init(this.$el);
			var date = new Date()
			var month = date.getMonth()+1;
			var chartOption = {
				color: ['#3398DB'],
				tooltip : {
					trigger: 'axis',
					axisPointer : { // 坐标轴指示器，坐标轴触发有效
						type : 'none'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				title: {
			        text: month+'月全州技侦大队完成情报信息任务图',
			        textAlign: 'auto'
			    },
				
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis : [{
						type : 'category',
						data : this.saryLabel,
						axisLabel:{
							show:true,
							interval:0,
							color:'#c3dfff'
						},
						axisTick:{
							show:false
						},
						axisLine:{
							lineStyle:{
								color:'#144DAF'
							}
						}
						}],
				yAxis : [{
						type : 'value',
						splitLine: {
							show: false
						},
						axisLabel:{
							show:false,
							color:'#c3dfff'
						},
						axisTick:{
							show:false
						},
						axisLine:{
							lineStyle:{
								color:'#144DAF'
							}
						}
					}],
				series : [{
						name:'情报线索',
						type:'bar',
						barWidth: '60%',
						data:this.saryData,
						label: {
			                normal: {
			                    show: true,
			                    position: 'top',
			                   color:' #36C4FF',
			                   fontWeight:'bold'
			                }
			            },
						itemStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(
									0, 0, 0, 1,
									[
										{offset: 0, color: '#1E9BEB'},
										{offset: 0.5, color: '#2C61E3'},
										{offset: 1, color: '#2F1E9D'}
									])
							},
							emphasis: {
								color: new echarts.graphic.LinearGradient(
										0, 0, 0, 1,
										[
											{offset: 0, color: '#2F1E9D'},
											{offset: 0.5, color: '#2C61E3'},
											{offset: 1, color: '#1E9BEB'}
										])
							}
							}
					}]};
			this.chart.setOption(chartOption);
		}
    }	
});
/*************** bootstrap操作按钮 ***************/
//情报种类
function intelligenceTypeFormatter(value,row){
	if(value && value != ""){
		for(var i=0; i<vm.typeDictList.length; i++){
			if(vm.typeDictList[i].code == value){
				return vm.typeDictList[i].value;
			}
		}
		return value;
	}
	return "";
}
//打击处理情况
function doneTypeFormatter(value,row){
	if (value && value != "") {
		for (var i = 0; i < vm.doneTypeDictList.length; i++) {
			if (vm.doneTypeDictList[i].code == value) {
				return vm.doneTypeDictList[i].value;
			}
		}
		return value;
	}
	return "";
}
//情报发生地
function intelligencePlaceFormatter(value,row){
	if (value && value != "") {
		for (var i = 0; i < vm.intelligencePlaceDictList.length; i++) {
			if (vm.intelligencePlaceDictList[i].code == value) {
				return vm.intelligencePlaceDictList[i].value;
			}
		}
		return value;
	}
	return "";
}
//情报类型
function intelligenceKindFormatter(value,row){
	if (value && value != "") {
		for (var i = 0; i < vm.kindDictList.length; i++) {
			if (vm.kindDictList[i].code == value) {
				return vm.kindDictList[i].value;
			}
		}
		return value;
	}
	return "";
}

/*************** bootstrap操作按钮 ***************/

/*************** 查询列表操作按钮 ***************/

/************* 加载人员树 B *************/
var ztree;
var Setting = {
	check: {
		enable: true
	},
	data : {
		simpleData : {
			enable : true,
			idKey : "deptId",
			pIdKey : "parentId",
			rootPId : -1
		},
		key : {
			url : "nourl"
		}
	},
	callback: { 
	 	onClick: function (e, treeId, treeNode, clickFlag) { 
	 		ztree.checkNode(treeNode, !treeNode.checked, true); 
	 	} 
	}
};
var deptSetting = {
		data : {
			simpleData : {
				enable : true,
				idKey : "deptId",
				pIdKey : "parentId",
				rootPId : -1
			},
			key : {
				url : "nourl"
			}
		}
};
var intelligenceUserIds = [];
var intelligenceUserIds1 = [];
/************* 加载人员树 E *************/

/*************** 操作列表按钮 ***************/

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
		titleSecond: null,	           //线索页面底部页面标题
		showPage: 0,	               //0：列表；		
		intelligence: {},
		//情报种类列表
		typeDictList: {},
		//情报类型列表
		kindDictList: {},
		//打击处理情况列表
		doneTypeDictList: {},
		//情报发生地列表
		intelligencePlaceDictList: {},		
		//输入框不可用
		inputDisabled: false,
		searchType: '1',
		tabPage:'0',
		createUserName:"",            //发起人列表
		userIds: "",                   //发起人ID
		//涉案人员信息
		saryHeight: '380px',
		saryWidth:'600px',
		saryTop:'1%',
		saryLeft:'20%',
		saryAlt:'涉案人员分布图',
		saryLabel:[],
		saryData:[],
		saryErrorMsg:'',
		showRightPanel: false,	//是否显示右侧面板
		//查询条件
		searchParams: {title:'',createDeptName:"",deptId:"",createUserName:"",userIds:""},


	},
	
	created: function () {
		
	    /**
	     * 加载字典数据
	     */
		this.loadingDict();
	    //人员组织数据
	   /* $.get(baseURL + "qbfx/common/deptTree/-1", function(r){
	    	vm.selectUsers = r;
	    });*/
		this.selectUsers = window.parent.vm.selectUsers;
	},
	
	methods: {		
		//定义柱状图图片base64编码的全局变量
	    loadingDict: function(){
			var dictListMap = window.parent.vm.dictListMap;
			this.typeDictList = dictListMap.get('intelligenceType');	//情报种类
			this.kindDictList = dictListMap.get('intelligenceKind');	//情报类型
			this.intelligencePlaceDictList = dictListMap.get('intelligencePlace');	//情报发生地
			this.doneTypeDictList = dictListMap.get('doneType');		//打击处理情况
		},

		showChart: function(){
			vm.showRightPanel=!vm.showRightPanel;
			var timePicker = $("#TimePicker").val().split(" - ");
			var launchTimeB=timePicker[0].trim();			
			var launchTimeE=timePicker[1].trim();
		
			if(launchTimeB != "" && launchTimeE != ""){
				if(launchTimeB > launchTimeE){
					alert("起始时间应该小于截止时间");
					return;
				}
			}
			vm.searchParams.launchTimeB = launchTimeB;
			vm.searchParams.launchTimeE = launchTimeE;
			var params = vm.searchParams;
			var first = this.getCurrentMonthFirst();
			var last = this.getCurrentMonthLast();
		    var month="";
		    var date = new Date();
		    var timePicker = $("#TimePicker").val().split(" - ");
			
			if(timePicker[0].trim()==first&&timePicker[1].trim()==last){
				month = date.getMonth()+1+"月";
			}
			intelligenceStatisticsBarChart.setOption({
			    title: {
			        text: month+'全州技侦大队完成情报信息任务图',
			        textAlign: 'auto',
			        left:'center'
			    }
			});
			intelligenceStatisticsBarChart.showLoading();
			$.ajax({
				type: "POST",
			    url: baseURL+"tjfx/qbxx/listForChart",
		        contentType: "application/json;charset=utf-8",
		       
			    data: JSON.stringify(params),
			success: function(result){
				intelligenceStatisticsBarChart.hideLoading();
				//console.log(JSON.stringify(result));
				var labelArray = [];
				var dataArray = [];
				if(result.code == 0){
					
				     var data = result.listForChart;
				     for(var i=0;i<data.length;i++){
				    	 if(data[i].deptName == null ||  data[i].num == null){
							 continue;
						 }
						 if(data[i].deptName == '' ||  data[i].num === ''){
							 continue;
						 }
						 if(data[i].deptName == '支队'){
							 continue;
						 }
						 labelArray.push(data[i].deptName);
						 dataArray.push(data[i].num);
				    	 
				     }
				}else{
					$("#intelligenceStaDiv").text(result.msg);
					
				};
				intelligenceStatisticsBarChart.setOption({
					
				     xAxis: {
					      data: labelArray
					 },
					 yAxis: {minInterval:1},
					 series: [{
					      name: '情报数量',
					      data: dataArray
					 }]
				})
		    }
		   
			});
		},
	    exportChart: function (){//柱状图
	    	exportChart();
	    },
		exportExcel: function () { 					
			var timePicker = $("#TimePicker").val().split(" - ");
			var endTime=timePicker[0].trim();
			var launchTimeE=timePicker[1].trim();
			vm.searchParams.launchTimeB="";
			vm.searchParams.launchTimeE="";
			if(beginTime != "" && endTime != ""){
				if(beginTime > endTime){
					alert("起始时间应该小于截止时间");
					return;
				}
			}
			if(beginTime != ""){
				vm.searchParams.launchTimeB=beginTime;
			}
			if(endTime != ""){
				vm.searchParams.launchTimeE=endTime;
			}
			
//			var params = {"title":vm.searchParams.title,"intelligenceType":vm.searchParams.intelligenceType,"launchTimeB":vm.searchParams.launchTimeB,"launchTimeE":vm.searchParams.launchTimeE,"deptId":vm.searchParams.deptId,"language":vm.searchParams.language,"result":vm.searchParams.result,"place":vm.searchParams.place,"userIds":vm.searchParams.userIds};
			var url = baseURL + "tjfx/qbxx/exportExcel?title="+vm.searchParams.title+"&intelligenceType="+vm.searchParams.intelligenceType+"&intelligenceKind="+vm.searchParams.intelligenceKind+"&launchTimeB="+vm.searchParams.launchTimeB+"&launchTimeE="+vm.searchParams.launchTimeE+"&deptId="+vm.searchParams.deptId+"&language="+vm.searchParams.language+"&result="+vm.searchParams.result+"&place="+vm.searchParams.intelligencePlace+"&userIds="+vm.searchParams.userIds+"&searchType=1";
//			var url = baseURL + "tjfx/qbxx/exportExcel?params="+params;
//
			window.location.href = url;
//			postExcelFile(params, baseURL + 'tjfx/qbxx/exportExcel'); 
			
		},
		//涉案人员错误信息提示
		showSaryErrorMsg:function (val) {
			this.saryErrorMsg = val;
		},
		/**
		 * showPage 0：列表；1：图表
		 * detailOrEdit  0:detail;1:edit
		 */
		changePage: function(showPage, detailOrEdit){
			if(showPage == 0) {
				window.parent.vm.isEditted = false;
			} else if (showPage == 1 ){
				if(detailOrEdit == 1){
					window.parent.vm.isEditted = true;
				}
			} else {
				window.parent.vm.isEditted = true;
			}
			layer.closeAll();
			vm.showPage = showPage;
		},

		//重置查询条件（jqgrid setgridparam postdata 的多次查询条件累加）
		resetSearch: function() {
			$("#TimePicker").val("");
			
			vm.searchParams = {title:'',intro:'',createDeptName:"",deptId:""};
			//查询除原来的传递参数，并逐个清空 B
			var postData1 = $("#jqGrid").jqGrid("getGridParam", "postData");
			delete postData1["title"];
			delete postData1["intelligenceKind"];
			delete postData1["intelligenceType"];
			delete postData1["isAdopt"];
			delete postData1["launchTimeB"];
			delete postData1["launchTimeE"];
			delete postData1["result"];
			delete postData1["intelligencePlace"];
			delete postData1["userIds"];
			delete postData1["deptId"];
			
			$("#TimePicker").val(this.getCurrentMonthFirst()+" - "+this.getCurrentMonthLast());
			//查询除原来的传递参数，并逐个清空 E
			
			//传递新的查询参数
			$("#jq").jqGrid("setGridParam", { postData: postData1 });
		},
		query: function () {
			vm.reload(1);
		},
		//弹窗显示组织机构树
		showDeptTree:function(flag){
			var tempDepts = [];
			for(var i=0; i<vm.selectUsers.length; i++){
			   if(vm.selectUsers[i].deptId.substring(0,1) == "D"){
				   tempDepts.push(vm.selectUsers[i]);
			   }
 		    }
	    	ztree = $.fn.zTree.init($("#deptTree"), deptSetting, tempDepts);
	    	var node = null;
	    	if(flag == 0){
	    	   if(vm.searchParams.deptId && (""+vm.searchParams.deptId).substring(0,1) == "D"){
	    		   node = ztree.getNodeByParam("deptId", vm.searchParams.deptId);
	    	   }else{
	    		   node = ztree.getNodeByParam("deptId", "D"+vm.searchParams.deptId);
	    	   }
	        }else if(flag == 1){
	    	   if(vm.intelligence.deptId && (""+vm.intelligence.deptId).substring(0,1) == "D"){
	    		   node = ztree.getNodeByParam("deptId", vm.intelligence.deptId);
	    	   }else{
	    		   node = ztree.getNodeByParam("deptId", "D"+vm.intelligence.deptId);
	    	   }
	    	}
	           
	        if(node != null){
	           ztree.selectNode(node);
	        }
	        ztree.expandAll(true);
	    	layer.open({
	           type: 1,
	           offset: '50px',
	           skin: 'layui-layer-molv',
	           title: "选择机构",
	           area: ['300px', '450px'],
	           shadeClose: false,
	           content: jQuery("#deptLayer"),
	           btn: ['确定', '取消'],
	           btn1: function (index) {
	               var nodes = ztree.getSelectedNodes();
	               if(flag == 0){
	                   vm.searchParams.createDeptName = nodes[0].name;//发起单位
	                   vm.searchParams.deptId = nodes[0].deptId.substring(1); //发起单位id
	               }else if(flag == 1){
	                   vm.intelligence.createDeptName = nodes[0].name;//发起单位
	                   vm.intelligence.deptId = nodes[0].deptId; //发起单位id
	               }
	                   
	               layer.close(index);
	           }
	        });
	    },		

		//清理数据
		clearPage:function(){
			vm.intelligence = {},
						
			$("#charTable").bootstrapTable('removeAll');
						
			$(".disabledAll").attr("disabled","disabled");

			vm.launchTime = '';			//发起时间
			vm.showRightPanel = false;

			
		},

		changeChartPage:function(){
			
			var flag;
			if(vm.tabPage==0){
				
				flag=1;
			}else if(vm.tabPage==1){
				flag=0;
			}
			vm.tabPage=flag;
		},
		reload: function (pageNum) { 
			
			vm.searchParams.searchType = vm.searchType;
			vm.changePage(0);
			var timePicker = $("#TimePicker").val().split(" - ");
			vm.searchParams.launchTimeB=timePicker[0].trim();
			vm.searchParams.launchTimeE=timePicker[1]!=undefined ? timePicker[1].trim() : '';
			
			vm.searchParams.title=vm.searchParams.title.trim();
			delete vm.searchParams["barBase64"];
			if(vm.searchParams.launchTimeB != "" && vm.searchParams.launchTimeE != ""){
				if(vm.searchParams.launchTimeB > vm.searchParams.launchTimeE){
					alert("起始时间应该小于截止时间");
					return;
				}
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
		

		TimeClose:function(){
			//$('#TimePicker').datetimepicker('hide');
		},
		
	
		/************* 加载人员树 B *************/
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
			    
			    if(flag == '2'){
			    	if(operation == "0"){		    			
			    		title = '发起人';		    			
			    		if(vm.intelligence.hasOwnProperty('userIds') && vm.intelligence.userIds.length>0){
			    			var selectUsers = vm.getDeptAndUserTreeByUserId(showUsers, vm.intelligence.userIds);
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
					    if(vm.intelligence.hasOwnProperty('userIds') && vm.intelligence.userIds.length>0){
			    			for(var i=0; i<vm.intelligence.userIds.length; i++){
		    					var node = ztree.getNodeByParam("deptId", vm.intelligence.userIds[i]);
		    					ztree.checkNode(node,true);
							}
				    	}
					    ztree.expandAll(true);
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
				    content: jQuery("#userLayer"),
				    btn: ['确定', '取消'],
				    btn1: function (index) {
				    //初始化参数
				    var nodeNames = "";
				    var nodeIds = "";
				    var nodes = ztree.getCheckedNodes();
			        if(flag == '2') {
			        	window.parent.vm.isEditted = true;
			        	vm.searchParams.userIds = "";
			        	for(var i=0; i<nodes.length; i++){
			        		if(nodes[i].deptId.substring(0,1) == "D"){
	             				continue;
	             			}
			        		nodeIds += nodes[i].deptId + ";";
			        		
				    		nodeNames += nodes[i].name + ";";
				    	}
			        	vm.searchParams.userIds=nodeIds;
			        	//console.log(vm.searchParams.userIds);
			        } 
				    if(flag == '2'){
				    	vm.searchParams.createUserName = nodeNames;
				    	$("#createUserName").val(nodeNames);	//发起人			    		
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
				    content: jQuery("#userLayer"),
				    btn: ['关闭'],
			    });
		    }
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
	    getCurrentMonthLast: function(){ 
	    	var date=new Date(); 
	    	var currentMonth=date.getMonth(); 
	    	var nextMonth=++currentMonth; 
	    	var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1); 
	    	var oneDay=1000*60*60*24; 
	    	var lastTime = new Date(nextMonthFirstDay-oneDay); 
	    	var month = parseInt(lastTime.getMonth()+1); 
	    	var day = lastTime.getDate(); 
	    	if (month < 10) { 
	    		month = '0' + month 
	    	} 
	    	if (day < 10) { 
	    		day = '0' + day 
	    	} 
	    	return date.getFullYear() + '-' + month + '-' + day; 
	    },
	    
	    dateDefind: function () {
		    var d, s;
		    var self = this;
		    d = new Date();
		    s = d.getFullYear() + "-";       // 取年份
		    s = s + (d.getMonth() + 1) + "-";// 取月份
		    s += d.getDate() + " ";     // 取日期
		    $("#TimePicker").val(this.getCurrentMonthFirst()+" - "+this.getCurrentMonthLast());
		   

						
			laydate.render({
				elem: '#TimePicker',
				range: true
			});
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
//		    //console.log($("#beginTimePicker").val());
//		    $('#endTimePicker').datetimepicker().on('show', function(ev){
//		    	$('#beginTimePicker').datetimepicker("hide");
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
//		    });
	    },
	    /******** 父页面调用 B ********/
		resize: function(){
			$(window).resize();
		},
		/******** 父页面调用 E ********/
	},
	
	mounted: function () {
		this.dateDefind();
		var q = {launchTimeB:'',launchTimeE:''};
		q.launchTimeB=this.getCurrentMonthFirst();
		q.launchTimeE=this.getCurrentMonthLast();
		$("#jqGrid").jqGrid({
	        url: baseURL + 'tjfx/qbxx/list/85',
	        postData: q,
	        datatype: "json",
	        colModel: [		
	        	
				{ label: '序号', hidden:true, name: 'intelligenceId', index: 'intelligence_id', width: 50, key: true },
				{ label: '期号', align: 'center', name: 'issue', index: 'issue', width: 45},
				{ label: '标题', sortable: false, name: 'title', index: 'title', width: 180, formatter:function(value, grid, row, state){
					var titleMainTable = '';
					if(row.titleMain != null && row.titleMain.length > 0){
						titleMainTable = '《' + row.titleMain + '》';
					}
					
	   				var str = '<a style="cursor: pointer" onclick="vm.jumpPage(\'V-' + row.intelligenceId +'\')">'+ titleMainTable + value +'</a>';
	   				return str;
	   			}}, 
				{ label: '情报种类',align: 'center', name: 'intelligenceType', index: 'intelligence_type', width: 60 , formatter: function(value, options, row){
					 for(var i=0; i < vm.typeDictList.length; i++){
	 					if(vm.typeDictList[i].code == value){
	 						return vm.typeDictList[i].value;
	 					}
	 				}
		        	   return "";
					}},
				{ label: '情报类型',align: 'center', name: 'intelligenceKind', index: 'intelligence_kind', width: 50 , formatter: function(value, options, row){
					 for(var i=0; i<vm.kindDictList.length; i++){
	 					if(vm.kindDictList[i].code == value){
	 						return vm.kindDictList[i].value;
	 					}
	 				}
		        	   return value;
				}}, 
				{ label: '是否采纳',align: 'center', name: 'isAdopt', index: 'intelligence_kind', width: 50 , formatter: function(value, options, row){
					if(value == '0'){
						return "未采纳";
					} else if(value == '1') {
						return "采纳";
					} else {
						return "";
					}
				}}, 
			   /* { label: '信息来源', align: 'center', name: '', index: '', width: 50},*/
			    { label: '涉及人员', align: 'center', name: 'countPerson', index: 'countPerson', width: 50},
				{ label: '情报发生地',align: 'center', name: 'place', index: 'place', width: 60 , formatter: function(value, options, row){
					 for(var i=0; i<vm.intelligencePlaceDictList.length; i++){
	 					if(vm.intelligencePlaceDictList[i].code == value){
	 						return vm.intelligencePlaceDictList[i].value;
	 					}
	 				}
		        	   return "";
				}}, 			
				{ label: '发生时间',align: 'center', name: 'launchTime', index: 'launch_time', width: 103}, 			
				{ label: '发起人姓名',align: 'center', name: 'createUserName', index: 'create_user_name', width: 70}, 			
				{ label: '发起单位',align: 'center', name: 'createDeptName', index: 'create_dept_name', width: 70}, 			
				{ label: '打击处理情况',align: 'center', name: 'result', index: 'result', width: 75, formatter: function(value, options, row){
					for(var i=0; i<vm.doneTypeDictList.length; i++){
	 					if(vm.doneTypeDictList[i].code == value){
	 						return vm.doneTypeDictList[i].value;
	 					}
	 				}
					
					return "";
					
				}}
				
	        ],
	        cellEdit: false,
	        rownumbers: true,
	        sortable: true,
			viewrecords: true,
	        height: 370,
	        rowNum: 10,
			rowList : [10,30,50],
	        rownumWidth: 25, 
	        autowidth:true,
	        multiselect: false,
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
	        }/*,
	        postData:{
	        	searchType:'1',
	        }*/
	    });
		/*$("body").click(function(e){
	    	e.stopImmediatePropagation();
	    	var classNames = e.target.className;
	    	if(!classNames || classNames == "" || classNames.indexOf("timePicker") < 0){
	    		$("#"+vm.globalDateTimePickerId).datetimepicker("hide");
	    	}
	    });*/
	}
});
function progressHandlingFunction(e) {
	if (e.lengthComputable) {
		var percent = e.loaded / e.total;
        $("#progress-bar").css("width", (percent * 450));
	} 
}
var myChart;
function exportChart(){//柱状图
	
	var option = {          
            //关闭动画，否则有些统计图表只有背景（如扇形统计图）
            animation:false,
        }
    //初始化echarts,注意：main HTML元素必须指定固定宽高（导出图片的大小），并且不能为隐藏
    //如果是隐藏，也可以通过echarts.init(document.getElementById('main'),'',{width:600,height:200})来初始化 容器的宽高
    myChart = echarts.init(document.getElementById('intelligenceStaDiv'));
    // 为echarts对象加载数据 
    myChart.setOption(option);

    //获取echarts图的base64编码，为png格式。
    var barBase64 = myChart.getDataURL();	
   
	var timePicker = $("#TimePicker").val().split(" - ");
	var launchTimeB=timePicker[0].trim();
	var launchTimeE=timePicker[1].trim();
	vm.searchParams.barBase64 = barBase64;
//	var params = {"title":vm.searchParams.title,"intelligenceType":vm.searchParams.intelligenceType,"launchTimeB":vm.searchParams.launchTimeB,"launchTimeE":vm.searchParams.launchTimeE,"deptId":vm.searchParams.deptId,"language":vm.searchParams.language,"result":vm.searchParams.result,"place":vm.searchParams.place,"userIds":vm.searchParams.userIds,"barBase64":barBase64};

    var params = vm.searchParams;

	postExcelFile(params, baseURL + 'tjfx/qbxx/exportChart'); 
}
function postExcelFile(params, url) { 
	//params是post请求需要的参数，url是请求url地址 
	var form = document.createElement("form"); 
	form.style.display = 'none'; 
	form.action = url; 
	form.method = "post"; 
	document.body.appendChild(form); 
	for(var key in params){ 
	   var input = document.createElement("input"); 
	   input.type = "hidden"; 
	   input.name = key; 
	   input.value = params[key]; 
	   form.appendChild(input);
	} 
	form.submit(); 
	form.remove(); 
} 

////以时间为X轴统计案件和线索总数
//function showChart(){
//	var launchTimeB = $("#beginTimePicker").val();
//	var launchTimeE = $("#endTimePicker").val();
//	if(launchTimeB != "" && launchTimeE != ""){
//		if(launchTimeB > launchTimeE){
//			alert("起始时间应该小于截止时间");
//			return;
//		}
//	}
//	intelligenceStatisticsBarChart.showLoading();
//	$.ajax({
//		type: "POST",
//	    url: baseURL+"tjfx/qbxx/listForChart",
//        contentType: "application/json;charset=utf-8",
//        var params = {"launchTimeB":launchTimeB,"launchTimeE":launchTimeB}
//		var _self = this;
//	data: JSON.stringify(params),
//    success: function(result){
//		if(result.code == 0){
//			var saryLabelArray = [];
//			var saryDataArray = [];
//			var saryGetData =  result.listForChart;
//			for(var i=0;i<saryGetData.length;i++){
//				if(saryGetData[i].deptName == null ||  saryGetData[i].num == null){
//					 continue;
//				}
//				if(saryGetData[i].deptName == '' ||  saryGetData[i].num === ''){
//					 continue;
//				}
//				if(saryGetData[i].deptName == '支队'){
//					 continue;
//				}
//				saryLabelArray.push(saryGetData[i].deptName);
//				saryDataArray.push(saryGetData[i].num);
//			}
//			_self.saryLabel = saryLabelArray;
//			_self.saryData = saryDataArray;
//			_self.initChart();
//		}else{
//			_self.$emit('error-sarymsg', result.msg);
//		}
//	}
//	});
//}