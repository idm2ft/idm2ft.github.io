// Global variables
var mapCenter = [13.340733, 52.492112];
var mapZoom = 11.20;


// --------------------------------------------------------
// 1. Initialize map
   mapboxgl.accessToken = 'pk.eyJ1IjoiaWRtMmZ0IiwiYSI6ImNrZjQ5bnRrOTBhdjcyenBqb3RsbWoybGgifQ.Q6b-Bl2sM3YJmHIXSXRexQ';

var map = new mapboxgl.Map({
	container: 'map',
	minZoom: 10,
	maxZoom: 17,
	style: 'mapbox://styles/idm2ft/ckf65pf060pbl19npv1gchbsy', 	
});

// -------------------------------------------------------- 
// 2. Show/hide layers
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [MapboxlayerName, layerDisplayName]
        ['contour', 'Road Network'],             // 'Point_O':layers[0][0],'PizzaHut': layers[0][1]     
        ['road', 'Program'],         
        ['landuse (1)', 'Transit Network'], 
        ['Updated', 'Site Points'], 
    
        // add additional live data layers here as needed  
    ]; 


    //DON'T CHANGE
    //functions to perform when map loads
    map.on('load', function () {     
        for (i=0; i<layers.length; i++) {
            // add a button for each layer
            $("#layers-control").append("<a href='#' class='button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
        }

        // show/hide layers when button is clicked
        $("#layers-control>a").on('click', function(e) {
                var clickedLayer = e.target.id;
                e.preventDefault();
                e.stopPropagation();
            
                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  
                //see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none'); //https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); 
                    //see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
        });  
    });


// -------------------------------------------------------- 
// 3. Scroll to zoom through sites
// See example at https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/
    
    // A JavaScript object containing all of the data for each site "chapter" (the sites to zoom to while scrolling)
    var chapters = {
        'chapter01': {
            name: "01: Schuttbergen",
            description: "The history of rubble mountains implicates the entirety of Berlin, as evidenced by the historical sites catalogued as points.",
            bearing: 0,
            center: [13.415, 52.497],
            zoom: 11.20,
            pitch: 0,
            layersVis: ['contour', 'road', 'landuse (1)', 'Updated'], 
            layersHide: [],
        },
        'chapter02': {
            name: "02: Grunewald",
            description: "The Grunewald serves as a stable urban periphery for the city of Berlin, and it is the setting for the Teufelsberg. It has functioned as wilderness, royal hunting grounds, bourgeois district, deportation center, dump site, surveillance arm, and countryside retreat over the course of its modern history.",
            bearing: 0,
            center: [13.240, 52.474],
            zoom: 13.19,
            pitch: 0,
            layersVis: ['contour', 'road', 'landuse (1)', 'Updated'], 
            layersHide: [],
            speed:0.2,
        },

        'chapter03': {
            name: "03: Volkspark Friedrichshain",
            description: "This urban park in the city center has been closely tied to the history of central planning in Berlin, serving the urban public, military defense interests, and Soviet era urban development campaign.",
            bearing: 0,
            center: [13.438, 52.527],
            zoom: 14.43,
            pitch: 0,
            layersVis: ['contour', 'road', 'landuse (1)', 'Updated'], 
            layersHide:[],
            speed:0.3,
        },
        'chapter04': {
            name: "04: City center: Mitte and Tiergarten",
            description: "Between Grunewald and Friedrichshain is the heart of Berlin. Teufelsberg and the Volkspark are linked by the central axis, Unter der Linden, the ceremonious artery of the city.",
            //imagepath: "img/McIntire Park.jpg",
            bearing: 0,
            center: [13.361, 52.515],
            zoom: 13.00,
            pitch: 30.00,
            layersVis:['contour', 'road', 'landuse (1)', 'Updated'], 
            layersHide: [],
            speed:0.1,
        },

          'chapter05': {
            name: "05: Teufelsberg",
            description: "The western Schuttberg is the highest point in the city of Berlin. Its physically layered chronology, taken along with that of the Volkspark, bears witness to the history of Berlin and the people who have defined it.",
            //imagepath: "img/McIntire Park.jpg",
            bearing: -8.56,
            center: [13.244, 52.5],
            zoom: 14.4,
            pitch: 45.00,
            layersVis:['contour', 'road', 'landuse (1)', 'Updated'], 
            layersHide: [],
            speed:0.1,
        },

       // add additional chapters here as needed  

    };


    console.log(chapters['chapter01']['name']);
    console.log(Object.keys(chapters)[0]);

     //Add the chapters to the #chapters div on the webpage
    for (var key in chapters) {
        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
        var chapterHTML = $("<h3>" +"<br>"+ chapters[key]['name'] +"<br><br>"+"</h3>" + "<p>" + chapters[key]['description'] + "</p>"+"<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>").appendTo(newChapter);
    }


    $("#chapters").scroll(function(e) {
        var chapterNames = Object.keys(chapters);

        for (var i = 0; i < chapterNames.length; i++) {

            var chapterName = chapterNames[i];
            var chapterElem = $("#" + chapterName);

            if (chapterElem.length) {
                if (checkInView($("#chapters"), chapterElem, true)) {
                    setActiveChapter(chapterName);
                    $("#" + chapterName).addClass('active');
                    break;
                } else {
                    $("#" + chapterName).removeClass('active');
                }
            }
        }
    });

        var activeChapterName = '';
    
    function setActiveChapter(chapterName) {
        if (chapterName === activeChapterName) return;
        
        map.flyTo(chapters[chapterName]);
        
         // Reset layers to visible
        for (i=0; i<chapters[chapterName]['layersVis'].length; i++) {
            map.setLayoutProperty(chapters[chapterName]['layersVis'][i], 'visibility', 'visible'); 
        }  
        for (i=0; i<chapters[chapterName]['layersHide'].length; i++) {
            map.setLayoutProperty(chapters[chapterName]['layersHide'][i], 'visibility', 'none'); 
        }  

        activeChapterName = chapterName;
    }

    function checkInView(container, elem, partial) {
        var contHeight = container.height();
        var contTop = container.scrollTop();
        var contBottom = contTop + contHeight ;

        var elemTop = $(elem).offset().top - container.offset().top;
        var elemBottom = elemTop + $(elem).height();

        var isTotal = (elemTop >= 0 && elemBottom <=contHeight);
        var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;

        return  isTotal  || isPart ;
    }



// -------------------------------------------------------- 
// Popups
// See tutorial at https://docs.mapbox.com/help/tutorials/add-points-pt-3/
// See example of popups on click at https://docs.mapbox.com/mapbox-gl-js/example/popup-on-click/ 
// See example of popups on hover at https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/

    // Create a popup on click 
    map.on('click', function(e) {   // Event listener to do some code when user clicks on the map

      var images = map.queryRenderedFeatures(e.point, { 
        layers: ['Updated']    // replace this with the name of the layer from the Mapbox Studio layers panel
    });

      if (images.length == 0) {
        return;
    }

    var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', 
        offset: [0, -15]
    });

      popup.setLngLat(images[0].geometry.coordinates);

      // Set the contents of the popup window
      popup.setHTML("<p>Title: " + images[0].properties.title +",<br> era: " +images[0].properties.era + "</p>"+"<img src='"+images[0].properties.url+"'>");
        
      popup.addTo(map);
  });