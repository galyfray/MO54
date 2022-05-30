$(document).ready(function() {
    'use strict';


    let query_content = "SELECT name price ht_price description available_quantity ref delivery_date image_url id brand category_id FROM product WHERE category_id>0";

    let val = $.ajax({
        url : "../api/request",
        type: "GET",
        data: {query: query_content}
    });

    val.then(val => {
        for (let i = 0;i < val.value.length;i++) {
            create_list_article({
                "id"         : val.value[i].id,
                "name"       : val.value[i].name,
                "preview"    : val.value[i].image_url,
                "description": val.value[i].description,
                "brand"      : val.value[i].brand,
                "price"      : val.value[i].price
            });
        }

        // Available_quantity category_delivery_date ht_price ref

    });
});

/**
 * Create_list_article(article) is used to create all the html element that are needed to show an article on a page (image, price, name)
 * @param {any} article an object with the following properties : price, brand, name, description and preview image
 */
function create_list_article(article) {
    /*Create all component needed for an article
    - html_component_div_container :    the div that contains every component created for an article
    - html_component_article_image :    an <img> component for the preview of the article
    - html_component_article_name :     an <h3> component to show the name of the article
    - html_component_article_price :    an <h2> component to show the price of the article
    - html_component_article_brand :    an <h4> component to show the brand of the article
    - html_component_article_info_div : a div that contains the component for the name, the brand and the price of an article.
    After the creation of the different component, we put the different component in the right place.
    */
    let div_container_all_article = document.getElementById("div_container_all_article");
    let html_component_div_container = document.createElement("div");
    html_component_div_container.id = "box";
    let html_component_article_image = document.createElement("img");
    let html_component_article_info_div = document.createElement("div");
    html_component_article_info_div.id = "details";
    let html_component_article_name = document.createElement("h3");
    let html_component_article_brand = document.createElement("h4");
    let html_component_article_price = document.createElement("h2");
    let link_to_show_article = document.createElement("a");
    link_to_show_article.classList.add("link_to_show_article");
    link_to_show_article.href = "see_article.html";

    html_component_div_container.appendChild(link_to_show_article);
    link_to_show_article.appendChild(html_component_article_image);
    link_to_show_article.appendChild(html_component_article_info_div);

    /*
     * When the user clicks on the article, we will save the informations about it in the localStorage
       in order to have those informations in the view "see_article"
     */
    link_to_show_article.onclick = function() {
        //Need to load the html page and to give to the function that displays the article the informations required
        localStorage.setItem('name_article', article.name);
        localStorage.setItem('description_article', article.description);
        localStorage.setItem('price_article', article.price);
        localStorage.setItem('brand_article', article.brand);
        localStorage.setItem("image_article", article.preview);
        localStorage.setItem("id_article", article.id);
    };
    html_component_article_info_div.appendChild(html_component_article_name);
    html_component_article_info_div.appendChild(html_component_article_brand);
    html_component_article_info_div.appendChild(html_component_article_price);

    /*Add the values of the article in the component made for it:
    * - article.price → html_component_article_price
    * - article.name → html_component_article_name
    * - article.brand → html_component_article_brand
    */
    let article_price = document.createTextNode(parseFloat(article.price).toFixed(2) + "€");
    html_component_article_price.appendChild(article_price);

    let article_name = document.createTextNode(article.name);
    html_component_article_name.appendChild(article_name);

    let article_brand = document.createTextNode(article.brand);
    html_component_article_brand.appendChild(article_brand);
    html_component_article_image.src = article.preview;
    html_component_article_image.id = "image_of_article_in_display";

    //Pour ne pas avoir à passer par le csv
    //    return html_component_div_container;
    div_container_all_article.appendChild(html_component_div_container);
}
