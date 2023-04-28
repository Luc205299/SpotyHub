let myImage = document.querySelector('#toto');

myImage.addEventListener('click', function() {
    let mySrc = myImage.getAttribute('src');
    if (mySrc === 'image/images.jpg') {
      myImage.setAttribute('src', 'image/mm.jpg');
    } else {
      myImage.setAttribute('src', 'image/images.jpg');
    }
});

let myButton = document.querySelector('#ouyi');
let myHeading = document.querySelector('#jojo');
myButton.addEventListener('click', function() {
setUserName();
});





function setUserName() {
    let myName = prompt('Veuillez saisir votre nom.');
    localStorage.setItem('nom', myName);
    myHeading.textContent = 'Bienvenue ' + myName;
  }

function pageAuth(){
    window.open('pageAuth.html')
}