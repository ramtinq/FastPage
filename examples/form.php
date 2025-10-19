    <h2>Please Enter Your Info</h2>
    <form class="fp-form fp-nopush" action="api.php?req=submitform" method="POST" enctype="multipart/form-data">
        <input class="w3-input" type="text" name="title">
        <input type="checkbox" name="agree"> <label>I agree</label><br>
        <label>
        Enter an integer between 1 and 10:</label>
        <input name="the_number" type="number" min="1" max="10" required>
        
        <input class="w3-margin" type="tel" maxlength="10" pattern="^[1-9]\d{9}" name="phone" placeholder="phone">
        <textarea class="w3-input" name="body"></textarea>
        <br>Photo<br>
        <input class="fp-img-comp" type="file" name="image_1">
        <button class="w3-button w3-margin w3-blue">Submit</button>
    </form>