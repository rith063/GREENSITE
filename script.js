// ======================
// LIVE PRICE
// ======================

const prices = {

  botol_plastik:0.40,
  kadbod:0.25,
  tin_aluminium:2.30,
  tembaga:25.00,
  besi:0.50,
  surat_khabar:0.35,
  majalah:0.12,
  botol_kaca:0.25,
  minyak_masak:2.70,
  pvc:0.50,

  telefon_lama:5.00,
  laptop_lama:2.50,
  tv_lama:3.00,
  bateri_kereta:0.50,
  aircond:5.00,
  mesin_basuh:7.00,
  peti_ais:7.00,
  tayar:3.00,
  cpu_lengkap:5.00,
  wayar:1.00

};

// AUTO DROPDOWN

let select =
document.getElementById("material");

Object.keys(prices).forEach(item=>{

  let option =
  document.createElement("option");

  option.value = item;
  option.text =
  item.replaceAll("_"," ").toUpperCase();

  select.appendChild(option);

});

// LIVE TREND

function updateLivePrices(){

  Object.keys(prices).forEach(item=>{

    let change =
    (Math.random() * 0.10 - 0.05);

    prices[item] += change;

    if(prices[item] < 0.01){
      prices[item] = 0.01;
    }

    let priceElement =
    document.getElementById(
      item + "Price"
    );

    let trendElement =
    document.getElementById(
      item + "Trend"
    );

    if(priceElement){

      let type =
      ["telefon_lama","laptop_lama","tv_lama","bateri_kereta","aircond","mesin_basuh","peti_ais","tayar","cpu_lengkap","wayar"]
      .includes(item)
      ? "/unit"
      : "/kg";

      priceElement.innerText =
      "RM" +
      prices[item].toFixed(2) +
      type;

      if(change > 0){

        trendElement.innerHTML =
        "📈 Naik";

        trendElement.className =
        "up";

      }else if(change < 0){

        trendElement.innerHTML =
        "📉 Turun";

        trendElement.className =
        "down";

      }else{

        trendElement.innerHTML =
        "➖ Stabil";

        trendElement.className =
        "stable";

      }

    }

  });

}

// update every 1 day
setInterval(updateLivePrices,86400000);

// ======================
// CALCULATOR
// ======================

function calculate(){

  let item =
  document.getElementById(
    "material"
  ).value;

  let qty =
  document.getElementById(
    "qty"
  ).value;

  let total =
  prices[item] * qty;

  document.getElementById(
    "result"
  ).innerText =
  "💰 RM " +
  total.toFixed(2);

  if(total >= 50){

    document.getElementById(
      "motivation"
    ).innerText =
    "🔥 Hebat! Anda bantu bumi!";

  }else if(total >= 20){

    document.getElementById(
      "motivation"
    ).innerText =
    "🌱 Bagus! Teruskan recycle!";

  }else{

    document.getElementById(
      "motivation"
    ).innerText =
    "♻️ Setiap usaha bermakna!";
  }

}

// ======================
// MAP REAL LOCATION
// ======================

function findLocation(){

  if(!navigator.geolocation){
    alert("Browser tak support location");
    return;
  }

  navigator.geolocation.getCurrentPosition(function(pos){

    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;

    document.getElementById("map").innerHTML = "";

    let map = L.map('map').setView([lat,lon],15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // USER MARKER
    L.marker([lat,lon])
      .addTo(map)
      .bindPopup("📍 Lokasi anda")
      .openPopup();

    // REAL RECYCLE QUERY

    let query = `
      [out:json];
      (
        node["amenity"="recycling"](around:20000,${lat},${lon});
        way["amenity"="recycling"](around:20000,${lat},${lon});
        relation["amenity"="recycling"](around:20000,${lat},${lon});
      );
      out center;
    `;

    let url =
    "https://overpass-api.de/api/interpreter?data=" +
    encodeURIComponent(query);

    fetch(url)
    .then(res => res.json())
    .then(data => {

      let elements = data.elements;

      if(!elements.length){
        alert("Tiada pusat recycle dijumpai");
        return;
      }

      elements.forEach(place => {

        let pLat =
        place.lat || place.center?.lat;

        let pLon =
        place.lon || place.center?.lon;

        let name =
        place.tags?.name ||
        "♻️ Recycling Center";

        let marker =
        L.marker([pLat,pLon]).addTo(map);

        marker.bindPopup(`
          <b>${name}</b><br>
          Klik untuk navigate
        `);

        marker.on("click", function(){

          window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${pLat},${pLon}`,
            "_blank"
          );

        });

      });

    });

  });

}


// =====================
// RECYCLE CHALLENGE
// =====================

function joinChallenge(){

  document.getElementById(
    "challengeText"
  ).innerText =
  "🔥 Hebat! Anda telah menyertai cabaran recycle minggu ini!";

}
