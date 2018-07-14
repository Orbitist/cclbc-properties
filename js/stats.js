var propertiesAPI = 'https://chqlandbank.org/api/geojson/properties';

var propertiesFeed = (function () {
    var propertiesData = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': propertiesAPI,
        'dataType': "json",
        'success': function (data) {
            propertiesData = data;
        }
    });
    return propertiesData;
})();

var propertiesMitigated;
var rehabilitations;
var sidelots;
var demolitions;

// Add commas to numbers
$.fn.digits = function(){
    return this.each(function(){
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
    })
}

function runStats() {
  propertiesMitigated = 0;
  rehabilitations = 0;
  sidelots = 0;
  demolitions = 0;

  for (var i = 0; i < propertiesFeed.features.length; i++) {
    propertiesMitigated = propertiesMitigated + 1;
    if (propertiesFeed.features[i].properties.category == 'Rehab') {
      rehabilitations = rehabilitations + 1;
    } else if (propertiesFeed.features[i].properties.category == 'Sidelot') {
      sidelots = sidelots + 1;
    }
    else if (propertiesFeed.features[i].properties.category == 'Demolition') {
      demolitions = demolitions + 1;
    }
  }

  $('#propertiesMitigated').html(propertiesMitigated);
  $('#rehabilitations').html(rehabilitations);
  $('#sidelots').html(sidelots);
  $('#demolitions').html(demolitions);
}

$( document ).ready(function() {
  runStats();
});
