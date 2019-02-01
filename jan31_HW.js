var CheckingValue = function(num) {
    if (num>500) {
        document.getElementById("title2").innerHTML = "New text! And it's red!";
        document.getElementById("title2").style.color = "red";
    }
    else {
        document.getElementById("title2").innerHTML = "New text! And it's green!";
        document.getElementById("title2").style.color = "green";
    }
}