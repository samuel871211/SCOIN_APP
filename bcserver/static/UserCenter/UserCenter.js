$.ajax({
    url: "http://52.44.57.177:8888/get_balance?user="+document.cookie.split("=")[1],
    type: 'GET',
    success: function(result) {
        list_balance = result.split("\n");
        balance = 0;
        if (result != "" && list_balance.length > 0){
            balance = list_balance.length;
        };
        document.getElementById("balance").innerHTML = "餘額："+balance;
    },
    error: function(error) {
        console.log(error);
    }
})

$.ajax({
    url:'/UnreadMailLength',
    data:{"username":document.cookie.split("=")[1]},
    success: function(python_result){
        if (parseInt(python_result) >= 100){
            document.getElementById("UnreadMailLength").value = "我的信箱(99+)";
        } else{
            document.getElementById("UnreadMailLength").value = "我的信箱("+python_result+")";
        }
    },
    error: function(error){
        console.log(error);
    }
})

function LogOut() {
    document.cookie = "username="+""+";expires="+new Date(0);
    window.location.assign("/");
}
function mail() {window.location.assign('/mail.html');}
function BountyBoard() {window.location.assign("/BountyBoard.html")}
function NewList() {window.location.assign("/Paragraph.html")}
function Pair() {window.location.assign("/Pair.html")}
function Diary() {window.location.assign("/Diary.html")}
function Games() {window.location.assign("/games.html")}
function Contact() {window.location.assign("/Contact.html")}
function home() {window.location.assign('/home.html')}