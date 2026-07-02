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

// const popup = new maptilersdk.Popup({ offset: 25 })
//   .setHTML(`<h4>${listingTitle}</h4><p>Exact location provided after booking!</p>`);

// marker.setPopup(popup);