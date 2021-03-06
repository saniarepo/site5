/**
* объекты описывающие страны, за которые можно играть
**/
var Russia = 
{
	name:	'Российская Федерация', /*имя*/
	id:	    'russia',               /*идентификатор*/
					
	icon: 	L.icon({ iconUrl: '/img/country/Russia.png',  /*объект иконки*/
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
    toString: function(){                             /*метод для преобразования в строку*/
        return {name: this.name, id: this.id};
    }	

};

var Ukraine = 
{
	name:	'Украина',
	id:	    'ukraine',
	
	icon:	L.icon({ iconUrl: '/img/country/Ukraine.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),	

    toString: function(){
        return {name: this.name, id: this.id};
    }
};

var USA = 
{
	name:	'США',
	id:	    'us',
					
	icon: 	L.icon({ iconUrl: '/img/country/United-States.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }

};

var UK = 
{
	name:	'Великобритания',
	id:	    'uk',
					
	icon: 	L.icon({ iconUrl: '/img/country/United-Kingdom.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }

};

var Germany = 
{
	name:	'Германия',
	id:	    'germany',
					
	icon: 	L.icon({ iconUrl: '/img/country/Germany.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }

};

var Iraq = 
{
	name:	'Ирак',
	id:	    'iraq',
					
	icon: 	L.icon({ iconUrl: '/img/country/Iraq.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }

};

var NorthKorea = 
{
	name:	'Северная Корея',
	id:	    'northkorea',
					
	icon: 	L.icon({ iconUrl: '/img/country/North-Korea.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

var USSR = 
{
	name:	'СССР',
	id:	    'ussr',
					
	icon: 	L.icon({ iconUrl: '/img/country/Ussr.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

var Syria = 
{
	name:	'Сирия',
	id:	    'syria',
					
	icon: 	L.icon({ iconUrl: '/img/country/Syria.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

var Tajikistan = 
{
	name:	'Таджикистан',
	id:	    'tajikistan',
					
	icon: 	L.icon({ iconUrl: '/img/country/Tajikistan.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

var Vietnam = 
{
	name:	'Вьетнам',
	id:	    'vietnam',
					
	icon: 	L.icon({ iconUrl: '/img/country/Vietnam.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

var Azerbaijan = 
{
	name:	'Азербайджан',
	id:	    'azerbaijan',
					
	icon: 	L.icon({ iconUrl: '/img/country/Azerbaijan.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

var Israel = 
{
	name:	'Израиль',
	id:	    'israel',
					
	icon: 	L.icon({ iconUrl: '/img/country/Israel.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

var Palestine = 
{
	name:	'Палестина',
	id:	    'palestine',
					
	icon: 	L.icon({ iconUrl: '/img/country/Palestine.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

var Mongolia = 
{
	name:	'Монголия',
	id:	    'mongolia',
					
	icon: 	L.icon({ iconUrl: '/img/country/Mongolia.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

var Pakistan = 
{
	name:	'Пакистан',
	id:	    'pakistan',
					
	icon: 	L.icon({ iconUrl: '/img/country/Pakistan.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

var Turkmenistan = 
{
	name:	'Туркменистан',
	id:	    'turkmenistan',
					
	icon: 	L.icon({ iconUrl: '/img/country/Turkmenistan.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

var Uzbekistan = 
{
	name:	'Узбекистан',
	id:	    'uzbekistan',
					
	icon: 	L.icon({ iconUrl: '/img/country/Uzbekistan.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

/**
* объект перечисляющий все страны в данном файле
**/
var Countries = 
{
    russia: [Russia, 'Россия'],
    ukraine: [Ukraine, 'Украина'],
    us: [USA, 'США'],
    uk: [UK, 'Великобритания'],
    germany: [Germany, 'Германия'],
    iraq: [Iraq, 'Ирак'],
    northkorea: [NorthKorea, 'Северная Корея'],
    ussr: [USSR, 'СССР'],
    syria: [Syria, 'Сирия'],
    tajikistan: [Tajikistan, 'Таджикистан'],
    vietnam: [Vietnam, 'Вьетнам'],
	azerbaijan: [Azerbaijan, 'Азербайджан'],
	israel: [Israel, 'Израиль'],
	palestine: [Palestine,'Палестина'],
	mongolia: [Mongolia,'Монголия'],
	pakistan: [Pakistan, 'Пакистан'],
	turkmenistan: [Turkmenistan, 'Туркменистан'],
	uzbekistan: [Uzbekistan, 'Узбекистан']
    
};