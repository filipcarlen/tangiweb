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
            var numberOfElements = 0;

            var modify = true;

            onAddTuioObject = function(addObject) {
                // Protocol in future
                // symbolID < 10 => themes and templates and stuff
                // 1-5: themes
                // 6-9: background colors
                // 10 <= symbolID <= 19 => Theme 1
                // 20 <= symbolID <= 29 => Theme 2
                // 30 <= symbolId <= 39 => Theme 3

                if(modify){
                    numberOfElements = numberOfElements + 1;


                    // remove intro screen
                    $("#intro").hide();

                    // For theme and color elements
                    if (addObject.xPos > getXMax()) { // make sure that we're only doing this for objects in the "zone"

                        // if it is a theme
                        if (addObject.symbolId < 6) {

                            //$('.container').append('<div id="feedback"><div id="texts"><p id="feedback-text"></p><p id="feedback-text-2"></p></div></div>');
                            $('.container').append(

                                    '<div id="feedback">' +
                                        '<div id="feedback-content">' +
                                            '<p id="theme-text"></p>' +
                                            '<img id="theme-img" src="">' +
                                        '</div>' +
                                    '</div>');


                            if (addObject.yPos > 0 && addObject.yPos < 0.2) {

                                $( "#feedback").css("background-color", "red");
                                $( "#feedback").css("top", "5%");
                                $('#theme-text').text("Red content blocks:");

                                currentTheme1 = addObject.symbolId;

                                $('.theme1').trigger({
                                    type: "renderTheme",
                                    theme: currentTheme1,
                                    themeName: 'theme1'
                                });
                            } else if(addObject.yPos > 0.2 && addObject.yPos < 0.4){

                                $( "#feedback").css("background-color", "blue");
                                $( "#feedback").css("top", "30%");
                                $('#theme-text').text("Blue content blocks:");

                                currentTheme2 = addObject.symbolId;
                                $('.theme2').trigger({
                                    type: "renderTheme",
                                    theme: currentTheme2,
                                    themeName: 'theme2'
                                });
                            } else if(addObject.yPos > 0.4 && addObject.yPos < 0.6){

                                $( "#feedback").css("background-color", "orange");
                                $( "#feedback").css("top", "55%");
                                $('#theme-text').text("Orange content blocks:");


                                currentTheme3 = addObject.symbolId;
                                $('.theme3').trigger({
                                    type: "renderTheme",
                                    theme: currentTheme3,
                                    themeName: 'theme3'
                                });
                            }

                            $('#feedback-content').find('img').attr('src', content.themes[addObject.symbolId].themeImage);

                            $( "#feedback" )
                                .animate({
                                    width: "250px"
                                }, 500 )
                                .delay(2500)
                                .animate({
                                    width: "0px"
                                }, 300,function() {
                                    $("#feedback").detach();
                                });

                            // if it is a background color
                        } if (addObject.symbolId >= 6 && addObject.symbolId <= 9 && addObject.yPos > 0.5) {

                            if(addObject.symbolId == 6){
                                document.getElementById('body').style.background = "-webkit-linear-gradient(top, #ecf0f1, #008000)";
                            } else if(addObject.symbolId == 7){
                                document.getElementById('body').style.background = "-webkit-linear-gradient(top, #ecf0f1, #0000FF)";
                            } else if (addObject.symbolId == 8){
                                document.getElementById('body').style.background = "-webkit-linear-gradient(top, #ecf0f1, #e59400)";
                            } else if (addObject.symbolId == 9){
                                document.getElementById('body').style.background = "-webkit-linear-gradient(top, #ecf0f1, #800080)";
                            }
                        }
                    }


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
                }
            },

            onUpdateTuioObject = function(updateObject){

                if(modify) {
                    // console.log(updateObject);
                    if ($('#' + updateObject.symbolId).length) {
                        var b = document.getElementById(updateObject.symbolId);
                        var width = parseInt(b.style.width.substring(0, b.style.width.length - 1));
                        var height = parseInt(b.style.height.substring(0, b.style.height.length - 1));
                        var xPos = 100 - calculateXPosition((width / 100), updateObject.xPos).toFixed(0);
                        var yPos = calculateYPosition((height / 100), updateObject.yPos).toFixed(0);

                        if (xPos % 2 !== 0) {
                            xPos++;
                        }

                        if (yPos % 2 !== 0) {
                            yPos++;
                        }

                        // Make the div stay inside of containers bounds
                        if (yPos < 0) {
                            yPos = 0;
                        } else if (yPos > 67) {
                            yPos = 67;
                        }
                        if (xPos < 0) {
                            xPos = 0;
                        } else if (xPos > 80) {
                            xPos = 81;
                        }

                        console.log("id: " + updateObject.symbolId + "    xPos: " + xPos + "| yPos: " + yPos);



                        // set values
                        b.style.left = xPos + '%';
                        b.style.top = yPos + '%';
                        b.style.opacity = 1;
                    }
                }
            },

            onRemoveTuioObject = function(removeObject) {
                if(modify) {

                    numberOfElements = numberOfElements - 1;

                    if (removeObject.symbolId < 6) {
                        if (removeObject.yPos > 0 && removeObject.yPos < 0.2 && currentTheme1 > 0) {
                            currentTheme1 = -1;
                            $('.theme1').trigger({
                                type: "renderTheme",
                                theme: currentTheme1,
                                themeName: 'theme1',
                                themeRemoved: true
                            });
                        } else if (removeObject.yPos > 0.2 && removeObject.yPos < 0.4 && currentTheme2 > 0) {
                            currentTheme2 = -1;
                            $('.theme2').trigger({
                                type: "renderTheme",
                                theme: currentTheme2,
                                themeName: 'theme2',
                                themeRemoved: true
                            });

                        } else if (removeObject.yPos > 0.4 && removeObject.yPos < 0.6 && currentTheme3 > 0) {
                            currentTheme3 = -1;
                            $('.theme3').trigger({
                                type: "renderTheme",
                                theme: currentTheme3,
                                themeName: 'theme3',
                                themeRemoved: true
                            });
                        }

                    } else if (removeObject.symbolId >= 6 && removeObject.symbolId <= 9 && removeObject.yPos > 0.45) {
                        //document.getElementById('body').style.background = "-webkit-linear-gradient(top, #ecf0f1, #ffffff)";
                        $(document.body).css('background-image','url("img/TangiWebLogoWithAlpha.png")');
                        $(document.body).css('background-position','center');
                        $(document.body).css('background-color', 'grey');

                    } else {
                        if ($('#' + removeObject.symbolId).length) {
                            $("#" + removeObject.symbolId).detach();
                        }
                    }

                    if(numberOfElements === 0){
                        $("#intro").show();
                    }
                    console.log(removeObject);
                }

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
                //Array instead????
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
                return ((xPos * calculateXScaleFactor()) + (widthRatio / 2)) * 100;
            },

            calculateYPosition = function(heightRatio, yPos) {
                return ((yPos * calculateYScaleFactor()) - (heightRatio / 2)) * 100;
            },

            getXMax = function() {
                return 0.89;
            },

            getYMax = function() {
                return 0.75;
            },

            onRefresh = function(time) {
                
            };

            var barWidth = 0;

            $(document).keydown(function(e) {
                if(e.which == 32) {
                    $(".innerElement").css("border-width", "0px");
                    if ($("#myProgress").length == 0) {
                        $(".container").append('<div id="myProgress"><div id="myBar"></div></div>');
                        console.log("modify: "+ modify);
                        modify = false;
                    } else {
                        if(barWidth < 100){
                            barWidth = barWidth + 5;
                        } else {
                            barWidth = 0;
                            $("#myProgress").detach();
                            var markup = document.documentElement.innerHTML;
                            var opened = window.open("generation.html");
                            opened.document.write(markup);
                        }
                        $("#myBar").css( "width", barWidth+"%" );
                    }
                }
            });

             $(document).keyup(function(e) {
                 if(e.which == 32) {
                     if ($("#myProgress").length > 0) {
                         $("#myProgress").detach();
                         $(".innerElement").css("border-width", "2px");
                         modify = true;
                         barWidth = 0;
                     }
                 }
             });




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
