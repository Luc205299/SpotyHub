const accessToken = localStorage.getItem('accessToken');
// L'API Spotify est appelée pour obtenir le profil de l'utilisateur et ses artistes les plus écoutés.
//const profile = await fetchProfile(accessToken);
// Les données de profil et les artistes les plus écoutés sont ensuite affichés sur la page Web.
//populateUI(profile);
refreshTopArtists();




// La fonction fetchProfile envoie une requête GET à Spotify pour obtenir le profil de l'utilisateur.
async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    // Renvoyer le profil de l'utilisateur sous forme de JSON.
    return await result.json();
}


// La fonction populateUI met à jour l'interface utilisateur avec les informations du profil de l'utilisateur.
function populateUI(top, id0, id1) {
    const list = document.getElementById(id0);
    const uri = document.getElementById(id1);
    const playlistIframe = document.getElementById("spotifyPlaylist");

    list.innerHTML = ''; // Clear the list before populating it

    // Check if the top object has any items
    if (top.items.length > 0) {
        // Get the name of the first item
        const itemName = top.items[0].name;
        // Get the id of the top artist
        const itemUri = top.items[0].uri;

        list.innerText = itemName;
        uri.innerText = itemUri.split(":")[2];
        
        // Construct the Spotify playlist URL
        const playlistUrl = `https://open.spotify.com/embed/artist/${itemUri.split(":")[2]}?utm_source=generator`;
        playlistIframe.setAttribute("src", playlistUrl);
    } else {
        // If no items were found, display a message
        list.innerText = `No top ${id0} found`;
    }
}

async function refreshTopArtists() {
    const topArtists = await fetchTop(accessToken, 'artists', "short_term");
    populateUI(topArtists, 'topArtists', "UriTopArtist");
}
// Fetch top items (artists or tracks) with a limit of 10
async function fetchTop(token, type, time_range) {
    const result = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=10&offset=0`, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}