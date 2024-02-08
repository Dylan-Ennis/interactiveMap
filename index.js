let selectEl = document.querySelector("select");
let listEl = document.querySelector("ul");

let map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

navigator.geolocation.getCurrentPosition(
  (position) => {
    let {
      coords: { latitude, longitude },
    } = position;
    console.log("itworks:", [latitude, longitude]);

    map.setView([latitude, longitude]);

    L.marker([latitude, longitude], {
      title: "You are here",
    }).addTo(map);
  },
  (error) => {
    console.log(error);
  }
);

document.querySelector("button").addEventListener("click", (event) => {
  let categoryID = selectEl.value;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "fsq3jAE/lRK07WaVaSLEGpmUcE3AprqTAwhMEx39NTpGZtE=",
    },
  };

  fetch(
    `https://api.foursquare.com/v3/places/search?&categories=${categoryID}&sort=DISTANCE&limit=5`,
    options
  )
    .then((response) => response.json())
    .then(({ results }) => {
      listEl.innerHTML = "";
      console.log({ results });

        //removing existing markers
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              layer.remove();
            }
          });

      for (let i = 0; i < results.length; i++) {
        results[i];
        let listItem = document.createElement("li");
        listItem.textContent = results[i].name;
        listEl.append(listItem);


        //trying to add markers
        L.marker([results[i].geocodes.main.latitude, results[i].geocodes.main.longitude], {
            title: "title markers",
          }).addTo(map);

      }
    })
    .catch((err) => console.error(err));
});
