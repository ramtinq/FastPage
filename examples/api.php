<?php
$myObj = new StdClass;
$myObj->body = new StdClass;
$myObj->pageData = new StdClass;

if(isset($_GET['req'])) {
    $req = $_GET['req'];
    if($req == 'newlinks') {
        ob_start(); ?>
            <a href="api.php?req=oldlinks" class="fp-link fp-do-doSomething">Old Links</a>
            <a href="api.php?req=dummylinks" class="fp-link fp-do-doSomething">Dummy Links</a>
            <div class="w3-button w3-orange fp fp-do-alertMe">new button</div>
            <div class="w3-button w3-orange fp fp-do-sayGoodbye">say goodbye!</div>
        <?php
        $updated = ob_get_clean();
        $myObj->body->{'my-links'} = $updated;
    }
    else if($req == 'oldlinks') {
        ob_start(); ?>
    <a href="#" class="fp fp-then-doSomething">hello</a>
    <a href="#" class="fp fp-then-doSomething">world</a>
    <a href="#" class="fp fp-then-doSomething">yay!</a>
        <?php
        $updated = ob_get_clean();
        $myObj->body->{'my-links'} = $updated;
    }
    else if($req == 'dummylinks') {
        ob_start(); ?>
    <a href="#" class="fp fp-link fp-then-doSomething"><div class="w3-red">red dummy!</div></a>
    <a href="#" class="fp fp-then-doSomething">dummy 2</a>
    <a href="#" class="fp fp-then-doSomething">dummmy 3</a>
        <?php
        $updated = ob_get_clean();
        $myObj->body->{'my-links'} = $updated;
    }

    else if($req == 'submitform') {
        ob_start(); 
        include('form.php');
        ?>

        <h1> form submitted! </h1>
        <br>values:<br>
        <?php
        print_r($_POST);
        echo '<br><br>Files:<br>';
        print_r($_FILES);
        $updated = ob_get_clean();
        $myObj->body->{'content'} = $updated;
    }

    $myJSON = json_encode($myObj);
    echo $myJSON;
}
?>