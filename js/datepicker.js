(function(){
	var datepicker={};
	
	datepicker.getMonthData=function(year,month){
		var ret=[];//定义一个空数组，用来存放日期
		
		if(!year||!month){//如果没有传参，则取当前年月
			var today=new Date();
			year=today.getFullYear();
			month=today.getMonth()+1;
		}
		
		var firstDay=new Date(year,month-1,1);//获得当前月的第一天
		var firstDayOfWeekday=firstDay.getDay();//获得第一天对应周几
		if(firstDayOfWeekday==0){//如果是周日，设为7
			firstDayOfWeekday=7;
		}
		year=firstDay.getFullYear();
		month=firstDay.getMonth()+1;
		var preMonthCount=firstDayOfWeekday;//获得第一排日历需要显示多少个上月的日期
		
		var lastDayOfCurMonth=new Date(year,month,0);//获得当月的最后一天
		var lastDateOfCurMonth=lastDayOfCurMonth.getDate();
		
		var lastDayOfPreMonth=new Date(year,month-1,0);//获得上个月的最后一天
		var lastDateOfPreMonth=lastDayOfPreMonth.getDate();			
		
		for(var i=0;i<7*6;i++){
			var date=i+1-preMonthCount;
			var thisMonth=month;
			var showDate=date;
			
			if(date<=0){//上一月
				thisMonth=month-1;
				showDate=lastDateOfPreMonth+date;
			}
			if(date>lastDateOfCurMonth){//下一月
				thisMonth=month+1;
				showDate=showDate-lastDateOfCurMonth;
			}
			
			if(thisMonth==0){
				thisMonth=12;
			}
			if(thisMonth==13){
				thisMonth=1;
			}
			
			ret.push({
				month:thisMonth,
				date:date,
				showDate:showDate
			});
		}		
		return {
			year:year,
			month:month,
			days:ret
		};
	};
	
	window.datepicker=datepicker;
})();
