(function () {
    //Ignore if the browser supports HTML imports out of the box
    if ('import' in document.createElement('link')) {
        return;
    }
    var load = function (link) {
        return new Promise(function (resolve, reject) {
            var url = link.getAttribute('href');
            fetch(url).then(function (response) {
                return response.text();
            }).then(function (text) {
                var fragment = document.createRange().createContextualFragment(text);
                importLinks(fragment).then(function (a) {
                    link.appendChild(fragment);
                    resolve(fragment);
                });
            });
        });
    };
    var processImports = function (links) {
        var pending = [];
        Array.prototype.forEach.call(links, function (link) {
            pending.push(load(link));
        });
        return Promise.all(pending);
    };
    var importLinks = function (parentFragment) {
        return new Promise(function (resolve, reject) {
            processImports(parentFragment.querySelectorAll('link[rel="import"]'))
                .then(function (fragments) {
                resolve(fragments);
            });
        });
    };
    importLinks(document);
})();
