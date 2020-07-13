if (document.cookie.split("=")[0] == "username"){
    document.cookie = "username="+""+";expires="+new Date(0);
    alert("會員已安全登出~");
}