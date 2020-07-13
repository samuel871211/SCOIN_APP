$.ajax({
    url:'/GetMyMail',
    data:{"username":document.cookie.split("=")[1]},
    success: function(python_result){
        document.getElementById("before").style = "display:none";
        var tableObj = document.getElementById("AllMail");
        for(i=0;i<python_result.thing.length;i++){
            var tr = tableObj.insertRow(tableObj.rows.length);
            var td = tr.insertCell(0);
            
            var img = document.createElement("img");
            img.setAttribute("width","50px");
            img.style = "float:left;padding-left:2px;padding-top:5px";
            if (python_result.thing[i].split(",")[0] == "like"){
                img.setAttribute("src","/static/paragraph/like.png");
            } else if (python_result.thing[i].split(",")[0] == "dislike"){
                img.setAttribute("src","/static/paragraph/dislike.png");
            } else if (python_result.thing[i].split(",")[0] == "response"){
                img.setAttribute("src","/static/paragraph/respond.png");
            } else if (python_result.thing[i].split(",")[0] == "tag"){
                img.setAttribute("src","/static/paragraph/respond.png");
            } else if (python_result.thing[i].split(",")[0] == "accept"){
                img.setAttribute("src","/static/UserCenter/money.jpg");
            }

            var a = document.createElement("a");
            a.style = "float:left;padding:5px;text-decoration:none";
            a.setAttribute("href",python_result.href[i]);
            var b = document.createElement("b");
            b.style = "font-size:20px;font-weight:bold;color:#000000;font-family:Microsoft JhengHei";
            var behavior = python_result.thing[i].split(",")[0];
            var object = python_result.thing[i].split(",")[1];
            if (behavior == "like"){
                behavior = "讚";
            } else if (behavior == "dislike"){
                behavior = "噓";
            } else if (behavior == "response"){
                behavior = "回覆";
            } else if (behavior == "tag"){
                behavior = "標記";
            } else if (behavior == "accept"){
                behavior = "接";
            }

            if (object == "paragraph"){
                object = "文章";
            } else if (object == "response"){
                object = "回覆";
            } else if (object == "bounty"){
                object = "懸賞";
            }

            if (python_result.initiator[i] == document.cookie.split("=")[1]){
                python_result.initiator[i] = "您";
            }
            if (python_result.author[i] == document.cookie.split("=")[1]){
                python_result.author[i] = "您";
            }
            b.innerHTML = python_result.initiator[i]+behavior+"了"+python_result.author[i]+"的"+object+"，快去查看！";
            a.append(b);

            var br = document.createElement("br");

            var font = document.createElement("font");
            font.style ="float:right;padding:3px";
            font.innerHTML = python_result.time[i];

            td.append(img,a,br,font);
        }
    },
    error: function(error){
        console.log(error);
    }
})
