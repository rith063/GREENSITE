// ==========================================
// 1. DATA HARGA & UNIT BARANGAN
// ==========================================
const itemsData = {
  botol_plastik: { price: 0.40, unit: "kg" },
  kadbod: { price: 0.25, unit: "kg" },
  tin_aluminium: { price: 2.30, unit: "kg" },
  tembaga: { price: 25.00, unit: "kg" },
  besi: { price: 0.50, unit: "kg" },
  surat_khabar: { price: 0.35, unit: "kg" },
  majalah: { price: 0.12, unit: "kg" },
  botol_kaca: { price: 0.25, unit: "kg" },
  minyak_masak: { price: 2.70, unit: "kg" },
  pvc: { price: 0.50, unit: "kg" },
  telefon_lama: { price: 5.00, unit: "unit" },
  laptop_lama: { price: 2.50, unit: "unit" },
  tv_lama: { price: 3.00, unit: "unit" },
  bateri_kereta: { price: 0.50, unit: "kg" },
  aircond: { price: 5.00, unit: "unit" },
  mesin_basuh: { price: 7.00, unit: "unit" },
  peti_ais: { price: 7.00, unit: "unit" },
  tayar: { price: 3.00, unit: "unit" },
  cpu_lengkap: { price: 5.00, unit: "unit" },
  wayar: { price: 1.00, unit: "kg" }
};

// AUTO DROPDOWN GENERATOR
let selectMenu = document.getElementById("material");
let qtyInput = document.getElementById("qty");

Object.keys(itemsData).forEach(item => {
  let option = document.createElement("option");
  option.value = item;
  option.text = item.replaceAll("_", " ").toUpperCase();
  selectMenu.appendChild(option);
});

// Set placeholder permulaan mengikut item pertama (BOTOL PLASTIK - kg)
qtyInput.placeholder = `Masukkan kuantiti dalam (kg)`;

// Tukar placeholder input secara automatik (kg atau unit) mengikut barang dipilih
selectMenu.addEventListener("change", function() {
  let selectedItem = selectMenu.value;
  let unitType = itemsData[selectedItem].unit;
  qtyInput.placeholder = `Masukkan kuantiti dalam (${unitType})`;
});


// ==========================================
// 2. FUNGSI KALKULATOR KIRA HARGA
// ==========================================
function calculate() {
  let item = document.getElementById("material").value;
  let qty = document.getElementById("qty").value;

  if (!qty || qty <= 0) {
    document.getElementById("result").innerText = "⚠️ Masukkan kuantiti yang sah!";
    document.getElementById("motivation").innerText = "";
    return;
  }

  let total = itemsData[item].price * qty;
  document.getElementById("result").innerText = "💰 RM " + total.toFixed(2);

  if (total >= 50) {
    document.getElementById("motivation").innerText = "🔥 Hebat! Anda wira alam sekitar!";
  } else if (total >= 20) {
    document.getElementById("motivation").innerText = "🌱 Bagus! Teruskan kitar semula!";
  } else {
    document.getElementById("motivation").innerText = "♻️ Setiap usaha kecil memberikan impak besar!";
  }
}


// ==========================================
// 3. FUNGSI PETA & REAL LOCATION
// ==========================================
function findLocation() {
  if (!navigator.geolocation) {
    alert("Browser anda tidak menyokong fungsi lokasi (Geolocation).");
    return;
  }

  navigator.geolocation.getCurrentPosition(function(pos) {
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;

    document.getElementById("map").innerHTML = "";
    
    document.getElementById("map").style.display = "block"; 

let map = L.map('map').setView([lat, lon], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Penanda lokasi pengguna
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup("📍 Lokasi Anda Sekarang")
      .openPopup();


    let query = `
    [out:json];
    (
      node["amenity"="recycling"](around:30000,${lat},${lon});
      way["amenity"="recycling"](around:30000,${lat},${lon});
      relation["amenity"="recycling"](around:30000,${lat},${lon});
      node["amenity"="waste_transfer_station"](around:30000,${lat},${lon});
      way["waste_transfer_station"](around:30000,${lat},${lon});
      node["shop"="scrap_yard"](around:30000,${lat},${lon});
      way["shop"="scrap_yard"](around:30000,${lat},${lon});
    );
    out center;
    `;

    let url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    fetch(url)
    .then(res => res.json())
    .then(data => {
      let elements = data.elements;

      if (!elements.length) {
        alert("Tiada pusat kitar semula dijumpai dalam radius 30km.");
        return;
      }

      elements.forEach(place => {
        let pLat = place.lat || place.center?.lat;
        let pLon = place.lon || place.center?.lon;
        let name = place.tags?.name || "♻️ Pusat Kitar Semula";

        let marker = L.marker([pLat, pLon]).addTo(map);

        marker.bindPopup(`
          <b>${name}</b><br>
          <small>Klik untuk arah jalan (Navigation)</small>
        `);

        
        marker.on("click", function() {
          let searchQueries = `${name} @ ${pLat},${pLon}`;
          let googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(searchQueries);
          window.open(googleMapsUrl, "_blank");
        });
      }); 
    });
  }, function(error) {
    alert("Gagal mengesan lokasi. Sila benarkan akses lokasi pada tetapan pelayar anda.");
  });
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    let rect = card.getBoundingClientRect();
    let x = e.clientX - rect.left - (rect.width / 2);
    let y = e.clientY - rect.top - (rect.height / 2);
    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg) translateY(-5px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});

function animatePrices() {
  document.querySelectorAll('.card span').forEach(span => {
    let targetText = span.innerText;
    let numericValue = parseFloat(targetText.replace(/[^0-9.]/g, '')); 
    let suffix = targetText.includes('/kg') ? '/kg' : '/unit';
    let count = 0;
    let speed = numericValue / 30; 

    let counter = setInterval(() => {
      count += speed;
      if (count >= numericValue) {
        clearInterval(counter);
        span.innerText = `RM${numericValue.toFixed(2)}${suffix}`;
      } else {
        span.innerText = `RM${count.toFixed(2)}${suffix}`;
      }
    }, 30);
  });
}


window.addEventListener('DOMContentLoaded', animatePrices);

let senaraiBarangKitar = [];

function tambahKeResit() {
  let item = document.getElementById("material").value;
  let qty = parseFloat(document.getElementById("qty").value);

  
  if (!qty || qty <= 0) {
    alert("⚠️ Sila masukkan kuantiti yang sah!");
    return;
  }

 
  let hargaItem = itemsData [item].price*qty;
  let namaBersih = item.replaceAll("_", " ").toUpperCase();

  
  senaraiBarangKitar.push({
    nama: namaBersih,
    kuantiti: qty,
    harga: hargaItem
  });

  
  document.getElementById("resitArea").style.display = "block";

  
  kemaskiniPaparanResit();
  
 
  document.getElementById("qty").value = "";
}

function kemaskiniPaparanResit() {
  let isiResit = document.getElementById("isiResit");
  isiResit.innerHTML = ""; // Bersihkan jadual lama
  let totalSemua = 0;

  senaraiBarangKitar.forEach(barang => {
    totalSemua += barang.harga;
    
    let baris = `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 8px;">${barang.nama}</td>
        <td style="padding: 8px;">${barang.kuantiti}</td>
        <td style="padding: 8px;">RM ${barang.harga.toFixed(2)}</td>
      </tr>
    `;
    isiResit.innerHTML += baris;
  });

  
  document.getElementById("jumlahBesar").innerText = "Jumlah Keseluruhan: RM " + totalSemua.toFixed(2);
}

function padamResit() {
  senaraiBarangKitar = [];
  document.getElementById("resitArea").style.display = "none";
  document.getElementById("isiResit").innerHTML = "";
}
