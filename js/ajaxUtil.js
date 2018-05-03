var _host = "http://192.168.120.1/" //台式ip
// var _host = "http://192.168.0.104/" //手提ip
var $ajax = {
    run: function(url, data, success, type, async, header) {
        $.ajax({
            type: type,
            url: _host + url,
            data: data,
            async: async,
            dataType: "json",
            headers: {'token': window.sessionStorage.token},
            success: function(result) {
                if( result.resultCode == 0) {
                    console.log("result",result)
                    success(result);
                } else if( result.resultCode == 401) {
                    //login
                    window.alert("请先登录")
                    window.location.href='login.html';
                } else if( result.resultCode == 500) {
                    alert(result.resultMsg);
                }
            }
        });
    },
    get: function(url, data, success, async) {
        if(!async) {
            async = true;
        }
        this.run(url, data, success, "GET", async, this.header());
    },
    post: function(url, data, success, async) {
        if(!async) {
            async = true;
        }
        this.run(url, data, success, "POST", async, this.header());
    },
    header: function() {
        var state = {"token":window.sessionStorage.token};

        return {};
    }
}