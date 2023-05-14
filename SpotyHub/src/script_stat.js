const accessToken = localStorage.getItem('accessToken');
console.log(accessToken);
// L'API Spotify est appelée pour obtenir le profil de l'utilisateur et ses artistes les plus écoutés.
const profile = await fetchProfile(accessToken);
// Les données de profil et les artistes les plus écoutés sont ensuite affichés sur la page Web.
populateUI(profile);




// La fonction fetchProfile envoie une requête GET à Spotify pour obtenir le profil de l'utilisateur.
async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    // Renvoyer le profil de l'utilisateur sous forme de JSON.
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

