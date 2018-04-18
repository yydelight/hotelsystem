var _host = "http://192.168.202.21/"
var $ajax = {
    run: function(url, data, success, type, async, header) {
        $.ajax({
            type: type,
            url: _host + url,
            data: data,
            async: async,
            dataType: "json",
            headers: {userId:header.id},
            success: function(result) {
                if( result.resultCode == 0) {
                    console.log("result",result)
                    success(result);
                } else if( result.resultCode == 401) {
                    //login
                    window.location.href='index.html';
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