// 1. Select those elments that wil be frequent used.
var storyboard = $("#storyboard");
var scene = $(".scene");
// 2. Declare the maps, thematic layers and the base maps/layers.
var map, polygonLayer, pointLayer, lightBasemap, satelliteBasemap;

// 3. Initialize the geonarrative structure using scrollama
var scriptPanel = scrollama();

// 4. Define Generic window resize listener event
function handleResize() {
  // update the height of each scene elements
  var sceneH = Math.floor(window.innerHeight * 0.75);
  scene.css("height", sceneH + "px");

  var storyboardHeight = window.innerHeight;
  var storyboardMarginTop = (window.innerHeight - storyboardHeight) / 2;

  storyboard
    .css("height", storyboardHeight + "px")
    .css("top", storyboardMarginTop + "px");

  // tell scrollama to update new element dimensions
  scriptPanel.resize();
}

// 5. The function performs when a scene enters the storyboard
function handleSceneEnter(response) {
  var index = response.index;

  if (index === 0) {
    map.setView(new L.LatLng(47.33, -121.93), 8);
    map.addLayer(polygonLayer);
  } else if (index === 1) {
    map.setView(new L.LatLng(47.33, -121.93), 8);
    map.addLayer(pointLayer);
  } else if (index === 2) {
    //Relocate to Seattle
    map.setView(new L.LatLng(47.6131229, -122.4121036), 12);
  //} else if (index === 3) {
    //Relocate to Portland
    //map.setView(new L.LatLng(45.5428119, -122.7243662), 12);
    //map.addLayer(satelliteBasemap);
  } else if (index === 6) {
    map.setView(new L.LatLng(47.6131229, -122.4121036), 12);
    $("#cover").css("visibility", "hidden");
  }
}

// 6. The function performs when a scene exits the storyboard
function handleSceneExit(response) {
  var index = response.index;

  if (index === 0) {
    map.removeLayer(polygonLayer);
  } else if (index === 1) {
    map.removeLayer(pointLayer);
  } else if (index === 3) {
    //exit to Portland
    map.removeLayer(satelliteBasemap);
  } else if (index === 6) {
    $("#cover").css("visibility", "visible");
  }
}

// 7. the function performs when this html document is ready.
$(document).ready(function() {

  // 8. Intialize the layout.
  // Force a resize on load to ensure proper dimensions are sent to scrollama
  handleResize();
  window.scrollTo(0, 0);
  // Bind the resize function to the window resize event
  window.addEventListener("resize", handleResize);

  // 9. Use a promise mechnism to asynchrously load the required geojson datasets.
  Promise.all([
    $.getJSON("assets/wacountydata.geojson"),
    $.getJSON("assets/King County_Political Boundary.geojson")
  ]).then(function(datasets) {

    // 10. After the data are successfully loaded, the then funciton will execute in order to
    //    a) preprocess the data as map layers
    //    b) initialize the script panel
    //    c) initialize the map and layers.


    polygonLayer = L.geoJSON(datasets[0]);
    pointLayer = L.geoJSON(datasets[1]);

    scriptPanel
      .setup({
        step: ".scene", // all the scenes.
        offset: 0.33,   // the location of the enter and exit trigger
        debug: true  // toggler on or off the debug mode.
      })
      .onStepEnter(handleSceneEnter)
      .onStepExit(handleSceneExit);
  });


  map = L.map('map', {
    center: [47.33, -121.93],
    zoom: 7,
    scrollWheelZoom: false,
    zoomControl: false,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true // detect whether the sceen is high resolution or not.
  });


  lightBasemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png');
  satelliteBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
  map.addLayer(lightBasemap);

});
