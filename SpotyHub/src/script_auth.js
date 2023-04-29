// Définir l'ID du client pour l'application Spotify
const clientId = "d8d7799d31d84752873ad62f05a31226";

// Extraire le paramètre "code" de l'URL. Il s'agit du code d'autorisation fourni par Spotify pour obtenir un access_token.
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

// Si le code n'est pas présent, cela signifie que l'utilisateur n'a pas encore été redirigé vers la page d'autorisation de Spotify.
// Dans ce cas, l'utilisateur est redirigé vers la page d'autorisation.
if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    // Si le code est présent, cela signifie que l'utilisateur a été redirigé depuis la page d'autorisation de Spotify.
    // L'access_token est alors récupéré en utilisant le code d'autorisation.
    const accessToken = await getAccessToken(clientId, code);
    // L'access_token est ensuite stocké dans le local storage pour une utilisation ultérieure.
    localStorage.setItem('accessToken', accessToken);
    // L'API Spotify est appelée pour obtenir le profil de l'utilisateur et ses artistes les plus écoutés.
    const profile = await fetchProfile(accessToken);
    const top = await fetchTop(accessToken);
    // Les données récupérées sont affichées dans la console pour le débogage.
    console.log(profile);
    console.log(top);
    // Les données de profil et les artistes les plus écoutés sont ensuite affichés sur la page Web.
    populateUI(profile);
    populateIU(top);
}

// La fonction redirectToAuthCodeFlow redirige l'utilisateur vers la page d'autorisation de Spotify.
// Elle génère également un code de vérification pour la méthode PKCE (Proof Key for Code Exchange) utilisée dans le flux d'autorisation.
async function redirectToAuthCodeFlow(clientId) {
    // Générer un code de vérification aléatoire.
    const verifier = generateCodeVerifier(128);
    // Générer un code challenge à partir du code de vérification.
    const challenge = await generateCodeChallenge(verifier);
    // Stocker le code de vérification dans le local storage pour une utilisation ultérieure.
    localStorage.setItem("verifier", verifier);

    // Créer les paramètres à envoyer dans l'URL de la page d'autorisation.
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/pageAuth.html");
    params.append("scope", "user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    // Rediriger l'utilisateur vers la page d'autorisation avec les paramètres appropriés.
    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// La fonction getAccessToken envoie une requête POST à Spotify pour obtenir un access_token en utilisant le code d'autorisation et le code de vérification.
async function getAccessToken(clientId, code) {
    // Récupérer le code de vérification du local storage.
    const verifier = localStorage.getItem("verifier");

    // Créer les paramètres à envoyer dans le corps de la requête POST.
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/pageAuth.html");
    params.append("code_verifier", verifier);

    // Envoyer la requête POST à Spotify pour obtenir l'access_token.
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    // Extraire l'access_token de la réponse.
    const { access_token } = await result.json();
    return access_token;
}

// La fonction fetchProfile envoie une requête GET à Spotify pour obtenir le profil de l'utilisateur.
async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    // Renvoyer le profil de l'utilisateur sous forme de JSON.
    return await result.json();
}

// La fonction fetchTop envoie une requête GET à Spotify pour obtenir les artistes les plus écoutés de l'utilisateur.
async function fetchTop(token) {
    const result = await fetch("https://api.spotify.com/v1/me/top/artists?limit=1&offset=0", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    // Renvoyer les artistes les plus écoutés sous forme de JSON.
    return await result.json();
}

// La fonction populateUI met à jour l'interface utilisateur avec les informations du profil de l'utilisateur.
function populateUI(profile) {
    // Mettre à jour les éléments HTML avec les informations du profil de l'utilisateur.
    // Les informations affichées incluent le nom d'affichage de l'utilisateur, l'image de profil, l'ID de l'utilisateur, le pays, l'e-mail, l'URI Spotify de l'utilisateur et l'URL de l'utilisateur.
    document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar").appendChild(profileImage);
        document.getElementById("imgUrl").innerText = profile.images[0].url;
    }
    document.getElementById("id").innerText = profile.id;
    document.getElementById("country").innerText = profile.country;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").innerText = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);
}

// La fonction populateIU met à jour l'interface utilisateur avec les artistes les plus écoutés de l'utilisateur.
function populateIU(top) {
    // Si l'utilisateur a des artistes les plus écoutés, le nom du premier artiste est affiché.
    // Sinon, un message indiquant qu'aucun artiste n'a été trouvé est affiché.
    if (top.items.length > 0) {
        document.getElementById("name").innerText = top.items[0].name;
    } else {
        document.getElementById("name").innerText = "No top artist found";
    }
}

// La fonction generateCodeVerifier génère un code de vérification aléatoire de la longueur spécifiée. 
// Ce code de vérification est utilisé pour la méthode PKCE (Proof Key for Code Exchange) dans le flux d'autorisation OAuth.
function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// La fonction generateCodeChallenge génère un code challenge à partir du code de vérification. 
// Le code challenge est une version hachée et codée en base64 du code de vérification, utilisée pour la méthode PKCE.
async function generateCodeChallenge(codeVerifier) {
    // Encodage du code de vérification en utilisant un TextEncoder.
    const data = new TextEncoder().encode(codeVerifier);
    // Hashage du code de vérification encodé en utilisant SHA-256.
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    // Conversion du hash en base64, avec remplacement de certains caractères pour le rendre URL-safe.
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}


