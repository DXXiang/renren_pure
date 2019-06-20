var intelligenceStaLineChart,intelligenceTotalAndPersonStaBarChart,
	clueKindStaPieChart,caseKindStaPieChart,placehomePersonStaLineChart,
	resultCluePieChart,regionCallBarChart,outReasonYjltPieChart;
var globalDateTimePickerId;
$(function () {
	initIntelligenceStaLineChart();
	initIntelligenceTotalAndPersonStaBarChart();
	initIntelligenceKindPieChart();
//	initPlacehomePersonStaLineChart();
	initResultCluePieChart();
	initRegionCallStaBarChart();
	//initOutReasonYjltPieChart();	伊吉拉特
	//queryOutReasonYjltByDay();	伊吉拉特
	initDatetimepicker();
	
	queryIntelligenceByDate();
	queryIntelligenceAndPeronByYear();
//	queryPlacehomePersonByMonth();
	queryResultClueByMonth();
	queryRegionCallByDay();
	queryIntelligenceKindByMonth();
	
	/*$("body").click(function(e){
    	e.stopImmediatePropagation();
    	var classNames = e.target.className;
    	if(!classNames || classNames == "" || classNames.indexOf("datetimepicker") < 0){
    		$("#"+globalDateTimePickerId).datetimepicker("hide");
    	}
    })*/
});

function initIntelligenceStaLineChart(){
	intelligenceStaLineChart = echarts.init(document.getElementById('intelligenceStaDiv'));
	intelligenceStaLineChart.setOption({
	    title: {
	        text: '情报类型统计',
	        textAlign: 'auto',
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['舆情','情报','国长'],
	        orient:'vertical',
	        x:'right'
	    },
	    xAxis: {
	    	type: 'category',
	        data: []
	    },
	    yAxis: {
	    	type: 'value'
	    },
	    series: [{
	        name: '舆情',
	        type: 'line',
	        data: []
	    },{
	        name: '情报',
	        type: 'line',
	        data: []
	    },{
	        name: '国长',
	        type: 'line',
	        data: []
	    }
	     ]
	});
}

function initIntelligenceTotalAndPersonStaBarChart(){
	intelligenceTotalAndPersonStaBarChart = echarts.init(document.getElementById('intelligenceTotalAndPersonStaDiv'));
	intelligenceTotalAndPersonStaBarChart.setOption({
		title: {
		        text: '情报和涉案人员统计',
		        textAlign: 'auto',
		        x:'center'
		},
		tooltip : {
	        trigger: 'axis'
	    },
		legend: {
	        data:['情报','涉案人员'],
	        orient:'vertical',
	        x:'right'
	    },
		xAxis: {
	        type: 'category',
	        data: []
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: [{
	    	name: '情报',
	    	type: 'bar',
	        data: []
	    },{
	    	name: '涉案人员',
	    	type: 'bar',
	        data: []
	        
	    }]
	});
}

function initIntelligenceKindPieChart(){
	clueKindStaPieChart = echarts.init(document.getElementById('clueStaDiv'));
	caseKindStaPieChart = echarts.init(document.getElementById('caseStaDiv'));
	
	var option = {
			 title : {
			        text: '',
			        textAlign: 'auto',
			        x:'center'
			  },
			  tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			  },
			  legend: {
			        type: 'scroll',
			        orient: 'vertical',
			        right: 10,
			        top: 20,
			        bottom: 20,
			        data: [],
			        orient:'vertical',
			        x:'right'
			  },
			  series : [
			        {
			            type: 'pie',
			            radius : '55%',
			            center: ['40%', '50%'],
			            data: [],
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			   ]
		};
	
	clueKindStaPieChart.setOption(option);
	clueKindStaPieChart.setOption({
		title : {
	        text: '线索'
	  }
	});
	caseKindStaPieChart.setOption(option);
	caseKindStaPieChart.setOption({
		title : {
	        text: '案件'
	  }
	});
}

function initPlacehomePersonStaLineChart(){
	placehomePersonStaLineChart = echarts.init(document.getElementById('placehomePersonStaDiv'));
	placehomePersonStaLineChart.setOption({
	    title: {
	        text: '涉案人员分布图',
	        textAlign: 'auto',
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['涉案人员'],
	        orient:'vertical',
	        x:'right'
	    },
	    xAxis: {
	    	type: 'category',
	        data: []
	    },
	    yAxis: {
	    	type: 'value'
	    },
	    series: [{
	        name: '涉案人员',
	        type: 'bar',
	        data: []
	    }
	     ]
	});
}

function initResultCluePieChart(){
	resultCluePieChart = echarts.init(document.getElementById('resultClueStaDiv'));
	var option = {
			 title : {
			        text: '打击处理情况统计',
			        textAlign: 'auto',
			        x:'center'
			  },
			  tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			  },
			  legend: {
			        type: 'scroll',
			        orient: 'vertical',
			        right: 10,
			        top: 20,
			        bottom: 20,
			        data: [],
			        orient:'vertical',
			        x:'right'
			  },
			  series : [
			        {
			            type: 'pie',
			            radius : '55%',
			            center: ['40%', '50%'],
			            data: [],
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			   ]
		};
	
	resultCluePieChart.setOption(option);
}

function initRegionCallStaBarChart(){
	regionCallBarChart = echarts.init(document.getElementById('regionCallStaDiv'));
	regionCallBarChart.setOption({
		title: {
		        text: '境内外涉恐通联分布图',
		        textAlign: 'auto',
		        x:'center'
		},
		tooltip : {
	        trigger: 'axis'
	    },
		legend: {
	        data:['地区'],
	        orient:'vertical',
	        x:'right'
	    },
		xAxis: {
	        type: 'category',
	        data: [],
	        axisLabel:{
		    	interval: 0,
		    	rotate: -40
		    }
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: [{
	    	name: '境内外涉恐通联',
	    	type: 'bar',
	        data: []
	    }]
	});
}

function initOutReasonYjltPieChart(){
	outReasonYjltPieChart = echarts.init(document.getElementById('outReasonYjltStaDiv'));
	var option = {
			 title : {
			        text: '伊吉拉特外出原因统计',
			        textAlign: 'auto',
			        x:'center'
			  },
			  tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			  },
			  legend: {
			        type: 'scroll',
			        orient: 'vertical',
			        right: 10,
			        top: 20,
			        bottom: 20,
			        data: [],
			        orient:'vertical',
			        x:'right'
			  },
			  series : [
			        {
			            type: 'pie',
			            radius : '55%',
			            center: ['40%', '50%'],
			            data: [],
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			   ]
		};
	
	outReasonYjltPieChart.setOption(option);
}

//以时间为X轴统计案件和线索总数
function queryIntelligenceByDate(){
	if($("#TimePicker").val() == ''){
		alert("请选择查询时间");
		return;
	}
	var timePicker = $("#TimePicker").val().split(" - ");	
	var startTime = timePicker[0];
	var endTime = timePicker[1];
	if(startTime != "" && endTime != ""){
		if(startTime > endTime){
			alert("起始时间应该小于截止时间");
			return;
		}
	}
	intelligenceStaLineChart.showLoading();
	$.ajax({
		type: "POST",
	    url: baseURL + "tjfx/dataStatistics/getIntelligenceStaByDate/"+startTime+"/"+endTime,
        contentType: "application/json;charset=utf-8",
	    success: function(result){
	    	intelligenceStaLineChart.hideLoading();
			intelligenceStaLineChart.setOption({
			        xAxis: {
			            data: result.categories
			        },
			        series: [{
			            name: '舆情',
			            data: result.data[0]
			        },{
			            name: '情报',
			            data: result.data[1]
			        },{
			            name: '国长',
			            data: result.data[2]
			        }]
			});
		}
	});
}

//以年为X轴统计每年的情报总数及涉案人员总数
function queryIntelligenceAndPeronByYear(){
	if($("#TimePicker2").val() == ''){
		alert("请选择查询时间");
		return;
	}
	var timePicker = $("#TimePicker2").val().split(" - ");	
	var startTime = timePicker[0];
	var endTime = timePicker[1];
	if(startTime != "" && endTime != ""){
		if(startTime > endTime){
			alert("起始时间应该小于截止时间");
			return;
		}
	}
	intelligenceTotalAndPersonStaBarChart.showLoading();
	$.ajax({
		type: "POST",
	    url: baseURL + "tjfx/dataStatistics/getIntelligenceAndPersonStaByYear/" + startTime + "/" + endTime,
        contentType: "application/json;charset=utf-8",
//	    data: JSON.stringify(logIds),
	    success: function(result){
	    	intelligenceTotalAndPersonStaBarChart.hideLoading();
//			console.log(JSON.stringify(result));
			intelligenceTotalAndPersonStaBarChart.setOption({
			        xAxis: {
			            data: result.categories
			        },
			        series: [{
			            name: '情报',
			            data: result.data[0]
			        },{
			            name: '涉案人员',
			            data: result.data[1]
			        }]
			});
		}
	});
}

//按月和情报种类统计案件、线索总数
function queryIntelligenceKindByMonth(){
	if($("#TimePicker7").val() == ''){
		alert("请选择查询时间");
		return;
	}
	var timePicker = $("#TimePicker7").val().split(" - ");	
	var startTime = timePicker[0];
	var endTime = timePicker[1];
	if(startTime != "" && endTime != ""){
		if(startTime > endTime){
			alert("起始时间应该小于截止时间");
			return;
		}
	}
	clueKindStaPieChart.showLoading();
	caseKindStaPieChart.showLoading();
	$.ajax({
		type: "POST",
	    url: baseURL + "tjfx/dataStatistics/getIntelligenceKindStaByMonth/" + startTime + "/" + endTime,
        contentType: "application/json;charset=utf-8",
//	    data: JSON.stringify(logIds),
	    success: function(result){
	    	clueKindStaPieChart.hideLoading();
	    	caseKindStaPieChart.hideLoading();
//			console.log(JSON.stringify(result));
			clueKindStaPieChart.setOption({
					title : {
						text: '线索'
					},
					legend: {
				        data: result.legendData
					},
			        series: [{
			        	name: '线索',
			            data: result.clueSeriesData
			        }]
			});
			caseKindStaPieChart.setOption({
				title : {
					text: '案件'
				},
				legend: {
			        data: result.legendData
				},
		        series: [{
		        	 name: '案件',
		            data: result.caseSeriesData
		        }]
			});
		}
	});
}
//以涉案人员户籍地址为X轴按月统计各地涉案人员总数
function queryPlacehomePersonByMonth(){
	if($("#TimePicker3").val() == ''){
		alert("请选择查询时间");
		return;
	}
	var timePicker = $("#TimePicker3").val().split(" - ");	
	var startTime = timePicker[0];
	var endTime = timePicker[1];
	if(startTime != "" && endTime != ""){
		if(startTime > endTime){
			alert("起始时间应该小于截止时间");
			return;
		}
	}
	placehomePersonStaLineChart.showLoading();
	$.ajax({
		type: "POST",
	    url: baseURL + "tjfx/dataStatistics/getPlacehomePersonByMonth/"+startTime+"/"+endTime,
        contentType: "application/json;charset=utf-8",
	    success: function(result){
	    	placehomePersonStaLineChart.hideLoading();
//			console.log(JSON.stringify(result));
	    	if(result.categories.length > 5){
	    		placehomePersonStaLineChart.setOption({
			        xAxis: {
			        	 axisLabel:{  
                             interval:0,
                             rotate:-40
                          }  
			        }
	    		});
	    	}
			placehomePersonStaLineChart.setOption({
			        xAxis: {
			            data: result.categories
			        },
			        series: [{
			            name: '涉案人员',
			            data: result.data
			        }]
			});
		}
	});
}
//按打击处理情况统计线索总数
function queryResultClueByMonth(){
	if($("#TimePicker4").val() == ''){
		alert("请选择查询时间");
		return;
	}
	var timePicker = $("#TimePicker4").val().split(" - ");	
	var startTime = timePicker[0];
	var endTime = timePicker[1];
	if(startTime != "" && endTime != ""){
		if(startTime > endTime){
			$('#exportBtn').attr("disabled");
			alert("起始时间应该小于截止时间");
			return;
		}
	}
	resultCluePieChart.showLoading();
	$.ajax({
		type: "POST",
	    url: baseURL + "tjfx/dataStatistics/getResultClueByMonth/" + startTime + "/" + endTime,
        contentType: "application/json;charset=utf-8",
	    success: function(result){
	    	resultCluePieChart.hideLoading();
//			console.log(JSON.stringify(result));
			resultCluePieChart.setOption({
					legend: {
				        data: result.categories
					},
			        series: [{
			        	name: '线索',
			            data: result.data
			        }]
			});
			
			$('#exportBtn').removeAttr("disabled");
	    }
	});
}

//以县市为X轴统计境内外涉恐通联信息总数
function queryRegionCallByDay(){
	if($("#TimePicker5").val() == ''){
		alert("请选择查询时间");
		return;
	}
	var timePicker = $("#TimePicker5").val().split(" - ");	
	var startTime = timePicker[0];
	var endTime = timePicker[1];
	if(startTime != "" && endTime != ""){
		if(startTime > endTime){
			alert("起始时间应该小于截止时间");
			return;
		}
	}
	regionCallBarChart.showLoading();
	$.ajax({
		type: "POST",
	    url: baseURL + "tjfx/dataStatistics/getRegionCallByDay/" + startTime + "/" + endTime,
        contentType: "application/json;charset=utf-8",
	    success: function(result){
	    	regionCallBarChart.hideLoading();
//			console.log(JSON.stringify(result));
			regionCallBarChart.setOption({
			        xAxis: {
			            data: result.categories
			        },
			        series: [{
			            name: '境内外涉恐通联',
			            data: result.data
			        }]
			});
		}
	});
}

//按伊吉拉特的外出原因统计伊吉拉特信息总数
function queryOutReasonYjltByDay(){
	if($("#TimePicker6").val() == ''){
		alert("请选择查询时间");
		return;
	}
	var timePicker = $("#TimePicker6").val().split(" - ");	
	var startTime = timePicker[0];
	var endTime = timePicker[1];
	if(startTime != "" && endTime != ""){
		if(startTime > endTime){
			alert("起始时间应该小于截止时间");
			return;
		}
	}
	outReasonYjltPieChart.showLoading();
	$.ajax({
		type: "POST",
	    url: baseURL + "tjfx/dataStatistics/getOutReasonYjltByDay/" + startTime + "/" + endTime,
        contentType: "application/json;charset=utf-8",
	    success: function(result){
	    	outReasonYjltPieChart.hideLoading();
//			console.log(JSON.stringify(result));
			outReasonYjltPieChart.setOption({
					legend: {
				        data: result.categories
					},
			        series: [{
			        	name: '伊吉拉特',
			            data: result.data
			        }]
			});
	    }
	});
}

function initDatetimepicker(){
	var date, year, month, lastMonth, day, today, year2,lastMonthToday;
	date = new Date();
	year = date.getFullYear(); // 取年份
	month = date.getMonth() + 1; // 取月份
	lastMonth = date.getMonth(); //上个月
	if(month < 10){
		month = "0" + month
	}
	if(lastMonth < 10){
		lastMonth = "0" + lastMonth
	}
	day = date.getDate(); // 取日期
	if(day < 10){
		day = "0" + day;
	}
	today = year + "-" + month + "-" + day;
	year2 = year;
	if(parseInt(lastMonth) == 0){
		year2 = year - 1;
		lastMonth = 12;
	}
	var  preSize= new Date(year2, lastMonth, 0).getDate();//上月总天数
	if (preSize < parseInt(day)) {//上月总天数<本月日期，比如3月的30日，在2月中没有30
		lastMonthToday =  year2 + '-' + month + '-01';
    }else{
    	lastMonthToday = year2 + "-" + lastMonth + "-" + day;  
    }
	
	var pickerConfig = {
			endDate: today,
			format: "yyyy-mm-dd",
			//日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
			minView: "2",
			language: 'zh-CN',
			autoclose: true,
			todayBtn: true,
			pickerPosition: "bottom-right"
	 };
	 
//	 $("#beginTimePicker").val(lastMonthToday);
//	 $("#endTimePicker").val(today);
//	 $("#beginTimePicker").datetimepicker(pickerConfig);
//	 $("#endTimePicker").datetimepicker(pickerConfig);
//	 
//	 $('#beginTimePicker').datetimepicker().on('show', function(ev){
//		 $('#endTimePicker').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
//	 $('#endTimePicker').datetimepicker().on('show', function(ev){
//		 $('#beginTimePicker').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
	laydate.render({
		elem: '#TimePicker',
		range: true,
		trigger: 'click'
	});
	$("#TimePicker").val(lastMonthToday+" - "+today);
	 /*-------------------------------------------------------------------------------*/
	 
	 var pickerConfig2 = {
			 	endDate: year,
				format: "yyyy",
				startView: '4',
				//日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
				minView: "4",
				language: 'zh-CN',
				autoclose: true,
				pickerPosition: "bottom-right"
	 };
	 
//	 $("#beginTimePicker2").val(year-5);
//	 $("#endTimePicker2").val(year);
//	 
//	 $("#beginTimePicker2").datetimepicker(pickerConfig2);
//	 $("#endTimePicker2").datetimepicker(pickerConfig2);
//	 
//	 $('#beginTimePicker2').datetimepicker().on('show', function(ev){
//		 $('#endTimePicker2').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
//	 $('#endTimePicker2').datetimepicker().on('show', function(ev){
//		 $('#beginTimePicker2').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
	 
	 laydate.render({
		 elem: '#TimePicker2',
		 range: true,
		 type: 'year',
		 trigger: 'click'
		});
	 $("#TimePicker2").val(year-5+" - "+year);
	 
	 /*-------------------------------------------------------------------------------*/
	 
//	 var pickerConfig3 = {
//			 	endDate: year + "-" + month,
//				format: "yyyy-mm",
//				startView: '3',
//				//日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
//				minView: "3",
//				language: 'zh-CN',
//				autoclose: true,
//				pickerPosition: "bottom-right"
//	 };
//	 
//	 $("#beginTimePicker3").val(year + "-" +month);
//	 $("#endTimePicker3").val(year + "-" +month);
//	 
//	 $("#beginTimePicker3").datetimepicker(pickerConfig3);
//	 $("#endTimePicker3").datetimepicker(pickerConfig3);
//	 
//	 $('#beginTimePicker3').datetimepicker().on('show', function(ev){
//		 $('#endTimePicker3').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
//	 $('#endTimePicker3').datetimepicker().on('show', function(ev){
//		 $('#beginTimePicker3').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
	 
	 /*-------------------------------------------------------------------------------*/
	 
	 var pickerConfig4 = {
				endDate: today,
				format: "yyyy-mm-dd",
				//日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
				minView: "2",
				language: 'zh-CN',
				autoclose: true,
				todayBtn: true,
				pickerPosition: "bottom-right"
	 };
	 
//	 $("#beginTimePicker4").val(lastMonthToday);
//	 $("#endTimePicker4").val(today);
//	 
//	 $("#beginTimePicker4").datetimepicker(pickerConfig4);
//	 $("#endTimePicker4").datetimepicker(pickerConfig4);
//	 
//	 $('#beginTimePicker4').datetimepicker().on('show', function(ev){
//		 $('#endTimePicker4').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
//	 $('#endTimePicker4').datetimepicker().on('show', function(ev){
//		 $('#beginTimePicker4').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
	 laydate.render({
		 elem: '#TimePicker4',
		 range: true,
		 trigger: 'click'
	 });
	 $("#TimePicker4").val(lastMonthToday+" - "+today);
	 /*-------------------------------------------------------------------------------*/
	 
	 var pickerConfig5 = {
				endDate: today,
				format: "yyyy-mm-dd",
				//日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
				minView: "2",
				language: 'zh-CN',
				autoclose: true,
				todayBtn: true,
				pickerPosition: "bottom-right"
	 };
	 
//	 $("#beginTimePicker5").val(lastMonthToday);
//	 $("#endTimePicker5").val(today);
//	 
//	 $("#beginTimePicker5").datetimepicker(pickerConfig5);
//	 $("#endTimePicker5").datetimepicker(pickerConfig5);
//	 
//	 $('#beginTimePicker5').datetimepicker().on('show', function(ev){
//		 $('#endTimePicker5').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
//	 $('#endTimePicker5').datetimepicker().on('show', function(ev){
//		 $('#beginTimePicker5').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
	 laydate.render({
		 elem: '#TimePicker5',
		 range: true,
		 trigger: 'click'
	 });
	 $("#TimePicker5").val(lastMonthToday+" - "+today);
/*-------------------------------------------------------------------------------*/
	 
	 var pickerConfig6 = {
				endDate: today,
				format: "yyyy-mm-dd",
				//日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
				minView: "2",
				language: 'zh-CN',
				autoclose: true,
				todayBtn: true,
				pickerPosition: "bottom-right"
	 };
	 
//	 $("#beginTimePicker6").val(lastMonthToday);
//	 $("#endTimePicker6").val(today);
//	 
//	 $("#beginTimePicker6").datetimepicker(pickerConfig6);
//	 $("#endTimePicker6").datetimepicker(pickerConfig6);
//	 
//	 $('#beginTimePicker6').datetimepicker().on('show', function(ev){
//		 $('#endTimePicker6').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
//	 $('#endTimePicker6').datetimepicker().on('show', function(ev){
//		 $('#beginTimePicker6').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
	 laydate.render({
		 elem: '#TimePicker6',
		 range: true,
		 trigger: 'click'
	 });
	 $("#TimePicker6").val(lastMonthToday+" - "+today);

/*-------------------------------------------------------------------------------*/
	 
	 var pickerConfig7 = {
			 	endDate: year + "-" + month,
				format: "yyyy-mm",
				startView: '3',
				//日期时间选择器所能够提供的最精确的时间选择视图	0, 'hour';1:'day',2:'month'
				minView: "3",
				language: 'zh-CN',
				autoclose: true,
				pickerPosition: "bottom-right"
	 };
	 
//	 $("#beginTimePicker7").val(year + "-" +month);
//	 $("#endTimePicker7").val(year + "-" +month);
//	 
//	 $("#beginTimePicker7").datetimepicker(pickerConfig7);
//	 $("#endTimePicker7").datetimepicker(pickerConfig7);
//	 
//	 $('#beginTimePicker7').datetimepicker().on('show', function(ev){
//		 $('#endTimePicker7').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
//	 $('#endTimePicker7').datetimepicker().on('show', function(ev){
//		 $('#beginTimePicker7').datetimepicker("hide");
//		 globalDateTimePickerId = ev.currentTarget.id;
//	 });
	 laydate.render({
		 elem: '#TimePicker7',
		 range: true,
		 type: 'month',
		 trigger: 'click'
	 });
	 
	 $("#TimePicker7").val(year + "-" +month+" - "+year + "-" +month);

	 
}

function exportToWord(){
	var picBase64Info  = resultCluePieChart.getDataURL();
//	var startTime = $("#beginTimePicker4").val();
//	var endTime = $("#endTimePicker4").val();
	var timePicker = $("#TimePicker4").val().split(" - ");	
	var startTime = timePicker[0];
	var endTime = timePicker[1];
	var params = {"startTime" : startTime,"endTime" : endTime, "picBase64Info" : picBase64Info};
//	$.ajax({
//		type: "POST",
//	    url: baseURL + "tjfx/dataStatistics/exportToWord",
//        contentType: "application/json;charset=utf-8",
//        data: JSON.stringify(params),
//	    success: function(result){
//	    	if(result.msg = "success"){
//	    		alert("导出成功");
//	    	}
//	    }
//	});
	
	var form = document.createElement("form"); 
	form.style.display = 'none'; 
	form.action = baseURL + "tjfx/dataStatistics/exportToWord"; 
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
