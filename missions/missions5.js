var miss1 = 
{"id":"miss1","name":"Битва за Багдад",year: 2013,"regiments":[{"latlng":[33.290933790466376,44.143409729003906],"country":"us","type":"tank"},{"latlng":[33.25246979589199,44.172248840332024],"country":"us","type":"tank"},{"latlng":[33.192443637359304,44.19559478759765],"country":"us","type":"tank"},{"latlng":[33.11771248892445,44.288291931152344],"country":"us","type":"tank"},{"latlng":[33.12202563185082,44.219627380371094],"country":"us","type":"foot"},{"latlng":[33.27916675536866,44.090538024902344],"country":"us","type":"foot"},{"latlng":[33.21743560674893,44.18632507324219],"country":"us","type":"foot"},{"latlng":[33.39418593758077,44.35832977294922],"country":"iraq","type":"foot"},{"latlng":[33.349458371830515,44.384765625],"country":"iraq","type":"foot"},{"latlng":[33.29609930468822,44.436607360839844],"country":"iraq","type":"foot"},{"latlng":[33.369244554711074,44.293785095214844],"country":"iraq","type":"foot"},{"latlng":[33.19646581525877,44.50767517089844],"country":"iraq","type":"tank"},{"latlng":[33.24988578612424,44.4122314453125],"country":"iraq","type":"tank"},{"latlng":[33.30040366624405,44.38304901123047],"country":"iraq","type":"tank"}],"bases":[{"latlng":[33.23983613293645,43.99852752685547],"country":"us","type":"none"},{"latlng":[33.071404753339934,44.13482666015625],"country":"us","type":"none"},{"latlng":[33.002329326082915,44.35661315917969],"country":"us","type":"none"},{"latlng":[33.26366628855092,44.52140808105469],"country":"iraq","type":"none"},{"latlng":[33.37927930447181,44.46990966796875],"country":"iraq","type":"none"},{"latlng":[33.429722207466945,44.383392333984375],"country":"iraq","type":"none"}],"desc":{"us":"Уничтожьте войска противника и в городе","iraq":"Отразите нападение войск противника","all":"Бой Иракской армии с войсками США за в районе Багдада"},"center":[33.25070845779485,44.296857833862305],"db_file":"iraq-latest.osm.sqlite"};
var miss2 = 
{"id":"miss2","name":"Битва у Кербелла",year: 2013,"regiments":[{"latlng":[32.31325036285709,44.012603759765625],"country":"us","type":"tank"},{"latlng":[32.32659651806086,44.12452697753906],"country":"us","type":"tank"},{"latlng":[32.36952297435152,44.2529296875],"country":"us","type":"tank"},{"latlng":[32.44836169353613,44.3792724609375],"country":"us","type":"tank"},{"latlng":[32.53060504985312,44.34288024902344],"country":"us","type":"tank"},{"latlng":[32.532341774450515,43.98101806640624],"country":"iraq","type":"tank"},{"latlng":[32.56880523294623,44.04487609863281],"country":"iraq","type":"tank"},{"latlng":[32.60409700272347,44.086761474609375],"country":"iraq","type":"tank"},{"latlng":[32.66365647172217,44.1595458984375],"country":"iraq","type":"tank"},{"latlng":[32.539288337047424,43.85124206542969],"country":"iraq","type":"tank"},{"latlng":[32.69313240253585,43.919219970703125],"country":"iraq","type":"tank"},{"latlng":[32.70642228639569,44.03251647949219],"country":"iraq","type":"tank"}],"bases":[{"latlng":[32.09769967633269,44.09431457519531],"country":"us","type":"none"},{"latlng":[32.09362777580678,44.36691284179687],"country":"us","type":"none"},{"latlng":[32.57690621187388,43.968658447265625],"country":"iraq","type":"none"},{"latlng":[32.683886098844695,44.08882141113281],"country":"iraq","type":"none"},{"latlng":[32.73819441736631,44.251556396484375],"country":"iraq","type":"none"}],"desc":{"us":"Уничтожьте войска противника и продвиньтесь на север","iraq":"Отразите нападение войск противника, не позвольте ему пройти севернее Кербела","all":"Бой Иракской армии с войсками США за в районе города Кербелла"},"center":[32.4991996639238,44.11515628590303],"db_file":"iraq-latest.osm.sqlite"};
var Missions = 
{
miss1: {selected: false, object: miss1, name: 'Битва за Багдад', country1: {"id":"us","name":"США","selected":false}, country2: {"id":"iraq","name":"Ирак","selected":false}},
miss2: {selected: false, object: miss2, name: 'Битва у Кербелла', country1: {"id":"us","name":"США","selected":false}, country2: {"id":"iraq","name":"Ирак","selected":false}}

};
exports.missions = Missions;