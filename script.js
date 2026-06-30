// ======================
// LIVE PRICE
// ======================

const prices = {

  botol_plastik:0.10,
  kadbod:0.15,
  tin_aluminium:0.10,
  tembaga:2.50,
  besi:0.30,
  surat_khabar:0.15,
  majalah:0.12,
  botol_kaca:0.25,
  minyak_masak:2.00,
  pvc:0.20,

  telefon_lama:5.00,
  laptop_lama:8.00,
  tv_lama:4.00,
  bateri_kereta:9.50,
  aircond:6.00,
  mesin_basuh:5.50,
  peti_ais:7.00,
  tayar:3.00,
  cpu_lengkap:5,
  wayar:1

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
    alert("Browser tidak support location");
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

   // REAL RECYCLE QUERY 10KM

let query = `

[out:json];

(

node["amenity"="recycling"](around:30000,${lat},${lon});

way["amenity"="recycling"](around:30000,${lat},${lon});

relation["amenity"="recycling"](around:30000,${lat},${lon});

node["amenity"="waste_transfer_station"](around:30000,${lat},${lon});

way["amenity"="waste_transfer_station"](around:30000,${lat},${lon});

node["shop"="scrap_yard"](around:30000,${lat},${lon});

way["shop"="scrap_yard"](around:30000,${lat},${lon});

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
