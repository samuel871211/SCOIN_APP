function GetSignUpReward(){
	document.getElementById("GetSignUpReward").disabled = true;
	$.ajax({
		url:'/IsReceived',
		data:{"_id":document.cookie.split("=")[1]},
		success: function(python_result){
			if (python_result == "User doesn't exist."){
				alert("使用者不存在");
				document.cookie = "username="+""+";expires="+new Date(0);
    			window.location.assign("/");
			} else if (python_result == "AlreadyReceived"){
				alert("您已經領過獎勵了!");
				window.location.assign("/UserCenter.html");
			} else if (python_result == "no"){
				document.getElementById("cur").innerHTML = "獎勵發送中，請稍後...";
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
			                        "description":"SignUpReward",
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
			                        	$.ajax({
			                        		url:'/ReceivedSignUpToken',
			                        		data:{"_id":document.cookie.split("=")[1],"rev":result},
			                        		success: function(python_result){
			                        			alert("獎勵發送成功!");
			                            		window.location.assign('/UserCenter.html');
			                        		},
			                        		error: function(python_result){
			                        			alert("轉帳失敗，請檢查網路連線，再重新嘗試");
			                            		document.getElementById("GetSignUpReward").disabled = false;
			                        		}
			                        	})
			                        },
			                        error: function (error) {
			                            alert("轉帳失敗，請檢查網路連線，再重新嘗試");
			                            document.getElementById("GetSignUpReward").disabled = false;
			                        }
			                    });
			                },
			                error: function (error) {
			                    alert("轉帳失敗，請檢查網路連線，再重新嘗試");
			                    document.getElementById("GetSignUpReward").disabled = false;
			                }
			            });
					},
					error: function(error){
						alert("轉帳失敗，請檢查網路連線，再重新嘗試");
						document.getElementById("GetSignUpReward").disabled = false;
					}
				})
			}
		}
	})
}
