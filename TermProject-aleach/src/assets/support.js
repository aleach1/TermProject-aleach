import toastr from 'toastr';
import 'toastr/toastr.scss';

export default function addPlaylist(token, newTracks){
    const userOptions = {
        method: 'GET',
        headers:  { 'Authorization': `Bearer ${token}`}
    };
    const creationOptions = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json', 
            'Authorization' : `Bearer ${token}`
        },
        data: {
            "name": "Term Project Playlist",
            "description": "This playlist was generated based off of 5 tracks and artists",
            "public": true
        }
    };
    const addingOptions = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json', 
            'Authorization' : `Bearer ${token}`
        },
        data: {
            "uris" : newTracks,
            "position" : 0
        }
    };

    fetch("https://api.spotify.com/v1/me", userOptions)
        .then(response => response.json)
        .then(data => {
            console.log(data);
            const userID = data.id;
            fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, creationOptions)
                .then(response => response.json())
                .then(data => {
                    const playlistID = data.id;
                    fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, addingOptions)
                        .then(response => {
                            if (response < 400){
                                toastr.success("Your playlist was succesfully added");
                            }
                            else{
                                toastr.error("Something went wrong while adding your playlist");
                            }
                        })
                        .catch(error => {
                            alert(error);
                        })
                })
                .catch(error => {
                    alert(error);
                })
        })
        .catch(error => {
            alert(error)
        })
}

