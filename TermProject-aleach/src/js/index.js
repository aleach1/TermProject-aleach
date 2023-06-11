import './general'

class PlayList{
    constructor(){
        this.$search = document.getElementById('search');
        this.$checkedBoxes = document.querySelector('#checkedBoxes');
        this.$tracks = document.querySelector('#tracks');
        this.$artists = document.querySelector('#artists');
        this.searchResults = {};
        this.seedArtists = {};
        this.seedTracks = {};
        
        this.token = this.getToken();
        this.addEventListeners();

        /*this.$search.addEventListener('onchange', event => {
            this.onFormSubmit(event);
          });*/
    }

    onSearchChange(){
        const requestOptions = {
            method: 'GET',
            headers:  { 'Authorization' : 'Bearer ' + this.token}
        };

        fetch(`https://api.spotify.com/v1/search?q=${this.$search.value}`)
    }

    getToken(){
        let tempToken;
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
                console.log(data);
                tempToken = data.access_token;
            })
            .catch(error => {
                console.log(error);
                alert(error);
            })
        return tempToken;
    }

    addEventListeners(){
        this.$search.onchange = this.onSearchChange();
    }
}

window.onload = ()=>{  new PlayList() };
