var a = new Date();
                
var month = String(a.getMonth()+1);
var date = String(a.getDate());
if (month.length == 1){month = "0" + month};
if (date.length == 1){date = "0" + date};
document.getElementById("date").value = a.getFullYear() + "-" + month  + "-" + date;

var hour = String(a.getHours());
var minute = String(a.getMinutes());
if (hour.length == 1){hour = "0"+hour};
if (minute.length == 1){minute = "0" + minute};
document.getElementById("time").value = hour + ":" + minute;