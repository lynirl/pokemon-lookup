
view.searchResult.hidden = true;
let equipeList = [];
let currPokemon = null;
let equipeListChaine;
/**
 *? capitalize
 * @param {*} text : un texte quelconque
 * @returns : le mot avec une majuscule au début
 */
function capitalize(text){
    return text.charAt(0).toUpperCase() + text.substring(1);
}

/**
 *? updatePage
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
    const pokemonData = data;

    //on stock le pokemon actuellement recherché
    currPokemon = pokemonData;
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
    view.searchResult.innerHTML += `
    <br>
    <h4>Cri</h4>
    <audio controls>
        <source src="https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonData.id}.ogg" type="audio/ogg">
    </audio>`

    for(let i in pokemonData.stats){
        view.searchResult.innerHTML+=
        `<div class = "stat">`
    
        view.searchResult.innerHTML+=
        `<section class = "ensStat">
            <h3>${pokemonData.stats[i].stat.name}</h3>
        <section id = "att">
            <bold>${pokemonData.stats[i].base_stat}</bold>
            <progress value="${pokemonData.stats[i].base_stat}" max="250"></progress> 
            </section>    
        </section>`
    
        view.searchResult.innerHTML+=
        `</div>`
    }
    view.searchResult.innerHTML +=
    '<button id = "ajouterPokemon">Ajouter a une equipe </button>'
    view.searchResult.hidden = false;

    //obliger de recuperer des element de la vue ici car l'element est creer après le chargement du view.js

    document.getElementById("ajouterPokemon").addEventListener('click', ajouterPokemon);
}


//ajout d'un pokemon dans une equipe 
let ajouterPokemon = function(){
    console.log(equipeList[0]);
    let nom = prompt("A quelle equipe voulez vous ajoutez ce pokemon");

    for(let i = 0 ; i< equipeList.length;i++){
        if(equipeList[i]._nom == nom){
            equipeList[i].addPokemon(currPokemon);
            document.getElementById(equipeList[i]._nom).innerHTML += `<img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currPokemon.id}.png" alt ="blank">`;
            localStorage.setItem('equipeList', JSON.stringify(equipeList));
        }
    }
}
/**
 *? la requete AJAX principale
 * va chercher les informations en récupérant le nom indiqué dans la barre de recherche
 * puis utilise le proxy allorigins pour fetch
 * 
 * actualise la page lorsque tout est bon
 * TODO: gérer les erreurs
 */



let requeteAjax = async function() {
    view.loader.hidden = false;
    //on récupère le nom du pokémon et on construit le lien en fonction
    //toLowerCase pour que l'api l'accepte
    let nomPokemon = view.pokemonFind.value.toLowerCase();
    let lien = 'https://pokeapi.co/api/v2/pokemon/'.concat(nomPokemon);

    //debug: on a le bon lien?
    console.log(lien);

    //requête asynchrone
    //let responseObj = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(lien)}`);
    let responseObj = await fetch(lien);
    //afficher les résultats de la requête si c'est bon
    if(responseObj.ok) {
        //on récupère le json de la requête
        let jsonData = await responseObj.json();
        //debug: on a les bonnes données?
        console.log(jsonData);
        //update la page
        updatePage(jsonData);
    };
    view.loader.hidden = true;
}

let newTeam =function() {
    let nom = prompt("Veuillez entrer un nom d'equipe :");
    let equipe = new Equipe(nom);
    equipeList.push(equipe);
    view.equipeFav.innerHTML += 
    `<li>
    <h3>${nom}</h3>
    <div id = "${nom}">
    
    </div>
    </li>`;
    localStorage.setItem('equipeList', JSON.stringify(equipeList));
}

// Fonction pour charger les équipes depuis le local storage
let loadEquipesFromLocalStorage = function () {
    const storedEquipeList = localStorage.getItem('equipeList');
    if (storedEquipeList) {
        equipeList = JSON.parse(storedEquipeList);
        let equipeListParse = [];
        equipeList.forEach(equipe => {
            let classEquipe = new Equipe(equipe._nom);
            classEquipe.setPokemons(equipe._pokemons);
            equipeListParse.push(classEquipe);
        });
        equipeList = equipeListParse;
        equipeList.forEach(equipe => {
            view.equipeFav.innerHTML += `
                <li>
                    <h3>${equipe._nom}</h3>
                    <div id="${equipe._nom}">`;
        if(equipe._pokemons != null){
            equipe._pokemons.forEach(pokemon => {
                document.getElementById(equipe._nom).innerHTML += `<img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt ="blank">`
            });
        }      
        view.equipeFav.innerHTML += `</div>  </li>`;
        });
    }
}

//event du bouton de recherche
view.boutonSearch.addEventListener('click', requeteAjax);

view.btnTeam.addEventListener('click',newTeam);

window.addEventListener('load', loadEquipesFromLocalStorage);
