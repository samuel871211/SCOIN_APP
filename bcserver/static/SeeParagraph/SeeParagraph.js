$.ajax({
    url:"/GetCertainParagraph",
    data:{"_id":location.href.split("=")[1]},
    success: function(python_result){
        CompleteTitle = "【"+python_result.class+"】"+python_result.title;
        document.getElementById("ParagraphTitle").innerHTML = CompleteTitle;
        document.getElementById("title").innerHTML = CompleteTitle;
        document.getElementById("author").innerHTML = "樓主 "+python_result.username;
        document.getElementById("time").innerHTML = python_result.time;
        document.getElementById("paragraph").innerHTML = python_result.paragraph;
        document.getElementById("like").innerHTML = python_result.like.length;
        document.getElementById("dislike").innerHTML = python_result.dislike.length;

        for(i=0;i<=python_result.response[0].content.length-1;i++){
            var TableObj = document.getElementById("AllResponse");
            var TrContent = TableObj.insertRow(TableObj.rows.length);
            
            var NewTd = TrContent.insertCell(0);
            NewTd.setAttribute("colspan","4");
            NewTd.setAttribute("style","padding:5px;width:50%");
            
            var NewB = document.createElement("b");
            NewB.setAttribute("style","font-family:Microsoft JhengHei;color:#6e7efa;padding:5px");
            NewB.id = i+","+"responser";
            NewB.innerHTML = python_result.response[0].username[i];

            var content = python_result.response[0].content[i];
            var PossibleNewB = document.createElement("b");
            PossibleNewB.setAttribute("style","font-family:Microsoft JhengHei;color:#6e7efa;padding:5px");
            if (content[0] == "[" && content[1] == "@"){
                PossibleNewB.innerHTML = content.split(",")[1].split("]")[0];
                content = content.split("]")[1];
            }
            
            var NewFont = document.createElement("font");
            NewFont.setAttribute("style","padding:5px");
            NewFont.setAttribute("face","DFKai-sb");
            NewFont.innerHTML = content;

            NewTd.append(NewB,PossibleNewB,NewFont);

            var TrFourAttribute = TableObj.insertRow(TableObj.rows.length);

            var LikeTd = TrFourAttribute.insertCell(0);
            LikeTd.setAttribute("style","padding:5px;width:5%");
            var LikeBtn = document.createElement("button");
            LikeBtn.id = i+",like";
            LikeBtn.setAttribute("onclick","InsertEmotionToResponse(this.id)");
            LikeBtn.style = "border:0;background:transparent";
            var LikeImg = document.createElement("img");
            LikeImg.setAttribute("src","/static/paragraph/like.png");
            LikeImg.setAttribute("style","width:18px");
            LikeBtn.append(LikeImg);
            var LikeCount = document.createElement("b");
            LikeCount.id = i+",likeCount";
            LikeCount.innerHTML = python_result.response[0].like[i].length;
            LikeTd.append(LikeBtn,LikeCount);

            var DislikeTd = TrFourAttribute.insertCell(1);
            DislikeTd.setAttribute("style","padding:5px;width:5%");
            var DislikeBtn = document.createElement("button");
            DislikeBtn.id = i+",dislike";
            DislikeBtn.setAttribute("onclick","InsertEmotionToResponse(this.id)");
            DislikeBtn.style = "border:0;background:transparent";
            var DislikeImg = document.createElement("img");
            DislikeImg.setAttribute("src","/static/paragraph/dislike.png");
            DislikeImg.setAttribute("style","width:18px");
            DislikeBtn.append(DislikeImg);
            var DislikeCount = document.createElement("b");
            DislikeCount.id = i+",dislikeCount";
            DislikeCount.innerHTML = python_result.response[0].dislike[i].length;
            DislikeTd.append(DislikeBtn,DislikeCount);

            var ResponseTd = TrFourAttribute.insertCell(2);
            ResponseTd.setAttribute("style","padding:5px;width:5%");
            var ResponseBtn = document.createElement("button");
            ResponseBtn.id = i+","+python_result.response[0].username[i];
            ResponseBtn.style = "border-style:none;background:transparent";
            ResponseBtn.setAttribute("onclick","reply(this.id)");
            ResponseBtn.innerHTML = "回覆";
            ResponseTd.append(ResponseBtn);

            var TimeTd = TrFourAttribute.insertCell(3);
            TimeTd.setAttribute("style","padding:5px");
            var TimeFont = document.createElement("font");
            TimeFont.innerHTML = python_result.response[0].time[i];
            TimeTd.append(TimeFont);
        };
    },
    error: function(error){
        console.log(error);
    }
})

function InsertEmotionToResponse(FloorAndEmotion) {
    $.ajax({
        url:"/InsertEmotionToResponse",
        data:{
            "username":document.cookie.split("=")[1],
            "_id":location.href.split("=")[1],
            "FloorAndEmotion":FloorAndEmotion
        },
        success: function(python_result){
            if (python_result == "Duplicate sending emotion."){
                alert("您已經針對這篇文章給予過評價了");
            } else if (python_result == "OK."){
                document.getElementById(FloorAndEmotion+"Count").innerHTML = Number(document.getElementById(FloorAndEmotion+"Count").innerHTML)+1;
                var responser = document.getElementById(FloorAndEmotion.split(",")[0]+",responser").innerHTML;
                if (responser == document.cookie.split("=")[1]){return false};
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
                $.ajax({
                    url:'/MailFromResponseEmotion',
                    data:{
                        "author":responser,
                        "href":location.href.split(":5000")[1],
                        "thing":FloorAndEmotion.split(",")[1]+","+"response",
                        "initiator":document.cookie.split("=")[1],
                        "time":time
                    },
                    success: function(python_result){
                        console.log(python_result);
                    },
                    error: function(error){
                        console.log(error);
                    }
                })            
            };
        },
        error: function(error){
            console.log(error);
        }
    })
}

function InsertEmotionToParagraph(emotion){
    $.ajax({
        url:"/InsertEmotionToParagraph",
        data:{
            "username":document.cookie.split("=")[1],
            "_id":location.href.split("=")[1],
            "emotion":emotion.split("_")[0]
        },
        success: function(python_result){
            if (python_result == "Duplicate sending emotion."){
                alert("您已經針對這篇文章給予過評價了");
            } else if (python_result == "OK."){
                document.getElementById(emotion.split("_")[0]).innerHTML = Number(document.getElementById(emotion.split("_")[0]).innerHTML)+1;

                if (document.getElementById("author").innerHTML.split(" ")[1] == document.cookie.split("=")[1]){return false};
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
                $.ajax({
                    url:'/MailFromParagraphEmotion',
                    data:{
                        "author":document.getElementById("author").innerHTML.split(" ")[1],
                        "href":location.href.split(":5000")[1],
                        "thing":emotion.split("_")[0]+","+"paragraph",
                        "initiator":document.cookie.split("=")[1],
                        "time":time
                    },
                    success: function(python_result){
                        console.log(python_result);
                    },
                    error: function(error){
                        console.log(error);
                    }
                })                
            };
        },
        error: function(error){
            console.log(error);
        }
    })
}


function InsertNewResponse() {
    if (document.getElementById("content").value == ""){return false}

    var TableObj = document.getElementById("AllResponse");
    var RowLength = (TableObj.rows.length)/2;
    var TrContent = TableObj.insertRow(TableObj.rows.length);
    
    var NewTd = TrContent.insertCell(0);
    NewTd.setAttribute("colspan","4");
    NewTd.setAttribute("style","padding:5px;width:50%");
    
    var NewB = document.createElement("b");
    NewB.id = RowLength+","+"responser";
    NewB.setAttribute("style","font-family:Microsoft JhengHei;color:#6e7efa;padding:5px");
    NewB.innerHTML = document.cookie.split("=")[1];

    PossibleNewB = document.createElement("b");
    PossibleNewB.setAttribute("style","font-family:Microsoft JhengHei;color:#6e7efa;padding:5px");
    if (document.getElementById("content").placeholder != "回覆文章..."){
        PossibleNewB.innerHTML = document.getElementById("content").placeholder.split(",")[1].split("]")[0]
    }

    var NewFont = document.createElement("font");
    NewFont.setAttribute("style","padding:5px");
    NewFont.setAttribute("face","DFKai-sb");
    NewFont.innerHTML = document.getElementById("content").value;

    NewTd.append(NewB,PossibleNewB,NewFont);

    var TrFourAttribute = TableObj.insertRow(TableObj.rows.length);

    var LikeTd = TrFourAttribute.insertCell(0);
    LikeTd.setAttribute("style","padding:5px;width:5%");
    var LikeBtn = document.createElement("button");
    LikeBtn.id = RowLength+",like";
    LikeBtn.setAttribute("onclick","InsertEmotionToResponse(this.id)");
    LikeBtn.style = "border:0;background:transparent";
    var LikeImg = document.createElement("img");
    LikeImg.setAttribute("src","/static/paragraph/like.png");
    LikeImg.setAttribute("style","width:18px");
    LikeBtn.append(LikeImg);
    var LikeCount = document.createElement("b");
    LikeCount.id = RowLength+",likeCount";
    LikeCount.innerHTML = "0";
    LikeTd.append(LikeBtn,LikeCount);

    var DislikeTd = TrFourAttribute.insertCell(1);
    DislikeTd.setAttribute("style","padding:5px;width:5%");
    var DislikeBtn = document.createElement("button");
    DislikeBtn.id = RowLength+",dislike";
    DislikeBtn.setAttribute("onclick","InsertEmotionToResponse(this.id)");
    DislikeBtn.style = "border:0;background:transparent";
    var DislikeImg = document.createElement("img");
    DislikeImg.setAttribute("src","/static/paragraph/dislike.png");
    DislikeImg.setAttribute("style","width:18px");
    DislikeBtn.append(DislikeImg);
    var DislikeCount = document.createElement("b");
    DislikeCount.id = RowLength+",dislikeCount";
    DislikeCount.innerHTML = "0";
    DislikeTd.append(DislikeBtn,DislikeCount);

    var ResponseTd = TrFourAttribute.insertCell(2);
    ResponseTd.setAttribute("style","padding:5px;width:5%");
    var ResponseBtn = document.createElement("button");
    ResponseBtn.id = RowLength + "," + document.cookie.split("=")[1];
    ResponseBtn.setAttribute("onclick","reply(this.id)");
    ResponseBtn.style = "border-style:none;background:transparent";
    ResponseBtn.innerHTML = "回覆";
    ResponseTd.append(ResponseBtn);

    var TimeTd = TrFourAttribute.insertCell(3);
    TimeTd.setAttribute("style","padding:5px");
    var TimeFont = document.createElement("font");
    var a = new Date();
    var minutes = a.getMinutes();
    if(minutes<10){minutes = "0" + minutes};
    var time = a.getFullYear()+"/"+(a.getMonth()+1)+"/"+a.getDate()+" "+a.getHours()+":"+minutes;
    TimeFont.innerHTML = time;
    TimeTd.append(TimeFont);

    var content = document.getElementById("content");
    if (content.placeholder != "回覆文章..."){content.value = content.placeholder + content.value}
    $.ajax({
        url:"/InsertNewResponse",
        data:{
            "username":document.cookie.split("=")[1],
            "content":content.value,
            "time":time,
            "_id":location.href.split("=")[1]
        },
        success: function(python_result){
            console.log(python_result);
        },
        error: function(error){
            console.log(error);
        }
    })
    document.getElementById("content").value = "";

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
    
    if (content.placeholder != "回覆文章..."){
        $.ajax({
            url:'/MailFromTagResponse',
            data:{
                "author":content.placeholder.split(",")[1].split("]")[0],
                "href":location.href.split(":5000")[1],
                "thing":"tag,response",
                "initiator":document.cookie.split("=")[1],
                "time":time
            },
            success: function(python_result){
                console.log(python_result);
            },
            error: function(error){
                console.log(error);
            }
        })
    }

    if (document.getElementById("author").innerHTML.split(" ")[1] == document.cookie.split("=")[1]){return false};
    
    $.ajax({
        url:'/MailFromParagraphResponse',
        data:{
            "author":document.getElementById("author").innerHTML.split(" ")[1],
            "href":location.href.split(":5000")[1],
            "thing":"response,paragraph",
            "initiator":document.cookie.split("=")[1],
            "time":time
        },
        success: function(python_result){
            console.log(python_result);
        },
        error: function(error){
            console.log(error);
        }
    })
}

function reply(BtnId){
    if (document.cookie.split("=")[1] == BtnId.split(",")[1]){
        alert("您不可於留言區回覆自己！");
        return false;
    }
    document.getElementById("content").placeholder = "[@" + BtnId.split(",")[0] + "樓," + BtnId.split(",")[1] + "]";
    document.getElementById("content").scrollIntoView({block:"end"});
}