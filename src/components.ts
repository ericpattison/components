(function(){
    //Ignore if the browser supports HTML imports out of the box
    if('import' in document.createElement('link')) { return; }

    //Processes a single link element, making sure to include nested links.
    // Does not properly handle improper import practices.
    const load = (link) => {
        return new Promise((resolve, reject) => {
            let url = link.getAttribute('href');

            fetch(url).then((response) => {
                return response.text();
            }).then((text) => {
                let fragment = document.createRange().createContextualFragment(text);
                importLinks(fragment).then((a)=> {
                    link.appendChild(fragment);
                    resolve(fragment);
                })
            });
        })
    }

    //Given a set of links, processess  all of them, before moving on.
    const processImports = (links: NodeList|Array<any>) => {
        let pending = [];
        Array.prototype.forEach.call(links, (link) => {
            pending.push(load(link));
        });

        return Promise.all(pending);
    };

    //Given a document, or fragment, find all imports and process them.
    const importLinks = (parentFragment: HTMLDocument | DocumentFragment) => {
        return new Promise((resolve,reject)=> {
            processImports(parentFragment.querySelectorAll('link[rel="import"]'))
            .then((fragments) => {
                resolve(fragments);
            })
        });
    }

    importLinks(document);
})();