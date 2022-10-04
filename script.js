//accessing the dom elements
var searchInputEle = document.getElementById("super-hero-search");
var favouriteEle = document.getElementById('favourites');
var homeScreen = document.getElementById('home');
var serchSubEle = document.getElementById('search-complete');

//current time stamp 
var ts = Date.now();

//api public and private keys
var public_key = '6eaf344d608cd6a64ae12f301e403823';
var private_key = '30c982141433d2addba379ce978100fbead07e4d';


let HerosListEle = "";//to add the Html content to dom
let HerosObjList = {};//to store all the heros objects

//in this function we are adding the all heros to super heros home page
function addToHome(data) {
    let heroObj = {};

    //iterating through all the objects in API data and adding it to DOM
    for (let i in data) {
        let HeroId = data[i]['id'];
        heroObj['name'] = data[i]['name'];
        heroObj['image'] = data[i]['thumbnail']['path'] + '.' + data[i]['thumbnail']['extension'];
        heroObj['favourite'] = false;

        //adding all the objects to HerosObjList with their id as the property to use furthur 
        HerosObjList[HeroId] = JSON.parse(JSON.stringify(heroObj));

        //appending the heros divs to HerosListEle so we can add it to DOM.
        HerosListEle += `<div class="col">
        <div class="card mt-3"  style="width: 18rem;">
            <img src=${heroObj['image']} id="hero-img" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 id="hero-name" class="card-title">${heroObj['name']}</h5>
              <p id="hero-details" class="card-text">MARVEL Studios superhero character. Usually appears in Marvel Comics and movies</p>
              <span>
              <a id="find-hero" data-id="${HeroId}" href="" class="btn btn-primary">Find Me</a>
              </span>
              <span>
              <a id="favourite" href="" data-id="${HeroId}" class="btn btn-outline-danger">Favourite</a>
              </span>
            </div>
          </div>
        </div>`;
    }

    //appending the heros to main super heros page DOM
    document.getElementById('heros').innerHTML = HerosListEle;
}


//we are using this hero function/promise to fetch the api data from the  https://developer.marvel.com/docs 
async function hero() {
    var hashing = CryptoJS.MD5(ts + private_key + public_key);//using MD5 hasing algoritm
    let response = await fetch(`https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${public_key}&hash=${hashing}`);
    let data = await response.json();
    return data;
}
let ourHeros;

hero().then((data) => {//if the promise fullfilled/resolved
    var count = 0;
    for (let i in data) {
        count++;
        if (count == 7) {
            //using the 7 th count because the the actual api data resides in the results property
            addToHome(data[i]['results']);
            ourHeros = data[i]['results'];
        }
    }
}).catch((error) => {//if the promise rejected
    console.log(error);
});

//to add the hero to our favourites superhero list
function addToFavourites(event) {
    event.preventDefault();
    if (event.target.getAttribute('data-id') != "" && event.target.id === 'favourite') {
        let value = event.target.getAttribute('data-id')
        //setting the favourite superhero flag to true
        HerosObjList[value]['favourite'] = true;
        //storing the hero in local storage so if we close the page and opens again in browser
        //still we can see our favourite hero until unless you removed from favourite list 
        localStorage.setItem(value, HerosObjList[value]);
        alert("added to favourites click on the favourites tab to see")
    }
    event.stopPropagation();
}


//this fuction will show the details of the specific super hero which user requested.
function findHero(event) {
    event.preventDefault();
    if (event.target.id === 'find-hero' && event.target.getAttribute('data-id') !== "") {
        let value = event.target.getAttribute('data-id');
        for (let i in ourHeros) {
            let herosPage = "";
            if (ourHeros[i]['id'] == value) {
                let objHero = {};
                objHero['name'] = ourHeros[i]['name'];
                objHero['image'] = ourHeros[i]['thumbnail']['path'] + '.' + ourHeros[i]['thumbnail']['extension'];
                objHero['comics'] = ourHeros[i]['comics']['items'];
                objHero['series'] = ourHeros[i]['series']['items'];

                herosPage = `
                <div  class="col-md-6 mb-md-0 p-md-4">
                  <img id="hero-img-page" src="${objHero['image']}" class="w-100" alt="...">
                </div>
                <div id="super-hero-details" class="col-md-6 p-4 ps-md-0 g-0 bg-light position-relative">
                  <h1 class="mt-0">${objHero['name']}</h1>
                  <p>MARVEL Studios superhero character. Usually appears in Marvel Comics and movies</p>
                </div>
                <div class="bg-light">
                  <h3>Comics</h3>
                  <ul>
                  `
                //adding the comics to the super hero
                for (let i in objHero['comics']) {
                    herosPage += `
                    <li>${objHero['comics'][i]['name']}</li>`
                }
                // adding series of the super hero
                herosPage += ` </ul><h3>Series</h3> <ul>`
                for (let i in objHero['series']) {
                    herosPage += `
                    <li>${objHero['series'][i]['name']}</li>  
                   `
                }
                herosPage += ` </ul> </div>`
                //appending to the super hero page DOM 
                document.getElementById('heros').innerHTML = herosPage;
            }
        }
    }
    event.stopPropagation();

}


//if user clicks on the home button this function will shows the list of all super heros.
function homeEle(event) {
    let Heros = "";
    for (let i in HerosObjList) {
        Heros += ` <div class="col">
        <div data-id="${i}" class="card mt-3"  style="width: 18rem;">
            <img src=${HerosObjList[i]['image']} id="hero-img" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 id="hero-name" class="card-title">${HerosObjList[i]['name']}</h5>
              <p id="hero-details" class="card-text">MARVEL Studios superhero character. Usually appears in Marvel Comics and movies</p>
              <span>
              <a id="find-hero" data-id="${i}" href="" class="btn btn-primary">Find Me</a>
              </span>
              <span>
              <a id="favourite" href="" data-id="${i}" class="btn btn-outline-danger">Favourite</a>
              </span>
              </div>
          </div>
        </div>`;
    }
    event.stopPropagation();
    document.getElementById('heros').innerHTML = Heros;
}


//this function will shows the our favourite super heros page
function showFavourites(event) {
    let favouriteHeros = "";
    for (let i in HerosObjList) {
        //if the superhero id exists in local storage that means we added that super hero to our favourites
        if (localStorage.getItem(i) != null) {
            favouriteHeros += ` <div class="col">
        <div data-id="${i}" class="card mt-3"  style="width: 18rem;">
            <img src=${HerosObjList[i]['image']} id="hero-img" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 id="hero-name" class="card-title">${HerosObjList[i]['name']}</h5>
              <p id="hero-details" class="card-text">MARVEL Studios superhero character. Usually appears in Marvel Comics and movies</p>
              <a id="find-hero" data-id="${i}" href="" class="btn btn-primary">find me</a>
              <a id="remove" href="" data-id="${i}" class="btn btn-outline-danger">Remove</a>
            </div>
          </div>
        </div>`;
        }
    }
    event.stopPropagation();
    //append the favourite superhero list to favourites DOM 
    document.getElementById('heros').innerHTML = favouriteHeros;
}

//this function will the super hero which is requested by the user from the favourites 
function removeFavourites(event) {
    event.preventDefault();
    if (event.target.getAttribute('data-id') != "" && event.target.id === 'remove') {
        let value = event.target.getAttribute('data-id');
        //resetting the flag to false to remove from favourites 
        HerosObjList[value]['favourite'] = false;
        //deleting the super hero id from local storage we will not get the hero in favourites page again
        localStorage.removeItem(value);
        let cardDiv = document.getElementsByClassName('card');
        for (let i = 0; i < cardDiv.length; i++) {
            //once the hero removed from favourites then that hero should be removed from screen also 
            if (cardDiv[i].getAttribute('data-id') == value) {
                cardDiv[i].innerHTML = '';
                break;
            }
        }
    }
    event.stopPropagation();
}


//this function will filter the super heros upon user search.
function searchHero(event) {
    let favouriteHeros = "";
    for (let i in HerosObjList) {
        let value = event.target.value;
        let name = HerosObjList[i]['name'].toLowerCase();
       //if there are any super heros with the searched name then it will reflect on page
        if (name.includes(value.toLowerCase())) {
            favouriteHeros += ` <div class="col">
        <div data-id="${i}" class="card mt-3"  style="width: 18rem;">
            <img src=${HerosObjList[i]['image']} id="hero-img" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 id="hero-name" class="card-title">${HerosObjList[i]['name']}</h5>
              <p id="hero-details" class="card-text">MARVEL Studios superhero character. Usually appears in Marvel Comics and movies</p>
              <span>
              <a id="find-hero" data-id="${i}" href="" class="btn btn-primary">Find Me</a>
              </span>
              <span>
              <a id="favourite" href="" data-id="${i}" class="btn btn-outline-danger">Favourite</a>
              </span>
              </div>
          </div>
        </div>`;
        }
    }
    event.stopPropagation();
    if (favouriteHeros != "")
        document.getElementById('heros').innerHTML = favouriteHeros;
    else//if there no super heros with that name then it will show no results found
        document.getElementById('heros').innerHTML = `<h1 class="bg-light">No Results found!!</h1>`
}

//to add the super hero to our favourites
document.addEventListener('click', addToFavourites);
//to show us the our favourite super heros 
favouriteEle.addEventListener('click', showFavourites);
//to remove the super hero from our favouries.
document.addEventListener('click', removeFavourites);
//to show us the home screen 
homeScreen.addEventListener('click', homeEle);
//to show us the details about the super hero
document.addEventListener('click', findHero);
//to filter the heros with search name.
searchInputEle.addEventListener('keyup', searchHero);
//to complete the search
serchSubEle.addEventListener('click', () => {
    searchInputEle.value = "";
})









