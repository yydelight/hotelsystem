//参数
//direction:all/horizontal/vertical; 拖拽方向
//outof:false/true; 是否能超出父级
//connect:'selector'; 连接的对象选择器 （目前两个连接的对象必须处在同一父级内）
//collided:true/false; 是否碰撞
//fn:function(){}; 回调函数

$.fn.rinyDrager=function(options){
	var _this=$(this);
	
	var _option={
		direction:'all',
		outof:false,
		connect:'',
		collided:true
	};

	var params=$.extend({},_option,options);

	if(params.connect){
		var connectParams={},connectBox=$(params.connect);
		connectParams.direction=params.direction;
		connectParams.outof=params.outof;
		connectParams.beconnected=true;
		connectParams.connector=_this;
		connectParams.fn=params.fn;
		$(params.connect).rinyDrager(connectParams);
	};

	_this.css('position','absolute');

	var l=_this.offset().left,t=_this.offset().top;

	var positionL;
	var positionT;

	_this.on('touchstart',function(ev){

		var x=ev.originalEvent.targetTouches[0].pageX,y=ev.originalEvent.targetTouches[0].pageY,disX=x-l,disY=y-t;

		positionL=_this.position().left;
		positionT=_this.position().top;

		_this.on('touchmove',function(e){

			var moveL=e.originalEvent.targetTouches[0].pageX-l-disX+positionL,moveT=e.originalEvent.targetTouches[0].pageY-t-disY+positionT;

			var largestW=$(e.target).parent().width()-$(e.target).width(),largestH=$(e.target).parent().height()-$(e.target).height();

			if(!params.outof){
				moveL<0?moveL=0:moveL=moveL;
				moveL>largestW?moveL=largestW:moveL=moveL;
				moveT<0?moveT=0:moveT=moveT;
				moveT>largestH?moveT=largestH:moveT=moveT;
			};
			if(params.beconnected){
				if(moveL<params.connector.position().left+params.connector.outerWidth()){
					moveL=params.connector.position().left+params.connector.outerWidth();
				}
			};

			if(params.connect && params.collided){
				var connectL=connectBox.position().left,connectT=connectBox.position().top;
				if(moveL+_this.outerWidth()>connectL){
					moveL=connectL-_this.outerWidth();
				};

			};

			e.preventDefault();

			if(params.direction=='all'){
				_this.css({'left':moveL,'top':moveT});
			}else if(params.direction=='horizontal'){
				_this.css('left',moveL);
			}else if(params.direction=='vertical'){
				_this.css('top',moveT);
			}

			if(params.fn){
				params.fn();
			}

		})

	})
}