 window.STA={};
 window.STA.AJAXOPTION={
		   type:"GET"
		  ,dataType:"json"
		  ,async:true
		  ,debug:false
		  ,headers:{token:window.sessionStorage.token}
};
window.STA.success=function(data){
	if(data.code==10000){
		return true;
	}else{
		return false; 
	}
}


window.STA.alert=function(str){
  layer.msg(str);
}

window.STA.getParam=function(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r!=null) return (decodeURIComponent(r[2])); return null; 
}

window.STA.domain="http://192.168.202.21";
window.STA.ajax=function (options){
		  var params=$.extend({},window.STA.AJAXOPTION,options); 
		  if(!window.STA.mark){
			   var html = '<div id="mask" style="width:100%;height:100%;background:#000;filter:alpha(opacity=50);  -moz-opacity:0.5;  -khtml-opacity: 0.5;  opacity: 0.5;  position:fixed;Z-index:1000000;top:0;left:0;"></div>';
			   window.STA.mark=$(html);
			   $('body').append(window.STA.mark);
		  }
		  params.beforeSend=function(XMLHttpRequest){
			   var headers=params.headers;
              console.log("headers",headers)
              if(headers&&headers.length>0){
                  XMLHttpRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
                  XMLHttpRequest.setRequestHeader("Access-Control-Allow-Credentials", "true");
                  XMLHttpRequest.setRequestHeader("Access-Control-Allow-Methods", "*");
                  XMLHttpRequest.setRequestHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token");
                  XMLHttpRequest.setRequestHeader("Access-Control-Expose-Headers", "*");
					for(var key in headers){
						 XMLHttpRequest.setRequestHeader(key,headers[key]);
				    }x
			   }
			   if(options.beforeSend){
				   options.beforeSend(window.STA.mark);
			   }else{
				   window.STA.mark.show();
			   }  
		  };
		  params.complete=function(){
			   if(options.complete){
				   options.complete(window.STA.mark);
			   }else{
				   window.STA.mark.hide();
			   } 
		  };
		  params.success=function(data){
			   if(options.success){
			        if(params.dataType!='json'&&params.dataType!='jsonp'){
						options.success(eval('('+data+')'));
					}else{
						options.success(data);
					}
					
				} 
		  };
		  params.error=function(XMLHttpRequest, textStatus, errorThrown){
			console.log(XMLHttpRequest.status);
			console.log(XMLHttpRequest.readyState);
			console.log(textStatus);
			  if(options.error){
				 options.error();
			 } 
		  };
		  if(params.debug){
			 params.dataType='text';
		  }else{
		  	console.log("sta",window.STA.domain)
			params.url=window.STA.domain+params.url;
		  } 
		  $.ajax(params);
 };