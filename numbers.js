document.getElementById("title").style.color = "red";
document.getElementById("title").innerHTML = "Welcome JavaScript";
            
var myNumber = 42;
myNumber = myNumber+10;
console.log(myNumber);

var username = "Floris";
console.log(username + "123");

var myString = "JavaScript is Cool!";
console.log("D3 and "+myString);

var Boolean1 = myNumber >= 100;
console.log(Boolean1);

var users = ["Dave", 100, "Dan", "Mengyue"];
console.log(users[1]);

// This is an object in JavaScript //
var complexUser = {
    name: "Floris",
    zip: 2139,
    color: "red",
    dog: true,
    greet: function(greeting) {
        console.log(greeting + "Floris!")
    }
};

complexUser.greet("Goodbye ");
console.log(complexUser.color);

// Function //
var sayHello = function(name) {
    console.log("Hello " + name);
}


sayHello("Floris");
sayHello("Lisa");
sayHello(complexUser.name);

var plusTen = function(num){
    return num + 10;
}

var newNum = plusTen(20);
console.log(newNum);

if (newNum > 100) {
    console.log("Wow! Big Number!")
}
else if (newNum > 50) {
    console.log("Ok, not so bad.")
}
else {
    console.log("Not so big...")
}

var greaterThanTen = function(num) {
    if (num>10) {
        console.log("Yes!")
    }
    else {
        console.log("No!")
    }
    return num>10;
}

var checkNumber = greaterThanTen(5);

console.log(checkNumber);
