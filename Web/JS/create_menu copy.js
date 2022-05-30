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
            element_content.onclick = show_the_article_by_category(val.value[i].header_category_id);
            element_content.textContent = val.value[i].name;
            let test = document.getElementById("li2" + val.value[i].header_category_id);
            element_created.id = val.value[i].id;
            if (val.value[i].header_category_id == -1) {
                console.log("grande catégorie");

                console.log("root" + element_created.id);
                element_created.appendChild(element_content);
                future_menu.appendChild(element_created);
                console.log(future_menu);
            } else if (document.getElementById(val.value[i].header_category_id)) {
                //On doit créer un ul et une liste avec l'élément
                let ul_under_root = document.createElement('ul');
                ul_under_root.id = "ul_under_root" + val.value[i].header_category_id;
                ul_under_root.appendChild(element_created);
                element_created.appendChild(element_content);
            } else if (test) {
                //               Console.log("existe déja");
                let li = document.getElementById("li2" + val.value[i].header_category_id);
                let ul;
                if (document.getElementById("li_ul" + val.value[i].header_category_id)) {
                    //               Console.log("inside sous catégorie exise déjà");
                    ul = document.getElementById("li_ul" + val.value[i].header_category_id);
                    let li_inside = document.createElement("li");
                    li_inside.id = "li_inside" + val.value[i].header_category_id;
                    ul.appendChild(li_inside);
                    li_inside.appendChild(element_content);

                } else {
                    console.log("inside sous catégorie exise pas");
                    ul = document.createElement("ul");
                    ul.id = "li_ul" + val.value[i].header_category_id;
                    let li_inside = document.createElement("li");
                    li_inside.id = "li_insideElse" + val.value[i].header_category_id;
                    ul.appendChild(li_inside);
                    li.appendChild(ul);
                    li_inside.appendChild(element_content);
                }
            } else {
                //             Console.log("sous catégorie");
                let subCategory = document.createElement("li");
                subCategory.id = "li" + val.value[i].header_category_id;
                subCategory.id = "li2" + val.value[i].header_category_id;
                subCategory.appendChild(element_content);
                future_menu.appendChild(subCategory);
            }
        }

        //Vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        //vide
        for (let i = 0;i < val.value.length;i++) {
            let element_created = document.createElement("li");
            let element_content = document.createElement("a");
            element_content.onclick = show_the_article_by_category(val.value[i].header_category_id);
            element_content.textContent = val.value[i].name;
            element_created.id = val.value[i].id;

            //Si on est dans la root
            if (val.value[i].header_category_id == -1) {
                console.log("ROOT : " + val.value[i].name);
                element_created.id = "Root" + val.value[i].id;
                element_created.appendChild(element_content);
                future_menu.appendChild(element_created);

            } else if (document.getElementById("Root" + val.value[i].header_category_id)) {
                //Si on est en sub root
                console.log("SUB ROOT : " + val.value[i].name + " inside of " + val.value[i].header_category_id);
                if (document.getElementById("ul_under_root" + val.value[i].header_category_id)) {
                    console.log("SUB ROOT déjà rencontrée");
                    let ul_under_root = document.getElementById("ul_under_root" + val.value[i].header_category_id);
                    element_created.appendChild(element_content);
                    ul_under_root.appendChild(element_created);

                    //Let add = document.getElementById("Root" + val.value[i].header_category_id);
                    //add.appendChild(ul_under_root);
                    //console.log(document.getElementById("Root" + val.value[i].id));
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
                    console.log("add" + add.innerHTML);
                    console.log("add" + ul_under_root.innerHTML);
                }
                element_created.appendChild(element_content);

                //Future_menu.appendChild(ul_under_root);

                //let add = document.getElementById("Root" + val.value[i].header_category_id);
                //add.appendChild(ul_under_root);
                //console.log(ul_under_root);

            } else if (document.getElementById("ul_under_root" + val.value[i].header_category_id)) {
                console.log("SUB SUB ROOT : " + val.value[i].name);
                let ul;
                if (document.getElementById("li_ul" + val.value[i].header_category_id)) {
                    ul = document.getElementById("li_ul" + val.value[i].header_category_id);
                    let li_inside = document.createElement("li");
                    li_inside.id = "li_inside" + val.value[i].header_category_id;
                    ul.appendChild(li_inside);
                    li_inside.appendChild(element_content);

                }
            }
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
    });
});

function show_the_article_by_category(id) {
    //Console.log("show");
    let query_content = "SELECT name price ht_price description available_quantity ref delivery_date image_url id brand category_id FROM product WHERE category_id=" + id;

    //Console.log(query_content);
    let val = $.ajax({
        url : "../api/request",
        type: "GET",
        data: {query: query_content}
    });

    val.then(val => {
        if (val.value.length > 2) {
            console.log(val);
        }

    });
}