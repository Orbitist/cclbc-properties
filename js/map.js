mapboxgl.accessToken = 'pk.eyJ1IjoiY2NsYiIsImEiOiJjaXVpN2kyaDIwMHN3MnRydXY2ZGpxN2tiIn0.2DjZvLsMgvMhV1-OLA3gCA';

var bounds = [
    [-80.821254, 41.429270], // Southwest coordinates
    [-77.429440, 42.664566]  // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/cclb/cjjkrpvhm2va62slnrs87mkqy',
    center: [-79.294445, 42.287382],
    zoom: 9.5,
    minZoom: 5,
    maxBounds: bounds
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {

  // Mouse hoverover popups on features
  map.on("mousemove", function (e) {
      var features = map.queryRenderedFeatures(e.point, {
          layers: ["properties"]
      });

      if (features.length && features[0].properties.title) {
          document.getElementById('region-hover').innerHTML = "<div class='region-tooltip' style='z-index:1;padding:10px 20px;border-radius:4px;background-color:" + features[0].properties.color + ";left:" + (e.point.x + 15) + "px;top:" + (e.point.y - 50) + "px;position:absolute;'>" + features[0].properties.title + "</div>";
      } else if (features.length && features[0].properties.category) {
        document.getElementById('region-hover').innerHTML = "<div class='region-tooltip' style='z-index:1;padding:10px 20px;border-radius:4px;background-color:white;left:" + (e.point.x + 15) + "px;top:" + (e.point.y - 50) + "px;position:absolute;'><p><small><span class='legend-dot " + features[0].properties.category.replace(/\s+/g, '-').toLowerCase() + "' ></span>" + features[0].properties.category + "</small></p>" + features[0].properties.name + "</div>";
      } else if (features.length && features[0].properties.name) {
        document.getElementById('region-hover').innerHTML = "<div class='region-tooltip' style='z-index:1;padding:10px 20px;border-radius:4px;background-color:white;left:" + (e.point.x + 15) + "px;top:" + (e.point.y - 50) + "px;position:absolute;'>" + features[0].properties.name + "</div>";
      } else {
          //if not hovering over a feature set tooltip to empty
          document.getElementById('region-hover').innerHTML = "";
      }
  });

  // CZB
  map.addSource("czb", {
    "type": "geojson",
    "data": "data/czb_jamestown_2016_points.geojson"
  });
  map.addLayer({
    "id": "czb",
    "type": "circle",
    "source": "czb",
    "paint": {
      "circle-radius": 10,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
      "circle-color": [
        'match',
        ['get', 'CZB Jame_1'],
        '1', '#69D2E7',
        '2', '#E0E4CC',
        '3', '#FA6900',
        /* other */ '#ccc'
      ],
      "circle-opacity": 1
    }
   });

  // PROPERTIES
  map.addSource("properties", {
    "type": "geojson",
    "data": "https://chqlandbank.org/api/geojson/properties"
  });
  map.addLayer({
    "id": "properties",
    "type": "circle",
    "source": "properties",
    "paint": {
      "circle-radius": 10,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
      "circle-color": [
        'match',
        ['get', 'category'],
        'Rehab', '#69D2E7',
        'Sidelot', '#E0E4CC',
        'Demolition', '#FA6900',
        /* other */ '#ccc'
      ],
      "circle-opacity": 1
    }
   });
   map.on('click', 'properties', function (e) {
     var propertyUrl = 'https://chqlandbank.org' + e.features[0].properties.path;
     if (e.features[0].properties.image.length > 5) {
       var propertyImg = '<img src="https://chqlandbank.org' + e.features[0].properties.image + '" alt="' + e.features[0].properties.name + '" class="card-img-top">';
     } else {
       propertyImg = '';
     }
     var propertyInfo = e.features[0].properties.status + ', ' + e.features[0].properties.category;
     var propertyLabel = e.features[0].properties.name;
     new mapboxgl.Popup()
         .setLngLat(e.lngLat)
         .setHTML('<div class="card"><a href="' + propertyUrl + '" target="_blank">' + propertyImg + '</a><div class="card-body"><a href="' + propertyUrl + '" target="_blank"><p class="lead card-title">' + propertyLabel + '</p></a><p class="card-text">' + propertyInfo + '</p></div></div>')
         .addTo(map);
   });
   map.on('mouseenter', 'properties', function () {
       map.getCanvas().style.cursor = 'pointer';
   });
   map.on('mouseleave', 'properties', function () {
       map.getCanvas().style.cursor = '';
   });



 }); //map.on load function end

// TOGGLERS
var toggleableLayers = [{label:'Properties', id:'properties', defaultState:'checked'}];

function toggleLayer(layerId) {
  var clickedLayer = layerId;

  var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

  if (visibility === 'visible') {
      map.setLayoutProperty(clickedLayer, 'visibility', 'none');
      this.className = '';
  } else {
      this.className = 'active';
      map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
  }
};

for (var i = 0; i < toggleableLayers.length; i++) {
    var layer = toggleableLayers[i];

    var checkbox = document.createElement('div');
    checkbox.innerHTML = '<label class="switch">&nbsp;<input onclick="toggleLayer(\'' + layer.id + '\')" data="lwrpRegion" id="' + layer.id + '" type="checkbox" ' + layer.defaultState + '><span class="slider round"></span></label> ' + layer.label;

    var layers = document.getElementById('menu');
    layers.appendChild(checkbox);
}

// FILTER FUNCTIONALITY
var formPropertyStatus = 'Any Property Status';
var formPropertyCategory = 'Any Property Category';
var statusFilter = ["==", 'status', formPropertyStatus];
var categoryFilter = ["==", 'category', formPropertyCategory];

var propertyFilterParams;

function buildPropertiesFilter() {
  if (formPropertyStatus == 'Any Property Status' && formPropertyCategory !== 'Any Property Category') {
    propertiesFilterParams = ["all", categoryFilter];
  } else if (formPropertyStatus !== 'Any Property Status' && formPropertyCategory == 'Any Property Category') {
    propertiesFilterParams = ["all", statusFilter];
  } else {
    propertiesFilterParams = ["all", statusFilter, categoryFilter];
  }
}

$('#propertyStatus').change(function () {
  formPropertyStatus = $(this).find("option:selected").val();
  statusFilter = ["==", 'status', formPropertyStatus];
  buildPropertiesFilter();
  if (formPropertyStatus == 'Any Property Status' && formPropertyCategory == 'Any Property Category'){
    map.setFilter('properties');
  } else {
    map.setFilter('properties', propertiesFilterParams);
  }
});

$('#propertyCategory').change(function () {
  formPropertyCategory = $(this).find("option:selected").val();
  categoryFilter = ["==", 'category', formPropertyCategory];
  buildPropertiesFilter();
  if (formPropertyStatus == 'Any Property Status' && formPropertyCategory == 'Any Property Category'){
    map.setFilter('properties');
  } else {
    map.setFilter('properties', propertiesFilterParams);
  }
});

// Function to toggle with Jquery
$.fn.toggleClick = function(){
    var methods = arguments, // store the passed arguments for future reference
        count = methods.length; // cache the number of methods

    //use return this to maintain jQuery chainability
    return this.each(function(i, item){
        // for each element you bind to
        var index = 0; // create a local counter for that element
        $(item).click(function(){ // bind a click handler to that element
            return methods[index++ % count].apply(this,arguments); // that when called will apply the 'index'th method to that element
            // the index % count means that we constrain our iterator between 0 and (count-1)
        });
    });
};

// Toggle filters block
function inFilters() {
  $('.filters-block').addClass( "active" );
  $('#toggleFilters').addClass( "active" );
}
function outFilters() {
  $('.filters-block').removeClass( "active" );
  $('#toggleFilters').removeClass( "active" );
}
$('#toggleFilters').toggleClick(inFilters, outFilters);

// Toggle stats block
function inStats() {
  $('.figures-block').addClass( "active" );
  $('#toggleStats').addClass( "active" );
}
function outStats() {
  $('.figures-block').removeClass( "active" );
  $('#toggleStats').removeClass( "active" );
}
$('#toggleStats').toggleClick(inStats, outStats);
