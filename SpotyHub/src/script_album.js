const clientId = "c19f863da99a4b12ae8a166ebba42181";
const params = new URLSearchParams(window.location.search);
const code = localStorage.getItem('code');

const setup = async () => {
    if (!code) {
        redirectToAuthCodeFlow(clientId);
    } else {
        const accessToken = localStorage.getItem('accessToken');
        const profile = await fetchProfile(accessToken);
    
        populateUI(profile);
    }
};

setup();

async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/pageAuth.html");
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/pageAuth.html");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", 
        headers: { 
            Authorization: `Bearer ${token}` 
        }
    });

    return await result.json();
}

function populateUI(profile) {
    document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar").appendChild(profileImage);
    }
    document.getElementById("id").innerText = profile.id;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function AfficherText() {
    var text = document.getElementById("idAlbum").value;
    console.log('le texte est : ' + text);
}

async function fetchPlaylist() {
    const accessToken = localStorage.getItem('accessToken');
    var id_playlist = document.getElementById("idAlbum").value;
    const result = await fetch(`https://api.spotify.com/v1/playlists/${id_playlist}`, {
        method: "GET", 
        headers: { 
            Authorization: `Bearer ${accessToken}` 
        }
    });
    const jsonResult = await result.json();
    console.log(jsonResult);
    //window.open(jsonResult);
    populatePlaylist(jsonResult);

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

