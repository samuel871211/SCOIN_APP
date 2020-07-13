if (document.cookie.split("=")[0] == "username"){
    document.cookie = "username="+""+";expires="+new Date(0);
    alert("會員已安全登出~");
    window.location.assign("/");
}

function NewDID() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirm = document.getElementById("confirm").value;
    var studentid = document.getElementById("studentid").value;
    var gmail = document.getElementById("gmail").value;
    if (username == ""){
        alert("帳號不可為空");
    } else if (password == ""){
        alert("密碼不可為空");
    } else if (confirm == ""){
        alert("請再次輸入密碼");
    } else if (studentid == ""){
        alert("學號不可為空");
    } else if (gmail== ""){
        alert("學校信箱不可為空");
    } else if (password == confirm){
        var a = new Date();
        var month = String(a.getMonth()+1);
        var date = String(a.getDate());
        var hour = String(a.getHours());
        var minute = String(a.getMinutes());
        if (month.length == 1){month = "0" + month};
        if (date.length == 1){date = "0" + date};
        if (hour.length == 1){hour = "0"+hour};
        if (minute.length == 1){minute = "0" + minute};
        var time = a.getFullYear() + "-" + month  + "-" + date + " " + hour + ":" + minute;
        document.getElementById("check").innerHTML = "註冊中，請稍後...";
        document.getElementById("NewDID").disabled = true;
        $.ajax({
            url:"/CheckUsername",
            data:{"_id":username},
            success: function(python_result){
                if (python_result == "Account can be registered."){
                    data = {
                        "name":username,
                        "pub_key":"",
                        "description": "Zhushan light eID",
                        "method": "light"
                    }
                    $.ajax({
                        url:'http://52.44.57.177:8888/new_did',
                        type: 'POST',
                        headers:{
                            "contentType":"application/json;",
                            "X-API-Key":password
                        },
                        contentType: "application/json;",
                        data: JSON.stringify(data),
                        success: function(result){
                            if (result == "{'status': 'error', 'msg': 'Account already exist.'}"){
                                alert("此帳號已被註冊!");
                                window.location.assign('/SignUp.html');
                            } else if(result != "{'status': 'error', 'msg': 'Account already exist.'}"){
                                var query = {
                                    "_id":username,
                                    "password":password,
                                    "major":document.getElementById("major").value,
                                    "grade":document.getElementById("grade").value,
                                    "studentid":studentid,
                                    "gender":document.getElementById("gender").value,
                                    "DateAccountCreated":time,
                                    "gmail":gmail,
                                    "TxnHash":result,
                                    "rev":"no"
                                };
                                $.ajax({
                                    url: "/InsertNewAccount",
                                    data: query,
                                    success: function (python_result) {       
                                        alert("註冊成功，獲得1東吳幣！");
                                        document.cookie = "username="+username;
                                        window.location.assign("/SignUpReward.html");
                                    },
                                    error: function (error) {
                                        alert("註冊失敗，請檢查網路連線，再重新嘗試");
                                        window.location.assign('/SignUp.html');
                                    }
                                });
                            }
                        },
                        error: function(error){
                            alert("此帳號已被註冊");
                            window.location.assign('/SignUp.html');
                        }
                    })
                } else if (python_result == "Account has been registered."){
                    alert("此帳號已被註冊");
                    window.location.assign('/SignUp.html');
                };
            },
            error: function (error) {
                alert("註冊失敗，請檢查網路連線，再重新嘗試");
                window.location.assign('/SignUp.html');
            }
        });

    } else if (document.getElementById("confirm").value != password){
        alert("密碼不一致！");
        window.location.assign('/SignUp.html');
    }
}