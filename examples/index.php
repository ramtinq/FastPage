<!DOCTYPE html>
<html>
<title>Fast Page</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="css/w3.css">
<link rel="stylesheet" href="../css/FastPage.css">
<body>
    
<div id="status" class="w3-padding">Test Me!</div>

<div id="my-links" class="fp-onupdate-updateStatus fp-onupdate-getElContent">
    <!--
        use fp-onupdate-functionName for when the functionName function 
        should be run AFTER ADDING new content to the current element. 
        this also passes the parent element containing ONLY NEWLY ADDED ELEMENTS 
        to the functionName function. This is helpful when it's needed 
        to run a function only on the newly added elements, 
        like attaching event handlers (avoding double attachment of event handlers)
    -->
    <a href="#" class="fp fp-link fp-then-doSomething">hello</a>
    <a href="#" class="fp fp-link fp-then-doSomething">world</a>
    <a href="#" class="fp fp-link fp-then-doSomething">yay!</a>
    
</div>

<a name="test_name" href="api.php?req=newlinks" class="fp-link fp fp-first-logName fp-then-scream fp-then-hush w3-button w3-blue w3-margin">click!</a>
<a href="api.php?req=newlinks" class="fp-link fp-add w3-button w3-yellow w3-margin">click to add!</a>
<button class="w3-button w3-green fp fp-do-alertMe">click to alert me!</button>
<button class="w3-button w3-green fp fp-do-sayHello">click to say hello!</button>

<script>
function doSomething() {
    el = document.getElementById('status');
    el.innerHTML += ' worked!';
}

function alertMe(el) {
    el.addEventListener('click', function (e) {
        e.preventDefault();
        window.alert('you clicked ' + el.innerHTML);
    });
}
function logName(el) {
    console.log(el.name);
}

function updateStatus(el) {

    // document.body.innerHTML += 'updated!'; -> this locks other functions
    // samething happens with window.alert, ... (all elements >= body)
    document.getElementById('status').innerHTML += 'updated!';

}
function getElContent(el) {
    console.log('new elements:');
    console.log(el.innerHTML);
}

function sayHello(el) {
    el.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Hello');
    });
}
function sayGoodbye(el) {
    el.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Bye Bye!');
    });
}
function scream() {
    console.log('aaaauuuuuuuuuuuuuuuuh!!!!!');
}
function hush() {
    console.log('hush!');
}


</script>
<script src="js/FastPage.js"></script>
</body>
</html>