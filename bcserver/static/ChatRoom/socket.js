function NewData() {
    var message = document.getElementById("SendMessage").value.replace(/\n/g,"<br>");
    if(message != ""){
        var socket = io.connect();
        socket.emit('Server',location.href.split("?")[1][0],document.cookie.split("=")[1],String(new Date()).split(" ")[4],message);
        document.getElementById("SendMessage").value = "";
    }
}

function LeaveChatRoom() {
    var SocketForDisconnect = io.connect();
    SocketForDisconnect.emit('ServerDisconnect',location.href.split("?")[1][0],document.cookie.split("=")[1],String(new Date()).split(" ")[4]);
    window.location.assign('/UserCenter.html');
}

var socket = io();

socket.on(location.href.split("?")[1][0],function(python_result){
    var parent = document.getElementById("StartFromHere");
    var div = document.createElement("div");
    div.style = "padding-left:3px;padding-right:3px;margin-top:5px";
    var DivForNameAndTime = document.createElement("div");
    var NameAndTime = document.createElement("b");
    var MessageArea = document.createElement("button");
    if (python_result.username == document.cookie.split("=")[1]){
        div.align= "right";
        NameAndTime.innerHTML = python_result.time;
        MessageArea.style = "border:1px;border-style:solid;border-radius:5px;background-color:#73f575;max-width:275px;word-wrap:break-word;text-align:left;outline:none;font-size:16px;font-family:Microsoft JhengHei";
        // MessageArea.align = "left";
    } else if (python_result.username != document.cookie.split("=")[1]){
        NameAndTime.innerHTML = python_result.username + " - " + python_result.time;
        MessageArea.style = "border:1px;border-style:solid;border-radius:5px;background-color:#73f575;max-width:275px;word-wrap:break-word;text-align:left;outline:none;font-size:16px;font-family:Microsoft JhengHei";
    };
    MessageArea.innerHTML = python_result.message;
    DivForNameAndTime.append(NameAndTime);
    div.append(DivForNameAndTime,MessageArea);
    parent.appendChild(div);
    document.getElementById("ShowArea").scrollTop = document.getElementById("ShowArea").scrollHeight;
})

socket.on(location.href.split("?")[1][0]+"disconnect",function(python_result){
    var parent = document.getElementById("StartFromHere");
    var div = document.createElement("div");
    var SystemMessage = document.createElement("div");
    div.align = "center";
    div.style = "padding-left:5px;padding-right:5px;margin-top:5px";
    SystemMessage.style = "padding:2px;max-width:300px;word-break:break-all;border:1px;border-style:solid;border-radius:5px;background-color:#73f575;font-family:Microsoft JhengHei";
    SystemMessage.innerHTML = python_result.username+"於"+python_result.time+"離開了聊天室";
    div.append(SystemMessage);
    parent.appendChild(div);
    document.getElementById("ShowArea").scrollTop = document.getElementById("ShowArea").scrollHeight;
})

socket.on(location.href.split("?")[1][0]+"connect",function(python_result){
    var parent = document.getElementById("StartFromHere");
    var div = document.createElement("div");
    var SystemMessage = document.createElement("div");
    div.align = "center";
    div.style = "padding-left:5px;padding-right:5px;margin-top:5px";
    SystemMessage.style = "padding:2px;max-width:300px;word-break:break-all;border:1px;border-style:solid;border-radius:5px;background-color:#73f575;font-family:Microsoft JhengHei";
    SystemMessage.innerHTML = python_result.username+"於"+python_result.time+"進入了聊天室";
    div.append(SystemMessage);
    parent.appendChild(div);
    document.getElementById("ShowArea").scrollTop = document.getElementById("ShowArea").scrollHeight;
})