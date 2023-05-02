// Récupère le token d'accès depuis le stockage local du navigateur. 
// Le token d'accès est nécessaire pour effectuer des requêtes authentifiées à l'API Spotify.
const clientId = "c19f863da99a4b12ae8a166ebba42181";
const params = new URLSearchParams(window.location.search);
const code = localStorage.getItem('code');

const setup = async () => {
    if (!code) {
        redirectToAuthCodeFlow(clientId);
    } else {
        const Token = localStorage.getItem('accessToken');
        console.log(Token);
        if (Token) {
            const top = await fetchTop(Token);
            console.log(top);
            populateIU(top);
        } else {
            // Handle case where 'accessToken' key is not set in local storage.
            console.error("Access token not found in local storage.");
        }
    }
};

setup();

// Appelle la fonction fetchTop avec le token d'accès pour obtenir l'artiste le plus écouté par l'utilisateur.
// Notez que 'await' est utilisé pour attendre la résolution de la promesse renvoyée par fetchTop.


// Une fois que les données sont récupérées, la fonction populateIU est appelée pour afficher l'artiste le plus écouté sur la page Web.


// Les données récupérées sont également affichées dans la console du navigateur pour le débogage.



// La fonction fetchTop est une fonction asynchrone qui envoie une requête GET à l'API Spotify pour obtenir l'artiste le plus écouté par l'utilisateur.
async function fetchTop(Token) {
    // La requête est envoyée à l'endpoint 'me/top/artists' avec une limite de 1 (seul l'artiste le plus écouté est renvoyé).
    const result = await fetch("https://api.spotify.com/v1/me/top/artists?limit=1&offset=0", {
        method: "GET", 
        headers: { 
            Authorization: `Bearer ${Token}` 
        }
    });

    // La réponse de l'API Spotify est convertie en JSON et renvoyée.
    return await result.json();
    
}




// La fonction populateIU met à jour le contenu de la page Web avec les données de l'artiste le plus écouté.
function populateIU(top) {
    // Vérifie si l'objet 'top' contient des éléments (des artistes dans ce cas).
    if (top.items.length > 0) {
        // Si oui, le nom du premier artiste (l'artiste le plus écouté) est affiché dans l'élément HTML avec l'id 'name'.
        document.getElementById("name").innerText = top.items[0].name;
    } else {
        // Si non, un message indiquant qu'aucun artiste n'a été trouvé est affiché.
        document.getElementById("name").innerText = "No top artist found";
    }
}

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