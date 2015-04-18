/*набор объектов для описания миссий*/
/*кординаты юнитов, страна принадлежности для каждого юнита, тип юнита*/
var Mission1 =
{
    regiments: [ 
                    {latlng: [56.6,47.95], country: 'russia', type: 'tank' },
                    {latlng: [56.66,47.92], country: 'russia', type: 'tank' },
                    {latlng: [56.67,47.97], country: 'russia', type: 'foot' },
                    {latlng: [56.67,47.90], country: 'russia', type: 'foot' },
                    {latlng: [56.68,47.82], country: 'ukraine', type: 'tank' },
                    {latlng: [56.69,47.83], country: 'ukraine', type: 'tank' },
                    {latlng: [56.65,47.85], country: 'ukraine', type: 'foot' },
                    {latlng: [56.65,47.86], country: 'ukraine', type: 'foot' }
    
                ],
    bases:      [
                    {latlng: [56.67,47.95], country: 'russia', type: 'none' },
                    {latlng: [56.72,47.93], country: 'russia', type: 'none' },
                    {latlng: [56.68,47.71], country: 'ukraine', type: 'none' },
                    {latlng: [56.69,47.72], country: 'ukraine', type: 'none' }
                ],
    id: 'mission1',
    year: 2013,
    desc: {    
                russia: 'Описание миссии для России', 
                ukraine: 'Описание миссии для Украины', 
                all: 'Общее описание миссии 1'
    },
    center: [56.605, 47.9], /*центр карты*/
    db_file: 'RU-ME.osm.sqlite' /*файл базы содержащий граф дорожной сети*/

};

var Mission2 =
{
    regiments: [ 
                    {latlng: [56.6,47.8], country: 'russia', type: 'foot' },
                    {latlng: [56.66,47.85], country: 'russia', type: 'foot' },
                    {latlng: [56.67,47.87], country: 'russia', type: 'foot' },
                    {latlng: [56.67,47.90], country: 'russia', type: 'foot' },
                    {latlng: [56.68,47.88], country: 'germany', type: 'tank' },
                    {latlng: [56.69,47.89], country: 'germany', type: 'tank' },
                    {latlng: [56.65,47.875], country: 'germany', type: 'foot' },
                    {latlng: [56.65,47.86], country: 'germany', type: 'foot' }
    
                ],
    bases:      [
                    {latlng: [56.67,47.97], country: 'russia', type: 'none' },
                    {latlng: [56.72,47.95], country: 'russia', type: 'none' },
                    {latlng: [56.68,47.71], country: 'germany', type: 'none' },
                    {latlng: [56.69,47.72], country: 'germany', type: 'none' }
                ],
    id: 'mission2',
    year: 2012,
    desc: {    
                russia: 'Описание миссии для России', 
                germany: 'Описание миссии для Германии', 
                all: 'Общее описание миссии 2'
    },
    center: [56.605, 46.9], /*центр карты*/
    db_file: 'RU-ME.osm.sqlite' /*файл базы содержащий граф дорожной сети*/
};

var Mission3 =
{
    regiments: [ 
                    {latlng: [56.6,47.8], country: 'us', type: 'foot' },
                    {latlng: [56.66,47.85], country: 'us', type: 'foot' },
                    {latlng: [56.67,47.87], country: 'us', type: 'foot' },
                    {latlng: [56.67,47.90], country: 'us', type: 'foot' },
                    {latlng: [56.68,47.88], country: 'ukraine', type: 'tank' },
                    {latlng: [56.69,47.89], country: 'ukraine', type: 'tank' },
                    {latlng: [56.65,47.875], country: 'ukraine', type: 'foot' },
                    {latlng: [56.65,47.86], country: 'ukraine', type: 'foot' }
    
                ],
    bases:      [
                    {latlng: [56.67,48.02], country: 'us', type: 'none' },
                    {latlng: [56.72,48.05], country: 'us', type: 'none' },
                    {latlng: [56.68,47.71], country: 'ukraine', type: 'none' },
                    {latlng: [56.69,47.72], country: 'ukraine', type: 'none' }
                ],
    id: 'mission3',
    year: 2011,
    desc: {    
                us: 'Описание миссии для США', 
                ukraine: 'Описание миссии для Украины', 
                all: 'Общее описание миссии 3'
    },
    center: [56.605, 48.9], /*центр карты*/
    db_file: 'RU-ME.osm.sqlite' /*файл базы содержащий граф дорожной сети*/
};

var Missions = 
{
    mission1: {selected: false, object: Mission1, name: 'Миссия 1', country1:{id:'russia', name: 'Россия', selected: false},country2:{ id:'ukraine',name: 'Украина',selected: false}},
    mission2: {selected: false, object: Mission2, name: 'Миссия 2', country1:{id:'russia', name: 'Россия',selected: false},country2:{ id:'germany',name: 'Германия',selected: false}},
    mission3: {selected: false, object: Mission3, name: 'Миссия 3', country1:{id:'ukraine', name: 'Украина',selected: false},country2:{ id:'us', name: 'США',selected: false}}
    
};

exports.missions = Missions;