function JoinDailyPair() {
    document.getElementById("JoinDailyPair").disabled = true;
    document.getElementById("EnterChatRoom").disabled = true;
    var password = document.getElementById("password").value;
    var username = document.cookie.split("=")[1];
    if (password == ""){
        document.getElementById("JoinDailyPair").disabled = false;
        document.getElementById("EnterChatRoom").disabled = false;
        alert("請輸入密碼!!!");
        return false;
    }
    document.getElementById("password").value = "";
    $.ajax({
        url:"http://52.44.57.177:8888/get_balance",
        data:{"user":username},
        type: 'GET',
        success: function(result){
            if (result == ""){
                alert("你沒東吳幣了");
            } else if (result != ""){
                $.ajax({
                    url:"/JoinDailyPair",
                    data:{"username":username,"password":password},
                    success: function(python_result) {
                        if(python_result == "Password is wrong."){
                            document.getElementById("JoinDailyPair").disabled = false;
                            document.getElementById("EnterChatRoom").disabled = false;
                            alert(python_result);
                        } else if(python_result == "User doesn't exist."){
                            document.cookie = "username="+""+";expires="+new Date(0);
                            alert(python_result);
                            window.location.assign("/");
                        } else if (python_result == "OK."){
                            document.getElementById("notice").innerHTML = "報名配對中，請耐心等候...";
                            var data = {
                                "sen":username,
                                "rev":"thane",
                                "method":"2",
                                "description":"DailyPair",
                                "txn":result.split("\n")[0],
                            }
                            $.ajax({
                                url: "http://52.44.57.177:8888/send_token",
                                type: 'POST',
                                headers:{
                                    "contentType":"application/json;",
                                    "X-API-Key":password,
                                },
                                contentType: "application/json;",
                                data: JSON.stringify(data),
                                success: function (result) {
                                    document.getElementById("JoinDailyPair").disabled = false;
                                    document.getElementById("EnterChatRoom").disabled = false;
                                    document.getElementById("notice").innerHTML = "";
                                    alert("報名&轉帳成功");
                                },
                                error: function (error) {
                                    console.log(error);
                                    document.getElementById("JoinDailyPair").disabled = false;
                                    document.getElementById("EnterChatRoom").disabled = false;
                                    alert("轉帳失敗");
                                }
                            });
                        } else if (python_result == "Duplicate request."){
                            document.getElementById("EnterChatRoom").disabled = false;
                            alert("你已經報名過了==");
                        }
                    },
                    error: function(error) {
                        console.log(error);
                    }
                });
            };
        },
        error: function(error){
            console.log(error);
        }
    })
}

function EnterChatRoom() {
    document.getElementById("JoinDailyPair").disabled = true;
    document.getElementById("EnterChatRoom").disabled = true;
    var password = document.getElementById("password").value;
    var username = document.cookie.split("=")[1];
    if (password == ""){
        alert("請輸入密碼!!!");
        document.getElementById("JoinDailyPair").disabled = false;
        document.getElementById("EnterChatRoom").disabled = false;
        return false;
    };
    document.getElementById("password").value = "";
    $.ajax({
        url:"/EnterChatRoom",
        data:{"username":username,"password":password},
        success: function(python_result){
            if (python_result == "Rejected"){
                document.getElementById("JoinDailyPair").disabled = false;
                document.getElementById("EnterChatRoom").disabled = false;
                alert("進入聊天室失敗");
            } else if (python_result != "Rejected"){
                var SocketForConnect = io.connect();
                SocketForConnect.emit('ServerConnect',python_result.split("pbkdf2")[0],document.cookie.split("=")[1],String(new Date()).split(" ")[4]);
                window.location.assign("/ChatRoom.html?"+python_result);
            }
        },
        error: function(error){
            console.log(error);
        }
    })
}