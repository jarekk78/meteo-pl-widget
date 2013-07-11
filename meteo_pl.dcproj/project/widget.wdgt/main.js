/* 
 This file was generated by Dashcode.  
 You may edit this file to customize your widget or web page 
 according to the license.txt file included in the project.
 */

//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
function load()
{
    dashcode.setupParts();
}

//
// Function: remove()
// Called when the widget has been removed from the Dashboard
//
function remove()
{
    // Stop any timers to prevent CPU usage
    // Remove any preferences as needed
    // widget.setPreferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
}

//
// Function: hide()
// Called when the widget has been hidden
//
function hide()
{
    // Stop any timers to prevent CPU usage
}

//
// Function: show()
// Called when the widget has been shown
//
function show()
{
    // Restart any timers that were stopped on hide
    loadForecastImage();
}

//
// Function: sync()
// Called when the widget has been synchronized with .Mac
//
function sync()
{
    // Retrieve any preference values that you need to be synchronized here
    // Use this for an instance key's value:
    // instancePreferenceValue = widget.preferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
    //
    // Or this for global key's value:
    // globalPreferenceValue = widget.preferenceForKey(null, "your-key");
}

//
// Function: showBack(event)
// Called when the info button is clicked to show the back of the widget
//
// event: onClick event from the info button
//
function showBack(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }

    front.style.display = "none";
    back.style.display = "block";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

//
// Function: showFront(event)
// Called when the done button is clicked from the back of the widget
//
// event: onClick event from the done button
//
function showFront(event)
{
    widget.setPreferenceForKey(document.getElementById("rowTF").value,"row");
    widget.setPreferenceForKey(document.getElementById("colTF").value,"col");
    widget.setPreferenceForKey(document.getElementById("rowTF1").value,"row1");
    widget.setPreferenceForKey(document.getElementById("colTF1").value,"col1");
    widget.setPreferenceForKey(document.getElementById("modelSelectPopup").selectedIndex,"model");
    widget.setPreferenceForKey(document.getElementById("delayTF").value,"delay");
    
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToFront");
    }

    front.style.display="block";
    back.style.display="none";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
    
    show();

}

if (window.widget) {
    widget.onremove = remove;
    widget.onhide = hide;
    widget.onshow = show;
    widget.onsync = sync;
}

function loadForecastImage() {
    var img = document.getElementById("image1");
    var scrollAreaToChange = document.getElementById("scrollArea");

    var date="20130709"; // sample

    var cd = new Date();
    cd.setHours( cd.getHours() - parseInt(document.getElementById("delayTF").value) -6*(100-document.getElementById("slider").value) );
    
    var tzOffset = cd.getTimezoneOffset()/60+2;
    var hour = cd.getHours()+tzOffset;
    
    if (hour < 6) { // if yesterdays forecast
        hour=18;
        cd.setDate( cd.getDate()-1 );
    }
    else if (hour < 12) hour=0;
    else if (hour < 18) hour=6;
    else hour=12;

    var day = cd.getDate();
    var month = cd.getMonth() + 1;
    var year = cd.getFullYear();
    date = year+(month<10?"0"+month:month)+(day<10?"0"+day:day);
    date += (hour<10?"0"+hour:hour);
    
    var newScrollAreaContent = "";

    var model = (modelSelectPopup.options[modelSelectPopup.selectedIndex].value == "UM");
    if (modelSelectPopup.options[modelSelectPopup.selectedIndex].value != modelSelectPopup1.options[modelSelectPopup1.selectedIndex].value)
        model = (modelSelectPopup1.options[modelSelectPopup1.selectedIndex].value == "UM");

    var width = with_legend?370:540;
    
    if (model) {
        var row = document.getElementById("rowTF").value;
        var col = document.getElementById("colTF").value;
        newScrollAreaContent = "<img width="+width+" height=660 style='float:left' src='http://www.meteo.pl/um/metco/mgram_pict.php?ntype=0u&fdate="+date+"&row="+row+"&col="+col+"&lang=pl'>";
        document.getElementById("textField").value = "http://www.meteo.pl/um/metco/mgram_pict.php?ntype=0u&fdate="+date+"&row="+row+"&col="+col+"&lang=pl";
    }
    else {
        var row = document.getElementById("rowTF1").value;
        var col = document.getElementById("colTF1").value;
        newScrollAreaContent = "<img style='float:left' width="+width+" height=660 src='http://www.meteo.pl/metco/mgram_pict.php?ntype=2n&fdate="+date+"&row="+row+"&col="+col+"&lang=pl'>";
        document.getElementById("textField").value = "http://www.meteo.pl/metco/mgram_pict.php?ntype=2n&fdate="+date+"&row="+row+"&col="+col+"&lang=pl";
    }
    if (with_legend) {
        if (model)
            newScrollAreaContent = "<img width="+(540-width)+" height=660 style='float:left' src='http://www.meteo.pl/um/metco/leg_um_pl_20120615.png'>"+newScrollAreaContent;
        else
            newScrollAreaContent = "<img width="+(540-width)+" height=660 style='float:left' src='http://www.meteo.pl/metco/leg4_pl.png'>"+newScrollAreaContent;
//        document.getElementById("frontImg").width=document.getElementById("frontImg").width+50;
    }
    scrollAreaToChange.object.content.innerHTML = newScrollAreaContent;
    scrollAreaToChange.object.refresh();
}

function getDefaultPrefeneceForKey( def, key ) {
    var v = widget.preferenceForKey( key );
    if (!v) v=def;
    return v;
}

function fillPopup( popupName, list ) {
    var popup = document.getElementById(popupName);
    while (popup.length>0) popup.remove(0);

    var i=0;
    for (i=0;i<list.length;i++) {
        popup.add( new Option(list[i][0],i),i==0?null:popup.options[popup.length-1] );
    }
    popup.selectedIndex=0;
}

function myLoadHandler(event) {
    document.getElementById("rowTF").value = getDefaultPrefeneceForKey( 418, "row" );
    document.getElementById("colTF").value = getDefaultPrefeneceForKey( 223, "col" );
    document.getElementById("rowTF1").value = getDefaultPrefeneceForKey( 137, "row1" );
    document.getElementById("colTF1").value = getDefaultPrefeneceForKey( 88, "col1" );
    document.getElementById("modelSelectPopup").selectedIndex = getDefaultPrefeneceForKey( 0, "model" );
    document.getElementById("modelSelectPopup1").selectedIndex = document.getElementById("modelSelectPopup").selectedIndex;
    document.getElementById("delayTF").value = getDefaultPrefeneceForKey( 0, "delay" );

    
    fillPopup("popup", cities_um);
    fillPopup("popup2", cities_coamps);
}

with_legend = false;

function citySelectedOnClick(event)
{
    var popup = document.getElementById("popup");
    if (popup.selectedIndex>0) {
        document.getElementById("rowTF").value = cities_um[popup.options[popup.selectedIndex].value][3];
        document.getElementById("colTF").value = cities_um[popup.options[popup.selectedIndex].value][2];
    }
}


function imageClicked(event)
{
    with_legend = !with_legend;    
    loadForecastImage();
}


function latLongOnClick(event)
{
    var latStr = document.getElementById("latTF").value;
    var longStr = document.getElementById("longTF").value;
    
    var lat = parseFloat( latStr );
    var long = parseFloat( longStr );
    if (!isNaN(lat) && !isNaN(long)) {
        document.getElementById("rowTF").value = Math.round(-27.23*lat+1820.3);
        document.getElementById("colTF").value = Math.round(17.09*long-108.61);
    }
}


function selectedCityCOAMPS(event)
{
    var popup = document.getElementById("popup2");
    if (popup.selectedIndex>0) {
        document.getElementById("rowTF1").value = cities_coamps[popup.options[popup.selectedIndex].value][3];
        document.getElementById("colTF1").value = cities_coamps[popup.options[popup.selectedIndex].value][2];
    }
}


function switchModelFront(event)
{
    loadForecastImage();
}


function delaySliderChange(event)
{
    loadForecastImage();
}
