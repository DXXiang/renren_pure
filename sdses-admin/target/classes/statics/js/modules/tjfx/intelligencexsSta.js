var user = window.parent.vm.user;
//操作类型:0查看 1修改 2新增
var operation="";
var transferFlag = '0';
var ajax; //ajax对象
var intelligenceStatisticsBarChart;

$(function () {
	initIntelligenceStatisticsBarChart();
});

function initIntelligenceStatisticsBarChart(){
	intelligenceStatisticsBarChart = echarts.init(document.getElementById('intelligenceStaDiv'));
	intelligenceStatisticsBarChart.setOption({
	    title: {
	        text: '舆情线索通报统计图',
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
		//this.initChart();
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
		  var _self = this;
			$.ajax({
				type: "POST",
			    url: baseURL+"tjfx/intelligencexsSta/saryByqy",
			    data: {},
			    dataType: "json",
			    success: function(result){
			    	//console.log(JSON.stringify( result));
					if(result.code == 0){
						var saryLabelArray = [];
						var saryDataArray = [];
						var saryGetData =  result.saryByqy ;
						for(var i=0;i<saryGetData.length;i++){
							if(saryGetData[i].placeHome == null ||  saryGetData[i].num == null){
								 continue;
							}
							if(saryGetData[i].placeHome == '' ||  saryGetData[i].num == ''){
								 continue;
							}
							saryLabelArray.push(saryGetData[i].placeHome);
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
			var chartOption = {
				color: ['#3398DB'],
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
						name:'人员',
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


/*************** bootstrap操作按钮 ***************/

/*************** 查询列表操作按钮 ***************/
//导出
function exportChart () {	
//	vm.searchParams.launchTimeB=$("#beginTimePicker").val();
//	vm.searchParams.launchTimeE=$("#endTimePicker").val();
	var timePicker = $("#TimePicker").val().split(" - ");
	vm.searchParams.launchTimeB=timePicker[0];
	vm.searchParams.launchTimeE=timePicker[1];
	if(vm.searchParams.launchTimeB != "" && vm.searchParams.launchTimeE != ""){
		if(vm.searchParams.launchTimeB > vm.searchParams.launchTimeE){
			alert("起始时间应该小于截止时间");
			return;
		}
	}
	var url = baseURL + "tjfx/intelligencexsSta/export?intelligenceKind="+vm.searchParams.intelligenceKind+"&intelligenceType="+vm.searchParams.intelligenceType+"&state="+vm.searchParams.state+"&language="+vm.searchParams.language+"&opinion="+vm.searchParams.opinion+'&launchTimeB='+vm.searchParams.launchTimeB+'&launchTimeE='+vm.searchParams.launchTimeE+"&deptId"+vm.searchParams.deptId;
	window.location.href = url;
}

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
		kindDictList:[],
		stateDictList:[],
		languageDictList:{},
		auditDictList:{},
		//打击处理情况列表
		doneTypeDictList: {},
		//情报发生地列表
		intelligencePlaceDictList: {},		
		//输入框不可用
		inputDisabled: false,
		searchType: '1',
		tabPage:'0',
		createUserName:"",            //发起人列表
		userIds: [],                   //发起人ID
		//查询条件
		searchParams : {launchTimeB:'',launchTimeE:'',intelligenceKind:'',intelligenceType:'',createDeptName:'',deptId:'',state:'',language:'',opinion:''},
		saryHeight: '450%',
		saryWidth:'480%',
		saryTop:'1%',
		saryLeft:'20%',
		saryAlt:'涉案人员分布图',
		saryLabel:[],
		saryData:[],
		saryErrorMsg:'',
		showRightPanel: false,	//是否显示右侧面板

	},
	
	created: function () {
		var dictListMap = window.parent.vm.dictListMap;
	    /**
	     * 加载字典数据
	     */
	    //人员组织数据
	   /* $.get(baseURL + "qbfx/common/deptTree/-1", function(r){
	    	vm.selectUsers = r;
	    });*/
		this.selectUsers = window.parent.vm.selectUsers;
		
		  //语种
		if(dictListMap.has('intelligenceLanguage')){
		
			this.languageDictList = dictListMap.get('intelligenceLanguage');
		} else {
			$.get(baseURL + "sys/dict/listByType?type=intelligenceLanguage", function(r){
		    	vm.languageDictList = r.dictList;
		    	dictListMap.set('intelligenceLanguage', vm.languageDictList);
		    });
		}
		//审核意见
		if(dictListMap.has('auditType')){
			
			this.auditDictList = dictListMap.get('auditType');
		} else {
			$.get(baseURL + "sys/dict/listByType?type=auditType", function(r){
		    	vm.auditDictList = r.dictList;
		    	dictListMap.set('auditType', vm.auditDictList);
		    });
		}
		 //状态
        if(dictListMap.has('intelligenceState')){
			
			var dictList1 = dictListMap.get('intelligenceState');
			 for(var i=0; i<dictList1.length; i++){
			    	if(dictList1[i].code == 2||dictList1[i].code == 4||dictList1[i].code == 5){
			    		this.stateDictList.push(dictList1[i]);
			    	}
			    	
			    	 }
			
			
		} else {
			$.get(baseURL + "sys/dict/listByType?type=intelligenceState", function(r){
				 for(var i=0; i<r.dictList.length; i++){
				    	if(r.dictList[i].code == 2||r.dictList[i].code == 3||r.dictList[i].code == 4||r.dictList[i].code == 5){
				    	 vm.stateDictList.push(r.dictList[i]);
				    	}    	
				   }
		    });
		}
		
		 //情报类型
        if(dictListMap.has('intelligenceKind')){
        	var dictList1 = dictListMap.get('intelligenceKind');
			 for(var i=0; i<dictList1.length; i++){
			    	if(dictList1[i].code  != 1){
			    		this.kindDictList.push(dictList1[i]);
			    	}
			    	
			    	 }
			
			
		} else {
			$.get(baseURL + "sys/dict/listByType?type=intelligenceKind", function(r){
				 for(var i=0; i<r.dictList.length; i++){
				    	if(r.dictList[i].code != 1){
				    	 vm.kindDictList.push(r.dictList[i]);
				    	}    	
				   }
		    });
		}
      //情报种类
       if(dictListMap.has('intelligenceType')){	
			this.typeDictList = dictListMap.get('intelligenceType');
		} else {
			$.get(baseURL + "sys/dict/listByType?type=intelligenceType", function(r){
		    	vm.typeDictList = r.dictList;
		    	dictListMap.set('intelligenceType', vm.typeDictList);
		    });
		}

		 //情报类型
//	    $.get(baseURL + "sys/dict/listByType?type=intelligenceKind", function(r){
//	    	vm.kindDictList = r.dictList;
//	    });
		//情报种类
//	    $.get(baseURL + "sys/dict/listByType?type=intelligenceType", function(r){
//	    	vm.typeDictList = r.dictList;
//	    });
	    
//	    //情报发生地
//	    $.get(baseURL + "sys/dict/listByType?type=intelligencePlace", function(r){
//	    	vm.intelligencePlaceDictList = r.dictList;
//	    });
//	 
//	    //打击处理情况
//	    $.get(baseURL + "sys/dict/listByType?type=doneType", function(r){
//	    	vm.doneTypeDictList = r.dictList;
//	    });
//	   
//	    //人员组织数据
//	    $.get(baseURL + "qbfx/common/deptTree/-1", function(r){
//	    	vm.selectUsers = r;
//	    });
	},
	
	methods: {
		exportChart: function (){
			exportChart(vm.intelligence.intelligenceId);
		},
		//涉案人员错误信息提示
		showSaryErrorMsg:function (val) {
			this.saryErrorMsg = val;
		},
		changeTabpage:function(){
		
			var flag;
			if(vm.tabPage==0){
			
				flag=1;
			}else if(vm.tabPage==1){
				flag=0;
			}
			vm.tabPage=flag;
		},
		
		
		
		showChart: function(){
			vm.showRightPanel=!vm.showRightPanel;
			var timePicker = $("#TimePicker").val().split(" - ");
			vm.searchParams.launchTimeB=timePicker[0];
			vm.searchParams.launchTimeE=timePicker[1];
			if(vm.searchParams.launchTimeB != "" && vm.searchParams.launchTimeE != ""){
				if(vm.searchParams.launchTimeB > vm.searchParams.launchTimeE){
					alert("起始时间应该小于截止时间");
					return;
				}
			}
			intelligenceStatisticsBarChart.showLoading();
			$.ajax({
				type: "POST",
			    url: baseURL+"tjfx/intelligencexsSta/saryByqy",
			    datatype: "json",
		       
			    data: vm.searchParams,
			success: function(result){
				intelligenceStatisticsBarChart.hideLoading();
				//console.log(JSON.stringify(result));
				var labelArray = [];
				var dataArray = [];
				if(result.code == 0){
					
				     var data = result.saryByqy;
				     for(var i=0;i<data.length;i++){
				    	
						 labelArray.push(data[i].placeHome);
						 dataArray.push(data[i].num);
				    	 
				     }
				}else{
					
				};
				intelligenceStatisticsBarChart.setOption({
					
				     xAxis: {
					      data: labelArray
					 },
					 series: [{
					      name: '情报数量',
					      data: dataArray
					 }]
				})
		    }
		   
			});
		},
		
		
		
		/**
		 * showPage 0：列表；1：新增线索；2：新增案件
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
			
			$('.timePicker').datetimepicker('hide');
		},

		//重置查询条件（jqgrid setgridparam postdata 的多次查询条件累加）
		resetSearch: function() {
		//	$("#beginTimePicker").val("");
			$("#TimePicker").val("");
			vm.searchParams = {launchTimeB:'',launchTimeE:'',intelligenceKind:'',intelligenceType:'',createDeptName:'',deptId:'',state:'',language:'',opinion:''};
			//查询出原来的传递参数，并逐个清空 
			var postData1 = $("#jqGrid").jqGrid("getGridParam", "postData");
			delete postData1["intelligenceKind"];
			delete postData1["intelligenceType"];		
			
			delete postData1["createDeptName"];
			delete postData1["deptId"];
			delete postData1["state"];
			delete postData1["language"];
			delete postData1["opinion"];	
			
			delete postData1["launchTimeB"];
			delete postData1["launchTimeE"];
			
			$("#TimePicker").val(this.getCurrentMonthFirst()+" - "+this.getCurrentMonthLast());
			//传递新的查询参数
			$("#jq").jqGrid("setGridParam", { postData: postData1 });
			
		},
		query: function () {
			//alert(JSON.stringify(vm.searchParams));
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

			vm.launchTime = ''			//发起时间
			
		},
		
		reload: function (pageNum) { 
			
//			vm.searchParams.createType = 0;
//			vm.searchParams.searchType = vm.searchType;
		//	vm.changePage(0);
//			vm.searchParams.launchTimeB=$("#beginTimePicker").val();
//			vm.searchParams.launchTimeE=$("#endTimePicker").val();
			var timePicker = $("#TimePicker").val().split(" - ");
			vm.searchParams.launchTimeB=timePicker[0];
			vm.searchParams.launchTimeE=timePicker[1]!=undefined ? timePicker[1].trim() : '';
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
			//alert(JSON.stringify(vm.searchParams));
			$("#jqGrid").jqGrid('setGridParam',{ 
				postData:vm.searchParams,
                page:page
            }).trigger("reloadGrid");
		},
		

	/*	endTimeClose:function(){
			$('#endTimePicker').datetimepicker('hide');
		},
		beginTimeClose:function(){
			$('#beginTimePicker').datetimepicker('hide');
		},*/
	
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
	        if(flag == '1' || flag == '2' || flag == '4'){
				type = '-1';
			} else if (flag == '3'){
				type = '0';
			}
			$.get(baseURL + "qbfx/common/deptTree/" + type, function(r){
				vm.isShowUserTreeDisable = false;
			    var title = "";
			    
			    if(flag == '2'){
			    	if(operation == "0"){		    			
			    		title = '发起人';		    			
			    		if(vm.intelligence.hasOwnProperty('userIds') && vm.intelligence.userIds.length>0){
			    			var selectUsers = vm.getDeptAndUserTreeByUserId(r, vm.intelligence.userIds);
			    			Setting.check.enable = false;
							ztree = $.fn.zTree.init($("#userTree"), Setting, selectUsers);
							ztree.expandAll(true);
			    		}else{
			    			return;
			    		}
					}else{						
						title = '选择发起人';						
						Setting.check.enable = true;
						ztree = $.fn.zTree.init($("#userTree"), Setting, r);
					    ztree.checkAllNodes(false);//全部不选中
					    if(vm.intelligence.hasOwnProperty('userIds') && vm.intelligence.userIds.length>0){
			    			for(var i=0; i<vm.intelligence.userIds.length; i++){
		    					var node = ztree.getNodeByParam("deptId", vm.intelligence.userIds[i]);
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
				    var nodes = ztree.getCheckedNodes();
			        if(flag == '2') {
			        	window.parent.vm.isEditted = true;
			        	vm.intelligence.userIds = [];
			        	for(var i=0; i<nodes.length; i++){
			        		if(nodes[i].deptId.substring(0,1) == "D"){
	             				continue;
	             			}
			        		vm.intelligence.userIds.push(nodes[i].deptId);
				    		nodeNames += nodes[i].name + ";";
				    	}
			        } 
				    if(flag == '2'){
				    	vm.intelligence.createUserName = nodeNames;
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
	    dateDefind: function () {
		    var d, s;
		    var self = this;
		    d = new Date();
		    s = d.getFullYear() + "-";       // 取年份
		    s = s + (d.getMonth() + 1) + "-";// 取月份
		    s += d.getDate() + " ";     // 取日期
		    
		    //高级查询开始时间
			laydate.render({
				  elem: '#TimePicker'
				  ,range: true
				});
		    
			 $("#TimePicker").val(this.getCurrentMonthFirst()+" - "+this.getCurrentMonthLast());
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
//		    $("#beginTimePicker").val(this.getCurrentMonthFirst());
//		    //高级查询结束时间
//		    $("#endTimePicker").datetimepicker({
//		    	
//		    	format: "yyyy-mm-dd",
//		        //日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
//		        minView: "2",
//		        language: 'zh-CN',
//		        autoclose: true,
//		        todayBtn: true,
//		        pickerPosition: "bottom-right"
//		    });
//		    $("#endTimePicker").val(this.getCurrentMonthLast());		 		    
//		    $('#beginTimePicker').datetimepicker().on('show', function(ev){
//		    	$('#endTimePicker').datetimepicker("hide");
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
//		    });
//		    $('#endTimePicker').datetimepicker().on('show', function(ev){
//		    	$('#beginTimePicker').datetimepicker("hide");
//		    	vm.globalDateTimePickerId = ev.currentTarget.id;
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
	/******** 父页面调用 B ********/
	resize: function(){
		$(window).resize();
	},
	/******** 父页面调用 E ********/
	},
	
	
	mounted: function () {
		this.dateDefind();
		var q = {launchTimeB:'',launchTimeE:'',intelligenceKind:'',intelligenceType:'',createDeptName:'',deptId:'',state:'',language:'',opinion:''};
		q.launchTimeB=this.getCurrentMonthFirst();
		q.launchTimeE=this.getCurrentMonthLast();
		
		$("#jqGrid").jqGrid({
	        url: baseURL + 'tjfx/intelligencexsSta/list/86',
	    	postData:q,
	        datatype: "json",
	        colModel: [			
				{ label: '序号', hidden:true, name: '', index: 'intelligence_id', width: 50, key: true },
				{ label: '单位', name: 'deptName', index: '', width: 150},
				{ label: '上报总数', sortable: false,align: 'center', name: 'shbCount', index: '', width: 40}, 
				{ label: '采纳总数',sortable: false,align: 'center', name: 'cainCount', index: '', width: 40 }, 			
				{ label: '本地舆情/汉',sortable: false,align: 'center', name: 'bendiyqh', index: '', width: 60 }, 			
				{ label: '本地舆情/维',sortable: false,align: 'center', name: 'bendiyqw', index: '', width: 60/*, formatter:"date",formatoptions: {srcformat:'Y-m-d H:i:s',newformat:'Y-m-d'}*/ }, 			
				{ label: '州外舆情/汉',sortable: false,align: 'center', name: 'zhwyqh', index: '', width: 60 },
				{ label: '州外舆情/维',sortable: false,align: 'center', name: 'zhwyqw', index: '', width: 60}, 
				//{ label: '上平台',editable: true,align: 'center', name: '', index: 'launch_time', width: 95}, 
				//{ label: '局长直报',editable: true,align: 'center', name: '', index: 'launch_time', width: 95},
				{ label: '上报率%',sortable: false,align: 'center', name: 'shbPercent', index: 'launch_time', width: 80},
				{ label: '采纳率%',sortable: false,align: 'center', name: 'cainPercent', index: 'launch_time', width: 80},
				{ label: '分值',sortable: false,align: 'center', name: 'score', index: 'launch_time', width: 40},
				{ label: '排名',sortable: false,align: 'center', name: 'order', index: 'launch_time', width: 40}
	        ],
	        cellEdit: true,
	        cellsubmit:'clientArray',
	        rownumbers: true,
	        sortable: true,
			viewrecords: true,
	        height: 370,
	        rowNum: 10,
			rowList : [10,30,50],
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
//		$("#jqGrid").jqGrid('setGridParam',{ 
//			postData:q,
//           
//        }).trigger("reloadGrid");
		
	/*	$("body").click(function(e){
	    	e.stopImmediatePropagation();
	    	var classNames = e.target.className;
	    	if(!classNames || classNames == "" || classNames.indexOf("timePicker") < 0){
	    		$("#"+vm.globalDateTimePickerId).datetimepicker("hide");
	    	}
	    });
		
		*/
	}
});
function progressHandlingFunction(e) {
	if (e.lengthComputable) {
		var percent = e.loaded / e.total;
        $("#progress-bar").css("width", (percent * 450));
	} 
}
