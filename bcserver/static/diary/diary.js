var a = new Date();             
var month = String(a.getMonth()+1);
var date = String(a.getDate());
if (month.length == 1){month = "0" + month};
if (date.length == 1){date = "0" + date};
var today = a.getFullYear() + "-" + month  + "-" + date;
document.getElementById("calendar").value = today;

function DateChange(){
	document.getElementById("AreaForDiary").style = "display:none";
}

function diary(){
	var date = document.getElementById("calendar").value;
	if (date == document.getElementById("DiaryContent").placeholder.split("\n")[0]){
		alert("日期無變化");
		return false;
	}
	$.ajax({
		url:'/GetDiary',
		data:{"username":document.cookie.split("=")[1],"date":date},
		success: function(python_result){
			if (python_result != "New Diary"){
				document.getElementById("DiaryContent").value = python_result;
				document.getElementById("DiaryContent").readOnly = "readOnly";
				document.getElementById("NewDiary").innerHTML = "編輯";
			} else if (python_result == "New Diary"){
				document.getElementById("DiaryContent").value = "";
				document.getElementById("DiaryContent").readOnly = false;
				document.getElementById("NewDiary").innerHTML = "上傳";
			}
			document.getElementById("AreaForDiary").style = "";
			document.getElementById("DiaryContent").placeholder = date+"\n今天有發生什麼有趣的事情想寫下來嗎？\n或者想把課堂筆記上傳到這邊都可以呦~";
		},
		error: function(error){
			console.log(error);
		}
	})
}

function NewDiary(action,content){
	if (action == "編輯"){
		keep = content;
		document.getElementById("DiaryContent").readOnly = false;
		document.getElementById("NewDiary").innerHTML = "上傳";
		return true;
	} else if(action == "上傳"){
		if (typeof(keep) == "undefined" && content == ""){
			alert("日記內容沒有變化");
			return false;
		} else if (typeof(keep) != "undefined" && keep == content){
			alert("日記內容沒有變化");
			return false;
		}
	}
	console.log("hello");
	$.ajax({
		url:'NewDiary',
		data:{
			"date":document.getElementById("DiaryContent").placeholder.split("\n")[0],
			"content":document.getElementById("DiaryContent").value,
			"username":document.cookie.split("=")[1]
		},
		success: function(python_result){
			alert("日記上傳成功~");
			window.location.assign('/Diary.html');
		},
		error: function(error){
			console.log(error);
		}
	})
}

function DailyReward(arg){
	if (document.getElementById("calendar").value != today){
		alert("簽到只能選擇當日");
		return false;
	}
	arg.disabled = true;
	$.ajax({
		url:'/DailyReward',
		data:{"username":document.cookie.split("=")[1],"today":today},
		success: function(python_result){
			if (python_result == "Sending DailyReward."){
				document.getElementById("DailyRewardNotification").style = "";
				document.getElementById("CurrentSituation").innerHTML = "轉帳中，請稍後...";
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
			                        "description":"DailyReward",
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
			                        	document.getElementById("DailyRewardNotification").style = "display:none";
			                        	alert("每日簽到成功");
			                        },
			                        error: function (error) {
			                        	document.getElementById("DailyRewardNotification").style = "display:none";
			                        	arg.disabled = false;
			                            alert("轉帳失敗");
			                        }
			                    });
			                },
			                error: function (error) {
			                	document.getElementById("DailyRewardNotification").style = "display:none";
			                	arg.disabled = false;
			                    alert("網路問題");
			                }
			            });
					},
					error: function(error){
						document.getElementById("DailyRewardNotification").style = "display:none";
						arg.disabled = false;
						alert("網路問題");
					}
				})
			} else if (python_result == "Duplicate Request."){
				alert("您今日已經簽到囉！");
			}
		}
	})
}

function ShowRow(action){
	if (action == "顯示格線"){
		document.getElementById("ShowRow").innerHTML = "隱藏格線";
		alert("施工中");
	} else if (action == "隱藏格線"){
		document.getElementById("ShowRow").innerHTML = "顯示格線";
		alert("施工中");
	}
}

function FontFamilySelecter(){
	alert("施工中");
}

function BackgroundSelecter(){
	alert("施工中");
}

function ToDoList(){
	alert("施工中");
}

function schedule(){
	alert("還沒開學");
}