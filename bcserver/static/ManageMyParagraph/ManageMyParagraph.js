$.ajax({
    url:"/GetMyParagraph",
    data:{"username":document.cookie.split("=")[1]},
    success: function(python_result){
        var TableObj = document.getElementById("AllParagraph");
        for(i=0;i<python_result.title.length;i++){
            var FirstTr = TableObj.insertRow(TableObj.rows.length);
            
            var TitleTd = FirstTr.insertCell(0);
            TitleTd.setAttribute("colspan","4");
            TitleTd.style="width:400px";
            var NewA = document.createElement("a");
            NewA.style = "font-size:20px;text-decoration:none;font-weight:bold;color:#000000;font-family:Microsoft JhengHei"
            NewA.setAttribute("href","/SeeParagraph.html?_id="+python_result._id[i]);
            NewA.innerHTML = "【"+python_result.class[i]+"】"+python_result.title[i];
            TitleTd.append(NewA);
            
            var EditTd = FirstTr.insertCell(1);
            EditTd.style = "width:50px"; 
            EditTd.setAttribute("align","right");
            var NewA = document.createElement("a");
            NewA.style = "font-size:15px;text-decoration:none;font-weight:bold;color:#000000;font-family:Microsoft JhengHei";
            NewA.setAttribute("href","/PublishParagraph.html?"+python_result._id[i]);
            NewA.innerHTML = "編輯";
            EditTd.append(NewA);

            var NewTr = TableObj.insertRow(TableObj.rows.length);
            for(j=0;j<=4;j++){
                var NewTd = NewTr.insertCell(j);
                if(j==0){
                    var like = document.createElement("img");
                    like.src = "/static/paragraph/like.png";
                    like.style = "width:18px";
                    var number = document.createElement("b");
                    number.innerHTML = python_result.like[i];
                    NewTd.append(like,number);
                } else if(j==1){
                    var dislike = document.createElement("img");
                    dislike.src = "/static/paragraph/dislike.png";
                    dislike.style = "width:18px";
                    var number = document.createElement("b");
                    number.innerHTML = python_result.dislike[i];
                    NewTd.append(dislike,number);
                } else if(j==2){
                    var respond = document.createElement("img");
                    respond.src = "/static/paragraph/respond.png";
                    respond.style = "width:18px";
                    var number = document.createElement("b");
                    number.innerHTML = python_result.ResponseLength[i];
                    NewTd.append(respond,number);
                } else if(j==3){
                    NewTd.align = "left";
                    var time = document.createElement("b");
                    time.innerHTML =  python_result.time[i];
                    NewTd.append(time);
                } else if(j==4){
                    NewTd.align = "right";
                    var del = document.createElement("a");
                    del.setAttribute("href","/PublishParagraph.html");
                    del.style = "font-size:15px;text-decoration:none;font-weight:bold;color:#000000;font-family:Microsoft JhengHei";
                    del.innerHTML = "刪除";
                    NewTd.append(del);
                }
            }
        };
    },
    error: function(error){
        alert(error);
    }           
})