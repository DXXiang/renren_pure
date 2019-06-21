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
		  var _self = this;
			$.ajax({
				type: "POST",
			    url: "homepage/saryByqy",
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

//组件pie--案件线索情报种类图
Vue.component('ses-pie', {
	template: '<div></div>',
	mounted:function () {	
		//this.initChart();
		this.getIntelligenceTypeData();
	},
	beforeDestroy:function () {
		if (!this.chart) {
		  return;
		}
		this.chart.dispose();
		this.chart = null;
	},
	methods: {
		//获取数据
		getIntelligenceTypeData: function(){
			  var _self = this;
			  var dealDataJson={};
				$.ajax({
					type: "POST",
				    url: "homepage/intelligenceTypeByMonth",
				    dataType: "json",
				    success: function(result){
				    	//console.log("情报种类统计pie-------------"+JSON.stringify( result));
						if(result.code == 0){
							dealDataJson = _self.dealData(result);
							_self.initChart(dealDataJson);
							_self.$emit('int-title', dealDataJson.xsMonth);
						}else{
						   _self.$emit('error-msg', result.msg);
						}
					}
				});
			},
			
		//处理数据，用于组件
		dealData:function(result) {
		//	var xsLegendData = []; //线索种类
			var xsSeriesData = [];//线索数据
		//	var ajLegendData = []; //案件种类
			var ajSeriesData = [];//案件数据
		//	var xsSelected = {};
		//	var ajSelected = {};
			var xsInfoData =  result.xsInfo ;
			var ajInfoData =  result.ajInfo ;
			var intTypeDesc,intTypeNum;
			for(var i=0;i<xsInfoData.length;i++){
				intTypeDesc = xsInfoData[i].intelligenceTypeDesc;
				intTypeNum = xsInfoData[i].num;
				if(intTypeDesc == null ||  intTypeDesc == ''){
					 continue;
				}
				if(intTypeNum == null ||  intTypeNum == ''){
					 continue;
				}
			//	xsLegendData.push({name:intTypeDesc,icon:'circle'});
				xsSeriesData.push({
					name: intTypeDesc,
					value: intTypeNum
				});
			//	xsSelected[intTypeDesc] = intTypeNum > 0;
			}
			for(var i=0;i<ajInfoData.length;i++){
				intTypeDesc = ajInfoData[i].intelligenceTypeDesc;
				intTypeNum = ajInfoData[i].num;
				if(intTypeDesc == null ||  intTypeDesc == ''){
					 continue;
				}
				if(intTypeNum == null ||  intTypeNum == ''){
					 continue;
				}
				//ajLegendData.push({name:intTypeDesc,icon:'circle'});
				ajSeriesData.push({
					name: intTypeDesc,
					value: intTypeNum
				});
			//	ajSelected[intTypeDesc] =intTypeNum > 0;
			}
			return {
				//xsLegendData: xsLegendData,
				xsSeriesData: xsSeriesData,
				//xsSelected: xsSelected,
				//ajLegendData: ajLegendData,
				ajSeriesData: ajSeriesData,
			//	ajSelected: ajSelected,
			};
		},
		//形成组件	
		initChart:function(dealDataJson) {
			//var legendData = [];
			var seriesData = [];
		//	var selected = {};
			this.chart = echarts.init(this.$el);
			if($.isEmptyObject(dealDataJson)){
				return;
			}
			if(this.$el.id == 'ajId'){
			//	legendData = dealDataJson.ajLegendData;
				seriesData = dealDataJson.ajSeriesData;
			//	selected = dealDataJson.ajSelected;
			}else{
			//	legendData = dealDataJson.xsLegendData;
				seriesData = dealDataJson.xsSeriesData;
			//	selected = dealDataJson.xsSelected;
			}
			
			// 把配置和数据放这里
			var chartOption =  {
				tooltip : {
					trigger: 'item',
					formatter: "种类 : {b} <br/>数量 : {c} ({d}%)",
					position: function (pos, params, dom, rect, size) {
					      // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
					      var obj = {top: 60};
					      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
					      return obj;
					  }
				},
				color:['#75B658', '#2E9DD2','#516BB5','#57439A','#8C469F','#C62455','#EC443B','#F16738','#FCA232','#F3C64F','#FBED4E','#D1E04F'],
				series : [
					{
						name: '类型：数量',
						type: 'pie',
						radius: ['50%', '70%'],
						markPoint:{
							symbol:'circle'
						},
						label: {
			                normal: {
			                    show: false
			                }
			            },
						data: seriesData,
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
			this.chart.setOption(chartOption);
		}
  }	
});
var vm = new Vue({
	el: "#main-content",
	data:function() {
		return {
			//涉案人员信息
			saryHeight: '80%',
			saryWidth:'85%',
			saryTop:'1%',
			saryLeft:'7%',
			saryAlt:'涉案人员分布图',
			saryLabel:[],
			saryData:[],
			saryErrorMsg:'',
			//案件信息
			ajHeight: '90%',
			ajWidth:'90%',
			ajTop:'-7%',
			ajleft:'7%',
			ajAlt:'案件分布图',
			ajId:'ajId',
			ajErrorMsg:'',
			//线索信息
			xsHeight: '90%',
			xsWidth:'90%',
			xsTop:'-7%',
			xsleft:'7%',
			xsAlt:'线索分布图',
			xsId:'xsId',
			xsErrorMsg:'',
			xsNum:'0',
			ajNum:'0',
			//上报信息
			rankingDatas:'',
			noticeList:[],
			selectedNoticeData:[]
		}
	},
	created:function () {	
	    this.getIntelligenceData();
	    this.getBrigadeRankingData();
	    this.getNoticeData();
//	    this.initCalendar();
	},
	methods: {
		//涉案人员错误信息提示
		showSaryErrorMsg:function (val) {
			this.saryErrorMsg = val;
		},
		//案件线索种类错误信息提示
		showErrorMsg:function (val) {
			this.ajErrorMsg = val;
			this.xsErrorMsg = val;
		},
		//获取案件种类数据
//		getIntelligenceData:function(){
//			var _self = this;
//			$.ajax({
//				type: "POST",
//			    url: "homepage/intelligenceByMonth",
//			    dataType: "json",
//			    success: function(result){
//			    	//console.log("案件种类数据-------"+JSON.stringify(result))
//			    	if(result.code == 0 && result.intelligenceInfo != null){
//						_self.numRunFun(_self.xsNum,result.intelligenceInfo.xs,'xsNum');
//						_self.numRunFun(_self.ajNum,result.intelligenceInfo.aj,'ajNum');
//			    	}else{
//			    		_self.xsNum = "0";
//			    		_self.ajNum = "0";
//			    	}
//				}
//			});
//		},
		//数字滚动效果
		numRunFun:function(curNum,newNum,curObjName){
			var numText = parseInt(curNum) ;
			newNum =  parseInt(newNum) ;
			var golb; // 为了清除requestAnimationFrame
			_self = this;
			function numSlideFun(){
			   if(newNum > curNum){
					numText+=1; // 速度的计算可以为小数
				}else if(newNum < curNum){
					numText-=1;
				}
				if(numText == newNum){
					numText = newNum;	
					cancelAnimationFrame(golb);
				}else {
					golb = requestAnimationFrame(numSlideFun);
				}
				_self[curObjName] = ~~(numText)
			}
			numSlideFun();
		},
		//获取各大队上报情报情况
		getBrigadeRankingData:function(){
			var _self = this;
			$.ajax({
				type: "GET",
			    url: "tjfx/intelligencexsSta/list/86", //homepage/ranking
			    dataType: "json",
			    success: function(result){
			    	//console.log(JSON.stringify( result));
			    	if(result.code == 0){
						if(result.page.list.length<1){
							return;
						}
						var rankingDatasHtml = '';
						result.page.list.forEach(function (value,index,arr) {
								if(index > 4){
									return;
								}
								rankingDatasHtml = rankingDatasHtml + "<div class='notice_line'>"
								switch(index)
								{
								case 0:
									rankingDatasHtml = rankingDatasHtml +" <div class='notice_num1'>1</div>";
								  break;
								case 1:
									rankingDatasHtml = rankingDatasHtml +" <div class='notice_num2'>2</div>";
								  break;
							    case 2:
							    	rankingDatasHtml = rankingDatasHtml +" <div class='notice_num3'>3</div>";
								    break;
								default:
									rankingDatasHtml = rankingDatasHtml +" <div class='notice_num'>"+ (index+1) +"</div>";
								}
								rankingDatasHtml = rankingDatasHtml +"<div class='notice_text text_center' title='" + value.deptName + "'>" +  value.deptName + "</div>"
																+"<div class='notice_time'>"+  value.score +"分</div></div>";
					    });
						_self.rankingDatas = rankingDatasHtml;
			    	}else{
			    		_self.rankingDatas="<div class='notice_line'> " +
			    				"<div class='notice_text1 text_center'>获取数据失败</div></div>";
			    	}
				}
			});
		},
		getNoticeData:function(){
			var user;
			if(!window.parent.vm || !window.parent.vm.user){
				$.getJSON("sys/user/info?_"+$.now(), function(r){
					user = r.user;
					this.requestNoticeData(user.userId);
				});
			}else{
				user = window.parent.vm.user;
				this.requestNoticeData(user.userId);
			}
		},
		requestNoticeData:function(userId){
			$.ajax({
				type: "POST",
			    url: "common/commsg/notice/"+userId+"/5" ,
			    dataType: "json",
			    success: function(result){
			    	$("#noticeDiv").html("");
			    	if(result.code == 0){
						vm.noticeList = result.notice;
						if(vm.noticeList && vm.noticeList.length > 0){
							var str = "";
							for(var i = 0; i < vm.noticeList.length; i++){
								str = str + '<div class="notice_line" onclick="vm.popupNoticeLayer('+ vm.noticeList[i].relationId +')" style="cursor:pointer">'
										  + '	<div class="notice_num">'+(i+1)+'</div>'
										  + '	<div class="notice_text text_center" title="'+ vm.noticeList[i].title +'">'
										  +      	vm.noticeList[i].title
										  + '	</div>'
										  + '	<div class="notice_time">'+ vm.noticeList[i].msgTime.substring(5,10) +'</div>'
										  + '</div>';
							}
							$("#noticeDiv").html(str);
						}
			    	}
				}
			});
		},
		popupNoticeLayer:function(msgId){
			if(!msgId || msgId == ''){
				return;
			}
			window.parent.goNext("modules/gztz/notice.html", "V-"+msgId, null);
//			$.ajax({
//				type: "POST",
//			    url: "common/commsg/read/"+msgId,
//			    dataType: "json",
//			    success: function(r){
//			    	if(r.code === 0){
//			    		vm.selectedNoticeData = r.msg;
//						layer.open({
//							type: 1,
//							skin: 'layui-layer-molv',
//							title: "通知",
//							area: ['500px', '300px'],
//							shadeClose: false,
//							content: jQuery("#noticeModal"),
//							btn: ['关闭'],
//							btn1: function (index) {
//								layer.close(index);
//				            }
//						});
//			    	}else{
//			    		alert(r.msg);
//			    		vm.getNoticeData();
//			    	}
//			    }
//			});
		}
	}
});
function goNext() {
	window.parent.goNext("modules/qbfx/intelligence.html");
}

function initCalendar(){
	var month = (new Date().getMonth() + 1) + "";
	var param = new Date().getFullYear() + "-" + (month.length == 1?"0"+month:month);
	$('#calendar').eCalendar({
		weekDays: ['星期日','星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
		months: ['01', '02', '03', '04', '05', '06','07', '08', '09', '10', '11', '12'],
		url:"grrz/personallog/queryPersonalLogCalendarByMonth/"+param
	});
//	$.ajax({
//		type: "POST",
//	    url: "grrz/personallog/queryPersonalLogByMonth/"+param,
//	    dataType: "json",
//	    success: function(result){
//	    	if(result.code == 0){
//				var personalLogList = result.list;
//				var calandarEvents = [];
//				if(personalLogList && personalLogList.length > 0){
//					var event;
//					var year,month,day;
//					for(let i = 0; i < personalLogList.length; i++){
//						year = personalLogList[i].remindTime.substring(0,4);
//						month = personalLogList[i].remindTime.substring(5,7);
//						day = personalLogList[i].remindTime.substring(8,10);
//						event = {
//									id:personalLogList[i].logId,
//									datetime: new Date(year, month-1, day, 17)
//								};
//						calandarEvents.push(event);
//					}
//				}
//				
//				$('#calendar').eCalendar({
//					weekDays: ['星期日','星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
//					months: ['01', '02', '03', '04', '05', '06','07', '08', '09', '10', '11', '12'],
//					events: calandarEvents,
//					url:"grrz/personallog/queryPersonalLogByMonth/"+param
//				});
//	    	}
//		}
//	});
	
}

initCalendar();