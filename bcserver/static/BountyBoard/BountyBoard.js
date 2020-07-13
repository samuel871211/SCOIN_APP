$.ajax({
    url:"/GetAllBounty",
    success: function(python_result){
        var TableObj = document.getElementById("AllBounty");
        for(i=0;i<python_result.thing.length;i++){
            var NewRow = TableObj.insertRow(TableObj.rows.length);
            for(c=0;c<=5;c++){
                var TempTd = NewRow.insertCell(c);
                if(c==0){
                    TempTd.style = "width:100px";
                    TempTd.innerHTML = python_result.class[i];
                } else if(c==1){
                    TempTd.style = "width:400px";
                    TempTd.innerHTML = python_result.thing[i];
                } else if(c==2){
                    TempTd.style = "width: 50px";
                    TempTd.innerHTML = python_result.reward[i];
                } else if(c==3){
                    TempTd.style = "width:120px";
                    TempTd.innerHTML = python_result.time[i];
                } else if(c==4){
                    TempTd.style = "width:100px";
                    TempTd.innerHTML = python_result.place[i];
                } else if(c==5){
                    TempTd.style = "width:100px";
                    var btn = document.createElement("button");
                    btn.id = i+","+python_result.username[i];
                    btn.setAttribute("onclick","Accept(this.id)");
                    btn.innerHTML = "接單";
                    TempTd.append(btn);
                }
            };
        };
    },
    error: function(error){
        alert(error);
    }           
})

function Accept(publisher){
    if (document.cookie.split("=")[1] == publisher.split(",")[1]){
        alert("您不可接自己的單！");
        return false;
    }
    var tr = document.getElementById("AllBounty").rows.item(parseInt(publisher.split(",")[0],10)+1);
    var data = "類別:"+tr.cells[0].innerHTML+"\n"+"內容:"+tr.cells[1].innerHTML+"\n"+"獎勵:"+tr.cells[2].innerHTML+"\n"+"時間:"+tr.cells[3].innerHTML+"\n"+"地點:"+tr.cells[4].innerHTML+"\n"+"\n"+"確定接單？";
    var r = confirm(data);
    if (r == true){
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
            url:'MailFromBounty',
            data:{
                "author":publisher.split(",")[1],
                "time":time,
                "thing":"accept,bounty",
                "initiator":document.cookie.split("=")[1],
                "class":tr.cells[0].innerHTML,
                "PublishThing":tr.cells[1].innerHTML,
                "reward":tr.cells[2].innerHTML,
                "PublishTime":tr.cells[3].innerHTML,
            },
            success: function(python_result){
                window.location.assign(python_result);
            },
            error: function(error){
                alert("網路錯誤");
                console.log(error);
            }
        })
    } else{
        console.log("不接單");
    }
}