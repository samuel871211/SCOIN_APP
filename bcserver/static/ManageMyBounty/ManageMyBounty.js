$(document).ready(function(){
    $.ajax({
        url:"/GetMyBounty",
        data:{"username":document.cookie.split("=")[1]},
        success: function(python_result){
            var TableObj = document.getElementById("AllBounty");
            for(i=0;i<python_result.thing.length;i++){
                var NewRow = TableObj.insertRow(TableObj.rows.length);
                for(c=0;c<=5;c++){
                    var TempTd = NewRow.insertCell(c);
                    if(c==0){
                        TempTd.style = "width:100px";
                        TempTd.id = i+"_"+c;
                        TempTd.innerHTML = python_result.class[i];
                    }
                    else if(c==1){
                        TempTd.style = "width:400px";
                        TempTd.id = i+"_"+c;
                        TempTd.innerHTML = python_result.thing[i];
                    } else if(c==2){
                        TempTd.style = "width:50px";
                        TempTd.id = i+"_"+c;
                        TempTd.innerHTML = python_result.reward[i];
                    } else if(c==3){
                        TempTd.style = "width:120px";
                        TempTd.id = i+"_"+c;
                        TempTd.innerHTML = python_result.time[i];
                    } else if(c==4){
                        TempTd.style = "width:100px";
                        TempTd.id = i+"_"+c;
                        TempTd.innerHTML = python_result.place[i];
                    } else if(c==5){
                        var del = document.createElement("button");
                        del.innerHTML = "刪除"
                        del.id = i+"_d"
                        var mod = document.createElement("button");
                        mod.innerHTML = "修改"
                        mod.id = i+"_m"
                        TempTd.style = "width:100px";
                        TempTd.id = i+"_"+c;
                        del.addEventListener('click',function(){
                            var conf = confirm("確認刪除？(刪除後不可恢復！)")
                            if(conf == true) {
                                prefix = event.target.id[0] + event.target.id[1];
                                query = {
                                    "thing":document.getElementById(prefix+1).innerHTML,
                                    "reward":document.getElementById(prefix+2).innerHTML,
                                    // "time":document.getElementById(prefix+2).innerHTML, 
                                    // "place":document.getElementById(prefix+3).innerHTML
                                };
                                $.ajax({
                                    url:"/DeleteBounty",
                                    data:query,
                                    success: function(python_result) {
                                        console.log(python_result);
                                        alert("成功刪除，將自動為您重整網頁");
                                        window.location.assign("/ManageMyBounty.html");
                                    },
                                    error: function(error) {
                                        console.log(error);
                                    }
                                });
                            }
                        })
                        mod.addEventListener('click',function(){
                            window.location.assign("/PublishBounty.html")
                        })
                        TempTd.appendChild(del);
                        TempTd.appendChild(mod);
                    }
                };
            };
        },
        error: function(error){
            alert(error);
        }           
    })
})