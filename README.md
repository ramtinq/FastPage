# FastPage – Simple AJAX Page Loads & Form Submissions

## Introduction

FastPage is a lightweight tool that enables simple AJAX-based page loading and form submissions — with optional image compression for file inputs.

## Setup

1. Add the FastPage CSS stylesheet to your document’s `<head>`:

```html
<link rel="stylesheet" href="/path/to/FastPage.css">
````

2. Add the FastPage JavaScript file to the end of the `<body>` element:

```html
<script src="/path/to/FastPage.js"></script>
</body>
```

3. *(Optional)* If you also want easy image compression support, include these two scripts **before** `FastPage.js`:

```html
<script src="/path/to/heic2any.min.js"></script>
<script src="/path/to/image-compressor.min.js"></script>
```

## Usage

### `fp-link`

Add the `fp-link` class to any link to make it load its `href` via FastPage instead of performing the default page reload.

Example: suppose you want to load a piece of HTML into an element with `id="content"` via AJAX using FastPage:

```html
<a class="fp-link" href="/products">View Products</a>
<a class="fp-link" href="/services">View Services</a>

<div id="content">Nothing loaded yet!</div>
```

Your backend should return JSON containing the IDs of the elements to update as keys, and their corresponding HTML as values. For example:

```json
{
  "body": {
    "content": "<div>Product 1</div><div>Product 2</div><div>Product 3</div>"
  }
}
```

This will replace the content of the element with `id="content"` with the returned HTML.

FastPage automatically handles new `fp-link` elements added dynamically. For example:

```json
{
  "body": {
    "content": "<div>Product 1</div><div>Product 2</div><div>Product 3</div><a class='fp-link' href='/products/archived'>Show Archived Products</a>"
  }
}
```

Now the *Show Archived Products* link will also work as a dynamic `fp-link`, loading its `href` via FastPage when clicked.

---

### `fp-nopush`

Add `fp-nopush` to an `fp-link` to make it load **without updating the browser’s URL or history**.

---

### `fp-form`

Add the `fp-form` class to a `<form>` element to make it submit via FastPage.
If the form includes file inputs that should be compressed before uploading, add `fp-img-comp` to each relevant file input.

```html
<form class="fp-form" action="" method="POST" enctype="multipart/form-data">
```

---

### `fp-img-comp`

Add `fp-img-comp` to file inputs in an `fp-form` to automatically compress selected images before form submission.

```html
<form class="fp-form" action="" method="POST" enctype="multipart/form-data">
  <input type="file" class="fp-img-comp">
</form>
```

---

### `fp-img-then-`

Add `fp-img-then-someFunction` to an `fp-img-comp` input to run `someFunction()` **after** image compression completes, passing the resulting object URL as a parameter.

---

### `fp-first-`

Add `fp-first-someFunction` to an `fp-link` or `fp-form` to run `someFunction()` **before** the link or form starts loading.

---

### `fp-then-`

Add `fp-then-someFunction` to an `fp-link` or `fp-form` to run `someFunction()` **after** the load completes and all new elements are inserted.
You can add multiple `fp-then-` classes — they will run in order.

---

### `fp fp-do-`

Add `fp` and `fp-do-someFunction` classes to an element to run `someFunction()` as soon as the element becomes visible — either on the initial page load or when dynamically inserted via FastPage.
You can add multiple `fp-do-` classes; they will execute sequentially.

---

### Developed By: [@ramtinq](https://github.com/ramtinq)

## License
LGPL

## Contact

linkedIn: https://www.linkedin.com/in/ramtindidab/

