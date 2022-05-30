$(document).ready(function() {
    'use strict';
    let val = $.ajax({
        url : "../api/request",
        type: "GET",
        data: {query: "SELECT id name header_category_id FROM category WHERE id>=0"}
    });
    val.then(val => {
        // Console.log(val);

        let future_menu = document.getElementById("main-nav2");


        for (let i = 0;i < val.value.length;i++) {
            let element_created = document.createElement("li");
            let element_content = document.createElement("a");
            element_content.id = "a" + val.value[i].id;


            element_content.textContent = val.value[i].name;
            element_created.id = val.value[i].id;


            //Si on est dans la root
            if (val.value[i].header_category_id == -1) {
                //Console.log("ROOT : " + val.value[i].name);
                element_created.id = "Root" + val.value[i].id;
                element_created.appendChild(element_content);
                future_menu.appendChild(element_created);

            } else if (document.getElementById("Root" + val.value[i].header_category_id)) {
                if (document.getElementById("ul_under_root" + val.value[i].header_category_id)) {
                    //Console.log("SUB ROOT déjà rencontrée");
                    let ul_under_root = document.getElementById("ul_under_root" + val.value[i].header_category_id);
                    element_created.appendChild(element_content);
                    ul_under_root.appendChild(element_created);
                } else {
                    let li_under_root = document.createElement('li');
                    li_under_root.id = "li_under_root" + val.value[i].header_category_id;
                    let ul_under_root = document.createElement('ul');
                    ul_under_root.id = "ul_under_root" + val.value[i].header_category_id;
                    li_under_root.appendChild(ul_under_root);
                    ul_under_root.appendChild(element_created);
                    element_created.appendChild(element_content);
                    let add = document.getElementById("Root" + val.value[i].header_category_id);
                    add.appendChild(ul_under_root);
                }
                element_created.appendChild(element_content);
            } else if (document.getElementById("ul_under_root" + val.value[i].header_category_id)) {
                alert("here");
                console.log("SUB SUB ROOT : " + val.value[i].name);
                let ul;
                if (document.getElementById("li_ul" + val.value[i].header_category_id)) {
                    ul = document.getElementById("li_ul" + val.value[i].header_category_id);
                    let li_inside = document.createElement("li");
                    li_inside.id = "li_inside" + val.value[i].header_category_id;
                    ul.appendChild(li_inside);
                    li_inside.appendChild(element_content);

                }
            } else {
                //Console.log("SUB SUB ROOT");
                let li_hover = document.getElementById(val.value[i].header_category_id);
                let li_sub_sub_root = document.createElement('li');
                li_sub_sub_root.id = "li_sub_sub_root" + val.value[i].header_category_id;
                let ul_sub_sub_root = document.createElement('ul');
                ul_sub_sub_root.id = "ul_sub_sub_root" + val.value[i].header_category_id;
                li_hover.appendChild(ul_sub_sub_root);
                ul_sub_sub_root.appendChild(li_sub_sub_root);
                li_sub_sub_root.appendChild(element_created);
                element_created.appendChild(element_content);
            }

            // Element_content.onclick = show_the_article_by_category(val.value[i].header_category_id);
            element_content.click(function() {
                if (element_content.hasChildNodes) {
                    console.log("no searhc");
                } else {
                    console.log("faire une rechercher");
                    show_the_article_by_category(val.value[i].header_category_id);

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
        for (let i = 0;i < val.value.length;i++) {
            let to_find = document.getElementById("a" + val.value[i].id);
            if (to_find.childNodes.length > 1) {
                console.log("has child");
            } else {
                console.log("has no child");
                to_find.onclick = function() {
                    show_the_article_by_category(val.value[i].header_category_id);
                };


            }
        }
    });
});

function show_the_article_by_category(id) {
    let query_content = "SELECT name price ht_price description available_quantity ref delivery_date image_url id brand category_id FROM product WHERE category_id=" + id;
    console.log(query_content);
    let val = $.ajax({
        url : "../api/request",
        type: "GET",
        data: {query: query_content}
    });

    val.then(val => {
        console.log(val);

        //Verifier la page et si la page est la bonne alors
        //afficher les articles

        for (let i = 0;i < val.value.length;i++) {
            /*Create_list_article({
                "id"         : val.value[i].id,
                "name"       : val.value[i].name,
                "preview"    : val.value[i].image_url,
                "description": val.value[i].description,
                "brand"      : val.value[i].brand,
                "price"      : val.value[i].price
            });*/
            console.log("dont minde");
        }


    });
}