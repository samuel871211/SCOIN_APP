// var _id = location.href.split("?")[1]
// if(typeof(_id) != "undefined"){
//     $.ajax({
//         url:"/GetCertainParagraph",
//         data:{"_id":_id},
//         success: function(python_result){

//         }
//     })
// }

function InsertNewParagraph() {
    if (document.getElementById("ClassList").value == "請選擇子版"){
        alert("請選擇子版!");
        return false;
    }
    var a = new Date();
    var minutes = a.getMinutes();
    if(minutes<10){minutes = "0" + minutes};
    var time = a.getFullYear()+"/"+(a.getMonth()+1)+"/"+a.getDate()+" "+a.getHours()+":"+minutes;
    var data = {
            "username":document.cookie.split("=")[1],
            "title":document.getElementById("title").value,
            "paragraph":document.getElementById("paragraph").value.replace(/\n/g,"<br>"),
            "class":document.getElementById("ClassList").value,
            "time":time
    }
    $.ajax({
        url:"/InsertNewParagraph",
        data:data,
        success: function(python_result){
            alert("新增成功，即將為您轉向");
            window.location.assign('/ManageMyParagraph.html');
        },
        error: function(error){
            console.log(error);
        }
    })
}