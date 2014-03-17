var APP = (function(){

    var locations;
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            myLocation(position.coords.latitude, position.coords.longitude);
        });
    } else {
        console.log('geolocation not available');
    }

    function myLocation(lat, lng){

        var xhReq = new XMLHttpRequest();
        xhReq.open("GET", "locations/"+lat+"/"+lng, false);
        xhReq.send(null);
        var serverResponse = xhReq.responseText;
        console.log(serverResponse);
        locations = JSON.parse(serverResponse);
        displayLocations();

    }

    function displayLocations(){
        var list = document.getElementById('breweryList')
            ,ct = document.getElementById('breweryCount')
            ,i = locations.totalResults
            ,brewery = "";

        ct.innerHTML = locations.totalResults;

        while(i--){
            brewery += '<article class="brewery">';
            brewery += '<header class="brewery-name">'+locations.data[i].brewery.name+'</header>';
            brewery += '<div class="brewery-address">'+locations.data[i].streetAddress +', '+locations.data[i].locality+'</div>';
            if(locations.data[i].brewery.website){
                brewery += '<div class="brewery-web">'+locations.data[i].brewery.website +'</div>';
            }else{
                brewery += '<div class="brewery-web">no website</div>';
            }
            if(locations.data[i].phone){
                brewery += '<div class="brewery-phone">'+locations.data[i].phone +'</div>';
            }else{
                brewery += '<div class="brewery-phone">no phone number</div>';
            }
            if(locations.data[i].openToPublic === 'Y'){
                brewery += '<div class="brewery-open">Open to the public</div> ';
            }else{
                brewery += '<div class="brewery-phone">Not open to the public</div> ';
            }


            brewery += '</article>';



        }

        list.innerHTML = brewery;


    }



}(APP || {}))
