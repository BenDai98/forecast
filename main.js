/* Wind & Wetter Beispiel */

// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Karte initialisieren
let map = L.map("map", {
    fullscreenControl: true
}).setView([ibk.lat, ibk.lng], 5);

// thematische Layer
let themaLayer = {
    forecast: L.featureGroup().addTo(map)
}

// Hintergrundlayer
let layerControl = L.control.layers({
    "Openstreetmap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery").addTo(map)
}, {
    "Wettervorhersage MET Norway": themaLayer.forecast
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Wettervorhersage MET Norway
async function showForecast(url) {
    let response = await fetch(url);
    let jsondata = await response.json();

    // aktuelles Wetter und Wettervorhersage implementieren
    console.log(jsondata);
    L.geoJSON(jsondata, {
        pointToLayer: function (feature, latlng) {
            let details = feature.properties.timeseries[0].data.instant.details;
            let time = new Date(feature.properties.timeseries[0].time);
            //console.log(time);
            let content = `
                <h4>Wettervorhersage für: ${time.toLocaleString()}</h4>
                <ul>
                    <li>Luftdruck (hPa): ${details.air_pressure_at_sea_level}</li>
                    <li>Temperatur (°C): ${details.air_temperature}</li>
                    <li>Bewölkungsgrad (%): ${details.cloud_area_fraction}</li>
                    <li>Relative Luftfeuchtigkeit (%): ${details.relative_humidity}</li>
                    <li>Windrichtiung (°): ${details.wind_from_direction}</li>
                    <li>Windgeschwindigkeit (km/h): ${details.wind_speed * 3.6}</li>
                </ul>
                `;

            for (let i = 0; i <= 24; i += 3) {
                let symbol = feature.properties.timeseries[i].data.next_1_hours.summary.symbol_code;
                let time = new Date(feature.properties.timeseries[i].time);
                content += `
                    <img 
                        src="icons/${symbol}.svg" 
                        alt="${symbol}" 
                        style="width:30px" 
                        title="${time.toLocaleString()}">
                `;
                //console.log(i, symbol);
            };

            // Link zum Datendownload
            content += `
                <p><a href="${url}" target="met.no">Daten Downloaden</a></p>
            `;

            L.popup(latlng, {
                content: content,
            }).openOn(themaLayer.forecast);
        }
    }).addTo(themaLayer.forecast);
}
//showForecast("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=47.267222&lon=11.392778");

map.on("click", function (evt) {
    console.log(evt);
    let lat = evt.latlng.lat;
    let lng = evt.latlng.lng;
    console.log(lat, lng);

    showForecast(`
    https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lng}
    `);
});

// Click auf innsbruck simulieren
map.fire("click",{
    latlng: ibk
})


async function loadWind(url){
    const response = await fatch(url);
    const jsondata = await response.json();
    console.log(jsondata);
}
loadWind("https://geographie.uibk.ac.at/data/ecmwf/data/wind-10u-10v-europe.json")