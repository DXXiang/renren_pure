//jqGrid的配置信息
$.jgrid.defaults.width = 1000;
$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = 'Bootstrap';

var baseURL = "../../";
var host = window.location.origin;
var pathName = window.document.location.pathname;
var projectName = host + pathName.substring(0,pathName.substr(1).indexOf('/')+1); 

//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost:8080/index.html?id=123
// T.p('id') --> 123;
var url = function(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
};
T.p = url;

//全局配置
$.ajaxSetup({
	dataType: "json",
	cache: false
});

//重写alert
window.alert = function(msg, callback){
	parent.layer.alert(msg, function(index){
		parent.layer.close(index);
		if(typeof(callback) === "function"){
			callback("ok");
		}
	});
}

//重写confirm式样框
window.confirm = function(msg, callback){
	parent.layer.confirm(msg, {btn: ['确定','取消']},
	function(index){//确定事件
		parent.layer.close(index);
		if(typeof(callback) === "function"){
			callback("ok");
		}
	});
}

//正整数校验
function isPositiveInteger(s){
    var reg = /^[0-9]+$/ ;
    return reg.test(s);
}    
//选择一条记录
function getSelectedRow() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    
    var selectedIDs = grid.getGridParam("selarrrow");
    if(selectedIDs.length > 1){
    	alert("只能选择一条记录");
    	return ;
    }
    
    return selectedIDs[0];
}

//选择多条记录
function getSelectedRows() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    
    return grid.getGridParam("selarrrow");
}

//判断是否为空
function isBlank(value) {
    return !value || !/\S/.test(value)
}

/************************** 日期格式化 B **************************/
// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
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


/************************** 身份证号合法性校验 B **************************/
//身份证号校验
/*function checkNumId(numid){
	if(!numid || !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(numid)){
		alert("身份证号格式错误");
		return false;
	}
	return true;
}*/
function checkNumIdNoAlert(numid){
	if(!numid || !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(numid)){
		return false;
	}
	return true;
}
/*
 * 身份证15位编码规则：dddddd yymmdd xx p
 * dddddd：6位地区编码
 * yymmdd: 出生年(两位年)月日，如：910215
 * xx: 顺序编码，系统产生，无法确定
 * p: 性别，奇数为男，偶数为女
 *
 * 身份证18位编码规则：dddddd yyyymmdd xxx y
 * dddddd：6位地区编码
 * yyyymmdd: 出生年(四位年)月日，如：19910215
 * xxx：顺序编码，系统产生，无法确定，奇数为男，偶数为女
 * y: 校验码，该位数值可通过前17位计算获得
 *
 * 前17位号码加权因子为 Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
 * 验证位 Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
 * 如果验证码恰好是10，为了保证身份证是十八位，那么第十八位将用X来代替
 * 校验位计算公式：Y_P = mod( ∑(Ai×Wi),11 )
 * i为身份证号码1...17 位; Y_P为校验码Y所在校验码数组位置
*/
 function checkNumId(idCard){
    //15位和18位身份证号码的正则表达式
    var regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if(regIdCard.test(idCard)){
        if(idCard.length==18){
            var idCardWi=new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ); //将前17位加权因子保存在数组里
            var idCardY=new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
            var idCardWiSum=0; //用来保存前17位各自乖以加权因子后的总和
            for(var i=0;i<17;i++){
                idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
            }
            var idCardMod=idCardWiSum%11;//计算出校验码所在数组的位置
            var idCardLast=idCard.substring(17);//得到最后一位身份证号码
            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if(idCardMod==2){
                if(idCardLast=="X"||idCardLast=="x"){
                    return true;
                }else{
                    alert("身份证号码错误！");
                    return false;
                }
            }else{
                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                if(idCardLast==idCardY[idCardMod]){
                	return true;
                }else{
                    alert("身份证号码错误！");
                    return false;
                }
            }
        } else {
        	alert("身份证格式不正确!");
            return false;
        }
    }else{
        alert("身份证格式不正确!");
        return false;
    }
}
function checkId(idcard){
	var regexp1 = /^\d{15}$/g;
	var regexp2 = /^\d{17}[A-Za-z0-9]$/g;
	var msg="";
	if(regexp1.test(idcard) || regexp2.test(idcard)){
		if(!isIDno(idcard)){
			msg="身份证号码不符合校验规则";
        }
	}else if(idcard.length>0){
		msg="身份证号码不符合校验规则";			
	}	
    if(msg.length!=0){
    	alert(msg);
    	return false;
    }
    return true;
}
function isIDno(idcard) {
	    var Errors=new Array("验证通过!",
	                         "身份证号码位数不对!",
	                         "身份证号码出生日期超出范围或含有非法字符!",
	                         "身份证号码校验错误!",
	                         "身份证地区非法!"
	                        );
	  
	    var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
	    
	    var idcard,Y,JYM;
	    var S,M;
	    var idcard_array = new Array();
	    idcard_array = idcard.split("");
	    //地区检验
	    if(area[parseInt(idcard.substr(0,2))]==null) {
	         return false;
	    }
	    
	    //身份号码位数及格式检验
	    switch(idcard.length){
//	    case 15:
//	        //15位身份号码检测
//	        if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){	      
//	        	ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
//	        } else {
//	            ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
//	        }
//	        if(!ereg.test(idcard)) {
//	            return false;
//	        } else {
//	            return true;
//	        }
//	        break;
	    case 18:
	        //18位身份号码检测
	        //出生日期的合法性检查 
	        //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
	        //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
	        if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){
	            ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
	        } else {
	            ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
	        }
	        if(ereg.test(idcard)) { //测试出生日期的合法性
	            //计算校验位
	            S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
	            + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
	            + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
	            + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
	            + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
	            + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
	            + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
	            + parseInt(idcard_array[7]) * 1 
	            + parseInt(idcard_array[8]) * 6
	            + parseInt(idcard_array[9]) * 3 ;
	            Y = S % 11;
	            M = "F";
	            JYM = "10X98765432";
	            M = JYM.substr(Y,1);//判断校验位
	            if(M !== idcard_array[17]) {
	                return false;
	            }
	            return true;
	        } else {
	           return false;
	        } 
	        break;
	    default:
	        return false;
	        break;
	    }
	}
 
 
/************************** 身份证号合法性校验 E **************************/
 $(function () {
	$("form input").bind("change",function(){
		window.parent.vm.isEditted = true;
	});
	$("form textarea").bind("change",function(){
		window.parent.vm.isEditted = true;
	});
});
 function change() {
	 window.parent.vm.isEditted = true; 
 }
 function keyNumAll(evt){ 
	//兼容IE和Firefox获得keyBoardEvent对象 
	evt = (evt) ? evt : ((window.event) ? window.event : ""); 
	var key = evt.keyCode?evt.keyCode:evt.which;//兼容IE和Firefox获得keyBoardEvent对象的键值 
	if(key==8 || key==9 || key==37 || key==39) {
		return true;
	}
	var reg = /[\w\.\/]/;
	//alert(reg.test(String.fromCharCode(key)));
	return reg.test(String.fromCharCode(key));
} 
 
/*************************** 类型转换 B ***************************/
 
 /*************** map转json B ***************/
 function _strMapToObj(strMap){
    let obj= Object.create(null);
    for (let[k,v] of strMap) {
      obj[k] = v;
    }
    return obj;
  }
  /**
	 * map转换为json
	 */
 function _mapToJson(map) {
	  return JSON.stringify(this._strMapToObj(map));
  }
  
/*************** map转json E ***************/
/*************** json转map B ***************/
 function _objToStrMap(obj){
	  let strMap = new Map();
	  for (let k of Object.keys(obj)) {
	    strMap.set(k,obj[k]);
	  }
	  return strMap;
	}
 /**
  *json转换为map
  */
 function _jsonToMap(jsonStr){
    return this._objToStrMap(JSON.parse(jsonStr));
  }
 /*************** json转map E ***************/
/*************************** 类型转换 E ***************************/