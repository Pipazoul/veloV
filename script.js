apiUrl = "https://download.data.grandlyon.com/wfs/rdata?SERVICE=WFS&VERSION=2.0.0&outputformat=GEOJSON&request=GetFeature&typename=jcd_jcdecaux.jcdvelov&SRSNAME=urn:ogc:def:crs:EPSG::4171";

stations = [{}];
totalBikesAvailable = 0;


// Gets the raw json data from Open Data Lyon
$.getJSON(apiUrl, function (data) {
    $.each(data.features, function (json) {
        // Format raw data
        stations.push({
            "address": data.features[json].properties.address,
            "availableBikes": data.features[json].properties.available_bikes,
            'lat': data.features[json].geometry.coordinates[1],
            'long': data.features[json].geometry.coordinates[0]
        });
    });
    stations.shift();
    $.each(stations, function (i) {
        //console.log(stations[i].availableBikes);
        totalBikesAvailable = totalBikesAvailable + stations[i].availableBikes;
        //console.log(stations[i].availableBikes);
    });
    console.log('Total bikes available :' + totalBikesAvailable);


    //MAPS
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(45.76813040022993, 4.87916148913811),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < stations.length; i++) {
        //console.log(stations[i].lat);

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(stations[i].lat, stations[i].long),
            map: map
        });

        // If there is no bikes in the station set the red marker
        if (stations[i].availableBikes === 0) {
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png', i);
        }
        // If there is from 1 to 5 bikes the station set the yellow marker
        if (stations[i].availableBikes >= 1) {
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png', i);
        }
        // If there is more than 5 bikes the station set the green marker
        if (stations[i].availableBikes > 5) {
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png', i);
        }

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                // Add some informations about the station (Adress, number of available bikes) 
                infowindow.setContent(stations[i].address + '<br>Available bikes : ' + stations[i].availableBikes);
                infowindow.open(map, marker);
            }
        })(marker, i));


    }

});
