(function($) {
    var pageDataChange = false    //默认标识页面数据未发生改变
    /*监控页面数据是否发生变化*/
    $.fn.MonitorDataChange = function(options) {
        var tagName = new Array('Input', 'Select', 'Textarea');
        var ctrlIds = [];
        var deafult = {
            arrTags: tagName,   //需监控控件的tagName属性数组
            arrCtrls: ctrlIds   //不监控的控件ID
        };
        var ops = $.extend(deafult, options);

        for (var i = 0; i < ops.arrTags.length; i++) {
            $(ops.arrTags[i]).each(function() {
                if (ops.arrCtrls.length == 0) {
                    $(this).bind('change', function() {
                        pageDataChange = true;
                    });
                }
                else {
                    var flag = false;
                    for (var j = 0; j < ops.arrCtrls.length; j++) {
                        if ($(this).attr('id') == ops.arrCtrls[j]) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        $(this).bind('change', function() {
                            pageDataChange = true;
                        });
                    }
                }
            });
        }
        return this;
    };
    /*返回页面数据是否发生变化*/
    $.fn.getValue = function() {
        return pageDataChange;
    };
})(jQuery);