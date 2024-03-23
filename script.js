
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
    view.result1.innerHTML = "";
    view.result2.innerHTML = "";

    const pokemonData = data;

    //on stock le pokemon actuellement recherché
    
    //debug: on a trouvé la bonne information?
    console.log(pokemonData.name);
    displayPokemon(pokemonData);

}

/**
 * ?displayPokemon
 * affiche le pokemon sélectionné
 * @param {*} pokemonData 
 */
function displayPokemon(pokemonData){ 
    //
    currPokemon = pokemonData;
    view.searchResult.style.visibility = "visible";
    view.result1.innerHTML += `
    <h2>${capitalize(pokemonData.name)}</h2>
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png"/>`

    //ajouter ses types
    view.result1.innerHTML += `
    <h3>Types</h3>`
    for (let i in pokemonData.types) {
        //note: dans ce cas on parcourt pokemonData -> abilities -> 0 ou 1 -> ability -> name
        view.result1.innerHTML += `<img src='images/types/${pokemonData.types[i].type.name}.png'>`;
    };
    view.result1.innerHTML += `
    <h3>Cri</h3>
    <audio controls>
        <source src="https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonData.id}.ogg" type="audio/ogg">
    </audio>`

    
    for(let i in pokemonData.stats){
        view.result2.innerHTML+=
        `
        <section class = "ensStat">
            <h3>${pokemonData.stats[i].stat.name}</h3>
        <section id = "att">
            <bold>${pokemonData.stats[i].base_stat}</bold>
            <progress value="${pokemonData.stats[i].base_stat}" max="250"></progress> 
            </section>    
        </section>`
        
    }


    view.result1.innerHTML +=
    '<br> <br> <button id = "ajouterPokemon">Add to a team </button>'
    view.result1.innerHTML +=`<section id="pokes-separation"></section>`
    view.searchResult.hidden = false;

    //obliger de recuperer des element de la vue ici car l'element est creer après le chargement du view.js

    document.getElementById("ajouterPokemon").addEventListener('click', ajouterPokemon);
}


/**
 * ?ajouterPokemon
 * ajoute un Pokemon dans une équipe
 */
let ajouterPokemon = function(){
    console.log(equipeList);
    let nom = prompt("Which team do you want to add this Pokémon to?");
    let pokemonIn = false; 
    for(let i = 0 ; i< equipeList.length;i++){
        if(equipeList[i]._nom == nom  && equipeList[i].isFull() === false){
            equipeList[i]._pokemons.forEach(pokemon => {
                if(pokemon.id == currPokemon.id){
                    pokemonIn = true;
                }
            });
            if(pokemonIn == false){    
            equipeList[i].addPokemon(currPokemon);
            document.getElementById(equipeList[i]._nom).innerHTML += `<img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currPokemon.id}.png" alt ="blank">`;
            localStorage.setItem('equipeList', JSON.stringify(equipeList));
            }else{
                alert("This Pokémon is already in this team.");
            }
    }else if (equipeList[i].isFull() === true){
        alert("This team is full!");
    }
    }
}
/**
 *? la requete AJAX principale
 * va chercher les informations en récupérant le nom indiqué dans la barre de recherche
 * puis utilise le proxy allorigins pour fetch
 * 
 * actualise la page lorsque tout est bon, ou affiche un message d'erreur
 */

let requeteAjax = async function() {
    view.loader.hidden = false;
    //si le champ est vide on met direct un message
    if(view.pokemonFind.value == "" | view.pokemonFind.value == "."){
        view.error.innerHTML="Please enter a Pokémon name!"
    } else {
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
            //si il y avait une erreur on l'enlève
            view.error.innerHTML = ""
            updatePage(jsonData);
        } else {
            //si le pokémon n'est pas trouvé on a une erreur
            view.error.innerHTML=`This Pokémon doesn't exist!`;
        };
    };
    view.loader.hidden = true;
}

/**
 * ?newTeam
 * crée une nouvelle équipe
 */
let newTeam = function() {
    let equipeExist =  false;

    
    let nom = prompt("Veuillez entrer un nom d'equipe :");
    equipeList.forEach(equipe => {
        if(equipe._nom == nom){
            equipeExist = true;
        }
    });
    while(equipeExist == true){
        nom = prompt("Ce nom d'equipe existe deja ! Veuillez entrer un nouveau nom d'equipe :");
        equipeExist = false;
        equipeList.forEach(equipe => {
            if(equipe._nom == nom){
                equipeExist = true;
            }
        });
    }
    let equipe = new Equipe(nom);
    equipeList.push(equipe);
    view.equipeFav.innerHTML += 
    `<li>
    <button id = "${nom}">${nom}</h3>
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
                    <button>${equipe._nom}</h3>
                    <div id="${equipe._nom}">`;
        if(equipe._pokemons != null){
            equipe._pokemons.forEach(pokemon => {
                document.getElementById(equipe._nom).innerHTML += `<img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt ="blank">`
            });
        }      
        view.equipeFav.innerHTML += `</div>  </li>`;  
       
                
    });
    equipeList.forEach(equipe => {
        document.getElementById(equipe._nom).addEventListener('click',function(){
            view.result1.innerHTML = "";
            view.result2.innerHTML = "";
            equipe._pokemons.forEach(pokemon => {
                displayPokemon(pokemon);
                view.result1.innerHTML +=`<hr>`
            });         
    });
    });
    
    }
}




//event du bouton de recherche
view.boutonSearch.addEventListener('click', requeteAjax);

view.btnTeam.addEventListener('click',newTeam);

window.addEventListener('load', loadEquipesFromLocalStorage);

//si on appuie sur entrée ça recherche
pokemonFind.addEventListener("keyup", function(event) {
    //pq c'est le code pour la touche entrée
    if (event.keyCode === 13) {
      //on clique sur le bouton
      view.boutonSearch.click();
    }
  });