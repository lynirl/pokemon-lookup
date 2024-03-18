

/**
 * capitalize
 * @param {*} text : un texte quelconque
 * @returns : le mot avec une majuscule au début
 */
function capitalize(text){
    return text.charAt(0).toUpperCase() + text.substring(1);
}

/**
 * updatePage
 * met à jour la zone prévue pour les résultats
 * @param {*} data
 */
let updatePage = function(data) {
    //reset des anciens résultats
    view.searchResult.textContent = "";

    //on parse d'abord parce que sinon ça ne marche pas?????
    //le data['contents'] c'est pour prendre la partie qui nous intéresse
    //et qui contient toutes les données
    //donc pas le status en plus quoi
    const pokemonData = JSON.parse(data['contents']);

    //debug: on a trouvé la bonne information?
    console.log(pokemonData.name);

    //! update final de la page
    //ajouter le nom du pokémon et son sprite
    view.searchResult.innerHTML += `
    <h3>${capitalize(pokemonData.name)}</h3>
    <br>
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png"/>`

    //ajouter ses types
    view.searchResult.innerHTML += `
    <h4>Types</h4>`
    for (let i in pokemonData.types) {
        //note: dans ce cas on parcourt pokemonData -> abilities -> 0 ou 1 -> ability -> name
        view.searchResult.innerHTML += `<img src='images/types/${pokemonData.types[i].type.name}.png'>`;
    };
}

//faire les descriptions
let updateDesc = function(data){
    const pokemonData = JSON.parse(data['contents']);

    view.imgPoke.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`;
    view.name.text = pokemonData.name;

    for(let i in pokemonData.stat){
        if(pokemonData.stat[i].stat.name = "attack"){
            let attack = pokemonData.stat[i].stat.base
        }
    }
}

/**
 * la requete AJAX principale
 * va chercher les informations en récupérant le nom indiqué dans la barre de recherche
 * puis utilise le proxy allorigins pour fetch
 * 
 * actualise la page lorsque tout est bon
 * TODO: gérer les erreurs
 */
let requeteAjax = async function() {
    //on récupère le nom du pokémon et on construit le lien en fonction
    //toLowerCase pour que l'api l'accepte
    let nomPokemon = view.pokemonFind.value.toLowerCase();
    let lien = 'https://pokeapi.co/api/v2/pokemon/'.concat(nomPokemon);

    //debug: on a le bon lien?
    console.log(lien);

    //requête asynchrone
    let responseObj = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(lien)}`);
    //afficher les résultats de la requête si c'est bon
    if(responseObj.ok) {
        //on récupère le json de la requête
        let jsonData = await responseObj.json();
        //debug: on a les bonnes données?
        console.log(jsonData);
        //update la page
        updatePage(jsonData);
    }
}

//event du bouton de recherche
view.boutonSearch.addEventListener('click', requeteAjax);