$(document).ready(function () {
    /*
    *This code is used to get the number of article in the cart from the view "display_article"
    */
   // var old_data_saved = JSON.parse(sessionStorage.getItem('articleToCart2'));
   // document.getElementById("nb_article_in_cart").textContent = Object.keys(old_data_saved).length;

    (function ($) {
        'use strict';
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

    let div_container_all_article = document.getElementById("div_container_all_article");

    /*
     In order to populate the view without a database at first, we use the following line:
     */
    create_list_article({ "id": "1", "name": "Pneu Michelin 244", "preview": "https://mistervsp.fr/wp-content/uploads/2019/06/pneu-1456013-mistervsp.jpg", "description": "Un pneu", "brand": "Michelin", "price": 49.99 });
    create_list_article({ "id": "2", "name": "Pneu d'été", "preview": "https://bcdn.1001pneus.fr/media/catalog/category/MICHELIN_ALPIN_5.jpg", "description": "Pneu Michelin", "brand": "Continental", "price": 12.50 });
    create_list_article({ "id": "3", "name": "Chat", "preview": "https://voyage-onirique.com/wp-content/uploads/2020/02/647220.jpg", "description": "Un chat inconnu", "brand": "Unknown", "price": 15 });
    create_list_article({ "id": "4", "name": "Chat mignon", "preview": "https://www.zooplus.fr/magazine/wp-content/uploads/2018/05/ragdoll1.jpg", "description": "Un chat de race", "brand": "RagDoll", "price": 122.50 });
    create_list_article({ "id": "5", "name": "Pneu d'hiver", "preview": "https://mistervsp.fr/wp-content/uploads/2019/06/pneu-1456013-mistervsp.jpg", "description": "Black pneu", "brand": "Michelin", "price": 79.99 });
    create_list_article({ "id": "6", "name": "Pneu d'hiver Michelin", "preview": "https://s2.medias-norauto.fr/images_produits/michelin-alpin-a4/650x650/pneu-michelin-alpin-a4-215-65-r15-96-h--410230.jpg", "description": "Pneu Michelin", "brand": "Michelin", "price": 52.00 });
    create_list_article({ "id": "7", "name": "Chat moyennement cute", "preview": "https://i.pinimg.com/564x/06/3f/00/063f00618643bde18eaa914e248fd47d.jpg", "description": "Un énième chat mignon que l'on vend sur notre site web", "brand": "Bâtard", "price": 79.99 });
    create_list_article({ "id": "8", "name": "Minou minou ", "preview": "https://img.freepik.com/free-photo/cute-adorable-animals-funny-cat-grass-with-tongue-out_87555-2984.jpg?w=996", "description": "Encore un chat car on manque de chat dans la vie", "brand": "Continental", "price": 99.90 });
    create_list_article({ "id": "9", "name": "Kawai nekooooo ", "preview": "https://www.meme-arsenal.com/memes/df4f75462c0e60c091b008376b8b3638.jpg", "description": "Continental penu", "brand": "Continental", "price": 139.90 });
    create_list_article({ "id": "10", "name": "Pneu again", "preview": "https://www.vroomly.com/media/images/iStock-1251191256.width-500.jpg", "description": "Another pneu", "brand": "Continental", "price": 149.99 });
    create_list_article({ "id": "11", "name": "Chat super cute", "preview": "https://voyage-onirique.com/wp-content/uploads/2021/11/ZUdnRGZQcA.jpg", "description": "Un énième chat mignon que l'on vend sur notre site web pour une somme pas trop exagérée x)", "brand": "Bâtard", "price": 70.99 });
    create_list_article({ "id": "12", "name": "Pneu FIRESTONE Multiseason Gen 02", "preview": "https://bcdn.1001pneus.fr/media/catalog/product/cache/eca2862a9b2f8513a6172272a94221a8/m/u/multiseason_2.jpg", "description":"Pneus FIRESTONE Multiseason Gen 02 \n \nEn offrant un haut niveau de performances tout au long de l’année ainsi qu’une grande durée de vie et une consommation réduite de carburant, le Multiseason Gen 02 est idéal pour les conducteurs qui souhaitent faire des économies en évitant la permutation de leurs pneumatiques.Sa bande de roulement directionnelle assure une bonne maniabilité et une excellente tenue de route sur sol sec et mouillé.Grâce à son composé de gomme et son profil, il offre un grip supérieur sur la neige et la glace, pour une conduite sûre dans toutes les conditions.\n\nFIRESTONE décline le Multiseason Gen 02 dans une cinquantaine de dimensions différentes, du 13 pouces au 18 pouces, couvrant ainsi la majorité des 4x4 et SUV.\n\nPresque toutes les dimensions proposées pour le Multiseason Gen 02 sont notées C en termes de consommation de carburant.    \n\n\nTenue de route\nLe profil de sa bande de roulement lui confère un freinage plus efficace sur route sèche ou mouillée comparé à son prédécesseur, le Multiseason.\n\nLes rainures transversales de son profil en V favorisent l’évacuation de l’eau ou de la neige pour offrir une zone de contact maximale avec la route et limiter ainsi le phénomène d’aquaplaning.À l’exception de trois dimensions qui sont notées C, le Multiseason Gen 02 dispose de la note B sur l’étiquetage européen relatif à l’adhérence sur route mouillée.\n\nAdhérence sur la neige\nLes rainures profondes situées entre les blocs de ses épaulements garantissent une traction et un mordant supérieur sur la neige ou la boue.Leur action est renforcée par l’intermédiaire des lamelles disposées sur ses blocs qui procurent une meilleure accroche sur les surfaces meubles.\n\n\nDurée de vie\nIl supplante son prédécesseur, en disposant d’un meilleur potentiel kilométrique, notamment grâce au nouveau composé de gomme développé par FIRESTONE.\nCelui - ci confère au Multiseason Gen 02 une très grande adhérence d’une part, mais aussi une longévité supérieure.", "brand": "Firestone", "price": 92.6});
});

/**
 * create_list_article(article) is used to create all the html element that are needed to show an article on a page (image, price, name)
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
    let html_component_div_container = document.createElement("div");
    html_component_div_container.id = "box";
    let html_component_article_image = document.createElement("img");
    let html_component_article_info_div = document.createElement("div");
    html_component_article_info_div.id = "details";
    let html_component_article_name = document.createElement("h3");
    let html_component_article_brand = document.createElement("h4");
    let html_component_article_price = document.createElement("h2");
    let link_to_show_article = document.createElement("a");
    link_to_show_article.style="text-decoration:none;";
    link_to_show_article.href="see_article.html";

    html_component_div_container.appendChild(link_to_show_article);
    link_to_show_article.appendChild(html_component_article_image);
    link_to_show_article.appendChild(html_component_article_info_div);
    /*
     * When the user clicks on the article, we will save the informations about it in the localStorage in order to have those informations in the view "see_article"     
     */
    link_to_show_article.onclick = function (){
        //Need to load the html page and to give to the function that displays the article the informations required
        localStorage.setItem('name_article', article.name);
        localStorage.setItem('description_article', article.description);
        localStorage.setItem('price_article', article.price);
        localStorage.setItem('brand_article', article.brand);
        localStorage.setItem("image_article", article.preview);
        localStorage.setItem("id_article", article.id);                                      
    }
    html_component_article_info_div.appendChild(html_component_article_name);
    html_component_article_info_div.appendChild(html_component_article_brand);
    html_component_article_info_div.appendChild(html_component_article_price);

    /*Add the values of the article in the component made for it:
    * - article.price → html_component_article_price
    * - article.name → html_component_article_name
    * - article.brand → html_component_article_brand
    */
    let article_price = document.createTextNode((parseFloat(article.price)).toFixed(2) + "€");
    html_component_article_price.appendChild(article_price);

    let article_name = document.createTextNode(article.name);
    html_component_article_name.appendChild(article_name);

    let article_brand = document.createTextNode(article.brand);
    html_component_article_brand.appendChild(article_brand);
    html_component_article_image.src = article.preview;
    html_component_article_image.id = "image_of_article_in_display";

//pour ne pas avoir à passer par le csv
//    return html_component_div_container;
    div_container_all_article.appendChild(html_component_div_container);
}

//We create a XMLHttpRequest to read the articles.
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
    if (httpRequest.DONE) {
        // status = 200 mean that the statut of the XMLHttpRequest is OK (everything is going well)
        if (this.status == 200) {
            let result_http_request = JSON.parse(this.responseText);
            //For each element, the code add dynamically with the function create_list_article the article to the component "div_container_all_article"
            for (let i = 0; i < result_http_request.length; i++) {
                div_container_all_article.appendChild(
                    create_list_article(result_http_request[i])
            );
        }
        } else {
            console.log("fail");
        }
    }
};
// The code take the data from a json file saved on github.
httpRequest.open(
    "GET",
    "",
    true
);
httpRequest.send();       