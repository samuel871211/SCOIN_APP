function processdata() {
    var thing = document.getElementById("thing").value;
    var place = document.getElementById("place").value;
    if(thing == ""){
        alert("事情沒輸入！");
        return false;
    } else if (thing.length > 80){
        alert("內容長度超過80字！");
        return false;
    } else if (place.length > 20){
        alert("地點長度超過20字！");
        return false;
    }
    var a = new Date();
    var minutes = a.getMinutes();
    if(minutes<10){minutes = "0" + minutes};
    var PostTime = a.getFullYear()+"/"+(a.getMonth()+1)+"/"+a.getDate()+" "+a.getHours()+":"+minutes;
    $.ajax({
        url:"/InsertNewBounty",
        data:{
            "class":document.getElementById("class").value,
            "thing":thing,
            "reward":document.getElementById("reward").value,
            "time":document.getElementById("date").value　+ " " +　document.getElementById("time").value,
            "place":place,
            "username":document.cookie.split("=")[1],
            "PostTime":PostTime
        },
        success: function(result) {
            alert("新增成功，將自動幫您重新整理頁面");
            window.location.assign("/ManageMyBounty.html");
        },
        error: function(error) {
            alert("新增失敗，請檢查網路連線，再重新嘗試");
            window.location.assign("/PublishBounty.html");
        }
    })
}