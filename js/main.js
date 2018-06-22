(function() {
	var datepicker = window.datepicker;
	var monthData;
	var wrapper;

	datepicker.buildUI = function(year, month) {
		monthData = datepicker.getMonthData(year, month);
		var html ='<div class="ui-datepicker-header">'
				+'<a href="javascript:;" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>'
				+'<a href="javascript:;" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>'
				+'<span class="ui-datepicker-cur-month">' 
				+monthData.year+'-'+monthData.month
				+'</span>'
			+'</div>'
			+'<div class="ui-datepicker-body">'
				+'<table border="0" cellspacing="0" cellpadding="0">'
					+'<thead>'
						+'<tr>'
							+'<th>日</th>'
							+'<th>一</th>'
							+'<th>二</th>'
							+'<th>三</th>'
							+'<th>四</th>'
							+'<th>五</th>'
							+'<th>六</th>'
						+'</tr>'
					+'</thead>'
					+'<tbody>'
						
		for(var i = 0; i < monthData.days.length; i++) {
			if(i % 7 == 0) {
				html += '<tr>';
			}
			html += '<td data-date="'+monthData.days[i].date+'">' + monthData.days[i].showDate + '</td>';
			if(i % 7 == 6) {
				html += '</tr>';
			}
		}

		html += '	</tbody>' +
			'</table>' +
			'</div>';

		return html;
	}
	
	datepicker.rander=function(direction){
		var year,month;
		if(monthData){
			year=monthData.year;
			month=monthData.month;
		}	
		
		if(direction=='prev'){
			month--;
			if(month==0){
				year--;
				month=12;
			}
		}
		if(direction=='next')month++;
		
		var html=datepicker.buildUI(year,month);
		
		if(!wrapper){
			wrapper=document.createElement('div');
			wrapper.className='ui-datepicker-wrapper';
			document.body.appendChild(wrapper);
		}		
		wrapper.innerHTML=html;	
		
		var $td=wrapper.getElementsByTagName('td');
		for(var i=0;i<$td.length;i++){
			if($td[i].innerHTML<monthData.days[i].date||$td[i].innerHTML>monthData.days[i].date){
				$td[i].className='not-cur-month';
			}
		}
	}
	
	datepicker.init=function(input){		
		datepicker.rander();				
		
		var isOpen=false;
		
		input.addEventListener('click',function(e){
			e=e||window.event;
			if(isOpen){
				wrapper.classList.remove('ui-datepicker-wrapper-show');
				isOpen=false;
			}else{
				wrapper.classList.add('ui-datepicker-wrapper-show');
				var left=input.offsetLeft;
				var top=input.offsetTop;
				var height=input.offsetHeight;
				wrapper.style.left=left+'px';
				wrapper.style.top=top+height+1+'px';
				isOpen=true;
			}
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble=true ;
		},false);
		
		document.addEventListener('click',function(){
			wrapper.classList.remove('ui-datepicker-wrapper-show');
			isOpen=false;
		},false);
		
		wrapper.addEventListener('click',function(e){
			var $target=e.target;
			
			if($target.classList.contains('ui-datepicker-prev-btn')){
				datepicker.rander('prev');
			}else if($target.classList.contains('ui-datepicker-next-btn')){
				datepicker.rander('next');
			}
			
			if($target.tagName.toLowerCase()=='td'){
				var date=new Date(monthData.year,monthData.month-1,$target.dataset.date);
				input.value=format(date);
				wrapper.classList.remove('ui-datepicker-wrapper-show');
				isOpen=false;
			}
			
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble=true ;
		},false);
		
		function format(date){
			var padding=function(num){
				if(num<=9){
					num='0'+num;
				}
				return num;
			};
			var ret;
			ret=date.getFullYear()+'-'+padding(date.getMonth()+1)+'-'+padding(date.getDate());
			return ret;
		}
	}
})();