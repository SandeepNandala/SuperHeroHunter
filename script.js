

var searchInputEle=document.getElementById("search-hero-search");
var favouriteEle=document.getElementById('favourites');
var removeFavrouteEle=document.getElementById('remove');
var homeScreen=document.getElementById('home');
var findHeroEle=document.getElementById('find-hero');


var ts= Date.now();

var public_key='6eaf344d608cd6a64ae12f301e403823';
var private_key='30c982141433d2addba379ce978100fbead07e4d';

let HerosList="";
let HerosArray={};
function addToHome(data)
{
    let heroObj={};
    for(let i in data)
    {
        // heroObj['id']=data[i]['id'];
        let HeroId=data[i]['id'];
        heroObj['name']=data[i]['name'];
        heroObj['image']=data[i]['thumbnail']['path']+'.'+data[i]['thumbnail']['extension'];
        heroObj['favourite']=false;

        HerosArray[HeroId]=JSON.parse(JSON.stringify(heroObj));
        HerosList+=`<div class="col">
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

    document.getElementById('heros').innerHTML=HerosList;
}

async function hero()
{
    // var superhero = await fetch("https://gateway.marvel.com:443/v1/public/characters?ts=<time-stamp>&apikey=<public-key>&hash=<md5(ts+privateKey+publicKey)>");
    var hashing=CryptoJS.MD5(ts+private_key+public_key);
    
    let response = await fetch(`https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${public_key}&hash=${hashing}`);
    let data=await response.json();
    return data;
}
let ourHeros;
hero().then((data)=>{
    var count=0;
    for(let i in data)
    {
        count++;
        if(count==7)
        {
            addToHome(data[i]['results']);
            ourHeros=data[i]['results'];
        }
          
    }
       
}).catch((error)=>{
    console.log(error);
});

// ourHeros();

function addToFavourites(event)
{
    
    // console.log(HerosArray);
    event.preventDefault();
    console.log("addToFavourites",event.target.getAttribute('data-id'));
    if(event.target.getAttribute('data-id')!="" && event.target.id==='favourite')
    {
        let value=event.target.getAttribute('data-id')
        HerosArray[value]['favourite']=true;
        console.log(HerosArray[value]);
        localStorage.setItem(value,HerosArray[value]);
        alert("added to favourites click on the favourites tab to see")
        
    }
    event.stopPropagation();
   
}

function findHero(event)
{
    event.preventDefault();
    console.log("find-hero event.target.id",event.target.id);
    console.log("event.target.id==='find-hero' && event.target.getAttribute('data-id')!= ",event.target.id==='find-hero' && event.target.getAttribute('data-id')!="")
    if(event.target.id==='find-hero' && event.target.getAttribute('data-id')!=="" )
    {
        let value=event.target.getAttribute('data-id');
        console.log("find-hero",value);
        console.log("ourheros",ourHeros);
        for(let i in ourHeros)
        {
            let herosPage="";
            if(ourHeros[i]['id']==value)
            {
                let objHero={};
                objHero['name']=ourHeros[i]['name'];
                objHero['image']=ourHeros[i]['thumbnail']['path']+'.'+ourHeros[i]['thumbnail']['extension'];
                objHero['comics']=ourHeros[i]['comics']['items'];
                objHero['series']=ourHeros[i]['series']['items'];
                
                console.log('objhero',objHero)
                // console.log('find me',ourHeros[i]);
                herosPage=`
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
                  for(let i in objHero['comics'])
                  {
                    herosPage+=`
                    <li>${objHero['comics'][i]['name']}</li>`
                  }

                  herosPage+=` </ul><h3>Series</h3> <ul>`

                  for(let i in objHero['series'])
                  {
                    herosPage+=`
                    <li>${objHero['series'][i]['name']}</li>  
                   ` 
                  }

                 herosPage+=` </ul> </div>`
                
              document.getElementById('heros').innerHTML=herosPage;
            }

        }

    }
    event.stopPropagation();
  
}

function homeEle(event)
{
    let favouriteHeros="";
    for(let i in  HerosArray)
    {
    

        // if(HerosArray[i]['favourite']==true)
        favouriteHeros+=` <div class="col">
        <div data-id="${i}" class="card mt-3"  style="width: 18rem;">
            <img src=${HerosArray[i]['image']} id="hero-img" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 id="hero-name" class="card-title">${HerosArray[i]['name']}</h5>
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
    document.getElementById('heros').innerHTML=favouriteHeros;
}

function showFavourites(event)
{
    let favouriteHeros="";
    for(let i in  HerosArray)
    {
    

        // if(HerosArray[i]['favourite']==true)
        if(localStorage.getItem(i)!=null)
        {
        favouriteHeros+=` <div class="col">
        <div data-id="${i}" class="card mt-3"  style="width: 18rem;">
            <img src=${HerosArray[i]['image']} id="hero-img" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 id="hero-name" class="card-title">${HerosArray[i]['name']}</h5>
              <p id="hero-details" class="card-text">MARVEL Studios superhero character. Usually appears in Marvel Comics and movies</p>
              <a id="find-hero" data-id="${i}" href="" class="btn btn-primary">find me</a>
              <a id="remove" href="" data-id="${i}" class="btn btn-outline-danger">Remove</a>
              
            </div>
          </div>
        </div>`;
        }

    }
    event.stopPropagation();
    document.getElementById('heros').innerHTML=favouriteHeros;
}

function removeFavourites(event)
{
    event.preventDefault();
    console.log('event.target.id remove',event.target.id)
    if(event.target.getAttribute('data-id')!="" && event.target.id==='remove')
    {
        let value=event.target.getAttribute('data-id');
        HerosArray[value]['favourite']=false;
        localStorage.removeItem(value);
        let cardDiv=document.getElementsByClassName('card');
        console.log(cardDiv);
        for(let i=0;i<cardDiv.length;i++)
        {
            console.log(cardDiv[i].getAttribute('data-id'));
            if(cardDiv[i].getAttribute('data-id')==value)
            {
                cardDiv[i].innerHTML='';
                console.log('remove')
                break;
            }
        }
        // alert('removed from favourites please click on the favourites tab again to see the changes');
    }
    event.stopPropagation();
}

function searchHero(event)
{
    let favouriteHeros="";
    
    for(let i in  HerosArray)
    {
    
        let value=event.target.value;
        let name=HerosArray[i]['name'].toLowerCase();
        console.log('value',value,'name',name)
        if(name.includes(value.toLowerCase())){
        // if(HerosArray[i]['favourite']==true)
        favouriteHeros+=` <div class="col">
        <div data-id="${i}" class="card mt-3"  style="width: 18rem;">
            <img src=${HerosArray[i]['image']} id="hero-img" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 id="hero-name" class="card-title">${HerosArray[i]['name']}</h5>
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
    if(favouriteHeros!="")
     document.getElementById('heros').innerHTML=favouriteHeros;
    else
     document.getElementById('heros').innerHTML=`<h1 class="bg-light">No Results found</h1>`
}

document.addEventListener('click',addToFavourites);

favouriteEle.addEventListener('click',showFavourites);

document.addEventListener('click',removeFavourites);

homeScreen.addEventListener('click',homeEle);

document.addEventListener('click',findHero);

searchInputEle.addEventListener('keyup',searchHero);









