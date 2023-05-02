const accessToken = localStorage.getItem('accessToken');

async function fetchTop(token, type, time_range = 'long_term') {
    const result = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=10&offset=0`, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

async function populateIU() {
    const topArtists = await fetchTop(accessToken, 'artists');
    const topTracks = await fetchTop(accessToken, 'tracks');
    
    let artistsList = document.getElementById('topArtists');
    let tracksList = document.getElementById('topTracks');
    
    topArtists.items.forEach(artist => {
        let li = document.createElement('li');
        li.innerText = artist.name;
        artistsList.appendChild(li);
    });

    topTracks.items.forEach(track => {
        let li = document.createElement('li');
        li.innerText = track.name + " by " + track.artists.map(artist => artist.name).join(', ');
        tracksList.appendChild(li);
    });
}

populateIU();
