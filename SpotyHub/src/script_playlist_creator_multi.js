// Select the button
const createPlaylistButton = document.getElementById("create-playlist-button");

// Retrieve the access token from local storage
const accessToken = localStorage.getItem('accessToken');

// Get the list of all user's Token 
const tokenList = localStorage.getItem('tokenList');

//We split the list of token to get each token and store them in an array named "tokens"
const tokens = tokenList.split(",")

//We add the current token to the list of token
tokens.push(accessToken);

//initialize the list of tracks
let tracksList = [];

//We get the top 10 tracks for each token
for (let i = 0; i < tokens.length; i++) {
  const element = tokens[i];
  const track = await fetchTrack(element);
  tracksList.push(track);
  console.log(tracksList);
  populateUI(track);

}

// Add an event listener to the button to create the playlist and add the tracks
createPlaylistButton.addEventListener("click", async function() {
    
    // store the user's Id
    const userId = await fetchUserId(accessToken);
    // Call async function to create a new playlist and get its ID
    const playlistId = await createPlaylist(userId, accessToken); 
    // Call async function to add the tracks to the playlist
    for (let i = 0; i < tokens.length; i++) {
        const element = tokens[i];//store the current token
        const tracks = await fetchTrack(element);//get the top 10 tracks for the current token
        await addTracksToPlaylist(playlistId, tracks.items, accessToken);//add the tracks to the playlist
    }
    const successMessage = document.getElementById("success-message");
    successMessage.style.display = "block";
    //Change the src of the iframe with the id of the new playlist and display it.
    var iframe = document.getElementById("playlistCreate");
    iframe.src =`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
    let div = document.getElementById("divPlay");
    div.style.display = "block";

});

// Call async function to get the user's top tracks
async function fetchTrack(token) {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10&offset=0", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}


// Call async function to get the user's ID
async function fetchUserId(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await result.json();
    return data.id;
}


function populateUI(tracks) {
    const trackList = document.getElementById("track-list");
    if (tracks.items.length > 0) {
        tracks.items.forEach((track, index) => {
            let listItem = document.createElement("li");
            listItem.innerText = `${index+1}. ${track.name}`;
            trackList.appendChild(listItem);
        });
    } else {
        document.getElementById("name").innerText = "No top tracks found";
    }
}


// Call async function to create a new playlist and get its ID
async function createPlaylist(userId, token) {
    const result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' // We need to specify that we're sending JSON
        },
        // We need to stringify the object to send it to the server
        body: JSON.stringify({
            name: "My Top 10 Tracks by SpotyHub",
            description: "Playlist created by SpotiyHub",
            public: true
        })
    });
    const data = await result.json();
    console.log("hi ! ");
    console.log(data);
    return data.id;
}

// Call async function to add the tracks to the playlist
async function addTracksToPlaylist(playlistId, tracks, token) {
    const trackUris = tracks.map(track => track.uri);//get the uri of each track
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uris: trackUris
        })
    });
}





//affichage playlist

async function fetchPlaylist() {
    const Token = localStorage.getItem('accessToken');
    const id_playlist = document.getElementById("playlist-input").value;
    changePlaylist(id_playlist);
    const result = await fetch(`https://api.spotify.com/v1/playlists/${id_playlist}`, {
        method: "GET", 
        headers: { 
            Authorization: `Bearer ${Token}` 
        }
    });
    const track = await fetch(`https://api.spotify.com/v1/playlists/${id_playlist}/tracks?limit=50`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${Token}`
        }
    });
 
    const jsonTrack = await track.json();
    const jsonResult = await result.json();
    console.log(jsonResult);
    //window.open(jsonResult);
     await populatePlaylist(jsonResult);
     console.log("gg");
     console.log(jsonTrack);
     await displayPlaylist(jsonTrack);

}



async function populatePlaylist(profile) {
    document.getElementById("displayPlaylist").innerText = profile.name;
    if(profile.collaborative === false){
        
        document.getElementById("collaborative").innerText = "No";
    }else{
        document.getElementById("collaborative").innerText = "Yes";
    }
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("cover").appendChild(profileImage);
        document.getElementById("imgUrl").innerText = profile.images[0].url;
    }
    document.getElementById("descriptions").innerText = profile.description;
    document.getElementById("followers").innerText = profile.followers.total;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("owner").innerText = profile.owner.display_name;

}

async function changePlaylist(playlist1){
    var iframe = document.getElementById("playlist");
    iframe.src = `https://open.spotify.com/embed/playlist/${playlist1}?utm_source=generator`;
}

async function displayPlaylist(profile){
    const trackListContainer = document.getElementById("track");
    for(let i = 0; i<50;i++){

        if ( profile.items[i]){
            console.log("i"+i);
            const trackElement = document.createElement("td");
            const numTrack = document.createElement("td");
            const element1 = document.createTextNode("\n"+(i+1) + " "); //le titre
            const trackName = profile.items[i].track.name;
            trackElement.innerText = trackName; //mise en texte 
            numTrack.innerText = element1.textContent;

            const flexContainer = document.createElement("tr");
            //flexContainer.style.display = "flex";
            flexContainer.appendChild(numTrack);
            flexContainer.appendChild(trackElement);

            trackListContainer.appendChild(flexContainer);
        }else{
            console.log("bye");
        }

    }
}





 