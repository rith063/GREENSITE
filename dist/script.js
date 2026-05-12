/* ====================== */
/* LIVE PRICE SECTION */
/* ====================== */

const prices = {
  // Stores all recycle item prices

  botol_plastik:0.10, // Plastic bottle price per kg
  kadbod:0.15, // Cardboard price per kg
  tin_aluminium:0.10, // Aluminium can price per kg
  tembaga:2.50, // Copper price per kg
  besi:0.30, // Iron price per kg
  surat_khabar:0.15, // Newspaper price per kg
  majalah:0.12, // Magazine price per kg
  botol_kaca:0.25, // Glass bottle price per kg
  minyak_masak:2.00, // Cooking oil price per kg
  pvc:0.20, // PVC plastic price per kg

  telefon_lama:5.00, // Old phone price per unit
  laptop_lama:8.00, // Old laptop price per unit
  tv_lama:4.00, // Old TV price per unit
  bateri_kereta:9.50, // Car battery price per unit
  aircond:6.00, // Air conditioner price per unit
  mesin_basuh:5.50, // Washing machine price per unit
  peti_ais:7.00, // Refrigerator price per unit
  tayar:3.00 // Tire price per unit
};

/* ====================== */
/* AUTO DROPDOWN */
/* ====================== */

let select =
document.getElementById("material");
/* Gets dropdown element from HTML */

Object.keys(prices).forEach(item=>{
/* Loops through all items inside prices object */

  let option =
  document.createElement("option");
  /* Creates dropdown option */

  option.value = item;
  /* Sets option value */

  option.text =
  item.replaceAll("_"," ").toUpperCase();
  /* Replaces underscores with spaces
     and converts text to uppercase */

  select.appendChild(option);
  /* Adds option into dropdown */

});

/* ====================== */
/* LIVE TREND */
/* ====================== */

function updateLivePrices(){
/* Function to update recycle prices automatically */

  Object.keys(prices).forEach(item=>{
  /* Loops through every recycle item */

    let change =
    (Math.random() * 0.10 - 0.05);
    /* Generates random price change
       between -0.05 and +0.05 */

    prices[item] += change;
    /* Adds change to current price */

    if(prices[item] < 0.01){
      prices[item] = 0.01;
    }
    /* Prevents price from going below RM0.01 */

    let priceElement =
    document.getElementById(
      item + "Price"
    );
    /* Finds HTML element for item price */

    let trendElement =
    document.getElementById(
      item + "Trend"
    );
    /* Finds HTML element for item trend */

    if(priceElement){

      let type =
      ["telefon_lama","laptop_lama","tv_lama","bateri_kereta","aircond","mesin_basuh","peti_ais","tayar"]
      .includes(item)
      ? "/unit"
      : "/kg";
      /* Decides whether item uses unit or kg */

      priceElement.innerText =
      "RM" +
      prices[item].toFixed(2) +
      type;
      /* Updates displayed price */

      if(change > 0){
      /* If price increased */

        trendElement.innerHTML =
        "📈 Naik";
        /* Shows increasing trend */

        trendElement.className =
        "up";
        /* Adds green color class */

      }else if(change < 0){
      /* If price decreased */

        trendElement.innerHTML =
        "📉 Turun";
        /* Shows decreasing trend */

        trendElement.className =
        "down";
        /* Adds red color class */

      }else{
      /* If no change */

        trendElement.innerHTML =
        "➖ Stabil";
        /* Shows stable trend */

        trendElement.className =
        "stable";
        /* Adds orange color class */

      }

    }

  });

}

/* Runs updateLivePrices every 5 seconds */
setInterval(updateLivePrices,5000);

/* ====================== */
/* CALCULATOR */
/* ====================== */

function calculate(){
/* Function for recycle calculator */

  let item =
  document.getElementById(
    "material"
  ).value;
  /* Gets selected recycle item */

  let qty =
  document.getElementById(
    "qty"
  ).value;
  /* Gets quantity entered by user */

  let total =
  prices[item] * qty;
  /* Calculates total recycle value */

  document.getElementById(
    "result"
  ).innerText =
  "💰 RM " +
  total.toFixed(2);
  /* Displays total money earned */

  if(total >= 50){
  /* If total is RM50 or higher */

    document.getElementById(
      "motivation"
    ).innerText =
    "🔥 Hebat! Anda bantu bumi!";
    /* Motivational message */

  }else if(total >= 20){
  /* If total is RM20 or higher */

    document.getElementById(
      "motivation"
    ).innerText =
    "🌱 Bagus! Teruskan recycle!";

  }else{
  /* If total below RM20 */

    document.getElementById(
      "motivation"
    ).innerText =
    "♻️ Setiap usaha bermakna!";
  }

}

/* ====================== */
/* MAP REAL LOCATION */
/* ====================== */

function findLocation(){
/* Finds user location */

  if(!navigator.geolocation){
    /* Checks if browser supports location */

    alert("Browser tak support location");
    return;
  }

  navigator.geolocation.getCurrentPosition(function(pos){
  /* Gets current user position */

    let lat = pos.coords.latitude;
    /* Stores latitude */

    let lon = pos.coords.longitude;
    /* Stores longitude */

    document.getElementById("map").innerHTML = "";
    /* Clears old map */

    let map = L.map('map').setView([lat,lon],15);
    /* Creates Leaflet map */

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    /* Adds OpenStreetMap tiles */

    /* USER MARKER */
    L.marker([lat,lon])
      .addTo(map)
      .bindPopup("📍 Lokasi anda")
      .openPopup();
    /* Places marker on user location */

    /* RECYCLE CENTER SEARCH QUERY */

    let query = `
      [out:json];
      (
        node["amenity"="recycling"](around:20000,${lat},${lon});
        way["amenity"="recycling"](around:20000,${lat},${lon});
        relation["amenity"="recycling"](around:20000,${lat},${lon});
      );
      out center;
    `;
    /* Searches recycling centers
       within 20km radius */

    let url =
    "https://overpass-api.de/api/interpreter?data=" +
    encodeURIComponent(query);
    /* Creates API URL */

    fetch(url)
    /* Sends request to Overpass API */

    .then(res => res.json())
    /* Converts response into JSON */

    .then(data => {

      let elements = data.elements;
      /* Stores recycle center data */

      if(!elements.length){
        /* If no recycling center found */

        alert("Tiada pusat recycle dijumpai");
        return;
      }

      elements.forEach(place => {
      /* Loops through recycle centers */

        let pLat =
        place.lat || place.center?.lat;
        /* Gets recycle center latitude */

        let pLon =
        place.lon || place.center?.lon;
        /* Gets recycle center longitude */

        let name =
        place.tags?.name ||
        "♻️ Recycling Center";
        /* Gets recycle center name */

        let marker =
        L.marker([pLat,pLon]).addTo(map);
        /* Adds marker to map */

        marker.bindPopup(`
          <b>${name}</b><br>
          Klik untuk navigate
        `);
        /* Popup text */

        marker.on("click", function(){
        /* Opens Google Maps navigation */

          window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${pLat},${pLon}`,
            "_blank"
          );

        });

      });

    });

  });

}

/* ===================== */
/* RECYCLE CHALLENGE */
/* ===================== */

function joinChallenge(){
/* Runs when user joins challenge */

  document.getElementById(
    "challengeText"
  ).innerText =
  "🔥 Hebat! Anda telah menyertai cabaran recycle minggu ini!";
  /* Displays success message */

}