$.ajax({
    url:"/GetALLChatHistory",
    data:{"ChatRoom":location.href.split("?")[1][0]},
    success: function(python_result){
        for (i=0;i<python_result.username.length;i++){
            
            var parent = document.getElementById("StartFromHere");
            var div = document.createElement("div");
            div.style = "padding-left:5px;padding-right:5px;margin-top:5px";

            var DivForNameAndTime = document.createElement("div");
            var NameAndTime = document.createElement("b");
            var MessageArea = document.createElement("button");
            
            if (python_result.message[i] == "entered the chat room."){
                var SystemMessage = document.createElement("div");
                div.align = "center";
                SystemMessage.style = "padding:2px;max-width:300px;word-break:break-all;border:1px;border-style:solid;border-radius:5px;background-color:#73f575;font-family:Microsoft JhengHei";
                SystemMessage.innerHTML = python_result.username[i]+"於"+python_result.time[i]+"進入了聊天室";
                div.append(SystemMessage);
            } else if (python_result.message[i] == "left the chat room."){
                var SystemMessage = document.createElement("div");
                div.align = "center";
                SystemMessage.style = "padding:2px;max-width:300px;word-break:break-all;border:1px;border-style:solid;border-radius:5px;background-color:#73f575;font-family:Microsoft JhengHei";
                SystemMessage.innerHTML = python_result.username[i]+"於"+python_result.time[i]+"離開了聊天室";
                div.append(SystemMessage);
            } else if (python_result.username[i] == document.cookie.split("=")[1]){
                div.align = "right";
                NameAndTime.innerHTML = python_result.time[i];
                MessageArea.style = "border:1px;border-style:solid;border-radius:5px;background-color:#73f575;max-width:275px;word-wrap:break-word;text-align:left;outline:none;font-size:16px;font-family:Microsoft JhengHei";
                MessageArea.align = "left";
                MessageArea.innerHTML = python_result.message[i];
                DivForNameAndTime.append(NameAndTime);
                div.append(DivForNameAndTime,MessageArea);
            } else if (python_result.username[i] != document.cookie.split("=")[1]){
                NameAndTime.innerHTML = python_result.username[i] + " - " + python_result.time[i];
                MessageArea.style = "border:1px;border-style:solid;border-radius:5px;background-color:#73f575;max-width:275px;word-wrap:break-word;text-align:left;outline:none;font-size:16px;font-family:Microsoft JhengHei";
                MessageArea.innerHTML = python_result.message[i];
                DivForNameAndTime.append(NameAndTime);
                div.append(DivForNameAndTime,MessageArea);
            }
            parent.appendChild(div);
            document.getElementById("ShowArea").scrollTop = document.getElementById("ShowArea").scrollHeight;
        }
    },
    error: function (error) {
        console.log("error");
    }
})