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