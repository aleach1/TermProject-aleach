import './general'

class PlayList{
    constructor(){
        this.$search = document.querySelector('#searchInput');
        this.$checkedBoxes = document.querySelector('#checkedBoxes');
        this.$tracks = document.querySelector('#tracks');
        this.$artists = document.querySelector('#artists');
        this.searchResults = [];
        this.seeds = []
        this.token;

        //this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();
        this.getToken();

        
    }

    onSearchChange(){
        this.searchResults = [];
        const searchValue = encodeURIComponent(this.$search.value);
        const requestOptions = {
            method: 'GET',
            headers:  { 'Authorization': `Bearer ${this.token}`}
        };
        

        fetch(`https://api.spotify.com/v1/search?q=${searchValue}&type=track%2Cartist&limit=3`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                for (let i = 0; i < 3; i++){
                    this.searchResults.push({
                        name : data.tracks.items[i].name,
                        image : data.tracks.items[i].album.images[2].url,
                        artist : data.tracks.items[i].artists[0].name,
                        id : data.tracks.items[i].id
                    });
                }
                for (let i = 0; i < 3; i++){
                    this.searchResults.push({
                        name : data.artists.items[i].name,
                        image : data.artists.items[i].images[2].url,
                        id : data.artists.items[i].id
                    });
                }
                this.fillSearchHTML();
            })
            .catch(error => {
                alert(error);
            })
    }

    fillSearchHTML(){
        this.fillTracksHTML();
        this.fillArtistsHTML();
    }

    fillArtistsHTML(){
        let artistsHtml = "Artists: ";
        for (let i = 3; i < 6; i++){
            artistsHtml += this.fillArtistHTML(i);
        }
        this.$artists.innerHTML = artistsHtml;
    }

    fillArtistHTML(index){
        return `
        <div class="search-results" id="result${index}">
            <img src=${this.searchResults[index].image} alt="${this.searchResults[index].name} profile picture" class="search-image">
            <p class="search-result" id="results">${this.searchResults[index].name}</p>
        </div>
    `
    }

    fillTracksHTML(){
        let tracksHtml = "Tracks: ";
        for (let i = 0; i < 3; i++){
            tracksHtml += this.fillTrackHTML(i);
        }
        this.$tracks.innerHTML = tracksHtml;
    }

    fillTrackHTML(index){
        return `
        <div class="search-results" value="${index}">
            <img src=${this.searchResults[index].image} alt="${this.searchResults[index].name} album cover" class="search-image">
            <p class="search-result" id="results">${this.searchResults[index].name}, ${this.searchResults[index].artist}</p>
        </div>
    `
    }

    getToken(){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa( CLIENT_ID + ':' + CLIENT_SECRET)
            },
            body: 'grant_type=client_credentials'
        };
        fetch(`https://accounts.spotify.com/api/token`, requestOptions)
            .then(response => response.json())
            .then(data => {
                this.token = data.access_token;
            })
            .catch(error => {
                console.log(error);
                alert(error);
            })
    }

    addEventListeners(){
        this.onSearchChange = this.onSearchChange.bind(this);

        this.$search.onkeyup = this.onSearchChange;
    }

    addEventHandlers(){
        const results = document.getElementsByName("results");
        results.forEach((result, i) => {
            result.onclick = this.addSeedValue.bind(this, i);
        })

        const seedValues = document.getElementsByName('seedValues');
        seedValues.forEach((seedValue, i) => {
            seedValue.onclick = this.removeSeedValue.bind(this, i);
        })
    }

    removeSeedValue(index){
        this.seeds.splice(index, 1);
        this.seedsHTML();
    }

    addSeedValue(index){
        if (index < 3){
            this.seeds.push({
                id : this.searchResults[index].id,
                isTrack : true,
                name : this.searchResults[index].name
            });
        }
        else{
            this.seeds.push({
                id : this.searchResults[index].id,
                isTrack : false,
                name : this.searchResults[index].name
            });
        }
        this.seedsHTML();
    }

    seedsHTML(){

    }
}

window.onload = ()=>{  new PlayList() };
