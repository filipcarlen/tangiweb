 $(function() {

            var client = new Tuio.Client({
                host: "http://localhost:5000"
            }),
            screenW = $(document).width();
            screenH = $(document).height();

            cursors = {},

            onConnect = function() {
                console.log("onConnect");
            },

            onAddTuioCursor = function(addCursor) {
            },

            onUpdateTuioCursor = function(updateCursor) {
            },

            onRemoveTuioCursor = function(removeCursor) {
            };

            var currentTheme1 = -1;
            var currentTheme2 = -1;
            var currentTheme3 = -1;

            onAddTuioObject = function(addObject) {
                console.log(jsonObject);
                // Protocol in future
                // symbolID < 10 => themes and templates and stuff
                // 1-5: themes
                // 6-9: background colors
                // 10 <= symbolID <= 19 => Theme 1
                // 20 <= symbolID <= 29 => Theme 2
                // 30 <= symbolId <= 39 => Theme 3

                // For theme and color elements
                //if (addObject.xPos > getXMax()){ // make sure that we're only doing this for objects in the "zone"

                    // if it is a theme
                    if(addObject.symbolId <= 6){

                        //if top, change theme1
                        //if mid, change theme2
                        //if bot, change theme3

                        //send event to render with new stuff
                        // signalera all skit
                        currentTheme2 = 1;
                        $('.theme2').trigger({
                            type: "renderTheme",
                            theme: currentTheme2,
                            themeName: 'theme2'
                        });

                    // if it is a background color
                    } else if (addObject.symbolId >= 6 && addObject.symbolId <=9){
                        document.getElementById('body').style.background = "-webkit-linear-gradient(top, #00E9E9, #F6F600)";
                    }


                //} else {

                    // kolla vilken typ av element det är via id. rendera med rätt höjd/bredd

                    // Check if a theme is placed for the placed object
                    // Theme 1
                    if(addObject.symbolId >= 10 && addObject.symbolId <= 19){

                        var elementType = getElementType(addObject.symbolId);
                        $('.container').append($('<div id='+addObject.symbolId+'>')
                            .load("templates/"+elementType+".html", function(){

                                $('#'+addObject.symbolId).addClass('element theme1');
                                $('#'+addObject.symbolId).css('width',sizeObjects[elementType].width+"%");
                                $('#'+addObject.symbolId).css('height',sizeObjects[elementType].height+"%");

                                //render with current theme.
                                $('#'+addObject.symbolId).trigger({
                                    type: "renderTheme",
                                    theme: currentTheme1,
                                    id: addObject.symbolId
                                });
                            }));

                    } else if(addObject.symbolId >=20 && addObject.symbolId <=29){

                        var elementType = getElementType(addObject.symbolId);
                        $('.container').append($('<div id='+addObject.symbolId+'>')
                            .load("templates/"+elementType+".html", function(){

                                $('#'+addObject.symbolId).addClass('element theme2');
                                $('#'+addObject.symbolId).css('width',sizeObjects[elementType].width+"%");
                                $('#'+addObject.symbolId).css('height',sizeObjects[elementType].height+"%");

                                //render with current theme.
                                $('#'+addObject.symbolId).trigger({
                                    type: "renderTheme",
                                    theme: currentTheme2,
                                    id: addObject.symbolId
                                });
                            }));

                    } else if(addObject.symbolId >=30 && addObject.symbolId <=39){
                        var elementType = getElementType(addObject.symbolId);
                        $('.container').append($('<div id='+addObject.symbolId+'>')
                            .load("templates/"+elementType+".html", function(){

                                $('#'+addObject.symbolId).addClass('element theme3');
                                $('#'+addObject.symbolId).css('width',sizeObjects[elementType].width+"%");
                                $('#'+addObject.symbolId).css('height',sizeObjects[elementType].height+"%");

                                //render with current theme.
                                $('#'+addObject.symbolId).trigger({
                                    type: "renderTheme",
                                    theme: currentTheme3,
                                    id: addObject.symbolId
                                });
                            }));
                    }
                //}
            },

            onUpdateTuioObject = function(updateObject){
                // console.log(updateObject);
                if($('#'+updateObject.symbolId).length){
                    var b = document.getElementById(updateObject.symbolId);
                    var width = parseInt(b.style.width.substring(0, b.style.width.length - 1));
                    var height = parseInt(b.style.height.substring(0, b.style.height.length - 1));
                    console.log("xPos: "+calculateXPosition((width/100), updateObject.xPos).toFixed(0)+"| yPos: "+calculateYPosition((height/100), updateObject.yPos).toFixed(0));
                    var xPos = calculateXPosition((width/100), updateObject.xPos).toFixed(0);
                    var yPos = calculateYPosition((height/100), updateObject.yPos).toFixed(0);


                    // Make the div stay inside of containers bounds
                    if(yPos < 0){
                        yPos = 0;
                    } else if(yPos > 100){
                        yPos = 100;
                    }
                    if(xPos < 0){
                        xPos = 0;
                    } else if(xPos > 81){
                        xPos = 81;
                    }


//                    if(0 <= xPos && 20 > xPos ){
//                        b.style.left = 0 +'%';
//                    } else if(20 <= xPos && 40 > xPos ) {
//                        b.style.left = 20 + '%';
//                    } else if(40 <= xPos && 60 > xPos ) {
//                        b.style.left = 40 + '%';
//                    } else if(60 <= xPos && 80 > xPos ) {
//                        b.style.left = 60 + '%';
//                    } else {// (80 <= xPos && 100 > xPos ) {
//                        b.style.left = 80 + '%';
//                    }
//
//
//                    if(0 <= yPos && 33 > yPos ){
//                        b.style.top = 0 +'%';
//                    } else if(33 <= yPos && 66 > yPos ) {
//                        b.style.top = 33 + '%';
//                    } else { //(66 <= yPos && 100 > yPos ) {
//                        b.style.top = 66 + '%';
//                    }


                    b.style.left = xPos+ '%';
                    b.style.top = yPos+ '%';
                    b.style.opacity = 1;
                }
            },

            onRemoveTuioObject = function(removeObject) {
                //Måste kolla positionen annars äre ingen succé
                if(removeObject.symbolId <=  6){
                    if(currentTheme1 > 0){
                        currentTheme1 = -1;
                        $('.theme1').trigger({
                            type: "renderTheme",
                            theme: currentTheme1,
                            themeName: 'theme1',
                            themeRemoved: true
                        });
                    } else if(currentTheme2 > 0){
                        currentTheme2 = -1;
                        $('.theme2').trigger({
                            type: "renderTheme",
                            theme: currentTheme2,
                            themeName: 'theme2',
                            themeRemoved: true
                        });

                    } else if(currentTheme3 > 0){
                        currentTheme3 = -1;
                        $('.theme3').trigger({
                            type: "renderTheme",
                            theme: currentTheme3,
                            themeName: 'theme3',
                            themeRemoved: true
                        });
                    }
                } else {
                    if($('#'+removeObject.symbolId).length){
                        $("#"+removeObject.symbolId).detach();
                    }
                }
                console.log(removeObject);

                //stuff about backgroundcolor osv..
                /**if(removeObject.symbolId === 6){
                    document.getElementById('body').style.background = "-webkit-linear-gradient(top, #ecf0f1 0%,#c0392b 100%)";
                }*/

             },

            checkIfThemeIsPlaced = function(theme){
                return theme > 0;
            },


            getElementType = function(objectId){
                //get type
                var type = objectId % 10;

                if(type === 0){
                    return "text";
                }
                if(type === 1){
                    return "video";
                }
                if(type === 2){
                    return "slideshow";
                }
                if(type === 3){
                    return "imagesound";
                }
                if(type === 4){
                    return "textlink";
                }
                if(type === 5){
                    return "imagetext";
                }
                if(type === 6){
                    return "bigimage";
                }
                if(type === 7){
                    return "smallimage";
                }
                if(type === 8){
                    return "landscapeimage";
                }
                if(type === 9){
                    return "longtext";
                }
            },

            calculateXScaleFactor = function() {
                return (1.0/getXMax());
            },

            calculateYScaleFactor = function() {
                return (1.0/getYMax());
            },

            calculateXPosition = function(widthRatio, xPos) {
                return ((xPos * calculateXScaleFactor()) - (widthRatio / 2)) * 100;
            },

            calculateYPosition = function(heightRatio, yPos) {
                return ((yPos * calculateYScaleFactor()) - (heightRatio / 2)) * 100;
            },

            getXMax = function() {
                return 1.0;
            },

            getYMax = function() {
                return 1.0;
            },

            onRefresh = function(time) {
                
            };

            client.on("connect", onConnect);
            client.on("addTuioCursor", onAddTuioCursor);
            client.on("updateTuioCursor", onUpdateTuioCursor);
            client.on("removeTuioCursor", onRemoveTuioCursor);
            client.on("addTuioObject", onAddTuioObject);
            client.on("updateTuioObject", onUpdateTuioObject);
            client.on("removeTuioObject", onRemoveTuioObject);
            client.on("refresh", onRefresh);
            client.connect();
 });
