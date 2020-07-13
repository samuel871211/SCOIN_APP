function WriteParagraphToHTML(python_result){
    var TableObj = document.getElementById("AllParagraph");
    for(i=0;i<python_result.title.length;i++){
        var TitleTr = TableObj.insertRow(TableObj.rows.length);
        var TitleTd = TitleTr.insertCell(0);
        TitleTd.setAttribute("colspan","4");
        TitleTd.style="width:400px";
        var NewA = document.createElement("a");
        NewA.style = "font-size:20px;text-decoration:none;font-weight:bold;color:#000000;font-family:Microsoft JhengHei"
        NewA.setAttribute("href","/SeeParagraph.html?_id="+python_result._id[i]);
        NewA.innerHTML = "【"+python_result.class[i]+"】"+python_result.title[i];
        TitleTd.append(NewA);

        var NewTr = TableObj.insertRow(TableObj.rows.length);
        for(j=0;j<=3;j++){
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
            };
        };
    };
}

$.ajax({
    url:"/GetAllParagraph",
    success: function(python_result){
        WriteParagraphToHTML(python_result);
    },
    error: function(error){
        alert(error);
    }           
})

function ReloadClass() {
    if (document.getElementById("ClassList").value == "所有"){window.location.reload("/Paragraph.html")}
    $.ajax({
        url:"/GetParagraphByClass",
        data:{"class":document.getElementById("ClassList").value},
        success: function(python_result) {
            document.getElementById("AllParagraph").innerHTML = "";
            WriteParagraphToHTML(python_result);
        },
        error: function(error){
            console.log(error);
        }
    })
}

function ReloadSort() {
    if (document.getElementById("SortList").value == "時間"){window.location.reload("/Paragraph.html")}
    $.ajax({
        url:"/GetParagraphBySort",
        data:{"sort":document.getElementById("SortList").value},
        success: function(python_result){  
            document.getElementById("AllParagraph").innerHTML = "";
            WriteParagraphToHTML(python_result);
        },
        error: function(error){
            console.log(error);
        }
    });
}

function search() {
    if (document.getElementById("SearchInput").value != ""){
        $.ajax({
            url:"/SearchParagraph",
            data:{"title":document.getElementById("SearchInput").value},
            success: function(python_result){
                if (python_result.paragraph.length == 0){
                    alert("很抱歉，沒有找到相關結果");
                    return false;
                };
                document.getElementById("AllParagraph").innerHTML = "";
                WriteParagraphToHTML(python_result);
            },
            error: function(error){
                console.log(error);
            }
        })
    }
}