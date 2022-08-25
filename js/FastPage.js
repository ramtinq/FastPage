/**
 * FastPage 0.7.0
 * Simple & Fast AJAX page loads & Form Submissions + Simple Image Compression using external libraries.
 * https://github.com/ramtinq/fastpage
 *
 * Copyright 2021-2022 Ramtin Didab
 *
 * Released under the LGPL License
 *
 * Released on: April 16, 2022
 * 
 * Last updated on: August 25, 2022
 */

/**
 * ====== DOCUMENTATION : ========
 * Add FastPage.js script to the end of body element.
 * also add a <div id="fp-progress-bar" style="width:0%;">
 * with your own additional styling.
 * for image compression support, you should also load
 * the "image-compressor.min.js" plus "heic2any.min.js" files
 * before loding this script.
 */

/**
 * """ fp-link """
 * use this class to make a link prevent it's default behavior
 * and load it's href via fp.
 */

/**
 * """ fp-nopush """
 * add fp-nopush to an fp-link so that the link loads
 * without pushing it's href to the history, and keeping
 * window's url unchanged.
 */

/**
 * """ fp-first- """
 * add fp-first-someFunction class to an fp-link/fp-form to run someFunction()
 * BEFORE the link/form starts to load.
 */

/**
 * """ fp-then- """
 * add fp-then-someFunction class to an fp-link/fp-form to run someFunction()
 * AFTER the link/form loads completely & inserts all it's new elements.
 * you can add multiple fp-then- classes and they will be run in order.
 */

/**
 * """ fp fp-do- """
 * add fp with fp-do-someFunction classes to an element
 * to run someFunction on whenever the element shows up,
 * wheter on first window.load or when element is loaded
 * into the document via fp.
 * you can add multiple fp-do- classes and they will run in order.
 */

/**
 * """ fp-form """
 * add fp-form to a form element to make it submit via fp.
 * if the form has file input for photos which need to be
 * compressed before uploading, add fp-img-comp to each file
 * input element's class.
 */

/**
 * """ fp-img-comp """
 * add fp-img-comp to file inputs in an fp-form to easily compress
 * them automatically before the form submission.
 */

/**
 * """ fp-img-then- """
 * adding fp-img-then-myCallbackFunction to an fp-img-comp input,
 * which will run the myCallbackFunction() passing the compression
 * result's object url to it.
 */

 function fpUpdateLinks(el = document) {
    var fpLinks = el.getElementsByClassName('fp-link');
    for(var i=0; i<fpLinks.length; i++) {
        fpLink(fpLinks[i]);
    }
}

function fpLink(el) {
    el.addEventListener('click', function (e) {
            e.preventDefault();
            var callbackNames = [];
            var classNames = el.className.split(' ');
            classNames.forEach(name => {
                if(name.startsWith('fp-then-')) {
                    var func = name.substr(8);
                    callbackNames.push(func);
                    //window[func](child);
                }
                else if(name.startsWith('fp-first-')) {
                    var func = name.substr(9);
                    window[func](el);
                }
            });
            loadData(href = this.href, callbackNames, ! classNames.includes('fp-nopush'), classNames.includes('fp-add'));
    });
}

function fpUpdateForms(el = document) {
    var fpForms = el.getElementsByClassName('fp-form');
    for(var i=0; i<fpForms.length; i++) {
        fpForm(fpForms[i]);
    }
}

function fpForm(form_el) {
    var singleImageCompressInputs = form_el.getElementsByClassName('fp-img-comp');
    var singleCompressors = [];
    var multiImageCompressInputs = form_el.getElementsByClassName('fp-img-comp-multi');
    var multiCompressors = [];

    for(var i = 0; i < singleImageCompressInputs.length; i++) {
        singleCompressors.push( new PhotoCompressor(singleImageCompressInputs[i]) );
    }
    for(var i = 0; i < multiImageCompressInputs.length; i++) {
        multiCompressors.push( new PhotoCompressorMulti(multiImageCompressInputs[i]) );
    }

    form_el.addEventListener('submit', function(e) {
        e.preventDefault();

        //console.log('submitting...');
        var callbackNames = [];
        var classNames = form_el.className.split(' ');
        classNames.forEach(name => {
            if(name.startsWith('fp-then-')) {
                var func = name.substr(8);
                callbackNames.push(func);
                //window[func](child);
            }
            else if(name.startsWith('fp-first-')) {
                var func = name.substr(9);
                window[func](form_el);
            }
        });
        var formData = new FormData(form_el);

        for(var i = 0; i < singleCompressors.length; i++) {
            if(singleImageCompressInputs[i].classList.contains('fp-compressing')) {
                //console.log('cannot submit while compressing!');
                return;
            }
            if(singleCompressors[i].photo_result) {
                formData.set(singleImageCompressInputs[i].name, singleCompressors[i].photo_result, singleCompressors[i].photo_result.name);
            }
            /*
            else {
                formData.set(singleImageCompressInputs[i].name, singleCompressors[i].photo_result);
            }
            */
        }
        
        loadData(href = this.action, callbackNames, ! classNames.includes('fp-nopush'), classNames.includes('fp-add'), true, false, formData );
    });
}

var default_quality = 1.0;
var default_max_uploaded_photo_size = default_max_uploaded_photo_size ?? 500 * 1024;
var default_max_uploaded_photo_width = default_max_uploaded_photo_width ?? 1000;
var default_min_uploaded_photo_width = default_min_uploaded_photo_width ?? 460;

function PhotoCompressor(file_input) {
    var self = this;
    self.photo_result = false;

    file_input.addEventListener('change', function (e) {
        var file = e.target.files[0];
        //console.log('file-type:', file['type'].split('/')[0]);
        if (!file) return;
        if(file['type'].split('/')[0] !== 'image' && file['type'].split('/')[0] != '') return;
        
        file_input.classList.add('fp-compressing');
        //console.time('compress time');
        compressImage(e, file, default_quality, default_max_uploaded_photo_width, self.doTheRest);
    });
    
    self.doTheRest = function(e, result) {
        //console.timeEnd('compress time');
        file_input.classList.remove('fp-compressing');
        self.photo_result = result;
        var thumbs = file_input.parentElement.getElementsByTagName('img');
        if(thumbs) {
            thumbs[0].src = URL.createObjectURL(result);
        }
        let classNames = file_input.className.split(' ');
        classNames.forEach(name => {
            if(name.startsWith('fp-img-then-')) {
                var func = name.substr(12);
                window[func](URL.createObjectURL(result));
                return;
            }
        });
    } 
}

function PhotoCompressorMulti(file_input) {
    var self = this;
    self.photo_results = [];
    self.num_files = 0;

    file_input.addEventListener('change', function (e) {
        self.photo_results = [];
        var files = e.target.files;
        if (!files) return;
        self.num_files = files.length;
        file_input.classList.add('fp-compressing');

        for(var i = 0; i < files.length; i++) {
            let file = files[i];
            //console.log('file-type:', file['type'].split('/')[0]);
            if(file['type'].split('/')[0] !== 'image' && file['type'].split('/')[0] != '') return;
            compressImage(e, file, default_quality, default_max_uploaded_photo_width, self.doTheRest);

        }
    });
    self.doTheRest = function(e, result) {
        self.photo_results.push(result);
        if(self.photo_results.length == self.num_files) {
            let container = new DataTransfer();
            for(var i = 0; i < self.photo_results.length; i++ ) {
                let file = new File([self.photo_results[i]], self.photo_results[i].name, {type: self.photo_results[i].type, lastModified:new Date().getTime()});
                container.items.add(file);
            }
            file_input.files = container.files;
            file_input.classList.remove('fp-compressing');
        }

    } 
}

function compressImagefinalize(e, result, q, max_width, callback) {
    //console.log('size reducerd to', result.size, '| quality: ', q);
    if(result.size < default_max_uploaded_photo_size) {
        //console.log('size accepted:', result.size, 'quality:', q, 'name:', result.name );
        //console.log(typeof(callback));
        if(typeof callback === "function") {
            callback(e, result);
        }
    }
    else {
        var new_q = (q - 0.05).toFixed(2);
        if(new_q > 0) {
            compressImage(e, result, new_q, max_width, callback);
        }
        else {
            var new_max_width = max_width - 100;
            if(new_max_width >= default_min_uploaded_photo_width) {
                compressImage(e, result, default_quality, new_max_width, callback);
            }
            else {
                console.log( 'could not compress :(' );
                if(typeof callback === "function") {
                    callback(e, result);
                }
            }
        }
    }
}

function compressImage(e, file, q, max_width, callback) {
    
    if(file.type == 'image/heic' || file.type == 'image/heif' || file.type == '') {
        console.log('probably heif...');
        var reader = new FileReader();
        reader.onload = (function(f) {
            return function(e) {
                fetch(this.result)
                    .then((res) => res.blob())
                    //.then((blob) => blob.arrayBuffer())
                    //.then((buff) => xremove(buff) )
                    //.then((blob) => removeExifOrientation(blob, file.type) )
                    .then(
                        (blob) =>
                        heic2any({
                            blob,
                            toType: "image/png",
                            quality: 1.0,
                        })
                    )
                    .then((result) => {
                        result.name = 'blah.png';
                        //console.log(result.name, result.type);
                        return compressImagefinalize(e, result, q, max_width, callback);
                    })
                    .catch((e) => {
                        //console.log(e);
                        return;
                    });
            };
        })(file);
        return reader.readAsDataURL(file);
    }
    // ImageCompressor
    new Compressor(file, {
        quality: q,
        maxWidth: max_width,
        success(result) {
            return compressImagefinalize(e, result, q, max_width, callback);
        },
        error(e) {
            console.log(e.message);
        },
    });
} 

function fpUpdateHandlers(el = document) {
    var fpElements = el.getElementsByClassName('fp');
    for(var i=0; i<fpElements.length; i++) {
        fpRunHandlers(fpElements[i]);
    }
}

function fpRunHandlers(el) {
    var classNames = el.className.split(' ');
    classNames.forEach(name => {
        if(name.startsWith('fp-do-')) {
            var func = name.substr(6);
            window[func](el);
        }
    });
}

window.addEventListener('load', function (e) {
    let progressBarEl = document.createElement('div');
    progressBarEl.id = 'fp-progress-bar';
    progressBarEl.style.width = '0%';
    document.body.insertAdjacentElement('beforeend', progressBarEl);
    fpUpdateLinks();
    fpUpdateHandlers();
    fpUpdateForms();
});

function loadData(href, UpdaterCallbacks, push = true, add = false, show_progress_bar = true, external_function = false, formData = false) {
    if( href.includes('?') ) {
        var good_url = href + '&ajax=true';
    }
    else {
        var good_url = href + '?&ajax=true';
    }

    var xhttp = new XMLHttpRequest();
    
    if(show_progress_bar) {
        var progress = 1;
        document.getElementById('fp-progress-bar').style.width = '1%'; // in fact = progress or cp
        var prog_not_computable = true;
        
        xhttp.onprogress = function(pe) {
            if(pe.lengthComputable) {
                prog_not_computable = false;
                progress = 100 * pe.loaded/pe.total;
                progressMove(progress);
            }

        }
    }

    xhttp.onreadystatechange = function() {
        if(prog_not_computable) {
            progress = this.readyState * 25;
            progressMove(progress);
        }
        
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            jsonObject = JSON.parse(this.responseText);
            //console.log(jsonObject.errors);
            if(jsonObject.redirect != null) {
                window.location.href = jsonObject.redirect;
                return;
            }

            if(external_function) { // assign remaining operations to the callback function
                if (typeof UpdaterCallbacks === "function") {
                    UpdaterCallbacks(jsonObject);
                }
                return;
            }
            
            if(href != window.location.href) { // update history if new url, not refresh
                //if(href.includes('?&complete=1')) {
                    // for preventing bugs when we're loading things after complete page is loaded without
                    // url in the json response. preventing things like: /?&complete=1/?p=7
                    href = href.replace('?&complete=1',''); 
                //}
                if(push == true) {
                    var stateObj = { url: href };
                    if(jsonObject.url != null){
                        history.pushState(stateObj, '', jsonObject.url);
                    }
                    else {
                        history.pushState(stateObj, '', href);
                    }
                    //console.log('loadData-state-changed: ', history.state);
                }
            }
            if(jsonObject.pageData != null) {
                resPageData = jsonObject.pageData;
                for(prop in jsonObject.pageData) {
                    pageData[prop] = resPageData[prop];
                }
            }
            
            if(jsonObject.title != null){ document.title = jsonObject.title; }

            var bodyContents = jsonObject.body;
            for(prop in bodyContents){
                var element = document.getElementById(prop);
                if(element != null) {
                    if( add == true /* && element.classList.contains('fp-add') */ ) {
                        /**
                         * commented && element.classList.contains('fp-add')
                         * to simply let the fp-link calling the function decide
                         * if the content it's going to load should be replaced
                         * or be added.
                         * 
                         */
                        element.insertAdjacentHTML('beforeend', '<span class="fp-loaded"></span>');
                        let newNode = element.querySelectorAll('.fp-loaded:last-child')[0];
                        newNode.insertAdjacentHTML('beforeend', bodyContents[prop]);
                        fpUpdateLinks(newNode);
                        fpUpdateHandlers(newNode);

                        var classNames = element.className.split(' ');
                        classNames.forEach(name => {
                            if(name.startsWith('fp-onupdate-')) {
                                var func = name.substr(12);
                                window[func](newNode);
                            }
                        });
                    }
                    else {
                        element.innerHTML = bodyContents[prop];
                        fpUpdateLinks(element);
                        fpUpdateHandlers(element);
                        fpUpdateForms(element);

                        var classNames = element.className.split(' ');
                        classNames.forEach(name => {
                            if(name.startsWith('fp-onupdate-')) {
                                var func = name.substr(12);
                                window[func](element);
                            }
                        });
                    }
                }
            }

            if(formData) {
                errors = jsonObject.errors;
                if(errors) {
                    form_el = document.getElementsByClassName('fp-form')[0];
                    for(var key of formData.keys()) {
                        var elements = document.getElementsByName(key);
                        var element;
                        for(var i = 0; i<elements.length; i++) {
                            if(elements[i].tagName.toLowerCase() == 'input' || elements[i].tagName.toLowerCase() == 'textarea') {
                                element = elements[i];
                                break;
                            }
                        }
                        var prevErrorEl = document.getElementById('fp-error-' + key);
                        if(prevErrorEl) {
                            element.classList.remove('is-invalid');
                            prevErrorEl.remove();
                        }
                        if(errors[key]) {
                            element.classList.add('is-invalid');
                            if(element.parentElement.classList.contains('custom-file')) {
                                element.parentElement.parentElement.insertAdjacentHTML('beforeend', '<span id="fp-error-' + key + '" class="invalid-feedback ram-bold" role="alert">' + errors[key] + '</span>');
                            }
                            else {
                                element.parentElement.insertAdjacentHTML('beforeend', '<span id="fp-error-' + key + '" class="invalid-feedback ram-bold" role="alert">' + errors[key] + '</span>');
                            }
                        }
                    }
                }
            }
            
            //loading callback function(s)
            if (Array.isArray(UpdaterCallbacks)) {
                for (var i=0; i< UpdaterCallbacks.length; i++) {
                    //UpdaterCallbacks[i]();
                    if(typeof window[UpdaterCallbacks[i]] === "function") {
                        window[UpdaterCallbacks[i]]();
                    }
                    else {
                        UpdaterCallbacks[i]();
                    }
                }
            }
            else if (typeof UpdaterCallbacks === "function") {
                // UpdaterCallbacks();
                if(typeof window[UpdaterCallbacks] === "function") {
                    window[UpdaterCallbacks]();
                }
                else{
                    UpdaterCallbacks();
                }                
            }
        }
    };
    if(formData) {
        //console.log('posting...');
        xhttp.open("POST", good_url, true);
        xhttp.send(formData);

    }
    else {
        xhttp.open("GET", good_url, true);
        xhttp.send();
    }
}

function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
  
var progress_bar_width = 1;
function progressMove(prog) {
    var elem = document.getElementById('fp-progress-bar');
    var id = setInterval(frame, 10);
    function frame() {
        if (progress_bar_width >= prog) {
            clearInterval(id);
            if(progress_bar_width == 100) { // reset for next loadData()
                elem.style.width = '0%';
                progress_bar_width = 1;
            }
        }
        else {
            progress_bar_width++; 
            elem.style.width = progress_bar_width + '%';
        }
    }
}

function getHrefPlusForm(base_href, form_el) {
    var inputs = the_form.getElementsByTagName('input');
    if(! base_href.includes('?') ) {
        base_href += '?';
    }
    for(var i=0; i<inputs.length; i++) {
        base_href = base_href + '&' + inputs[i].name + '=' + inputs[i].value;
    }
    return base_href;
}