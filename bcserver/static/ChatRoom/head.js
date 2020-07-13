if (typeof(document.cookie.split("=")[1]) == "undefined"){
    window.location.assign("/UserCenter.html");
}

$.ajax({
    url:"/AlreadyInChatRoom",
    data:{"_id":location.href.split("?")[1],"username":document.cookie.split("=")[1]},
    success: function(python_result) {
        if (python_result == "Rejected") {
            window.location.assign("/UserCenter.html");
        };
    },
    error: function(error) {
        console.log(error);
    }
})