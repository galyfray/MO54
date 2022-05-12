// TODO : Export this object to a library
const AJAX = {

    /**
     *
     * @param {*} data An object containing the data to be sent to the server, it must contains at least an url property.
     * the default method is GET.
     * @returns {Promise<XMLHttpRequest} A promise that will be resolved when the request is successfull, rejected otherwise.
     */
    "send": function(data) {
        if (!data.url) {
            throw new Error("No URL specified");
        }
        let url = data.url + "?";
        let method;
        if (!data.method) {
            method = "GET";
        } else {
            method = data.method;
        }

        let req = new XMLHttpRequest();

        delete data.url;
        delete data.method;

        for (let key in data) {
            url += key + "=" + encodeURIComponent(data[key]) + "&";
        }
        req.open(method, url.substring(0, url.length - 1));

        let promise = new Promise((resolve, reject) => {
            req.onreadystatechange = () => {
                if (req.readyState === XMLHttpRequest.DONE) {
                    if (req.status === 200) {
                        resolve(req);
                    }
                } else {
                    reject(req);
                }
            };
        });

        req.send();

        return promise;
    }
};

document.onreadystatechange = function() {
    AJAX.send({
        "url"   : "http://localhost:8080/api/parse",
        "method": "GET",
        "query" : "SELECT * FROM table"
    }).then(req => {
        console.log(req.responseText);
    });
};