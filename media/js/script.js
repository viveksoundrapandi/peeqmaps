var feedback_counter=0;
var feedback_flag = false;
var map;
var spinner;
var info = $('#infobox');
var doc = $(document);
var watchID;
var go_to_home = false;
//var marker;
var countryRestrict = {
	'country': 'us'
};
var selectedLocation;
var radius = 2000;
var circle;
var cmpny_map = {};
var li_values = [ ];
var cluster_flag = false;
var selectedDistance = 2;
var companySizeFrom;
var companySizeTo;
var selectedCompanySize = '201-500';
var selectedIndustry = [];
var selectedFunding;
var selectedPlace = '';
var selectedMeasurement = 1609.34;
var infoWindow = new google.maps.InfoWindow();
var infowindow2 = new google.maps.InfoWindow();;
var geocoder = new google.maps.Geocoder();
var home_location;
var directionsDisplay = new google.maps.DirectionsRenderer();;
var directionsService = new google.maps.DirectionsService();
var markers = [];
var home_marker;
var shareUrlName = '';
var selectedShareLinks = '';
var linkedinShare = '';
var twitterShare = '';
var facebookShare = '';
var stackoverflowShare = '';
var smallCircle;
var smallCircleRadius;
var exportTable = '';
var markerClusterer = [];
var sharedLocationFlag = false;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();

var radius_box;

// ####### Initialize Map #########
function initialize() {
	$("#leftContainer").css("display", "none");
	var mapOptions = {
		zoom: 14,
		center: new google.maps.LatLng(12.9715987, 77.59456269999998),
		disableDefaultUI: true,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL,
			position: google.maps.ControlPosition.RIGHT_CENTER
		},

	};


	map = new google.maps.Map(document.getElementById("mapCanvas"), mapOptions);
	// map.setOptions({
	// 	styles: styleArray
	// });
	directionsDisplay.setMap(map);

	//createCircle();

	//####### GeoLocation Finder #######

	searchMylocation();


	//##### Search AutoComplete Function #########-->

	var autocomplete = new google.maps.places.Autocomplete((document.getElementById('placeSearch')), {
		// types: ['(cities)'],
		//componentRestrictions: countryRestrict
	});
	google.maps.event.addListener(autocomplete, 'place_changed', onplaceChanged);


	var autocomplete_top_search = new google.maps.places.Autocomplete((document.getElementById('location_search_top')), {
		// types: ['(cities)'],
		//componentRestrictions: countryRestrict
	});
	google.maps.event.addListener(autocomplete_top_search, 'place_changed', searchPlace);

	function searchPlace() {

		selectedPlace = autocomplete_top_search.getPlace().formatted_address;

		var place = autocomplete_top_search.getPlace();
		if (place.geometry) {

			selectedLocation = place.geometry.location;

			createCircle();
			map.panTo(place.geometry.location);
			//map.setZoom(10);
			filterList();

			$("#checkBox").css("display", "block");

		} else {
			document.getElementById('placeSearch').placeholder = 'Please Enter An Address or Company Name';
		}

	}

	function onplaceChanged() {

		selectedPlace = autocomplete.getPlace().formatted_address;


		var place = autocomplete.getPlace();
		if (place.geometry) {

			selectedLocation = place.geometry.location;
			//$.cookie('HomeLocation', selectedPlace);
			//createCircle();
			// map.panTo(place.geometry.location);
			// map.setZoom(10);
			////filterList();


			$("#checkBox").css("display", "block");

		} else {
			document.getElementById('placeSearch').placeholder = 'Please Enter An Address or Company Name';
		}

	}

}
//#########export uncheck Button #########

$(document).ready(function() {

	$(document).on('click', '.removeCompany', function() {
		$(this).closest('tr').remove();
	});


	//#### send mail toggle ##########

	$("#mailSendBtn").on("click", function() {
		$("#exportTable").css("display", "none");
		$("#contactMail").slideToggle();
	});

	//#####search place  Enterkey #######


	$('#placeSearch').keypress(function(e) {
		getLocationOnEnter(e, $('#placeSearch').val());
	});
	//######## Company Search AutoCmplete #############


	//######## TAGS autocomlete EVENT ##########


	$.cookie('distanceMeasure', 'km');

	//###### measurement Selector #########
	$('input:radio[name="measure"]').change(function() {
		if ($(this).is(':checked')) {
			$.cookie('distanceMeasure', $(this).val());

			if ($(this).val() == 'km') {
				selectedMeasurement = 1000;
				selectedDistance = $("#distance").val() * selectedMeasurement;
				radius = selectedDistance;
			} else {
				selectedMeasurement = 1609.34;
				selectedDistance = $("#distance").val() * selectedMeasurement;
				radius = selectedDistance;
			}
			if (home_marker) {
				createCircle();
				filterList();
			}
		}
	});

	//###### search Company from Database ########
	$("#searchCompany").click(function() {

		$("#searchContainer").hide();
		$(".searchPart").css("display", "block");
		$("#company_search_top").val($("#searchComp_text").val());
		$("#searchComp_text").val('');
		if (home_marker) {
			//home_marker.setPosition(map.getCenter());
		} else {
			createHomeMarker(map.getCenter().lat(), map.getCenter().lng());
		}

		createCircle();
		filterList();

	});


	$("#search_btn_top").click(function() {

		$("#searchContainer").hide();
		$(".searchPart").css("display", "block");

		if (home_marker) {
			//home_marker.setPosition(map.getCenter());
		} else {
			createHomeMarker(map.getCenter().lat(), map.getCenter().lng());
		}
		if (!circle) {
			createCircle();
		}

		filterList();

	});


	$('#searchComp_text').keypress(function(e) {
		var key = e.which;
		if (key == 13) // the enter key code
		{
			$("#searchContainer").hide();
			$(".searchPart").css("display", "block");
			$("#company_search_top").val($("#searchComp_text").val());
			$("#searchComp_text").val('');
			if (home_marker) {
				//home_marker.setPosition(map.getCenter());
			} else {
				createHomeMarker(map.getCenter().lat(), map.getCenter().lng());
			}

			createCircle();
			filterList();
		}
	});


	$('#company_search_top').keypress(function(e) {
		var key = e.which;
		if (key == 13) // the enter key code
		{

			$("#searchContainer").hide();
			$(".searchPart").css("display", "block");

			if (home_marker) {
				//home_marker.setPosition(map.getCenter());
			} else {
				createHomeMarker(map.getCenter().lat(), map.getCenter().lng());
			}
			if (!circle) {
				createCircle();
			}

			filterList();
		}
	});

	//###### search nearby Company from Database ########

	$("#newCompany").click(function() {
		clearall_tags();
	});

	$(".search_btn").click(function() {

		selectedPlace = $("#placeSearch").val();
		searchFilter(selectedPlace);
	});

	$("#place_search_btn_top").click(function() {

		selectedPlace = $("#placeSearch").val();
		searchFilter(selectedPlace);
	});


	//###### Distance Selector #########
	$('#distance').change(function() {

		if ($('input[name="measure"]:checked').val() == 'km') {
			selectedMeasurement = 1000;
		} else {
			selectedMeasurement = 1609.34;
		}

		selectedDistance = ($(this).val()) * (selectedMeasurement);
		radius = selectedDistance;
		if (home_marker) {
			createCircle();
			filterList();
		}
	});
	// All select box listener
	$(".check_all").on("change", function() {
		$("input:checkbox[name=" + $(this).attr("name") + "]").prop('checked', $(this).prop("checked"));
	});
	//###### company size Selector #########
	$('input:checkbox[name="companySize"]').change(function() {

		var values = $('input:checkbox[name="companySize"]:checked').map(function() {
			return this.value;
		}).get();
		selectedCompanySize = values;
		filterList();
	});

	//###### industry Selector #########
	$('input:checkbox[name="industry"]').change(function() {

		var values = $('input:checkbox[name="industry"]:checked').map(function() {
			return this.value;
		}).get();
		selectedIndustry = values;
		filterList();
	});

	//###### Funding Selector #########
	$('input:checkbox[name="funding"]').change(function() {
		var values = $('input:checkbox[name="funding"]:checked').map(function() {
			return this.value;
		}).get();
		selectedFunding = values;
		filterList();
	});


	//####### save as to Excel ######
	$("#btnExport").click(function(e) {
		//getting values of current time for generating the file name
		var dt = new Date();
		var day = dt.getDate();
		var month = dt.getMonth() + 1;
		var year = dt.getFullYear();
		var hour = dt.getHours();
		var mins = dt.getMinutes();
		var postfix = day + "." + month + "." + year + "_" + hour + "." + mins;
		var a = document.createElement('a');
		var data_type = 'data:application/vnd.ms-excel';


		$('table tr').has('input:checkbox:not(:checked)').remove();

		var table_div = document.getElementById('tableData');
		var table_html = table_div.outerHTML.replace(/ /g, '%20');
		a.href = data_type + ', ' + table_html;
		//setting the file name
		a.download = 'exported_table_' + postfix + '.xls';
		a.click();
		e.preventDefault();
	});

});

function searchFilter(selectedPlace) {

	geocoder.geocode({
		'address': selectedPlace
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {

			var lat = results[0].geometry.location.lat();
			var lng = results[0].geometry.location.lng();
			selectedLocation = new google.maps.LatLng(lat, lng);

			if (!home_location) {
				createHomeMarker(lat, lng);
			}

			$("#searchContainer").hide();
			$(".searchPart").css("display", "block");
			$("#location_search_top").val($("#placeSearch").val());
			$("#placeSearch").val('');
			map.setCenter(selectedLocation);
			if ($("#loaction_chkbox").is(':checked')) {
				if (!$.cookie('HomeLocation')) {
					$.cookie('HomeLocation', selectedLocation);
					var geocoder = geocoder = new google.maps.Geocoder();
					geocoder.geocode({
						'latLng': selectedLocation
					}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							if (results[1]) {
								$("#home_address_modal .address_content").html(results[1].formatted_address);
								$("#address_edit").removeClass("hide");

							}
						}
					});

				}
				if ($.cookie('Home') != 'undefined') {
					$.cookie('Home', $.cookie('Home') + '&' + selectedPlace);
				}
			}
			home_marker.setPosition(selectedLocation);
			createCircle();
			//filterList();

		}
	});

}
//######## gGet Location While pressing ENTERKEY #########

function getLocationOnEnter(e, value) {
	var key = e.which;
	if (key == 13) // the enter key code
	{
		searchFilter(value);
	}
}
function roundOff(number, places)
{
	return Math.round(number * 10**places) / (10**places);
}
//###### filter Function #######

function filterList() {
	if (directionsDisplay) {
		directionsDisplay.setMap(null);
	}
	var search_company = $("#company_search_top").val();
	var circleBounds;
	var current_circle;
	var circleRadius;
	var latitude;
	var lng;
	tagsArray = $("#inputTags").val();
	clearMarkers();
	if (!circle) {
		return;
	}
	home_marker.setPosition(circle.getCenter());

	if (circle.getCenter()) {
		circleBounds = circle.getBounds();
		current_circle = circle.getCenter();
		circleRadius = circle.getRadius();
		latitude = current_circle.lat();
		lng = current_circle.lng();
	} else {
		current_circle = '';
		latitude = '';
		lng = '';
	}

	var num_result = 0;
	var careersLogo = '';
	var websiteLogo = '';
	var linkedinLogo = '';
	var facebookLogo = '';
	var twitterLogo = '';
	var angellistLogo = '';
	var githubLogo = '';
	var crunchbaseLogo = '';
	var blogLogo = '';
	var stackoverflowLogo = '';
	var ventureloopLogo = '';

	var post_data = {
		"latitude": current_circle.lat(), //"37.78950120",
		"longitude": current_circle.lng(), //"-122.39383700",
		"search_radius": radius,
		"industries": selectedIndustry,
		"num_employees": selectedCompanySize,
		"ownership": selectedFunding
	};
	var json_data = JSON.stringify(post_data);
	$("#mapCanvas").css("margin-left", "17%");
	spinner.spin();
	$("#rightContainer").hide();
	$("#infowindow").hide();
	smallCircle.setMap(null);
	$("body").append(spinner.el);
	console.log("ajax start");
	$.ajax({
		dataType: "json",
		method: "POST",
		url: 'http://peeqmaps.com/app/open/co_maps/neigh.json',
		//data: 'lat=' + current_circle.lat() + '&lng=' + current_circle.lng() + '&radius=' + circleRadius + '&CompanySize=' + selectedCompanySize + '&industry=' + selectedIndustry + '&funding=' + selectedFunding + '&tags=' + tagsArray + '&company=' + search_company,
		data: json_data,
		success: function(data) {
			exportTable = '';
			li_values = [];
			cmpny_map = {};
			hackerList = new List('hacker-list', li_options);
			$.cookie("companyData", '');
			var bounds = new google.maps.LatLngBounds();
			var data = data.companies;
			//console.log(data);

			console.log("ajax data recieved");
			console.log(data.length);
			clear_right_container();
			if (data.length > 0) {
				for (var i = 0; i < data.length; i++) {

					var address = data[i].full_addr;
					var company_size="";
					if (data[i].num_employees) {
					company_size = data[i].num_employees;
					}
					var funding = "";
					if (data[i].funding_status) {
					    data[i].funding_status;
					}
					var industry = "";
					if (data[i].funding_status) {
					    industry = data[i].industry;
					}
					var tags = '';
					var lat = parseFloat(data[i].latitude);
					var lng = parseFloat(data[i].longitude);
					var latlng = new google.maps.LatLng(lat, lng);
					//###### Logo #######
					var careersPage = data[i].career_url;

					var company_name_orig =  data[i].name;
					if (careersPage) {
						careersLogo = '<a target="_blank" href="' + careersPage + '"><span class="fa fa-user"></span></a>';
					}

					var website = data[i].homepage_url;
					var company_name =  '<a target="_blank" style="font-size:14px" href="' + website + '">' + data[i].name + '</a>';
					if (website) {
						websiteLogo = '<a target="_blank" href="' + website + '"><span class="fa fa-external-link"></span></a>';
					}

					var linkedin = data[i].linkedin_url;
					if (linkedin) {
						linkedinLogo = '<a target="_blank" href="' + linkedin + '"><span class="fa fa-linkedin"></span></a>';
					}

					var facebook = data[i].facebook_url;
					if (facebook) {
						facebookLogo = '<a target="_blank" href="' + facebook + '"><span class="fa fa-facebook"></span></a>';
					}

					var twitter = data[i].twitter_url;
					if (twitter) {
						twitterLogo = '<a target="_blank" href="' + twitter + '"><span class="fa fa-twitter"></span></a>';
					}

					var angellist = data[i].angellist;
					if (angellist) {
						angellistLogo = '<a target="_blank" href="' + angellist + '"><span class="fa fa-angellist"></span></a>';
					}

					var github = data[i].github;
					if (github) {
						githubLogo = '<a target="_blank" href="' + github + '"><span class="fa fa-github"></span></a>';
					}

					var crunchbase = data[i].crunchbase_url;
					if (crunchbase) {
						crunchbaseLogo = '<a target="_blank" href="' + crunchbase + '"><img src="media/img/crunchbaseLogo.png"/></a>';
					}

					var blog = data[i].blog;
					if (blog) {
						blogLogo = '<a target="_blank" href="' + blog + '"><img src="media/img/blogLogo.png"/></a>';
					}

					var stackoverflow = data[i].stackoverflow_url;
					if (stackoverflow) {
						stackoverflowLogo = '<a target="_blank" href="' + stackoverflow + '"><span class="fa fa-stack-overflow"></span></a>';
					}

					var ventureloop = data[i].ventureloop;
					if (ventureloop) {
						ventureloopLogo = '<a target="_blank" href="' + ventureloop + '"><img src="media/img/ventureloopLogo.png"/></a>';
					}




					home_location = home_marker.getPosition();
					var distanceFromHome;
					if (google.maps.geometry) {
						distanceFromHome = google.maps.geometry.spherical.computeDistanceBetween(latlng, home_location);
					}
					cluster_flag = false;



					if (circleBounds.contains(latlng) == true && google.maps.geometry.spherical.computeDistanceBetween(current_circle, latlng) <= circle.getRadius()) {

						createMarker(lat, lng, company_size, funding, industry, tags, distanceFromHome, company_name, website, careersPage, careersLogo, websiteLogo, linkedinLogo, facebookLogo, twitterLogo, angellistLogo, githubLogo, crunchbaseLogo, blogLogo, stackoverflowLogo, ventureloopLogo, address, company_name_orig);
						console.log(distanceFromHome);

						exportTable += '<tr><td><input type="checkbox" class="" name="company" checked/></td> <td>' + company_name_orig + '</td><td>' + address + '</td><td>' + company_size + '</td>';
					}


				}
				console.log(li_values.length);
				//var hackerList = new List('hacker-list', li_options, li_values);
				if(li_values.length!=0)
				{
					$("#rightContainer").show();
					$("#rightContainer .search").show();
				}
			} else {
				//map.setZoom(14);

				$("#empty_search_Res_popup").css('display', 'block');
				$("#empty_search_Res_popup").html('<h3>No companies found</h3>');

				setTimeout(function() {
					$("#empty_search_Res_popup").hide();
				}, 5000);

			}
			$.cookie("companyData", $.cookie("companyData") + "&" + exportTable);
			map.fitBounds(circleBounds);
			markerClusterer = new MarkerClusterer(map, markers, {
				maxZoom: 50,
				gridSize: 50,
			});
			google.maps.event.addListener(markerClusterer, 'clusterclick', function(cluster) {
			    cluster_flag = true;
					smallCircle.setMap(null);
					$("#infowindow").hide();
			});
			$("#exportInfo").html(exportTable);
			console.log("maps end");
			spinner.stop();
		},
		error: function() {

		}
	});
	clearMarkers();

}



//##### create Circle #####
function clear_right_container() {

	$("#rightContainer .panel-default").html('');
}

function createCircle() {
	clear_right_container();
	if (selectedLocation) {
		selectedLocation = selectedLocation;
	} else {
		selectedLocation = map.getCenter();
	}


	if (circle) {
		circle.setMap(null);
	}

	if (smallCircle) {
		smallCircle.setMap(null);
	}


	circle = new google.maps.Circle({
		strokeColor: '#9999ff',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#b2b2ff',
		fillOpacity: 0.15,
		map: map,
		center: selectedLocation,
		radius: radius,
		editable: true
	});
	google.maps.event.addListener(circle, 'radius_changed', function(event) {
		map.fitBounds(circle.getBounds());
		var radius = circle.getRadius();
		clearMarker();
		filterList();
		smallCircle.setRadius((circle.getRadius()) * 5 / 100);
		var readable_radius = circle.getRadius() / 1000;
		readable_radius = Math.round(readable_radius * 100) / 100;
		if ($('input[name="measure"]:checked').val() == 'km') {
			readable_radius = readable_radius.toString() + " km";
		} else {
			readable_radius = readable_radius.toString() + " mil";
		}

		var myOptions = {
			content: readable_radius,
			boxStyle: {
				background: '#FFFFFF',
				borderRadius: "2px",
				textAlign: "center",
				fontSize: "15pt",
				width: "90px",
				height: "39px"
			},
			disableAutoPan: true,

		};
		if (radius_box) {
			radius_box.close();
		}
		radius_box = new InfoBox(myOptions);
		radius_box.open(map);
		radius_box.setPosition(circle.getBounds().getNorthEast());
	});

	smallCircleRadius = (circle.getRadius()) * 5 / 100;

	smallCircle = new google.maps.Circle({
		strokeColor: 'red',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: 'red',
		fillOpacity: 0.35,
		map: map,
		center: selectedLocation,
		radius: smallCircleRadius,
		draggable: true
	});


	/*strokeColor: 'red',
      strokeOpacity: 0.8,
      strokeWeight: 0,
      fillColor: 'red',
      fillOpacity: 0.35,
      map: map,
      center:selectedLocation,
      radius: 100,
	  draggable:true

	  google.maps.event.addListener(smallCircle, 'center_changed', function() {
		home_marker.setPosition(smallCircle.getCenter());
		circleCenter = smallCircle.getCenter();
		circle.setCenter(circleCenter);
		//filterList();
	});*/

	google.maps.event.addListener(circle, 'center_changed', function() {
		home_marker.setPosition(circle.getCenter());
		smallCircle.setCenter(circle.getCenter());
		smallCircle.setRadius((circle.getRadius()) * 5 / 100);
		selectedLocation = circle.getCenter();

		clearMarker();
		filterList();
	});


	/*google.maps.event.addListener(smallCircle, 'drag', function() {
		home_marker.setPosition(smallCircle.getCenter());
		circleCenter = smallCircle.getCenter();
		circle.setCenter(circleCenter);
		clearMarker();
		//filterList();
	});*/

	google.maps.event.addListener(smallCircle, 'dragend', function() {
		home_marker.setPosition(smallCircle.getCenter());
		circleCenter = smallCircle.getCenter();
		circle.setCenter(circleCenter);
		smallCircle.setRadius((circle.getRadius()) * 5 / 100);
		var radius = circle.getRadius();
		clearMarker();
		filterList();
	});



}

function open_marker_info(position) {

	var lat = markers[position].position.lat();
	var lng = markers[position].position.lng();
	var mev = {
		stop: null,
		latLng: new google.maps.LatLng(lat, lng)
	};
	google.maps.event.trigger(markers[position], 'click', mev);
}

function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setMapOnAll(null);
	markers = [];
	if (markerClusterer.setMap) {
		markerClusterer.clearMarkers();
	}
}

function addMarker(location) {
	var marker = new google.maps.Marker({
		position: location,
		map: map
	});
	markers.push(marker);
	return marker;
}
//###### Marker Creation ####
function createMarker(lat, lng, company_size, funding, industry, tags, distanceFromHome, company_name, website, careersPage, careersLogo, websiteLogo, linkedinLogo, facebookLogo, twitterLogo, angellistLogo, githubLogo, crunchbaseLogo, blogLogo, stackoverflowLogo, ventureloopLogo, address, company_name_orig) {
	if (distanceFromHome) {
		var dist = parseFloat(distanceFromHome / 1000);
		var medium = ' Miles';
		if ($('input[name="measure"]:checked').val() == 'km') {
			distanceFromHome = dist.toFixed(1) + ' Km';
			medium = ' Km';
		} else {
			distanceFromHome = dist.toFixed(1) + ' Miles';
		}

	}


	var mark = addMarker({
		lat: lat,
		lng: lng
	});
	$("#rightContainer .panel-default").append('<li class="panel-heading "><a class="company_name" >' + company_name_orig + ':</a></li>');
	li_values.push({
		company_name: company_name_orig,
	});
	cmpny_map[company_name_orig] = markers.length - 1;
	hackerList.add({
		company_name: company_name_orig
	});
	google.maps.event.addListener(mark, 'click', function(e) {
		var currentMarker = this;
		var tagsButton = '';
		var traelTime = '';
		//if(company_name){

		/*infoWindow.setContent('<b>Company Name:</b>' + company_name + '<br><b>Address:</b>' + address + '<br><b>URLs:</b>' + '<br><b>Careers:</b>' + '<br><b>Funding amount:</b>' + funding +
			'<br><b>Company Size:</b>' + company_size + '<br><b>Industry:</b>' + industry + '<br><b>Tags:</b>' + tags + '<br><b>Distance from Home:</b>' + distanceFromHome +
			'<br><b>Travel Time:</b><b id="travel_time"></b>' + '<br><b>Directions:</b> <button onclick="getDirection('+lat+','+lng+');" class="btn btn-success direction_icon">Go</button>' +
			'<br><b>Report as wrong: </b><button onclick="reportSpam(\''+company_name+'\', \''+address+'\')" class="btn btn-danger spam_icon"><span class="fa fa-exclamation"></span></button>');   */
		if (tags) {
			var tagString = tags.split(',');

			for (var k = 0; k < tagString.length; k++) {
				if (tagString[k]) {
					tagsButton += '<button class="btn btn-default tagsBtn">' + tagString[k] + '</button>';
				}
			}
		} else {
			tagsButton = 'No Tags';
		}
		geocoder.geocode({
			'latLng': e.latLng
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					//address = results[0].formatted_address;

					//########## get travel Time ##########
					var travel_mode = google.maps.TravelMode.DRIVING;

					if (parseFloat(distanceFromHome.split(medium)[0]) < 2) {
						travel_mode = google.maps.TravelMode.DRIVING;
					}
					var request = {
						origin: home_location,
						destination: e.latLng,
						travelMode: travel_mode
					};
					if (parseFloat(distanceFromHome.split(medium)[0]) < 150) {
						directionsService.route(request, function(result, status) {
							if (status == google.maps.DirectionsStatus.OK) {
								directionsDisplay.setOptions({
									preserveViewport: true
								});
								directionsDisplay.setDirections(result);
								directionsDisplay.setMap(map);
								directionsDisplay.setOptions( { suppressMarkers: true } );
								var step=1;
								traelTime = result.routes[0].legs[0].duration.text;
      					infowindow2.setContent(distanceFromHome + "<br>" + traelTime);
      					infowindow2.setPosition(result.routes[0].legs[0].steps[result.routes[0].legs[0].steps.length-2]
      					.end_location);
      					infowindow2.open(map);

							}
							//map.setCenter(e.latLng);


							/*
							infoWindow.setContent('<b><h4>' + company_name + '</h4></b><br>' + address + '<br>' + company_size + ' ' + industry + ' ' + funding + '<br>' + tagsButton + '<br><br>' +
								websiteLogo + ' ' + linkedinLogo + ' ' + facebookLogo + ' ' + twitterLogo + ' ' + angellistLogo + ' ' + githubLogo + ' ' + crunchbaseLogo + ' ' + blogLogo + ' ' +
								ventureloopLogo + '<br><br>' + careersLogo + ' ' + stackoverflowLogo + '<br><br><b><h4>' + distanceFromHome + ' ' + traelTime + '</h4></b> ');
							*/
							//infoWindow.open(map, currentMarker);
							$("#infowindow .modal-content").html('<b><h4>' + company_name + '</h4></b><br>' + address + '<br>' + company_size + ' ' + industry + ' ' + funding + '<br>' + tagsButton + '<br><br>' +
								websiteLogo + ' ' + linkedinLogo + ' ' + facebookLogo + ' ' + twitterLogo + ' ' + angellistLogo + ' ' + githubLogo + ' ' + crunchbaseLogo + ' ' + blogLogo + ' ' +
								ventureloopLogo + '<br><br>' + careersLogo + ' ' + stackoverflowLogo + '<br><br><b><h4>' + distanceFromHome + ' ' + traelTime + '</h4></b> ');
							$("#infowindow").show();
							feedback_counter +=1;
							if(feedback_flag && (feedback_counter-5)%10 == 0)
							{
								$("#userFeedback").modal({show:true});
							}
							//var pointA = circle.getCenter();
							//var pointB = pointA.destinationPoint(120, (radius/1000 + 2.3));
							//infoWindow.setPosition(pointB);
							//infoWindow.setPosition(circle.getBounds().getNorthEast());
						});
					}
				}
			}
		});



		//}
	});
}


//buaaaa
Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}

Number.prototype.toDeg = function() {
   return this * 180 / Math.PI;
}

google.maps.LatLng.prototype.destinationPoint = function(brng, dist) {
   dist = dist / 6371;
   brng = brng.toRad();

   var lat1 = this.lat().toRad(), lon1 = this.lng().toRad();

   var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                        Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

   var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                                Math.cos(lat1),
                                Math.cos(dist) - Math.sin(lat1) *
                                Math.sin(lat2));

   if (isNaN(lat2) || isNaN(lon2)) return null;

   return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg());
}
//buaaaa


function createHomeMarker(lat, lng) {

	home_marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, lng),
		icon: 'media/img/marker-yellow.png',
		map: map
	});
	home_location = home_marker.getPosition();
	google.maps.event.addListener(home_marker, 'click', function() {
		infoWindow.setContent('Home Locaton');
		infoWindow.open(map, this);
	});

	$("#searchContainer").hide();
	$(".searchPart").css("display", "block");

	$("#leftContainer").css("display", "block");
	createCircle();
	filterList();

}

function clearMarker() {
	if (markers) {
		for (var j = 0; j < markers.length; j++) {
			markers[j].setMap(null);
		}

		markers = [];
	}
}

function reportSpam(company, address) {
	$.ajax({
		type: "POST",
		url: "spam_report.php",
		data: 'compnay=' + company + '&address=' + address,
		success: function(data) {
			console.log(data);
		}
	});

}
//####### direction service #########
function getDirection(lat, lng) {
	var companyLoc = new google.maps.LatLng(lat, lng);
	var request = {
		origin: home_location,
		destination: companyLoc,
		travelMode: google.maps.TravelMode.DRIVING
	};

	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(result);
			//console.log(result.routes[0].legs[0].duration.text);
			$("#travel_time").html(result.routes[0].legs[0].duration.text);
			directionsDisplay.setMap(map);
		}
	});

}

//######## new company details ##########
function saveNewCompany() {
	var newCompany = $("#companyName").val();
	var newEmail = $("#e_mail").val();
	var newWebiste = $("#website").val();
	var newCareers = $("#careersPage").val();
	var newAddress = $("#newLoc_Address").val();
	var capchaText = $("#captcha").val();
	var industryType = $("#industryType").val();
	var founded = $("#founded").val();
	var company_size = $("#company_size").val();

	var lat;
	var lng;

	geocoder.geocode({
		'address': newAddress
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {

			lat = results[0].geometry.location.lat();
			lng = results[0].geometry.location.lng();

			var distance = google.maps.geometry.spherical.computeDistanceBetween(home_marker.getPosition(), new google.maps.LatLng(lat, lng));

			if (newCompany == "") {
				$(".cNameError").html('*');
			}
			if (newAddress == "") {
				$(".AddressError").html('*');
			}
			if (capchaText == "") {
				$(".CapchaError").html('*');
			} else {
				if (newCompany && newAddress) {
					$.ajax({
						type: "POST",
						url: "addnewcompany.php",
						data: "cname=" + newCompany + "&email=" + newEmail + "&website=" + newWebiste + "&careers=" +
							newCareers + "&address=" + newAddress + "&capchaText=" + capchaText + "&lat=" +
							lat + "&lng=" + lng + '&distance=' + distance + '&industry=' + industryType + '&founded=' +
							founded + '&company_size=' + company_size + '&linkedinShare=' + linkedinShare + '&twitterShare=' +
							twitterShare + '&facebookShare=' + facebookShare + '&stackoverflowShare=' + stackoverflowShare + '&tags=' + newTags,
						success: function(data) {
							if (data == 1) {
								location.reload();
							} else {
								$(".CapchaError").html('* Error');
							}

						}
					});
				}

			}

		} else {
			alert("Please Enter correct Location");
		}
	});


}
//######## ADD NEW LINKS #########
function addLinks() {

	var shareLink = $("#addLink").val();
	if (shareLink) {
		var splitUrl = shareLink.toLowerCase();
		var stringUrl = splitUrl.split('/');
		var url = stringUrl[2];

		if (url == 'linkedin.com') {
			var links = url.split('.');
			//shareUrlName+=links[0] + '<img src="media/img/linkedin.ico"> ';
			shareUrlName += '<img src="media/img/linkedin.ico"> ';
			linkedinShare = shareLink;
		} else if (url == "twitter.com") {
			links = url.split('.');
			//shareUrlName+=links[0] + '<img src="media/img/twitter.ico"> ';
			shareUrlName += '<img src="media/img/twitter.ico"> ';
			twitterShare = shareLink;
			// selectedShareLinks+='"' + links[0]+ '",';
		} else if (url == 'www.facebook.com') {
			var links = url.split('.');
			//shareUrlName+=links[1] + '<img src="media/img/fb_favicon.ico"> ';
			shareUrlName += '<img src="media/img/fb_favicon.ico"> ';
			facebookShare = shareLink;
			// selectedShareLinks+='"' + links[1]+ '",';
		} else if (url == "careers.stackoverflow.com") {
			var links = url.split('.');
			shareUrlName += '<img style="width: 15px;" src="media/img/Stackoverflow.ico"> ';
			//shareUrlName+=links[1] + '<img src="media/img/Stackoverflow.png"> ';
			stackoverflowShare = shareLink;
			//selectedShareLinks+='"' + links[1]+ '",';
		} else {

		}
	} else {
		alert("Please Enter Url");
	}
	$("#share_links").html(shareUrlName);
}
//######## search Mylocation#############

function searchMylocation() {

	//####### GeoLocation Finder #######
	if (navigator.geolocation) {
		watchID = navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		alert('Your browser is out of fashion, there\'s no geolocation!');
	}

	function showPosition(position) {
		sharedLocationFlag = true;
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		var latlong = new google.maps.LatLng(lat, lng);

		map.setCenter(latlong);
		//map.setZoom(13);
		getAddress(latlong);
		selectedLocation = latlong;
		if (!$.cookie('HomeLocation')) {
			$.cookie('HomeLocation', latlong);
			var geocoder = geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'latLng': latlong
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						$("#home_address_modal .address_content").html(results[1].formatted_address);
						$("#address_edit").removeClass("hide");

					}
				}
			});

		}
		if (!home_marker) {
			createHomeMarker(lat, lng);
		} else {
			home_marker.setPosition(latlong);
		}
	}
}

//###### ind Location Based on ISP #######

function find_ISP_location() {

	//if(!home_marker && !selectedPlace){
	if (!sharedLocationFlag) {
		$.get("http://ipinfo.io", function(response) {
			var resLatLng = response.loc;
			var str_split = resLatLng.split(',');
			var lat = str_split[0];
			var lng = str_split[1];
			selectedLocation = new google.maps.LatLng(lat, lng);
			map.setCenter(selectedLocation);

			$("#location_search_top").val(response.city + ", " + response.region);
			$("#placeSearch").val(response.city + ", " + response.region);

			if (!home_marker) {
				createHomeMarker(lat, lng);
			} else {
				home_marker.setMap(null);
				createHomeMarker(lat, lng);
			}


		}, "jsonp");
	}
	//}else{
	//alert("Already shared...");
	//}

}


//###### NEW company Location Map ########

var smallMap;

function closepopupMap() {
	$("#pop_map").css('visibility', 'hidden');
}
$(function() {


	var auto_complete = new google.maps.places.Autocomplete(document.getElementById('newLoc_Address'));

	var locationMarker;
	$("#btnShowMap").click(function() {
		$("#pop_map").css('visibility', 'visible');
		var mapOptions = {
			center: new google.maps.LatLng(9.9312328, 76.26730410000005),
			zoom: 10,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		}
		smallMap = new google.maps.Map(document.getElementById("LocationMap"), mapOptions);

		var loctionfinder = new google.maps.places.Autocomplete(document.getElementById('locationFinder'));

		google.maps.event.addListener(loctionfinder, 'place_changed', function() {
			var place = loctionfinder.getPlace();
			smallMap.setCenter(place.geometry.location);
		});

		google.maps.event.addListener(smallMap, 'click', function(e) {
			getAddress(e.latLng);

			if (locationMarker) {
				locationMarker.setMap(null);
			}
			locationMarker = new google.maps.Marker({
				position: e.latLng,
				map: smallMap
			});

			$("#pin_lat").val(locationMarker.position.H);
			$("#pin_lng").val(locationMarker.position.L);
		});

	});
});

//####### reverse Geocoding ########
function getAddress(latLng) {
	geocoder.geocode({
			'latLng': latLng
		},
		function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					$("#newLoc_Address").val(results[0].formatted_address);
					$("#editLoc_Address").val(results[0].formatted_address);
					$("#placeSearch").val(results[0].formatted_address);

				} else {
					$("#newLoc_Address").val("");
				}

			} else {
				alert(status);
			}

		});
}


function refreshCaptcha() {
	$("#captcha_code").attr('src', 'captcha_code.php');
}

function EditCompanyDetails() {
	var cname = $("#newCompanyName").val();
	$("#EditCompanyinfo").modal('show');
	$('#EditCompanyinfo').load('edit.php', {
		"company": cname
	});

}


//######### Export data ###########

function exportCompany() {
	$("#contactMail").hide();

	var selectedLoc = '';
	if (exportTable != '') {
		$("#exportTable").css("display", "block");
	} else {
		$("#emptyExport").show();
		$("#emptyExport").html("No companies on the map to export.Please do a company / address search.");
		setTimeout(function() {
			$("#emptyExport").hide();
		}, 5000);

	}
	//$("#placeSearch").css("display", "none");

	/*	if($.cookie("companyData")){
	var searchPlace=$.cookie("companyData").split('&');
	for(var i=0; i<searchPlace.length; i++){
		if(searchPlace[i] != 'undefined'){

			$("#exportInfo").html($.cookie("companyData"));

		}
	}
	}
			else{
					$("#exportTable").hide();
					$("#emptyExport").show();
					$("#emptyExport").html("No companies on the map to export.Please do a company / address search.");
					setTimeout(function(){
					 $("#emptyExport").hide();
					}, 5000);
				}*/

}

function showMapPage() {

	$("#contactMail").hide();

	if (selectedPlace) {
		$("#exportTable").css("display", "none");
		//$("#placeSearch").css("display", "block");
		$("#leftContainer").css("display", "block");
	} else {
		$("#exportTable").css("display", "none");
		//$("#placeSearch").css("display", "block");
	}

	if ($.cookie('HomeLocation')) {
		var str_split = $.cookie('HomeLocation').split(',');
		console.log(str_split);
		var split_lat = str_split[0].split('(');
		var split_lng = str_split[1].split(')');
		home_location = new google.maps.LatLng(split_lat[1], split_lng[0]);
		go_to_home = true;
		map.setCenter(home_location);
		selectedLocation = home_location;
		createCircle();
		$("#location_search_top").val("");
		var geocoder = geocoder = new google.maps.Geocoder();
		geocoder.geocode({
			'latLng': selectedLocation
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					$("#home_address_modal .address_content").html(results[1].formatted_address);
					$("#address_edit").removeClass("hide");

				}
			}
		});
		createHomeMarker(home_location.lat(), home_location.lng());
	}
	$("#home_address_modal").toggle();
	//else {
	// 	alert("No home location found. Finding IP address location..");
	// 	find_ISP_location();

	// }
}

//######### Tags Search ###########
function searchTags() {
	$("#company_search_top").val($("#inputCompany").val());
	filterList();

}

//######### Tags Clear ###########
function clearall_tags() {

	$("#searchComp_text, #company_search_top, #inputCompany, ").val('');
	$("#inputTags").val('');
	$("#tagsList").html('');
	$(".selected_tags").remove();
	selectedTags = '';
	tagsArray = [];
	filterList();

}

//######### admin Edit ###############
var map_Canvas;
var locationMarker;

function createMap() {

	$("#mapModal").show();
	var mapOptions = {
		zoom: 10,
		center: new google.maps.LatLng(9.9312328, 76.26730410000005)
	};
	map_Canvas = new google.maps.Map(document.getElementById('map-div'), mapOptions);

	var loctionfinder = new google.maps.places.Autocomplete(document.getElementById('Locationfinder'));

	google.maps.event.addListener(loctionfinder, 'place_changed', function() {
		var place = loctionfinder.getPlace();
		map_Canvas.setCenter(place.geometry.location);
	});

	google.maps.event.addListener(map_Canvas, 'click', function(e) {
		getAddress(e.latLng);

		if (locationMarker) {
			locationMarker.setMap(null);
		}
		locationMarker = new google.maps.Marker({
			position: e.latLng,
			map: map_Canvas
		});
	});

}

function editNewCompany() {
	var compnay = $("#edit_companyName").val();
	var website = $("#edit_website").val();
	var careersPage = $("#edit_careersPage").val();
	var address_div = $("#editLoc_Address").val();
	var e_mail = $("#edit_e_mail").val();
	var lat;
	var lng;

	geocoder.geocode({
		'address': address_div
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {

			lat = results[0].geometry.location.lat();
			lng = results[0].geometry.location.lng();

			var distance = google.maps.geometry.spherical.computeDistanceBetween(home_marker.getPosition(), new google.maps.LatLng(lat, lng));


			$.ajax({
				type: "POST",
				url: "editCompany.php",
				data: "compnay=" + compnay + "&website=" + website + "&careers=" + careersPage +
					"&address=" + address_div + "&email=" + e_mail + "&lat=" +
					lat + "&lng=" + lng + '&distance=' + distance,
				success: function() {
					//location.reload();
				}

			});
		}
	});

}

function hideModal() {
	$("#mapModal").hide();
}


$(document).ready(function() {
	$('[data-toggle="popover"]').popover();
	if ($.cookie('userFeedback') != '1') {
    //show popup here
		feedback_flag = true;
    $.cookie('userFeedback', '1', { expires: 60});
	}
	$(".cb-enable").click(function() {
		var parent = $(this).parents('.switch');
		$('.cb-disable', parent).removeClass('selected');
		$(this).addClass('selected');
		$('.checkbox', parent).attr('checked', true);
	});
	$(".cb-disable").click(function() {
		var parent = $(this).parents('.switch');
		$('.cb-enable', parent).removeClass('selected');
		$(this).addClass('selected');
		$('.checkbox', parent).attr('checked', false);
	});
	$("#rightContainer .panel-default").on("click", "a", function() {
		open_marker_info(cmpny_map[$(this).text()]);
	});
	$(".check_all").trigger("change");
	var projects = [{
		value: "jquery",
		label: "jQuery",
		desc: "the write less, do more, JavaScript library",
		icon: "jquery_32x32.png"
	}, {
		value: "jquery-ui",
		label: "jQuery UI",
		desc: "the official user interface library for jQuery",
		icon: "jqueryui_32x32.png"
	}, {
		value: "sizzlejs",
		label: "Sizzle JS",
		desc: "a pure-JavaScript CSS selector engine",
		icon: "sizzlejs_32x32.png"
	}];

	auto_tagx = $("#location_search_top_comp").autocomplete({
		minLength: 2,
		source: function(request, response) {
			console.log(request);
			var post_data = {
				'company': request.term
			};

			$.ajax({
				contentType: "application/json",
				method: "POST",
				url: 'http://peeqmaps.com/app/open/co_maps/cosrchlvl1.json',
				data: JSON.stringify(post_data),
				success: function(data) {
					var a = [];
					for (var i in data.companies) {
						var indv_item = {
							'name': data.companies[i].name
						};
						if (data.companies[i].city_count > 1) {
							indv_item['multiple'] = true;
						}
						a.push(indv_item);
					}
					response(a);
				}
			});

		},
		focus: function(event, ui) {

			$("#inputTags").val(ui.item.name);
			return false;
		},
		select: function(event, ui) {
			$("#inputTags").val(ui.item.name);
			return false;
		}
	});
	auto_tagx.autocomplete("instance")._renderItem = function(ul, item) {

		var element = "<span><a class='autofill-tag'>" + item.name + "</a>";
		if (item.multiple) {
			element += "<span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>";
		}
		element += "</span>";
		return $("<li>")
			.append(element)
			.appendTo(ul);
	};
	auto_tagx.autocomplete("instance")._renderMenu = function(ul, items) {
		var that = this;
		$.each(items, function(index, item) {
			that._renderItemData(ul, item);
		});
		$(ul).css({
			"z-index": 9999
		});
	};
	$("#integrated_search").on("change", function() {
		if ($(this).val() == "Company") {
			$("#location_search_top_comp").show();
			$("#location_search_top").hide();
		} else {
			$("#location_search_top").show();
			$("#location_search_top_comp").hide();
		}
	});
	$("body").on("click", ".autofill-tag", function() {
		var post_data = {
			'company': $(this).text()
		};
		$.ajax({
			dataType: "json",
			method: "POST",
			url: 'http://peeqmaps.com/app/open/co_maps/cosrchlvl2.json',
			data: JSON.stringify(post_data),
			success: function(data) {
				var modal = $('#autofill-modal');
				var company_details = '';
				$.each(data.cities, function(i, branch) {
					company_details += '<li><a class="cmpny-branch" href="#" data-cc="' + branch.country_code + '" data-cmp="';
					company_details += data.search.company + '" data-city="' + branch.city + '">';
					company_details += branch.full_addr + '</a></li>';
				});
				modal.find("ul").html(company_details);
				modal.show();
			}
		});

	});
	$(".close").on("click", function() {
		$(this).closest('.modal-dialog').hide();
	});

$("#userFeedback_button").on("click", function(){
	feedback_flag = false;
	$("#userFeedback").modal("hide");
	var post_data = {
   "clientAppName":"peeq-maps",
   "entityName":"User",
   "property1Name":"email",
   "property1Value":$("#userFeedback_email").val()
}
	$.ajax({
		dataType: "json",
		method: "POST",
		contentType:"application/json",
		url: 'http://admin.peeqmaps.com/peeq-service/rest/genericdatacaptures',
		data: JSON.stringify(post_data),
		success: function(data) {
			console.log("response recieved");
		}
});
alert("Thanks for registering with us");


});

	$("body").on("click", ".cmpny-branch", function() {
		var post_data = {
			"company": $(this).data("cmp"),
			"city": null,
			"country_code": null
		};
		console.log(post_data);
		if ($(this).data("city") != "undefined") {
			post_data["city"] = $(this).data("city");
		}
		if ($(this).data("cc") != "undefined") {
			post_data["country_code"] = $(this).data("cc");
		}
		console.log(post_data);
		$.ajax({
			dataType: "json",
			method: "POST",
			url: 'http://peeqmaps.com/app/open/co_maps/cosrchlvl3.json',
			data: JSON.stringify(post_data),
			success: function(data) {
				var data = data.companies;

				for (var i = 0; i < 1; i++) {
					var company_name = data[i].name;
					var address = data[i].full_addr;
					var company_size = data[i].num_employees;
					var funding = data[i].funding_status;
					var industry = data[i].industry;
					var tags = '';
					var lat = parseFloat(data[i].latitude);
					var lng = parseFloat(data[i].longitude);
					var latlng = new google.maps.LatLng(lat, lng);
					var num_result = 0;
					var careersLogo = '';
					var websiteLogo = '';
					var linkedinLogo = '';
					var facebookLogo = '';
					var twitterLogo = '';
					var angellistLogo = '';
					var githubLogo = '';
					var crunchbaseLogo = '';
					var blogLogo = '';
					var stackoverflowLogo = '';
					var ventureloopLogo = '';
					//###### Logo #######
					var careersPage = data[i].homepage_url;
					if (careersPage) {
						careersLogo = '<a target="_blank" href="' + careersPage + '"><span class="fa fa-user"></span></a>';
					}

					var website = data[i].homepage_url;
					if (website) {
						websiteLogo = '<a target="_blank" href="' + website + '"><span class="fa fa-external-link"></span></a>';
					}

					var linkedin = data[i].linkedin_url;
					if (linkedin) {
						linkedinLogo = '<a target="_blank" href="' + linkedin + '"><span class="fa fa-linkedin"></span></a>';
					}

					var facebook = data[i].facebook_url;
					if (facebook) {
						facebookLogo = '<a target="_blank" href="' + facebook + '"><span class="fa fa-facebook"></span></a>';
					}

					var twitter = data[i].twitter_url;
					if (twitter) {
						twitterLogo = '<a target="_blank" href="' + twitter + '"><span class="fa fa-twitter"></span></a>';
					}

					var angellist = data[i].angellist;
					if (angellist) {
						angellistLogo = '<a target="_blank" href="' + angellist + '"><span class="fa fa-angellist"></span></a>';
					}

					var github = data[i].github;
					if (github) {
						githubLogo = '<a target="_blank" href="' + github + '"><span class="fa fa-github"></span></a>';
					}

					var crunchbase = data[i].crunchbase_url;
					if (crunchbase) {
						crunchbaseLogo = '<a target="_blank" href="' + crunchbase + '"><img src="media/img/crunchbaseLogo.png"/></a>';
					}

					var blog = data[i].blog;
					if (blog) {
						blogLogo = '<a target="_blank" href="' + blog + '"><img src="media/img/blogLogo.png"/></a>';
					}

					var stackoverflow = data[i].stackoverflow_url;
					if (stackoverflow) {
						stackoverflowLogo = '<a target="_blank" href="' + stackoverflow + '"><span class="fa fa-stack-overflow"></span></a>';
					}

					var ventureloop = data[i].ventureloop;
					if (ventureloop) {
						ventureloopLogo = '<a target="_blank" href="' + ventureloop + '"><img src="media/img/ventureloopLogo.png"/></a>';
					}
					home_location = home_marker.getPosition();
					var distanceFromHome;
					if (google.maps.geometry) {
						distanceFromHome = google.maps.geometry.spherical.computeDistanceBetween(latlng, home_location);
					}
					selectedLocation = new google.maps.LatLng(lat, lng);
					map.setCenter(selectedLocation);
					createCircle();
					cluster_flag = false;
					$("#rightContainer").show();
					createMarker(lat, lng, company_size, funding, industry, tags, distanceFromHome, company_name, website, careersPage, careersLogo, websiteLogo, linkedinLogo, facebookLogo, twitterLogo, angellistLogo, githubLogo, crunchbaseLogo, blogLogo, stackoverflowLogo, ventureloopLogo, company_name_orig);


				}


				$('#autofill-modal').hide();

			}
		});
	});

	spinner = new Spinner();


});

google.maps.event.addDomListener(window, 'load', initialize);
var li_options = {
    valueNames: [ 'company_name'],
		item:'<li class="panel-heading "><a class="company_name" >:</a></li>'
};
