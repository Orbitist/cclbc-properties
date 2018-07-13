mapboxgl.accessToken = 'pk.eyJ1Ijoid2VzdGZpZWxkbnkiLCJhIjoiY2pjeGxqcjhiMGljYzMzbzE0eXB6Z3ozYiJ9.VEtcYyEyNf1N2huTqRXElQ';

var bounds = [
    [-80.098094, 41.808723], // Southwest coordinates
    [-78.803060, 42.664566]  // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/westfieldny/cjcxob2e71c352smnmnuscxbn',
    center: [-79.585621, 42.329138],
    zoom: 13,
    minZoom: 10,
    maxBounds: bounds
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {

  // Municipal Regions
  map.addLayer({
      'id': 'municipalRegions',
      'type': 'line',
      'source': {
          'type': 'geojson',
          'data': municipalRegions
      },
      'layout': {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        "line-color": ['get', 'color'],
        "line-width": 6,
        "line-opacity": 0.8
      }
  });

  // LWRP Region
  map.addLayer({
      'id': 'lwrpRegion',
      'type': 'fill',
      'source': {
          'type': 'geojson',
          'data': lwrpRegion
      },
      'layout': {},
      'paint': {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.4
      }
  });
  toggleLayer('lwrpRegion');

  // REGIONS
  map.addLayer({
      'id': 'driRegions',
      'type': 'fill',
      'source': {
          'type': 'geojson',
          'data': regionsData
      },
      'layout': {},
      'paint': {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.4
      }
  });
  toggleLayer('driRegions');

  // Mouse hoverover popups on features
  map.on("mousemove", function (e) {
      var features = map.queryRenderedFeatures(e.point, {
          layers: ["driRegions", "lwrpRegion", "municipalRegions", "projects", "organizations", "points"]
      });

      if (features.length && features[0].properties.title) {
          document.getElementById('region-hover').innerHTML = "<div class='region-tooltip' style='z-index:1;padding:10px 20px;border-radius:4px;background-color:" + features[0].properties.color + ";left:" + (e.point.x + 15) + "px;top:" + (e.point.y - 50) + "px;position:absolute;'>" + features[0].properties.title + "</div>";
      } else if (features.length && features[0].properties.type) {
        document.getElementById('region-hover').innerHTML = "<div class='region-tooltip' style='z-index:1;padding:10px 20px;border-radius:4px;background-color:white;left:" + (e.point.x + 15) + "px;top:" + (e.point.y - 50) + "px;position:absolute;'><p><small><span class='legend-dot " + features[0].properties.status.replace(/\s+/g, '-').toLowerCase() + "' ></span>" + features[0].properties.status + "</small></p>" + features[0].properties.name + "</div>";
      } else if (features.length && features[0].properties.name) {
        document.getElementById('region-hover').innerHTML = "<div class='region-tooltip' style='z-index:1;padding:10px 20px;border-radius:4px;background-color:white;left:" + (e.point.x + 15) + "px;top:" + (e.point.y - 50) + "px;position:absolute;'>" + features[0].properties.name + "</div>";
      } else {
          //if not hovering over a feature set tooltip to empty
          document.getElementById('region-hover').innerHTML = "";
      }
  });

  // PROJECTS
  map.addSource("projects", {
    "type": "geojson",
    "data": "https://westfieldny.com/api/geojson/projects"
  });
  map.addLayer({
    "id": "projects",
    "type": "circle",
    "source": "projects",
    "paint": {
      "circle-radius": 10,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
      "circle-color": [
        'match',
        ['get', 'status'],
        'Proposed', '#69D2E7',
        'Underway', '#E0E4CC',
        'Complete', '#FA6900',
        /* other */ '#ccc'
      ],
      "circle-opacity": 1
    }
   });
   map.on('click', 'projects', function (e) {
     var projectUrl = 'https://westfieldny.com' + e.features[0].properties.path;
     if (e.features[0].properties.image.length > 5) {
       var projectImg = '<img src="https://westfieldny.com' + e.features[0].properties.image + '" alt="' + e.features[0].properties.name + '" class="card-img-top">';
     } else {
       projectImg = '';
     }
     var projectInfo = e.features[0].properties.status + ', ' + e.features[0].properties.type;
     var projectLabel = e.features[0].properties.name;
     new mapboxgl.Popup()
         .setLngLat(e.lngLat)
         .setHTML('<div class="card"><a href="' + projectUrl + '" target="_parent">' + projectImg + '</a><div class="card-body"><a href="' + projectUrl + '" target="_parent"><p class="lead card-title">' + projectLabel + '</p></a><p class="card-text">' + projectInfo + '</p></div></div>')
         .addTo(map);
   });
   map.on('mouseenter', 'projects', function () {
       map.getCanvas().style.cursor = 'pointer';
   });
   map.on('mouseleave', 'projects', function () {
       map.getCanvas().style.cursor = '';
   });

   // VR LAYER
   // vrLayer.features.forEach(function(marker) {
   //   // create a HTML element for each feature
   //   var el = document.createElement('div');
   //   el.className = 'vr-marker';
   //   // make a marker for each feature and add to the map
   //   new mapboxgl.Marker(el)
   //   .setLngLat(marker.geometry.coordinates)
   //   .setPopup(new mapboxgl.Popup({ offset: 10, closeButton: false }) // add popups
   //   .setHTML(marker.properties.content))
   //   .addTo(map);
   // });

   // FEATURED BUSINESSES
   map.addSource("organizations", {
     "type": "geojson",
     "data": "https://westfieldny.com/api/geojson/featured_organizations"
   });
   map.addLayer({
     "id": "organizations",
     "type": "symbol",
     "source": "organizations",
     "layout": {
            "icon-image": "suitcase-15",
            "icon-allow-overlap": true
          }
    });
    toggleLayer('organizations');
    map.on('click', 'organizations', function (e) {
      var projectUrl = 'https://westfieldny.com' + e.features[0].properties.path;
      if (e.features[0].properties.image.length > 5) {
        var projectImg = '<img src="https://westfieldny.com' + e.features[0].properties.image + '" alt="' + e.features[0].properties.name + '" class="card-img-top">';
      } else {
        var projectImg = '';
      }
      var projectInfo = e.features[0].properties.categories;
      var projectLabel = e.features[0].properties.name;
      new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML('<div class="card"><a href="' + projectUrl + '" target="_parent">' + projectImg + '</a><div class="card-body"><a href="' + projectUrl + '" target="_parent"><p class="lead card-title">' + projectLabel + '</p></a><p class="card-text">' + projectInfo + '</p></div></div>')
          .addTo(map);
    });
    map.on('mouseenter', 'organizations', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'organizations', function () {
        map.getCanvas().style.cursor = '';
    });

    // FEATURED POINTS
    map.addSource("points", {
      "type": "geojson",
      "data": "https://westfieldny.com/api/geojson/featured_points"
    });
    map.addLayer({
      "id": "points",
      "type": "symbol",
      "source": "points",
      "layout": {
        "icon-image": "map-marker-15",
        "icon-allow-overlap": true
      }
     });
     toggleLayer('points');
     map.on('click', 'points', function (e) {
       var projectUrl = 'https://westfieldny.com' + e.features[0].properties.path;
       if (e.features[0].properties.image.length > 5) {
         var projectImg = '<img src="https://westfieldny.com' + e.features[0].properties.image + '" alt="' + e.features[0].properties.name + '" class="card-img-top">';
       } else {
         var projectImg = '';
       }
       var projectInfo = e.features[0].properties.categories;
       var projectLabel = e.features[0].properties.name;
       new mapboxgl.Popup()
           .setLngLat(e.lngLat)
           .setHTML('<div class="card"><a href="' + projectUrl + '" target="_parent">' + projectImg + '</a><div class="card-body"><a href="' + projectUrl + '" target="_parent"><p class="lead card-title">' + projectLabel + '</p></a><p class="card-text">' + projectInfo + '</p></div></div>')
           .addTo(map);
     });
     map.on('mouseenter', 'points', function () {
         map.getCanvas().style.cursor = 'pointer';
     });
     map.on('mouseleave', 'points', function () {
         map.getCanvas().style.cursor = '';
     });

});

// TOGGLERS
var toggleableLayers = [{label:'Projects', id:'projects', defaultState:'checked'},{label:'Municipal Boundaries', id:'municipalRegions', defaultState:'checked'},{label:'DRI Boundary Area', id:'driRegions', defaultState:''}, {label:'LWRP Boundary Area', id:'lwrpRegion', defaultState:''}, {label:'Featured Businesses', id:'organizations', defaultState:''}, {label:'Points of Interest', id:'points', defaultState:''}];

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
var formProjectStatus = 'Any Project Status';
var formProjectType = 'Any Project Type';
var statusFilter = ["==", 'status', formProjectStatus];
var typeFilter = ["==", 'type', formProjectType];

var projectsFilterParams;

function buildProjectsFilter() {
  if (formProjectStatus == 'Any Project Status' && formProjectType == 'Priority Projects') {
    projectsFilterParams = ["all", ["==", 'featured', 'True']];
  } else if (formProjectStatus != 'Any Project Status' && formProjectType == 'Priority Projects') {
    projectsFilterParams = ["all", statusFilter, ["==", 'featured', 'True']];
  } else if (formProjectStatus == 'Any Project Status' && formProjectType !== 'Any Project Type') {
    projectsFilterParams = ["all", typeFilter];
  } else if (formProjectStatus !== 'Any Project Status' && formProjectType == 'Any Project Type') {
    projectsFilterParams = ["all", statusFilter];
  } else {
    projectsFilterParams = ["all", statusFilter, typeFilter];
  }
}

$('#projectStatus').change(function () {
  formProjectStatus = $(this).find("option:selected").val();
  statusFilter = ["==", 'status', formProjectStatus];
  buildProjectsFilter();
  if (formProjectStatus == 'Any Project Status' && formProjectType == 'Any Project Type'){
    map.setFilter('projects');
    runStats();
  } else {
    map.setFilter('projects', projectsFilterParams);
    runStats();
  }
});

$('#projectType').change(function () {
  formProjectType = $(this).find("option:selected").val();
  typeFilter = ["==", 'type', formProjectType];
  buildProjectsFilter();
  if (formProjectStatus == 'Any Project Status' && formProjectType == 'Any Project Type'){
    map.setFilter('projects');
    runStats();
  } else {
    map.setFilter('projects', projectsFilterParams);
    runStats();
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
