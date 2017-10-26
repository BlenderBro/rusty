// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    window.ga.startTrackerWithId('UA-108514351-1', 30);
    initAd();

});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {

        
    }
})

$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'terms') {

    }
})

/** 
 * 1. First we prompt the user to pick a photo from the gallery. 
 * 2. After the photo is loaded, we start a timer then open the camera app.
 * 3. After the picture is taken we first save the file from cache to gallery and use the base64
 *    cached version to calculate the average rgb values.
 * 4. Use the rgb.r value to get a percentage.  
*/

$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;
    if (page.name === 'picture') {  
        showBannerFunc();
        document.getElementById("bar").style.display = 'none';      
        document.getElementById("btn").addEventListener('click', function(){
            navigator.camera.getPicture(function(result){                             
                document.getElementById("temp").style.display = "none";
                document.getElementById("imgPath").setAttribute("src", result);
                document.getElementById("timer").style.display = "block";
              //Start a counter when the image is loaded
                if (result != null){
                    var timeleft = 10;
                    var tick = setInterval(function(){
                    timeleft--;
                    document.getElementById("ctdown").textContent = timeleft;
                    if(timeleft <= 0){
                        clearInterval(tick);
                    }if(timeleft === 0){
                //When the counter reaches 0, open the front facing camera
                        navigator.camera.getPicture(function(file){

                            // Hide previus html and show intermediate splash
                            document.getElementById("stepTwo").style.display = "none";
                            document.getElementById("stepThree").style.display = "block";
                            
                            document.getElementById("rawImg").setAttribute("src", "data:image/jpeg;base64," + file);
                            console.log(document.getElementById("rawImg"));
                            // Hide splash and show results page after x seconds
                            setTimeout(showResults,5000);
                            

                            function showResults(){
                                document.getElementById("stepThree").style.display = "none";
                                document.getElementById("results").style.display = "block";
                            }

                            //Calculate percentage

                            var rgb = getPercentage(document.getElementById('rawImg'));
                            //Skew by x
                            // var x = (Math.random() * 30) + 21;
                            function randomIntFromInterval(min,max){

                                return Math.floor(Math.random()*(max-min+1)+min);
                            }
                            var x = randomIntFromInterval(62, 94);


                            var rawPercentage = rgb.r * 100 / 255 + x; 
                            var percentage = parseFloat(rawPercentage).toFixed(1);
                            console.log('% = ' + percentage);

                            var showPercentage = document.getElementById("showPercentage");
                            showPercentage.innerHTML = percentage + "%";

                            function getPercentage(imgEl) {
                                
                                var blockSize = 5, // only visit every 5 pixels
                                    defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
                                    canvas = document.createElement('canvas'),
                                    context = canvas.getContext && canvas.getContext('2d'),
                                    data, width, height,
                                    i = -4,
                                    length,
                                    rgb = {r:0,g:0,b:0},
                                    count = 0;
                                    
                                if (!context) {
                                    return defaultRGB;
                                }
                                
                                height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
                                width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
                                
                                context.drawImage(imgEl, 0, 0);
                                
                                try {
                                    data = context.getImageData(0, 0, width, height);
                                } catch(e) {
                                    /* security error, img on diff domain */alert('x');
                                    return defaultRGB;
                                }
                                
                                length = data.data.length;
                                
                                while ( (i += blockSize * 4) < length ) {
                                    ++count;
                                    rgb.r += data.data[i];
                                    rgb.g += data.data[i+1];
                                    rgb.b += data.data[i+2];
                                }
                                
                                // ~~ used to floor values
                                rgb.r = ~~(rgb.r/count);
                                rgb.g = ~~(rgb.g/count);
                                rgb.b = ~~(rgb.b/count);
                                
                                console.log('Red: ' + rgb.r);
                                console.log('Green: ' + rgb.g);
                                console.log('Blue: ' + rgb.b);

                                return rgb;
                                
                            }

                            },function(error){

                            console.log(error);
                            },
                            {
                            quality : 50, 
                            destinationType : Camera.DestinationType.DATA_URL,  //Use base64                      
                            sourceType : Camera.PictureSourceType.CAMERA, 
                            //allowEdit : true,
                            encodingType: Camera.EncodingType.JPEG,
                            popoverOptions: CameraPopoverOptions,
                            saveToPhotoAlbum: true
                            });
                        }                        
                    },1000);    
                }                  
            },
                function(error){
                    console.log(error);
                },
                {
                //Get picture from gallery
                sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM
            });            
        })
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    //myApp.alert('Here comes About page');
})

function initAd(){
    if ( window.plugins && window.plugins.AdMob ) {
        var ad_units = {
            android : {
                banner: 'ca-app-pub-7726043422573758/7006493458',		//PUT ADMOB ADCODE HERE 
            }
        };
        var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;

        window.plugins.AdMob.setOptions( {
            publisherId: admobid.banner,
            //interstitialAdId: admobid.interstitial,
            adSize: window.plugins.AdMob.AD_SIZE.SMART_BANNER,	//use SMART_BANNER, BANNER, LARGE_BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD 
            bannerAtTop: false, // set to true, to put banner at top 
            overlap: true, // banner will overlap webview 
            offsetTopBar: false, // set to true to avoid ios7 status bar overlap 
            isTesting: false, // receiving test ad 
            autoShow: true // auto show interstitial ad when loaded 
        });

        registerAdEvents();
    } else {
        //alert( 'admob plugin not ready' ); 
    }
}
//functions to allow you to know when ads are shown, etc. 
function registerAdEvents() {
    document.addEventListener('onReceiveAd', function(){});
    document.addEventListener('onFailedToReceiveAd', function(data){});
    document.addEventListener('onPresentAd', function(){});
    document.addEventListener('onDismissAd', function(){ });
    document.addEventListener('onLeaveToAd', function(){ });
    document.addEventListener('onReceiveInterstitialAd', function(){ });
    document.addEventListener('onPresentInterstitialAd', function(){ });
    document.addEventListener('onDismissInterstitialAd', function(){ });
}

//display the banner 
function showBannerFunc(){
    window.plugins.AdMob.createBannerView();
}
//display the interstitial 
function showInterstitialFunc(){
    window.plugins.AdMob.createInterstitialView();	//get the interstitials ready to be shown and show when it's loaded. 
    window.plugins.AdMob.requestInterstitialAd();
}