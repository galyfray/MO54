$(document).ready(function() {
    'use strict';

    //Si vide alors affiche 0 Mais si mémoire affiche valeur
    var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
    if (old_data_saved) {
        document.getElementById("nb_article_in_cart").textContent = old_data_saved.length;

    }


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

    let val2 = $.ajax({
        url : "../api/request",
        type: "GET",
        data: {query: "SELECT id name header_category_id FROM category WHERE id>=0"}
    });
    val2.then(val2 => {

        let future_menu = document.getElementById("main-nav2");


        for (let i = 0;i < val2.value.length;i++) {
            let element_created = document.createElement("li");
            let element_content = document.createElement("a");
            element_content.id = "a" + val2.value[i].id;


            element_content.textContent = val2.value[i].name;
            element_created.id = val2.value[i].id;


            //Si on est dans la root
            if (val2.value[i].header_category_id == -1) {
                element_created.id = "Root" + val2.value[i].id;
                element_created.appendChild(element_content);
                future_menu.appendChild(element_created);

            } else if (document.getElementById("Root" + val2.value[i].header_category_id)) {
                if (document.getElementById("ul_under_root" + val2.value[i].header_category_id)) {
                    let ul_under_root = document.getElementById("ul_under_root" + val2.value[i].header_category_id);
                    element_created.appendChild(element_content);
                    ul_under_root.appendChild(element_created);
                } else {
                    let li_under_root = document.createElement('li');
                    li_under_root.id = "li_under_root" + val2.value[i].header_category_id;
                    let ul_under_root = document.createElement('ul');
                    ul_under_root.id = "ul_under_root" + val2.value[i].header_category_id;
                    li_under_root.appendChild(ul_under_root);
                    ul_under_root.appendChild(element_created);
                    element_created.appendChild(element_content);
                    let add = document.getElementById("Root" + val2.value[i].header_category_id);
                    add.appendChild(ul_under_root);
                }
                element_created.appendChild(element_content);
            } else if (document.getElementById("ul_under_root" + val2.value[i].header_category_id)) {
                //SUB SUB ROOT
                let ul;
                if (document.getElementById("li_ul" + val2.value[i].header_category_id)) {
                    ul = document.getElementById("li_ul" + val2.value[i].header_category_id);
                    let li_inside = document.createElement("li");
                    li_inside.id = "li_inside" + val2.value[i].header_category_id;
                    ul.appendChild(li_inside);
                    li_inside.appendChild(element_content);

                }
            } else {
                //SUB SUB ROOT
                let li_hover = document.getElementById(val2.value[i].header_category_id);
                let li_sub_sub_root = document.createElement('li');
                li_sub_sub_root.id = "li_sub_sub_root" + val2.value[i].header_category_id;
                let ul_sub_sub_root = document.createElement('ul');
                ul_sub_sub_root.id = "ul_sub_sub_root" + val2.value[i].header_category_id;
                li_hover.appendChild(ul_sub_sub_root);
                ul_sub_sub_root.appendChild(li_sub_sub_root);
                li_sub_sub_root.appendChild(element_created);
                element_created.appendChild(element_content);
            }
            element_content.click(function() {
                if (!element_content.hasChildNodes) {
                    show_the_article_by_category(val2.value[i].header_category_id);
                }
            });
        }

        console.log(future_menu);

        (function() {
            'use strict';
            // eslint-disable-next-line no-undef
            new hcOffcanvasNav('#main-nav', {
                disableAt       : false,
                customToggle    : '.menu_icon',
                levelSpacing    : 40,
                navTitle        : 'All',
                levelTitles     : true,
                levelTitleAsBack: true,
                pushContent     : '#container',
                labelClose      : false
            });
        })(jQuery);
        for (let i = 0;i < val2.value.length;i++) {
            let to_find = document.getElementById("a" + val2.value[i].id);
            if (!(to_find.childNodes.length > 1)) {
                //There is no child
                to_find.addEventListener('click', () => {
                    let content_of_category = to_find.innerText;

                    //Cahcher le menu
                    document.getElementById("main-nav").style.display = "none";
                    show_the_article_by_category(val2.value[i].id, content_of_category);
                });
            }
        }
    });


    function show_the_article_by_category(id, content_of_category) {
        let query_content = "SELECT name price ht_price description available_quantity ref delivery_date image_url id brand category_id FROM product WHERE category_id=" + id;
        let val = $.ajax({
            url : "../api/request",
            type: "GET",
            data: {query: query_content}
        });

        val.then(val => {
            //Verifier la page et si la page est la bonne alors TODO
            let div_container_all_article = document.getElementById("div_container_all_article");
            div_container_all_article.innerHTML = "";
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
            document.getElementById("all_the_category").innerHTML = "> " + content_of_category;

            if (val.value.length == 0) {
                div_container_all_article.innerHTML = "Aucun article no correspond";
            }


        });


    }
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


