if (document.cookie.split("=")[0] == "username"){
    document.cookie = "username="+""+";expires="+new Date(0);
    alert("會員已安全登出~");
    window.location.assign("/");
}

function login(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username == "" || password == ""){
        alert("帳號或密碼沒輸入!");
        return false;
    };
    document.getElementById("submit").disabled = true;
    $.ajax({
        url:"/login",
        data:{"username":username,"password":password},
        success: function (python_result){
            if (python_result == "Username is wrong."){
                document.getElementById("username").value = "";
                alert("帳號錯誤");
                document.getElementById("submit").disabled = false;
            } else if (python_result == "Password is wrong."){
                document.getElementById("password").value = "";
                alert("密碼錯誤");
                document.getElementById("submit").disabled = false;
            } else if (python_result == "OK."){
                document.cookie = "username="+username;
                window.location.assign("/UserCenter.html");
            };
        },
        error: function (error){
            alert("登入失敗，請檢查網路連線，再重新嘗試");
            document.getElementById("submit").disabled = false;
        }
    })
}