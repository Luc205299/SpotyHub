// Récupère le token d'accès depuis le stockage local du navigateur. 
// Le token d'accès est nécessaire pour effectuer des requêtes authentifiées à l'API Spotify.
const accessToken = localStorage.getItem('accessToken');

// Appelle la fonction fetchTop avec le token d'accès pour obtenir l'artiste le plus écouté par l'utilisateur.
// Notez que 'await' est utilisé pour attendre la résolution de la promesse renvoyée par fetchTop.
const top = await fetchTop(accessToken);

// Une fois que les données sont récupérées, la fonction populateIU est appelée pour afficher l'artiste le plus écouté sur la page Web.
populateIU(top);

// Les données récupérées sont également affichées dans la console du navigateur pour le débogage.
console.log(top);


// La fonction fetchTop est une fonction asynchrone qui envoie une requête GET à l'API Spotify pour obtenir l'artiste le plus écouté par l'utilisateur.
async function fetchTop(token) {
    // La requête est envoyée à l'endpoint 'me/top/artists' avec une limite de 1 (seul l'artiste le plus écouté est renvoyé).
    const result = await fetch("https://api.spotify.com/v1/me/top/artists?limit=1&offset=0", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
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
