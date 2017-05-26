(function () {
    //Ignore if the browser supports HTML imports out of the box
    if ('import' in document.createElement('link')) {
        return;
    }
    var processImports = function (doc) {
        var importLinks = doc.querySelectorAll('link[rel="import"]');
        Array.prototype.forEach.call(importLinks, function (importLink) {
            fetch(importLink.getAttribute('href'))
                .then(function (response) {
                return response.text();
            })
                .then(function (text) {
                return new Promise(function (resolve, reject) {
                    var linkFragment = document.createRange().createContextualFragment(text);
                    processImports(linkFragment);
                    resolve(linkFragment);
                });
            })
                .then(function (fragment) {
                importLink.appendChild(fragment);
            });
        });
    };
    processImports(document);
})();
