
let requeteAjax = async function() {
    //on récupère le nom du pokémon et on construit le lien en fonction
    let name2 = view.pokemonFind.value;
    let lien = 'https://pokeapi.co/api/v2/pokemon/'.concat(name2);

    //debug
    console.log(lien);

    //requête asynchrone
    let responseObj = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(lien)}`);
    //afficher les résultats de la requête si c'est bon
    if(responseObj.ok) {
        let jsonData = await responseObj.json();
        console.log(jsonData);
    }
}

//event du bouton
view.boutonSearch.addEventListener('click', requeteAjax);