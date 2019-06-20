//生成菜单
var menuItem = Vue.extend({
    name: 'menu-item',
    props:{item:{}},
    template:[
        '<li >',
        '	<a v-if="item.type === 0" href="javascript:;">',
        '		<i v-if="item.icon != null" :class="item.icon"></i>',
        '		<span>{{item.name}}</span>',
        '		<i class="fa fa-angle-left pull-right"></i>',
        '	</a>',
        '	<ul v-if="item.type === 0" class="treeview-menu" >',
        '		<menu-item :item="item" v-for="item in item.list" :key="item.menuId"></menu-item>',
        '	</ul>',

        '	<a v-if="item.type === 1 && item.parentId === 0" :href="\'#\'+item.url">',
        '		<i v-if="item.icon != null" :class="item.icon"></i>',
        '		<span>{{item.name}}</span>',
        '	</a>',

        '	<a v-if="item.type === 1 && item.parentId != 0" :href="\'#\'+item.url"><i v-if="item.icon != null" :class="item.icon"></i><i v-else class="fa fa-circle-o"></i> {{item.name}}</a>',
        '</li>'
    ].join('')
});

var iframeMap = new Map();
iframeMap.set('iframe-4',{"menuId":1, "name": "首页", "url": "main.html", "navTitle": "首页",});

var iframeHeight = '512';
//iframe自适应
$(window).on('resize', function() {
	var $content = $('.content');
	$content.height($(this).height() - 90);
	$content.find('iframe').each(function() {
		$(this).height($content.height() - 4);
		iframeHeight = $content.height() - 4;
	});
}).resize();

function ssResize(){
	var $content = $('.content');
	$content.height($(this).height() - 90);
	$content.find('iframe').each(function() {
		$(this).height($content.height() - 4);
		iframeHeight = $content.height() - 4;
	});
}

$(window).resize(function(){
	//重新加载 隐藏页标签
	loadingPageTag();
});

/********************* 跨域消息B *********************/
window.addEventListener("message", receiveMessage, false);
function receiveMessage(event)
{
  /*if (event.origin !== "http://example.org:8080")
    return;*/
	console.log(event.origin);
	console.log(" e.data: " + event.data);
	if(event.data != undefined){
		var data = JSON.parse(event.data);
		if(data.msgType == 1){	//alert
			alert(data.data);
		} else if(data.msgType == 2) {	//页面跳转
			goNext(data.data.url, data.data.type_id);
		}
	}
  // ...
}
/********************* 跨域消息E *********************/

var msgLayerIndex;
var msgList = [];		//未读消息（展示）
var msgListHide = [];	//未读消息（隐藏）
var msgTask;			//消息定时任务
var msgTimeSpace = 60000;	//时间间隔 1分钟
$(function(){ 
	/*//点击右下角消息事件
　　$("body").on('click','.msg-group-item',function(){
	//$(".msg-group-item").click(function(){
		//parent.layer.close(layer.index);
		var id = $(this).attr('id').split('-')[1];
		//显示消息内容
		$.each(msgList, function(index,msg){
			if(this.msgId == id){
				//修改消息状态为：已读
				$.getJSON("common/commsg/read/"+msg.msgId, function(r){
					if(r.code === 0){
						vm.sysMsg = r.msg;
						var title = '';
						var url = '';
						switch(msg.type)
						{
						case '1':
							title = '【线索退回】';
							url = 'modules/qbfx/intelligence.html';
						  break;    
						case '2':   
							title = '【线索上报】';
							url = 'modules/qbfx/intelligence.html';
						  break;    
						case '3':   
							title = '【线索下发】';
							url = 'modules/qbfx/intelligence.html';
							break;  
						case '4':   
							title = '【线索盯办】';
							url = 'modules/qbfx/intelligence.html';
							break;  
						case '5':   
							title = '【工作通知】';
							url = 'modules/gztz/notice.html';
							break;  
						case '6':   
							title = '【通知反馈】';
							url = 'modules/gztz/notice.html';
							break;  
						case '7':   
							title = '【个人日志】';
							url = 'modules/grrz/personallog.html';
							break;  
						case '8':   
							title = '【线索采纳】';
							url = 'modules/qbfx/intelligence.html';
							break;  
						case '9':   
							title = '【线索未采纳】';
							url = 'modules/qbfx/intelligence.html';
							break;  
						case '10':   
							title = '【线索流转】';
							url = 'modules/qbfx/intelligence.html';
							break;  
						default:    
							title = '【未定义】';
						}
						goNext(url, 'V-'+msg.relationId);
						//parent.layer.close(layer.index);
						layer.open({
							type: 1,
							skin: 'layui-layer-molv',
							title: title + " - 提醒",
							area: ['600px','220px'],
							shadeClose: false, //开启遮罩关闭
							shade: false,
							content: jQuery("#sysMsgLayer")
						});
					} else {
						alert(r.msg);
					}
					
					//删除列表中对应消息
					$("#msg-" + id).remove();
					//数组中删除元素
					msgList.splice(index,1);
					//$("#msgNum").html(msgList.length);
					vm.msgNum = msgList.length;
					if($(".msg-group-item").size() == 0){
						layer.close(msgLayerIndex);
						$('#msg-panel').hide();
					} else {
						if($(".msg-group-item").size() == 9 && msgList.length >= 10){
							vm.addMsg(msgList[9]);
						}						
						//$(".msg-group").resize();
					}
				});
			}
		});
		
	});*/
});

function msgClick(that){
	var id = that.id.split('-')[1];
	//数组中删除元素
	$.each(msgList, function(index,msg){
		if(this.msgId == id){
			/***************** 删除点击消息 B *****************/
			//删除列表中对应消息
			$("#msg-" + id).remove();
			msgList.splice(index,1);
			vm.msgNum = msgList.length;
			if($(".msg-group-item").size() == 0){
				layer.close(msgLayerIndex);
				$('#msg-panel').hide();
			} else {
				if($(".msg-group-item").size() == 9 && msgList.length >= 10){
					vm.addMsg(msgList[9]);
				}						
			}
			/***************** 删除点击消息 E *****************/
			
			//跳转到下一页
			var isGoNext = true;
			//修改消息状态为：已读
			$.getJSON("common/commsg/read/"+msg.msgId, function(r){
				if(r.code === 0){
					vm.sysMsg = r.msg;
					var title = '';
					var url = '';
					switch(msg.type)
					{
					case '1':
						title = '【线索退回】';
						url = 'modules/qbfx/intelligence.html';
					  break;    
					case '2':   
						title = '【线索上报】';
						url = 'modules/qbfx/intelligence.html';
					  break;    
					case '3':   
						title = '【线索下发】';
						url = 'modules/qbfx/intelligence.html';
						break;  
					case '4':   
						title = '【线索盯办】';
						url = 'modules/qbfx/intelligence.html';
						break;  
					case '5':   
						title = '【工作通知】';
						url = 'modules/gztz/notice.html';
						break;  
					case '6':   
						title = '【通知反馈】';
						url = 'modules/gztz/notice.html';
						break;  
					case '7':   
						title = '【个人日志】';
						url = 'modules/grrz/personallog.html';
						break;  
					case '8':   
						title = '【线索采纳】';
						url = 'modules/qbfx/intelligence.html';
						break;  
					case '9':   
						title = '【线索未采纳】';
						url = 'modules/qbfx/intelligence.html';
						break;  
					case '10':   
						title = '【线索流转】';
						url = 'modules/qbfx/intelligence.html';
						break;  
					default:    
						isGoNext = false;
						title = '【未定义】';
					}
				} else {
					alert(r.msg);
					isGoNext = false;
				}
				
				if(isGoNext == true){
					goNext(url, 'V-'+msg.relationId);
				}
			});
			return true;
		}
	});
}

/**
 * 隐藏消息 处理
 * @returns
 */
function hideMsgHandler(){
	//console.log("定时任务执行--：当前时间" + (new Date()).Format("yyyy-MM-dd hh:mm:ss") + "    :      " + JSON.stringify(msgListHide));
	var curTime = new Date();
	var msg = {};
	var indexDel = null;
	$.each(msgListHide, function(index,msg){
		var msgTime
		if(msg.msgTime.constructor === Date) {
			//console.log("msg.msgTime.constructor : 是");
			msgTime = msg.msgTime;
		} else {
			//console.log("msg.msgTime.constructor : 否");
			msgTime = new Date(Date.parse(msg.msgTime));
		}
		//var dateStr = (new Date()).Format("yyyy-MM-dd hh:mm");
		//隐藏消息 的 提醒时间 超过或等于当前时间 ， 提示消息
		if(msgTime <= curTime && msg.isRead == 0){
			/*************** 根据UUID判断是否已存在该消息（工作通知发送两条）B ****************/
			//遍历 展示的消息列表，如果存在uuid相同的数据，则把隐藏消息列表中的数据删除
			$.each(msgList, function(index,msgShow){
				if(msg.uuid == msgShow.uuid){
					msg.isRead = 1;
					return false;
				}
			});
			/*************** 根据UUID判断是否已存在该消息（工作通知发送两条）E ****************/
			if(msg.isRead != 1){
				msgList = prependArr(msgList,msg);
				vm.addMsg(msg, 'top');
				//显示消息列表 增加当前元素
				//隐藏消息列表 删除当前元素，删除多个代码太复杂，使用 isRead = 1代表删除
				msg.isRead = 1;
				indexDel = index;
				return true;
			}
		}
	});
	msgListHide=$.grep(msgListHide,function(m,i){
		//console.log("  m.isRead != 1 : " +  m.isRead != 1);
		return m.isRead != 1;
	});
	//msgListHide.splice(index,1);
	if(msgListHide.length <= 0){	//只有一条未显示消息， 显示后关闭定时任务
		console.log("关闭定时任务------");
		clearInterval(msgTask);
	}
}

document.onkeydown = function () {
    if (window.event && window.event.keyCode == 13) {
        window.event.returnValue = false;
    }
}

//注册菜单组件
Vue.component('menuItem',menuItem);
var userin;
var vm = new Vue({
	el:'#rrapp',
	data:{
		user:{},
		menuList:{},
		main:"main.html",
		password:'',
		newPassword:'',
		reNewPassword:'',
        navTitle:"首页",
        isEditted: false,
        
        //字典列表 键值对，键：type;值：列表
        dictListMap: new Map(),
        msgNum: 0,
        sysMsg: {},	//弹框展示的消息
        
        //系统变量
        variableHighLightHost: "",		//高亮、自动填充 服务器IP
        variableNeo4jHost: "",			//
        
        showHidePageTag: false,			//显示右上角 页面溢出标签
        showHidePageListPanel: false,	//显示右上角 页面溢出 页面列表
        hidePageCount:0,				//隐藏的 页面个数
        selectUsers:[],   // 人员组织数据(弹窗选择用户数据)
        selectUsers2:[]   // 人员组织数据(弹窗选择用户数据)
	},
	methods: {
		getMenuList: function (event) {
			$.getJSON("sys/menu/nav?_"+$.now(), function(r){
				vm.menuList = r.menuList;
				//console.log("vm.menuList : " + JSON.stringify(vm.menuList));
			});
		},
		getDictList: function (){
			$.getJSON("sys/dict/listAll", function(r){
		    	vm.dictListMap = _objToStrMap(r.dictListMap);
		    });
		},
		getUser: function(){
			$.getJSON("sys/user/info?_"+$.now(), function(r){
				vm.user = r.user;
				//console.log("vm.user: " + JSON.stringify(vm.user));
				if(r.user.sex==0)
					vm.user.sex='女';
				else if(r.user.sex==1)
					vm.user.sex='男';
				else
					vm.user.sex='未知';
				//建立连接
				vm.connect(vm.user.userId);
				//获取用户未读消息列表
				//vm.getMsgList(vm.user.userId);
			});
		},
		getConfig: function(){
			//高亮、自动填充 服务器IP
			$.getJSON("sys/config/getValue/HOST_ES", function(r){
		    	vm.variableHighLightHost = r.value;		//高亮、自动填充 服务器IP
		    });
			$.getJSON("sys/config/getValue/HOST_NEO4J", function(r){
				vm.variableNeo4jHost = r.value;
		    });
		},
		getMsgList: function(userId){
			/*$.getJSON("common/commsg/list/" + userId, function(r){
				msgList = r.list;
				//console.log("msgList : " + JSON.stringify(r.list));
				$.each(msgList, function(index,msg){
					if(index >= 10){
						return true;
					} else {
						vm.addMsg(msg);
					}
				});
			});*/
			
			$.getJSON("common/commsg/listHome/" + userId, function(r){
				//清空 消息列表
				$('.msg-group li').remove();
				//1、显示历史消息
				msgList = r.map.showList;
				//console.log("msgList : " + JSON.stringify(r.list));
				$.each(msgList, function(index,msg){
					if(index >= 10){
						return true;
					} else {
						vm.addMsg(msg);
					}
				});
				//2、当天 不到提醒时间的 未读消息（不显示）
				msgListHide = r.map.hideList;
				if(msgListHide.length > 0){
					//开启定时任务
					console.log("开启定时任务------");
					msgTask = setInterval(hideMsgHandler, msgTimeSpace);
				}
			});
		},
		getSelectUsers:function(){
			 // 人员组织数据
	        $.get("qbfx/common/deptTree/-1",function(r) {
	            vm.selectUsers = r;
	        });
	        $.get("qbfx/common/deptTree/0",function(r) {
	            vm.selectUsers2 = r;
	        });
		},
		//显示消息
		addMsg: function(msg, position){
			var label = '';
			switch(msg.type)
			{
			case '1':
				label = '<span class="label label-danger" style="padding:3px;">【线索退回】</span>';
			  break;
			case '2':
				label = '<span class="label label-primary" style="padding:3px;">【线索上报】</span>';
			  break;
			case '3':
				label = '<span class="label label-primary" style="padding:3px;">【线索下发】</span>';
				break;
			case '4':
				label = '<span class="label label-warning" style="padding:3px;">【线索盯办】</span>';
				break;
			case '5':
				label = '<span class="label label-warning" style="padding:3px;">【工作通知】</span>';
				break;
			case '6':
				label = '<span class="label label-info" style="padding:3px;">【通知反馈】</span>';
				break;
			case '7':
				label = '<span class="label label-default" style="padding:3px;">【个人日志】</span>';
				break;
			case '8':
				label = '<span class="label" style="padding:3px;background: green !important">【线索采纳】</span>';
				break;
			case '9':
				label = '<span class="label label-danger" style="padding:3px;">【线索未采纳】</span>';
				break;
			case '10':
				label = '<span class="label label-primary" style="padding:3px;">【线索流转】</span>';
				break;
			case '11':
				label = '<span class="label label-primary" style="padding:3px;">【线索办结】</span>';
				break;
			default:
				label = '<span class="label label-default" style="padding:3px;">【未定义】</span>';
			}
			//vm.msgNum = vm.msgNum + 1;
			vm.msgNum = msgList.length;
			//已展示消息列表
			if($(".msg-group").size() > 0){
					//prepend append
				if(position == 'top'){
					$('.msg-group').prepend('<li onclick="msgClick(this)" class="msg-group-item notice_text" id="msg-'+msg.msgId+'"><h5>' + label + '<font title="'+msg.title+'">《' + msg.title +'》<font></h5></li>');
					if($('.msg-group-item').size() > 10){
						//删除最后一个元素
						$('.msg-group-item:last').remove();
					}
				} else {
					$('.msg-group').append('<li onclick="msgClick(this)" class="msg-group-item notice_text" id="msg-'+msg.msgId+'"><h5>' + label + '<font title="'+msg.title+'">《' + msg.title +'》<font></h5></li>');
				}
				//$(".msg-group").resize();
			}
			//未展示消息列表
			else{
				$('#msg-panel .panel-body').append('<ul class="msg-group"><li onclick="msgClick(this)" class="msg-group-item notice_text" id="msg-'+msg.msgId+'"><h5>' + label + '<font title="'+msg.title+'">《' + msg.title +'》<font></h5></ul>');
				//$('#msgNum').html(msgList.length);
				vm.msgNum = msgList.length;
				$('#msg-panel').show();
				/*msgLayerIndex = layer.open({
					id: 'comMsgLayer', 
					title: '系统消息<span class="badge" id="msgNum">' + msgList.length + '</span>',
					content: '<ul class="msg-group"><li class="msg-group-item" id="msg-'+msg.msgId+'">'+ msg.title +'</li></ul>',
					shade: 0,
					offset: 'rb',
					closeBtn: 0,
					move: false,
					btn: ''
				}); */
			}
		},
		msgPanelControl:function(){
			if($('#msg-panel .glyphicon').hasClass('glyphicon-chevron-down')){
				$('#msg-panel .panel-body').hide(1000);
				$('#msg-panel .glyphicon').removeClass('glyphicon-chevron-down');
				$('#msg-panel .glyphicon').addClass('glyphicon-chevron-up');
			} else {
				$('#msg-panel .panel-body').show(1000);
				$('#msg-panel .glyphicon').removeClass('glyphicon-chevron-up');
				$('#msg-panel .glyphicon').addClass('glyphicon-chevron-down');
			}
		},
		over:function () {
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "登录人信息",
				area: ['380px', '210px'],
				shadeClose: true,
				shade:false,
				content: jQuery("#userInfo"),
				fixed: false,
				offset:['0px','0px'],
			});
			// this.seen=true;
        },	
        out:function(){
        	layer.closeAll('page');
        	layer.closeAll('iframe'); 
        },
		updatePassword: function(){
			vm.newPassword = null;
			vm.reNewPassword = null;
			vm.password = null;			
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "修改密码",
				area: ['550px', '330px'],
				shadeClose: false,
				content: jQuery("#passwordLayer"),
				btn: ['修改','取消'],
				btn1: function (index) {
					if(vm.password==null){
						layer.alert("原密码不能为空");
						return;
					}
					if(vm.newPassword==null){
						layer.alert("新密码不能为空");
						return;
					}
					if(vm.reNewPassword==null){
						layer.alert("确认密码不能为空");
						return;
					}
					if(vm.newPassword!=vm.reNewPassword){
						layer.alert("新密码与确认新密码不一致");
						return;
					}
					if(vm.newPassword==vm.password){
						layer.alert("新密码不能与原密码相同");
						return;
					}
					$.ajax({
						type: "POST",
					    url: "sys/user/password",
					    data: {password: vm.password, newPassword: vm.newPassword},
					    dataType: "json",
					    success: function(result){
							if(result.code == 0){
								layer.close(index); 
								layer.msg('修改成功，将在3秒后自动退出当前登录系统',{
			                          offset:['50%'],
			                          time: 3000 //3秒关闭（如果不配置，默认是3秒）
			                    },function(){
			                    	var curPath = window.document.location.href;
								    var pathName = window.document.location.pathname;
								    var pos = curPath.indexOf(pathName);
								    var localhostPaht = curPath.substring(0, pos);
								    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);										   
								    parent.location.href=localhostPaht+projectName+'/logout';      
			                    }); 
							}else{
								layer.alert(result.msg);
							}
						}
					});
	            },
	            btn2: function (index) {
	            	vm.newPassword='';
					vm.reNewPassword='';
					vm.password='';
	            }
			});
		},
		logout: function() {
			layer.confirm('您确定要退出系统吗?',{btn: ['确定', '取消'],title:"提示"}, function(){
				var curPath = window.document.location.href;
			    var pathName = window.document.location.pathname;
			    var pos = curPath.indexOf(pathName);
			    var localhostPaht = curPath.substring(0, pos);
			    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);										   
			    parent.location.href=localhostPaht+projectName+'/logout';      
		    });
		},
        donate: function () {
            layer.open({
                type: 2,
                title: false,
                area: ['806px', '467px'],
                closeBtn: 1,
                shadeClose: false,
                content: ['http://cdn.sdses.io/donate.jpg', 'no']
            });
        },
        connect: function(userId) {
        	var socket; 
        	if(typeof(WebSocket) == "undefined") { 
        		console.log("您的浏览器不支持WebSocket"); 
    		} else { 
    			console.log("您的浏览器支持WebSocket"); 
    			var curPath = window.document.location.href;
			    var pathName = window.document.location.pathname;
			    var pos = curPath.indexOf(pathName);
			    var localhostPaht = curPath.substring(0, pos);
			    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);										   
    			//实现化WebSocket对象，指定要连接的服务器地址与端口 建立连接 
    			//等同于socket = new WebSocket("ws://localhost:8083/checkcentersys/websocket/20"); 
    			socket = new ReconnectingWebSocket((localhostPaht+projectName+"/websocket/" + userId).replace("http","ws")); 
    			//打开事件 
    			socket.onopen = function() { 
    				console.log("Socket 已打开"); 
    				vm.getMsgList(vm.user.userId);
    				//socket.send("这是来自客户端的消息" + location.href + new Date()); 
				}; 
				//获得消息事件 
				socket.onmessage = function(msg) { 
					//console.log("socket.onmessage: " + JSON.stringify(msg)); 
					//发现消息进入 开始处理前端触发逻辑
					if(msg.data != '连接成功'){
						var msg = JSON.parse(msg.data);
						if(msg.receivedUserId != vm.user.userId){
							return;
						}
						// 更新已有 通知消息，先把之前的删除
						if(msg.isUpdate == "1"){
							var msgDelFlag = false;
							//展示的 消息列表
							$.each(msgList, function(index,msgShow){
								if(msg.msgId == msgShow.msgId){
									msgList.splice(index,1);
									msgDelFlag = true;
									return false;
								}
							});
							//隐藏的消息列表
							if(msgDelFlag == false){
								$.each(msgListHide, function(index,msgHide){
									if(msg.msgId == msgHide.msgId){
										msgListHide.splice(index,1);
										return false;
									}
								});
							}
						}
						
						/*************** 根据UUID判断是否已存在该消息（工作通知发送两条）B ****************/
						var msgExistsFlag = false;
						if(msg.type == 5){
							//遍历 展示的消息列表，如果存在uuid相同的数据，则把隐藏消息列表中的数据删除
							$.each(msgList, function(index,msgShow){
								if(msg.uuid == msgShow.uuid){
									msgExistsFlag = true;
								}
							});
						}
						
						/*************** 根据UUID判断是否已存在该消息（工作通知发送两条）E ****************/
						
						var msgTime = new Date(msg.msgTime);	//消息提醒时间
						var curTime = new Date();				//当前时间
						//console.log("msgTime : " + msgTime.Format("yyyy-MM-dd hh:mm:ss.S"));
						//console.log("curTime : " + curTime.Format("yyyy-MM-dd hh:mm:ss.S"));
						msg.msgTime = msgTime.Format("yyyy-MM-dd hh:mm:ss");
						//isDelay 延时提醒 0：否；1：是
						if(msg.isDelay == 0 || curTime >= msgTime && !msgExistsFlag){ //当前时间大于提醒时间，提示消息
							vm.addMsg(msg,'top');
							msgList = prependArr(msgList,msg);
							//$("#msgNum").html(msgList.length);
							vm.msgNum = msgList.length;
						} else {
							//prependArr(msgListHide,msg);
							msgListHide.push(msg);
							//console.log("msgListHide : " + JSON.stringify(msgListHide));
							//判断 隐藏消息 列表 是为空,为空 则打开 定时器
							if(msgListHide.length == 1){
								//开启定时任务
								console.log("开启定时任务------");
								msgTask = setInterval(hideMsgHandler, msgTimeSpace);
							}
						}
					}
				}; 
				//关闭事件 
				socket.onclose = function(e) { 
					console.log("Socket已关闭"); 
					console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
					//关闭之后重新连接
					//socket = new WebSocket((localhostPaht+projectName+"/websocket/" + userId).replace("http","ws")); 
				}; 
				//发生了错误事件
				socket.onerror = function(e) { 
					console.log("Socket发生了错误"); 
					console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
					//alert("Socket发生了错误"); 
					//此时可以尝试刷新页面 
				};
				//离开页面时，关闭socket 
				//jquery1.8中已经被废弃，3.0中已经移除
				$(window).unload(function(){ socket.close(); }); 
			}
        }
	},
	created: function(){
		this.getMenuList();
		this.getUser();
		this.getDictList();
		this.getConfig();
		this.getSelectUsers();
	},
	updated: function(){
		//路由
		var router = new Router();
		routerList(router, vm.menuList);
		router.start();
	//	$(".sidebar-menu").find("li").first().addClass("active");
	}
});


var initFlag = false;
function routerList(router, menuList){
	for(var key in menuList){
		var menu = menuList[key];
		if(menu.type == 0){
			routerList(router, menu.list);
			if(!initFlag){
				 $(".sidebar-menu").find("li").first().addClass("active");
			}
			initFlag = true;
		}else if(menu.type == 1){
			router.add('#'+menu.url, function() {
				var url = window.location.hash;
				window.location.hash=url+"?t="+new Date().getTime();
				//替换iframe的url
			    //vm.main = url.replace('#', '');
				/*if(vm.isEditted) {
					layer.confirm('页面尚未保存，您确定要离开页面吗?',{btn: ['确定', '取消'],title:"提示"}, function(index){
						goNext(url.replace('#', ''));
					    vm.navTitle = $("a[href='"+url+"']").text();
					    window.location.hash=url+"?t="+new Date().getTime();
					    layer.close(index);
					    vm.isEditted = false;
				    });
				} else {
					goNext(url.replace('#', ''));
				    vm.navTitle = $("a[href='"+url+"']").text();
				    window.location.hash=url+"?t="+new Date().getTime();
				}*/
				
				goNext(url.replace('#', ''));
			    vm.navTitle = $("a[href='"+url+"']").text();
			    window.location.hash=url+"?t="+new Date().getTime();
			});
		}
	}
}

/**
 * 点击菜单 页面跳转
 * @param url
 * @param type_id 	type A:新增；U:更新；V:查看；	id:新增对应具体新增项（线索、案件），更新、查看为id,extraTitle：标签（有值则显示改标签内容）
 * @param title 标题
 * @param dataParams 参数，JSON对象（iframe中的 searchParams属性）
 * @param goIframeId 页面完成操作后，跳转回的iframe的 id属性值
 * @returns
 */
function goNext(url, type_id, title, dataParams, goIframeId) {
	url = url.split('?')[0];
	$(".iframeClass").hide();
	$(".btn-primary").addClass("btn-default");
	$(".btn-primary").removeClass("btn-primary");
	
	var menuInfo = getInfoByUrl(url, vm.menuList, '');
	var idName = menuInfo.menuId;
	var icon = '';
	if(type_id != undefined && type_id != null) {
		idName += "-" +type_id;
		var type = type_id.split('-')[0];
		//新增
		if(type == 'A'){	
			icon = '<i class="fa fa-plus-square" aria-hidden="true"></i>';
		} 
		//修改
		else if(type == 'U'){
			icon = '<i class="fa fa-wrench" aria-hidden="true"></i>';
		}
		//查看
		else if(type == 'V'){
			icon = '<i class="fa fa-eye" aria-hidden="true"></i>';
		}
		//表格
		else if(type == 'T'){
			icon = '<i class="fa fa-table" aria-hidden="true"></i>';
		}
		//图表
		else if(type == 'C'){
			icon = '<i class="fa fa-area-chart" aria-hidden="true"></i>';
		}
		
		/****************************** 情报研判模块 B ******************************/
		//盯办
		else if(type == 'STARE'){
			icon = '<span class="glyphicon glyphicon-screenshot" style="position: unset;" aria-hidden="true"></span>';
		}
		//研判
		else if(type == 'TRANSFER'){
			icon = '<span class="glyphicon glyphicon-pawn" style="position: unset;" aria-hidden="true"></span>';
		}
		//二次核查
		else if(type == 'CHECK'){
			icon = '<span class="glyphicon glyphicon-superscript" style="position: unset;" aria-hidden="true"></span>';
		}
		/****************************** 情报研判模块 B ******************************/
		//消息通知-反馈
		else if(type == 'FEEDBACK'){
			icon = '<span class="glyphicon glyphicon-send" style="position: unset;" aria-hidden="true"></span>';
		}
	}
	
	//标签名称
	if(title == undefined && title == null){
		title = menuInfo.name;
	}
	//goIframeId 页面完成操作后，跳转回的iframe的 id属性值
	if(goIframeId == undefined && goIframeId == null){
		goIframeId = '';
	}
	
	if(iframeMap.get("iframe-" + idName) != null){
		$("#iframe-"+idName).show();
		$("#btn-iframe-"+idName).removeClass("btn-default");
		$("#btn-iframe-"+idName).addClass("btn-primary");
		
		try{
			$("#iframe-"+idName)[0].contentWindow.vm.resize();
	    } catch(e){
			
		}
	} else {
		//var searchParams = {finishTimeB: '2018-03-11', finishTimeE: '2019-03-16',}
		$('<iframe name = "iframe-'+idName+'" id="iframe-'+idName+'" fatherId="iframe-'+menuInfo.menuId+'" class="iframeClass" params="'+ type_id +'"dataParams=\''+ JSON.stringify(dataParams) +'\'" goIframeId="'+goIframeId+'" scrolling="yes" frameborder="0" style="width:100%;min-height:420px;overflow:visible;background:#24273f;height:'+iframeHeight+'px;" src="'+url+'?userId='+vm.user.userId+'"></iframe>').prependTo('.content');
		$('<div id="btn-iframe-'+idName+'" class="btn btn-primary btn-iframe" onclick="menuChange(\'iframe-'+idName+'\')"><span>'+ title + icon + '</span> <span class="span-close" onclick="closeIframeWithConfirm(\'iframe-'+idName+'\',1)">×</span></div>').prependTo('#iframe-tab');
		iframeMap.set("iframe-" + idName,menuInfo);
		//判断溢出
		//alert(checkOverflow(document.getElementById("iframe-tab")));
		loadingPageTag();
		//console.log("$('#btn-iframe-4').offsetTop : " + $('#btn-iframe-4').offset().top);
	}
	$("#navTitle").html(menuInfo.navTitle);
    $(".sidebar-menu").find("li").removeClass("active");
    $("a[href='#"+ url.split("?")[0] +"']").parents("li").addClass("active");
    $("a[href='"+ url.split("?")[0] +"']").closest(".treeview-menu").addClass("active");
}

/**
 * 加载 右上角 页面数标签
 * @returns
 */
function loadingPageTag(){
	$("#idPageTag li").remove();
	vm.showHidePageTag = false;
	vm.hidePageCount = 0;
	$(".btn-iframe").each(function(){
		//溢出
		if($(this).offset().top > 70){
			vm.hidePageCount = vm.hidePageCount + 1;
			$("#idPageTag").append('<li style="cursor:pointer;" onclick="clickHidePageTag(\''+$(this).attr('id')+'\')"><span>' + $(this).children(':first').html() + '</li>');
		}
	});
	if(vm.hidePageCount > 0){
		vm.showHidePageTag = true;
	} else {
		vm.showHidePageListPanel = false;
	}
}

/**
 * 点击隐藏 页标签
 * @param btnIframeId
 * @returns
 */
function clickHidePageTag(btnIframeId){
	$("#"+btnIframeId).insertBefore($("#iframe-tab div:first"));
	menuChange(btnIframeId.replace('btn-',''));
	loadingPageTag();
	vm.showHidePageListPanel = false;
}

/**
 * 根据id 跳转到 下一页
 * @param iframeId 需要跳转的 iframe id属性
 * @param params	参数（对象）
 * @param url	要跳转的iframe已关闭，跳转到url页面
 * @returns
 */
function goNextById(iframeId, params, url){
	if(iframeMap.get(iframeId) != null){
		$("#"+iframeId).show();
		$("#btn-"+iframeId).removeClass("btn-default");
		$("#btn-"+iframeId).addClass("btn-primary");
		//执行回调函数
		if(params != null && params != undefined){
			//$("#iframe的ID")[0].contentWindow.iframe方法(); 
			$("#"+iframeId)[0].contentWindow.vm.callbackGoNext(params);
			//window.frames["#"+iframeId].vm.callbackGoNext(params);
		}
	} else {
		// 返回页面已关闭，跳转回 查询页面 （点击菜单打开的页面）
		goNext(url);
	}
}

/**
 * 菜单切换
 * @param iframeId
 * @returns
 */
function menuChange(iframeId){
	$(".iframeClass").hide();
	
	$(".btn-primary").addClass("btn-default");
	$(".btn-primary").removeClass("btn-primary");
	$("#btn-"+iframeId).removeClass("btn-default");
	$("#btn-"+iframeId).addClass("btn-primary");
	
	$("#"+iframeId).show();
	$("#navTitle").html(iframeMap.get(iframeId).navTitle);
	var url = iframeMap.get(iframeId).url;
	$(".sidebar-menu").find("li").removeClass("active");
    $("a[href='#"+ url.split("?")[0] +"']").parents("li").addClass("active");
    $("a[href='"+ url.split("?")[0] +"']").closest(".treeview-menu").addClass("active");
    
/*    if(document.createEvent) {
        var event = document.createEvent("HTMLEvents");
        event.initEvent("resize", true, true);
        window.dispatchEvent(event);
    } else if(document.createEventObject) {
        window.fireEvent("onresize");
    }*/
    //$(window).resize();
    //$("#"+iframeId).resize();
    //调整窗口大小
    //$('.content').resize();
    //$("#"+iframeId)[0].contentWindow.find("#jqGrid").setGridWidth('715px');
    try{
    	$("#"+iframeId)[0].contentWindow.vm.resize();
    } catch(e){
		
	}
}

/**
 * 关闭iframe时弹出提示框
 * @param iframeId
 * @confirmTag 确认弹框提示 1（且满足其他条件）:弹出提示框
 * @returns
 */
function closeIframeWithConfirm(iframeId, confirmTag){
	try{
		var event = arguments.callee.caller.arguments[0] || window.event;
		if(event != undefined){
			event.stopPropagation();
		}
	} catch(e){
		
	}
	if(confirmTag != undefined && confirmTag == 1){
		if(iframeId.indexOf("-A") >= 0					//新增
				|| iframeId.indexOf("-U") >= 0			//修改
				|| iframeId.indexOf("-STARE") >= 0		//盯办
				|| iframeId.indexOf("-TRANSFER") >= 0	//流转
				|| iframeId.indexOf("-CHECK") >= 0		//核查
				|| iframeId.indexOf("-FEEDBACK") >= 0	//反馈
			){
			var index = layer.confirm('页面正在编辑，确定关闭?',{btn: ['确定', '取消'],title:"提示"}, function(){
				closeIframe(iframeId);
				layer.close(index);
		    });
		} else {
			closeIframe(iframeId);
		}
	} else {
		closeIframe(iframeId);
	}
}
/**
 * 关闭窗口
 * @param iframeId
 * @returns
 */
function closeIframe(iframeId){
	try{
		var event = arguments.callee.caller.arguments[0] || window.event;
		if(event != undefined){
			event.stopPropagation();
		}
	} catch(e){
		
	}
	
	//判断是否为当前打开页面
	if($("#btn-" + iframeId).hasClass("btn-primary")){
		$("#navTitle").html('');
		//存在其他打开的页面
		if(iframeMap.size > 1){
			//标签后方存在页面
			if($("#btn-" + iframeId).next().hasClass('btn-iframe')){
				menuChange($("#btn-" + iframeId).next().attr("id").replace('btn-',''));
			} else {	//前方存在页面
				menuChange($("#btn-" + iframeId).prev().attr("id").replace('btn-',''));
			}
		}
	}
	$("#btn-" + iframeId).remove();
	$("#"+iframeId).remove();
	iframeMap.delete(iframeId);
	loadingPageTag();
}

/**
 * 关闭窗口(只做关闭操作)
 * @param iframeId
 * @returns
 */
function closeIframeOnly(iframeId){
	$("#btn-" + iframeId).remove();
	$("#"+iframeId).remove();
	iframeMap.delete(iframeId);
}

function getInfoByUrl(url, menuList, navTitle){
	//debugger
	var menuInfo = null;
	for(var key in menuList){
		var menu = menuList[key];
		//console.log("menuList[key] : " + key + "  :  " + JSON.stringify(menuList[key]));
		if(menu.type == 0){
			var menuInfo = getInfoByUrl(url, menu.list, menu.name);
			if(menuInfo != null ){
				return menuInfo;
			}
		} else if(menu.type == 1){
			if(url == menu.url){
				menuInfo = new Object();
				menuInfo.menuId = menu.menuId;
				menuInfo.name = menu.name;
				menuInfo.url = menu.url;
				if(navTitle.length > 0){
					menuInfo.navTitle = navTitle + ' > ' + menu.name;
				} else {
					menuInfo.navTitle = menu.name;
				}
				break;
			}
		}
	}
	return menuInfo;
}

/**
 * 在数组开头插入一个元素
 */
function prependArr(arr, item) {
	// concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。
    return [item].concat(arr);
}

/************************** 日期格式化 B **************************/
//对Date的扩展，将 Date 转化为指定格式的String   
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
//例子：   
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   { 
	var o = {   
	  "M+" : this.getMonth()+1,                 // 月份
	  "d+" : this.getDate(),                    // 日
	  "h+" : this.getHours(),                   // 小时
	  "m+" : this.getMinutes(),                 // 分
	  "s+" : this.getSeconds(),                 // 秒
	  "q+" : Math.floor((this.getMonth()+3)/3), // 季度
	  "S"  : this.getMilliseconds()             // 毫秒
	};   
	if(/(y+)/.test(fmt))   
	  fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
	for(var k in o)   
	  if(new RegExp("("+ k +")").test(fmt))   
	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	return fmt;   
} 
/************************** 日期格式化 E **************************/

/**
 * 判断元素是否溢出
 */
function checkOverflow(el){
   var curOverflow = el.style.overflow;
   if ( !curOverflow || curOverflow === "visible" )
      el.style.overflow = "hidden";
   //先让溢出效果为 hidden 这样才可以比较 clientHeight和scrollHeight
   var isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
   el.style.overflow = curOverflow;
   return isOverflowing;//不满返回false
}

