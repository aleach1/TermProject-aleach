import './general'

import addPlaylist from '../assets/support';
import toastr from 'toastr';
import 'toastr/toastr.scss';

class PlayList{
    constructor(){
        this.$search = document.querySelector('#searchInput');
        this.$checkedBoxes = document.querySelector('#checkedBoxes');
        this.$tracks = document.querySelector('#tracks');
        this.$artists = document.querySelector('#artists');
        this.$button = document.querySelector('#addplaylist');
        this.searchResults = [];
        this.seeds = []
        this.token;

        //this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();
        this.getToken();

        
    }

    addRecommendedPlaylist(){
        let variable = "";
        const requestOptions = {
            method: 'GET',
            headers:  { 'Authorization': `Bearer ${this.token}`}
        };
        let trackUrl = "seed_tracks=";
        let artistUrl = "seed_artists=";
        for (let i = 0; i < this.seeds.length; i++){
            if (this.seeds[i].isTrack){
                if (trackUrl.length > 12){
                    trackUrl += "%2C" + this.seeds[i].id
                }
                else{
                    trackUrl += this.seeds[i].id
                }
            }
            else{
                if (artistUrl.length > 13){
                    artistUrl += "%2C" + this.seeds[i].id
                }
                else{
                    artistUrl += this.seeds[i].id
                }
            }
        }
        if (trackUrl.length < 15 || artistUrl.length < 15){
            if (trackUrl.length < 15 && artistUrl.length < 15){
                variable = "";
            }
            else if (trackUrl < artistUrl) {
                variable = "&" + artistUrl;
            }
            else if (artistUrl < trackUrl) {
                variable = "&" + trackUrl;
            }
        }
        else{
            variable = "&" + artistUrl + "&" + trackUrl;
        }
        fetch(`https://api.spotify.com/v1/recommendations?limit=25&market=US${variable}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let seedURIs = []
                for (let i = 0; i < 25; i++){
                    seedURIs.push({
                        name : data.tracks[i].name,
                        image : data.tracks[i].album.images[2].url,
                        artist : data.tracks[i].artists[0].name
                    });;
                }
                this.fillRecommendedListHTML(seedURIs);
                //addPlaylist(this.token, seedURIs);
            })
            .catch(error => {
                alert(error);
            })
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

    fillRecommendedListHTML(tracks){
        let recHTML = "Recommended List";
        for (let i = 0; i < tracks.length; i++){
            recHTML += this.fillRecommendedHTML(tracks[i]);
        }
        document.querySelector('#recommended').innerHTML = recHTML;
    }

    fillRecommendedHTML(track){
        return `
        <div id="recommendedTrack" class="search-results">
            <img src=${track.image} alt="${track.name} album cover" class="search-image">
            <p class="search-result" >${track.name}, ${track.artist}</p>
        </div>
        `;
    }

    fillSearchHTML(){
        this.fillTracksHTML();
        this.fillArtistsHTML();
        this.addEventHandlers();
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
        <div id="results" class="search-results" id="result${index}">
            <img src=${this.searchResults[index].image} alt="${this.searchResults[index].name} profile picture" class="search-image">
            <p class="search-result" >${this.searchResults[index].name}</p>
        </div>
    `;
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
        <div id="results" class="search-results" value="${index}">
            <img src=${this.searchResults[index].image} alt="${this.searchResults[index].name} album cover" class="search-image">
            <p class="search-result" >${this.searchResults[index].name}, ${this.searchResults[index].artist}</p>
        </div>
    `;
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
        this.addEventHandlers = this.addEventHandlers.bind(this);
        this.addRecommendedPlaylist = this.addRecommendedPlaylist.bind(this);

        this.$search.onkeyup = this.onSearchChange;
        this.$button.onclick = this.addRecommendedPlaylist;
    }

    addEventHandlers(){
        const results = document.querySelectorAll("#results");
        results.forEach((result, i) => {
            results[i].onclick = this.addSeedValue.bind(this, i);
        })

        const seedValues = document.querySelectorAll('#seeds');
        seedValues.forEach((seedValue, i) => {
            seedValue.onclick = this.removeSeedValue.bind(this, i);
        })
    }

    removeSeedValue(index){
        console.log("working");
        this.seeds.splice(index, 1);
        this.seedsHTML();
    }

    addSeedValue(index){
        if (this.seeds.length < 5){
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
    }

    seedsHTML(){
        let seedsHtml = "";
        for (let i = 0; i < this.seeds.length; i++){
            seedsHtml += this.seedHTML(i);
        }
        this.$checkedBoxes.innerHTML = seedsHtml;
        this.addEventHandlers();
    }

    seedHTML(index){
        return `
        <p id="seeds" class="seed">${this.seeds[index].name}</p>
        `;
    }
}

window.onload = ()=>{  new PlayList() };
