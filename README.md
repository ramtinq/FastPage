# FastPage - Simple AJAX Page Loads & Form Submissions

## Introduction

FastPage is a tool to simply load  your website's links via AJAX in a very simple way, submitting your html forms via AJAX, plus image compression for file inputs!

## Setup

1. Add FastPage.css stylesheet to your document's ```<head>```:

```
<link rel="stylesheet" href="/path/to/FastPage.css">
```

2. Add FastPage.js script to the end of the ```<body>``` element:
```
<script src="/path/to/FastPage.js"></script>
</body>
```
3. (optional) if you also want easy image compression support, add these two scripts before FastPage.js:
```
<script src="/path/to/heic2any.min.js"></script>
<script src="/path/to/image-compressor.min.js"></script>
```

## Usage

### "fp-link"
Add the "fp-link" class to any link to make it prevent it's default behavior and load it's href via FastPage.

Example: suppose you want to load an html into the element with `id="content"` in your document via AJAX using FastPage:
```
<a class="fp-link" href="/products">View Products</a>
<a class="fp-link" href="/services">View Services</a>
...
<div id="content">Nothing loaded yet!</div>
```
In your backend, you need to return a json containing id(s) of the *to be loaded into* elements as key(s) and the correspounding html as the value(s). Something like this for the example above:

```
{
    'body':
    {
        'content': '<div>Product 1</div><div>Product 2</div><div>Product 3</div>'
    }
}
```

This will put the `<div>Product 1</div><div>Product 2</div><div>Product 3</div>` html into the element having `id="content"`.

You can also load other "fp-link"s into the element, as soon as they have the "fp-link" class, FastPage will take care of the event handling for them:
```
{
    'body':
    {
        'content': '<div>Product 1</div><div>Product 2</div><div>Product 3</div><a class=\"fp-link\" href=\"/products/archived\">Show Archived Products</a>'
    }
}
```

Now the *Show Archived Products* link is added to the *content div* too, and this is a functional "fp-link", which again loads its href via FastPage when click!

### "fp-nopush"
Add "fp-nopush" to an fp-link making it load without pushing it's href to the history, and keeping window's url unchanged.

### "fp-form"
Add "fp-form" class to a `form` element to make it submit via FastPage. If the form has file input for photos which need to be compressed before uploading, add "fp-img-comp" to each file input element's class names.

```
<form class="fp-form" action="" method="POST" enctype="multipart/form-data">
```

### "fp-img-comp"
Add fp-img-comp to file inputs considered to accept image files in an "fp-form" to easily compress them automatically before the form submission (onchange).

```
<form class="fp-form" action="" method="POST" enctype="multipart/form-data">
    <input type="file" class="fp-img-comp">
    ...
</form>
```

### "fp-img-then-"
Adding "fp-img-then-someFunction" to an "fp-img-comp" input, will run the "someFunction" **AFTER** the image's compression is finished, passing the compression result's object url to it.

### "fp-first-"
Add "fp-first-someFunction" class to an fp-link/fp-form to run someFunction()
**BEFORE** the link/form starts to load.

### "fp-then-"
Add "fp-then-someFunction" class to an fp-link/fp-form to run someFunction() **AFTER** the link/form loads completely & inserts all it's new elements. You can add multiple "fp-then-" classes and they will be run in order.

### "fp fp-do-"
Add fp with "fp-do-someFunction" class to an element to run "someFunction" as soon as the element shows up, wheter on first window.load or when the element is loaded into the document via FastPage. You can add multiple "fp-do-" classes and they will run in order.   

### Developed By: [@ramtinq](https://github.com/ramtinq)

## License
LGPL

## Contact

linkedIn: https://www.linkedin.com/in/ramtindidab/

