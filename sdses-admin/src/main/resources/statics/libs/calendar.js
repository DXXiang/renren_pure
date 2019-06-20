(function($) {
	var eCalendar = function(options, object) {
		// Initializing global variables
		var adDay = new Date().getDate();
		var adMonth = new Date().getMonth();
		var adYear = new Date().getFullYear();
		var dDay = adDay;
		var dMonth = adMonth;
		var dYear = adYear;
		var instance = object;

		var settings = $.extend({}, $.fn.eCalendar.defaults, options);

		function lpad(value, length, pad) {
			if(typeof pad == 'undefined') {
				pad = '0';
			}
			var p;
			for(var i = 0; i < length; i++) {
				p += pad;
			}
			return(p + value).slice(-length);
		}

		var mouseOver = function() {
			$(this).addClass('c-nav-btn-over');
		};
		var mouseLeave = function() {
			$(this).removeClass('c-nav-btn-over');
		};

		var gotoDetailPage = function(logId){
			window.parent.goNext("modules/grrz/personallog.html", "V-"+logId, null);
		};
		
		var mouseOverEvent = function() {
//			$(".c-event-list").scrollTop(0);
//			$(this).addClass('c-event-over');
//			var d = $(this).attr('data-event-day');
//			$('div.c-event-item[data-event-day="' + d + '"]').addClass('c-event-over1').host;
//			$(".c-event-list").scrollTop($('div.c-event-item[data-event-day="' + d + '"]').position().top - $('div.c-event-item[data-event-day="' + d + '"]').height())
			
			var d = $(this).attr('data-event-day');
			for(var i = 0; i < settings.events.length; i++) {
				var date = new Date(settings.events[i].datetime);
				if(date.getMonth() == dMonth && date.getFullYear() == dYear && date.getDate() == d) {
//					if(settings.events[i].logId.length == 1){
//						window.parent.goNext("modules/grrz/personallog.html", "V-"+settings.events[i].logId[0], null);
//					}else if(settings.events[i].logId.length > 1){
//						var param = {"remindTimeB" : (settings.events[i].datetime).substring(0,10)+" 00:00:00","remindTimeE" : (settings.events[i].datetime).substring(0,10)+" 23:59:59"}
//						window.parent.goNext("modules/grrz/personallog.html", null, null,param);
//					}
					var x= $(this).position().top; 
					var y = $(this).position().left; 
					var cBody = $('div.c-grid');
					var floatWindow = $('<div/>').addClass('c-event-window');
					var ul = $('<ul/>');
					for(let j = 0; j < settings.events[i].titles.length; j++){
						var li;
						if(settings.events[i].titles.length > 1){
							li = $('<li><a style="cursor:pointer;">'+ (j+1) + '. '+ settings.events[i].titles[j] +'</a></li>');
						}else{
							li = $('<li><a style="cursor:pointer;">'+ settings.events[i].titles[j] +'</a></li>');
						}
						li.on('click', function(){
							window.parent.goNext("modules/grrz/personallog.html", "V-"+settings.events[i].logId[j], null);
						});
						ul.append(li);
					}
					floatWindow.append(ul);
					floatWindow.offset({top:x-(settings.events[i].titles.length*22 + 8),left:y});
					floatWindow.on('mouseleave', floatWindowMouseLeaveEvent);
					cBody.append(floatWindow);
					floatWindow.show();
					break;
					
				}
			}
		};
		
		var floatWindowMouseLeaveEvent = function(e){
			$(this).remove();
		};

		var mouseLeaveEvent = function(e) {
//			$(this).removeClass('c-event-over')
//			var d = $(this).attr('data-event-day');
//			$('div.c-event-item[data-event-day="' + d + '"]').removeClass('c-event-over1');

			if(e.toElement){
				var classNames = e.toElement.className;
				if (!classNames || classNames == "" || classNames.indexOf("c-event-window") < 0) {
					var floatWindow = $('div.c-event-window');
					floatWindow.remove();
				}
			}
		};
		var mouseOverItem = function() {
			$(this).addClass('c-event-over1');
			var d = $(this).attr('data-event-day');
			$('div.c-event[data-event-day="' + d + '"]').addClass('c-event-over');
		};
		var mouseLeaveItem = function() {
			$(this).removeClass('c-event-over1')
			var d = $(this).attr('data-event-day');
			$('div.c-event[data-event-day="' + d + '"]').removeClass('c-event-over');
		};

		var clickitem = function() {
			var d = $(this).attr('data-event-day');
			
			for(var i = 0; i < settings.events.length; i++) {
				var date = new Date(settings.events[i].datetime);
				if(date.getMonth() == dMonth && date.getFullYear() == dYear && date.getDate() == d) {
					if(settings.events[i].logId.length == 1){
						window.parent.goNext("modules/grrz/personallog.html", "V-"+settings.events[i].logId[0], null);
					}else if(settings.events[i].logId.length > 1){
						var param = {"remindTimeB" : (settings.events[i].datetime).substring(0,10)+" 00:00:00","remindTimeE" : (settings.events[i].datetime).substring(0,10)+" 23:59:59"}
						window.parent.goNext("modules/grrz/personallog.html", null, null,param);
					}
					break;
				}
			}
			
//			$('div.c-event-item[data-event-day="' + d + '"]').siblings().removeAttr("style")
//			$('div.c-event-item[data-event-day="' + d + '"]').css({
//				"font-weight": "700",
//				"color": "#fff",
//				"background": "-webkit-linear-gradient(left, #01c2e6 , #1160ff)",
//				"background": " -o-linear-gradient(right, #01c2e6 , #1160ff)",
//				"background": "-moz-linear-gradient(right, #01c2e6 , #1160ff)",
//				"background": "linear-gradient(to right, #01c2e6 , #1160ff)"
//			}).host;
//			$('div.c-event-item[data-event-day="' + d + '"]').siblings().children().removeAttr("style")
//			$('div.c-event-item[data-event-day="' + d + '"]').children().css("color", "white")
//			$('div.c-event[data-event-day="' + d + '"]').siblings().removeAttr("style")
//			$('div.c-event[data-event-day="' + d + '"]').css({
//				"box-shadow": " 0 0 8px #cccccc",
//				"font-weight": "700",
//				"color": "#fff",
//				"background": "-webkit-linear-gradient(left, #01c2e6 , #1160ff)",
//				"background": " -o-linear-gradient(right, #01c2e6 , #1160ff)",
//				"background": "-moz-linear-gradient(right, #01c2e6 , #1160ff)",
//				"background": "linear-gradient(to right, #01c2e6 , #1160ff)"
//			}).host;

		}

		var nextMonth = function() {
			if(dMonth < 11) {
				dMonth++;
			} else {
				dMonth = 0;
				dYear++;
			}
			
			let  month = dMonth + 1 + "";
			settings.url = "grrz/personallog/queryPersonalLogCalendarByMonth/"+dYear+"-"+(month.length == 1?"0"+month:month);
			print();
			if($(".c-day").is(".c-today2")) {
				$(".c-month-top").html(dYear + "-" + settings.months[dMonth]);
				$(".c-month-center").html($(".c-today2").text());
			} else {
				$(".c-month-top").html(dYear);
				$(".c-month-center").html(settings.months[dMonth]);
				$(".c-month-bottom").html("");
			}

		};
		var previousMonth = function() {
			if(dMonth > 0) {
				dMonth--;
			} else {
				dMonth = 11;
				dYear--;
			}
			let  month = dMonth + 1 + "";
			settings.url = "grrz/personallog/queryPersonalLogCalendarByMonth/"+dYear+"-"+(month.length == 1?"0"+month:month);
			print();
			if($(".c-day").is(".c-today2")) {
				$(".c-month-top").html(dYear + "-" + settings.months[dMonth]);
				$(".c-month-center").html($(".c-today2").text());
			} else {
				$(".c-month-top").html(dYear);
				$(".c-month-center").html(settings.months[dMonth]);
				$(".c-month-bottom").html("");
			}
		};

		function loadEvents() {
			if(typeof settings.url != 'undefined' && settings.url != '') {
				$.ajax({
					url: settings.url,
					async: false,
					success: function(result) {
						settings.events = result;
					}
				});
			}
		}
		function mGetDate(year, month){
		    var d = new Date(year, month, 0);
		    return d.getDate();
		}

		function print() {
			loadEvents();
			var dWeekDayOfMonthStart = new Date(dYear, dMonth, 1).getDay();
			var dLastDayOfMonth = new Date(dYear, dMonth + 1, 0).getDate();
			var dLastDayOfPreviousMonth = new Date(dYear, dMonth + 1, 0).getDate() - dWeekDayOfMonthStart + 1;

			var cBody = $('<div/>').addClass('c-grid');
			var cEvents = $('<div/>').addClass('c-event-grid');
			var cEventsTop = $('<div/>').addClass('c-event-top clearfix');
			cEvents.append($('<div/>').addClass('c-event-title c-pad-top').html(settings.eventTitle));
			var cNext = $('<div/>').addClass('c-next c-grid-title c-pad-top');
			var cMonth = $('<div/>').addClass('c-month c-grid-title c-pad-top');
			var cPrevious = $('<div/>').addClass('c-previous c-grid-title c-pad-top');
			cPrevious.html(settings.textArrows.previous);

			cNext.html(settings.textArrows.next);

			cPrevious.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', previousMonth);
			cNext.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', nextMonth);

			cEventsTop.append(cPrevious);
			cEventsTop.append(cMonth);
			cEventsTop.append(cNext);
			for(var i = 0; i < settings.weekDays.length; i++) {
				var cWeekDay = $('<div/>').addClass('c-week-day c-pad-top');
				cWeekDay.html(settings.weekDays[i]);
				cBody.append(cWeekDay);
			}
			var day = 1;
			var dayOfNextMonth = 1;
			
			for(var i = 0; i < 42; i++) {
				var cDay = $('<div/>');
				if(i < dWeekDayOfMonthStart) {
					cDay.addClass('c-day-previous-month c-pad-top');
				} else if(day <= dLastDayOfMonth) {
					cDay.addClass('c-day c-pad-top');
					if(day == dDay && adMonth == dMonth && adYear == dYear) {
						cDay.addClass('c-today2');
					}
					
					for(var j = 0; j < settings.events.length; j++) {
						var d = new Date(settings.events[j].datetime);
//						console.log(d.getDate(),d.getMonth());
						if(d.getDate() == day && (d.getMonth()) == dMonth && d.getFullYear() == dYear) {
							cDay.addClass('c-event').attr('data-event-day', d.getDate());
							cDay.on('mouseover', mouseOverEvent).on('mouseleave', mouseLeaveEvent).on('click', clickitem);
//							cDay.on('click', clickitem);
						}
						if (d.getDate() == day && d.getMonth() == 0 && dMonth == 11 && (d.getFullYear() - 1) == dYear) {
						    cDay.addClass('c-event').attr('data-event-day', d.getDate());
						    cDay.on('mouseover', mouseOverEvent).on('mouseleave', mouseLeaveEvent).on('click', clickitem);
//						    cDay.on('click', clickitem);
						}
						
					}
					cDay.html(day++);
				} else {
					cDay.addClass('c-day-next-month c-pad-top');
				}
				cBody.append(cDay);
			}
//			var eventList = $('<div/>').addClass('c-event-list');
//			for(var i = 0; i < settings.events.length; i++) {
//				var d = settings.events[i].datetime;
//				console.log(d)
//				if((d.getMonth()) == dMonth && d.getFullYear() == dYear) {
//					var date = lpad(d.getMonth()+1, 2) + '/' + lpad(d.getDate(), 2) + ' ' + lpad(d.getHours(), 2) + ':' + lpad(d.getMinutes(), 2);
//					var item = $('<div/>').addClass('c-event-item');
//					var a = $('<a/>').addClass('c-event-item-a').attr('href', settings.events[i].href);;
//					var title = $('<div/>').addClass('title').html(date + '  ' + settings.events[i].title);
//					var 活动描述 = $('<div/>').addClass('活动描述').html(settings.events[i].活动描述);
//					item.attr('data-event-day', d.getDate());
//					item.on('mouseover', mouseOverItem).on('mouseleave', mouseLeaveItem).on('click', clickitem);
//
//					item.append(a);
//					a.append(title).append(活动描述);
//					eventList.append(item);
//				}
//				if(d.getMonth() == 0 && dMonth == 11 && (d.getFullYear() - 1) == dYear){
//					
//					var date = lpad(12, 2) + '/' + lpad(d.getDate(), 2) + ' ' + lpad(d.getHours(), 2) + ':' + lpad(d.getMinutes(), 2);
//					var item = $('<div/>').addClass('c-event-item');
//					var a = $('<a/>').addClass('c-event-item-a').attr('href', settings.events[i].href);;
//					var title = $('<div/>').addClass('title').html(date + '  ' + settings.events[i].title);
//					var 活动描述 = $('<div/>').addClass('活动描述').html(settings.events[i].活动描述);
//					item.attr('data-event-day', d.getDate());
//					item.on('mouseover', mouseOverItem).on('mouseleave', mouseLeaveItem).on('click', clickitem);
//
//					item.append(a);
//					a.append(title).append(活动描述);
//					eventList.append(item);
//				}
//
//			}
			
			$(instance).addClass('calendar');

			$(instance).html(cBody).append(cEvents);
			$(instance).prepend(cEventsTop);
//			$(".c-event-item").addClass("clearfix");

			var cMontop = $("<div/>").addClass("c-month-top");
			cMonth.append(cMontop);
			cMontop.html(dYear + "-" + settings.months[dMonth]);
			var cMoncenter = $("<div/>").addClass("c-month-center");
			cMonth.append(cMoncenter);
			cMoncenter.html($(".c-today2").text());
			var cMonbottom = $("<div/>").addClass("c-month-bottom");
			cMonth.append(cMonbottom);
			
			
//			if($(".c-today2").is(".c-event")) {
//				cMonbottom.html("有课");
//			} else {
//				cMonbottom.html(" ");
//			}

		}

		return print();
	}
	
	

	$.fn.eCalendar = function(oInit) {
		return this.each(function() {
			return eCalendar(oInit, $(this));
		});
	};

	// plugin defaults
	$.fn.eCalendar.defaults = {
		weekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
		months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
		textArrows: {
			previous: '',
			next: ''
		},
		eventTitle: '',
		url: '',
		events: []
	};

}(jQuery));