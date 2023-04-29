const accessToken = localStorage.getItem('accessToken');
const top = await fetchTop(accessToken);
populateIU(top);


async function fetchTop(token) {
    const result = await fetch("https://api.spotify.com/v1/me/top/artists?limit=1&offset=0", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}


function populateIU(top) {
    if (top.items.length > 0) {
        document.getElementById("name").innerText = top.items[0].name;
    } else {
        document.getElementById("name").innerText = "No top artist found";
    }
}