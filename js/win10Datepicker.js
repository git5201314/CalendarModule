define(['jquery'], function($){
	function Datepicker(el, options){
		this.$el = $(el);
		this.opts = $.extend(true, {}, Datepicker.DEFAULTS, options);
		
		this.init();
	}
	
	Datepicker.prototype = {
		/*
		 * 初始化插件
		 */
		init: function(){
			this._initHtml();
			this.clock();
			this._bindEvent();
		},
		
		/*
		 * 获取年份
		 */
		getYear: function(year){
			var ret = [];
			
			if(!year){
				year = new Date().getFullYear();
			}
						
			while(true){
				year += 1;
				if(year % 10 === 0){
					break;
				}
			}
			
			var lastYear = year + 10 -1;
				showYear = year
				range = year + '-' + lastYear;
			
			for(var i = 0; i < 16; i++){
				var isCur = true;
				
				showYear = year - 3 + i;
				if(showYear < year || showYear > lastYear){
					isCur = false;
				}
				
				ret.push({
					isCur: isCur,
					range: range,
					year: showYear
				});
			}
			
			return ret;
		},
		
		/*
		 * 获取月份信息
		 */
		getMonth: function(year){
			var ret = [],
				month = null;
				
			if(!year){
				year = new Date().getFullYear();
			}
			
			for(var i = 0; i < 16; i++){
				var dir = 'cur',
					flag = true,
					month = i + 12,
					showYear = year;
				
				if(i === 0){
					dir = 'prev';
					showYear -= 1;
					flag = false;
				}
				
				if(month !== 12){
					month -= 12;
				}
				
				if(month > 12){
					dir = 'next';
					showYear += 1;
					flag = false;
					month -= 12;
				}
				
				ret.push({
					dir: dir,
					isCur: flag,
					year: showYear,
					month: month
				});
			}
			
			return ret;
		},
		
		/*
		 * 获取每个月的日期信息
		 */
		getDate: function(year, month){
			var weekDay = {
				0: '星期日',
				1: '星期一',
				2: '星期二',
				3: '星期三',
				4: '星期四',
				5: '星期五',
				6: '星期六'
			};
			
			var ret = [],	//存放日期的数组
				today = this.opts.today,
				day = today.getDay();	//当前日期对应周几
			
			if(!year || !month){
				year = today.getFullYear();
				month = today.getMonth() + 1;
			}
			
			var firstDate = new Date(year, month - 1, 1),	//当月的第一天
				firstDayOfWeek = firstDate.getDay(),		//第一天对应的是周几
				prevMonthCount = firstDayOfWeek;			//要显示上个月的日期天数
			
			if(prevMonthCount == 0){
				prevMonthCount = 7;
			}
			
			var prevMonthLastDate = new Date(year, month - 1, 0).getDate();	//上个月的最后一天
			
			var curMonthLastDate = new Date(year, month, 0).getDate();      //当月的最后一天
			
			var nextMonthFirstDate = new Date(year, month, 1).getDate();    //下个月的第一天
			
			for(var i = 0; i < 42; i++){
				var date = i - prevMonthCount + 1,
					thisYear = year,
					thisMonth = month,
					showDate = date;
				
				if(date <= 0){
					showDate += prevMonthLastDate;
					thisMonth -= 1;
				}else if(date > curMonthLastDate){
					showDate -= curMonthLastDate;
					thisMonth += 1;
				}
				
				if(thisMonth === 0){
					thisYear -= 1;
					thisMonth = 12;
				}else if(thisMonth === 13){
					thisYear += 1;
					thisMonth = 1;
				}
				
				ret.push({
					year: thisYear,
					month: thisMonth,
					date: showDate
				});
			}
						
			return {
				year: year,
				month: month,
				date: today.getDate(),
				weekday: weekDay[day],
				days: ret
			};
		},
		
		/*
		 * 初始化HTML结构
		 */
		_initHtml: function(year, month){
			var data = this.getDate(year, month),
				ret = data.days;
			
			var html = '';
			
			html += '<div class="ui-win10-datepicker-header">'
				+'<h2 class="ui-win10-datepicker-clock"></h2>'
				+'<p>' + data.weekday + '&nbsp;' + data.year + '年' + data.month + '月' + data.date + '日</p>'
				+'</div>'
				+'<div class="ui-win10-datepicker-body">'
				+'<div class="ui-win10-datepicker-show">'
				+'<span class="ui-win10-datepicker-showdate" data-year="' + data.year + '" data-month="' + data.month + '">' + data.year + '年' + data.month + '月</span>'
				+'<p><i class="ui-win10-datepicker-btn ui-win10-datepicker-prev iconfont">&#xe512;</i>'
				+'<i class="ui-win10-datepicker-btn ui-win10-datepicker-next iconfont">&#xe64b;</i></p>'
				+'</div>'
				+'<div class="ui-win10-datepicker-con">'
				+'<table class="ui-win10-datepicker-date">'
				+'<thead><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></thead>'
				+'<tbody>';
										
			html += this._createDateHtml(year, month, data);
			
			html += '</tbody></table><div class="ui-win10-datepicker-month none">';			
			html += this._createMonthHtml('ui-win10-datepicker-month-item-prev');
			html += this._createMonthHtml('ui-win10-datepicker-month-item-cur');
			html += this._createMonthHtml('ui-win10-datepicker-month-item-next');
			html += '</div>';
			
			html += '<div class="ui-win10-datepicker-year none">';
			html += this._createYearHtml('ui-win10-datepicker-year-item-prev');
			html += this._createYearHtml('ui-win10-datepicker-year-item-cur');
			html += this._createYearHtml('ui-win10-datepicker-year-item-next');
			html += '</div>';
									
			html += '</div>';
			
			this.$el.append(html);
		},
		
		/*
		 * 创建日期数据
		 */
		_createDateHtml: function(year, month, data){
			var html = '';
			
			if(!data){
				data = this.getDate(year, month);
			}
			
			var ret = data.days;
			
			for(var i = 0; i < 42; i++){
				if(i % 7 === 0){
					html += '<tr>';
				}
				
				html += '<td data-year="' + ret[i].year + '" data-month="' + ret[i].month  + '" data-date="' + ret[i].date + '"';
				
				if(data.month !== ret[i].month){
					html += 'class="non-cur-month"';
				}else if(data.date === ret[i].date){
					html += 'class="ui-win10-datepicker-cur"';
				}
				
				html += '><span><i>' + ret[i].date + '</i></span></td>';
				
				if(i % 7 === 6){
					html += '</tr>';
				}
			}
			
			return html;
		},
		
		/*
		 * 创建月份数据
		 */
		_createMonthHtml: function(cls, year){
			var today = new Date(),
				curYear = today.getFullYear();
				curMonth = today.getMonth() + 1;
				html = '';
			
			if(!year){
				year = curYear;
			}
			
			if(cls === 'ui-win10-datepicker-month-item-prev'){
				year -= 1;
			}else if(cls === 'ui-win10-datepicker-month-item-next'){
				year += 1;
			}
			
			var month = this.getMonth(year);
			
			html += '<table class="ui-win10-datepicker-month-item ' + cls + '"><tbody>';
						
			for(var i = 0; i < 16; i++){
				if(i % 4 === 0){
					html += '<tr>';
				}
				
				html += '<td data-dir="' + month[i].dir + '" data-year="' + month[i].year + '" data-month="' + month[i].month + '"';
				
				if(!month[i].isCur){
					html += 'class="non-cur-year"';
				}else if(month[i].month === curMonth){
					html += 'class="active"';
				}
				
				html += '><span>' + month[i].month + '月</span></td>';
				
				if(i % 4 === 3){
					html += '</tr>';
				}
			}
					
			html +='</tbody></table>';
			
			return html;
		},
	
		/*
		 * 创建年份数据
		 */
		_createYearHtml: function(cls, year){
			var curYear = new Date().getFullYear()
				html = '';
			
			if(!year){
				year = curYear;
			}
			
			if(cls === 'ui-win10-datepicker-year-item-prev'){
				year -= 10;
			}else if(cls === 'ui-win10-datepicker-year-item-next'){
				year += 10;
			}
			
			yearData = this.getYear(year);
			
			html += '<table class="ui-win10-datepicker-year-item ' + cls + '"><tbody>';
			
			for(var i = 0; i < 16; i++){
				if(i % 4 === 0){
					html += '<tr>';
				}
				
				html += '<td data-year="' + yearData[i].year + '"';
				
				if(yearData[i].year === curYear){
					html += 'class="active"';
				}else if(!yearData[i].isCur){
					html += 'class="non-cur-year"';
				}
			
				html += '><span>' + yearData[i].year + '</span></td>';
				
				if(i % 4 === 3){
					html += '</tr>';
				}
			}
			html += '</tbody></table>';
			
			return html;
		},
		
		/*
		 * 动态时间
		 */
		clock: function(){
			var i = 0;
			
			setInterval(function(){
				var date = new Date();
				var hour = date.getHours(),
					minute = date.getMinutes(),
					second = date.getSeconds();
				
				var time = padding(hour) + ':' + padding(minute) + ':' + padding(second);
					
				$('.ui-win10-datepicker-clock').html(time);
				
				i = 1;
			}, i * 1000);
			
			function padding(num){
				return num < 10 ? '0' + num : num;
			}
		},
		
		/*
		 * 绑定事件
		 */
		_bindEvent: function(){
			var self = this,
				$showdate = $('.ui-win10-datepicker-showdate'),
				year = $showdate.data('year'),
				month = $showdate.data('month');
			
			//给ui-win10-datepicker-date下面的td绑定点击事件
			$('.ui-win10-datepicker-date').on('click', 'td', function(){
				if($(this).is('td')){
					$(this).parents('.ui-win10-datepicker-date').find('td').removeClass('ui-win10-datepicker-active');
					$(this).addClass('ui-win10-datepicker-active');
				}
			});
			
			//给按钮添加点击事件
			$('.ui-win10-datepicker-btn').click(function(e){
				var $target = $(e.target);
				if($showdate.data('flag') === 'date' || !$showdate.data('flag')){
					if($target.hasClass('ui-win10-datepicker-prev')){
						month--;
					}else if($target.hasClass('ui-win10-datepicker-next')){
						month++;
					}
					
					if(month == 13){
						year++;
						month = 1;
					}else if(month == 0){
						year--;
						month = 12;
					}
					
					$('.ui-win10-datepicker-date tbody').html( self._createDateHtml(year, month) );
					$showdate.data({
						year: year, 
						month: month
					}).html(year + '年' + month + '月');
				}else if($showdate.data('flag') === 'month'){
					if($target.hasClass('ui-win10-datepicker-prev')){
						year--;
						$('.ui-win10-datepicker-month-item-cur').find('td').each(function(index, item){
							var $item = $(item);
							
							if($item.data('dir') === 'prev'){
								$item.data('year', year - 1);
							}else if($item.data('dir') === 'cur'){
								$item.data('year', year);
							}else{
								$item.data('year', year + 1);
							}
						});
						$('.ui-win10-datepicker-month-item-cur').animate({top: 292}, 200, 'linear');
						$('.ui-win10-datepicker-month-item-prev').animate({top: 0}, 200, 'linear');						
						$showdate.data('year', year).html(year + '年');
						$('.ui-win10-datepicker-month-item-cur').animate({top: 0}, 0, 'linear');
						$('.ui-win10-datepicker-month-item-prev').animate({top: -292}, 0, 'linear');
					}else if($target.hasClass('ui-win10-datepicker-next')){
						year++;						
						$('.ui-win10-datepicker-month-item-cur').find('td').each(function(index, item){
							var $item = $(item);
							
							if($item.data('dir') === 'prev'){
								$item.data('year', year - 1);
							}else if($item.data('dir') === 'cur'){
								$item.data('year', year);
							}else{
								$item.data('year', year + 1);
							}
						});
						$('.ui-win10-datepicker-month-item-cur').animate({top: -292}, 200, 'linear');
						$('.ui-win10-datepicker-month-item-next').animate({top: 0}, 200, 'linear');						
						$showdate.data('year', year).html(year + '年');
						$('.ui-win10-datepicker-month-item-cur').animate({top: 0}, 0, 'linear');
						$('.ui-win10-datepicker-month-item-next').animate({top: 292}, 0, 'linear');
					}
				}else if($showdate.data('flag') === 'year'){
					if($target.hasClass('ui-win10-datepicker-prev')){
						year -= 10;
						$('.ui-win10-datepicker-year-item-cur').animate({top: 292}, 200, 'linear');
						$('.ui-win10-datepicker-year-item-prev').animate({top: 0}, 200, 'linear');
						$showdate.data('year', year).html( self.getYear(year)[0].range );
						$('.ui-win10-datepicker-year-item-cur').animate({top: 0}, 0, 'linear');
						$('.ui-win10-datepicker-year-item-prev').animate({top: -292}, 0, 'linear');
						setTimeout(function(){
							var html = '';
							html += self._createYearHtml('ui-win10-datepicker-year-item-prev', year);
							html += self._createYearHtml('ui-win10-datepicker-year-item-cur', year);
							html += self._createYearHtml('ui-win10-datepicker-year-item-next', year);
							$('.ui-win10-datepicker-year').html(html);
						}, 200);
					}else if($target.hasClass('ui-win10-datepicker-next')){
						year += 10;
						$('.ui-win10-datepicker-year-item-cur').animate({top: -292}, 200, 'linear');
						$('.ui-win10-datepicker-year-item-next').animate({top: 0}, 200, 'linear');
						$showdate.data('year', year).html( self.getYear(year)[0].range );
						$('.ui-win10-datepicker-year-item-cur').animate({top: 0}, 0, 'linear');
						$('.ui-win10-datepicker-year-item-prev').animate({top: 292}, 0, 'linear');
						setTimeout(function(){
							var html = '';
							html += self._createYearHtml('ui-win10-datepicker-year-item-prev', year);
							html += self._createYearHtml('ui-win10-datepicker-year-item-cur', year);
							html += self._createYearHtml('ui-win10-datepicker-year-item-next', year);
							$('.ui-win10-datepicker-year').html(html);
						}, 200);
					}
				}
			});
			
			//月份下面的事件
			$('.ui-win10-datepicker-month').on('mouseover', 'td', function(){
				if($(this).is('td')){
					$(this).parents('.ui-win10-datepicker-month-item-cur').find('td').removeClass('hover');
					$(this).addClass('hover');
				}
			}).on('click', 'td', function(){
				year = $(this).data('year');
				month = $(this).data('month');
								
				var html = self._createDateHtml(year, month);
				$('.ui-win10-datepicker-month').fadeOut();
				$('.ui-win10-datepicker-date').fadeIn().find('tbody').html(html);
				$('.ui-win10-datepicker-showdate').html(year + '年' + month + '月').data('flag', 'date');
			}).on('mouseout', function(){
				$(this).find('td.hover').removeClass('hover');
			});
			
			//年份下面的事件
			$('.ui-win10-datepicker-year').on('mouseover', 'td', function(){				
				if($(this).is('td')){
					$(this).parents('.ui-win10-datepicker-year-item-cur').find('td').removeClass('hover');
					$(this).addClass('hover');
				}
			}).on('click', 'td', function(){
				year = $(this).data('year');
				
				var html = '';
				html += self._createMonthHtml('ui-win10-datepicker-month-item-prev', year);
				html += self._createMonthHtml('ui-win10-datepicker-month-item-cur', year);
				html += self._createMonthHtml('ui-win10-datepicker-month-item-next', year);
				
				$('.ui-win10-datepicker-year').fadeOut();
				$('.ui-win10-datepicker-month').fadeIn().html(html);
				$('.ui-win10-datepicker-showdate').html(year + '年').data('flag', 'month');
			}).mouseout(function(){
				$(this).find('td.hover').removeClass('hover');
			});
			
			$('.ui-win10-datepicker-year-item').on('mouseover', 'td', function(){
				if($(this).is('td')){
					$(this).parents('.ui-win10-datepicker-year-item-cur').find('td').removeClass('hover');
					$(this).addClass('hover');
				}
			}).on('mouseout', function(){
				$(this).find('td').removeClass('hover');
			});
			
			//ui-win10-datepicker-showdate点击显示月份年份
			$showdate.click(function(){
				if( $showdate.data('flag') === 'date' || !$showdate.data('flag') ){
					$('.ui-win10-datepicker-date').addClass('none').fadeOut().next().fadeIn().removeClass('none');
					$showdate.html( $showdate.data('year') + '年' ).data('flag', 'month');
				}else if( $showdate.data('flag') === 'month' ){
					$('.ui-win10-datepicker-month').addClass('none').fadeOut().next().fadeIn().removeClass('none');
					var yearData = self.getYear(year);
					var html = '';
					html += self._createYearHtml('ui-win10-datepicker-year-item-prev', year);
					html += self._createYearHtml('ui-win10-datepicker-year-item-cur', year);
					html += self._createYearHtml('ui-win10-datepicker-year-item-next', year);
					$('.ui-win10-datepicker-year').html(html);
					$showdate.html( yearData[0].range ).data('flag', 'year');
				}
			});
		}
	};
	
	Datepicker.DEFAULTS = {
		today: new Date()
	};
	
	$.fn.extend({
		datepicker: function(options){
			return this.each(function(){
				var $el = $(this),
					instance = $el.data('datepicker');
					
				if(!instance){
					$el.data( 'datepicker', (instance = new Datepicker($el, options)) );
				}
				
				if($.type(options) === 'string'){
					return instance[options]();
				}
			});
		}
	});
});