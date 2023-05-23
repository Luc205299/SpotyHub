// Select the button
const createPlaylistButton = document.getElementById("create-playlist-button");
// Retrieve the access token from local storage
const accessToken = localStorage.getItem('accessToken');
// Call async function to get the user's top 10 tracks
const tokenList = localStorage.getItem('tokenList');
const tokens = tokenList.split(",")
tokens.push(accessToken);
let tracksList = [];


for (let i = 0; i < tokens.length; i++) {
  const element = tokens[i];
  const track = await fetchTrack(element);
  populateUI(track);
}



createPlaylistButton.addEventListener("click", async function() {
    const userId = await fetchUserId(accessToken);
    const playlistId = await createPlaylist(userId, accessToken);
    await addTracksToPlaylist(playlistId, tracks.items, accessToken);
    const successMessage = document.getElementById("success-message");
    successMessage.style.display = "block";
});

async function fetchTrack(token) {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10&offset=0", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

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

async function createPlaylist(userId, token) {
    const result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: "My Top 10 Tracks by SpotyHub",
            description: "Playlist created by SpotiyHub",
            public: true
        })
    });
    const data = await result.json();
    return data.id;
}

async function addTracksToPlaylist(playlistId, tracks, token) {
    const trackUris = tracks.map(track => track.uri);
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
