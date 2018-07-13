var projectsAPI = 'https://westfieldny.com/api/geojson/projects';

var projectsFeed = (function () {
    var projectsData = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': projectsAPI,
        'dataType': "json",
        'success': function (data) {
            projectsData = data;
        }
    });
    return projectsData;
})();

var cost;
var privateInvestment;
var localInvestment;
var grants;

// Add commas to numbers
$.fn.digits = function(){
    return this.each(function(){
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
    })
}

function runStats() {
  cost = 0;
  privateInvestment = 0;
  localInvestment = 0;
  grants = 0;

  if (formProjectStatus == 'Any Project Status' && formProjectType == 'Priority Projects') {
    for (var i = 0; i < projectsFeed.features.length; i++) {
      if (projectsFeed.features[i].properties.featured == 'True') {
        cost = cost + parseInt(projectsFeed.features[i].properties.cost, 10);
        privateInvestment = privateInvestment + parseInt(projectsFeed.features[i].properties.private, 10);
        localInvestment = localInvestment + parseInt(projectsFeed.features[i].properties.local, 10);
        grants = grants + parseInt(projectsFeed.features[i].properties.grants, 10);
      }
    }
  } else if (formProjectStatus != 'Any Project Status' && formProjectType == 'Priority Projects') {
    for (var i = 0; i < projectsFeed.features.length; i++) {
      if (formProjectStatus == projectsFeed.features[i].properties.status && projectsFeed.features[i].properties.featured == 'True') {
        cost = cost + parseInt(projectsFeed.features[i].properties.cost, 10);
        privateInvestment = privateInvestment + parseInt(projectsFeed.features[i].properties.private, 10);
        localInvestment = localInvestment + parseInt(projectsFeed.features[i].properties.local, 10);
        grants = grants + parseInt(projectsFeed.features[i].properties.grants, 10);
      }
    }
  }
  else if (formProjectStatus == 'Any Project Status' && formProjectType == 'Any Project Type') {
    for (var i = 0; i < projectsFeed.features.length; i++) {
      cost = cost + parseInt(projectsFeed.features[i].properties.cost, 10);
      privateInvestment = privateInvestment + parseInt(projectsFeed.features[i].properties.private, 10);
      localInvestment = localInvestment + parseInt(projectsFeed.features[i].properties.local, 10);
      grants = grants + parseInt(projectsFeed.features[i].properties.grants, 10);
    }
  } else if (formProjectStatus == 'Any Project Status' && formProjectType != 'Any Project Type') {
    for (var i = 0; i < projectsFeed.features.length; i++) {
      if (formProjectType == projectsFeed.features[i].properties.type) {
        cost = cost + parseInt(projectsFeed.features[i].properties.cost, 10);
        privateInvestment = privateInvestment + parseInt(projectsFeed.features[i].properties.private, 10);
        localInvestment = localInvestment + parseInt(projectsFeed.features[i].properties.local, 10);
        grants = grants + parseInt(projectsFeed.features[i].properties.grants, 10);
      }
    }
  } else if (formProjectStatus != 'Any Project Status' && formProjectType == 'Any Project Type') {
    for (var i = 0; i < projectsFeed.features.length; i++) {
      if (formProjectStatus == projectsFeed.features[i].properties.status) {
        cost = cost + parseInt(projectsFeed.features[i].properties.cost, 10);
        privateInvestment = privateInvestment + parseInt(projectsFeed.features[i].properties.private, 10);
        localInvestment = localInvestment + parseInt(projectsFeed.features[i].properties.local, 10);
        grants = grants + parseInt(projectsFeed.features[i].properties.grants, 10);
      }
    }
  } else if (formProjectStatus != 'Any Project Status' && formProjectType != 'Any Project Type') {
    for (var i = 0; i < projectsFeed.features.length; i++) {
      if (formProjectStatus == projectsFeed.features[i].properties.status  && formProjectType == projectsFeed.features[i].properties.type) {
        cost = cost + parseInt(projectsFeed.features[i].properties.cost, 10);
        privateInvestment = privateInvestment + parseInt(projectsFeed.features[i].properties.private, 10);
        localInvestment = localInvestment + parseInt(projectsFeed.features[i].properties.local, 10);
        grants = grants + parseInt(projectsFeed.features[i].properties.grants, 10);
      }
    }
  }


  $('#cost').html(cost);
  $('#private').html(privateInvestment);
  $('#local').html(localInvestment);
  $('#grants').html(grants);
}

$( document ).ready(function() {
  runStats();
});
