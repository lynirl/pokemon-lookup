class Equipe{
    _nom;

    _pokemons;

    constructor(nom){
        this._nom = nom;

        this._pokemons = []

    }

    getNom(){
        return this._nom;
    }

    setPokemons(pokemons){
        this._pokemons = pokemons;
    }
    isFull(){
        if(this._pokemons.length == 6 ){
            return true;
        }else{
            return false;
        }
    }

    addPokemon(pokemon){
        if(this.isFull ==  true){
            throw "Cette equipe est complete";
        }else{
            this._pokemons.push(pokemon);
        }
    }

    storeTeam(){
        if(this._pokemons != null){
        localStorage.setItem(this._nom,JSON.stringify(this._pokemons));            
    }else{
        localStorage.setItem(this._nom,"");            
    }
}
}