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
}