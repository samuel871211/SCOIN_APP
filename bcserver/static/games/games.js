var a = new Date();             

var month = String(a.getMonth()+1);
var date = String(a.getDate());
if (month.length == 1){month = "0" + month};
if (date.length == 1){date = "0" + date};
var today = String(a.getFullYear() + "-" + month  + "-" + date);

var hour = String(a.getHours())
var minute = String(a.getMinutes())
if (hour.length == 1){hour = "0" + hour};
if (minute.length == 1){minute = "0" +minute};
var CurTime = hour + ":" + minute;

FiveNumber = new Array();

function GetInfo(arg){
    if (arg == "猜數字"){
        document.getElementById("GetInfoGuess").style = "background-color:#aba8a7";
        document.getElementById("GetInfo539").style = "";
        document.getElementById("539").style = "display:none";
        document.getElementById("ABGame").style = "margin-left:25%;margin-right:25%;border-width:1px;border-color:#0f0f0f;border-style:solid";
    } else if (arg == "今彩539"){
        document.getElementById("GetInfo539").style = "background-color:#aba8a7";
        document.getElementById("GetInfoGuess").style = "";
        document.getElementById("ABGame").style = "display:none";
        document.getElementById("539").style = "margin-left:25%;margin-right:25%;border-width:1px;border-color:#0f0f0f;border-style:solid";
    }
}

function start(){
    document.getElementById("StartABGame").disabled = true;
    $.ajax({
        url:'/JoinABGame',
        data:{"username":document.cookie.split("=")[1],"today":today},
        success: function(python_result){
            if (python_result == "new client" || python_result == "today first join"){
                alert("這次您今天第一次參加");
                document.getElementById("start").style = "display:none";
                document.getElementById("AnswerArea").style = "";
            	document.getElementById("history").style = "";
            } else if (python_result != "new client"){
            	if (python_result[today][python_result[today].length-1].split(",")[1] == "4A0B"){
            		alert("您今天已經玩過囉!");
            		return false;
            	} else if (python_result[today].length > 1){
                    for (i=1;i<python_result[today].length;i++){
                        var parent = document.getElementById("history");
                        var div = document.createElement("div");
                        div.innerHTML = python_result[today][i].split(",")[0] + " " + python_result[today][i].split(",")[1];
                        parent.appendChild(div);
                    };
                };
            	document.getElementById("history").style = "";
                document.getElementById("AnswerArea").style = "";
            	document.getElementById("start").style = "display:none";
            };
        },
        error: function(error){
            console.log(error);
        }
    })
}
function guess(){
    number = document.getElementById("number").value;
    if (number.length != 4){
        document.getElementById("number").value = "";
        alert("請輸入四位數!");
        return false;
    } else if (number[0] == number[1] || number[0] == number[2] || number[0] == number[3] || number[1] == number[2] || number[1] == number[3] || number[2] == number[3]){
        document.getElementById("number").value = "";
        alert("輸入的數字有重複!");
        return false;
    };
    document.getElementById("go").disabled = true;
    $.ajax({
        url:'/DetermineAB',
        data:{"username":document.cookie.split("=")[1],"number":number,"today":today},
        success: function(python_result){
            var parent = document.getElementById("history");
            var div = document.createElement("div");
            div.innerHTML = number + " " + python_result.split(",")[1];
            parent.append(div);
            document.getElementById("number").value = "";
            document.getElementById("go").disabled = false;
            if (python_result.split(",")[1] == "4A0B"){
            	var div = document.createElement("div");
            	div.id = "warning";
            	if (python_result.split(",")[0] <= 10){
            		div.innerHTML = "恭喜您在10次內答對，獎勵發送中...";
            		parent.append(div);
            		document.getElementById("AnswerArea").style = "display:none";
            		$.ajax({
						url:'/GetLayer1',
						data:{"rev":"layer1-1"},
						success: function(python_result){
							$.ajax({
				                url: "http://52.44.57.177:8888/get_balance",
				                data:{"user":python_result._id},
				                type: 'GET',
				                success: function(result) {
				                    var data = {
				                        "sen":python_result._id,
				                        "rev":document.cookie.split("=")[1],
				                        "method":"2",
				                        "description":"DailyABGameReward",
				                        "txn":result.split("\n")[0],
				                    }
				                    $.ajax({
				                        url: "http://52.44.57.177:8888/send_token",
				                        type: 'POST',
				                        headers:{
				                            "contentType":"application/json;",
				                            "X-API-Key":python_result.psd,
				                        },
				                        contentType: "application/json;",
				                        data: JSON.stringify(data),
				                        success: function (result) {
				                        	document.getElementById("warning").innerHTML = "轉帳成功~";
				                        },
				                        error: function (error) {
				                            alert("轉帳失敗");
				                        }
				                    });
				                },
				                error: function (error) {
				                    alert("網路問題");
				                }
				            });
						},
						error: function(error){
							console.log(error);
						}
					})
            	} else if (python_result.split(",")[0] > 10){
            		div.innerHTML = "恭喜您答對了，但是沒有獎勵QQ";
            		parent.append(div);
            		document.getElementById("AnswerArea").style = "display:none";
            	}
            }
        }
    })
}

function OpenClose(arg){
	if (arg.split("games/")[1].split(".png")[0] == "open"){
		document.getElementById("detail").style = "";
		document.getElementById("OpenClose").innerHTML = '<img src="/static/games/close.png" width="12">';
	} else if (arg.split("games/")[1].split(".png")[0] == "close"){
		document.getElementById("detail").style = "display:none";
		document.getElementById("OpenClose").innerHTML = '<img src="/static/games/open.png" width="12">';
	}
}

function OpenCloseFor539(arg){
    if (arg.split("games/")[1].split(".png")[0] == "open"){
        document.getElementById("DetailFor539").style = "";
        document.getElementById("OpenCloseFor539").innerHTML = '<img src="/static/games/close.png" width="12">';
    } else if (arg.split("games/")[1].split(".png")[0] == "close"){
        document.getElementById("DetailFor539").style = "display:none";
        document.getElementById("OpenCloseFor539").innerHTML = '<img src="/static/games/open.png" width="12">';
    }
}

function start539(){
    if ("22:59" >= CurTime && CurTime >= "00:00"){
        document.getElementById("Start539Btn").disabled = true;
        $.ajax({
            url:'/Join539',
            data:{"username":document.cookie.split("=")[1],"today":today},
            success: function(python_result){
                if (python_result == "new client start539" || python_result == "today first start539"){
                    console.log(python_result);
                    var parent = document.getElementById("SelectingArea");
                    for (j=0;j<=30;j+=13){
                        var div = document.createElement("div");
                        for (i=1;i<=13;i++){
                            var btn = document.createElement("button")
                            btn.setAttribute("onclick","Select5Number(this.innerHTML)");
                            btn.innerHTML = i+j;
                            btn.style = "width:30px;height:30px;border-radius:100%;background-color:#61fa3e;border-width:1px;border-color:#000000 solid";
                            div.append(btn);
                        }
                        parent.append(div);
                    }
                    var div = document.createElement("div");
                    div.id = "NoticeFor539";
                    div.innerHTML = "請點選5個不重複的數字";
                    parent.append(div);
                    document.getElementById("start539").style = "display:none";
                } else if (python_result[today] != NaN){
                    alert("您今日已經參加過金彩539了，您選的數字為"+python_result[today]);
                }
            }
        })
    } else {
        alert("活動期間為每天00:00~22:59");
        return false;
    }
}

function Select5Number(arg){
    if (FiveNumber.length == 5){
        alert("已選擇5個數字了");
        return false;
    }
    if (FiveNumber.length == 0){
        FiveNumber.push(arg);
        document.getElementById("NoticeFor539").innerHTML = "您選擇的數字為:"+FiveNumber;
    } else if (FiveNumber.length > 0){
        if (FiveNumber.indexOf(arg) != -1){
            alert("數字不可重複!");
        } else if(FiveNumber.indexOf(arg) == -1){
            FiveNumber.push(arg);
            document.getElementById("NoticeFor539").innerHTML = "您選擇的數字為:"+FiveNumber;
            if (FiveNumber.length == 5){
                document.getElementById("CheckingArea").style = "";
            }
        }
    }
}

function confirm(arg){
    if (arg == "下好離手"){
        document.getElementById("CheckingArea").style = "display:none";
        document.getElementById("NoticeFor539").innerHTML = "資料傳送中...";
        $.ajax({
            url:'/Join539',
            data:{
                "username":document.cookie.split("=")[1],
                "numbers":String(FiveNumber),
                "today":today
            },
            success: function(python_result){
                alert("傳送成功，晚上8點開獎~");
                window.location.assign("/games.html");
            },
            error: function(error){
                console.log(error);
            }
        })
    } else if (arg == "重新選擇"){
        FiveNumber = [];
        document.getElementById("NoticeFor539").innerHTML = "請點選5個不重複的數字";
        document.getElementById("CheckingArea").style = "display:none";
    }
}

function WinningNumbers(){
    if ("23:59" >= CurTime && CurTime >= "23:00"){
        document.getElementById("start539").style = "display:none";
        $.ajax({
            url:"/WinningNumbers",
            data:{"today":today},
            success: function(python_result){
                $.ajax({
                    url:'/Join539',
                    data:{"username":document.cookie.split("=")[1],"today":today},
                    success: function(result){
                        if (python_result[today] != NaN){
                            document.getElementById("RankingArea").style = "";
                            document.getElementById("YourNumbers").innerHTML = "您的號碼："+result[today];
                            document.getElementById("TodayWinningNumbers").innerHTML = "本期號碼："+python_result.WinningNumbers;
                        } else {
                            document.getElementById("RankingArea").style = "";
                            document.getElementById("YourNumbers").innerHTML = "您的號碼：";
                            document.getElementById("TodayWinningNumbers").innerHTML = "本期號碼："+python_result.WinningNumbers;
                        };          
                    },
                    error:function(error){
                        alert("網路連線不穩，請檢查");
                        window.location.assign('/games.html');
                    }
                })
                Area5 = document.getElementById("Area5");
                Area4 = document.getElementById("Area4");
                Area3 = document.getElementById("Area3");
                Area2 = document.getElementById("Area2");
                Area1 = document.getElementById("Area1");
                Area0 = document.getElementById("Area0");
                console.log(python_result.Rank.length);
                for (i=0;i<python_result.Rank.length;i++){
                    var div = document.createElement("div");
                    div.style = "font-weight:bold;font-family:Microsoft JhengHei;font-size:20px";
                    if (python_result.Rank[i].split(";")[1] == "0"){
                        div.innerHTML = python_result.Rank[i].split(";")[0];
                        Area0.append(div);
                    } else if (python_result.Rank[i].split(";")[1] == "1"){
                        div.innerHTML = python_result.Rank[i].split(";")[0];
                        Area1.append(div);
                    } else if (python_result.Rank[i].split(";")[1] == "2"){
                        div.innerHTML = python_result.Rank[i].split(";")[0];
                        Area2.append(div);
                    } else if (python_result.Rank[i].split(";")[1] == "3"){
                        div.innerHTML = python_result.Rank[i].split(";")[0];
                        Area3.append(div);
                    } else if (python_result.Rank[i].split(";")[1] == "4"){
                        div.innerHTML = python_result.Rank[i].split(";")[0];
                        Area4.append(div);
                    } else if (python_result.Rank[i].split(";")[1] == "5"){
                        div.innerHTML = python_result.Rank[i].split(";")[0];
                        Area5.append(div);
                    };
                };
            },
            error: function(error){
                console.log(error);
            }
        })
    } else {
        alert("現在非開獎時間!(每日23:00~23:59開獎)");
        return false;
    }
}