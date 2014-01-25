	distance = 0;
	var directionsService = new google.maps.DirectionsService();
	
	function initialize()
	{
	
		var rendererOptions = {
			draggable: true
		};
		
		directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
		
		
	  var mapOptions = {
		//center: new google.maps.LatLng(41.826, -71.403),
		zoom: 13
	  };
	  
	  var map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);
		
		if(navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(function(position) {
			  var pos = new google.maps.LatLng(position.coords.latitude,
											   position.coords.longitude);

			  map.setCenter(pos);
			}, function() {
			  handleNoGeolocation(true);
			});
		} else {
			// Browser doesn't support Geolocation
			handleNoGeolocation(false);
		}

		directionsDisplay.setMap(map);
		
	  var start_input = /** @type {HTMLInputElement} */(
		  document.getElementById('pac-start'));

	  map.controls[google.maps.ControlPosition.TOP_LEFT].push(start_input);

	   start_autocomplete = new google.maps.places.Autocomplete(start_input);
	  start_autocomplete.bindTo('bounds', map);
	  
	  var destination_input = /** @type {HTMLInputElement} */(
		  document.getElementById('pac-destination'));

	  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(destination_input);

	  var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
	  destination_autocomplete.bindTo('bounds', map);
	  
	  addListenerToAutocomplete(start_autocomplete);
	  addListenerToAutocomplete(destination_autocomplete);
	  
	  var marker = new google.maps.Marker({
		map: map
	  });
	  
	  function addListenerToAutocomplete(ac)
		{
		  google.maps.event.addListener(ac, 'place_changed', function() {
			  var start = document.getElementById("pac-start").value;
			  var end = document.getElementById("pac-destination").value;
			  
			  if(start!="" && end!="")
			  {
				  marker.setVisible(false);
				  var request = {
					 origin:start, 
					 destination:end,
					 travelMode: google.maps.DirectionsTravelMode.DRIVING
				  };
				  
				 directionsService.route(request, function(response, status) {
					if (status == google.maps.DirectionsStatus.OK) {
					  directionsDisplay.setDirections(response);
					}
				 });
				 
				 var service = new google.maps.DistanceMatrixService();
				 service.getDistanceMatrix(
				  {
					origins: [start_autocomplete.getPlace().geometry.location],
					destinations: [destination_autocomplete.getPlace().geometry.location],
					travelMode: google.maps.TravelMode.DRIVING,
					unitSystem: google.maps.UnitSystem.IMPERIAL
				  }, callback);
				  
				  function callback(response, status) {
					if (status == google.maps.DistanceMatrixStatus.OK)
					{
						//console.log(response);
						console.log(response.rows[0].elements[0].distance.text);
						distance = response.rows[0].elements[0].distance.text;
					}
					
					else
						console.log(google.maps.DistanceMatrixStatus);
				  }
			  }
			  
			  if(start!="" && end=="")
			  {
				pos = start_autocomplete.getPlace().geometry.location;
				map.setCenter(pos);
				map.setZoom(13);
				
				marker.setPosition(pos);
				marker.setVisible(true);
			  }
			  
			  if(start=="" && end!="")
			  {
				pos = destination_autocomplete.getPlace().geometry.location;
				map.setCenter(pos);
				map.setZoom(13);
				
				marker.setPosition(pos);
				marker.setVisible(true);
			  }
		  });
		}
	}
	
	function handleNoGeolocation(errorFlag) {
		position = new google.maps.LatLng(41.826, -71.403);
	  map.setCenter(options.position);
	}
	
	google.maps.event.addDomListener(window, 'load', initialize);