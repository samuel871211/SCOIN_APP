function SendAdvise() {
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    if (title != "" && description != "" && title.length <=50 && description.length<=500){
        var a = new Date();
        var minutes = a.getMinutes();
        if(minutes<10){minutes = "0" + minutes};
        var time = a.getFullYear()+"/"+(a.getMonth()+1)+"/"+a.getDate()+" "+a.getHours()+":"+minutes;
        $.ajax({
            url:"/SendAdvise",
            data:{
                "username":document.cookie.split("=")[1],
                "time":time,
                "title":title,
                "description":description
            },
            success: function(python_result){
                alert("感謝您，我們將會盡快處理！如您的回報是有幫助的，我們將會核發東吳幣給您，再請您關注站內信呦~");
                window.location.assign("/UserCenter.html");
            },
            error: function(error){
                alert("網路問題");
            }
        })
    }
}