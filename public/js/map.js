maptilersdk.config.apiKey = maptilerKey;

// Map sidhe unhi coordinates par khulega jo DB se aaye hain
const map = new maptilersdk.Map({
  container: 'map',
  style: maptilersdk.MapStyle.STREETS,
  center: coordinates, 
  zoom: 11
});

const marker = new maptilersdk.Marker({ color: 'red' })
  .setLngLat(coordinates)
  .addTo(map);

const popup = new maptilersdk.Popup({ offset: 25 })
  .setHTML(`<h4>${listingTitle}</h4><p>Exact location provided after booking!</p>`);

marker.setPopup(popup);

/*
MongoDB
      │
      ▼
Express
      │
      ▼
show.ejs
      │
      ▼
<script>

const coordinates=[73.82,15.49]

const listingTitle="Goa Beach"

const maptilerKey="abcd123"

</script>

      │
      ▼
Browser Memory

coordinates ✔

listingTitle ✔

maptilerKey ✔

      │
      ▼
map.js

center: coordinates

setHTML(listingTitle)

apiKey = maptilerKey

      │
      ▼
Map ban gaya
*/