var user = window.parent.vm.user;
//操作类型:0查看 1修改 2新增
var operation="";
var transferFlag = '0';
var ajax; //ajax对象

window.onload = function(){
	try {
		CKEDITOR.replace('clueIntroEditor');
		CKEDITOR.replace('caseIntroEditor');
	} catch (e) {
		console.log(e.name + ": " + e.message);
	}
    initPage();
};

/**
 * 初始化页面
 */
function initPage(){
	/*$("body").click(function(e){
    	e.stopImmediatePropagation();
    	var classNames = e.target.className;
    	if(!classNames || classNames == "" || classNames.indexOf("timePicker") < 0){
    		$("#"+vm.globalDateTimePickerId).datetimepicker("hide");
    	}
    });*/
	//页面参数
	var params = self.frameElement.getAttribute('params');
	if(params != 'undefined' && params != 'null'){
		var paramArr = params.split('-');
		//新增
		if(paramArr[0] == 'A'){		
			vm.operationType = 'A';	//操作类型 V:查看 U:修改 A:新增,
			if(paramArr[1] == '0'){	//新增线索
				vm.addClue();
			} else {
				vm.addCase();
			}
		} 
		//修改
		else if(paramArr[0] == 'U'){
			vm.operationType = 'U';	//操作类型 V:查看 U:修改 A:新增,
			edit(paramArr[1]);
		}
		//查看
		else if(paramArr[0] == 'V'){
			vm.operationType = 'V';	//操作类型 V:查看 U:修改 A:新增,
			view(paramArr[1]);
		}
		//盯办
		else if(paramArr[0] == 'STARE') {
			starePage(paramArr[1]);
			var task = setInterval(function(){
				if($('#panelId').offset().top > 100){
					clearTimeout(task);
					$(window).scrollTop($('#panelId').offset().top - 10);
				}
			},200);
		}
		//研判
		else if(paramArr[0] == 'TRANSFER') {
			transferPage(paramArr[1]);
			var task = setInterval(function(){
				if($('#panelId').offset().top > 100){
					clearTimeout(task);
					$(window).scrollTop($('#panelId').offset().top - 10);
				}
			},200);
		}
		//二次核查
		else if(paramArr[0] == 'CHECK'){
			checkPage(paramArr[1]);
			var task = setInterval(function(){
				if($('#panelId').offset().top > 100){
					clearTimeout(task);
					$(window).scrollTop($('#panelId').offset().top - 10);
				}
			},200); 
		}
	} else {
		vm.showPage = 0;
		vm.loadingTable();
	}
}

/**
 * 内容区域 点击方法
 * @param obj
 * @returns
 */
function personJS(obj) {
	vm.showRightPanel = true;
	vm.rightRanelParam = obj;
	//alert(String(obj));
	vm.personAnalysisWithKeyword();
}

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
//自动关联情报
function autoIntelligenceFormatter(value, row){
	return '<a style="cursor: pointer" title="详情" onclick="vm.viewDetail2('+row.intelligenceId+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
}
//手动关联情报
function relatedIntelligenceFormatter(value, row){
	if(operation=="0")
		return '<a style="cursor: pointer" title="详情" onclick="vm.viewDetail2('+row.intelligenceId+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
	else
		return '<a style="cursor: pointer" title="详情" onclick="vm.viewDetail2('+row.intelligenceId+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>'+'<a style="cursor: pointer" title="删除" onclick="vm.removeRelation('+row.intelligenceId+')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
}
//附件上传
function  clueFileUploadFormatter (value, row){
	if(operation=="0")
		return '<a style="cursor: pointer" title="详情" onclick="vm.checkClueFileUploadById('+row.fileId+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
	else
		return '<a style="cursor: pointer" title="详情" onclick="vm.checkClueFileUploadById('+row.fileId+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>'+'<a style="cursor: pointer" title="删除" onclick="vm.delFile('+row.fileId+')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
}
//涉案人
function cluePersonFormatter(value, row){
	if(operation=="0")
	   return '<a style="cursor: pointer" title="查看" onclick="vm.removePerson('+row.personId+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';		
	else
	  return '<a style="cursor: pointer" title="修改" onclick="vm.personPage(\''+row.personId+'\')" ><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>'+'<a style="cursor: pointer" title="删除" onclick="vm.removePerson(\''+row.personId+'\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
}

//案件日志 操作列
function caseLogFormatter(value, row){
	if(operation=="0")
		 return '<a onclick="vm.viewCaseLogDetail('+row.logId+')" style="cursor: pointer" title="详情"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
//		 else if(operation==2)		
//		 return '<a style="cursor: pointer" title="修改" onclick="vm.editCaseLog(\''+row.logId+'\')" ><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>'+'<a style="cursor: pointer" title="删除" onclick="vm.delCaseLog(\''+row.logId+'\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
		 else 
			 //if(operation==1)		
	      return '<a style="cursor: pointer" title="修改" onclick="vm.editCaseLog(\''+row.logId+'\')" ><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>'+'<a style="cursor: pointer" title="删除" onclick="vm.delCaseLog(\''+row.logId+'\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
}
//案件附件上传
function  caseFileUploadFormatter (value, row){
	if(operation=="0")
		 return '<a style="cursor: pointer" title="详情" onclick="vm.checkClueFileUploadById('+row.fileId+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
	else
	     return '<a style="cursor: pointer" title="详情" onclick="vm.checkClueFileUploadById('+row.fileId+')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>'+'<a style="cursor: pointer" title="删除" onclick="vm.delFile('+row.fileId+')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
}
//盯办列表 操作列
function stareFormatter(value, row){
	 return '<a onclick="vm.viewStareDetail('+row.stareId+')" style="cursor: pointer" title="详情"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
}
//审核列表 操作列
function transferFormatter(value, row){
	return '<a onclick="vm.viewTransferDetail('+row.transferId+')" style="cursor: pointer" title="详情"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
}
//审核列表 审核意见列
function transferOpinionFormatter(value, row){
	return vm.auditDictList[value].value;
}
//核查列表 操作列
function checkFormatter(value, row){
	 return '<a onclick="vm.viewCheckDetail('+row.checkId+')" style="cursor: pointer" title="详情"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
}
/*************** bootstrap操作按钮 ***************/

/*************** 查询列表操作按钮 ***************/
//导出word文档
function exportWord (intelligenceId) {				    
	var url = baseURL + "qbfx/exportToWord/exportWord?intelligenceId="+intelligenceId;
	window.location.href = url;
}
//退回、打回
function repulse(intelligenceId){
	var entityNow = vm.getInfo(intelligenceId);
	if(entityNow.state == 6){
		alert("线索已被删除，无法操作！");
		vm.reload();
		return;
	} else if(entityNow.state != 2) {
		alert("线索状态已改变，无法操作！");
		vm.reload();
		return;
	} 
	$("#repulseReason").val("");
	/*confirm('确定要退回选中的记录？', function(){
		$.get(baseURL + "qbfx/intelligence/repulse/"+intelligenceId, function(r){
	        if(r.code == 0) {
	        	alert("情报退回成功！");
	        	$("#jqGrid").trigger("reloadGrid");
	        } else {
	        	alert("操作异常，请联系管理员！");
	        }
	    });
	});*/
	layer.open({
		type: 1,
		skin: 'layui-layer-molv',
		title: "线索退回",
		area: ['580px', '200px'],
		shadeClose: false,
		//shade:false,
		content: jQuery("#repulseReasonLayer"),
		btn: ['确认','取消'],
		btn1: function (index) {
			if($('#repulseReason').val().trim().length <= 0){
				alert("请填写退回原因");
				return;
			}
			$.get(baseURL + "qbfx/intelligence/repulse/"+intelligenceId,{repulseReason: $('#repulseReason').val().trim()}, function(r){
				layer.close(index);
		        if(r.code == 0) {
		        	alert("情报退回成功！");
		        	$("#jqGrid").trigger("reloadGrid");
		        } else {
		        	alert("操作异常，请联系管理员！");
		        }
		    });
		},
		btn2: function (index) {
			//清空页面数据
			$("#repulseReason").val("");
		}
	});
}
/*
 * 上报、下发
 * 1：下发；2：上报；5：提交
 */
function upOrDown(intelligenceId,type){
	if(type == 1){
		confirmText = '确定要下发该记录？';
		alertText = '情报下发成功！';
	} else if (type == 2){
		confirmText = '确定要上报该记录？';
		alertText = '情报上传成功！';
	} else {
		confirmText = '确定要提交该记录？';
		alertText = '案件提交成功！';
	}
	confirm(confirmText, function(){
		$.get(baseURL + "qbfx/intelligence/handle/"+intelligenceId+"/"+type, function(r){
	        if(r.code == 0) {
	        	alert(alertText);
	        	$("#jqGrid").trigger("reloadGrid");
	        } else {
	        	alert(r.msg);
	        }
	    });
	});
}
//删除
function deleteById(intelligenceId){
	confirm('确定要删除选中的记录？', function(){
		$.ajax({
			type: "POST",
		    url: baseURL + "qbfx/intelligence/delete",
            contentType: "application/json;charset=utf-8",
		    data: '["' + intelligenceId + '"]',
		    success: function(r){
				if(r.code == 0){
					alert('操作成功', function(index){
						//$("#jqGrid").trigger("reloadGrid");
						vm.delReload([intelligenceId], $("#jqGrid"));
					});
					/*layer.msg('操作成功',{
		    			  icon: 1,
		    			  time: 2000 //2秒关闭（如果不配置，默认是3秒）
		    			}, function(index){
		    				$("#jqGrid").trigger("reloadGrid");
		    			}
	    			);*/
				}else{
					alert(r.msg);
				}
			}
		});
	});
}

/************* 核查 B *************/
function checkPage(intelligenceId){
	//跳转到明细页面
	view(intelligenceId);
	$('#checkPanel').show();
	//核查
	vm.showButtonCheck = true;
	
	vm.showCluePanel = false;
	vm.titleSecond = "二次核查";
	
	vm.checkIn = {
		intelligenceId: vm.intelligence.intelligenceId,
		userId: user.userId,
		username: user.realname,
		createTime: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
		content: ''
	}
	$("#checkPanel textarea").removeAttr("disabled");
}

/**
 * 核查处理（点击底部“核查”按钮触发）
 * @param type 页面跳转类型，-1：不跳转；其他：跳转到查询界面
 * @returns
 */
function checkHandler(type){
	if(vm.checkIn.content.trim().length <= 0){
		alert("请填写二次核查内容");
		return;
	}
	$.ajax({
		type: "POST",
	    url: baseURL + "qbfx/intelligence/saveCheck",
	    data: JSON.stringify(vm.checkIn),
	    contentType: "application/json;charset=utf-8",
	    success: function(result){
			if(result.code == 0){
				/*layer.alert('二次核查成功', function(index){
					//清空页面数据
					if(type == -1){	//明细页面
						vm.showCheckTable = true;
						$("#checkTable").bootstrapTable('append', result.check);
						window.parent.vm.isEditted = false;
					} else {	//查询页面
						//vm.changePage(0);
						vm.reload();
						$('.footerPanel').hide();
					}
				});*/
				layer.alert('二次核查成功', function(index){
					vm.switchPage();
				});
			}else{
				layer.alert(result.msg, function(index){
					vm.reload();
					$('.footerPanel').hide();
				});
			}
		}
	});
}
/************* 核查 B *************/

/************* 盯办 B *************/
function starePage(intelligenceId){
	$('#starePanel').show();
	//跳转到明细页面
	view(intelligenceId);
	//盯办
	vm.showButtonStare = true;
	
	vm.showCluePanel = false;
	vm.titleSecond = "线索盯办";
	
	vm.stareIn = {
		intelligenceId: vm.intelligence.intelligenceId,
		userId: user.userId,
		username: user.realname,
		createTime: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
		matter: ''
	}
	$("#starePanel textarea").removeAttr("disabled");
}

function stareHandler(type){
	if(vm.stareIn.matter.trim().length <= 0){
		alert("请填写盯办事项");
		return;
	}
	$.ajax({
		type: "POST",
	    url: baseURL + "qbfx/intelligence/saveStare",
	    data: JSON.stringify(vm.stareIn),
	    contentType: "application/json;charset=utf-8",
	    success: function(result){
			if(result.code == 0){
				layer.alert('盯办成功', function(index){
					vm.switchPage();
					/*//清空盯办页面数据
					if(type == -1){	//明细页面
						vm.showStareTable = true;
						$("#stareTable").bootstrapTable('append', result.stare);
						window.parent.vm.isEditted = false;
					} else {	//查询页面
						vm.changePage(0);
						vm.reload();
						$('.footerPanel').hide();
					}*/
				});
			}else{
				layer.alert(result.msg, function(index){
					//vm.reload();
					//$('.footerPanel').hide();
					vm.switchPage();
				});
			}
		}
	});
}

function stare(intelligenceId){
	var type = intelligenceId;
	//从明细页面点击
	if(intelligenceId == -1){
		intelligenceId = vm.intelligence.intelligenceId;
	}
	vm.stare = {
		intelligenceId: vm.intelligence.intelligenceId,
		userId: user.userId,
		username: user.realname,
		createTime: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
		matter: ''
	}
	$("#stareLayer textarea").removeAttr("disabled");
	layer.open({
		type: 1,
		skin: 'layui-layer-molv',
		title: "线索盯办",
		area: ['580px', '340px'],
		shadeClose: false,
		//shade:false,
		content: jQuery("#stareLayer"),
		btn: ['确认','取消'],
		btn1: function (index) {
			if(vm.stare.matter.trim().length <= 0){
				alert("请填写盯办事项");
				return;
			}
			$.ajax({
				type: "POST",
			    url: baseURL + "qbfx/intelligence/saveStare",
			    data: JSON.stringify(vm.stare),
			    contentType: "application/json;charset=utf-8",
			    success: function(result){
					if(result.code == 0){
						layer.close(index);
						layer.alert('盯办成功', function(index){
							//清空盯办页面数据
							$("#stareLayer textarea").val("");
							if(type == -1){	//明细页面
								vm.showStareTable = true;
								$("#stareTable").bootstrapTable('append', result.stare);
								layer.close(index);
								window.parent.vm.isEditted = false;
							} else {	//查询页面
								vm.changePage(0);
								vm.reload();
								layer.close(index);
							}
						});
					}else{
						layer.alert(result.msg, function(index){
							vm.reload();
						});
					}
				}
			});
		},
		btn2: function (index) {
			//清空盯办页面数据
			$("#stareLayer textarea").val("");
			window.parent.vm.isEditted = false;
		}
	});
}
/************* 盯办 E *************/
/************* 研判 B *************/
//$("input:radio[name:sheetType]").change(function(){
//研判类型切换
function transferTypeChange(){
	var val=$('input:radio[name="transferType"]:checked').val();
	//流转
	if(val == 0){
		vm.showTransferType = 0;
	} 
	//确认办结
	else {
		vm.showTransferType = 1;
	}
}

function transfer(intelligenceId){
	//获取当前用户信息，判断该权限
//	var ret = jQuery("#jqGrid").jqGrid('getRowData', intelligenceId);
	var entityNow = vm.getInfo(intelligenceId);
	if(entityNow.state == 6){
		alert("线索已被删除，无法操作！");
		vm.reload();
		return;
	} else if(entityNow.state == 3) {
		alert("线索已被退回，无法操作！");
		vm.reload();
		return;
	} else if(entityNow.transferUserId == null || entityNow.transferUserId == "" || entityNow.transferUserId == -1) {
		confirm('当前线索尚未锁定，确认锁定该线索？', function(){
			$.get(baseURL + "qbfx/intelligence/handle/"+intelligenceId+"/4", function(r){
				jQuery("#jqGrid").jqGrid('setRowData', intelligenceId, {transferUserId: user.userId});
				if(r.code == 0){
					//查询页面，更新状态
					if(vm.showPage == 0){
						vm.reload();
						vm.jumpPage('TRANSFER-' + intelligenceId);
					}
				} else {
					layer.alert(r.msg, function(index){
						vm.reload();
					});
				}
			});
		});
	} else {
		if(entityNow.transferUserId != user.userId){
			alert("当前线索已被其他人锁定，无法研判");
			vm.reload();
		}else{
			vm.jumpPage('TRANSFER-' + intelligenceId);
		}
	}
	/*$.get(baseURL + "qbfx/intelligence/infoLess/"+intelligenceId, function(r){
		if(r.code == 0){
			var ret = r.intelligence;
			if(ret.transferUserId == "" || ret.transferUserId == -1){
				jQuery("#jqGrid").jqGrid('setRowData', intelligenceId, {transferUserId: user.userId});
				if(r.code == 0){
					//查询页面，更新状态
					if(vm.showPage == 0){
						vm.reload();
						vm.jumpPage('TRANSFER-' + intelligenceId);
					}
				} else {
					layer.alert(r.msg, function(index){
						vm.reload();
					});
				}
			} else {
				if(ret.transferUserId != user.userId){
					layer.alert("当前线索已被其他人锁定，无法研判", function(index){
						vm.reload();
					});
				}else{
					//transferPage(intelligenceId);
					vm.jumpPage('TRANSFER-' + intelligenceId);
				}
			}
		}else{
			alert(r.msg);
		}
	});*/
	
	/**
	 * var ret = jQuery("#jqGrid").jqGrid('getRowData', intelligenceId);
	if(ret.transferUserId == "" || ret.transferUserId == -1){
		$.get(baseURL + "qbfx/intelligence/handle/"+intelligenceId+"/4", function(r){
			jQuery("#jqGrid").jqGrid('setRowData', intelligenceId, {transferUserId: user.userId});
			if(r.code == 0){
				//查询页面，更新状态
				if(vm.showPage == 0){
					vm.reload();
				}
				confirm('当前线索已锁定，现在填写研判信息？', function(){
					transferEdit(intelligenceId);
				});
			} else {
				alert(r.msg);
			}
		});
	} else {
		transferEdit(intelligenceId);
	}
	 */
}
//研判页面
function transferPage(intelligenceId){
	//跳转到明细页面
	view(intelligenceId);
	//流转
	if(vm.intelligence.operation.allowTransfer){
		vm.showButtonTransfer = true;
	}
	
	$("#transferPanel").show();
	//vm.showButtonTransfer = true;
	
	vm.showCluePanel = false;
	vm.titleSecond = "线索研判";
	
	transferFlag = 0;
	vm.transferEntityIn = {
		intelligenceId: vm.intelligence.intelligenceId,
		userId: user.userId,
		username: user.realname,
		deptId: user.deptId,
		deptName: user.deptName,
		opinion: '',
		demand: '',
		result: '',
		auditTime: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
		intelligenceUserIds: []
	};
	$(".transferInput").removeAttr("disabled");
	$(".isAdoptInput").removeAttr("disabled");
	$("#transferUserNames").val("");
	$("#handleRadio1").prop("checked", true);
	vm.showTransferType = '0';
	
	vm.optType = 'transfer';
}

function transferHandler(){
	if(vm.transferButtonCanClick == false){
		return;
	}
	if(!vm.transferEntityIn.hasOwnProperty("opinion") || vm.transferEntityIn.opinion == undefined || vm.transferEntityIn.opinion == ''){
		alert("请选择审核意见");
		return;
	} 
	//研判
	if($('input:radio[name="transferType"]:checked').val() == '0'){
		if($('#transferUserNames').val().trim().length <= 0){
			alert("请选择流转人/反馈人");
			return;
		}
	} else {
		if(!vm.transferEntityIn.hasOwnProperty("result") || vm.transferEntityIn.result == ''|| vm.transferEntityIn.result == undefined){
			alert("请选择打击处理情况");
			return;
		} 
	}
	if(vm.transferEntityIn.demand.trim().length <= 0){
		alert("请填写工作要求");
		return;
	} 
	//console.log("transferEntityIn : " + JSON.stringify(vm.transferEntityIn));
	vm.transferButtonCanClick = false;
	$.ajax({
		type: "POST",
	    url: baseURL + "qbfx/intelligence/saveTransfer",
	    data: JSON.stringify(vm.transferEntityIn),
	    contentType: "application/json;charset=utf-8",
	    success: function(result){
	    	//console.log("reslut : " + JSON.stringify(result));
			if(result.code == 0){
				//流转
				if($('input:radio[name="transferType"]:checked').val() == '0'){
					layer.alert('研判成功', function(index){
						vm.switchPage();
						/*vm.changePage(0);
						vm.reload();
						$('.footerPanel').hide();*/
					});
				}
				//确认办结
				else {
					//console.log("JSON.stringify(vm.transferEntity) : " + JSON.stringify(vm.transferEntity));
					$.ajax({
						type: "POST",
					    url: baseURL + "qbfx/intelligence/finished/" + vm.transferEntityIn.intelligenceId + "/" + vm.transferEntityIn.result,
					    data: vm.transferEntityIn.victory == undefined ? '' : vm.transferEntityIn.victory.trim(),
					    contentType: "application/json;charset=utf-8",
					    success: function(result){
							if(result.code == 0){
								layer.alert('办结成功', function(index){
									vm.switchPage();
									/*vm.changePage(0);
									vm.reload();
									$('.footerPanel').hide();*/
								});
							}else{
								layer.alert(result.msg, function(index){
									vm.reload();
									$('.footerPanel').hide();
								});
							}
						}
					});
				}
			}else{
				layer.alert(result.msg, function(index){
//					vm.reload();
					vm.switchPage();
					$('.footerPanel').hide();
				});
			}
			vm.transferButtonCanClick = true;
		}
	});
}

/*function transferEdit(intelligenceId){
	transferFlag = 0;
	vm.transferEntity = {
		intelligenceId: vm.intelligence.intelligenceId,
		userId: user.userId,
		username: user.realname,
		deptId: user.deptId,
		deptName: user.deptName,
		opinion: '',
		demand: '',
		result: '',
		auditTime: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
		intelligenceUserIds: []
	};
	$(".transferInput").removeAttr("disabled");
	$("#transferUserNames").val("");
	$("#handleRadio1").prop("checked", true);
	vm.showTransferType = '0';
	layer.open({
		type: 1,
		skin: 'layui-layer-molv',
		title: "线索研判",
		area: ['750px', '480px'],
		shadeClose: false,
		//shade:false,
		content: jQuery("#transferLayer"),
		btn: ['确定','取消'],
		btn1: function (index) {
			if(vm.transferButtonCanClick == false){
				return;
			}
			if(!vm.transferEntity.hasOwnProperty("opinion") || vm.transferEntity.opinion == undefined || vm.transferEntity.opinion == ''){
				alert("请选择审核意见");
				return;
			} 
			if(vm.transferEntity.demand.trim().length <= 0){
				alert("请填写工作要求");
				return;
			} 
			//研判
			if($('input:radio[name="transferType"]:checked').val() == '0'){
				
				if($('#transferUserNames').val().trim().length <= 0){
					alert("请选择流转人");
					return;
				}
			} else {
				if(!vm.transferEntity.hasOwnProperty("result") || vm.transferEntity.result == ''|| vm.transferEntity.result == undefined){
					alert("请选择打击处理情况");
					return;
				} 
			}
			vm.transferButtonCanClick = false;
			$.ajax({
				type: "POST",
			    url: baseURL + "qbfx/intelligence/saveTransfer",
			    data: JSON.stringify(vm.transferEntity),
			    contentType: "application/json;charset=utf-8",
			    success: function(result){
			    	console.log("reslut : " + JSON.stringify(result));
					if(result.code == 0){
						//流转
						if($('input:radio[name="transferType"]:checked').val() == '0'){
							layer.close(index);
							layer.alert('研判成功', function(index){
								vm.changePage(0);
								vm.reload();
								layer.close(index);
							});
						}
						//确认办结
						else {
							//console.log("JSON.stringify(vm.transferEntity) : " + JSON.stringify(vm.transferEntity));
							$.ajax({
								type: "POST",
							    url: baseURL + "qbfx/intelligence/finished/" + vm.transferEntity.intelligenceId + "/" + vm.transferEntity.result,
							    success: function(result){
									if(result.code == 0){
										layer.close(index);
										layer.alert('办结成功', function(index){
											vm.changePage(0);
											vm.reload();
											layer.close(index);
										});
									}else{
										layer.close(index);
										layer.alert(result.msg, function(index){
											vm.reload();
										});
									}
								}
							});
						}
					}else{
						layer.alert(result.msg, function(index){
							vm.reload();
						});
					}
					vm.transferButtonCanClick = true;
				}
			});
		},
		btn2:function() {
			window.parent.vm.isEditted = false;
		}
	});
}*/
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
/************* 办结 B *************/
/*function finishedLayer(intelligenceId){
	//获取当前用户信息，判断该权限
	var ret = jQuery("#jqGrid").jqGrid('getRowData', intelligenceId);
	if(ret.transferUserId == "" || ret.transferUserId == -1){
		$.get(baseURL + "qbfx/intelligence/handle/"+intelligenceId+"/4", function(r){
			jQuery("#jqGrid").jqGrid('setRowData', intelligenceId, {transferUserId: user.userId});
			if(r.code == 0){
				vm.reload();
				confirm('当前线索已锁定，现在填写办结信息？', function(){
					finishedLayerEdit(intelligenceId);
				});
			} else {
				alert(r.msg);
			}
		});
	} else {
		finishedLayerEdit(intelligenceId);
	}
}
function finishedLayerEdit(intelligenceId){
	layer.open({
		type: 1,
		skin: 'layui-layer-molv',
		title: "确认办结",
		area: ['550px', '210px'],
		shadeClose: false,
		//shade:false,
		content: jQuery("#finishedLayer"),
		btn: ['确认','取消'],
		btn1: function (index) {
			$.ajax({
				type: "POST",
			    url: baseURL + "qbfx/intelligence/finished/" + intelligenceId + "/" + $("#result").val(),
			    success: function(result){
					if(result.code == 0){
						layer.close(index);
						layer.alert('办结成功', function(index){
							//清空办结页面数据
							$("#result").val(0);
							vm.changePage(0);
							vm.reload();
							layer.close(index);
						});
					}else{
						layer.alert(result.msg, function(index){
							vm.reload();
						});
					}
				}
			});
		},
		btn2: function (index) {
			//清空办结页面数据
			$("#result").val(0);
		}
	});
}*/
/************* 办结 E *************/

/************* 加载情报信息 B *************/

function loadingIntelligence(intelligenceId){
	$.ajaxSettings.async = false;
	intelligenceUserIds = [];
	$.get(baseURL + "qbfx/intelligence/info/"+intelligenceId+"/46", function(r){
		vm.intelligence = r.intelligence;
		
		$.ajaxSettings.async = true;
		//线索
		if(vm.intelligence.intelligenceKind != 1){
			vm.intelligence.isAdoptOriginal = vm.intelligence.isAdopt;
			//期号大于0,有主标题
			if(vm.intelligence.issue != null && vm.intelligence.issue > 0){
				/*var kindName = '';
				for(var i=0; i<vm.kindDictList.length; i++){
 					if(vm.kindDictList[i].code == vm.intelligence.intelligenceKind){
 						kindName = vm.kindDictList[i].value;
 						break;
 					}
 				}
				vm.titleMain = vm.intelligence.createDeptName + '-技侦（' + kindName +'）专刊第' + vm.intelligence.issue + '期';*/
				vm.titleMain = vm.intelligence.titleMain;
			} else {
				vm.titleMain = null;
			}
			CKEDITOR.instances.clueIntroEditor.setData(vm.intelligence.intro);
			//初始化涉案人员
			//console.log(JSON.stringify(vm.intelligence.personList));
			$("#personTable").bootstrapTable('append', vm.intelligence.personList);
			//初始化附件
			$("#clueFileTable").bootstrapTable('append', vm.intelligence.fileList);
			//盯办列表
			if(vm.intelligence.stareList != null && vm.intelligence.stareList.length>0){
				vm.showStareTable = true;
				//初始化盯办列表
				$("#stareTable").bootstrapTable('append', vm.intelligence.stareList);
			}
			//核查列表
			if(vm.intelligence.checkList != null && vm.intelligence.checkList.length>0){
				vm.showCheckTable = true;
				//console.log(JSON.stringify(vm.intelligence.checkList));
				//初始化核查列表
				$("#checkTable").bootstrapTable('append', vm.intelligence.checkList);
			} else {
				vm.showCheckTable = false;
			}
			//流转列表
			if(vm.intelligence.transferList != null && vm.intelligence.transferList.length>0){
				vm.showTransferTable = true;
				//初始化审核列表
				var nodeNames = '';
				var intelligenceUserIds = [];
				for(var i in vm.intelligence.transferList){
					nodeNames = '';
					intelligenceUserIds = [];
					for (var j in vm.intelligence.transferList[i].intelligenceUserList) {
						nodeNames += vm.intelligence.transferList[i].intelligenceUserList[j].realname + ";";
						intelligenceUserIds.push(vm.intelligence.transferList[i].intelligenceUserList[j].userId);
					}
					vm.intelligence.transferList[i].transferUserNames = nodeNames;
					vm.intelligence.transferList[i].intelligenceUserIds = intelligenceUserIds;
				}
				$("#transferTable").bootstrapTable('append', vm.intelligence.transferList);
			}
			
			//手动关联情报初始化
			//$("#relatedIntelligenceTable").bootstrapTable('append', vm.intelligence.manualIntelligenceList);
			//自动关联情报初始化
			//$("#autoIntelligenceTable").bootstrapTable('append', vm.intelligence.autoIntelligenceList);
			//发起时间
			$("#launchTimePicker").val(vm.intelligence.launchTime);
		} else {	//案件
			CKEDITOR.instances.caseIntroEditor.setData(vm.intelligence.intro);
			//console.log(CKEDITOR.instances.caseIntroEditor.getData());
			//console.log("vm.intelligence.caseLogList : " + JSON.stringify(vm.intelligence.caseLogList));
			//初始化案件日志
			$("#caseLogTable").bootstrapTable('append', vm.intelligence.caseLogList);
			//初始化附件
			$("#caseFileTable").bootstrapTable('append', vm.intelligence.fileList);
			//提案时间
			$("#proposalTimePicker").val(vm.intelligence.launchTime);
		}
		//接收人 || 侦办人
		if(vm.intelligence.receiveUserList != null && vm.intelligence.receiveUserList.length>0){
			var intelligenceUserIds = [];
			var nodeNames = '';
			for (var index in vm.intelligence.receiveUserList) {
				intelligenceUserIds.push(vm.intelligence.receiveUserList[index].userId);
				nodeNames += vm.intelligence.receiveUserList[index].realname + ";";
			}
			vm.intelligence.receiveUserNames = nodeNames;
			vm.intelligence.receiveUserIds = intelligenceUserIds;
		}
		//盯办人
		if(vm.intelligence.stareUserList != null && vm.intelligence.receiveUserList.length>0){
			var intelligenceUserIds = [];
			var nodeNames = '';
			for (var index in vm.intelligence.stareUserList) {
				intelligenceUserIds.push(vm.intelligence.stareUserList[index].userId);
				nodeNames += vm.intelligence.stareUserList[index].realname + ";";
			}
			vm.intelligence.stareUserNames = nodeNames;
			vm.intelligence.stareUserIds = intelligenceUserIds;
		}
		//是否显示盯办人
		$.get(baseURL + "sys/dept/info/"+vm.intelligence.deptId, function(r){
			if(r.dept.type == '0'){
				vm.showStare = true;
			}
		});
	});
}
/************* 加载情报信息 E *************/
/************* 详情 B *************/
function view(intelligenceId){
	vm.clearPage();
	loadingIntelligence(intelligenceId);
	operation="0";
	//明细页面
	vm.isDetail = true;
	/*$("input,select,textarea").css('border-style',"none");
	$("input,select,textarea").css("-moz-appearance",'none');
	$("input,select,textarea").css("background-color",'transparent');*/
	if(vm.intelligence.intelligenceKind != 1){
		
		vm.title="线索查看"
		//页面输入框、下拉框等，全部禁用
		$('#cluePage input,#cluePage select,#cluePage textarea').attr("disabled","disabled");
		$(".searchbar-long input").removeAttr("disabled");
		$("#receiveUserNames").removeAttr("disabled");	//接收人
		$("#stareUserNames").removeAttr("disabled");
		$("#transferUserNames").removeAttr("disabled");
		
		$('#cluePage a[type="button"]').hide();
		vm.inputDisabled = true;
		
		//隐藏复选框列
		$("#clueFileTable").bootstrapTable('hideColumn', 'checkBox');
		$("#personTable").bootstrapTable('hideColumn', 'checkBox');
		$("#personTable").bootstrapTable('hideColumn', 'source');
		//$("#relatedIntelligenceTable").bootstrapTable('hideColumn', 'checkBox');
		vm.changePage(1,0);
		//设置不可编辑
		//CKEDITOR.instances.clueIntroEditor.setReadOnly(true); 
		//串并分析
		vm.personAnalysis(1,1);
	} else {
		
		vm.title="案件查看"
		//页面输入框、下拉框等，全部禁用
		$('#casePage input,#casePage select,#casePage textarea').attr("disabled","disabled");
		$("#investigatorsNames").removeAttr("disabled");
		$('#casePage a[type="button"]').hide();
		
		//隐藏 复选框列
		$("#caseLogTable").bootstrapTable('hideColumn', 'checkBox');
		$("#caseFileTable").bootstrapTable('hideColumn', 'checkBox');
		vm.changePage(2,0);
		//CKEDITOR.instances.caseIntroEditor.setReadOnly(true); 
	}
	
	/**
	 * 按钮展示控制
	 */
	/*//【上报】 条件1：（状态 ， 0：存草稿）AND 条件2：（用户组织类型 = 1-县大队）
	if(vm.intelligence.state == "0" && user.deptType == '1'){
		vm.showButtonUp = true;
	}
	//【下发】 条件1：（状态 ， 0：存草稿）AND 条件2：（用户组织类型 = 2-直属大队）
	if(vm.intelligence.state == "0" && user.deptType == '0'){
		vm.showButtonDown = true;
	}*/
	//导出
	if(vm.intelligence.operation.allowExport)
		vm.showButtonExport = true;
}
/************* 详情 E *************/
/************* 修改 B *************/
function edit(intelligenceId){
	vm.clearPage();
	operation = "1";
	loadingIntelligence(intelligenceId);
	
	if(vm.intelligence.intelligenceKind != 1){
		vm.title = "线索修改";
		
		$("#clueFileTable").bootstrapTable('showColumn', 'checkBox');
		$("#personTable").bootstrapTable('showColumn', 'checkBox');
		//$("#relatedIntelligenceTable").bootstrapTable('showColumn', 'checkBox');
		vm.changePage(1,1);
		//串并分析
		vm.personAnalysis(1,1);
	} else {
		vm.title = "案件修改";
		
		$("#caseLogTable").bootstrapTable('showColumn', 'checkBox');
		$("#caseFileTable").bootstrapTable('showColumn', 'checkBox');
		vm.changePage(2,1);
	}
	vm.intelligence.deleteCaseLogIds = [];
	/**
	 * 按钮展示控制
	 */	
	//【存草稿】	条件1：（intelligence状态 = 0-存草稿）
	if(vm.intelligence.state == "0"){
		vm.showButtonSave = true;
		vm.showButtonSaveUp = true;
	}
	//【上报】 状态	条件1：（状态 ， 0：存草稿）AND 条件2：（用户组织类型 = 1-县大队）
	if(user.deptType == '1' && (vm.intelligence.state == "0" 
			//存草稿 AND 当前用户录入的数据
		||(vm.intelligence.createUserId == user.userId && vm.intelligence.state == "3"))){
		vm.showButtonUp = true;
	}
	//【下发】 状态	条件1：（状态 ， 0：存草稿）AND 条件2：（用户组织类型 = 2-直属大队）
	if(user.deptType == '0' && (vm.intelligence.state == "0"
		//存草稿 AND 当前用户录入的数据
		||(vm.intelligence.createUserId == user.userId && vm.intelligence.state == "3"))){
		vm.showButtonDown = true;
	}
	//【保存-线索】	存草稿不显示 vm.showButtonSave == false AND allowUpdate == 1
	if(!vm.showButtonSave && vm.intelligence.operation.allowEdit){
		vm.showButtonAdminSave = true;
	}
}
/************* 详情 E *************/
/*************** 操作列表按钮 ***************/
$(function () {
    //console.log("window.parent.user : " + JSON.stringify(window.parent.vm.user));
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		operationType: 'V',	//操作类型 V:查看 U:修改 A:新增,
		title: null,
		titleSecond: null,	//线索页面底部页面标题
		showPage: null,	//0：列表；1：新增线索；2：新增案件
		
		isDetail: false,	//是否为明细页面， true:明细页面,false:不是
		
		intelligence: {},
		//情报种类列表
		typeDictList: {},
		//情报类型列表
		kindDictList: {},
		//状态列表
		stateDictList: {},
		//情报发生地
		placeDictList: {},
		//语种
		languageDictList: {},
		//审核意见
		auditDictList: {},
		//打击处理情况
		doneDictList: {},
		//性别
		sexList:{},
		//情报类型名称
		kindDict: '',
		//用户信息
		user: window.parent.vm.user,
		//输入框不可用
		inputDisabled: false,
		/**************** 线索相关 B ****************/
		//主标题
		titleMain: '',
		//发起时间
		launchTime: '',
		//涉案人员
		person: {},
		stare: {},		//弹框
		stareIn: {},	//底部录入
		transferEntity: {},		//弹框
		transferEntityIn: {},	//底部录入
		autoList:{},//自动关联情报
		showStare: false,		//盯办人
		showStareTable: false,	//盯办列表
		
		check: {},
		checkIn: {},
		showCheckTable: false,	//是否显示核查列表
		
		showTransferTable: false,	//流转列表
		showTransferType: 0,	//弹出框 默认进行流转操作；	0：流转；1: 确认办结
		/**************** 线索相关 E ****************/
		/**************** 案件相关 B ****************/
		//提案时间
		proposalTime: '',
		//案件日志
		caseLog: {},
		/**************** 案件相关 E ****************/
		
		//查询类型 0：全文检索；1：高级查询 【默认：0】
		searchType: '0',
		//切换按钮文字展示
		changeSearchButtonText: "高级查询",
		//查询条件
		searchParams: {searchInfo:'',title:'',intro:'',createDeptName:"",deptId:""},
		
		//查询条件-关联情报弹出页面
		relationSearchParams: {},
		/**************** 底部按钮组 B ****************/
		showButtonSave: false,		//存草稿
		showButtonSaveUp: false,	//保存
		showButtonUp: false,		//上报
		showButtonDown: false,		//下发
		showButtonTransfer: false,	//研判
		showButtonCheck: false,		//核查
		showButtonStare: false,		//盯办
		showButtonExport: false,	//导出
		showButtonReset: false,		//重置
		
		showButtonAdminSave: false,	//管理员保存按钮
		/**************** 底部按钮组 E ****************/
		
		globalDateTimePickerId:"",
		selectUsers:[],
		isShowUserTreeDisable : false,
		transferButtonCanClick : true,
		
		showCluePanel: true,	//是否显示 线索也页面（研判、盯办、核查时使用）
		showRightPanel: false,	//是否显示右侧面板
		rightRanelParam: "",		//右侧面板查询参数
		rightSearchResult: null,	//右侧查询返回结果	1:没有查询条件；2:没有查询结果；3：返回查询结果
		rightSearchType: 0,	//0：全文检索；1：关键字检索
		rightSearchList:{},			//串并分析查询结果
		
		personSearchParams: {},		//新增涉案人员 弹出框查询参数
		disableIntroHandler: false,	//自动识别 按钮不可用
		isButtonDisable:false,
		pageNum:1,                  //串并分析页码
		totalPage:1,                //串并分析结果页码数
		analysisType:0           //串并分析参数来源  0：面板查询框，1：自动识别
	},
	
	methods: {
		/**
		 * 加载字典值
		 */
		loadingDict: function(){
			var dictListMap = window.parent.vm.dictListMap;
			this.typeDictList = dictListMap.get('intelligenceType');	//情报种类
			this.kindDictList = dictListMap.get('intelligenceKind');	//情报类型
			this.placeDictList = dictListMap.get('intelligencePlace');	//情报发生地
			this.languageDictList = dictListMap.get('intelligenceLanguage');	 //语种
			this.doneDictList = dictListMap.get('doneType');		//打击处理情况
			this.auditDictList = dictListMap.get('auditType');	//审核意见
			this.sexList = dictListMap.get('sex');		//性别
			this.stateDictList = dictListMap.get('intelligenceState');	//状态
		},
		loadingTable: function(){
			$("#jqGrid").jqGrid({
		        url: baseURL + 'qbfx/intelligence/list/46',
		        datatype: "json",
		        colModel: [			
					{ label: '序号', hidden:true, name: 'intelligenceId', index: 'intelligence_id', width: 50, key: true },
					{ label: '当前操作用户', hidden:true, name: 'transferUserId', index: 'transfer_user_id', width: 50},
					{ label: '标题', sortable: false, name: 'title', index: 'title', width: 180, formatter:function(value, grid, row, state){
						/*var titleMainTable = '';
						//期号大于0,有主标题
						if(row.issue != null && row.issue > 0){
							var kindName = row.intelligenceKind;
							for(var i=0; i<vm.kindDictList.length; i++){
			 					if(vm.kindDictList[i].code == row.intelligenceKind){
			 						kindName = vm.kindDictList[i].value;
			 						break;
			 					}
			 				}
							titleMainTable = '《' + row.createDeptName + '-技侦（' + kindName +'）专刊第' + row.issue + '期》';
						}*/
						var titleMainTable = '';
						if(row.titleMain != null && row.titleMain.length > 0){
							titleMainTable = '《' + row.titleMain + '》';
						}
						
		   				var str = '<a style="cursor: pointer" onclick="vm.jumpPage(\'V-' + row.intelligenceId +'\')">'+ titleMainTable + value +'</a>';
		   				return str;
		   			}}, 
					/*{ label: '内容', sortable: false, name: 'intro', index: 'intro', width: 180 }, */			
					{ label: '情报种类',align: 'center', name: 'intelligenceType', index: 'intelligence_type', width: 60 , formatter: function(value, options, row){
						 for(var i=0; i < vm.typeDictList.length; i++){
		 					if(vm.typeDictList[i].code == value){
		 						return vm.typeDictList[i].value;
		 					}
		 				}
			        	   return value;
						}}, 			
					{ label: '情报类型',align: 'center', name: 'intelligenceKind', index: 'intelligence_kind', width: 50 , formatter: function(value, options, row){
						 for(var i=0; i<vm.kindDictList.length; i++){
		 					if(vm.kindDictList[i].code == value){
		 						return vm.kindDictList[i].value;
		 					}
		 				}
			        	   return value;
					}}, 			
					{ label: '发起时间',align: 'center', name: 'launchTime', index: 'launch_time', width: 95, formatter:"date",formatoptions: {srcformat:'Y-m-d H:i:s',newformat:'Y-m-d H:i:s'} }, 			
					{ label: '状态',align: 'center', name: 'state', index: 'state', width: 40 , formatter: function(value, options, row){
						var str = vm.stateDictList[value].value;
						if(row.state == '3'){
							str = '<span style="color:red">' + str + '</span>';
						}
						return str;
					}},
					{ label: '战果', sortable: false, name: 'victory', index: 'victory', width: 120, formatter: function(value, options, row){
						if(value != null){
							return '<span style="color:red">' + value + '</span>';
						} else {
							return '';
						}
					}},
					{ label: '操作', sortable: false, align: 'center', name: 'state', index: 'state', width: 120 , formatter: function(value, grid, row, state){
						var str = '';
						if(row.operation.allowView)
							str += '<a style="cursor: pointer" title="详情" onclick="vm.jumpPage(\'V-'+ row.intelligenceId +'\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
						if(row.operation.allowEdit)
							str += '<a style="cursor: pointer" title="修改" onclick="vm.jumpPage(\'U-'+ row.intelligenceId +'\')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
						if(row.operation.allowUp){
							if(row.intelligenceKind != 1){
								str += '<a style="cursor: pointer" title="上报" onclick="upOrDown('+ row.intelligenceId +',2)"><span class="glyphicon glyphicon-send" aria-hidden="true"></span></a>';
							} else {
								str += '<a style="cursor: pointer" title="提交" onclick="upOrDown('+ row.intelligenceId +',5)"><span class="glyphicon glyphicon-floppy-saved" aria-hidden="true"></span></a>';
							}
						}
						if(row.operation.allowDown){
							if(row.intelligenceKind != 1){
								str += '<a style="cursor: pointer" title="下发" onclick="upOrDown('+ row.intelligenceId +',1)"><span class="glyphicon glyphicon-send" aria-hidden="true"></span></a>';
							} else {
								str += '<a style="cursor: pointer" title="提交" onclick="upOrDown('+ row.intelligenceId +',5)"><span class="glyphicon glyphicon-floppy-saved" aria-hidden="true"></span></a>';
							}
						}
						if(row.operation.allowDelete)
							str += '<a style="cursor: pointer" title="删除" onclick="deleteById('+ row.intelligenceId +')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
						if(row.operation.allowTransfer)
							str += '<a style="cursor: pointer" title="研判" onclick="transfer('+ row.intelligenceId +')"><span class="glyphicon glyphicon-pawn" aria-hidden="true"></span></a>';
						if(row.operation.allowCheck)
							str += '<a style="cursor: pointer" title="二次核查" onclick="vm.jumpPage(\'CHECK-'+ row.intelligenceId +'\')"><span class="glyphicon glyphicon-superscript" aria-hidden="true"></span></a>';
						if(row.operation.allowStare)
							str += '<a style="cursor: pointer" title="盯办" onclick="vm.jumpPage(\'STARE-'+ row.intelligenceId +'\')"><span class="glyphicon glyphicon-screenshot" aria-hidden="true"></span></a>';		 
						if(row.operation.allowRefuse)
							str += '<a style="cursor: pointer" title="退回" onclick="repulse('+ row.intelligenceId +')"><span class="glyphicon glyphicon-open" aria-hidden="true"></span></a>';
						if(row.operation.allowExport)
							str += '<a style="cursor: pointer" title="导出" onclick="exportWord('+ row.intelligenceId +')"><span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span></a>';
						return str;
					}}, 
					{ label: '删除权限', sortable: false, name: 'operation.allowDelete', index: 'operation.allowDelete', hidden:true },
					{ label: '导出权限', sortable: false, name: 'operation.allowExport', index: 'operation.allowExport', hidden:true }
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
		        	createType: '0',
		        }
		    });
		},
		/*********************************** 多窗口操作 B ***********************************/
		/**
		 * 页面跳转（打开多页面）
		 */
		jumpPage: function(type_id){
			//当前页面 url （与数据库中统一）
			var url = self.frameElement.getAttribute('src');
			var paramArr = type_id.split('-');
			var title = null;
			//新增
			if(paramArr[0] == 'A'){		
				if(paramArr[1] == '0' ){	//线索
					title = '情报研判-线索';
				} else { //案件
					title = '情报研判-案件';
				}
			} else {
				var entityNow = vm.getInfo(paramArr[1]);
	            if(!entityNow || entityNow.state == 6){
					alert('数据已被删除，无法操作！');
					$("#jqGrid").trigger("reloadGrid");
					return;
				}
			}
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
		exportWord: function (){
			exportWord(vm.intelligence.intelligenceId);
		},
		//批量导出
		batchExportWord: function (event) {		
			var intelligenceIds = getSelectedRows();	
			if(intelligenceIds == null){
				return ;
			}
			
			var selectIdArray = (""+intelligenceIds).split(",");
			var resultStr = ""
			for(var i=0; i<selectIdArray.length; i++){
				var rowData = $("#jqGrid").getRowData(selectIdArray[i]);
				if(rowData["operation.allowExport"] == "false"){
					resultStr += "【" + rowData.title + "】"
				}
			}
			if(resultStr != ""){
				alert("您对" + resultStr + "不具有导出权限，请重新选择");
				return;
			}
			
			var intelligenceIdStr = JSON.stringify(intelligenceIds);
			
			intelligenceIdStr = intelligenceIdStr.replace("[","");
			intelligenceIdStr = intelligenceIdStr.replace("]","");
			for(var j=0;j<= intelligenceIdStr.length;j++){
				if(intelligenceIdStr.charAt(j)=='"'){
					intelligenceIdStr = intelligenceIdStr.replace('"',"");

			    }     
			}
			
			var url = baseURL + "qbfx/exportToWord/batchExportWord?intelligenceIds="+intelligenceIdStr;
			
			window.location.href = url;
		},
		//导出Excel
		exportExcel:function(){
			var timePicker = $("#TimePicker").val().split(" - ");
			var beginTime=timePicker[0];
			var endTime=timePicker[1] == undefined ? "" : timePicker[1];
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
			
			var url = baseURL + "qbfx/intelligence/exportExcel?launchTimeB="+vm.searchParams.launchTimeB
			+"&launchTimeE="+vm.searchParams.launchTimeE+"&searchType="+vm.searchParams.searchType+"&createType="+vm.searchParams.createType;
			if(vm.searchParams.searchType == 0){	//全文检索
				url = url + "&searchInfo=" + vm.searchParams.searchInfo
			} else {
				if(vm.searchParams.title && vm.searchParams.title != ''){
					url = url + "&title=" + vm.searchParams.title
				}
				if(vm.searchParams.intro && vm.searchParams.intro != ''){
					url = url + "&intro=" + vm.searchParams.intro
				}
				if(vm.searchParams.intelligenceType && vm.searchParams.intelligenceType != ''){
					url = url + "&intelligenceType=" + vm.searchParams.intelligenceType
				}
				if(vm.searchParams.intelligenceKind && vm.searchParams.intelligenceKind != ''){
					url = url + "&intelligenceKind=" + vm.searchParams.intelligenceKind
				}
				if(vm.searchParams.state && vm.searchParams.state != ''){
					url = url + "&state=" + vm.searchParams.state
				}
				if(vm.searchParams.language && vm.searchParams.language != ''){
					url = url + "&language=" + vm.searchParams.language
				}
				if(vm.searchParams.deptId && vm.searchParams.deptId != ''){
					url = url + "&deptId=" + vm.searchParams.deptId
				}
			}
			window.location.href = url;
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
			
			//$('.timePicker').datetimepicker('hide');
		},
		changeSearchType: function () {
			//当前为“全文检索”，切换为“高级查询”
			vm.searchType = (vm.searchType == '0' ? '1' : '0');
			vm.changeSearchButtonText = (vm.searchType == '0' ? '高级查询' : '全文检索');
			//初始化查询条件
//			vm.searchParams = {searchInfo:'',title:'',intro:'',createDeptName:"",deptId:""};
		},
		/**
		 * 重置
		 * type, 0：线索；1：案件
		 */
		resetIntelligence: function(type){
			confirm('确定要重置当前页面？', function(){
				var date = (new Date()).Format("yyyy-MM-dd");
				if(type == 0){
					vm.addClue();
					//重置表格
					$("#clueFileTable").bootstrapTable('removeAll');
					$("#personTable").bootstrapTable('removeAll');
					//$("#relatedIntelligenceTable").bootstrapTable('removeAll');
					//$("#autoIntelligenceTable").bootstrapTable('removeAll');
					
					$("#launchTimePicker").val((new Date()).Format("yyyy-MM-dd hh:mm:ss"));
					CKEDITOR.instances.clueIntroEditor.setData('');
				} else {
					vm.addCase();
					$("#caseFileTable").bootstrapTable('removeAll');
					$("#clueFileTable").bootstrapTable('removeAll');
					
					//提案时间
					$("#proposalTimePicker").val((new Date()).Format("yyyy-MM-dd hh:mm:ss"));
					CKEDITOR.instances.caseIntroEditor.setData('');
				}
				window.parent.vm.isEditted = false;
				//alert("操作成功");
				/*layer.msg('操作成功',{icon: 1,
	    			  time: 2000 //2秒关闭（如果不配置，默认是3秒）
  				});*/
			});
		},
		//重置查询条件（jqgrid setgridparam postdata 的多次查询条件累加）
		resetSearch: function() {
			$("#TimePicker").val("");
			
			vm.searchParams = {searchInfo:'',title:'',intro:'',createDeptName:"",deptId:""};
			//查询除原来的传递参数，并逐个清空 B
			var postData1 = $("#jqGrid").jqGrid("getGridParam", "postData");
			delete postData1["title"];
			delete postData1["intro"];
			delete postData1["intelligenceKind"];
			delete postData1["intelligenceType"];
			delete postData1["launchTimeB"];
			delete postData1["launchTimeE"];
			delete postData1["state"];
			delete postData1["language"];
			delete postData1["deptId"];
			delete postData1["searchInfo"];
			//查询除原来的传递参数，并逐个清空 E
			
			//传递新的查询参数
			$("#jq").jqGrid("setGridParam", { postData: postData1 });
		},
		query: function () {
			vm.reload(1);
			/*console.log("vm.searchType : " + vm.searchType);
			console.log("vm.searchParams.searchInfo : " + vm.searchParams.searchInfo);
			if(vm.searchType == 0 && vm.searchParams.searchInfo != ''){
				//高级查询
				vm.reloadFull();
			} else {
				vm.reload(1);
			}*/
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
				   //shade:false,
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
		//新增线索
		addClue: function(){
			vm.clearPage();
			operation="2";
			vm.changePage(1,0);
			vm.title = "新增线索";
			if(user.deptType == '0'){
				vm.showStare = true;
			}
			vm.showButtonSave = true;
			if(user.deptType == '1'){
				vm.showButtonUp = true;
			} else if(user.deptType == '0'){
				vm.showButtonDown = true;
			}
			vm.showButtonReset = true;
			
			//预制数据
			vm.intelligence = {
				createUserName: user.realname,
				createUserId: user.userId,
				createDeptName: user.deptName,
				deptId: user.deptId,
				//intelligenceKind: 2,	//情报类型（线索、案件）
				createType: 0,		//创建类型：（0：情报研判模块；1：历史数据模块）
				state: 0,			//状态（0：存草稿；1：办理中（流转）；2：已办结；3：已退回；4：已删除）
				
				title: '',
				intelligenceType: '',
				place: '',
				language: '',
				receiveUserIds: [],
				intro: '',
			};
			$("#launchTimePicker").val((new Date()).Format("yyyy-MM-dd hh:mm:ss"));
			
			$("#clueFileTable").bootstrapTable('showColumn', 'checkBox');
			$("#personTable").bootstrapTable('showColumn', 'checkBox');
			//$("#relatedIntelligenceTable").bootstrapTable('showColumn', 'checkBox');
			
			$("#cluePage select").bind("change",function(e){
				if(e.target.value != ""){
					window.parent.vm.isEditted = true;
				}
    			
    		});
		},
		addCase: function(){
			vm.clearPage();
			vm.changePage(2,0);
			operation="2";
			vm.title = "新增案件";
			vm.showButtonReset = true;
			vm.showButtonSave = true;
			vm.showButtonSaveUp = true;
			//预制数据
			vm.intelligence = {
				createUserName: user.realname,
				createUserId: user.userId,
				createDeptName: user.deptName,
				deptId: user.deptId,
				intelligenceKind: 1,	//情报类型（线索、案件）
				createType: 0,		//创建类型：（0：情报研判模块；1：历史数据模块）
				state: 0,			//状态（0：存草稿；1：办理中（流转）；2：已办结；3：已退回；4：已删除）
				caseLogList: [],
				receiveUserNames: user.realname,	
				
				title: '',
				intelligenceType: '',
				receiveUserIds: [user.userId],		//侦办人	默认当前登录用户
				handleNum: 0,
				intro: '',
			};
			
			//提案时间
			$("#proposalTimePicker").val((new Date()).Format("yyyy-MM-dd hh:mm:ss"));
			
			$("#caseLogTable").bootstrapTable('showColumn', 'checkBox');
			$("#caseFileTable").bootstrapTable('showColumn', 'checkBox');
			
			$("#casePage select").bind("change",function(e){
				if(e.target.value != ""){
					window.parent.vm.isEditted = true;
				}
    			
    		});
		},
		update: function (event) {
			var intelligenceId = getSelectedRow();
			if(intelligenceId == null){
				return ;
			}
		},
		//清理数据
		clearPage:function(){
			vm.intelligence = {};
			vm.person = {};
			vm.stare = {};
			vm.transferEntity = {};
			vm.autoList ={};			//自动关联情报
			vm.inputDisabled = false;
			
			$("#clueFileTable").bootstrapTable('removeAll');
			$("#caseFileTable").bootstrapTable('removeAll');
			$("#caseLogTable").bootstrapTable('removeAll');
			$("#personTable").bootstrapTable('removeAll');
			$("#stareTable").bootstrapTable('removeAll');
			$("#checkTable").bootstrapTable('removeAll');
			//$("#relatedIntelligenceTable").bootstrapTable('removeAll');
			//$("#autoIntelligenceTable").bootstrapTable('removeAll');
			$("#transferTable").bootstrapTable('removeAll');
			
			$('#cluePage input,#cluePage select,#cluePage textarea').removeAttr("disabled");
			$('#cluePage a[type="button"]').show();
			$('#casePage input,#casePage select,#casePage textarea').removeAttr("disabled");
			$('#casePage a[type="button"]').show();
			
			$('.intelligenceKind').attr("disabled","disabled");
			$(".disabledAll").attr("disabled","disabled");
			
			vm.showButtonSave = false,		//存草稿
			vm.showButtonSaveUp = false,	//保存
			vm.showButtonUp = false,		//上报
			vm.showButtonDown = false,		//下发
			vm.showButtonTransfer = false,	//研判
			vm.showButtonCheck = false,		//盯办
			vm.showButtonStare = false,		//盯办
			vm.showButtonExport = false,	//导出
			vm.showButtonReset = false,		//重置
			vm.showButtonAdminSave = false,	//管理员保存按钮
			
			vm.launchTime = '',			//发起时间
			//涉案人员
			vm.showStare = false,		//盯办人
			vm.showStareTable = false,	//盯办列表
			vm.showTransferTable = false,	//流转列表
			vm.showTransferType = 0,		//弹出框 默认进行流转操作；	0：流转；1 = 确认办结
			
			vm.showCluePanel = true;
			vm.titleSecond = null;
			
			vm.showRightPanel = false;
			vm.titleMain = '';
		},
		
		saveOrUpdate: function (state) {
			if(vm.isButtonDisable){
				return;
			}
			vm.isButtonDisable  = true;
			//新增 线索	(0：线索；1：案件；2：舆情；3：情报；4：国长)
			if(vm.intelligence.intelligenceKind != '1'){
				vm.intelligence.intro = CKEDITOR.instances.clueIntroEditor.getData();
				if (vm.intelligence.title.trim() == '') {
					alert("请填写标题");
					vm.isButtonDisable  = false;
					return;
				}
				if (!vm.intelligence.intelligenceKind) {
					alert("请选择情报类型");
					vm.isButtonDisable  = false;
					return;
				}
				if (!vm.intelligence.intelligenceType) {
					alert("请选择情报种类");
					vm.isButtonDisable  = false;
					return;
				}
				if (!vm.intelligence.place) {
					alert("请选择发生地");
					vm.isButtonDisable  = false;
					return;
				}
				if (!vm.intelligence.language) {
					alert("请选择语种");
					vm.isButtonDisable  = false;
					return;
				}
		    	if (vm.intelligence.receiveUserIds.length == 0) {
					alert("请选择接收人");
					vm.isButtonDisable  = false;
					return;
				}
				if (vm.intelligence.intro.trim() == '') {
					alert("请填写内容");
					vm.isButtonDisable  = false;
					return;
				}
				//获取涉案人员数据
				var personList = $("#personTable").bootstrapTable('getData');
				//console.log("personList 2: " + JSON.stringify(personList));
				for (var index in personList) {
	    			if(personList[index].personId.toString().startsWith('T')){
	    				personList[index].personId = null;
	    			}
				}
				//【表格数据】涉案人员
				vm.intelligence.personList = personList;
				//【表格数据】关联情报
				/*var relationList = $("#relatedIntelligenceTable").bootstrapTable('getData');
				for(var index in relationList){
					relationList[index].type = 0;
					relationList[index].intelligenceId2 = relationList[index].intelligenceId;
					//删除多余属性
					delete  relationList[index].intelligenceId;
					delete  relationList[index].title;
					delete  relationList[index].intro;
					delete  relationList[index].operate;
				}
				vm.intelligence.relationList = relationList;
				*/
				//【表格数据】附件
				vm.intelligence.fileList = $("#clueFileTable").bootstrapTable('getData');
				//发起时间
				vm.intelligence.launchTime = $("#launchTimePicker").val();
			}
			//新增 案件
			else {
				vm.intelligence.intro = CKEDITOR.instances.caseIntroEditor.getData();
				if(vm.intelligence.title.trim() == ''){
		    		alert("请填写案件名称");
		    		vm.isButtonDisable  = false;
		    		return;
		    	}
		    	if(!vm.intelligence.intelligenceType){
		    		alert("请选择情报种类");
		    		vm.isButtonDisable  = false;
		    		return;
		    	}
		    	if(vm.intelligence.receiveUserIds.length == 0){
		    		alert("请选择侦办人");
		    		vm.isButtonDisable  = false;
		    		return;
		    	}

		    	if(!isPositiveInteger(vm.intelligence.handleNum)) {
		    		alert("处理数据必须为正整数");
		    		vm.isButtonDisable  = false;
		    		return;
		    	}
		    	if(vm.intelligence.handleNum.length>8){
		    		alert("处理数据长度不能超过8位");
		    		vm.isButtonDisable  = false;
		    		return;
		    	}
		    	if(vm.intelligence.intro.trim() == ''){
		    		alert("请填写简要案情");
		    		vm.isButtonDisable  = false;
		    		return;
		    	}
				//案件日志
				var caseLogList = $("#caseLogTable").bootstrapTable('getData');
				var caseLogListUpdate = [];
				for (var index in caseLogList) {
					//新增
	    			if(caseLogList[index].logId.toString().startsWith('T')){
    				//if(typeof(caseLogList[index].logId) != 'number'){
	    				caseLogList[index].logId = null;
	    				caseLogListUpdate.push(caseLogList[index]);
	    			} 
	    			//修改
	    			else if(caseLogList[index].hasOwnProperty("isUpdate")) {
	    				caseLogListUpdate.push(caseLogList[index]);
	    			}
				}
				//【表格数据】案件日志
				vm.intelligence.caseLogList = caseLogListUpdate;
				//【表格数据】附件
				vm.intelligence.fileList = $("#caseFileTable").bootstrapTable('getData');
				//提案时间
				vm.intelligence.launchTime = $("#proposalTimePicker").val();
			}
			var url = "qbfx/intelligence/saveOrUpdate";
			//console.log("vm.intelligence : " + JSON.stringify(vm.intelligence));
			//首次新增
			if(!vm.intelligence.hasOwnProperty("intelligenceId")){
				vm.intelligence.state = state;
			}
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json;charset=utf-8",
			    data: JSON.stringify(vm.intelligence),
			    success: function(r){
			    	if(r.code === 0){
			    		if(state == -1 || state == 0 || !vm.intelligence.hasOwnProperty("intelligenceId")){
			    			var alertText;
	    		        	if(state == 1){
	    		        		alertText = "线索下发成功！";
	    		        	} else if(state == 2){
	    		        		alertText = "线索上报成功！";
	    		        	} else if(state == 5){
	    		        		alertText = "案件提交成功！";
	    		        	} else {
	    		        		alertText = "操作成功！"
	    		        	}
			    			layer.alert(alertText, function(index){
								/*window.parent.vm.isEditted = false;
								vm.back();
								vm.changePage(0);
								vm.reload();
								layer.close(index);*/
			    				vm.switchPage();
							});
			    		} else {	//state 1:下发；2:上报;5:提交（案件）
			    			$.get(baseURL + "qbfx/intelligence/handle/"+vm.intelligence.intelligenceId+"/"+state, function(r){
			    		        if(r.code == 0) {
			    		        	var alertText;
			    		        	if(state == 1){
			    		        		alertText = "线索下发成功！";
			    		        	} else if(state == 2){
			    		        		alertText = "线索上报成功！";
			    		        	} else if(state == 5){
			    		        		alertText = "案件提交成功！"
			    		        	}
			    		        	layer.alert(alertText, function(index){
										window.parent.vm.isEditted = false;
										vm.back();
										vm.changePage(0);
										vm.reload();
										layer.close(index);
			    		        		vm.switchPage();
									});
			    		        	/*layer.msg(alertText,{
				  		    			  icon: 1,
				  		    			  time: 2000 //2秒关闭（如果不配置，默认是3秒）
				  		    			}, function(index){
				  		    				vm.switchPage();
				  		    			}
				  	    			);*/
			    		        } else {
			    		        	layer.alert(r.msg, function(index){
										window.parent.vm.isEditted = false;
										vm.back();
										vm.changePage(0);
										vm.reload();
										layer.close(index);
									});
			    		        }
			    		    });
			    		}
					}else{
						layer.alert(r.msg, function(index){
							window.parent.vm.isEditted = false;
							vm.back();
							vm.changePage(0);
							vm.reload();
							layer.close(index);
						});
					}
				}
			});
		},
		//流转
		transfer: function(){
			transfer(vm.intelligence.intelligenceId);
		},
		//确认办结
		finish: function(){
			finishedLayer(vm.intelligence.intelligenceId);
		},
		//盯办
		stareE: function(){
			stare(-1);
		},
		del: function (event) {
			var intelligenceIds = getSelectedRows();
			if(intelligenceIds == null){
				return ;
			}
			var deleteIdArray = (""+intelligenceIds).split(",");
			var resultStr = ""
			for(var i=0; i<deleteIdArray.length; i++){
				var rowData = $("#jqGrid").getRowData(deleteIdArray[i]);
				if(rowData["operation.allowDelete"] == "false"){
					resultStr += "【" + rowData.title + "】"
				}
			}
			if(resultStr != ""){
				alert("您对" + resultStr + "不具有删除权限，请重新选择");
				return;
			}
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "qbfx/intelligence/delete",
                    contentType: "application/json;charset=utf-8",
				    data: JSON.stringify(intelligenceIds),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
								vm.delReload(intelligenceIds, $("#jqGrid"));
							});
							/*layer.msg('操作成功',{
		  		    			  icon: 1,
		  		    			  time: 2000 //2秒关闭（如果不配置，默认是3秒）
		  		    			}, function(index){
		  		    				vm.switchPage();
		  		    			}
		  	    			);*/
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
		
		getInfo: function(intelligenceId){
			var intelligence = {};
			$.ajaxSettings.async = false;
			$.get(baseURL + "qbfx/intelligence/infoLess/"+intelligenceId, function(r){
				intelligence = r.intelligence;
            });
			$.ajaxSettings.async = true;
			return intelligence;
		},
		back: function(){
			if(window.parent.vm.isEditted) {
        		confirm('页面尚未保存，您确定要离开页面吗？', function(){
        			layer.closeAll();
        			window.parent.vm.isEditted = false;
        			vm.changePage(0);
        			//清空ckeditor数据
        			CKEDITOR.instances.clueIntroEditor.setData('');
        			CKEDITOR.instances.caseIntroEditor.setData('');
        			//隐藏 底部面板（研判、盯办）
        			$('.footerPanel').hide();
        			CKEDITOR.instances.clueIntroEditor.setReadOnly(false); 
        			CKEDITOR.instances.caseIntroEditor.setReadOnly(false); 
        		});
        	} else {
        		vm.changePage(0);
        		//清空ckeditor数据
    			CKEDITOR.instances.clueIntroEditor.setData('');
    			CKEDITOR.instances.caseIntroEditor.setData('');
    			CKEDITOR.instances.clueIntroEditor.setReadOnly(false); 
    			CKEDITOR.instances.caseIntroEditor.setReadOnly(false); 
    			$('.footerPanel').hide();
        	}
		},
		/*reloadFull: function(){
			console.log("http://192.168.103.99:12001/ES/esSearch");
			$("#jqGrid").jqGrid('setGridParam',{ 
				url:"http://192.168.103.99:12001/ES/esSearch",
				postData:vm.searchParams,
                page:1
            }).trigger("reloadGrid");
		},*/
		reload: function (pageNum) { 
			//createType 0：情报研判；1：历史数据
			vm.searchParams.createType = 0;
			vm.searchParams.searchType = vm.searchType;
			vm.changePage(0);
			var timePicker = $("#TimePicker").val().split(" - ");
			
			vm.searchParams.launchTimeB=timePicker[0];
			vm.searchParams.launchTimeE=timePicker[1];
			vm.searchParams.searchInfo=vm.searchParams.searchInfo.trim();
			vm.searchParams.title=vm.searchParams.title.trim();
			vm.searchParams.intro=vm.searchParams.intro.trim();
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
		
		/******************* 涉案人员相关 B *******************/
		//新增修改涉案人员	type 操作类型，0：新增；1：更新
		personPage: function(type) {
			$('#personLayer input,#personLayer select,#personLayer textarea').removeAttr("disabled");
			//主键为空，代表此次操作位新增操作
			if(type == 0){
				title = "新增涉案人员";
				vm.person = {
						personId: "T" + new Date().getTime(),
						numId: '',
						name: '',
						sex: ''
				};
			} else {
				title = "修改涉案人员";
				vm.person = JSON.parse(JSON.stringify($('#personTable').bootstrapTable('getRowByUniqueId', type)));
			}
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: title,
				area: ['700px', '340px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#personLayer"),
				btn: ['保存','取消'],
				btn1: function (index) {
					if(vm.person.numId != null && vm.person.numId.trim().length > 0){
						if(!checkId(vm.person.numId)){
			                return;
						} 
						//console.log("vm.person 1: " + JSON.stringify(vm.person));
						if(type == 0){
							var personList = $("#personTable").bootstrapTable('getData');
							for (var i in personList) {
				    			if(personList[i].numId.toString() == vm.person.numId){
			    					vm.person.personId = "T" + new Date().getTime();
				    				alert("身份证号已存在，请重新输入！");
				    				return;
				    			}
							}
						}
					}
					if(!vm.person.name || vm.person.name.trim() == ""){
						alert("请填写涉案人员姓名");
						return;
					}
					if(!vm.person.sex){
						alert("请选择性别");
						return;
					}
					layer.close(index);
					
					if(type == 0){
						$("#personTable").bootstrapTable('append', vm.person);
						if(!vm.person.personId.toString().startsWith('T')){
							//console.log("vm.person 2: " + JSON.stringify(vm.person));
							$.ajaxSettings.async = false;
							$.get(baseURL + "qbfx/intelligence/autoList/-1/"+vm.person.personId, function(r){			
				                vm.autoList = r.autoList;  
				                for(var i=0; i<vm.autoList.length; i++){
				                	vm.autoList[i].state=0;
									$("#autoIntelligenceTable").bootstrapTable('append', vm.autoList[i]);	
								}
				            });
							$.ajaxSettings.async = true;
						}
					} else {
						$("#personTable").bootstrapTable('updateByUniqueId', {id: vm.person.personId, row: vm.person});
					}
					
					vm.person = {};
	            },
	            btn2: function (index) {
	            }
			});
		},
		//查看涉案人员	
		viewCluePerson: function(personId) {
			vm.person = $('#personTable').bootstrapTable('getRowByUniqueId', personId);
			$('#personLayer input,#personLayer select,#personLayer textarea').attr("disabled","disabled");
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "查看涉案人员",
				area: ['700px', '340px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#personLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
				}
			});
		},
		//自动关联查询
		searchAutoIntelligence:function(){
			return;
			/*var allNumIds = $("#personTable").bootstrapTable('getData');
			$("#autoIntelligenceTable").bootstrapTable('removeAll');
			$.ajaxSettings.async = false;
			for(var j=0;j<allNumIds.length;j++){
				//if(!personList[index].personId.toString().startsWith('T')){
					$.get(baseURL + "qbfx/intelligence/autoList/-1/"+allNumIds[j].personId, function(r){			
		                vm.autoList = r.autoList;   
		                for(var i=0; i<vm.autoList.length; i++){
							vm.autoList[i].state=0;
							$("#autoIntelligenceTable").bootstrapTable('append', vm.autoList[i]);	
						}
		            });
				//}
			}
			$.ajaxSettings.async = true;*/
		},
		//删除涉案人员
		/*removePerson: function(personId){
			//var personId = $("#personTable").bootstrapTable('getSelections')[0].personId;
			confirm('确定要删除涉案人员？', function(){
				$("#personTable").bootstrapTable('removeByUniqueId', personId);
				vm.searchAutoIntelligence();
				alert("删除成功");
			});
			
			
		},
		//批量删除涉案人员
		removeBatchPerson: function(){			
			var selectPersons = $('#personTable').bootstrapTable('getSelections');
			if(selectPersons.length < 1){
				alert("请至少选择一条记录");
				return;
			}
			confirm('确定要删除选中的涉案人员？', function(){
				var personIds = [];
				for(var i=0; i<selectPersons.length; i++){
					personIds.push(selectPersons[i].personId);
				}
				$('#personTable').bootstrapTable('remove', {field: 'personId', values: personIds}); 
				vm.searchAutoIntelligence();
				alert("删除成功");
			});
			
		},*/
		/******************* 涉案人员相关 E *******************/
		
		/******************* 附件相关 B *******************/


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
				//shade:false,
				content: jQuery("#fileLayer"),
				btn: ['上传','取消'],
				btn1: function (index) {
					if(bool) {
						return;
					}
					bool = true;
					var files = vm.$refs.casefile.files;
					if(files.length < 1){
						alert("请选择上传的文件");
						bool = false;
						return;
					}
					var date = new Date();
					
					var formData = new FormData();  
					formData.append('files', files[0]);
					ajax = $.ajax({
						url: baseURL + 'qbfx/file/uploadFile',
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
			            		if(vm.showPage == 1){	//线索
			            			$('#clueFileTable').bootstrapTable('append', data.file);
			            			
			            		} else {
			            			$('#caseFileTable').bootstrapTable('append', data.file);
			            		}
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
	            	$("#caseFileUploadInput").val("");
	            	$("#progress").val("");
	            }
			});
		},
		
		checkClueFileUploadById : function(fileId){
			if(!fileId || fileId == ""){
				return;
			}
			if(vm.showPage == 1)
				  var selectFile = $('#clueFileTable').bootstrapTable('getRowByUniqueId', fileId);
				else
				  var selectFile = $('#caseFileTable').bootstrapTable('getRowByUniqueId', fileId);
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
//				window.location = baseURL + selectFile.path;
				
				/*var form = $("<form method='get'></form>");
				form.attr("action",baseURL + selectFile.path);
	            $(document.body).append(form);
	            form.submit();*/
				
				download(projectName+"/" + selectFile.path,null,null);
			}
		},
		
		delFile: function(fileId){
			confirm('确定要删除这条记录？', function(){
				if(vm.showPage == 1){	//线索
					//fileId = $("#clueFileTable").bootstrapTable('getSelections')[0].fileId;
					$("#clueFileTable").bootstrapTable('removeByUniqueId', fileId);
				} else {	//案件
					//fileId = $("#caseFileTable").bootstrapTable('getSelections')[0].fileId;
					$("#caseFileTable").bootstrapTable('removeByUniqueId', fileId);
				}
				if(vm.intelligence.deleteFileIds == null){
					vm.intelligence.deleteFileIds = [];
				}
				vm.intelligence.deleteFileIds.push(fileId);
				alert("删除成功！");
			});
		},
		delBatchFile: function(){
			if(vm.intelligence.deleteFileIds == null){
				vm.intelligence.deleteFileIds = [];
			}
			 var selectPersons=[];
			if(vm.showPage == 1)
			     selectPersons = $('#clueFileTable').bootstrapTable('getSelections');
			else
			     selectPersons = $('#caseFileTable').bootstrapTable('getSelections');
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
					$('#clueFileTable').bootstrapTable('remove', {field: 'fileId', values: fileIds});
					vm.intelligence.deleteFileIds=fileIds;
				} else {	//案件
					var fileIds = [];
					for(var i=0; i<selectPersons.length; i++){
						fileIds.push(selectPersons[i].fileId);
					}
					$('#caseFileTable').bootstrapTable('remove', {field: 'fileId', values: fileIds});
					vm.intelligence.deleteFileIds=fileIds;
				}
				//vm.intelligence.deleteFileIds.push(fileId);
				alert("删除成功！");
			});
		},
		/******************* 附件相关 E *******************/
		
		/******************* 手动关联情报相关 B *******************/
		addRelationPage: function(){
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "关联情报",
				area: ['740px', '450px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#relationLayer"),
				btn: ['保存','取消'],
				btn1: function (index) {
					console.log(11111);
					var selectedIds=$('#jqGridRelatedIntellegence').jqGrid('getGridParam','selarrrow');
					if(selectedIds.length < 1){
						alert("请选择关联情报");
						return;
					}
					for(var i=0; i<selectedIds.length; i++){
						var rowData = $("#jqGridRelatedIntellegence").jqGrid('getRowData',selectedIds[i]);
						//插入 手动关联情报表， 排重
						if($('#relatedIntelligenceTable').bootstrapTable('getRowByUniqueId', rowData.intelligenceId) == null){
							$('#relatedIntelligenceTable').bootstrapTable('append', rowData);
						}else {
							//TODO 弹出提示信息？ 
						}
					}
					layer.close(index);
				}
			});
			
			//获取已经选择的 编号列表，下次查询不再显示
			var relatedIntelligenceList = $("#relatedIntelligenceTable").bootstrapTable('getData');
			var selectedIds = [];
			if(relatedIntelligenceList.length > 0){
				for(var i in relatedIntelligenceList){
					selectedIds.push(parseInt(relatedIntelligenceList[i].intelligenceId));
				}	
			}
			/********************** 再次加载 B **********************/
			if($("#jqGridRelatedIntellegence").jqGrid('getDataIDs').length > 0){
				$("#jqGridRelatedIntellegence").setGridWidth(712);
				//查询除原来的传递参数，并逐个清空 B
				vm.relationSearchParams = {};
				//查询除原来的传递参数，并逐个清空 B
				var postData2 = $("#jqGridRelatedIntellegence").jqGrid("getGridParam", "postData");
				delete postData2["title"];
				delete postData2["intro"];
				delete postData2["selectedIds"];
				//查询除原来的传递参数，并逐个清空 E
	          
				//已选择的id列表
				if(selectedIds.length > 0){
					vm.relationSearchParams.selectedIds = JSON.stringify(selectedIds).replace('[','(').replace(']',')');
				}
				postData2 = vm.relationSearchParams;
				$("#jqGridRelatedIntellegence").jqGrid('setGridParam',{ 
					postData: postData2,
					//每次从 第一页开始查看
	                page: 1
	            }).trigger("reloadGrid");
				return;
			}
			/********************** 再次加载 E **********************/
			
			$("#jqGridRelatedIntellegence").jqGrid({
				url: baseURL + 'qbfx/intelligence/list',
				datatype: "json",
				colModel: [
					{ label: '序号', name: 'intelligenceId', index: 'intelligence_id', hidden:true, key: true },
					{ label: '标题', sortable: false, name: 'title', index: 'title', width: 380 }, 			
					{ label: '内容', sortable: false, name: 'intro', index: 'intro', hidden:true,width: 400 }, 
					{ label: '情报种类',align: 'center', name: 'intelligenceType', index: 'intelligence_type', width: 120 , formatter: function(value, options, row){
						 for(var i=0; i<vm.typeDictList.length; i++){
		    					if(vm.typeDictList[i].code == value){
		    						return vm.typeDictList[i].value;
		    					}
		    				}
			        	   return "";
						}}, 
					{ label: '情报类型',align: 'center', name: 'intelligenceKind', index: 'intelligence_kind', width: 120 , formatter: function(value, options, row){
						  for(var i=0; i<vm.kindDictList.length; i++){
		    					if(vm.kindDictList[i].code == value){
		    						return vm.kindDictList[i].value;
		    					}
		    				}
			        	   return "";
						}}, 
					{ label: '操作', name: 'operate', align: 'center',  sortable: false, width: 60,formatter: function(value, grid, row, state){
							return '<a onclick="vm.viewDetail2('+row.intelligenceId+')" style="cursor: pointer" title="查看"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>'

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
				width:'100%',
				multiselect: true,
				pager: "#jqGridPagerRelatedIntellegence",
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
	        	   $("#jqGridRelatedIntellegence").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "auto" }); 
	        	 
	           },
	           postData:{
	           	searchType:'3',
	           	createType: '0',
	           	//当前页面的id（针对修改页面使用）
	           	currendtId: vm.intelligence.intelligenceId,
	           }
			});
		},
		//删除手动关联情报
		removeRelation: function(intelligenceId){
			//var intelligenceId = $("#relatedIntelligenceTable").bootstrapTable('getSelections')[0].intelligenceId;
			confirm('确定要删除关联情报？', function(){
			$("#relatedIntelligenceTable").bootstrapTable('removeByUniqueId', intelligenceId);
			alert("删除成功");
			});
		},
		//批量删除手动关联情报
		removeBatchRelation:function(){
			var selects = $('#relatedIntelligenceTable').bootstrapTable('getSelections');
			if(selects.length < 1){
				alert("请至少选择一条记录");
				return;
			}
			confirm('确定要删除选中的关联情报？', function(){
				var intelligenceIds = [];
				for(var i=0; i<selects.length; i++){
					intelligenceIds.push(selects[i].intelligenceId);
				}
				$('#relatedIntelligenceTable').bootstrapTable('remove', {field: 'intelligenceId', values: intelligenceIds}); 		
				alert("删除成功");
			});
		},
		queryRelatedIntellegence: function(){
			var page = $("#jqGridRelatedIntellegence").jqGrid('getGridParam','page');
			$("#jqGridRelatedIntellegence").jqGrid('setGridParam',{ 
				postData:vm.relationSearchParams,
                page:page
            }).trigger("reloadGrid");
		},
		viewDetail: function(intelligenceId){
			var selected = $('#relatedIntelligenceTable').bootstrapTable('getRowByUniqueId', intelligenceId);
			$("#intelligenceDetailTitle").val(selected.title);
			$("#intelligenceDetailIntro").val(selected.intro);
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "情报详情",
				area: ['700px', '400px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#intelligenceDetailLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
				}
			});
		},
       viewDetail2: function(intelligenceId2){
    	   if(!intelligenceId2 || intelligenceId2 == ""){
				return;
			}
			$.get(baseURL + "qbfx/intelligence/infoLess/"+intelligenceId2, function(r){
				var intelligenceDetail = r.intelligence;
				$("#intelligenceDetailTitle").val(intelligenceDetail.title);
				$("#intelligenceDetailIntro").val(intelligenceDetail.intro);
			});
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "情报详情",
				area: ['700px', '400px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#intelligenceDetailLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
				}
			});
		},
		/******************* 手动关联情报相关 E *******************/
		/******************* 案件日志 B *******************/
		addCaseLog: function(){
			//预制数据
			vm.caseLog = {};
			//需要更新数据库
			vm.caseLog = {createTime: (new Date()).Format("yyyy-MM-dd hh:mm:ss"), isUpdate: true};
			$('#caseLogLayer input').attr("disabled","disabled");
			$('#caseLogLayer textarea').removeAttr("disabled");
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "案件日志新增",
				area: ['700px', '330px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#caseLogLayer"),
				btn: ['确认','取消'],
				btn1: function (index) {
					if(!vm.caseLog.hasOwnProperty("intro") || vm.caseLog.intro == ''){
						alert("请填写内容");
						return;
					}
					layer.close(index);
					vm.caseLog.logId = "T" + new Date().getTime();
					
					$("#caseLogTable").bootstrapTable('append', vm.caseLog);
					vm.caseLog = {};
				},
				btn2: function (index) {
					//清空数据
					vm.caseLog = {};
				}
			});
		},
		editCaseLog: function(logId){
			vm.caseLog = JSON.parse(JSON.stringify($("#caseLogTable").bootstrapTable('getRowByUniqueId', logId)));
			//需要更新数据库
			vm.caseLog.isUpdate = true;
			$('#caseLogLayer textarea').removeAttr("disabled");
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "案件日志修改",
				area: ['780px', '330px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#caseLogLayer"),
				btn: ['确认','取消'],
				btn1: function (index) {
					layer.close(index);
					$("#caseLogTable").bootstrapTable('updateByUniqueId', {id: vm.caseLog.logId, row: vm.caseLog});
					vm.caseLog = {};
				},
				btn2: function (index) {
					//清空数据
					vm.caseLog = {};
				}
			});
		},
		TimeClose:function(){
			//$('#TimePicker').datetimepicker('hide');
		},
		
		delCaseLog: function(logId){
			confirm('确定要删除该记录？', function(){
				//var logId = $("#caseLogTable").bootstrapTable('getSelections')[0].logId;
				$("#caseLogTable").bootstrapTable('removeByUniqueId', logId);
				//数据库已有数据，删除需要插入到 deleteCaseLogIds 属性中
				if(!logId.toString().startsWith('T')){
					vm.intelligence.deleteCaseLogIds.push(logId);			
				}
				alert("删除成功！");
			});
		},
		delBatchCaseLog:function(){
			var selects = $('#caseLogTable').bootstrapTable('getSelections');
			if(selects.length < 1){
				alert("请至少选择一条记录");
				return;
			}
			confirm('确定要删除选中的案件日志？', function(){
				var logIds = [];
				for(var i=0; i<selects.length; i++){
					logIds.push(selects[i].logId);
					if(!selects[i].logId.toString().startsWith('T'))
					  vm.intelligence.deleteCaseLogIds.push(selects[i].logId);
				}		
				$('#caseLogTable').bootstrapTable('remove', {field: 'logId', values: logIds}); 			
				alert("删除成功");
			});
		},
		viewCaseLogDetail: function(logId){
			vm.caseLog = $("#caseLogTable").bootstrapTable('getRowByUniqueId', logId);
			$('#caseLogLayer input,#caseLogLayer textarea').attr("disabled","disabled");
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "案件日志查看",
				area: ['780px', '330px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#caseLogLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
					//清空数据
					vm.caseLog = {};
				}
			});
		},
		/******************* 案件日志 E *******************/
		/******************* 盯办列表 B *******************/
		viewStareDetail: function(stareId){
			vm.stare = $("#stareTable").bootstrapTable('getRowByUniqueId', stareId);
			$('#stareLayer input,#stareLayer textarea').attr("disabled","disabled");
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "盯办信息查看",
				area: ['580px', '340px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#stareLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
				}
			});
		},
		editStareDetail:function(stareId){
			vm.stare = JSON.parse(JSON.stringify($("#stareTable").bootstrapTable('getRowByUniqueId', stareId)));
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "盯办信息修改",
				area: ['580px', '370px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#stareLayer"),
				btn: ['确认','取消'],
				btn1: function (index) {
					layer.close(index);
					$("#stareTable").bootstrapTable('updateByUniqueId', {id: vm.stare.stareId, row: vm.stare});
					vm.stare = {};
				}
			});	
		},
		delStare:function(stareId){
			
		},
		/******************* 盯办列表 E *******************/
		/******************* 审核列表、流转列表 B *******************/
		viewTransferDetail: function(transferId){
			$("#handlerLabel1,#handlerLabel2").hide();
			transferFlag = 1;
			var tableEntity = $("#transferTable").bootstrapTable('getRowByUniqueId', transferId);
			vm.transferEntity = tableEntity;
			if(tableEntity.intelligenceUserList.length == 0){
				tableEntity.result = vm.intelligence.result;
				vm.showTransferType = '1';
				$("#handlerLabel2").show();
			} else {
				vm.showTransferType = '0';
				$("#handlerLabel1").show();
			}
			
			$("#transferUserNames-view").val(tableEntity.transferUserNames);
			$('#transferLayer input,#transferLayer select,#transferLayer textarea').attr("disabled","disabled");
			$("#transferUserNames-view").removeAttr("disabled");
			
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "审核信息查看",
				area: ['750px', '460px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#transferLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
				}
			});
		},
		/******************* 审核列表、流转列表 E *******************/
		
		/******************* 核查列表 B *******************/
		viewCheckDetail: function(checkId){
			vm.check = $("#checkTable").bootstrapTable('getRowByUniqueId', checkId);
			$('#checkLayer input,#checkLayer textarea').attr("disabled","disabled");
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "二次核查信息查看",
				area: ['580px', '340px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#checkLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
				}
			});
		},
		/******************* 核查列表 E *******************/
		
		/******************* 表格列格式化 E *******************/
		//性别
		sexFormatter: function(code) {
			if(code && code != ""){
				return vm.sexList[code].value;
			}
			return "";
		},
		/******************* 表格列格式化 E *******************/
		
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
		/*人员树
		 * viewOrEdit 0:view ; 1:edit (二期新增参数)
		 */
		showUserTree: function(flag, viewOrEdit){
			vm.isShowUserTreeDisable = true;
			var retUsers;
			if(flag == '1' || flag == '2' || flag == '4'){
//				type = '-1';
				retUsers = vm.selectUsers;
			} else if (flag == '3'){
//				type = '0';
				retUsers = vm.selectUsers2;
			}
//			$.get(baseURL + "qbfx/common/deptTree/" + type, function(r){
			
			
		    	var title = "";
		    	//1:接收人;4:侦办人
		    	if(flag == '1' || flag == '4'){
		    		if(operation == "0"){
		    			if(flag == '1'){
		    				title = '接收人';
		    			} else if(flag == '4'){
		    				title = '侦办人';
		    			}
		    			if(vm.intelligence.hasOwnProperty('receiveUserIds') && vm.intelligence.receiveUserIds.length>0){
		    				var deptUsers = vm.getDeptAndUserTreeByUserId(retUsers, vm.intelligence.receiveUserIds);
		    				Setting.check.enable = false;
							ztree = $.fn.zTree.init($("#userTree"), Setting, deptUsers);
//							ztree.expandAll(true);
		    			}else{
		    				return;
		    			}
					}else{
						if(flag == '1'){
							title = '选择接收人';
						} else if(flag == '4'){
							title = '选择侦办人';
						}
						Setting.check.enable = true;
						ztree = $.fn.zTree.init($("#userTree"), Setting, retUsers);
				    	ztree.checkAllNodes(false);//全部不选中
				    	if(vm.intelligence.hasOwnProperty('receiveUserIds') && vm.intelligence.receiveUserIds.length>0){
		    				for(var i=0; i<vm.intelligence.receiveUserIds.length; i++){
	    						var node = ztree.getNodeByParam("deptId", vm.intelligence.receiveUserIds[i]);
	    						ztree.checkNode(node,true);
							}
//						   ztree.expandAll(true);
			    		}
					}
		    		ztree.expandAll(true);
		    		vm.popUserTree(flag,title);
				}
		    	//流转人
		    	else if(flag == '2'){
		    		//if(transferFlag == 1){
	    			if(viewOrEdit == 0){
		    			title = '流转人/反馈人';
		    			if(vm.transferEntity.intelligenceUserIds.length>0){
		    				var deptUsers = vm.getDeptAndUserTreeByUserId(retUsers, vm.transferEntity.intelligenceUserIds);
		    				Setting.check.enable = false;
		    				ztree = $.fn.zTree.init($("#userTree"), Setting, deptUsers);
//							ztree.expandAll(true);
		    			}else{
		    				return;
		    			}
		    		}else{
		    			title = '选择流转人/反馈人';
		    			Setting.check.enable = true;
		    			ztree = $.fn.zTree.init($("#userTree"), Setting, retUsers);
		    			ztree.checkAllNodes(false);//全部不选中
		    			if(vm.transferEntityIn.intelligenceUserIds.length>0){
		    				for(var i=0; i<vm.transferEntityIn.intelligenceUserIds.length; i++){
	    						var node = ztree.getNodeByParam("deptId", vm.transferEntityIn.intelligenceUserIds[i]);
	    						ztree.checkNode(node,true);
							}
//						   ztree.expandAll(true);
			    		}
		    		}
	    			ztree.expandAll(true);
		    		vm.popUserTree(flag,title,viewOrEdit);
				} 
		    	//盯办人
		    	else if(flag == '3'){
		    		if(operation == "0"){
		    			title = '盯办人';
		    			if(vm.intelligence.hasOwnProperty('stareUserIds') && vm.intelligence.stareUserIds != undefined && vm.intelligence.stareUserIds.length > 0){
		    				var deptUsers = vm.getDeptAndUserTreeByUserId(retUsers, vm.intelligence.stareUserIds);
		    				Setting.check.enable = false;
		    				ztree = $.fn.zTree.init($("#userTree"), Setting, deptUsers);
//							ztree.expandAll(true);
		    			}else{
		    				return;
		    			}
		    		}else{
		    			title = '选择盯办人';
		    			Setting.check.enable = true;
		    			ztree = $.fn.zTree.init($("#userTree"), Setting, retUsers);
		    			ztree.checkAllNodes(false);//全部不选中
		    			if(vm.intelligence.hasOwnProperty('stareUserIds') && vm.intelligence.stareUserIds != undefined && vm.intelligence.stareUserIds.length > 0){
		    				for(var i=0; i<vm.intelligence.stareUserIds.length; i++){
	    						var node = ztree.getNodeByParam("deptId", vm.intelligence.stareUserIds[i]);
	    						ztree.checkNode(node,true);
							}
//						   ztree.expandAll(true);
			    		}
		    		}
		    		ztree.expandAll(true);
		    		vm.popUserTree(flag,title);
				}
		    	/*if(true){
		    		var nodes = ztree.getNodes();
		    		//ztree.setChkDisabled(ztree.getNodes());
		    		for(var i in nodes){
		    			console.log("nodes : " + JSON.stringify(nodes[i]));
		    			ztree.setChkDisabled(nodes[i],true);
		    		}
		    	}*/
		    	
		    	vm.isShowUserTreeDisable = false;
//		    });
		},
		/**
		 * viewOrEdit 0:view ; 1:edit (二期新增参数)
		 */
		popUserTree:function(flag,title,viewOrEdit){
			if(operation != "0"||vm.optType == "query" || viewOrEdit == '1') {
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
		        		if(flag == '1' || flag == '4') {
		        			window.parent.vm.isEditted = true;
		        			vm.intelligence.receiveUserIds = [];
		        			for(var i=0; i<nodes.length; i++){
		        				if(nodes[i].deptId.substring(0,1) == "D"){
             					   continue;
             				   }
		        				vm.intelligence.receiveUserIds.push(nodes[i].deptId);
			    				nodeNames += nodes[i].name + ";";
			    			}
		        		} else if (flag == '3') {
		        			window.parent.vm.isEditted = true;
		        			vm.intelligence.stareUserIds = [];
		        			for(var i=0; i<nodes.length; i++){
		        				if(nodes[i].deptId.substring(0,1) == "D"){
             					   continue;
             				   }
		        				vm.intelligence.stareUserIds.push(nodes[i].deptId);
			    				nodeNames += nodes[i].name + ";";
			    			}
			        	} else if(flag == '2') {
			        		vm.transferEntityIn.intelligenceUserIds = [];
		        			for(var i=0; i<nodes.length; i++){
		        				if(nodes[i].deptId.substring(0,1) == "D"){
             					   continue;
             				   }
		        				vm.transferEntityIn.intelligenceUserIds.push(nodes[i].deptId);
			    				nodeNames += nodes[i].name + ";";
			    			}
		    			}
			    		//页面赋值
			    		if(flag == '1' || flag == '4'){
			    			vm.intelligence.receiveUserNames = nodeNames;
			    			$("#receiveUserNames").val(nodeNames);	//接收人
			    			$("#investigatorsNames").val(nodeNames);	//侦办人
			    		} else if(flag == '2'){	//流转人
			    			$("#transferUserNames").val(nodeNames);
			    		} else if(flag == '3'){
			    			vm.intelligence.stareUserNames = nodeNames;
			    			$("#stareUserNames").val(nodeNames);	//盯办人
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
		/************* 加载人员树 E *************/
		
		dateDefind: function () {
		    var d, s;
		    var self = this;
		    d = new Date();
		    s = d.getFullYear() + "-";       // 取年份
		    s = s + (d.getMonth() + 1) + "-";// 取月份
		    s += d.getDate() + " ";     // 取日期
//		    $("#proposalTimePicker").val(s);
		    
		    laydate.render({
		    	elem: '#proposalTimePicker' ,
		    	type: 'datetime',
		    	format: 'yyyy-MM-dd HH:mm:ss',
		    	trigger: 'click'
		    });

			
		    laydate.render({
	            elem: '#TimePicker',
	            range: true,
	            trigger: 'click'
            });
//		    //高级查询开始时间
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
		    

	   },
	   
	   /**
	    * 内容自动识别
	    */
	   introHandler: function(){
		   vm.disableIntroHandler = true;
		   /* for (var index in personList) {
			   console.log("personList["++"] : " + JSON.stringify(personList[index]));
			   if(personList[index].personId.toString().startsWith('T')){
				   $("#personTable").bootstrapTable('removeByUniqueId',personList[index].personId);
			   }
		   }*/
		   /*for(var j = 0,len = personList.length; j < len; j++){
		   }*/
		   /*personList.forEach(function(person,i){
			   if(person.personId.toString().startsWith('T')){
				   personIds.push(person.personId);
			   }
		   });*/
		   //var textInfo =  CKEDITOR.instances.clueIntroEditor.document.getBody().getText();
		   //var textInfo =  CKEDITOR.instances.clueIntroEditor.getData().replace(/&middot;/ig, '.');
		   var textInfo =  CKEDITOR.instances.clueIntroEditor.getData();
		   //2、内容自动识别
		   $.ajax({
				type: "POST",
			    url: "http://"+ window.parent.vm.variableHighLightHost +"/ES/highLight",
		        contentType: "application/x-www-form-urlencoded;charset=utf-8",
		        //msg = msg.replace(/&npsp;/ig, ''); //去掉npsp
			    //data: { text: CKEDITOR.instances.clueIntroEditor.getData().replace(/<\/?[^>]*>/g, '')},
			    //data: { text: CKEDITOR.instances.clueIntroEditor.getData().replace(/&middot;/ig, '.')},
			    //data: { text: CKEDITOR.instances.clueIntroEditor.document.getBody().getText()},
		        data: { text: textInfo},
		        dataType : "text",
			    success: function(r){
			    	CKEDITOR.instances.clueIntroEditor.setData(r);
			    	//涉案人员填充
			    	vm.personFill(textInfo);
				},
			    error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);		// 状态码
                    console.log(XMLHttpRequest.readyState);	// 状态
                    console.log(textStatus);				// 错误信息   
                },
				complete: function(XMLHttpRequest, textStatus) {
					vm.disableIntroHandler = false;
				}
			});
		   
		   //串并分析查询
		   if(textInfo != ''){
			   vm.pageNum = 1;
			   vm.personAnalysis(1,1);
		   }
	   },

	   /**
	    * 用户自动填充
	    * @returns
	    */
	   personFill: function(textInfo){
	    	 //3、人员自动填充
		   $.ajax({
				type: "POST",
			    url: "http://"+ window.parent.vm.variableHighLightHost +"/ES/infoExtr",
		        contentType: "application/x-www-form-urlencoded;charset=utf-8",
		        //data: { text: CKEDITOR.instances.clueIntroEditor.getData().replace(/&middot;/ig, '.')},
			    //data: { text: CKEDITOR.instances.clueIntroEditor.document.getBody().getText()},
		        data: { text: textInfo},
				dataType : "json",
			    success: function(r){
			    	//console.log("r.personList : " + JSON.stringify(r.personList));
			    	//1、删除 上一次自动识别填充的 涉案人员
			    	var personList = $("#personTable").bootstrapTable('getData');
			    	var personListDB = [];
			    	for (var index in personList) {
			    		if(personList[index].personId.toString().startsWith('T') == false){
			    			personListDB.push(personList[index]);
			    		}
			    	}
			    	//涉及 JS深拷贝问题，此处使用 JSON 串转换
			    	var personListDBStr = JSON.stringify(personListDB);
			    	$('#personTable').bootstrapTable('removeAll');
			    	personListDB = JSON.parse(personListDBStr);
			    	$('#personTable').bootstrapTable('append', personListDB);
			    	//识别的涉案人员列表 不为空
			    	if(r.personList.length > 0){
			    		var queryNumFlag = true;
			    		//为自动填充的涉案人员填充id
			    		for (var index in r.personList) {
			    			//涉案人员id 默认以T开头
			    			r.personList[index].personId = "T" + index;
			    			if(r.personList[index].numId != ""){
				    			//查看是否已经加载到 bootstrapTable中
			    				queryNumFlag = true;
			    				for(var j in personListDB){
			    					if(personListDB[j].numId == r.personList[index].numId){
			    						queryNumFlag = false;
			    						break;
			    					}
			    				}
			    				//未加载到 bootstrapTable中，查询数据库
			    				if(queryNumFlag == true){
			    					vm.getPersonByNumId(r.personList[index]);
			    				}
				    		} else {
		    					$("#personTable").bootstrapTable('append', r.personList[index]);
		    				}
				    	}
			    	}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
                   console.log(XMLHttpRequest.status);		// 状态码
                   console.log(XMLHttpRequest.readyState);	// 状态
                   console.log(textStatus);				// 错误信息   
				},
				complete: function(XMLHttpRequest, textStatus) {
					vm.disableIntroHandler = false;
				}
			});
	   },
	   nextPage:function(){
		   if(vm.pageNum == vm.totalPage){
			   alert("已经是最后一页");
			   return;
		   }
		   vm.pageNum = vm.pageNum + 1;
		   vm.personAnalysis(vm.analysisType,vm.pageNum);
	   },
	   prePage:function(){
		   if(vm.pageNum == 1){
			   alert("已经是第一页");
			   return;
		   }
		   vm.pageNum = vm.pageNum - 1;
		   vm.personAnalysis(vm.analysisType,vm.pageNum);
	   },
	   /**
	    * 串并分析 flag标识自动识别查询还是右侧面板查询，0：右侧面板查询按钮查询，1：自动识别同步查询；page：页码数
	    */
	   personAnalysis: function(flag,page){
		   vm.rightSearchType = 0;
		   vm.analysisType = flag;
		   vm.rightSearchList = {};
		   vm.rightSearchResult = null;
		   vm.rightRanelParam = '';
		   vm.rightSearchType = 0;
		   let searchText = "";
		   if(flag == 0){
			   if(vm.rightRanelParam.length <= 0){
				   vm.rightSearchResult = 1;
				   return;
			   }
			   searchText = vm.rightRanelParam;
		   }else{
			   let textInfo =  CKEDITOR.instances.clueIntroEditor.getData();
			   if(textInfo.trim() == ''){
				   return;
			   }
			   searchText = textInfo;
		   }
		   
		   var intelligenceId = vm.operationType != 'A' ? vm.intelligence.intelligenceId : -1;
		   $.ajax({
				type: "POST",
//			    url: "http://"+ window.parent.vm.variableHighLightHost +"/ES/esSearch",
				url: "http://"+ window.parent.vm.variableHighLightHost +"/ES/esSearch4AllText",
		        contentType: "application/x-www-form-urlencoded;charset=utf-8",
//		        data: { searchInfo: vm.rightRanelParam, createType: 1,	user: user.userId},		///searchInfo=1&createType=0&userId=1
		        data: { text: searchText, userId: user.userId, page: page, intelligenceId: intelligenceId },	
		        dataType : "json",
			    success: function(r){
			    	//console.log("r : " + JSON.stringify(r));
			    	if(r.page.list == undefined){
			    		alert("服务器连接失败，请联系管理员！");
			    	} else {
			    		//没有查询到数据
			    		if(r.page.list.length == 0){
			    			vm.rightSearchResult = 2;
			    		} else {
			    			vm.rightSearchResult = 3;
			    			vm.rightSearchList = r.page.list;
			    			vm.totalPage = r.page.totalPage;
			    		}
			    	}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
                  console.log(XMLHttpRequest.status);		// 状态码
                  console.log(XMLHttpRequest.readyState);	// 状态
                  console.log(textStatus);				// 错误信息   
				},
				complete: function(XMLHttpRequest, textStatus) {
				}
			});
	   },
	   /**
	    * 根据关键字 分析
	    */
	   personAnalysisWithKeyword: function(){
		   vm.rightSearchType = 1;
		   if(vm.rightRanelParam.length <= 0){
			   vm.rightSearchResult = 1;
			   return;
		   }
		   var intelligenceId = vm.operationType != 'A' ? vm.intelligence.intelligenceId : -1;
		   $.ajax({
				type: "POST",
			    url: "http://"+ window.parent.vm.variableHighLightHost +"/ES/esSearch",
		        contentType: "application/x-www-form-urlencoded;charset=utf-8",
		        data: { searchInfo: vm.rightRanelParam,createType: 2, userId: user.userId, intelligenceId: intelligenceId},		///searchInfo=1&createType=0&userId=1
		        dataType : "json",
			    success: function(r){
			    	if(r.page.list == undefined){
			    		alert("服务器连接失败，请联系管理员！");
			    	} else {
			    		//没有查询到数据
			    		if(r.page.list.length == 0){
			    			vm.rightSearchResult = 2;
			    		} else {
			    			vm.rightSearchResult = 3;
			    			vm.rightSearchList = r.page.list;
			    		}
			    	}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
                  console.log(XMLHttpRequest.status);		// 状态码
                  console.log(XMLHttpRequest.readyState);	// 状态
                  console.log(textStatus);				// 错误信息   
				},
				complete: function(XMLHttpRequest, textStatus) {
				}
			});
	   },
	   getPersonByNumId: function(person){
			//身份证校验成功，查询数据库
			$.get(baseURL + "qbfx/intelligence/getPersonByNumId/"+person.numId, function(r){
				if(r.person != null){
					$("#personTable").bootstrapTable('append', r.person);
				} else {
					$("#personTable").bootstrapTable('append', person);
				}
            });
		},
		/*************** 新增涉案人员 layer B***************/
		/**
		 * 人员查询
		 */
		searchPersonLayer: function(){
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "人员查询",
				area: ['740px', '450px'],
				shadeClose: false,
				content: jQuery("#searchPersonLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
				}
			});
			
			vm.personSearchParams = {};

			//获取已经选择的 编号列表，下次查询不再显示
			var personList = $("#personTable").bootstrapTable('getData');
			var selectedIds = [];
			if(personList.length > 0){
				for(var i in personList){
					if (personList[i].personId.toString().startsWith('T') == false) {
                		selectedIds.push(parseInt(personList[i].personId));
                	}
				}	
			}
			//已选择的id列表
			if(selectedIds.length > 0){
				vm.personSearchParams.selectedIds = JSON.stringify(selectedIds).replace('[','(').replace(']',')');
			}
			
			/********************** 再次加载 B **********************/
			if($("#jqGridPerson").jqGrid('getDataIDs').length > 0){
				$("#jqGridPerson").setGridWidth(715);
				//查询除原来的传递参数，并逐个清空 B
				var postData2 = $("#jqGridPerson").jqGrid("getGridParam", "postData");
				delete postData2["name"];
				delete postData2["numId"];
				delete postData2["selectedIds"];
				delete postData2["nickname"];
				vm.queryPerson();
				return;
			}
			/********************** 再次加载 E **********************/
			
			$("#jqGridPerson").jqGrid({
				url: baseURL + 'qxda/person/list',
				datatype: "json",
				colModel: [
					{ label: '序号', name: 'personId', index: 'person_id', hidden:true, key: true },
					{ label: '姓名', align: 'center', sortable: false, name: 'name', index: 'name', width:100}, 	
					{ label: '昵称', align: 'center', sortable: false, name: 'nickname', index: 'nickname', width:100}, 
					{ label: '性别', align: 'center', name: 'sex', index: 'sex', width:50, formatter: function(value, options, row){
						 for(var i=0; i<vm.sexList.length; i++){
		    					if(vm.sexList[i].code == value){
		    						return vm.sexList[i].value;
		    					}
		    				}
			        	   return "";
						}}, 
					{ label: '族别', align: 'center',sortable: false, name: 'nation', index: 'nation', width:100}, 
					{ label: '身份证号', align: 'center', sortable: false, name: 'numId', index: 'numId', width:150}, 
					{ label: '户籍地', hidden:true, name: 'placeHome', index: 'placeHome', width:150}, 
					{ label: '操作', name: 'operate', align: 'center',  sortable: false, width: 60,formatter: function(value, grid, row, state){
							return '<a onclick="vm.addPerson('+grid.rowId+')" style="cursor: pointer" title="增加"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>'
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
				width: '715px',
				//multiselect: true,
				pager: "#jqGridPagerPerson",
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
	        	   $("#jqGridPerson").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "auto" }); 
	        	 
	           },
	           postData: vm.personSearchParams
			});
		},
		/**
		 * 涉案人员 查询
		 */
		queryPerson: function(){
			//获取已经选择的 编号列表，下次查询不再显示
			var personList = $("#personTable").bootstrapTable('getData');
			var selectedIds = [];
			if(personList.length > 0){
				for(var i in personList){
					if(personList[i].personId.toString().startsWith('T') == false){
						selectedIds.push(parseInt(personList[i].personId));
					}
				}	
			}
			//已选择的id列表
			if(selectedIds.length > 0){
				vm.personSearchParams.selectedIds = JSON.stringify(selectedIds).replace('[','(').replace(']',')');
			}
			
			//var page = $("#jqGridPerson").jqGrid('getGridParam','page');
			$("#jqGridPerson").jqGrid('setGridParam',{ 
				postData:vm.personSearchParams,
				page: 1
			}).trigger("reloadGrid");
		},
		
		/**
		 * 跳转到 全息档案 新增页面
		 */
		jumpToAddPersonPage: function(){
			var url = 'modules/qxda/person.html';
			var type_id = 'A';
			var iframeId = self.frameElement.getAttribute('id');
			window.parent.goNext(url, type_id, null, null, iframeId);
		},
		
		addPerson: function(personId){
			var person = $("#jqGridPerson").jqGrid('getRowData', personId);
			layer.closeAll();
			$("#personTable").bootstrapTable('append', person);
		},
		
		/**
		 * 逐条删除-涉案人员
		 */
		removePerson: function(id){
			confirm('确定将涉案人员从该线索中删除？', function(){
				$("#personTable").bootstrapTable('removeByUniqueId', id);
				alert("删除成功");
			});
		},
		/**
		 * 批量删除-涉案人员
		 */
		removeBatchPerson: function(){			
			var selectedRecords = $('#personTable').bootstrapTable('getSelections');
			if(selectedRecords.length < 1){
				alert("请至少选择一条记录");
				return;
			}
			confirm('确定将涉案人员从该线索中删除？', function(){
				var selectedIds = [];
				for(var i=0; i<selectedRecords.length; i++){
					selectedIds.push(selectedRecords[i].personId);
				}
				$('#personTable').bootstrapTable('remove', {field: 'personId', values: selectedIds}); 
				alert("删除成功");
			});
		},
		/**
		 * 格式化“来源”列
		 */
		personSourceFormatter: function(value, row){
			if(row.personId.toString().startsWith('T')){
				return '<span class="label label-success" style="padding:3px;"><i class="fa fa-superpowers" aria-hidden="true"></i> 自动识别</span>';
			} else {
				return '<span class="label label-warning" style="padding:3px;"><i class="fa fa-database" aria-hidden="true"></i> 全息档案</span>';
			}
		},
		/**
		 * 格式化“操作”列
		 */
		personOperationFormatter: function(value, row){
			if(operation=="0") {
				return '<a style="cursor: pointer" title="查看" onclick="vm.viewPerson(' + row.personId+ ')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';		
			} else {
				return '<a style="cursor: pointer" title="修改" onclick="vm.editPerson(\''+row.personId+'\')" ><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>'+'<a style="cursor: pointer" title="删除" onclick="vm.removePerson(\''+row.personId+'\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
			}
		},
		/**
		 * 查看 涉案人员
		 */
		viewPerson: function(personId){
			var url = 'modules/qxda/person.html';
			var type_id = 'V-' + personId;
			window.parent.goNext(url, type_id, null);
		},
		editPerson: function(personId){
			var url = 'modules/qxda/person.html';
			var type_id = 'U-' + personId;
			var dataParams = null;
			// 自动识别出的涉案人员
			if(personId.toString().startsWith('T')){
				dataParams = $('#personTable').bootstrapTable('getRowByUniqueId', personId);
			}
			var iframeId = self.frameElement.getAttribute('id');
			window.parent.goNext(url, type_id, null, dataParams, iframeId);
		},
		callbackGoNext: function(params){
			//自动识别涉案人员
			if(params.personIdTemp != undefined && params.personIdTemp != null){
				//1、判断 涉案人员 是否还存在，是否在编辑时被 执行了删除操作
				var person = $('#personTable').bootstrapTable('getRowByUniqueId', params.personIdTemp);
				if(person != undefined && person != null){
					//更新
					$("#personTable").bootstrapTable('updateByUniqueId', {id: params.personIdTemp, row: params});
				}
			} 
			//数据库已存在人员	或者 	新增人员
			else {
				//1、判断 涉案人员 是否还存在，是否在编辑时被 执行了删除操作
				var person = $('#personTable').bootstrapTable('getRowByUniqueId', params.personId);
				if(person != undefined && person != null){
					//更新
					$("#personTable").bootstrapTable('updateByUniqueId', {id: params.personId, row: params});
				} else {
					$("#personTable").bootstrapTable('append', params);
				}
			}
			//锚点定位
			//document.body.scrollTop = $('#personTable').offsetTop;
			var t = $('#personTable').offset().top;
		    $(window).scrollTop(t - 50);
			//$('#personTable').scrollIntoView();
		},
		sexFormatter: function(value, row){
			if(value !=null && value != ""){
				for (var index in vm.sexList) {
	    			if(vm.sexList[index].code == value){
	    				return vm.sexList[index].value;
	    			}
				}
			}
			return value;
		},
		/*************** 新增涉案人员 layer E***************/
		
		promptFormatter:function(value,row){
			return "<span title="+ value +">"+ value +"</span>";
		},
		/******** 父页面调用 B ********/
		resize: function(){
			$(window).resize();
		},
		/******** 父页面调用 E ********/
	},
	created: function () {
	    this.loadingDict();
	    //人员组织数据
	    this.selectUsers = window.parent.vm.selectUsers;
        this.selectUsers2 = window.parent.vm.selectUsers2;
	    //页面参数
		var params = self.frameElement.getAttribute('params');
		//点击菜单列表进入 ，防止表格加载时 展示区域未定义
		if(params == 'undefined' || params == 'null'){
			this.showPage = 0;
		}
	},
	mounted: function () {
		this.dateDefind();
	}
});
function progressHandlingFunction(e) {
	if (e.lengthComputable) {
		var percent = e.loaded / e.total;
        $("#progress-bar").css("width", (percent * 450));
	} 
}