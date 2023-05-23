// Récupère le token d'accès depuis le stockage local du navigateur. 
const accessToken = localStorage.getItem('accessToken');

// Fetch the top 10 artists and tracks
refreshTopArtists();
refreshTopTracks();

// Add event listeners to the select elements
document.getElementById("artists-time-range").addEventListener('change', refreshTopArtists);
document.getElementById("tracks-time-range").addEventListener('change', refreshTopTracks);

async function refreshTopArtists() {
    const timeRange = document.getElementById("artists-time-range").value;
    const topArtists = await fetchTop(accessToken, 'artists', timeRange);
    populateUI(topArtists, 'topArtists');
}

async function refreshTopTracks() {
    const timeRange = document.getElementById("tracks-time-range").value;
    const topTracks = await fetchTop(accessToken, 'tracks', timeRange);
    populateUI(topTracks, 'topTracks');
}

// Fetch top items (artists or tracks) with a limit of 10
async function fetchTop(token, type, time_range = 'long_term') {
    const result = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=10&offset=0`, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

// Populate the UI with the top items (artists or tracks)
function populateUI(top, id) {
    const list = document.getElementById(id);
    list.innerHTML = ''; // Clear the list before populating it

    // Check if the top object has any items
    if (top.items.length > 0) {
        // Loop over each item and create a new list item for it
        top.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerText = item.name;
            list.appendChild(listItem);
        });
    } else {
        // If no items were found, display a message
        const listItem = document.createElement('li');
        listItem.innerText = `No top ${id} found`;
        list.appendChild(listItem);
    }
}