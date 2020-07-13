$.ajax({
    url:'/CheckBuyerAndSeller',
    data:{
        "_id":location.href.split("?")[1],
        "WhoAreYou":document.cookie.split("=")[1]
    },
    success: function(python_result){
        if (python_result == "Rejected"){
            window.location.assign("/UserCenter.html");
        };
        document.getElementById("thing").innerHTML = "時間:"+python_result.time;
        document.getElementById("time").innerHTML = "事情:"+python_result.thing;
        document.getElementById("reward").innerHTML = "獎勵:"+python_result.reward;
        document.getElementById("notice").innerHTML = "交易頁面施工中，請先回到會員中心!";

    },
    error: function(error){
        alert('錯誤');
        console.log(error);
    }
})