meteo-pl-widget
===============

A dashboard widget (Mac OS X) displaying weather forecast from http://www.meteo.pl

INSTALL
-------
File meteo_pl weather forecast.zip contains deployed widget. To install: unpack and double-click.
Configure by setting row/col - separately for UM and COAMPS model.

Development notes:
------------------

First things first - let's analyse the ICM site (www.meteo.pl):
- there are two models that seem interesting - the UM and COAMPS
- found nice city name/coordinate list:
XX=[0, 299, 101, 298, 203, 294, 115, 316, 210, 355, 240, 142, 285, 199, 209, 152, 121, 180, 250, 155, 223, 277, 181, 418, 244, 196, 215, 133, 269, 232, 166, 179, 35, 216, 402, 127, 155];
YY=[0, 182, 185, 203, 209, 272, 305, 334, 346, 352, 363, 370, 379, 381, 383, 390, 394, 400, 406, 412, 418, 432, 436, 440, 443, 449, 461, 462, 465, 466, 516, 519, 535, 537, 539, 574, 583];
CITY_NAMES=["", "Helsinki", "Oslo", "Tallinn", "Sztokholm", "Ryga", "Kopenhaga", "Wilno", "Gdańsk", "Mińsk", "Olsztyn", "Szczecin", "Białystok", "Bydgoszcz", "Toruń", "GorzówWielkopolski", "Berlin", "Poznań", "Warszawa", "ZielonaGóra", "Łódź", "Lublin", "Wrocław", "Kijów", "Kielce", "Opole", "Katowice", "Praga", "Rzeszów", "Kraków", "Wiedeń", "Bratysława", "Liechtenstein", "Budapeszt", "Kiszyniów", "Lublana", "Zagrzeb" ];
- clicking on a city (e.g. Lodz) opens: 
http://www.meteo.pl/um/php/meteorogram_list.php?ntype=0u&fdate=2013070912&row=418&col=223&lang=pl&cname=%A3%F3d%BC
where:
	row=418
	col=223
	cname=Łódź (encoded)
	fdate=2013070912 - current date + starting hour?
- valid hours: 00, 06, 12, 18
- at 22:30 the forecast from 18 was not ready yet
- at 23:10 still not ready
- changed to 18 around midnight (6 hours later then)

- displayed image is:
http://www.meteo.pl/um/metco/mgram_pict.php?ntype=0u&fdate=2013070912&row=418&col=223&lang=pl
- legend:
http://www.meteo.pl/um/metco/leg_um_pl_20120615.png

Questions:
- how to check what is most recent forecast

loaded iframe http://www.meteo.pl/um/ramka_um_city_pl.php
has this in line 4:
<script language='JavaScript'>var UM_YYYY=2013;var UM_MM=7;var UM_DD=9;var UM_ST=12;var UM_SYYYY="2013";var UM_SMM="07";var UM_SDD="09";var UM_SST="12";</script>
where 
UM_ST=12; is probably the answer.

- city coordinates to row/col ?

Based on several sample cities:
City	Row	Lat (N)	Apx.row		Col	Long (E)	Apx.col
Lodz	418	51.78	410		223	19.45	224
Berlin	395	52.47	392		122	13.47	122
Oslo	185	59.92	189		101	10.77	75
Ryga	276	56.8	274		297	24.32	307
Kijow	444	50.3	451		416	30.35	410
Lichtenstein	535	47.13	537		35	9.65	56

Where:
Apx.row = ROUND(-27.23*latitude+1820.3)
Apx.col = ROUND(17.09*longitude-108.61)

Apx.col is far away for extreme longitudes (Lichtenstein, Ryga)


Time to start with the widget tutorial: https://developer.apple.com/library/mac/#documentation/AppleApplications/Conceptual/Dashcode_UserGuide/Contents/Resources/en.lproj/MakingaWidgetwithDashcode/MakingaWidgetwithDashcode.html

Getting Dashcode - Apple could fix the tutorial - googled the answer: xCode Menu -> Open Developer Tools -> More Developer Tools

Browsing through "Code library". This may be useful:

Get text from text field:
// Values you provide
var textFieldValue = document.getElementById("elementID");	// replace with ID of text field
// Text field code
textFieldValue = textFieldValue.value;




// Indicates whether the browser is online or offline
var online = window.navigator.onLine;
if (!online) {
	// Handle the case when the browser is offline
	console.log("We are offline!");
} else {
	console.log("We are online!");
}




// Values you provide
var scrollAreaToChange = document.getElementById("elementID");	// replace with ID of scroll area to change
var newScrollAreaContent = "A string or raw HTML";				// new scroll area content

// Scroll area code
scrollAreaToChange.object.content.innerHTML = newScrollAreaContent;
scrollAreaToChange.object.refresh();


Ok, whatever i run - the widget disappears. Works nice if deployed though. Googling....

http://next.drewk.net/2012/08/01/dashcode-bug-disappearing-widgets/

answer: 
defaults write com.apple.Dashcode NSQuitAlwaysKeepsWindows -bool false
+dashcode restart.


The next day
-------------

There is a list of cities on the meteo.pl website - divided into 16 parts. All downloaded (manually).
Every city link leads to an address: http://new.meteo.pl/um/php/meteorogram_id_um.php?ntype=0u&id=2201
where id - city identificator.
Image address is still http://new.meteo.pl/um/metco/mgram_pict.php?ntype=0u&fdate=2013071000&row=418&col=223&lang=pl
though.

Every file contains a list of cities. One city entry: <A href="#" onClick='show_mgram(1134)'>Dobromierz, pow. świdnicki</a>
hence:

/<A href="#" onClick='show_mgram\((\d+)\)'>(.*)</a>/

We will filter it with filter.pl:

$str = join("",<STDIN>);
@matches = ();
push (@matches,"$2\t$1") while($str =~ /<A href="#" onClick='show_mgram\((\d{1,6})\)'>(.{1,35})<\/a>/g );
foreach (@matches) {
	@d = split("\t");
	open(R, "wget \"http://new.meteo.pl/um/php/meteorogram_id_um.php?ntype=0u&id=$d[1]\" 2>/dev/null -O - |")  or die "Couldn't fork: $!\n";
	while (<R>) { if ($_ =~ /var act_x = (\d+);var act_y = (\d+);/) {
		push(@d,$1);
		push(@d,$2);
	} }
	close(README);
	print "\tnew Array(\"$d[0]\", $d[1], $d[2], $d[3] ),\n";
	break;
}

cat *.html | perl filter.pl >cities_um.js

Hope they won't dislike me for this additional work of their servers.

For coamps it's just a change of url.

At 17:29 the 06 forecast is still not available. Why? Is it always like this?

citi lists are awfully sorted. unix sort leaves "Łodz" at the end of the list. Textwrangler sort mixes "L" and "Ł". Any idea anyone?


