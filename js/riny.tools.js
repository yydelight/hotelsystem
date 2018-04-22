/***模态层***/

//参数
//wrap:加入层
//scrollwrap:滚动层
//方法
//rinyModal.showModal:显示模态层
//rinyModal.hideModal:隐藏模态层

var rinyModal=function(){};
rinyModal.prototype.addModal=function(wrap,scrollwrap){
	this.html='<div class="riny_modal" style="width:100%;height:100%;position:absolute;display:none;left:0;top:0;background:rgba(0,0,0,.5);z-index:9990;"></div>';
	this.content=$(this.html);
	this.scrollwrap=scrollwrap;
	wrap.append(this.content);
};
rinyModal.prototype.showModal=function(){
	this.content.show();
	this.scrollwrap.css('overflow','hidden');
};
rinyModal.prototype.hideModal=function(){
	this.content.hide();
	this.scrollwrap.css('overflow','scroll');
};

/***弹窗***/

//参数
//el:selector 弹窗元素的选择器,如'#confirm'
//modal:true/false 是否调用模态层,默认true
//modalcontrol:[加入层,滚动层]
//btn:[{jquery选择器(如：'.ok_btn'):该按键点击后触发的函数},{...},...]
//
//方法
//showConfirm:显示弹窗
//hideConfirm:隐藏弹窗

var rinyConfirm=function(){};
rinyConfirm.prototype.addConfirm=function(option){

	var defaultOption={
		modal:true
	};

	this._option=$.extend({},defaultOption,option);

	$(this._option.el).css('display','none');

	if(this._option.modal && this._option.modalcontrol){
		this.modalOn=true;
	};

	if(this.modalOn){
		this.mask=new rinyModal();
		this.mask.addModal(this._option.modalcontrol[0],this._option.modalcontrol[1]);
	};

	if(this._option.btn){
		for(var i=0;i<this._option.btn.length;i++){
			for(var key in this._option.btn[i]){
				$(key).on('click',this._option.btn[i][key]);
			};
		};
	};
};

rinyConfirm.prototype.showConfirm=function(){
	$(this._option.el).show(100);
	if(this.modalOn){
		this.mask.showModal();	
	};	
};

rinyConfirm.prototype.hideConfirm=function(){
	$(this._option.el).hide(100);
	if(this.modalOn){
		this.mask.hideModal();	
	};
};

/***日历***/

//参数
//yearInner:显示年份的元素，如:$('.yearInner')
//monthInner:显示月份的元素，如:$('.monthInner')
//weeksInner:星期所插入的外层包裹元素，如:$('.weeksInner')
//weeksTemplate:日期的html模板(字符串),要插入星期的位置需要加入weeksTemplate占位，如:'<li>weeksTemplate</li>'
//weeksText:定义星期的显示文本，如:['mon','tue',...]，默认为['周一','周二','周三','周四','周五','周六','周日']
//daysInner:日期所插入的外层包裹元素，如:$('.daysInner')
//daysTemplate:日期的html模板(字符串),要插入日期的位置需要加入daysTemplate占位，如:'<li>daysTemplate</li>'
//prevMonthBtn:显示上一个月的按钮，如:$('.prevbtn')
//nextMonthBtn:显示下一个月的按钮，如:$('.nextbtn')
//m:值为0-11(1-12月)的数字，用来设置日历初始显示的月份，默认显示本月
//
//插入日期的位置会生成一个带有class="rinyCalendar_day"的span标签，可对其进行各种操作，如:模板为'<li><a><i>daysTemplate</i></a><em></em></li>',输出为'<li><a><i><span class="rinyCalendar_day">所显示的日期</span></i></a><em></em></li>',下同理
//没有插入日期的位置会生成一个带有class="rinyCalendar_blank"的span标签，可对其进行各种操作
//插入星期的位置会生成一个带有class="rinyCalendar_week"的span标签，可对其进行各种操作
//今天的位置的span标签会再有一个class="rinyCalendar_today"，可对其进行各种操作
//过去的日期的span标签会再有一个class="rinyCalendar_oldday"，可对其进行各种操作
//年月周日的span标签上都会带有一个data属性，分别为riny-year/riny-month/riny-week/riny-day，值为相应的日期
//
//注意:星期从左到右从周一到周日
//建议使用步骤:1、先写结构和样式(注意会生成span标签)；2、再调用方法

var rinyCalendar=function(){};
rinyCalendar.prototype.initCalendar=function(option){

	this.date=new Date();
	this.today=this.date.getDate();
	this.toweek= this.date.getDay()==0? 7 : this.date.getDay();
	this.tomonth=this.date.getMonth();
	this.toyear=this.date.getFullYear();
	this.m= option.m ? option.m : this.tomonth;

	if(!option.weeksTemplate || option.weeksTemplate.indexOf('weeksTemplate')==-1){
		console.error('you need weeksTemplate');
		return;
	};

	var defWeek=['周一','周二','周三','周四','周五','周六','周日'];
	if(option.weeksText){
		defWeek=option.weeksText;
	};
	this.weekHtml='';
	for(var l=0;l<defWeek.length;l++){
		this.weekHtml+=option.weeksTemplate.replace('weeksTemplate','<span class="rinyCalendar_week" data-riny-week="'+defWeek[l]+'">'+defWeek[l]+'</span>');
	};

	option.weeksInner.html(this.weekHtml);

	this.dayInner=function(curyear,curmonth,lastDay,firstDayWeek){

		option.yearInner.text(curyear);
		option.yearInner.data('riny-year',curyear);
		option.monthInner.text(curmonth);
		option.monthInner.data('riny-month',curmonth);

		if(!option.daysTemplate || option.daysTemplate.indexOf('daysTemplate')==-1){
			console.error('you need daysTemplate');
			return;
		};

		var html='';
		for(var i=0;i<firstDayWeek-1;i++){
			var blank=option.daysTemplate.replace('daysTemplate','<span class="rinyCalendar_blank"></span>');
			html+=blank;
		};
		for(var j=0;j<lastDay;j++){
			var day=option.daysTemplate.replace('daysTemplate','<span class="rinyCalendar_day" data-riny-day='+(j+1)+'>'+(j+1)+'</span>');
			html+=day;
		};

		var beInnerNum=firstDayWeek-1+lastDay;
		var line=Math.ceil(beInnerNum/7);
		var afterBlankNum=line*7-beInnerNum;

		for(var k=0;k<afterBlankNum;k++){
			var afterBlank=option.daysTemplate.replace('daysTemplate','<span class="rinyCalendar_blank"></span>');
			html+=afterBlank;
		};

		option.daysInner.html(html);

	};

	this.setCalendar=function(year,month){

		var curYear=year;
		var curMonth=month+1;

		var nextMonth=month+1;
		this.date.setDate(1);
		var firstDayWeek= this.date.getDay()==0? 7 : this.date.getDay();
		//这里需要注意，如果本月有31号而下个月没有，直接设置成下个月会变成下个月的31号，但由于下个月没有31号，所以会再到下一个月，就结果而言，会跳转到下下个月。
		//所以在这里可以先将日期设置成本月的首日，获取了星期之后再调整到下个月，毕竟每个月都有1号。
		this.date.setMonth(nextMonth);
		this.date.setDate(0);
		var lastDay=this.date.getDate();

		this.dayInner(curYear,curMonth,lastDay,firstDayWeek);

	};

	this.set=function(){
		//设置月份前都先把日期设到首日
		this.date.setDate(1);
		this.date.setMonth(this.m);
		this.setCalendar(this.date.getFullYear(),this.date.getMonth());
		
		var days=option.daysInner.find('.rinyCalendar_day');
		for(var i=0;i<days.length;i++){
			var text=days.eq(i).text();
			if(this.toyear==option.yearInner.text() && this.tomonth+1==option.monthInner.text() && this.today==text){
				days.eq(i).addClass('rinyCalendar_today');
			};
			if(option.yearInner.text()<this.toyear || option.yearInner.text()==this.toyear && option.monthInner.text()<this.tomonth+1 || option.yearInner.text()==this.toyear && option.monthInner.text()==this.tomonth+1 && text<this.today){
				days.eq(i).addClass('rinyCalendar_oldday');
			};			
		};
	};
	this.set();

	this.prevMon=function(){
		this.m--;
		if(this.m==-2){
			this.m=10;
		};
		this.set();
	};

	this.nextMon=function(){
		this.m++;
		if(this.m==13){
			this.m=1;
		};
		this.set();
	};

	var _this=this;

	if(option.prevMonthBtn){
		option.prevMonthBtn.on('click',function(){
			_this.prevMon();
		});
	};

	if(option.nextMonthBtn){
		option.nextMonthBtn.on('click',function(){
			_this.nextMon();
		});
	};	
};

/***搜索历史(使用的缓存对象为localStorage)***/

//参数
//storage:字符串,作为缓存的key,必须
//limit:数字,用来限制缓存数量,默认不限制,可选
//input:input元素,绑定的搜索框,必须
//
//方法
//checkStorage:返回缓存数据,缓存不存在返回undefined
//setStorage:将当前输入框的内容添加至缓存
//cancelStorage:删除缓存,传入想要删除的缓存内容进行单个删除(如:缓存中存在'a',cancelStorage('a')就能删除该缓存),不传入参数则删除所有缓存

var rinyStorage=function(option){
	this.storage=option.storage;
	this.limit=option.limit;
	this.input=option.input;
};
rinyStorage.prototype.checkStorage=function(){
	var storage=localStorage.getItem(this.storage);
	if(!storage){
		return;
	};
	this.history=JSON.parse(storage);
	return this.history;
};
rinyStorage.prototype.setStorage=function(){

	this.value=this.input.val();

	this.checkStorage();
	var history;
	if(this.history){
		history=this.history;
	}else{
		history=[];
	};

	var indexof=history.indexOf(this.value);

	if(indexof!=-1){
		history.splice(indexof,1);
	};
	history.unshift(this.value);

	if(this.limit && history.length>this.limit){
		history.splice(history.length-1,1);
	};

	history=JSON.stringify(history);
	localStorage.setItem(this.storage,history);

};
rinyStorage.prototype.cancelStorage=function(val){

	this.checkStorage();

	if(!this.history) return;

	if(!val){
		localStorage.removeItem(this.storage);
		this.history=undefined;
	}else{
		var indexof=this.history.indexOf(val+'');

		if(indexof==-1){
			return;
		};

		this.history.splice(indexof,1);
		var history=JSON.stringify(this.history);
		localStorage.setItem(this.storage,history);
	};

};

/***排序(数字类,无需实例化)***/

//参数
//data:[] 需要排序的数组 必须
//sc:'asc'/'desc' 升序/降序 必须
//key:需要根据key值排序的可以传入 可选

var rinySort=function(data,sc,key){

	if(key){

		var arr=[];

		for(var i=0;i<data.length;i++){
			if(arr.indexOf(data[i][key])==-1){
				arr.push(data[i][key]);
			};
		};

		if(sc=='asc'){
			arr.sort(function(a,b){return a-b});
		};
		if(sc=='desc'){
			arr.sort(function(a,b){return b-a});
		};

		var newArr=[];

		for(var j=0;j<arr.length;j++){
			for(var k=0;k<data.length;k++){
				if(data[k][key]==arr[j]){
					newArr.push(data[k]);
				};
			};
		};

		return newArr;

	}else{
		if(sc=='asc'){
			data.sort(function(a,b){return a-b});
		};
		if(sc=='desc'){
			data.sort(function(a,b){return b-a});
		};

		return data;
	};

};