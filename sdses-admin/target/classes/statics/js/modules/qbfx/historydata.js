window.onload = function() {
    try {
        CKEDITOR.replace('clueIntroEditor');
        CKEDITOR.replace('caseIntroEditor');
    } catch(e) {
        console.log(e.name + ": " + e.message);
    }
    initPage();
};

/**
 * 初始化页面
 */
function initPage() {
    vm.dateDefind();
    /*$("body").click(function(e) {
        e.stopImmediatePropagation();
    });*/
    // 页面参数
    var params = self.frameElement.getAttribute('params');
    if (params != 'undefined' && params != 'null') {
        var paramArr = params.split('-');
        // 新增
        if (paramArr[0] == 'A') {
        	vm.operationType = 'A';	//操作类型 V:查看 U:修改 A:新增,
            if (paramArr[1] == '0') { // 新增线索
                vm.addClue();
            } else {
                vm.addCase();
            }
        }
        // 查看
        else if (paramArr[0] == 'V') {
        	vm.operationType = 'V';	//操作类型 V:查看 U:修改 A:新增,
            vm.queryOrUpdateIntelligenceInfo(paramArr[1], 0);
            // CKEDITOR.instances.clueIntroEditor.setData("111111111111111111111");
        }
        // 修改
        else if (paramArr[0] == 'U') {
        	vm.operationType = 'U';	//操作类型 V:查看 U:修改 A:新增,
            vm.queryOrUpdateIntelligenceInfo(paramArr[1], 1);
        }
    } else {
        vm.loadingTable();
    }
}

var ajax; // ajax对象
// 用户信息
var user = window.parent.vm.user;
// 组织树
var ztree;
// 机构组织树配置
var Setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url: "nourl"
        }
    },
    callback: {
        onClick: function(e, treeId, treeNode, clickFlag) {
            ztree.checkNode(treeNode, !treeNode.checked, true);
        }
    }
};
// 人员复选框组织树配置
var checkboxSetting = {
    check: {
        enable: true
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url: "nourl"
        }
    },
    callback: {
        onClick: function(e, treeId, treeNode, clickFlag) {
            ztree.checkNode(treeNode, !treeNode.checked, true);
        }
    }
};

// 导出word文档
function exportWord(intelligenceId) {
    var url = baseURL + "qbfx/exportToWord/exportWord?intelligenceId=" + intelligenceId;
    window.location.href = url;
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

var vm = new Vue({
    el: '#rrapp',
    data: {
        showPage: null, // 0：列表；1：新增线索；2：新增案件
        operationType: 'V',	//操作类型 V:查看 U:修改 A:新增,
        title: "",
        optType: "add",
        // 查询类型 0：全文检索；1：高级查询 【默认：0】
        searchType: '0',
        // 切换按钮文字展示
        changeSearchButtonText: "高级查询",
        // 查询条件
        searchParams: {
            searchInfo: '',
            title: '',
            intro: '',
            createDeptName: "",
            deptId: ""
        },
        // 状态列表
        stateDictList: {},
        // 情报种类列表
        typeDictList: {},
        // 情报类型列表
        kindDictList: {},
        // 情报发生地
        placeDictList: {},
        // 语种
        languageDictList: {},
        // 打击处理情况
        combatSituationList: {},
        // 审核意见
        auditSuggestionList: {},
        // 性别
        sexList: {},
        intelligence: {},
        // 接收人
        receiveUserNames: "",
        // 涉案人员
        casePerson: {},
        // 线索附件
        clueFileUpload: {},
        // 审核人
        transfer: {},
        // 盯办人
        stare: {},
        // 侦办人
        investigatorNames: "",
        // 案件日志
        caseLog: {},
        // 案件附件
        caseFileUpload: {},
        // 弹窗选择用户数据
        selectUsers: [],
        selectUsers2: [],
        // 弹窗选择组织机构
        selectDept: [],
        // 查询条件-关联情报弹出页面
        relationSearchParams: {},
        // 盯办人
        stareUserNames: "",
        globalDateTimePickerId: "",
        isShowUserTreeDisable: false,
        // 主标题
        titleMain: '',
        checkIn: {},
        // 输入框不可用
        inputDisabled: false,
        personSearchParams: {},
        // 新增涉案人员 弹出框查询参数
        disableIntroHandler: false,
        // 自动识别 按钮不可用
        isButtonDisable: false,

        showRightPanel: false,
        //是否显示右侧面板
        rightRanelParam: "",
        //右侧面板查询参数
        rightSearchResult: null,
        rightSearchType: 0,	//0：全文检索；1：关键字检索
        //右侧查询返回结果	1:没有查询条件；2:没有查询结果；3：返回查询结果
        rightSearchList: {}, //串并分析查询结果
        showTransferType: 0,	//弹出框 默认进行流转操作；	0：流转；1: 确认办结
        pageNum:1,                  //串并分析页码
		totalPage:1,                //串并分析结果页码数
		analysisType:0           //串并分析参数来源  0：面板查询框，1：自动识别
    },
    created: function() {},
    methods: {
        /**
				 * ********************************* 多窗口操作 B
				 * **********************************
				 */
        /**
				 * 初始化页面
				 */
        initPage: function() {
            this.dateDefind();
           /* $("body").click(function(e) {
                e.stopImmediatePropagation();
                var classNames = e.target.className;
                if (!classNames || classNames == "" || classNames.indexOf("datetimepicker") < 0) {
                    $("#" + vm.globalDateTimePickerId).datetimepicker("hide");
                }
            });*/
            // 页面参数
            var params = self.frameElement.getAttribute('params');
            if (params != 'undefined' && params != 'null') {
                var paramArr = params.split('-');
                // 新增
                if (paramArr[0] == 'A') {
                    if (paramArr[1] == '0') { // 新增线索
                        this.addClue();
                    } else {
                        this.addCase();
                    }
                }
                // 修改
                else if (paramArr[0] == 'U') {
                    edit(paramArr[1]);
                }
                // 查看
                else if (paramArr[0] == 'V') {
                    view(paramArr[1]);
                }
            } else {
                this.loadingTable();
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
        /**
				 * 页面跳转（打开多页面）
				 */
        jumpPage: function(type_id) {
            var title = null;
            var paramArr = type_id.split('-');
            /**
					 * 判断数据是否被处理
					 */
            if (paramArr[0] == 'A') {
                // 新增
                if (paramArr[1] == '0') { // 线索
                    title = '历史数据-线索';
                } else { // 案件
                    title = '历史数据-案件';
                }
            }else {
				var entityNow = vm.getInfo(paramArr[1]);
	            if(!entityNow || entityNow.state == 6){
					alert('数据已被删除，无法操作！');
					$("#jqGrid").trigger("reloadGrid");
					return;
				}
			}
            // 当前页面 url （与数据库中统一）
            var url = self.frameElement.getAttribute('src');
            window.parent.goNext(url, type_id, title);
        },
        /**
				 * 关闭按钮 关闭页面
				 */
        closePage: function() {
            var iframeId = self.frameElement.getAttribute('id');
            window.parent.closeIframe(iframeId);
        },
        /**
				 * 关闭按钮 关闭页面 调用 父页面 带确认框的方法
				 */
        closePageWithConfirm: function() {
            var iframeId = self.frameElement.getAttribute('id');
            window.parent.closeIframeWithConfirm(iframeId, 1);
        },
        /**
				 * 切换页面 关闭当前页面，跳转到主页面
				 */
        switchPage: function() {
            // 1、主页面为 打开状态， 更新主页面表格数据
            if (window.parent.frames[self.frameElement.getAttribute('fatherId')] != undefined) {
                window.parent.frames[self.frameElement.getAttribute('fatherId')].window.vm.query();
            }
            // 2、跳转到主页面
            var url = self.frameElement.getAttribute('src');
            window.parent.goNext(url);
            // window.parent.document.getElementById(self.frameElement.getAttribute('fatherId')).window.vm.query();
            // 3、关闭当前页面
            vm.closePage();
        },
        /**
				 * ********************************* 多窗口操作 E
				 * **********************************
				 */
        /**
				 * 加载字典值
				 */
        loadingDict: function() {
            var dictListMap = window.parent.vm.dictListMap;
            this.typeDictList = dictListMap.get('intelligenceType'); // 情报种类
            this.kindDictList = dictListMap.get('intelligenceKind'); // 情报类型
            this.placeDictList = dictListMap.get('intelligencePlace'); // 情报发生地
            this.languageDictList = dictListMap.get('intelligenceLanguage'); // 语种
            this.combatSituationList = dictListMap.get('doneType'); // 打击处理情况
            this.auditSuggestionList = dictListMap.get('auditType'); // 审核意见
            this.sexList = dictListMap.get('sex'); // 性别
            this.stateDictList = dictListMap.get('intelligenceState'); // 状态
        },
        /**
				 * 加载表格
				 */
        loadingTable: function() {
            $("#jqGrid").jqGrid({
                url: baseURL + 'qbfx/intelligence/list/51',
                datatype: "json",
                colModel: [{
                    label: '序号',
                    hidden: true,
                    name: 'intelligenceId',
                    index: 'intelligence_id',
                    key: true
                },
                {
                    label: '标题',
                    sortable: false,
                    name: 'title',
                    index: 'title',
                    width: 180,
                    formatter: function(value, grid, row, state) {
                        var titleMainTable = '';
						if(row.titleMain != null && row.titleMain.length > 0){
							titleMainTable = '《' + row.titleMain + '》';
						}
		   				var str = '<a style="cursor: pointer" onclick="vm.jumpPage(\'V-' + row.intelligenceId +'\')">'+ titleMainTable + value +'</a>';
		   				return str;
                    }
                },
                {
                    label: '情报种类',
                    align: 'center',
                    name: 'intelligenceType',
                    index: 'intelligence_type',
                    width: 60,
                    formatter: function(value, options, row) {
                        for (var i = 0; i < vm.typeDictList.length; i++) {
                            if (vm.typeDictList[i].code == value) {
                                return vm.typeDictList[i].value;
                            }
                        }
                        return value;
                    }
                },
                {
                    label: '情报类型',
                    align: 'center',
                    name: 'intelligenceKind',
                    index: 'intelligence_kind',
                    width: 50,
                    formatter: function(value, options, row) {
                        for (var i = 0; i < vm.kindDictList.length; i++) {
                            if (vm.kindDictList[i].code == value) {
                                return vm.kindDictList[i].value;
                            }
                        }
                        return value;
                    }
                },
                {
                    label: '发起时间',
                    align: 'center',
                    name: 'launchTime',
                    index: 'launch_time',
                    width: 95,
                    formatter: "date",
                    formatoptions: {
                        srcformat: 'Y-m-d H:i:s',
                        newformat: 'Y-m-d H:i:s'
                    }
                },
                {
                    label: '状态',
                    align: 'center',
                    name: 'state',
                    index: 'state',
                    width: 40,
                    formatter: function(value, options, row) {
                        var str = vm.stateDictList[value].value
                        if (row.state == '3') {
                            str = '<span style="color:red">' + str + '</span>';
                        }
                        return str;
                    }
                },
                { label: '战果', sortable: false, name: 'victory', index: 'victory', width: 120, formatter: function(value, options, row){
					if(value != null){
						return '<span style="color:red">' + value + '</span>';
					} else {
						return '';
					}
				}},
                {
                    label: '操作',
                    align: 'center',
                    name: 'state',
                    index: 'state',
                    width: 120,
                    formatter: function(value, grid, row, state) {
                        var str = "";
                        if (row.operation.allowView) {
                            str += '<a style="cursor: pointer" title="查看" onclick="vm.jumpPage(\'V-' + row.intelligenceId + '\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
                        }
                        if (row.operation.allowEdit) {
                            str += '<a style="cursor: pointer" title="修改" onclick="vm.jumpPage(\'U-' + row.intelligenceId + '\')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
                        }
                        if (row.operation.allowDelete) {
                            str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteIntelligenceById(' + row.intelligenceId + ')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
                        }
                        if (row.operation.allowExport) {
                            str += '<a style="cursor: pointer" title="导出" onclick="exportWord(' + row.intelligenceId + ')"><span class="glyphicon glyphicon-save" aria-hidden="true"></span></a>';
                        }
                        return str;
                    }
                },
                {
                    label: '删除权限',
                    sortable: false,
                    name: 'operation.allowDelete',
                    index: 'operation.allowDelete',
                    hidden: true
                }],
                cellEdit: false,
                sortable: true,
                viewrecords: true,
                height: 370,
                rowNum: 10,
                rowList: [10, 30, 50],
                rownumbers: true,
                rownumWidth: 25,
                autowidth: true,
                multiselect: true,
                pager: "#jqGridPager",
                jsonReader: {
                    root: "page.list",
                    page: "page.currPage",
                    total: "page.totalPage",
                    records: "page.totalCount"
                },
                prmNames: {
                    page: "page",
                    rows: "limit",
                    order: "order"
                },
                gridComplete: function() {
                    // 隐藏grid底部滚动条
                    $("#jqGrid").closest(".ui-jqgrid-bdiv").css({
                        "overflow-x": "auto"
                    });
                },
                postData: {
                    searchType: '0',
                    createType: '1'
                }
            });
        },
        // 批量导出
        batchExportWord: function(event) {
            var intelligenceIds = getSelectedRows();
            if (intelligenceIds == null) {
                return;
            }
            var intelligenceIdStr = JSON.stringify(intelligenceIds);
            intelligenceIdStr = intelligenceIdStr.replace("[", "");
            intelligenceIdStr = intelligenceIdStr.replace("]", "");
            for (var j = 0; j <= intelligenceIdStr.length; j++) {
                if (intelligenceIdStr.charAt(j) == '"') {
                    intelligenceIdStr = intelligenceIdStr.replace('"', "");
                }
            }
            var url = baseURL + "qbfx/exportToWord/batchExportWord?intelligenceIds=" + intelligenceIdStr;
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
        exportWordWithoutParam: function() {
            if (vm.intelligence.intelligenceId != "") {
                exportWord(vm.intelligence.intelligenceId);
            }
        },
        // 切换查询类型（全文检索、高级查询）
        changeSearchType: function() {
            // 当前为“全文检索”，切换为“高级查询”
            vm.searchType = (vm.searchType == '0' ? '1': '0');
            vm.changeSearchButtonText = (vm.searchType == '0' ? '高级查询': '全文检索');
            // 初始化查询条件
            // vm.searchParams = {createDeptName:"",deptId:""};
        },
        // 重置查询条件
        resetSearch: function() {
            $("#TimePicker").val("");
            vm.searchParams = {
                searchInfo: '',
                title: '',
                intro: '',
                createDeptName: "",
                deptId: ""
            };
            // 查询除原来的传递参数，并逐个清空 B
            var postData1 = $("#jqGrid").jqGrid("getGridParam", "postData");
            delete postData1["title"];
            delete postData1["intro"];
            delete postData1["intelligenceKind"];
            delete postData1["intelligenceType"];
            delete postData1["launchTimeB"];
            delete postData1["language"];
            delete postData1["deptId"];
            // delete postData1["state"];
            delete postData1["searchInfo"];
            // 查询除原来的传递参数，并逐个清空 E
            // 传递新的查询参数
            $("#jq").jqGrid("setGridParam", {
                postData: postData1
            });
        },
        // 查询
        query: function() {
            vm.reload(1);
        },
        queryRelatedIntelligence: function() {
            var page = $("#jqGridRelatedIntellegence").jqGrid('getGridParam', 'page');
            $("#jqGridRelatedIntellegence").jqGrid('setGridParam', {
                postData: vm.relationSearchParams,
                page: page
            }).trigger("reloadGrid");
        },
        // 刷新表格
        reload: function(pageNum) {
            // createType 0：情报研判；1：历史数据
            vm.searchParams.createType = 1;
            vm.searchParams.searchType = vm.searchType;
            // vm.searchParams.status = 2;
            vm.showPage = 0;
            var timePicker = $("#TimePicker").val().split(" - ");
			var beginTime=timePicker[0];
			
			var endTime=timePicker[1];
            if (beginTime != "" && endTime != "") {
                if (beginTime > endTime) {
                    alert("起始时间应该小于截止时间");
                    return;
                }
            }
            if (beginTime != "") {
                vm.searchParams.launchTimeB = beginTime;
            }
            if (endTime != "") {
                vm.searchParams.launchTimeE = endTime;
            }
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            if (pageNum != null && pageNum != undefined) {
                page = 1;
            }
            $("#jqGrid").jqGrid('setGridParam', {
                postData: vm.searchParams,
                page: page
            }).trigger("reloadGrid");
        },
        back: function() {
            // if(vm.showPage==1){
            // if( vm.receiveUserNames != "" || vm.stareUserNames != ""
            // ){
            // window.parent.vm.isEditted = true;
            // }
            // }else if(vm.showPage==2){
            // if(vm.investigatorNames != ""){
            // window.parent.vm.isEditted = true;
            // }
            // }
            if (window.parent.vm.isEditted) {
                confirm('页面尚未保存，您确定要离开页面吗？',
                function() {
                    if (vm.showPage == 1) {
//                        $("#cluedatetimepicker").datetimepicker("hide");
                        // CKEDITOR.instances.clueIntroEditor.setData('');
                        CKEDITOR.instances.clueIntroEditor.setReadOnly(false);
                    } else if (vm.showPage == 2) {
//                        $("#casedatetimepicker").datetimepicker("hide");
                        CKEDITOR.instances.caseIntroEditor.setData('');
                        CKEDITOR.instances.caseIntroEditor.setReadOnly(false);
                    }
                    layer.closeAll();
                    vm.reload();
                    window.parent.vm.isEditted = false;
                });
            } else {
                if (vm.showPage == 1) {
//                    $("#cluedatetimepicker").datetimepicker("hide");
                    // CKEDITOR.instances.clueIntroEditor.setData('');
                    CKEDITOR.instances.clueIntroEditor.setReadOnly(false);
                } else if (vm.showPage == 2) {
//                    $("#casedatetimepicker").datetimepicker("hide");
                    CKEDITOR.instances.caseIntroEditor.setData('');
                    CKEDITOR.instances.caseIntroEditor.setReadOnly(false);
                }
                layer.closeAll();
                vm.reload();
            }
        },
        // 批量删除情报
        deleteIntelligenceBatch: function(event) {
            var intelligenceIds = getSelectedRows();
            if (intelligenceIds == null) {
                return;
            }
            var deleteIdArray = ("" + intelligenceIds).split(",");
            var resultStr = ""
            for (var i = 0; i < deleteIdArray.length; i++) {
                var rowData = $("#jqGrid").getRowData(deleteIdArray[i]);
                // console.log("表格数据>>>>>>"+ rowData.title);
                if (rowData["operation.allowDelete"] == "false") {
                    resultStr += "【" + rowData.title + "】"
                }
            }
            if (resultStr != "") {
                alert("您对" + resultStr + "不具有删除权限，请重新选择");
                return;
            }
            confirm('确定要删除选中的记录？',
            function() {
                $.ajax({
                    type: "POST",
                    url: baseURL + "qbfx/intelligence/delete",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(intelligenceIds),
                    success: function(r) {
                        if (r.code == 0) {
                            alert('操作成功',
                            function(index) {
                                //$("#jqGrid").trigger("reloadGrid");
                                vm.delReload(intelligenceIds, $("#jqGrid"));
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        // 根据Id删除单个情报
        deleteIntelligenceById: function(intelligenceId) {
            confirm('确定要删除选中的记录？',
            function() {
                $.ajax({
                    type: "POST",
                    url: baseURL + "qbfx/intelligence/delete",
                    contentType: "application/json;charset=utf-8",
                    data: '["' + intelligenceId + '"]',
                    success: function(r) {
                        if (r.code == 0) {
                            alert('操作成功',
                            function(index) {
                                //$("#jqGrid").trigger("reloadGrid");
                                vm.delReload([intelligenceId], $("#jqGrid"));
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        /**
				 * 删除刷新页
				 */
        delReload: function(ids, jqGrid) {
            var gridIds = jqGrid.jqGrid('getDataIDs');
            if (ids.sort().toString() == gridIds.sort().toString() //删除当前页全部数据
            && $(".ui-pg-input").val() == $("#sp_1_jqGridPager").html() //当前页为最后一页
            && $("#sp_1_jqGridPager").html() != '1') { //当期页不是第一页
                var page = jqGrid.jqGrid('getGridParam', 'page');
                jqGrid.jqGrid('setGridParam', {
                    page: page - 1
                }).trigger("reloadGrid");
            } else {
                jqGrid.trigger("reloadGrid");
            }
        },
        // 设置是否可以编辑
        setIsEnableEdit: function(flag) {
            if (vm.optType == "add" || vm.optType == "update") {
                if (flag == "0") { // 线索
                    $("#clueForm :input").not("a[type='button'],#clueIntelligenceKind").removeAttr("disabled");
                    $("#casePersonModal :input").removeAttr("disabled");
                    $("#stareModal :input").removeAttr("disabled");
                    $("#auditModal :input").removeAttr("disabled");
                    $("#secondAuditModal :input").removeAttr("disabled");
                } else if (flag == "1") { // 案件
                    $("#caseForm :input").not("a[type='button'],#caseIntelligenceKind").removeAttr("disabled");
                    $("#caseLogModal :input").removeAttr("disabled");
                }
            } else if (vm.optType == "query") {
                if (flag == "0") { // 线索
                    $("#clueForm :input").not("a[type='button'],#receiveUserNames,#stareUserNames").attr("disabled", "disabled");
                    $("#casePersonModal :input").attr("disabled", "disabled");
                    $("#stareModal :input").attr("disabled", "disabled");
                    $("#auditModal :input").not("#transferUserNames").attr("disabled", "disabled");
                    $("#secondAuditModal :input").attr("disabled", "disabled");
                    $(".searchbar-long input").removeAttr("disabled");
                } else if (flag == "1") { // 案件
                    $("#caseForm :input").not("a[type='button'],#investigatorNames").attr("disabled", "disabled");
                    $("#caseLogModal :input").attr("disabled", "disabled");
                }
            }
        },
        // 查看或修改情报
        queryOrUpdateIntelligenceInfo: function(intelligenceId, flag) {
            $.ajaxSettings.async = false;
            var intelligenceKind;
            $.get(baseURL + "qbfx/intelligence/info/" + intelligenceId + "/51",
            function(r) {
                vm.intelligence = r.intelligence;
                intelligenceKind = vm.intelligence.intelligenceKind;
                // console.log("【历史数据】获取情报信息>>>>>>"+JSON.stringify(r.intelligence));
                // 期号大于0,有主标题
                if (vm.intelligence.issue != null && vm.intelligence.issue > 0) {
                    var kindName = '';
                    for (var i = 0; i < vm.kindDictList.length; i++) {
                        if (vm.kindDictList[i].code == vm.intelligence.intelligenceKind) {
                            kindName = vm.kindDictList[i].value;
                            break;
                        }
                    }
                    vm.titleMain = vm.intelligence.titleMain;
                } else {
                    vm.titleMain = null;
                }
                if (flag == "0") { // 查看
                    window.parent.vm.isEditted = false;
                    vm.optType = "query";
                    if (intelligenceKind != 1) {
                        vm.title = "线索查看";
                        vm.inputDisabled = true;
                        // CKEDITOR.instances.clueIntroEditor.setReadOnly(true);
                        CKEDITOR.instances.clueIntroEditor.setData(vm.intelligence.intro);
                        vm.initClueTables();
                        $("#casePersonTable").bootstrapTable('hideColumn', 'checkBox');
                        $("#casePersonTable").bootstrapTable('hideColumn', 'source');
                        $("#starePersonTable").bootstrapTable('hideColumn', 'checkBox');
                        $("#auditPersonTable").bootstrapTable('hideColumn', 'checkBox');
                        $("#secondAuditTable").bootstrapTable('hideColumn', 'checkBox');
                        $("#clueFileUploadTable").bootstrapTable('hideColumn', 'checkBox');
                        /** 手动关联 注释 
                        $("#relatedIntelligenceTable").bootstrapTable('hideColumn', 'checkBox');
                        **/
                        //串并分析查询
                        vm.personAnalysis(1,1);
                    } else {
                        vm.title = "案件查看";
                        // CKEDITOR.instances.caseIntroEditor.setReadOnly(true);
                        CKEDITOR.instances.caseIntroEditor.setData(vm.intelligence.intro);
                        vm.initCaseTables();
                        $("#caseLogTable").bootstrapTable('hideColumn', 'checkBox');
                        $("#caseFileUploadTable").bootstrapTable('hideColumn', 'checkBox');
                    }
                } else if (flag == "1") { // 修改
                    window.parent.vm.isEditted = true;
                    vm.optType = "update";
                    if (intelligenceKind != 1) {
                        vm.title = "线索修改";
                        vm.inputDisabled = false;
                        // CKEDITOR.instances.clueIntroEditor.setReadOnly(false);
                        CKEDITOR.instances.clueIntroEditor.setData(vm.intelligence.intro);
                        vm.intelligence.deletePersonIds = [];
                        vm.intelligence.deleteTransferIds = [];
                        vm.intelligence.deleteStareIds = [];
                        vm.intelligence.deleteCheckIds = [];
                        vm.initClueTables();
                        $("#casePersonTable").bootstrapTable('showColumn', 'checkBox');
                        $("#starePersonTable").bootstrapTable('showColumn', 'checkBox');
                        $("#auditPersonTable").bootstrapTable('showColumn', 'checkBox');
                        $("#secondAuditTable").bootstrapTable('showColumn', 'checkBox');
                        $("#clueFileUploadTable").bootstrapTable('showColumn', 'checkBox');
                        /** 手动关联 注释 
                        $("#relatedIntelligenceTable").bootstrapTable('showColumn', 'checkBox');
                        **/
                        //串并分析查询
                        vm.personAnalysis(1,1);
                    } else {
                        vm.title = "案件修改";
                        // CKEDITOR.instances.caseIntroEditor.setReadOnly(false);
                        CKEDITOR.instances.caseIntroEditor.setData(vm.intelligence.intro);
                        vm.intelligence.deleteCaseLogIds = [];
                        vm.initCaseTables();
                        $("#caseLogTable").bootstrapTable('showColumn', 'checkBox');
                        $("#caseFileUploadTable").bootstrapTable('showColumn', 'checkBox');
                    }
                    vm.intelligence.deleteFileIds = [];
                }
                if (intelligenceKind != 1) { // 线索
                    vm.showPage = 1;
                    vm.setIsEnableEdit("0");

                    $("#cluedatetimepicker").val(vm.intelligence.launchTime);

                    vm.receiveUserNames = ""; // 接收人
                    vm.intelligence.receiveUserIds = [];
                    if (vm.intelligence.receiveUserList && vm.intelligence.receiveUserList.length > 0) {
                        var userId;
                        for (var i = 0; i < vm.intelligence.receiveUserList.length; i++) {
                            userId = vm.intelligence.receiveUserList[i].userId;
                            // for(var j=0;
                            // j<vm.selectUsers.length;
                            // j++){
                            // if(vm.selectUsers[j].deptId
                            // == userId){
                            // vm.receiveUserNames =
                            // vm.receiveUserNames +
                            // vm.selectUsers[j].name +
                            // ";";
                            // vm.intelligence.receiveUserIds.push(userId);
                            // }
                            // }
                            vm.receiveUserNames = vm.receiveUserNames + vm.intelligence.receiveUserList[i].realname + ";";
                            vm.intelligence.receiveUserIds.push(userId);
                        }
                    }
                    vm.stareUserNames = ""; // 盯办人
                    vm.intelligence.stareUserIds = [];
                    if (vm.intelligence.stareUserList && vm.intelligence.stareUserList.length > 0) {
                        var userId;
                        for (var i = 0; i < vm.intelligence.stareUserList.length; i++) {
                            userId = vm.intelligence.stareUserList[i].userId;
                            // for(var j=0;
                            // j<vm.selectUsers.length;
                            // j++){
                            // if(vm.selectUsers[j].deptId
                            // == userId){
                            // vm.stareUserNames =
                            // vm.stareUserNames +
                            // vm.selectUsers[j].name +
                            // ";";
                            // vm.intelligence.stareUserIds.push(userId);
                            // }
                            // }
                            vm.stareUserNames = vm.stareUserNames + vm.intelligence.stareUserList[i].realname + ";";
                            vm.intelligence.stareUserIds.push(userId);
                        }
                    }
                    if (vm.intelligence.stareList && vm.intelligence.stareList.length > 0) { // 盯办信息
                        $('#starePersonTable').bootstrapTable('append', vm.intelligence.stareList);
                    }
                    if (vm.intelligence.transferList && vm.intelligence.transferList.length > 0) { // 审核信息
                        var userId;
                        for (var i = 0; i < vm.intelligence.transferList.length; i++) {
                            userId = vm.intelligence.transferList[i].userId;
                            for (var j = 0; j < vm.selectUsers.length; j++) {
                                if (vm.selectUsers[j].deptId == userId) {
                                    for (var m = 0; m < vm.selectUsers.length; m++) {
                                        if (vm.selectUsers[j].parentId == vm.selectUsers[m].deptId) {
                                            vm.intelligence.transferList[i].auditDept = vm.selectUsers[m].name;
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            var intelligenceUserList = vm.intelligence.transferList[i].intelligenceUserList;
                            if (intelligenceUserList && intelligenceUserList.length > 0) {
                                vm.intelligence.transferList[i].transferUserNames = "";
                                vm.intelligence.transferList[i].intelligenceUserIds = [];
                                for (var k = 0; k < intelligenceUserList.length; k++) {
                                    vm.intelligence.transferList[i].transferUserNames = vm.intelligence.transferList[i].transferUserNames + intelligenceUserList[k].realname + ";";
                                    vm.intelligence.transferList[i].intelligenceUserIds.push(intelligenceUserList[k].userId);
                                }
                            }
                            $('#auditPersonTable').bootstrapTable('append', vm.intelligence.transferList[i]);
                        }
                    }
                    // 二次核查列表
                    if (vm.intelligence.checkList != null && vm.intelligence.checkList.length > 0) {
                        vm.showCheckTable = true;
                        $("#secondAuditTable").bootstrapTable('append', vm.intelligence.checkList);
                    } else {
                        vm.showCheckTable = false;
                    }
                    if (vm.intelligence.personList && vm.intelligence.personList.length > 0) { // 涉案人员
                        $('#casePersonTable').bootstrapTable('append', vm.intelligence.personList);
                    }
                    /** 手动关联 注释 
                    if (vm.intelligence.manualIntelligenceList && vm.intelligence.manualIntelligenceList.length > 0) { // 关联情报
                        for (var i = 0; i < vm.intelligence.manualIntelligenceList.length; i++) {
                            vm.intelligence.manualIntelligenceList[i].intelligenceId2 = vm.intelligence.manualIntelligenceList[i].intelligenceId;
                            $('#relatedIntelligenceTable').bootstrapTable('append', vm.intelligence.manualIntelligenceList[i]);
                        }
                    }
                    **/
                    if (vm.intelligence.fileList && vm.intelligence.fileList.length > 0) { // 附件
                        $('#clueFileUploadTable').bootstrapTable('append', vm.intelligence.fileList);
                    }

                } else { // 案件
                    vm.showPage = 2;
                    vm.setIsEnableEdit("1");

                    $("#casedatetimepicker").val(vm.intelligence.launchTime);

                    vm.investigatorNames = "";
                    vm.intelligence.receiveUserIds = [];
                    if (vm.intelligence.receiveUserList && vm.intelligence.receiveUserList.length > 0) {
                        var userId;
                        for (var i = 0; i < vm.intelligence.receiveUserList.length; i++) {
                            userId = vm.intelligence.receiveUserList[i].userId;
                            for (var j = 0; j < vm.selectUsers.length; j++) {
                                if (vm.selectUsers[j].deptId == userId) {
                                    vm.investigatorNames = vm.investigatorNames + vm.selectUsers[j].name + ";";
                                    vm.intelligence.receiveUserIds.push(userId);
                                }
                            }
                        }
                    }

                    if (vm.intelligence.caseLogList && vm.intelligence.caseLogList.length > 0) { // 案件日志
                        $('#caseLogTable').bootstrapTable('append', vm.intelligence.caseLogList);
                    }
                    if (vm.intelligence.fileList && vm.intelligence.fileList.length > 0) { // 附件
                        $('#caseFileUploadTable').bootstrapTable('append', vm.intelligence.fileList);
                    }
                }
            });
            $.ajaxSettings.async = true;
        },
        // 初始化情报对象
        initGlobalIntelligence: function() {
            this.intelligence = {
                intelligenceId: "",
                // 主键ID
                title: "",
                // 标题
                intro: "",
                // 内容
                intelligenceType: "",
                // 情报种类
                intelligenceKind: "",
                // 情报类型（线索、案件）
                language: "",
                // 语种
                place: "",
                // 情报发生地
                launchTime: "",
                // 发起时间（提案时间）
                state: "5",
                // 状态
                result: "",
                // 打击处理情况（参照字典表：查否、批评教育、收押、收教、刑拘、遣返、日常管控、有价）
                createUserId: user.userId,
                // 发起人Id
                createUserName: user.realname,
                // 发起人
                deptId: user.deptId,
                // 发起单位Id
                createDeptName: user.deptName,
                // 发起单位
                createType: "1",
                // 创建类型：（0：情报研判模块；1：历史数据模块）
                handleNum: "0",
                // 处理数据
                personList: [],
                // 涉案人员列表
                fileList: [],
                // 附件列表
                stareUserIds: [],
                // 盯办人编号列表
                transferList: [],
                // 流转列表(审核信息)
                stareList: [],
                // 盯办列表
                caseLogList: [],
                // 案件日志列表
                manualIntelligenceList: [],
                // 手动关联情报列表
                relationList: [],
                // 情报-情报关系列表
                intelligenceUserList: [],
                // 情报-员工关系列表(流转人)
                receiveUserIds: [],
                // 接收人编号列表（新增、修改使用）
                deleteTransferIds: [],
                // 需要删除的审核信息id列表
                deleteStareIds: [],
                // 需要删除的盯办id列表
                deletePersonIds: [],
                // 需要删除的涉案人员id列表
                deleteCaseLogIds: [],
                // 需要删除的案件日志id列表
                deleteFileIds: [],
                // 需要删除的文件id列表
                checkList: [],
                // 二次核查列表
                deleteCheckIds: []
                // 需要删除的二次核查的id列表
            };

            this.receiveUserNames = "";
            this.investigatorNames = "";
            this.stareUserNames = "";
        },
        // 初始化涉案人员
        initGlobalCasePerson: function() {
            vm.casePerson = {
                personId: "",
                name: "",
                sex: "",
                nation: "",
                numId: "",
                numPhone: "",
                numNetwork: "",
                placeHome: "",
                placeActive: ""
            };
        },
        // 初始化盯办人信息
        initGlobalStare: function() {
            vm.stare = {
                stareId: "",
                // 主键
                intelligenceId: "",
                // 情报id
                userId: "",
                // 盯办人id
                username: "",
                // 盯办人姓名
                matter: "",
                // 盯办事项
                createTime: "" // 盯办时间
            };
        },
        // 初始化审核信息
        initGlobalTransfer: function() {
            vm.transfer = { // 流转信息（审核）
                transferId: "",// 主键
                intelligenceId: "", // 情报id
                userId: "",// 审核人id
                username: "",// 审核人名称
                opinion: "",// 审核意见,参照字典表(有价、关注、管控、经营、收押)
                demand: "",// 工作要求
                auditTime: "", // 审核时间
                intelligenceUserList: [],// 流转人
                intelligenceUserIds: [], // 流转人编号列表
                transferUserNames: "" // 用于页面显示
            };
        },
        // 初始化二次核查信息
        initSecondAudit: function() {
            vm.checkIn = {
                checkId: "",
                intelligenceId: "",
                userId: "",
                username: "",
                createTime: "",
                content: ''
            }
        },
        // 初始化线索附件
        initGlobalClueFileUpload: function() {
            vm.clueFileUpload = {
                fileId: "",
                intelligenceId: "",
                userId: user.userId,
                name: "",
                path: "",
                type: "",
                state: "1",
                uploadTime: ""
            };
        },
        // 初始化案件日志
        initGlobalCaseLog: function() {
            vm.caseLog = {
                logId: "",
                intro: "",
                createTime: ""
            };
        },
        // 初始化案件附件
        initGlobalCaseFileUpload: function() {
            vm.caseFileUpload = {
                fileId: "",
                intelligenceId: "",
                userId: user.userId,
                name: "",
                path: "",
                type: "",
                state: "1",
                uploadTime: ""
            };
        },
        // 初始化涉案人员表格
        initCasePersonTable: function() {
            $('#casePersonTable').bootstrapTable({
                locale: "zh-CN",
                // clickToSelect: true,
                uniqueId: "personId",
                columns: [{
                    field: 'checkBox',
                    checkbox: true,
                    visible: true
                },
                {
                    field: 'name',
                    title: '姓名',
                    width: '10%',
                    align: 'center',
                    formatter: this.promptFormatter
                },
                {
                    field: 'nickname',
                    title: '昵称',
                    width: '10%',
                    align: 'center'
                },
                {
                    field: 'sex',
                    title: '性别',
                    formatter: this.sexFormatter,
                    width: '6%',
                    align: 'center'
                },
                {
                    field: 'nation',
                    title: '族别',
                    width: '10%',
                    align: 'center'
                },
                {
                    field: 'numId',
                    title: '身份证号',
                    width: '18%',
                    align: 'center'
                },
                // {
                // field: 'numPhone',
                // title: '手机号',
                // width: '12%',
                // align: 'center'
                // }, {
                // field: 'numNetwork',
                // title: '网络账号',
                // width: '12%',
                // align: 'center'
                // },
                {
                    field: 'placeHome',
                    title: '户籍地',
                    width: '28%',
                    align: 'center'
                },
                // {
                // field: 'placeActive',
                // title: '活动地',
                // width: '12%',
                // align: 'center'
                // },
                {
                    field: 'source',
                    title: '来源',
                    width: '10%',
                    align: 'center',
                    formatter: this.personSourceFormatter
                },
                {
                    field: 'personId',
                    title: '操作',
                    formatter: this.casePersonFormatter,
                    align: 'center',
                    width: '8%'
                }],
                data: []
            });
        },
        // 初始化盯办表格
        initStarePersonTable: function() {
            $('#starePersonTable').bootstrapTable({
                locale: "zh-CN",
                // clickToSelect: true,
                uniqueId: "stareId",
                columns: [{
                    field: 'checkBox',
                    checkbox: true,
                    visible: true
                },
                {
                    field: 'matter',
                    title: '盯办事项',
                    width: '60%'
                },
                {
                    field: 'username',
                    title: '盯办人',
                    width: '15%',
                    align: 'center'
                },
                {
                    field: 'createTime',
                    title: '盯办时间',
                    width: '15%',
                    align: 'center',
                    formatter: this.dateFormatter
                },
                {
                    field: 'stareId',
                    title: '操作',
                    visible: true,
                    formatter: this.stareFormatter,
                    align: 'center',
                    width: '10%'
                }],
                data: []
            });
        },
        // 初始化审核表格
        initAuditPersonTable: function() {
            $('#auditPersonTable').bootstrapTable({
                locale: "zh-CN",
                // clickToSelect: true,
                uniqueId: "transferId",
                columns: [{
                    field: 'checkBox',
                    checkbox: true,
                    visible: true
                },
                {
                    field: 'opinion',
                    title: '审核意见',
                    formatter: this.auditSuggestionFormatter,
                    width: '10%',
                    align: 'center'
                },
                {
                    field: 'demand',
                    title: '工作要求',
                    width: '20%'
                },
                {
                    field: 'transferUserNames',
                    title: '流转人/反馈人',
                    width: '15%',
                    align: 'center'
                },
                {
                    field: 'username',
                    title: '审核人',
                    width: '12%',
                    align: 'center'
                },
                {
                    field: 'auditDept',
                    title: '审核单位',
                    width: '18%',
                    align: 'center'
                },
                {
                    field: 'auditTime',
                    title: '审核时间',
                    align: 'center',
                    width: '15%',
                    formatter: this.dateFormatter
                },
                {
                    field: 'transferId',
                    title: '操作',
                    visible: true,
                    formatter: this.auditFormatter,
                    align: 'center',
                    width: '10%'
                }],
                data: []
            });
        },
        // 初始化二次核查表格
        initSecondAuditTable: function() {
            $('#secondAuditTable').bootstrapTable({
                locale: "zh-CN",
                // clickToSelect: true,
                uniqueId: "checkId",
                columns: [{
                    field: 'checkBox',
                    checkbox: true,
                    visible: true
                },
                {
                    field: 'userId',
                    title: 'userId',
                    visible: false
                },
                {
                    field: 'content',
                    title: '核查内容',
                    width: '60%'
                },
                {
                    field: 'username',
                    title: '核查人',
                    width: '15%',
                    align: 'center'
                },
                {
                    field: 'createTime',
                    title: '核查时间',
                    width: '15%',
                    align: 'center',
                    formatter: this.dateFormatter
                },
                {
                    field: 'checkId',
                    title: '操作',
                    visible: true,
                    formatter: this.secondAuditFormatter,
                    align: 'center',
                    width: '10%'
                }],
                data: []
            });
        },
        // 初始化线索附件表格
        initClueFileUploadTable: function() {
            $('#clueFileUploadTable').bootstrapTable({
                locale: "zh-CN",
                // clickToSelect: true,
                uniqueId: "fileId",
                columns: [{
                    field: 'checkBox',
                    checkbox: true,
                    visible: true
                },
                {
                    field: 'intelligenceId',
                    title: '情报ID',
                    visible: false
                },
                {
                    field: 'userId',
                    title: '用户ID',
                    visible: false
                },
                {
                    field: 'name',
                    title: '名称',
                    width: '75%'
                },
                {
                    field: 'type',
                    title: '类型',
                    visible: false
                },
                {
                    field: 'state',
                    title: '状态',
                    visible: false
                },
                {
                    field: 'uploadTime',
                    title: '上传时间',
                    visible: true,
                    width: '15%',
                    align: 'center'
                },
                {
                    field: 'path',
                    title: '路径',
                    visible: false
                },
                {
                    field: 'fileId',
                    title: '操作',
                    visible: true,
                    formatter: this.clueFileUploadFormatter,
                    align: "center",
                    width: '10%'
                }],
                data: []
            });
        },
        // 初始化关联情报表格
        initRelatedIntelligenceTable: function() {
            $('#relatedIntelligenceTable').bootstrapTable({
                locale: "zh-CN",
                // clickToSelect: true,
                uniqueId: "intelligenceId2",
                columns: [{
                    field: 'checkBox',
                    checkbox: true,
                    visible: true
                },
                {
                    field: 'title',
                    title: '标题',
                    visible: true,
                    width: '55%'
                },
                {
                    field: 'intro',
                    title: '内容',
                    visible: false,
                    width: '40%',
                    align: 'center'
                },
                {
                    field: 'intelligenceType',
                    title: '情报种类',
                    visible: true,
                    formatter: this.intelligenceTypeFormatter,
                    align: 'center',
                    width: '15%'
                },
                {
                    field: 'intelligenceKind',
                    title: '情报类型',
                    visible: true,
                    formatter: this.intelligenceKindFormatter,
                    align: 'center',
                    width: '15%'
                },
                {
                    field: 'intelligenceId2',
                    title: '操作',
                    visible: true,
                    formatter: this.initRelatedIntelligenceFormatter,
                    align: "center",
                    width: '15%'
                }],
                data: []
            });
        },
        // 初始化案件日志表格
        initCaseLogTable: function() {
            $('#caseLogTable').bootstrapTable({
                locale: "zh-CN",
                // clickToSelect: true,
                uniqueId: "logId",
                columns: [{
                    field: 'checkBox',
                    checkbox: true,
                    visible: true
                },
                {
                    field: 'intro',
                    title: '内容',
                    width: '75%'
                },
                {
                    field: 'createTime',
                    title: '时间',
                    width: '15%',
                    align: 'center',
                    formatter: this.dateFormatter
                },
                {
                    field: 'logId',
                    title: '操作',
                    visible: true,
                    formatter: this.caseLogFormatter,
                    align: "center",
                    width: '10%'
                }],
                data: []
            });
        },
        // 初始化案件附件表格
        initCaseFileUploadTable: function() {
            $('#caseFileUploadTable').bootstrapTable({
                locale: "zh-CN",
                // clickToSelect: true,
                uniqueId: "fileId",
                columns: [{
                    field: 'checkBox',
                    checkbox: true,
                    visible: true
                },
                {
                    field: 'userId',
                    title: '用户ID',
                    visible: false
                },
                {
                    field: 'name',
                    title: '名称',
                    width: '75%'
                },
                {
                    field: 'path',
                    title: '路径',
                    visible: false
                },
                {
                    field: 'type',
                    title: '类型',
                    visible: false
                },
                {
                    field: 'state',
                    title: '状态',
                    visible: false
                },
                {
                    field: 'uploadTime',
                    title: '上传时间',
                    visible: true,
                    width: '15%',
                    align: 'center'
                },
                {
                    field: 'fileId',
                    title: '操作',
                    visible: true,
                    formatter: this.caseFileUploadFormatter,
                    align: "center",
                    width: '10%'
                }],
                data: []
            });
        },
        // 初始化或清空线索页面相关表格
        initClueTables: function() {
            if ($("#casePersonTable").html() == "") {
                this.initCasePersonTable();
            } else {
                $('#casePersonTable').bootstrapTable("removeAll");
            }

            if ($("#starePersonTable").html() == "") {
                this.initStarePersonTable();
            } else {
                $('#starePersonTable').bootstrapTable("removeAll");
            }

            if ($("#auditPersonTable").html() == "") {
                this.initAuditPersonTable();
            } else {
                $('#auditPersonTable').bootstrapTable("removeAll");
            }

            if ($("#secondAuditTable").html() == "") {
                this.initSecondAuditTable();
            } else {
                $('#secondAuditTable').bootstrapTable("removeAll");
            }

            if ($("#clueFileUploadTable").html() == "") {
                this.initClueFileUploadTable();
            } else {
                $('#clueFileUploadTable').bootstrapTable("removeAll");
            }
            
            /** 手动关联 注释 
            if ($("#relatedIntelligenceTable").html() == "") {
                this.initRelatedIntelligenceTable();
            } else {
                $('#relatedIntelligenceTable').bootstrapTable("removeAll");
            }
            **/
        },
        // 初始化或清空案件页面表格
        initCaseTables: function() {
            if ($("#caseLogTable").html() == "") {
                this.initCaseLogTable();
            } else {
                $('#caseLogTable').bootstrapTable("removeAll");
            }

            if ($("#caseFileUploadTable").html() == "") {
                this.initCaseFileUploadTable();
            } else {
                $('#caseFileUploadTable').bootstrapTable("removeAll");
            }
        },
        getPersonByNumId: function(person) {
            //身份证校验成功，查询数据库
            $.get(baseURL + "qbfx/intelligence/getPersonByNumId/" + person.numId,
            function(r) {
                if (r.person != null) {
                    $("#casePersonTable").bootstrapTable('append', r.person);
                } else {
                    $("#casePersonTable").bootstrapTable('append', person);
                }
            });
        },
        // ----------------新增线索开始------------------------------------------------------------------------------------
        addClue: function() {
            vm.optType = "add";
            // this.setIsEnableEdit("0");
            vm.showPage = 1;
            vm.title = "新增线索";
            vm.titleMain = '';
            vm.initGlobalIntelligence();
            vm.initClueTables();

            var date = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
            $("#cluedatetimepicker").val(date);

            vm.inputDisabled = false;
        },
        // 涉案人员增、删、改
        popUpCasePersonLayer: function() {
            if (vm.optType == "query") { // 不显示保存按钮
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: "涉案人员",
                    area: ['700px', '340px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#casePersonModal"),
                    btn: ['关闭'],
                    btn1: function(index) {
                        layer.close(index);
                    }
                });
            } else if (vm.optType == "add" || vm.optType == "update") { // 显示保存按钮
                var title = "";
                if (vm.casePerson.personId == "") {
                    title = "新增涉案人员"
                } else {
                    title = "修改涉案人员";
                }
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: title,
                    area: ['700px', '340px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#casePersonModal"),
                    btn: ['保存', '取消'],
                    btn1: function(index) {
                        if (vm.casePerson.name.trim() == "") {
                            alert("请填写涉案人员姓名");
                            return;
                        }
                        if (!vm.casePerson.sex) {
                            alert("请选择性别");
                            return;
                        }
                        if (vm.casePerson.numId.trim() != "") {
                            if (!checkId(vm.casePerson.numId)) {
                                return;
                            }
                        }
                        if (vm.casePerson.personId == '') {

                            var date = new Date();
                            vm.casePerson.personId = "temp" + date.getTime();
                            $('#casePersonTable').bootstrapTable('append', vm.casePerson);
                        } else {
                            var person = $('#casePersonTable').bootstrapTable('getRowByUniqueId', vm.casePerson.personId);
                            if (person && person != "") {
                                $('#casePersonTable').bootstrapTable('updateByUniqueId', {
                                    id: vm.casePerson.personId,
                                    row: vm.casePerson
                                });
                            } else {
                                $('#casePersonTable').bootstrapTable('append', vm.casePerson);
                            }
                        }
                        layer.close(index);
                        vm.initGlobalCasePerson();
                    }
                });
            }
        },
        addCasePerson: function() {
            vm.initGlobalCasePerson();
            vm.popUpCasePersonLayer();
            $("#caseLogTable").bootstrapTable('showColumn', 'checkBox');
            $("#caseFileUploadTable").bootstrapTable('showColumn', 'checkBox');
        },
        queryOrUpdateCasePersonById: function(personId) {
            if (!personId || personId == "") {
                return;
            }
            var localPerson = $('#casePersonTable').bootstrapTable('getRowByUniqueId', personId);
            var jsonPerson = JSON.stringify(localPerson);
            vm.casePerson = JSON.parse(jsonPerson);
            vm.popUpCasePersonLayer();
        },
        deleteCasePerson: function() {
            var selectPersons = $('#casePersonTable').bootstrapTable('getSelections');
            if (selectPersons.length < 1) {
                alert("请至少选择一条记录");
                return;
            }
            confirm('确定要删除选中的涉案人员？',
            function() {
                var personIds = [];
                for (var i = 0; i < selectPersons.length; i++) {
                    personIds.push(selectPersons[i].personId);
                    // if((selectPersons[i].personId +
                    // "").substring(0,4) != "temp"){
                    // vm.intelligence.deletePersonIds.push(selectPersons[i].personId);
                    // }
                }
                $('#casePersonTable').bootstrapTable('remove', {
                    field: 'personId',
                    values: personIds
                });
                //vm.searchAutoIntelligence();
                alert("删除成功");
            });
        },
        deleteCasePersonById: function(personId) {
            if (!personId || personId == "") {
                return;
            }
            confirm('确定要删除选中的涉案人员？',
            function() {
                // if((personId + "").substring(0,4) != "temp"){
                // vm.intelligence.deletePersonIds.push(personId);
                // }
                $('#casePersonTable').bootstrapTable('removeByUniqueId', personId);
                alert("删除成功");
            });
        },
        // 线索盯办人增、删、改
        popUpStareLayer: function() {
            if (vm.optType == "query") { // 不显示保存按钮
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: "盯办信息",
                    area: ['700px', '380px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#stareModal"),
                    btn: ['关闭'],
                    btn1: function(index) {
                        layer.close(index);
                    }
                });
            } else if (vm.optType == "add" || vm.optType == "update") { // 显示保存按钮
                var title = "";
                if (vm.stare.stareId == "") {
                    title = "新增盯办信息"
                    var date = (new Date()).Format("yyyy-MM-dd");
                    $("#clueStareDatetimePicker").val(date);
                } else {
                    title = "修改盯办信息";
                }
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: title,
                    area: ['580px', '380px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#stareModal"),
                    btn: ['保存', '取消'],
                    btn1: function(index) {
                        if (vm.stare.username == "") {
                            alert("请选择盯办人员");
                            return;
                        }
                        if (vm.stare.matter.trim() == "") {
                            alert("请填写盯办事项");
                            return;
                        } else if (vm.stare.matter.trim().length > 1000) {
                            alert("盯办事项最多1000个字");
                            return;
                        }
//                        $('#clueStareDatetimePicker').datetimepicker("hide");
                        layer.close(index);
                        var dateTime = $("#clueStareDatetimePicker").val();
                        if (dateTime && dateTime != "") {
                            if (dateTime.length > 10) {
                                vm.stare.createTime = $("#clueStareDatetimePicker").val();
                            } else {
                                vm.stare.createTime = $("#clueStareDatetimePicker").val() + " 00:00:00";
                            }
                        }
                        if (vm.stare.stareId == '') {
                            var date = new Date();
                            vm.stare.stareId = "temp" + date.getTime();
                            $('#starePersonTable').bootstrapTable('append', vm.stare);
                        } else {
                            $('#starePersonTable').bootstrapTable('updateByUniqueId', {
                                id: vm.stare.stareId,
                                row: vm.stare
                            });
                        }
                        vm.initGlobalStare();
                    },
                    btn2: function(index) {
//                        $('#clueStareDatetimePicker').datetimepicker("hide");
                        layer.close(index);
                    }
                });
            }
        },
        addStarePerson: function() {
            vm.initGlobalStare();
            vm.popUpStareLayer();
        },
        queryOrUpdateStarePersonById: function(stareId) {
            if (!stareId || stareId == "") {
                return;
            }
            var localStare = $('#starePersonTable').bootstrapTable('getRowByUniqueId', stareId);
            var jsonStare = JSON.stringify(localStare);
            vm.stare = JSON.parse(jsonStare);
            if (vm.intelligence.createType == "1") {
                if (vm.stare.createTime && vm.stare.createTime != "" && vm.stare.createTime.length > 10) {
                    $("#clueStareDatetimePicker").val((vm.stare.createTime).substring(0, 10));
                }
            } else {
                $("#clueStareDatetimePicker").val(vm.stare.createTime);
            }
            vm.popUpStareLayer();
        },
        deleteStarePerson: function() {
            var selectStares = $('#starePersonTable').bootstrapTable('getSelections');
            if (selectStares.length < 1) {
                alert("请至少选择一条记录");
                return;
            }
            confirm('确定要删除选中的盯办信息？',
            function() {
                var stareIds = [];
                for (var i = 0; i < selectStares.length; i++) {
                    stareIds.push(selectStares[i].stareId);
                    if ((selectStares[i].stareId + "").substring(0, 4) != "temp") {
                        vm.intelligence.deleteStareIds.push(selectStares[i].stareId);
                    }
                }
                $('#starePersonTable').bootstrapTable('remove', {
                    field: 'stareId',
                    values: stareIds
                });
                alert("删除成功");
            });
        },
        deleteStarePersonById: function(stareId) {
            if (!stareId || stareId == "") {
                return;
            }
            confirm('确定要删除选中的盯办信息？',
            function() {
                if ((stareId + "").substring(0, 4) != "temp") {
                    vm.intelligence.deleteStareIds.push(stareId);
                }
                $('#starePersonTable').bootstrapTable('removeByUniqueId', stareId);
                alert("删除成功");
            });
        },
        // 线索审核人增、删、改
        viewTransferDetail: function(transferId){
			$("#handlerLabel1,#handlerLabel2").hide();
			var tableEntity = $("#auditPersonTable").bootstrapTable('getRowByUniqueId', transferId);
			vm.transfer = tableEntity;
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
				area: ['780px', '445px'],
				shadeClose: false,
				//shade:false,
				content: jQuery("#transferLayer"),
				btn: ['关闭'],
				btn1: function (index) {
					layer.close(index);
				}
			});
		},
        popUpAuditLayer: function() {
            if (vm.optType == "query") { // 不显示保存按钮
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: "审核信息",
                    area: ['780px', '445px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#auditModal"),
                    btn: ['关闭'],
                    btn1: function(index) {
                        layer.close(index);
                    }
                });
            } else if (vm.optType == "add" || vm.optType == "update") { // 显示保存按钮
            	let isExist = false; //该情报是否已经办结
            	let isCompeleteWhenUpdate = false; //修改的审核信息是否是已经办结的
            	if(vm.intelligence.result && vm.intelligence.result !=''){
            		isExist = true;
            	}
                var title = "";
                if (vm.transfer.transferId == "") {
                	if(isExist){
                		alert("审核列表中已存在确认办结的信息，无法再添加审核信息");
                		return;
                	}
                    title = "新增审核信息";
                    $("#handleRadio1").prop("checked", true);
                    vm.showTransferType = '0';
                    var date = (new Date()).Format("yyyy-MM-dd");
                    $("#clueAuditDatetimePicker").val(date);
                } else {
                    title = "修改审核信息";
                    let tableEntity = $("#auditPersonTable").bootstrapTable('getRowByUniqueId', vm.transfer.transferId);
        			if(!tableEntity.transferUserNames || tableEntity.transferUserNames == ''){
        				if(isExist){
        					isCompeleteWhenUpdate = true;
        				}
        				$("#handleRadio2").prop("checked", true);
        				vm.showTransferType = '1';
        			} else{
        				$("#handleRadio1").prop("checked", true);
        				vm.showTransferType = '0';
        			}
                }
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: title,
                    area: ['780px', '445px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#auditModal"),
                    btn: ['保存', '取消'],
                    btn1: function(index) {
                        if (vm.transfer.username == "") {
                            alert("请选择审核人员");
                            return;
                        }
                        if(!vm.transfer.opinion){
                        	alert("请选择审核意见");
                        	return;
                        }
                        
                        if($('input:radio[name="transferType"]:checked').val() == '0'){
                        	if(vm.transfer.transferUserNames.trim() == ""){
                        		alert("请选择流转人/反馈人");
                    			return;
                        	}
                        }else{
                        	if (!vm.intelligence.result) {
                                alert("请选择打击处理情况");
                                return;
                            }
                        	vm.transfer.transferUserNames = '';
                        }
                        
                        if (vm.transfer.demand.trim() == "") {
                            alert("请填写工作要求");
                            return;
                        } else if ((vm.transfer.demand.trim()).length > 1000) {
                            alert("工作要求最多1000个字，目前" + (vm.transfer.demand.trim()).length + "个字");
                            return;
                        }
//                        $('#clueAuditDatetimePicker').datetimepicker("hide");
                        if($('input:radio[name="transferType"]:checked').val() == '0'){
                        	if(isCompeleteWhenUpdate){
                        		vm.intelligence.result = '';
                        		vm.intelligence.victory = '';
                        	}
                        }
                        
                        layer.close(index);
                        var dateTime = $("#clueAuditDatetimePicker").val();
                        if (dateTime && dateTime != "") {
                            if (dateTime.length > 10) {
                                vm.transfer.auditTime = $("#clueAuditDatetimePicker").val();
                            } else {
                                vm.transfer.auditTime = $("#clueAuditDatetimePicker").val() + " 00:00:00";
                            }
                        }
                        if (vm.transfer.transferId == '') {
                            var date = new Date();
                            vm.transfer.transferId = "temp" + date.getTime();
                            $('#auditPersonTable').bootstrapTable('append', vm.transfer);
                        } else {
                            $('#auditPersonTable').bootstrapTable('updateByUniqueId', {
                                id: vm.transfer.transferId,
                                row: vm.transfer
                            });
                        }
                        vm.initGlobalTransfer();
                    },
                    btn2: function(index) {
//                        $('#clueAuditDatetimePicker').datetimepicker("hide");
                        if (vm.optType == "add"){
                        	if($('input:radio[name="transferType"]:checked').val() == '1'){
                        		vm.intelligence.result = '';
                        		vm.intelligence.victory = '';
                        	}
                        }
                        layer.close(index);
                    }
                });
            }
        },
        addAuditPerson: function() {
            vm.initGlobalTransfer();
            vm.popUpAuditLayer();
        },
        queryOrUpdateAuditPersonById: function(transferId) {
            if (!transferId || transferId == "") {
                return;
            }
            var localTransfer = $('#auditPersonTable').bootstrapTable('getRowByUniqueId', transferId);
            var jsonTransfer = JSON.stringify(localTransfer);
            vm.transfer = JSON.parse(jsonTransfer);
            if (vm.intelligence.createType == "1") {
                if (vm.transfer.auditTime && vm.transfer.auditTime != "" && vm.transfer.auditTime.length > 10) {
                    $("#clueAuditDatetimePicker").val((vm.transfer.auditTime).substring(0, 10));
                }
            } else {
                $("#clueAuditDatetimePicker").val(vm.transfer.auditTime);
            }
            vm.popUpAuditLayer();
        },
        deleteAuditPerson: function() {
            var selectAudit = $('#auditPersonTable').bootstrapTable('getSelections');
            if (selectAudit.length < 1) {
                alert("请至少选择一条记录");
                return;
            }
            confirm('确定要删除选中的审核信息？',
            function() {
                var transferIds = [];
                for (var i = 0; i < selectAudit.length; i++) {
                    transferIds.push(selectAudit[i].transferId);
                    if ((selectAudit[i].transferId + "").substring(0, 4) != "temp") {
                        vm.intelligence.deleteTransferIds.push(selectAudit[i].transferId);
                    }
                }
                $('#auditPersonTable').bootstrapTable('remove', {
                    field: 'transferId',
                    values: transferIds
                });
                alert("删除成功");
            });
        },
        deleteAuditPersonById: function(transferId) {
            if (!transferId || transferId == "") {
                return;
            }
            confirm('确定要删除选中的审核信息？',
            function() {
                if ((transferId + "").substring(0, 4) != "temp") {
                    vm.intelligence.deleteTransferIds.push(transferId);
                }
                var tableEntity = $("#auditPersonTable").bootstrapTable('getRowByUniqueId', transferId);
    			vm.transferEntity = tableEntity;
    			if(!tableEntity.transferUserNames || tableEntity.transferUserNames == ''){
    				vm.intelligence.result='';
    				vm.intelligence.victory = '';
    			} 
                $('#auditPersonTable').bootstrapTable('removeByUniqueId', transferId);
                alert("删除成功");
            });
        },
        // 二次核查增、删、改
        popUpSecondAuditLayer: function() {
            if (vm.optType == "query") { // 不显示保存按钮
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: "二次核查",
                    area: ['700px', '330px'],
                    shadeClose: false,
                    content: jQuery("#secondAuditModal"),
                    btn: ['关闭'],
                    btn1: function(index) {
                        layer.close(index);
                    }
                });
            } else if (vm.optType == "add" || vm.optType == "update") { // 显示保存按钮
                var title = "";
                if (vm.checkIn.checkId == "") {
                    title = "新增二次核查";
                    var secondAuditTableData = $('#secondAuditTable').bootstrapTable('getData');
                    if (secondAuditTableData && secondAuditTableData.length > 0) {
                        //vm.isShowUserTreeDisable = true;
                        vm.checkIn.username = secondAuditTableData[0].username;
                        vm.checkIn.userId = secondAuditTableData[0].userId;
                    } else {
                        //vm.isShowUserTreeDisable = false;
                    }

                    var date = (new Date()).Format("yyyy-MM-dd");
                    $("#clueSecondAuditDatetimePicker").val(date);
                } else {
                    title = "修改二次核查";
                    vm.isShowUserTreeDisable = true;
                }
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: title,
                    area: ['700px', '330px'],
                    shadeClose: false,
                    content: jQuery("#secondAuditModal"),
                    btn: ['保存', '取消'],
                    btn1: function(index) {
                        if (vm.checkIn.content.trim() == "") {
                            alert("请填写核查内容");
                            return;
                        } else if ((vm.checkIn.content.trim()).length > 1000) {
                            alert("核查内容最多1000个字，目前" + (vm.checkIn.content.trim()).length + "个字");
                            return;
                        }
                        if (vm.checkIn.username == "") {
                            alert("请选择核查人");
                            return;
                        }
//                        $('#clueSecondAuditDatetimePicker').datetimepicker("hide");
                        layer.close(index);
                        var dateTime = $("#clueSecondAuditDatetimePicker").val();
                        if (dateTime && dateTime != "") {
                            if (dateTime.length > 10) {
                                vm.checkIn.createTime = $("#clueSecondAuditDatetimePicker").val();
                            } else {
                                vm.checkIn.createTime = $("#clueSecondAuditDatetimePicker").val() + " 00:00:00";
                            }
                        }
                        if (vm.checkIn.checkId == '') {
                            var date = new Date();
                            vm.checkIn.checkId = "temp" + date.getTime();
                            $('#secondAuditTable').bootstrapTable('append', vm.checkIn);
                        } else {
                            $('#secondAuditTable').bootstrapTable('updateByUniqueId', {
                                id: vm.checkIn.checkId,
                                row: vm.checkIn
                            });
                        }
                        vm.initSecondAudit();
                    },
                    btn2: function(index) {
//                        $('#clueSecondAuditDatetimePicker').datetimepicker("hide");
                        layer.close(index);
                    }
                });
            }
        },
        addSecondAudit: function() {
            vm.initSecondAudit();
            vm.popUpSecondAuditLayer();
        },
        queryOrUpdateSecondAuditById: function(checkId) {
            if (!checkId || checkId == "") {
                return;
            }
            var localCheck = $('#secondAuditTable').bootstrapTable('getRowByUniqueId', checkId);
            var jsonCheck = JSON.stringify(localCheck);
            vm.checkIn = JSON.parse(jsonCheck);
            if (vm.intelligence.createType == "1") {
                if (vm.checkIn.createTime && vm.checkIn.createTime != "" && vm.checkIn.createTime.length > 10) {
                    $("#clueSecondAuditDatetimePicker").val((vm.checkIn.createTime).substring(0, 10));
                }
            } else {
                $("#clueSecondAuditDatetimePicker").val(vm.checkIn.createTime);
            }
            vm.popUpSecondAuditLayer();
        },
        deleteSecondAudit: function() {
            var selectSecondAudit = $('#secondAuditTable').bootstrapTable('getSelections');
            if (selectSecondAudit.length < 1) {
                alert("请至少选择一条记录");
                return;
            }
            confirm('确定要删除选中的信息？',
            function() {
                var checkIds = [];
                for (var i = 0; i < selectSecondAudit.length; i++) {
                    checkIds.push(selectSecondAudit[i].checkId);
                    if ((selectSecondAudit[i].checkId + "").substring(0, 4) != "temp") {
                        vm.intelligence.deleteCheckIds.push(selectSecondAudit[i].checkId);
                    }
                }
                $('#secondAuditTable').bootstrapTable('remove', {
                    field: 'checkId',
                    values: checkIds
                });
                alert("删除成功");
            });
        },
        deleteSecondAuditById: function(checkId) {
            if (!checkId || checkId == "") {
                return;
            }
            confirm('确定要删除选中的信息？',
            function() {
                if ((checkId + "").substring(0, 4) != "temp") {
                    vm.intelligence.deleteCheckIds.push(checkId);
                }
                $('#secondAuditTable').bootstrapTable('removeByUniqueId', checkId);
                alert("删除成功");
            });
        },
        // 线索附件增、删
        popUpFileUploadLayer: function() {
            $("#progress-bar").css("width", 0);
            var bool = false; // 加个锁
            layer.open({
                type: 1,
                skin: 'layui-layer-molv',
                title: "新增附件",
                area: ['550px', '190px'],
                shadeClose: false,
                // shade:false,
                content: jQuery("#clueFileUploadModal"),
                btn: ['上传', '取消'],
                btn1: function(index) {
                    if (bool) {
                        return;
                    }
                    bool = true;
                    var files = vm.$refs.cluefile.files;
                    if (files.length < 1) {
                        alert("请选择上传的文件");
                        return;
                    }
                    var formData = new FormData();
                    formData.append('files', files[0]);
                    ajax = $.ajax({
                        url: baseURL + 'qbfx/file/uploadFile',
                        type: 'POST',
                        dataType: 'json',
                        cache: false,
                        data: formData,
                        xhr: function() {
                            myXhr = $.ajaxSettings.xhr();
                            if (myXhr.upload) {
                                myXhr.upload.addEventListener('progress', progressHandlingFunction, false);
                            }
                            return myXhr; // xhr对象返回给jQuery使用
                        },
                        processData: false,
                        contentType: false,
                        beforeSend: function() {
                            $("#progressBar").css('display', 'block');
                        },
                        success: function(data) {
                            if (data.code == "0") {
                                vm.clueFileUpload = data.file;
                                // console.log("上传文件返回>>>>>>"+JSON.stringify(vm.clueFileUpload));
                                // if(retFileInfos &&
                                // retFileInfos.length >
                                // 0){
                                // vm.clueFileUpload.path
                                // =
                                // retFileInfos[0].path;
                                // vm.clueFileUpload.fileId
                                // =
                                // retFileInfos[0].fileId;
                                // }
                                if (vm.showPage == 1) {
                                    $('#clueFileUploadTable').bootstrapTable('append', vm.clueFileUpload);
                                } else if (vm.showPage == 2) {
                                    $('#caseFileUploadTable').bootstrapTable('append', vm.clueFileUpload);
                                }
                            } else {
                                alert(data.msg);
                            }
                            layer.close(index);
                        },
                        error: function(data, status, e) {
                            if (data.statusText == 'abort') {
                                alert('已取消上传');
                            } else {
                                alert('上传文件失败')
                            }
                            layer.close(index);
                        },
                        complete: function() {
                            $("#progress-bar").css("width", 0);
                            $("#progressBar").css('display', 'none');
                            bool = false;
                        }
                    });
                },
                btn2: function() {
                    if (ajax) {
                        ajax.abort();
                    }
                },
                end: function() {
                    $("#clueFileUploadInput").val("");
                    $("#progress").val("");
                }
            });
        },
        addClueFileUpload: function() {
            vm.initGlobalClueFileUpload();
            vm.popUpFileUploadLayer();
        },
        deleteClueFileUpload: function() {
            var selectFiles = $('#clueFileUploadTable').bootstrapTable('getSelections');
            if (selectFiles.length < 1) {
                alert("请至少选择一条记录");
                return;
            }
            confirm('确定要删除选中的附件？',
            function() {
                var fileIds = [];
                for (var i = 0; i < selectFiles.length; i++) {
                    fileIds.push(selectFiles[i].fileId);
                    // if((selectFiles[i].fileId + "").substring(0,4) !=
                    // "temp"){
                    vm.intelligence.deleteFileIds.push(selectFiles[i].fileId);
                    // }
                }
                $('#clueFileUploadTable').bootstrapTable('remove', {
                    field: 'fileId',
                    values: fileIds
                });
                alert("删除成功");
            });
        },
        deleteClueFileUploadById: function(fileId) {
            if (!fileId || fileId == "") {
                return;
            }
            confirm('确定要删除选中的附件？',
            function() {
                vm.intelligence.deleteFileIds.push(fileId);
                $('#clueFileUploadTable').bootstrapTable('removeByUniqueId', fileId);
                alert("删除成功");
            });
        },
        checkFileUploadById: function(fileId) {
            if (!fileId || fileId == "") {
                return;
            }
            var selectFile;
            if (vm.showPage == 1) {
                selectFile = $('#clueFileUploadTable').bootstrapTable('getRowByUniqueId', fileId);
            } else if (vm.showPage == 2) {
                selectFile = $('#caseFileUploadTable').bootstrapTable('getRowByUniqueId', fileId);
            }
            var fileType = selectFile.type;
            if (fileType.substring(0, 5) == "audio") {
                $("#audioPlay").attr("src", baseURL + selectFile.path);
                var audio = document.getElementById("audioPlay");
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: "查看附件",
                    area: ['550px', '200px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#audioLayer"),
                    btn: ['关闭'],
                    btn1: function(index) {
                        var myAudio = document.getElementById('audioPlay');
                        myAudio.pause();
                        layer.close(index);
                    }
                });
            } else if (fileType.substring(0, 5) == "image") {
                $("#imgContainer").attr("src", baseURL + selectFile.path);
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: "查看附件",
                    area: ['600px', '450px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#imageLayer"),
                    btn: ['关闭']
                });
            }
            //					else if (fileType.substring(0, 4) == "text"
            //							|| fileType == "application/pdf") {
            //						$("#textFrame").attr("src", baseURL + selectFile.path);
            //						layer.open({
            //							type : 1,
            //							skin : 'layui-layer-molv',
            //							title : "查看附件",
            //							area : [ '600px', '450px' ],
            //							shadeClose : false,
            //							// shade:false,
            //							content : jQuery("#textLayer"),
            //							btn : [ '关闭' ]
            //						});
            //					} 
            else if (fileType.substring(0, 5) == "video") {
                $("#videoContainer").attr("src", baseURL + selectFile.path);
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: "查看附件",
                    area: ['600px', '450px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#videoLayer"),
                    btn: ['关闭'],
                    btn1: function(index) {
                        var myVideo = document.getElementById('videoContainer');
                        myVideo.pause();
                        layer.close(index);
                    }
                });
            } else {
                // window.location = baseURL + selectFile.path;
                //						var form = $("<form method='get'></form>");
                //						form.attr("action", baseURL + selectFile.path);
                //						$(document.body).append(form);
                //						form.submit();
                download(projectName + "/" + selectFile.path, null, null);
            }
        },
        // 线索关联情报增、删、改
        addRelatedIntelligence: function() {
            layer.open({
                type: 1,
                skin: 'layui-layer-molv',
                title: "关联情报",
                area: ['780px', '470px'],
                shadeClose: false,
                // shade:false,
                content: jQuery("#relatedIntelligenceModal"),
                btn: ['保存', '取消'],
                btn1: function(index) {
                    var selectedIds = $('#jqGridRelatedIntellegence').jqGrid('getGridParam', 'selarrrow');
                    if (selectedIds.length < 1) {
                        alert("请选择关联情报");
                        return;
                    }
                    for (var i = 0; i < selectedIds.length; i++) {
                        var rowData = $("#jqGridRelatedIntellegence").jqGrid('getRowData', selectedIds[i]);
                        // 插入 手动关联情报表， 排重
                        if ($('#relatedIntelligenceTable').bootstrapTable('getRowByUniqueId', rowData.intelligenceId) == null) {
                            rowData.intelligenceId2 = rowData.intelligenceId;
                            rowData.intelligenceId = "";
                            rowData.type = "0";
                            $('#relatedIntelligenceTable').bootstrapTable('append', rowData);
                        }
                    }
                    layer.close(index);
                }
            });

            // $.get(baseURL +
            // 'qbfx/intelligence/list/51?searchType=1&createType=1',
            // function(r){
            // console.log("查询列表结果>>>>>>"+JSON.stringify(r));
            // });
            // 获取已经选择的 编号列表，下次查询不再显示
            var relatedIntelligenceList = $("#relatedIntelligenceTable").bootstrapTable('getData');
            var selectedIds = [];
            if (relatedIntelligenceList.length > 0) {
                for (var i in relatedIntelligenceList) {
                    selectedIds.push(parseInt(relatedIntelligenceList[i].intelligenceId2));
                }
            }
            /********************** 再次加载 B **********************/
			if($("#jqGridRelatedIntellegence").jqGrid('getDataIDs').length > 0){
	            $("#jqGridRelatedIntellegence").setGridWidth(712);
	            vm.relationSearchParams = {};
	            // 查询除原来的传递参数，并逐个清空 B
	            var postData2 = $("#jqGridRelatedIntellegence").jqGrid("getGridParam", "postData");
	            delete postData2["title"];
	            delete postData2["intro"];
	            delete postData2["selectedIds"];
	            // 查询除原来的传递参数，并逐个清空 E
	            // 已选择的id列表
	            if (selectedIds.length > 0) {
	                vm.relationSearchParams.selectedIds = JSON.stringify(selectedIds).replace('[', '(').replace(']', ')');
	            }
	            postData2 = vm.relationSearchParams;
	            var page = $("#jqGridRelatedIntellegence").jqGrid('getGridParam', 'page');
	            $("#jqGridRelatedIntellegence").jqGrid('setGridParam', {
	                postData: postData2,
	                page: page
	            }).trigger("reloadGrid");
			}
            /********************** 再次加载 E **********************/
            $("#jqGridRelatedIntellegence").jqGrid({
                url: baseURL + 'qbfx/intelligence/list',
                datatype: "json",
                colModel: [{
                    label: '序号',
                    hidden: true,
                    name: 'intelligenceId',
                    index: 'intelligence_id',
                    key: true
                },
                {
                    label: '标题',
                    name: 'title',
                    index: 'title',
                    width: 380,
                    sortable: false
                },
                // { label: '内容', name: 'intro',
                // index: 'intro', width: 300,
                // sortable: false },
                {
                    label: '情报种类',
                    name: 'intelligenceType',
                    align: 'center',
                    width: 120,
                    formatter: function(value, options, row) {
                        for (var i = 0; i < vm.typeDictList.length; i++) {
                            if (vm.typeDictList[i].code == value) {
                                return vm.typeDictList[i].value;
                            }
                        }
                        return "";
                    }
                },
                {
                    label: '情报类型',
                    name: 'intelligenceKind',
                    align: 'center',
                    width: 120,
                    formatter: function(value, options, row) {
                        for (var i = 0; i < vm.kindDictList.length; i++) {
                            if (vm.kindDictList[i].code == value) {
                                return vm.kindDictList[i].value;
                            }
                        }
                        return "";
                    }
                },
                {
                    label: '操作',
                    name: 'operate',
                    align: 'center',
                    index: 'intelligence_id',
                    sortable: false,
                    width: 60,
                    formatter: function(value, grid, row, state) {
                        return '<a onclick="vm.checkRelatedIntelligenceById(' + row.intelligenceId + ')" style="cursor: pointer" title="查看"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>'
                    }
                }],
                viewrecords: true,
                height: 220,
                rowNum: 5,
                // rowList : [5,10,15],
                rownumbers: true,
                rownumWidth: 25,
                autowidth: true,
                multiselect: true,
                pager: "#jqGridPagerRelatedIntellegence",
                jsonReader: {
                    root: "page.list",
                    page: "page.currPage",
                    total: "page.totalPage",
                    records: "page.totalCount"
                },
                prmNames: {
                    page: "page",
                    rows: "limit",
                    order: "order"
                },
                gridComplete: function() {
                    // 隐藏grid底部滚动条
                    $("#jqGridRelatedIntellegence").closest(".ui-jqgrid-bdiv").css({
                        "overflow-x": "hidden"
                    });
                },
                postData: {
                    searchType: '3',
                    createType: '1',
                    // 当前页面的id（针对修改页面使用）
                    currendtId: vm.intelligence.intelligenceId,
                }
            });
        },
        deleteRelatedIntelligence: function() {
            var selectRelatedIntelligences = $('#relatedIntelligenceTable').bootstrapTable('getSelections');
            if (selectRelatedIntelligences.length < 1) {
                alert("请至少选择一条记录");
                return;
            }
            confirm('确定要删除选中的关联情报？',
            function() {
                var intelligenceIds = [];
                for (var i = 0; i < selectRelatedIntelligences.length; i++) {
                    intelligenceIds.push(selectRelatedIntelligences[i].intelligenceId2);
                }
                $('#relatedIntelligenceTable').bootstrapTable('remove', {
                    field: 'intelligenceId2',
                    values: intelligenceIds
                });
                alert("删除成功");
            });
        },
        deleteRelatedIntelligenceById: function(intelligenceId2) {
            if (!intelligenceId2 || intelligenceId2 == "") {
                return;
            }
            confirm('确定要删除选中的关联情报？',
            function() {
                $('#relatedIntelligenceTable').bootstrapTable('removeByUniqueId', intelligenceId2);
                alert("删除成功");
            });
        },
        // 查看关联情报
        checkRelatedIntelligenceById: function(intelligenceId2) {
            if (!intelligenceId2 || intelligenceId2 == "") {
                return;
            }
            $.get(baseURL + "qbfx/intelligence/infoLess/" + intelligenceId2,
            function(r) {
                var intelligenceDetail = r.intelligence;
                $("#intelligenceDetailTitle").val(intelligenceDetail.title);
                $("#intelligenceDetailIntro").val(intelligenceDetail.intro);
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: "情报详情",
                    area: ['700px', '400px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#intelligenceDetailLayer"),
                    btn: ['关闭'],
                    btn1: function(index) {
                        layer.close(index);
                    }
                });
            });
        },
        // 线索重置
        clueReset: function() {
            confirm('确定要重置当前页面？',
            function() {
                vm.initGlobalIntelligence();
                vm.intelligence.intelligenceKind = "";
                vm.initClueTables();
                window.parent.vm.isEditted = false;
                var date = (new Date()).Format("yyyy-MM-dd");
                $("#cluedatetimepicker").val(date);
                CKEDITOR.instances.clueIntroEditor.setData('');
            });
        },
        // 线索保存
        saveClue: function(event) {
            if (vm.isButtonDisable) {
                return;
            }
            vm.isButtonDisable = true;
            vm.intelligence.intro = CKEDITOR.instances.clueIntroEditor.getData();
            if (vm.intelligence.title.trim() == '') {
                alert("请填写标题");
                vm.isButtonDisable = false;
                return;
            } else if ((vm.intelligence.title.trim()).length > 50) {
                alert("标题最多50个字");
                vm.isButtonDisable = false;
                return;
            }
            if (!vm.intelligence.intelligenceType) {
                alert("请选择情报种类");
                vm.isButtonDisable = false;
                return;
            }
            if (!vm.intelligence.place) {
                alert("请选择发生地");
                vm.isButtonDisable = false;
                return;
            }
            if (!vm.intelligence.language) {
                alert("请选择语种");
                vm.isButtonDisable = false;
                return;
            }
            if (vm.receiveUserNames == "") {
                alert("请选择接收人");
                vm.isButtonDisable = false;
                return;
            }
            if (vm.intelligence.intro.trim() == '') {
                alert("请填写内容");
                vm.isButtonDisable = false;
                return;
            } else if ((vm.intelligence.intro.trim()).length > 20000) {
                alert("内容最多20000个字");
                vm.isButtonDisable = false;
                return;
            }
            vm.intelligence.launchTime = $("#cluedatetimepicker").val() + " 00:00:00";
            var stareTableData = $('#starePersonTable').bootstrapTable('getData');
            if (stareTableData && stareTableData.length > 0) {
                for (var i = 0; i < stareTableData.length; i++) {
                    if (("" + stareTableData[i].stareId).substring(0, 4) == "temp") {
                        stareTableData[i].stareId = "";
                    }
                }
            }
            vm.intelligence.stareList = stareTableData;

            var auditTableData = $('#auditPersonTable').bootstrapTable('getData');
            if (auditTableData && auditTableData.length > 0) {
                for (var i = 0; i < auditTableData.length; i++) {
                    if (("" + auditTableData[i].transferId).substring(0, 4) == "temp") {
                        auditTableData[i].transferId = "";
                    }
                }
            }
            vm.intelligence.transferList = auditTableData;

            var secondAuditTableData = $('#secondAuditTable').bootstrapTable('getData');
            if (secondAuditTableData && secondAuditTableData.length > 0) {
                for (var i = 0; i < secondAuditTableData.length; i++) {
                    if (("" + secondAuditTableData[i].checkId).substring(0, 4) == "temp") {
                        secondAuditTableData[i].checkId = "";
                    }
                }
            }
            vm.intelligence.checkList = secondAuditTableData;

            var casePersonTableData = $('#casePersonTable').bootstrapTable('getData');
            if (casePersonTableData && casePersonTableData.length > 0) {
                for (var i = 0; i < casePersonTableData.length; i++) {
                    // if(("" +
                    // casePersonTableData[i].personId).substring(0,4)
                    // == "temp"){
                    // casePersonTableData[i].personId = "";
                    // }
                    if (("" + casePersonTableData[i].personId).startsWith('T')) {
                        casePersonTableData[i].personId = "";
                    }
                }
            }
            vm.intelligence.personList = casePersonTableData;

            var clueFileTableData = $('#clueFileUploadTable').bootstrapTable('getData');
            vm.intelligence.fileList = clueFileTableData;
            // console.log("上传文件参数>>>>>>>>>>"+JSON.stringify(vm.intelligence.fileList));
            /** 手动关联 注释 
            var relatedIntelligenceTableData = $('#relatedIntelligenceTable').bootstrapTable('getData');
            if (relatedIntelligenceTableData && relatedIntelligenceTableData.length > 0) {
                for (var i = 0; i < relatedIntelligenceTableData.length; i++) {
                    if (("" + relatedIntelligenceTableData[i].intelligenceId).substring(0, 4) == "temp") {
                        relatedIntelligenceTableData[i].intelligenceId = "";
                    }
                }
            }
            vm.intelligence.relationList = relatedIntelligenceTableData;
            **/
            // console.log("关联情报relationList>>>>>>>>>>"+JSON.stringify(vm.intelligence.relationList));
            // console.log("【历史数据】上传线索情报信息>>>>>>>>>>"+JSON.stringify(vm.intelligence));
            var url = "qbfx/intelligence/saveOrUpdate";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(vm.intelligence),
                success: function(r) {
                    if (r.code === 0) {
                        alert('操作成功',
                        function(index) {
                            vm.switchPage();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        // ----------------新增线索结束------------------------------------------------------------------------------------
        // ----------------新增案件开始------------------------------------------------------------------------------------
        addCase: function() {
            vm.optType = "add";
            // vm.setIsEnableEdit("1");
            vm.showPage = 2;
            vm.title = "新增案件";
            vm.initGlobalIntelligence();
            vm.intelligence.intelligenceKind = 1; // 案件
            vm.initCaseTables();

            var date = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
            $("#casedatetimepicker").val(date);
        },
        // 案件日志增、删、改
        popUpCaseLogLayer: function() {
            if (vm.optType == "query") { // 不显示保存按钮
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: "案件日志",
                    area: ['700px', '310px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#caseLogModal"),
                    btn: ['关闭'],
                    btn1: function(index) {
                        layer.close(index);
                    }
                });
            } else if (vm.optType == "add" || vm.optType == "update") { // 显示保存按钮
                var title = "";
                if (vm.caseLog.logId == "") {
                    title = "新增案件日志";
                    var date = (new Date()).Format("yyyy-MM-dd");
                    $("#caselogdatetimepicker").val(date);
                } else {
                    title = "修改案件日志";
                }
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: title,
                    area: ['700px', '330px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#caseLogModal"),
                    btn: ['保存', '取消'],
                    btn1: function(index) {
                        if (vm.caseLog.intro.trim() == "") {
                            alert("请输入日志内容");
                            return;
                        } else if (vm.caseLog.intro.trim().length > 200) {
                            alert("日志内容最多200个字");
                            return;
                        }
//                        $('#caselogdatetimepicker').datetimepicker("hide");
                        layer.close(index);
                        var dateTime = $("#caselogdatetimepicker").val();
                        if (dateTime && dateTime != "") {
                            if (dateTime.length > 10) {
                                vm.caseLog.createTime = $("#caselogdatetimepicker").val();
                            } else {
                                vm.caseLog.createTime = $("#caselogdatetimepicker").val() + " 00:00:00";
                            }
                        }
                        if (vm.caseLog.logId == '') {
                            var date = new Date();
                            vm.caseLog.logId = "temp" + date.getTime();
                            $('#caseLogTable').bootstrapTable('append', vm.caseLog);
                        } else {
                            $('#caseLogTable').bootstrapTable('updateByUniqueId', {
                                id: vm.caseLog.logId,
                                row: vm.caseLog
                            });
                        }
                        vm.initGlobalCaseLog();
                    },
                    btn2: function(index) {
//                        $('#caselogdatetimepicker').datetimepicker("hide");
                        layer.close(index);
                    }
                });
            }
        },
        addCaseLog: function() {
            vm.initGlobalCaseLog();
            vm.popUpCaseLogLayer();
        },
        queryOrUpdateCaseLogById: function(logId) {
            if (!logId || logId == "") {
                return;
            }
            var localCaseLog = $('#caseLogTable').bootstrapTable('getRowByUniqueId', logId);
            var jsonCaseLog = JSON.stringify(localCaseLog);
            vm.caseLog = JSON.parse(jsonCaseLog);
            if (vm.intelligence.createType == "1") {
                if (vm.caseLog.createTime && vm.caseLog.createTime != "" && vm.caseLog.createTime.length > 10) {
                    $("#caselogdatetimepicker").val((vm.caseLog.createTime).substring(0, 10));
                }
            } else {
                $("#caselogdatetimepicker").val(vm.caseLog.createTime);
            }
            vm.popUpCaseLogLayer();
        },
        deleteCaseLog: function() {
            var selectLogs = $('#caseLogTable').bootstrapTable('getSelections');
            if (selectLogs.length < 1) {
                alert("请至少选择一条记录");
                return;
            }
            confirm('确定要删除选中的案件日志？',
            function() {
                var logIds = [];
                for (var i = 0; i < selectLogs.length; i++) {
                    logIds.push(selectLogs[i].logId);
                    if ((selectLogs[i].logId + "").substring(0, 4) != "temp") {
                        vm.intelligence.deleteCaseLogIds.push(selectLogs[i].logId);
                    }
                }
                $('#caseLogTable').bootstrapTable('remove', {
                    field: 'logId',
                    values: logIds
                });
                alert("删除成功");
            });
        },
        deleteCaseLogById: function(logId) {
            if (!logId || logId == "") {
                return;
            }
            confirm('确定要删除选中的案件日志？',
            function() {
                if ((logId + "").substring(0, 4) != "temp") {
                    vm.intelligence.deleteCaseLogIds.push(logId);
                }
                $('#caseLogTable').bootstrapTable('removeByUniqueId', logId);
                alert("删除成功");
            });
        },
        addCaseFileUpload: function() {
            vm.initGlobalCaseFileUpload();
            vm.popUpFileUploadLayer();
        },
        deleteCaseFileUpload: function() {
            var selectFiles = $('#caseFileUploadTable').bootstrapTable('getSelections');
            if (selectFiles.length < 1) {
                alert("请至少选择一条记录");
                return;
            }
            confirm('确定要删除选中的附件？',
            function() {
                var fileIds = [];
                for (var i = 0; i < selectFiles.length; i++) {
                    fileIds.push(selectFiles[i].fileId);
                    vm.intelligence.deleteFileIds.push(selectFiles[i].fileId);
                }
                $('#caseFileUploadTable').bootstrapTable('remove', {
                    field: 'fileId',
                    values: fileIds
                });
                alert("删除成功");
            });
        },
        deleteCaseFileUploadById: function(fileId) {
            if (!fileId || fileId == "") {
                return;
            }
            confirm('确定要删除选中的附件？',
            function() {
                vm.intelligence.deleteFileIds.push(fileId);
                $('#caseFileUploadTable').bootstrapTable('removeByUniqueId', fileId);
                alert("删除成功");
            });
        },
        // 案件重置
        caseReset: function() {
            confirm('确定要重置当前页面？',
            function() {
                vm.initGlobalIntelligence();
                vm.intelligence.intelligenceKind = vm.kindDictList[1].code;
                vm.initCaseTables();
                window.parent.vm.isEditted = false;
                var date = (new Date()).Format("yyyy-MM-dd");
                $("#casedatetimepicker").val(date);
                CKEDITOR.instances.caseIntroEditor.setData('');
            });
        },
        // 案件保存
        saveCase: function(event) {
            if (vm.isButtonDisable) {
                return;
            }
            vm.isButtonDisable = true;
            vm.intelligence.intro = CKEDITOR.instances.caseIntroEditor.getData();
            if (vm.intelligence.title.trim() == '') {
                alert("请填写案件名称");
                vm.isButtonDisable = false;
                return;
            } else if (vm.intelligence.title.trim().length > 50) {
                alert("案件名称最多50个字");
                vm.isButtonDisable = false;
                return;
            }
            if (!vm.intelligence.intelligenceType) {
                alert("请选择情报种类");
                vm.isButtonDisable = false;
                return;
            }
            if (vm.investigatorNames == "") {
                vm.isButtonDisable = false;
                alert("请选择侦办人");
                return;
            }
            var handleNum = parseInt(vm.intelligence.handleNum);
            if (handleNum != 0 && (!handleNum || handleNum < 0)) {
                alert("处理数据请输入大于等于0的数字");
                vm.isButtonDisable = false;
                return;
            }
            if (handleNum > 99999999) {
                alert("处理数据条数最大为99999999");
                vm.isButtonDisable = false;
                return;
            }
            if (vm.intelligence.intro.trim() == '') {
                alert("请填写简要案情");
                vm.isButtonDisable = false;
                return;
            } else if ((vm.intelligence.intro.trim()).length > 20000) {
                alert("简要案情最多20000个字");
                return;
            }

            vm.intelligence.launchTime = $("#casedatetimepicker").val() + " 00:00:00";
            var caseLogTableData = $('#caseLogTable').bootstrapTable('getData');
            if (caseLogTableData && caseLogTableData.length > 0) {
                for (var i = 0; i < caseLogTableData.length; i++) {
                    if (("" + caseLogTableData[i].logId).substring(0, 4) == "temp") {
                        caseLogTableData[i].logId = "";
                    }
                }
            }
            vm.intelligence.caseLogList = caseLogTableData;

            var caseFileUploadTableData = $('#caseFileUploadTable').bootstrapTable('getData');
            vm.intelligence.fileList = caseFileUploadTableData;
            // console.log("历史数据案件上传保存数据>>>>>>" +
            // JSON.stringify(vm.intelligence));
            var url = "qbfx/intelligence/saveOrUpdate";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(vm.intelligence),
                success: function(r) {
                    if (r.code === 0) {
                        alert('操作成功',
                        function(index) {
                            vm.switchPage();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        // ----------------新增案件结束------------------------------------------------------------------------------------
        // 时间控件
        dateDefind: function() {
            var d, s;
            d = new Date();
            s = d.getFullYear() + "-"; // 取年份
            s = s + (d.getMonth() + 1) + "-"; // 取月份
            s += d.getDate() + " "; // 取日期
//            var pickerConfig = {
//                endDate: s,
//                format: "yyyy-mm-dd",
//                // 日期时间选择器所能够提供的最精确的时间选择视图 0, 'hour';1:'day',2:'month'
//                minView: "2",
//                language: 'zh-CN',
//                autoclose: true,
//                todayBtn: true,
//                pickerPosition: "top-left"
//            };
            laydate.render({
		    	elem: '#cluedatetimepicker' ,
		    	type: 'datetime',
		    	trigger: 'click'
		    });
            laydate.render({
		    	elem: '#casedatetimepicker' ,
		    	type: 'datetime',
		    	trigger: 'click'
		    });
            laydate.render({
		    	elem: '#clueStareDatetimePicker',
		    	trigger: 'click'
		    });
            laydate.render({
		    	elem: '#clueAuditDatetimePicker' ,
		    	trigger: 'click'
		    });
            laydate.render({
		    	elem: '#clueSecondAuditDatetimePicker',
		    	trigger: 'click'
		    });
            laydate.render({
		    	elem: '#caselogdatetimepicker',
		    	trigger: 'click'
		    });
            laydate.render({
		    	elem: '#cluedatetimepicker',
		    	trigger: 'click'
		    	
		    });
            laydate.render({
		    	elem: '#casedatetimepicker',
		    	trigger: 'click'
		    });
//            // $("#clueStareDatetimePicker").val(s);
//            // $("#clueAuditDatetimePicker").val(s);
//            $("#cluedatetimepicker").val(s);
//            $("#casedatetimepicker").val(s);
//            // $("#caselogdatetimepicker").val(s);
//            $("#clueStareDatetimePicker").datetimepicker(pickerConfig);
//            $('#clueStareDatetimePicker').datetimepicker().on('show',
//            function(ev) {
//                vm.globalDateTimePickerId = ev.currentTarget.id;
//            });
//            $("#clueAuditDatetimePicker").datetimepicker(pickerConfig);
//            $('#clueAuditDatetimePicker').datetimepicker().on('show',
//            function(ev) {
//                vm.globalDateTimePickerId = ev.currentTarget.id;
//            });
//            $("#clueSecondAuditDatetimePicker").datetimepicker(pickerConfig);
//            $('#clueSecondAuditDatetimePicker').datetimepicker().on('show',
//            function(ev) {
//                vm.globalDateTimePickerId = ev.currentTarget.id;
//            });
//            $("#caselogdatetimepicker").datetimepicker(pickerConfig);
//            $('#caselogdatetimepicker').datetimepicker().on('show',
//            function(ev) {
//                vm.globalDateTimePickerId = ev.currentTarget.id;
//            });
//            pickerConfig.pickerPosition = "bottom-right";
//            $("#cluedatetimepicker").datetimepicker(pickerConfig);
//            $('#cluedatetimepicker').datetimepicker().on('show',
//            function(ev) {
//                vm.globalDateTimePickerId = ev.currentTarget.id;
//            });
//            $("#casedatetimepicker").datetimepicker(pickerConfig);
//            $('#casedatetimepicker').datetimepicker().on('show',
//            function(ev) {
//                vm.globalDateTimePickerId = ev.currentTarget.id;
//            });

            laydate.render({
				elem: '#TimePicker',
				range: true,
				trigger: 'click'
			});
//            $('#beginTimePicker').datetimepicker().on('show',
//            function(ev) {
//                $('#endTimePicker').datetimepicker("hide");
//                vm.globalDateTimePickerId = ev.currentTarget.id;
//            });
//            $('#endTimePicker').datetimepicker().on('show',
//            function(ev) {
//                $('#beginTimePicker').datetimepicker("hide");
//                vm.globalDateTimePickerId = ev.currentTarget.id;
//            });
        },
        // 根据人员ID获取组织和人员树的数据
        getDeptAndUserTreeByUserId: function(users, ids) {
            var tempSelectUsers = [];
            var tempDepts = [];
            for (var i = 0; i < users.length; i++) {
                if (users[i].deptId.substring(0, 1) == "D") {
                    tempDepts.push(users[i]);
                    continue;
                }
                for (var j = 0; j < ids.length; j++) {
                    if (ids[j] == users[i].deptId) {
                        tempSelectUsers.push(users[i]);
                    }
                }
            }
            var selectUsers = tempSelectUsers;
            var depts = [];
            var isExist = false;
            for (var i = 0; i < tempDepts.length; i++) {
                for (var j = 0; j < tempSelectUsers.length; j++) {
                    if (tempSelectUsers[j].parentId == tempDepts[i].deptId) {
                        if (depts.length == 0) {
                            depts.push(tempDepts[i]);
                            selectUsers.push(tempDepts[i]);
                            break;
                        }
                        isExist = false;
                        for (var m = 0; m < depts.length; m++) {
                            if (depts[m].deptId == tempDepts[i].deptId) {
                                isExist = true;
                                break;
                            }
                        }
                        if (isExist == false) {
                            depts.push(tempDepts[i]);
                            selectUsers.push(tempDepts[i]);
                        }
                    }
                }
            }
            return selectUsers;
        },
        // 弹窗显示人员组织树
        showUserTree: function(flag, type) {
            vm.isShowUserTreeDisable = true;
//            $.get(baseURL + "qbfx/common/deptTree/" + type,
//            function(retUsers) {
//                if (!retUsers || retUsers.length < 1) {
//                    alert("未查询到人员信息");
//                    return;
//                }
            	var retUsers;
            	if(type == -1){
            		retUsers = vm.selectUsers;
            	}else if(type == 0){
            		retUsers = vm.selectUsers2;
            	}
                var title = "选择人员";
                if (flag == "0") { // 单选（发起人）qbfx/common/deptTree/0
                    title = "选择发起人";
                    ztree = $.fn.zTree.init($("#userTree"), Setting, retUsers);
                    var node = ztree.getNodeByParam("deptId", vm.intelligence.createUserId);
                    if (node != null) {
                        ztree.selectNode(node);
                    }
                    ztree.expandAll(true);
                    vm.popUserTree(flag, title);
                } else if (flag == "1") { // 多选（接收人）
                    if (vm.optType == "query") {
                        title = "接收人";
                        if (vm.intelligence.receiveUserIds && vm.intelligence.receiveUserIds.length > 0) {
                            var deptUsers = vm.getDeptAndUserTreeByUserId(retUsers, vm.intelligence.receiveUserIds);
                            ztree = $.fn.zTree.init($("#userTree"), Setting, deptUsers);
//                            ztree.expandAll(true);
                        } else {
                            return;
                        }
                    } else {
                        title = "选择接收人";
                        ztree = $.fn.zTree.init($("#userTree"), checkboxSetting, retUsers);
                        ztree.checkAllNodes(false);
                        if (vm.intelligence.receiveUserIds && vm.intelligence.receiveUserIds.length > 0) {
                            for (var i = 0; i < vm.intelligence.receiveUserIds.length; i++) {
                                var node = ztree.getNodeByParam("deptId", vm.intelligence.receiveUserIds[i]);
                                ztree.checkNode(node, true);
                            }
//                            ztree.expandAll(true);
                        }
                    }
                    ztree.expandAll(true);
                    vm.popUserTree(flag, title);
                } else if (flag == "2") { // 多选（流转人）
                    if (vm.optType == "query") {
                        title = "流转人/反馈人";
                        if (vm.transfer.intelligenceUserIds && vm.transfer.intelligenceUserIds.length > 0) {
                            var deptUsers = vm.getDeptAndUserTreeByUserId(retUsers, vm.transfer.intelligenceUserIds);
                            ztree = $.fn.zTree.init($("#userTree"), Setting, deptUsers);
//                            ztree.expandAll(true);
                        } else {
                            return;
                        }
                    } else {
                        title = "选择流转人/反馈人";
                        ztree = $.fn.zTree.init($("#userTree"), checkboxSetting, retUsers);
                        ztree.checkAllNodes(false);
                        if (vm.transfer.intelligenceUserIds && vm.transfer.intelligenceUserIds.length > 0) {
                            for (var i = 0; i < vm.transfer.intelligenceUserIds.length; i++) {
                                var node = ztree.getNodeByParam("deptId", vm.transfer.intelligenceUserIds[i]);
                                ztree.checkNode(node, true);
                            }
//                            ztree.expandAll(true);
                        }
                    }
                    ztree.expandAll(true);
                    vm.popUserTree(flag, title);
                } else if (flag == "3") { // 单选（审核人）
                    title = "选择审核人";
                    if (vm.intelligence.receiveUserIds && vm.intelligence.receiveUserIds.length > 0) {
                        var deptUsers = vm.getDeptAndUserTreeByUserId(retUsers, vm.intelligence.receiveUserIds);
                        ztree = $.fn.zTree.init($("#userTree"), Setting, deptUsers);
                        var node = ztree.getNodeByParam("deptId", vm.transfer.userId);
                        if (node != null) {
                            ztree.selectNode(node);
//                            ztree.expandAll(true);
                        }
                        ztree.expandAll(true);
                        vm.popUserTree(flag, title);
                    } else {
                        alert("该项中的人员为【接收人】选项中选择的人员，请先填写【接收人】选项");
                    }
                } else if (flag == "7") { // 单选（核查人）
                    title = "选择核查人";
                    ztree = $.fn.zTree.init($("#userTree"), Setting, retUsers);
                    var node = ztree.getNodeByParam("deptId", vm.intelligence.createUserId);
                    if (node != null) {
                        ztree.selectNode(node);
//                        ztree.expandAll(true);
                    }
                    ztree.expandAll(true);
                    vm.popUserTree(flag, title);
                } else if (flag == "4") { // 单选（盯办人：表格）
                    title = "选择盯办人";
                    if (vm.intelligence.stareUserIds && vm.intelligence.stareUserIds.length > 0) {
                        var deptUsers = vm.getDeptAndUserTreeByUserId(retUsers, vm.intelligence.stareUserIds);
                        ztree = $.fn.zTree.init($("#userTree"), Setting, deptUsers);
                        var node = ztree.getNodeByParam("deptId", vm.stare.userId);
                        if (node != null) {
                            ztree.selectNode(node);
//                            ztree.expandAll(true);
                        }
                        ztree.expandAll(true);
                        vm.popUserTree(flag, title);
                    } else {
                        alert("该项中的人员为【盯办人】选项中选择的人员，请先填写【盯办人】选项");
                    }
                } else if (flag == "5") { // 多选（侦办人）
                    if (vm.optType == "query") {
                        title = "侦办人";
                        if (vm.intelligence.receiveUserIds && vm.intelligence.receiveUserIds.length > 0) {
                            var deptUsers = vm.getDeptAndUserTreeByUserId(retUsers, vm.intelligence.receiveUserIds);
                            ztree = $.fn.zTree.init($("#userTree"), Setting, deptUsers);
//                            ztree.expandAll(true);
                        } else {
                            return;
                        }
                    } else {
                        title = "选择侦办人";
                        ztree = $.fn.zTree.init($("#userTree"), checkboxSetting, retUsers);
                        ztree.checkAllNodes(false);
                        if (vm.intelligence.receiveUserIds && vm.intelligence.receiveUserIds.length > 0) {
                            for (var i = 0; i < vm.intelligence.receiveUserIds.length; i++) {
                                var node = ztree.getNodeByParam("deptId", vm.intelligence.receiveUserIds[i]);
                                ztree.checkNode(node, true);
                            }
//                            ztree.expandAll(true);
                        }
                    }
                    ztree.expandAll(true);
                    vm.popUserTree(flag, title);
                } else if (flag == "6") { // 多选（盯办人：非表格）
                    if (vm.optType == "query") {
                        title = "盯办人";
                        if (vm.intelligence.stareUserIds && vm.intelligence.stareUserIds.length > 0) {
                            var deptUsers = vm.getDeptAndUserTreeByUserId(retUsers, vm.intelligence.stareUserIds);
                            ztree = $.fn.zTree.init($("#userTree"), Setting, deptUsers);
//                            ztree.expandAll(true);
                        } else {
                            return;
                        }
                    } else {
                        title = "选择盯办人";
                        ztree = $.fn.zTree.init($("#userTree"), checkboxSetting, retUsers);
                        ztree.checkAllNodes(false);
                        if (vm.intelligence.stareUserIds && vm.intelligence.stareUserIds.length > 0) {
                            for (var i = 0; i < vm.intelligence.stareUserIds.length; i++) {
                                var node = ztree.getNodeByParam("deptId", vm.intelligence.stareUserIds[i]);
                                ztree.checkNode(node, true);
                            }
//                            ztree.expandAll(true);
                        }
                    }
                    ztree.expandAll(true);
                    vm.popUserTree(flag, title);
                }
                
                vm.isShowUserTreeDisable = false;
//            });
        },
        popUserTree: function(flag, title) {
            if (vm.optType == "query") {
                layer.open({
                    type: 1,
                    offset: '50px',
                    skin: 'layui-layer-molv',
                    title: title,
                    area: ['350px', '460px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#userLayer"),
                    btn: ['关闭']
                });
            } else {
                layer.open({
                    type: 1,
                    offset: '50px',
                    skin: 'layui-layer-molv',
                    title: title,
                    area: ['350px', '460px'],
                    shadeClose: false,
                    // shade:false,
                    content: jQuery("#userLayer"),
                    btn: ['确定', '取消'],
                    btn1: function(index) {
                        if (flag == "0") { // 单选（发起人）
                            var nodes = ztree.getSelectedNodes();
                            if (nodes.length < 1) {
                                alert("请选择发起人");
                                return;
                            }
                            // var node =
                            // nodes[0].getParentNode();
                            var node = nodes[0].children;
                            if (node && node.length > 0) {
                                alert("请选择人员，不能选择组织名称");
                                return;
                            }
                            vm.intelligence.createUserName = nodes[0].name; // 发起人
                            vm.intelligence.createUserId = nodes[0].deptId; // 发起人id
                            var parentNode = ztree.getNodeByParam("deptId", nodes[0].parentId);
                            vm.intelligence.createDeptName = parentNode.name; // 发起单位名称
                            vm.intelligence.deptId = parentNode.deptId.substring(1); // 发起单位id(包含前缀D)
                        } else if (flag == "1") { // 多选（接收人）
                            vm.intelligence.receiveUserIds = [];
                            vm.receiveUserNames = "";
                            var nodes = ztree.getCheckedNodes();
                            if (nodes && nodes.length > 0) {
                                for (var i = 0; i < nodes.length; i++) {
                                    if (nodes[i].deptId.substring(0, 1) == "D") {
                                        continue;
                                    }
                                    vm.receiveUserNames = vm.receiveUserNames + nodes[i].name + ";";
                                    vm.intelligence.receiveUserIds.push(nodes[i].deptId);
                                }
                                window.parent.vm.isEditted = true;
                            }
                        } else if (flag == "2") { // 多选（流转人）
                            vm.transfer.intelligenceUserIds = [];
                            vm.transfer.transferUserNames = "";
                            var nodes = ztree.getCheckedNodes();
                            if (nodes && nodes.length > 0) {
                                for (var i = 0; i < nodes.length; i++) {
                                    if (nodes[i].deptId.substring(0, 1) == "D") {
                                        continue;
                                    }
                                    vm.transfer.transferUserNames = vm.transfer.transferUserNames + nodes[i].name + ";";
                                    vm.transfer.intelligenceUserIds.push(nodes[i].deptId);
                                }
                            }
                        } else if (flag == "3") { // 单选（审核人）
                            var nodes = ztree.getSelectedNodes();
                            if (nodes.length < 1) {
                                alert("请选择审核人");
                                return;
                            }
                            // var node =
                            // nodes[0].getParentNode();
                            var node = nodes[0].children;
                            if (node && node.length > 0) {
                                alert("请选择人员，不能选择组织名称");
                                return;
                            }
                            vm.transfer.username = nodes[0].name; // 审核人
                            vm.transfer.userId = nodes[0].deptId; // 审核人id
                            var parentNode = ztree.getNodeByParam("deptId", nodes[0].parentId);
                            vm.transfer.auditDept = parentNode.name; // 审核单位名称
                        } else if (flag == "4") { // 单选（盯办人）
                            var nodes = ztree.getSelectedNodes();
                            if (nodes.length < 1) {
                                alert("请选择盯办人");
                                return;
                            }
                            // var node =
                            // nodes[0].getParentNode();
                            var node = nodes[0].children;
                            if (node && node.length > 0) {
                                alert("请选择人员，不能选择组织名称");
                                return;
                            }
                            vm.stare.username = nodes[0].name; // 盯办人
                            vm.stare.userId = nodes[0].deptId; // 盯办人id
                        } else if (flag == "5") { // 多选（侦办人）
                            vm.intelligence.receiveUserIds = [];
                            vm.investigatorNames = "";
                            var nodes = ztree.getCheckedNodes();
                            if (nodes && nodes.length > 0) {
                                for (var i = 0; i < nodes.length; i++) {
                                    if (nodes[i].deptId.substring(0, 1) == "D") {
                                        continue;
                                    }
                                    vm.investigatorNames = vm.investigatorNames + nodes[i].name + ";";
                                    vm.intelligence.receiveUserIds.push(nodes[i].deptId);
                                }
                                window.parent.vm.isEditted = true;
                            }
                        } else if (flag == "6") { // 多选（盯办人）
                            vm.intelligence.stareUserIds = [];
                            vm.stareUserNames = "";
                            var nodes = ztree.getCheckedNodes();
                            if (nodes && nodes.length > 0) {
                                for (var i = 0; i < nodes.length; i++) {
                                    if (nodes[i].deptId.substring(0, 1) == "D") {
                                        continue;
                                    }
                                    vm.stareUserNames = vm.stareUserNames + nodes[i].name + ";";
                                    vm.intelligence.stareUserIds.push(nodes[i].deptId);
                                }
                                window.parent.vm.isEditted = true;
                            }
                        } else if (flag == "7") { // 单选（核查人）
                            var nodes = ztree.getSelectedNodes();
                            if (nodes.length < 1) {
                                alert("请选择核查人");
                                return;
                            }
                            var node = nodes[0].children;
                            if (node && node.length > 0) {
                                alert("请选择人员，不能选择组织名称");
                                return;
                            }
                            vm.checkIn.username = nodes[0].name; // 核查人
                            vm.checkIn.userId = nodes[0].deptId; // 核查人id
                        }

                        layer.close(index);
                    }
                });
            }
        },
        // 弹窗显示组织机构树
        showDeptTree: function(flag) {
            // if(!vm.selectDept || vm.selectDept == ""){
            // return;
            // }
            var tempDepts = [];
            for (var i = 0; i < vm.selectUsers.length; i++) {
                if (vm.selectUsers[i].deptId.substring(0, 1) == "D") {
                    tempDepts.push(vm.selectUsers[i]);
                }
            }
            ztree = $.fn.zTree.init($("#deptTree"), Setting, tempDepts);
            var node = null;
            if (flag == 0) {
                if (vm.searchParams.deptId && ("" + vm.searchParams.deptId).substring(0, 1) == "D") {
                    node = ztree.getNodeByParam("deptId", vm.searchParams.deptId);
                } else {
                    node = ztree.getNodeByParam("deptId", "D" + vm.searchParams.deptId);
                }
            } else if (flag == 1) {
                if (vm.intelligence.deptId && ("" + vm.intelligence.deptId).substring(0, 1) == "D") {
                    node = ztree.getNodeByParam("deptId", vm.intelligence.deptId);
                } else {
                    node = ztree.getNodeByParam("deptId", "D" + vm.intelligence.deptId);
                }
            }

            if (node != null) {
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
                // shade:false,
                content: jQuery("#deptLayer"),
                btn: ['确定', '取消'],
                btn1: function(index) {
                    var nodes = ztree.getSelectedNodes();
                    if (flag == 0) {
                        vm.searchParams.createDeptName = nodes[0].name; // 发起单位
                        vm.searchParams.deptId = nodes[0].deptId.substring(1); // 发起单位id
                    } else if (flag == 1) {
                        vm.intelligence.createDeptName = nodes[0].name; // 发起单位
                        vm.intelligence.deptId = nodes[0].deptId; // 发起单位id
                    }

                    layer.close(index);
                }
            });
        },
        sexFormatter: function(code) {
            if (code && code != "" && this.sexList && this.sexList.length > 0) {
                for (var i = 0; i < this.sexList.length; i++) {
                    if (this.sexList[i].code == code) {
                        return this.sexList[i].value;
                    }
                }
            }
            return code;
        },
        auditSuggestionFormatter: function(code) {
            if (code && code != "") {
                return this.auditSuggestionList[code].value;
            }
            return "";
        },
        intelligenceTypeFormatter: function(code) {
            if (code && code != "") {
                for (var i = 0; i < this.typeDictList.length; i++) {
                    if (this.typeDictList[i].code == code) {
                        return this.typeDictList[i].value;
                    }
                }
                return code;
            }
            return "";
        },
        intelligenceKindFormatter: function(code) {
            if (code && code != "") {
                for (var i = 0; i < this.kindDictList.length; i++) {
                    if (this.kindDictList[i].code == code) {
                        return this.kindDictList[i].value;
                    }
                }
                return code;
            }
            return "";
        },
        casePersonFormatter: function(code) {
            var str = "";
            // if(vm.optType == "add" || vm.optType == "update"){
            // str = '<a style="cursor: pointer" title="修改"
            // onclick="vm.queryOrUpdateCasePersonById(\''+ code
            // +'\')"><span class="glyphicon glyphicon-edit"
            // aria-hidden="true"></span></a>';
            // str += '<a style="cursor: pointer" title="删除"
            // onclick="vm.deleteCasePersonById(\''+ code +'\')"><span
            // class="glyphicon glyphicon-trash"
            // aria-hidden="true"></span></a>';
            // }else if(vm.optType == "query"){
            // str = '<a style="cursor: pointer" title="查看"
            // onclick="vm.queryOrUpdateCasePersonById(\''+ code
            // +'\')"><span class="glyphicon glyphicon-eye-open"
            // aria-hidden="true"></span></a>';
            // }
            if (vm.optType == "add" || vm.optType == "update") {
                str = '<a style="cursor: pointer" title="修改" onclick="vm.editPerson(\'' + code + '\')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
                str += '<a style="cursor: pointer" title="删除" onclick="vm.removePerson(\'' + code + '\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
            } else if (vm.optType == "query") {
                str = '<a style="cursor: pointer" title="查看" onclick="vm.viewPerson(\'' + code + '\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
            }

            return str;
        },
        stareFormatter: function(code) {
            var str = "";
            if (vm.optType == "add" || vm.optType == "update") {
                str = '<a style="cursor: pointer" title="修改" onclick="vm.queryOrUpdateStarePersonById(\'' + code + '\')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
                str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteStarePersonById(\'' + code + '\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
            } else if (vm.optType == "query") {
                str = '<a style="cursor: pointer" title="查看" onclick="vm.queryOrUpdateStarePersonById(\'' + code + '\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
            }
            return str;
        },
        auditFormatter: function(code) {
            var str = "";
            if (vm.optType == "add" || vm.optType == "update") {
                str = '<a style="cursor: pointer" title="修改" onclick="vm.queryOrUpdateAuditPersonById(\'' + code + '\')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
                str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteAuditPersonById(\'' + code + '\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
            } else if (vm.optType == "query") {
                str = '<a style="cursor: pointer" title="查看" onclick="vm.viewTransferDetail(\'' + code + '\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
            }
            return str;
        },
        secondAuditFormatter: function(code) {
            var str = "";
            if (vm.optType == "add" || vm.optType == "update") {
                str = '<a style="cursor: pointer" title="修改" onclick="vm.queryOrUpdateSecondAuditById(\'' + code + '\')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
                str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteSecondAuditById(\'' + code + '\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
            } else if (vm.optType == "query") {
                str = '<a style="cursor: pointer" title="查看" onclick="vm.queryOrUpdateSecondAuditById(\'' + code + '\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
            }
            return str;
        },
        initRelatedIntelligenceFormatter: function(code) {
            var str = "";
            if (vm.optType == "add" || vm.optType == "update") {
                str = '<a style="cursor: pointer" title="查看" onclick="vm.checkRelatedIntelligenceById(' + code + ')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
                str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteRelatedIntelligenceById(' + code + ')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
            } else if (vm.optType == "query") {
                str = '<a style="cursor: pointer" title="查看" onclick="vm.checkRelatedIntelligenceById(' + code + ')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
            }
            return str;
        },
        clueFileUploadFormatter: function(code) {
            var str = "";
            if (vm.optType == "add" || vm.optType == "update") {
                str = '<a style="cursor: pointer" title="查看" onclick="vm.checkFileUploadById(\'' + code + '\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
                str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteClueFileUploadById(\'' + code + '\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
            } else if (vm.optType == "query") {
                str = '<a style="cursor: pointer" title="查看" onclick="vm.checkFileUploadById(\'' + code + '\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
            }
            return str;
        },
        caseLogFormatter: function(code) {
            var str = "";
            if (vm.optType == "add" || vm.optType == "update") {
                str = '<a style="cursor: pointer" title="修改" onclick="vm.queryOrUpdateCaseLogById(\'' + code + '\')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></a>';
                str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteCaseLogById(\'' + code + '\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
            } else if (vm.optType == "query") {
                str = '<a style="cursor: pointer" title="查看" onclick="vm.queryOrUpdateCaseLogById(\'' + code + '\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
            }
            return str;
        },
        caseFileUploadFormatter: function(code) {
            var str = "";
            if (vm.optType == "add" || vm.optType == "update") {
                str = '<a style="cursor: pointer" title="查看" onclick="vm.checkFileUploadById(\'' + code + '\')"><span class="glyphicon  glyphicon-eye-open" aria-hidden="true"></span></a>';
                str += '<a style="cursor: pointer" title="删除" onclick="vm.deleteCaseFileUploadById(\'' + code + '\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
            } else if (vm.optType == "query") {
                str = '<a style="cursor: pointer" title="查看" onclick="vm.checkFileUploadById(\'' + code + '\')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
            }
            return str;
        },
        dateFormatter: function(code) {
            if (code && code != "" && code.length > 10) return code.substring(0, 10);
            else return "";
        },
        personSourceFormatter: function(value, row) {
            if (row.personId.toString().startsWith('T')) {
                return '<span class="label label-success" style="padding:3px;"><i class="fa fa-superpowers" aria-hidden="true"></i> 自动识别</span>';
            } else {
                return '<span class="label label-warning" style="padding:3px;"><i class="fa fa-database" aria-hidden="true"></i> 全息档案</span>';
            }
        },
        promptFormatter: function(value, row) {
            return "<span title=" + value + ">" + value + "</span>";
        },
        /**
				 * 内容自动识别
				 */
        introHandler: function() {
            vm.disableIntroHandler = true;
            /*
					 * for (var index in personList) {
					 * console.log("personList["++"] : " +
					 * JSON.stringify(personList[index]));
					 * if(personList[index].personId.toString().startsWith('T')){
					 * $("#casePersonTable").bootstrapTable('removeByUniqueId',personList[index].personId); } }
					 */
            /*
					 * for(var j = 0,len = personList.length; j < len; j++){ }
					 */
            /*
					 * personList.forEach(function(person,i){
					 * if(person.personId.toString().startsWith('T')){
					 * personIds.push(person.personId); } });
					 */
            //var textInfo = CKEDITOR.instances.clueIntroEditor.document.getBody().getText();
            var textInfo = CKEDITOR.instances.clueIntroEditor.getData();
            // 2、内容自动识别
            $.ajax({
                type: "POST",
                url: "http://" + window.parent.vm.variableHighLightHost + "/ES/highLight",
                contentType: "application/x-www-form-urlencoded;charset=utf-8",
                // msg = msg.replace(/&npsp;/ig, ''); //去掉npsp
                // data: { text:
                // CKEDITOR.instances.clueIntroEditor.getData().replace(/<\/?[^>]*>/g,
                // '')},
                // data: { text:
                // CKEDITOR.instances.clueIntroEditor.getData().replace(/&middot;/ig,
                // '.')},
                data: {
                    text: textInfo
                },
                dataType: "text",
                success: function(r) {
                    CKEDITOR.instances.clueIntroEditor.setData(r);
                    // 涉案人员填充
                    vm.personFill(textInfo);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status); // 状态码
                    console.log(XMLHttpRequest.readyState); // 状态
                    console.log(textStatus); // 错误信息
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
				 * 
				 * @returns
				 */
        personFill: function(textInfo) {
            // 3、人员自动填充
            $.ajax({
                type: "POST",
                url: "http://" + window.parent.vm.variableHighLightHost + "/ES/infoExtr",
                contentType: "application/x-www-form-urlencoded;charset=utf-8",
                data: {
                    text: textInfo
                },
                // data: { text:
                // CKEDITOR.instances.clueIntroEditor.getData().replace(/&middot;/ig,
                // '.')},
                dataType: "json",
                success: function(r) {
                    // 1、删除 上一次自动识别填充的 涉案人员
                    var personList = $("#casePersonTable").bootstrapTable('getData');
                    var personListDB = [];
                    for (var index in personList) {
                        if (personList[index].personId.toString().startsWith('T') == false) {
                            personListDB.push(personList[index]);
                        }
                    }
                    // 涉及 JS深拷贝问题，此处使用 JSON 串转换
                    var personListDBStr = JSON.stringify(personListDB);
                    $('#casePersonTable').bootstrapTable('removeAll');
                    personListDB = JSON.parse(personListDBStr);
                    $('#casePersonTable').bootstrapTable('append', personListDB);
                    // 识别的涉案人员列表 不为空
                    if (r.personList.length > 0) {
                        var queryNumFlag = true;
                        // 为自动填充的涉案人员填充id
                        for (var index in r.personList) {
                            // 涉案人员id 默认以T开头
                            r.personList[index].personId = "T" + index;
                            if (r.personList[index].numId != "") {
                                // 查看是否已经加载到 bootstrapTable中
                                queryNumFlag = true;
                                for (var j in personListDB) {
                                    if (personListDB[j].numId == r.personList[index].numId) {
                                        queryNumFlag = false;
                                        break;
                                    }
                                }
                                // 未加载到 bootstrapTable中，查询数据库
                                if (queryNumFlag == true) {
                                    vm.getPersonByNumId(r.personList[index]);
                                }
                            } else {
                                $("#casePersonTable").bootstrapTable('append', r.personList[index]);
                            }
                        }
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status); // 状态码
                    console.log(XMLHttpRequest.readyState); // 状态
                    console.log(textStatus); // 错误信息
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
        personAnalysis: function(flag,page) {
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
                url: "http://"+ window.parent.vm.variableHighLightHost +"/ES/esSearch4AllText",
                contentType: "application/x-www-form-urlencoded;charset=utf-8",
                data: { text: searchText, userId: user.userId, page: page, intelligenceId: intelligenceId},	
                dataType: "json",
                success: function(r) {
                    if (r.page.list == undefined) {
                        alert("服务器连接失败，请联系管理员！");
                    } else {
                        //没有查询到数据
                        if (r.page.list.length == 0) {
                            vm.rightSearchResult = 2;
                        } else {
                            vm.rightSearchResult = 3;
                            vm.rightSearchList = r.page.list;
                            vm.totalPage = r.page.totalPage;
                        }
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status); // 状态码
                    console.log(XMLHttpRequest.readyState); // 状态
                    console.log(textStatus); // 错误信息   
                },
                complete: function(XMLHttpRequest, textStatus) {}
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
        /**
				 * 人员查询
				 */
        searchPersonLayer: function() {
            layer.open({
                type: 1,
                skin: 'layui-layer-molv',
                title: "人员查询",
                area: ['740px', '450px'],
                shadeClose: false,
                content: jQuery("#searchPersonLayer"),
                btn: ['关闭'],
                btn1: function(index) {
                    layer.close(index);
                }
            });

            vm.personSearchParams = {};

            //获取已经选择的 编号列表，下次查询不再显示
            var personList = $("#casePersonTable").bootstrapTable('getData');
            var selectedIds = [];
            if (personList.length > 0) {
                for (var i in personList) {
                	if (personList[i].personId.toString().startsWith('T') == false) {
                		selectedIds.push(parseInt(personList[i].personId));
                	}
                }
            }
            //已选择的id列表 
            if (selectedIds.length > 0) {
                vm.personSearchParams.selectedIds = JSON.stringify(selectedIds).replace('[', '(').replace(']', ')');
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
                colModel: [{
                    label: '序号',
                    name: 'personId',
                    index: 'person_id',
                    hidden: true,
                    key: true
                },
                {
                    label: '姓名',
                    align: 'center',
                    sortable: false,
                    name: 'name',
                    index: 'name',
                    width: 100
                },
                {
                    label: '昵称',
                    align: 'center',
                    sortable: false,
                    name: 'nickname',
                    index: 'nickname',
                    width: 100
                },
                {
                    label: '性别',
                    align: 'center',
                    name: 'sex',
                    index: 'sex',
                    width: 50,
                    formatter: function(value, options, row) {
                        for (var i = 0; i < vm.sexList.length; i++) {
                            if (vm.sexList[i].code == value) {
                                return vm.sexList[i].value;
                            }
                        }
                        return "";
                    }
                },
                {
                    label: '族别',
                    align: 'center',
                    sortable: false,
                    name: 'nation',
                    index: 'nation',
                    width: 100
                },
                {
                    label: '身份证号',
                    align: 'center',
                    sortable: false,
                    name: 'numId',
                    index: 'numId',
                    width: 150
                },
                {
                    label: '户籍地',
                    hidden: true,
                    name: 'placeHome',
                    index: 'placeHome',
                    width: 150
                },
                {
                    label: '操作',
                    name: 'operate',
                    align: 'center',
                    sortable: false,
                    width: 60,
                    formatter: function(value, grid, row, state) {
                        return '<a onclick="vm.addPerson(' + grid.rowId + ')" style="cursor: pointer" title="增加"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>'
                    }
                }],
                viewrecords: true,
                height: 220,
                rowNum: 5,
                // rowList : [5,10,15],
                rownumbers: true,
                rownumWidth: 25,
                autowidth: true,
                width: '715px',
                // multiselect: true,
                pager: "#jqGridPagerPerson",
                jsonReader: {
                    root: "page.list",
                    page: "page.currPage",
                    total: "page.totalPage",
                    records: "page.totalCount"
                },
                prmNames: {
                    page: "page",
                    rows: "limit",
                    order: "order"
                },
                gridComplete: function() {
                    // 隐藏grid底部滚动条
                    $("#jqGridPerson").closest(".ui-jqgrid-bdiv").css({
                        "overflow-x": "auto"
                    });

                },
                postData: vm.personSearchParams
            });
        },
        /**
				 * 涉案人员 查询
				 */
        queryPerson: function() {
            // 获取已经选择的 编号列表，下次查询不再显示
            var personList = $("#casePersonTable").bootstrapTable('getData');
            var selectedIds = [];
            if (personList.length > 0) {
                for (var i in personList) {
                    if (personList[i].personId.toString().startsWith('T') == false) {
                        selectedIds.push(parseInt(personList[i].personId));
                    }
                }
            }
            // 已选择的id列表
            if (selectedIds.length > 0) {
                vm.personSearchParams.selectedIds = JSON.stringify(selectedIds).replace('[', '(').replace(']', ')');
            }

            // var page =
            // $("#jqGridPerson").jqGrid('getGridParam','page');
            $("#jqGridPerson").jqGrid('setGridParam', {
                postData: vm.personSearchParams,
                page: 1
            }).trigger("reloadGrid");
        },
        addPerson: function(personId) {
            var person = $("#jqGridPerson").jqGrid('getRowData', personId);
            layer.closeAll();
            $("#casePersonTable").bootstrapTable('append', person);
        },
        viewPerson: function(personId) {
            var url = 'modules/qxda/person.html';
            var type_id = 'V-' + personId;
            window.parent.goNext(url, type_id, null);
        },
        editPerson: function(personId) {
            var url = 'modules/qxda/person.html';
            var type_id = 'U-' + personId;
            var dataParams = null;
            // 自动识别出的涉案人员
            if (personId.toString().startsWith('T')) {
                dataParams = $('#casePersonTable').bootstrapTable('getRowByUniqueId', personId);
            }
            var iframeId = self.frameElement.getAttribute('id');
            window.parent.goNext(url, type_id, null, dataParams, iframeId);
        },
        //自动关联查询
        searchAutoIntelligence: function() {
        	return;
            var allNumIds = $("#personTable").bootstrapTable('getData');
            $("#autoIntelligenceTable").bootstrapTable('removeAll');
            $.ajaxSettings.async = false;
            for (var j = 0; j < allNumIds.length; j++) {
                //if(!personList[index].personId.toString().startsWith('T')){
                $.get(baseURL + "qbfx/intelligence/autoList/-1/" + allNumIds[j].personId,
                function(r) {
                    vm.autoList = r.autoList;
                    for (var i = 0; i < vm.autoList.length; i++) {
                        vm.autoList[i].state = 0;
                        $("#autoIntelligenceTable").bootstrapTable('append', vm.autoList[i]);
                    }
                });
                //}
            }
            $.ajaxSettings.async = true;
        },
        // 删除涉案人员
        removePerson: function(personId) {
            // var personId =
            // $("#casePersonTable").bootstrapTable('getSelections')[0].personId;
            confirm('确定要删除涉案人员？',
            function() {
                $("#casePersonTable").bootstrapTable('removeByUniqueId', personId);
                vm.searchAutoIntelligence();
                alert("删除成功");
            });

        },
        jumpToAddPersonPage: function() {
            var url = 'modules/qxda/person.html';
            var type_id = 'A';
            var iframeId = self.frameElement.getAttribute('id');
            window.parent.goNext(url, type_id, null, null, iframeId);
        },
        callbackGoNext: function(params) {
            // 自动识别涉案人员
            if (params.personIdTemp != undefined && params.personIdTemp != null) {
                // 1、判断 涉案人员 是否还存在，是否在编辑时被 执行了删除操作
                var person = $('#casePersonTable').bootstrapTable('getRowByUniqueId', params.personIdTemp);
                if (person != undefined && person != null) {
                    // 更新
                    $("#casePersonTable").bootstrapTable('updateByUniqueId', {
                        id: params.personIdTemp,
                        row: params
                    });
                }
            }
            // 数据库已存在人员 或者 新增人员
            else {
                // 1、判断 涉案人员 是否还存在，是否在编辑时被 执行了删除操作
                var person = $('#casePersonTable').bootstrapTable('getRowByUniqueId', params.personId);
                if (person != undefined && person != null) {
                    // 更新
                    $("#casePersonTable").bootstrapTable('updateByUniqueId', {
                        id: params.personId,
                        row: params
                    });
                } else {
                    $("#casePersonTable").bootstrapTable('append', params);
                }
            }
            // 锚点定位
            // document.body.scrollTop =
            // $('#casePersonTable').offsetTop;
            var t = $('#casePersonTable').offset().top;
            $(window).scrollTop(t - 50);
            // $('#casePersonTable').scrollIntoView();
        },
        /******** 父页面调用 B ********/
		resize: function(){
			$(window).resize();
		},
		/******** 父页面调用 E ********/
    },
    created: function() {
        this.loadingDict();
        // 人员组织数据
        this.selectUsers = window.parent.vm.selectUsers;
        this.selectUsers2 = window.parent.vm.selectUsers2;
        // 页面参数
        var params = self.frameElement.getAttribute('params');
        // 点击菜单列表进入 ，防止表格加载时 展示区域未定义
        if (params == 'undefined' || params == 'null') {
            this.showPage = 0;
        }
    },
    mounted: function() {
        // this.initPage();
    }
});
function progressHandlingFunction(e) {
    // console.log("progressHandlingFunction=====>"+1);
    if (e.lengthComputable) {
        var percent = e.loaded / e.total;
        $("#progress-bar").css("width", (percent * 500));
    }
}
function transferTypeChange(){
	var val=$('input:radio[name="transferType"]:checked').val();
	//流转
	if(val == 0){
		vm.showTransferType = 0;
	} 
	//确认办结
	else {
		if(vm.intelligence.result && vm.intelligence.result !=''){
    		alert("审核列表中已存在确认办结的信息");
    		$("#handleRadio1").prop("checked", true);
    		return;
    	}
		vm.showTransferType = 1;
	}
}