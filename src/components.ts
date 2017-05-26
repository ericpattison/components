(function(){
    //Ignore if the browser supports HTML imports out of the box
    if('import' in document.createElement('link')) { return; }

    const processImports = (doc:HTMLDocument|DocumentFragment) => {
        let importLinks = doc.querySelectorAll('link[rel="import"]');
        Array.prototype.forEach.call(importLinks, (importLink) => {
            fetch(importLink.getAttribute('href'))
                .then((response) => {
                    return response.text();
                })
                .then((text) => {
                    return new Promise((resolve, reject) => {
                        let linkFragment = document.createRange().createContextualFragment(text);
                        processImports(linkFragment);
                        resolve(linkFragment)
                    });                    
                })
                .then((fragment) => {
                    importLink.appendChild(fragment);
                });
        });
    }

    processImports(document);
})();