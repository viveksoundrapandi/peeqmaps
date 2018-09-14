var job_object = job_object || {};
window.job_object = job_object;
job_object.network = function () {
    function post(url, data, success, failure) {

        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                success(response);
            },
            error: function (error) {
                failure && failure(error);
            },
            data: JSON.stringify(data)
        });
    }

    return {
        post: post
    }
};
job_object.map_controller = function (job_details) {
    let map;
    let directionsDisplay = new google.maps.DirectionsRenderer();
    let markers = [];
    let info_window =new google.maps.InfoWindow();

    function addMarker(job_details, location_detail, index) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(location_detail.latitude, location_detail.longitude),
            map: map
        });
        google.maps.event.addListener(marker, 'click', (function(marker, index) {
            return function() {
                info_window.setContent(`<div><p>${job_details.coName}</p><p>${location_detail.fullAddr}</p><p>${job_details.coHomepageUrl}</p></div>`);
                info_window.open(map, marker);
            }
        })(marker, index));
        markers.push(marker);
    }
    function initialize() {
        $("#leftContainer").css("display", "none");
        var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(job_details.jobLocations[0]["latitude"], job_details.jobLocations[0]["longitude"]),
            disableDefaultUI: true,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.RIGHT_CENTER
            },

        };
        map = new google.maps.Map(document.getElementById("mapCanvas"), mapOptions);

        directionsDisplay.setMap(map);
        job_details.jobLocations.forEach(function (location_detail, index) {
            addMarker(job_details, location_detail, index);
        });
        new google.maps.event.trigger( markers[0], 'click' );

    }

    return {
        initialize: initialize
    }
};


job_object.job_seeker = function () {
    let job_url;
    const BASE_API_URL = "https://api.peeqentity.com/peeq-service/rest/o/jobinfo/srch";
    function validate_job_params() {
        let url = new URL(window.location.href);
        if (!url.searchParams.get("job_url")) {
            throw_error("Invalid job URL");
            return;
        }
        job_url = url.searchParams.get("job_url");

        // job_url = "https://www.naukri.com/fidelity/xyz"
    }

    function throw_error(error_message) {
        alert(error_message);
        // window.close();
    }


    function plot_job_details() {
        validate_job_params();
        let network = job_object.network();
        network.post(`${BASE_API_URL}`, {"jobUrl":job_url}, function (response) {
            // response = {
            //     "status": null,
            //     "messages": null,
            //     "search": {
            //         "jobUrl": "https://www.subex.com/job-1234"
            //     },
            //     "count": 1,
            //     "coLocations": [
            //         {
            //             "latitude": "12.92562000",
            //             "longitude": "77.68781300",
            //             "distanceInMeters": null,
            //             "locId": 106731,
            //             "coId": 189917,
            //             "locLabel": "STEEL AUTHORITY OF INDIA (SAIL) Office",
            //             "coName": "Subex Technologies",
            //             "coDomain": "subex.com",
            //             "coHomepageUrl": "https://www.subex.com/"
            //         },
            //         {
            //             "latitude": "12.663105",
            //             "longitude": "76.961394",
            //             "distanceInMeters": null,
            //             "locId": 106732,
            //             "coId": 189917,
            //             "locLabel": "STEEL2 AUTHORITY OF INDIA (SAIL) Office",
            //             "coName": "Sube2x Technologies",
            //             "coDomain": "subex2.com",
            //             "coHomepageUrl": "https://www.subex.com/"
            //         }
            //     ],
            //     "serverRuntimeInMs": 3
            // };

            let map_controller = job_object.map_controller(format_response(response));
            map_controller.initialize();
        });
    }
    function format_response(response){
        response.values[0].jobLocations.forEach(function (location) {
            location.latitude = parseFloat(location.latitude);
            location.longitude = parseFloat(location.longitude);
        });
        return response.values[0];
    }

    return {
        plot_job_details: plot_job_details
    };
};

$(document).ready(function () {
    job_object.job_seeker().plot_job_details();
});