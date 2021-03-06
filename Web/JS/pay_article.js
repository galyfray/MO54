//Const express = require("express");

$(document).ready(function() {
    document.getElementById("button_create_account").onclick = function() {
        create_account();
    };
    document.getElementById("button_login").onclick = function() {
        login();
    };
    document.getElementById("button_without_account").onclick = function() {
        not_login();
    };

});


function login() {
    document.getElementById("mdp_div").classList.add('display_form_part');
    document.getElementById("mdp_div").classList.remove('hidden');
    document.getElementById("nom_div").classList.add('hidden');
    document.getElementById("societe_div").classList.add('hidden');
    document.getElementById("prenom_div").classList.add('hidden');
    document.getElementById("tel_div").classList.add('hidden');
    document.getElementById("acces_div").classList.add('hidden');
}
function not_login() {
    document.getElementById("nom_div").classList.add('display_form_part');
    document.getElementById("societe_div").classList.add('display_form_part');
    document.getElementById("nom_div").classList.remove('hidden');
    document.getElementById("societe_div").classList.remove('hidden');
    document.getElementById("prenom_div").classList.add('hidden');
    document.getElementById("mdp_div").classList.add('hidden');
    document.getElementById("tel_div").classList.add('hidden');
    document.getElementById("acces_div").classList.add('hidden');
}

function create_account() {
    document.getElementById("nom_div").classList.add('display_form_part');
    document.getElementById("societe_div").classList.add('display_form_part');
    document.getElementById("prenom_div").classList.add('display_form_part');
    document.getElementById("mdp_div").classList.add('display_form_part');
    document.getElementById("tel_div").classList.add('display_form_part');
    document.getElementById("acces_div").classList.add('display_form_part');
    document.getElementById("nom_div").classList.remove('hidden');
    document.getElementById("societe_div").classList.remove('hidden');
    document.getElementById("prenom_div").classList.remove('hidden');
    document.getElementById("mdp_div").classList.remove('hidden');
    document.getElementById("acces_div").classList.remove('hidden');
    document.getElementById("tel_div").classList.remove('hidden');
}


// eslint-disable-next-line no-unused-vars
function payment_validated() {

    //    SetTimeout(location.href='display_articles.html', 4000);
    let verified = verify_input_payment();
    if (verified == true) {
        document.getElementById("payement_validated").style.display = "block";
        document.getElementById("form_part1").style.display = "none";
        document.getElementById("information_div").style.display = "none";
        document.getElementById("payement_div").style.display = "none";
        document.getElementById("form_part4").style.display = "none";
        document.getElementById("before_selection_choice").style.display = "none";

        //Vider le panier
        //sessionStorage.clear();
        //We need to make sure we saved what has been bought
        /*let article_bought = JSON.parse(sessionStorage.getItem('articleToCart2'));
        let best_sales = JSON.parse(sessionStorage.getItem('best_sales'));
        console.log(best_sales);


        //Tant qu'on a encore des entr??es, on va v??rifier si existe une fois ou non
        let r = 0;
        while (article_bought.length > r) {
            r = r + 1;
            let found = false;
            if (best_sales != null || best_sales != []) {
                for (let j = 0;j < best_sales.length;j++) {
                    if (best_sales[j].id == article_bought[r].id) {
                        found = true;
                        best_sales[j].quantity = best_sales[j].quantity + article_bought[r].quantity;
                    }
                }

            }
            if (best_sales == null) {
                best_sales = [];
            }

            if (found == false) {
                best_sales.push({
                    'id'         : article_bought[r].id,
                    'name'       : article_bought[r].name,
                    'price'      : article_bought[r].price,
                    'brand'      : article_bought[r].brand,
                    'description': article_bought[r].description,
                    'preview'    : article_bought[r].image
                });
            }

        }
        console.log(best_sales);
*/
        sessionStorage.removeItem('articleToCart2');


        setTimeout(() => {
            location.href = 'display_articles.html';
        }, 4000);
    }


}
// eslint-disable-next-line no-unused-vars
function sendEmail() {
    // eslint-disable-next-line no-undef
    Email.send({
        Host    : "smtp.gmail.com",
        Username: "sender@email_address.com",
        Password: "Enter your password",
        To      : '',
        From    : "",
        Subject : "Sending Email using javascript",
        Body    : "Well that was easy!!"
    })
        .then(function() {
            alert("mail sent successfully");
        });
}
function verify_input_identity() {
    //V??rifier si on a ou pas rempli le n??cessaire
    if (!document.getElementById("mdp_div").classList.contains('hidden')) {
        if (document.getElementById("input_mdp").value == "") {
            return false;
        }
    }

    if (!document.getElementById("nom_div").classList.contains('hidden')) {
        if (document.getElementById("input_name").value == "") {
            return false;
        }
    }

    if (!document.getElementById("societe_div").classList.contains('hidden')) {
        if (document.getElementById("input_society").value == "") {
            return false;
        }
    }

    if (!document.getElementById("tel_div").classList.contains('hidden')) {
        if (document.getElementById("input_phone").value == "") {
            return false;
        }
    }
    if (!document.getElementById("prenom_div").classList.contains('hidden')) {
        if (document.getElementById("input_firstname").value == "") {
            return false;
        }
    }
    if (!document.getElementById("acces_div").classList.contains('hidden')) {
        if (document.getElementById("input_checkbox").value == false) {
            return false;
        }
    }
    return true;

}

//It is called from the html files
// eslint-disable-next-line no-unused-vars
function verify_input_addresse() {


    if (document.getElementById("input_address").value != "" &
        document.getElementById("input_postal").value != "" &
        document.getElementById("input_city").value != "") {
        document.getElementById('payement_div').style.display = 'block';
    }
}

function verify_input_payment() {
    if (document.getElementById("input_name_card").value != "" &
        document.getElementById("input_num_card").value != "" &
        document.getElementById("input_date_card").value != "" &
        document.getElementById("input_security_code_card").value != "") {
        return true;
    } else {
        return false;
    }
}

//It is called from the html files
// eslint-disable-next-line no-unused-vars
function print_information_div() {
    let filled = verify_input_identity();
    if (filled == true) {
        document.getElementById('information_div').style.display = 'block';
    }

}