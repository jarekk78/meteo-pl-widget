meteo-pl-widget
===============

A dashboard widget (Mac OS X) displaying weather forecast from http://www.meteo.pl

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


