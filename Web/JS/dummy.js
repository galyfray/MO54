// TODO : Export this object to a library
const AJAX = {

    /**
     *
     * @param {*} data An object containing the data to be sent to the server, it must contains at least an url property.
     * the default method is GET.
     * @returns {Promise<XMLHttpRequest>} A promise that will be resolved when the request is successfull, rejected otherwise.
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

        if (data.MIME) {
            req.overrideMimeType(data.MIME);
            delete data.MIME;
        }

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
        try {
            req.send();
        } catch (error) {
            console.error(error);
        }

        return promise;
    }
};

document.onreadystatechange = function() {
    if (document.readyState === "complete") {
        AJAX.send({
            "url"   : "https://localhost:8000/api/reuqest",
            "method": "GET",
            "MIME"  : "application/json",
            "query" : "SELECT name price delivery_date FROM product WHERE id >= 0"
        }).then(req => {
            console.log(req.responseText);
        });
    }
};