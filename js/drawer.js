function flyToProject(lng, lat) {
  map.flyTo({
      center: [lng, lat],
      zoom: 18,
      bearing: 180 * (0.5 - Math.random()),
      pitch: 60,
      speed: 0.5,
      curve: 1
  });
  facingNorth = false;
};

for (var i = 0; i < projectsFeed.features.length; i++) {
  if (projectsFeed.features[i].properties.featured == "True" && projectsFeed.features[i].properties.tile.length > 5) {
    $(".drawer-content").append('<div onclick="flyToProject(\'' + projectsFeed.features[i].geometry.coordinates[0] + '\', \'' + projectsFeed.features[i].geometry.coordinates[1] + '\')" class="o-tile"><div class="o-tile-img Post"><img src="https://westfieldny.com' + projectsFeed.features[i].properties.tile + '" width="200" height="200" typeof="Image" class="img-responsive"><a class="o-tile-icon Post" aria-label="Icon linking to a marker" alt="An icon" href="#"></a></div><div class="o-tile-content"><div class="o-tile-content-title">' + projectsFeed.features[i].properties.name + '</div></div></div>');
  } else if (projectsFeed.features[i].properties.featured == "True" && projectsFeed.features[i].properties.tile.length < 5) {
      $(".drawer-content").append('<div onclick="flyToProject(\'' + projectsFeed.features[i].geometry.coordinates[0] + '\', \'' + projectsFeed.features[i].geometry.coordinates[1] + '\')" class="o-tile"><div class="o-tile-img Post"><a class="o-tile-icon Post" aria-label="Icon linking to a marker" alt="An icon" href="#"></a></div><div class="o-tile-content"><div class="o-tile-content-title">' + projectsFeed.features[i].properties.name + '</div></div></div>');
  }
}

$(document).ready(function(){
  $('.drawer-content').slick({
    dots: false,
    draggable: false,
    arrows: true,
    prevArrow: ".pp",
    nextArrow: ".nn",
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    infinite: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
});

var facingNorth = true;
// Toggle the chapters menu
$( "#drawer-toggle" ).click(function() {
  $( ".drawer" ).toggleClass( "show" );
  if (facingNorth == false) {
    map.flyTo({
        bearing: 0,
        pitch: 0,
        speed: 0.5,
        curve: 1
    });
  }
});
