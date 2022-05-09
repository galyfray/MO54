    let contentTitle;

    /* create_list_article(article) is used to create all the html element that are needed to show an article on a page (image, price, name)
    * article is an object with the following properties : price, brand, name, description and preview image
    */
            function create_list_article(article) {
                /*Create all component needed for an article
                 - html_component_div_container :    the div that contains every component created for an article
                 - html_component_article_image :    an image component for the preview of the article
                 - html_component_article_name :     an title h3 component to show the name of the article
                 - html_component_article_price :    an title h2 component to show the price of the article
                 - html_component_article_brand :    an title h4 component to show the brand of the article
                 - html_component_article_info_div : a div that contains the component for the name, the brand and the price of an article.
                 */
                let html_component_div_container = document.createElement("div");
                html_component_div_container.id = "box";
                let html_component_article_image = document.createElement("img");
                let html_component_article_info_div = document.createElement("div");
                html_component_article_info_div.id = "details";
                let html_component_article_name = document.createElement("h3");
                let html_component_article_brand = document.createElement("h4");
                let html_component_article_price = document.createElement("h2");
                let boxLink = document.createElement("a");

                // put in the right place the component
                html_component_div_container.appendChild(boxLink);
                boxLink.appendChild(html_component_article_image);
                boxLink.appendChild(html_component_article_info_div);
                html_component_article_info_div.appendChild(html_component_article_name);
                html_component_article_info_div.appendChild(html_component_article_brand);
                html_component_article_info_div.appendChild(html_component_article_price);

                /*Add the values of the article in the component made for it:
                 * - article.price → html_component_article_price
                 * - article.name → html_component_article_name
                 * - article.brand → html_component_article_brand
                 */
                let article_price = document.createTextNode(article.price + "€");
                html_component_article_price.appendChild(article_price);

                let article_name = document.createTextNode(article.name);
                html_component_article_name.appendChild(article_name);

                let article_brand = document.createTextNode(article.brand);
                html_component_article_brand.appendChild(article_brand);

                //  boxLink.href = "/contentDetails.html?" + article.id;
                html_component_article_image.src = article.preview;
                return html_component_div_container;
            }
            // mainContainer is the main div of the page. it contains the div that is filled with the function create_list_article
let mainContainer = document.getElementById("mainContainer");
//défini dans le html car ca fonctionne pas sinon
            //let div_container_all_article = document.getElementById("div_container_all_article");

            //WE create a XMLHttpRequest to read our article.
            let httpRequest = new XMLHttpRequest();


            httpRequest.onreadystatechange = function () {
                //readyState = 4 means that the operation with the XMLHttpRequest is done.
                if (this.readyState === 4) {
                    // status = 200 mean that the statut of the XMLHttpRequest is OK (everything is going well)
                    if (this.status == 200) {
                        contentTitle = JSON.parse(this.responseText);
                        //For each element, the code add dynamically with the function create_list_article the article to the component "div_container_all_article"
                        for (let i = 0; i < contentTitle.length; i++) {
                            //console.log(contentTitle[i]);
                            div_container_all_article.appendChild(
                                create_list_article(contentTitle[i])
                            );
                        }
                    } else {
                        console.log("fail");
                    }
                }
            };
            // The code take the data from a CSV file saved on github.
            httpRequest.open(
                "GET",
                "https://raw.githubusercontent.com/Yasmarila/Site_web_test/main/test?token=GHSAT0AAAAAABUG3RZ5WEMU4IUB4KWFBHDUYTZEDFQ",
                true
            );
            httpRequest.send();
        
        (function ($) {
                'use strict';

                // call our plugin
                var Nav = new hcOffcanvasNav('#main-nav', {
                    disableAt: false,
                    customToggle: '.menu_icon',
                    levelSpacing: 40,
                    navTitle: 'All',
                    levelTitles: true,
                    levelTitleAsBack: true,
                    pushContent: '#container',
                    labelClose: false
                });
            })(jQuery);