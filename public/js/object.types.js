/**
* конструкторы объектов разного типа юнитов
**/

function Tank() 
{
	this.name =	'Танковый полк'; /*наименование*/
	this.id = 'tank';            /*идентификатор*/
    this.VELOCITY = 40;         /*скорость движения юнита в км/ч*/
    this.radius = 0.01;          /*радиус области действия полка*/
	this.power = 50;              /*боевая мощь*/
    this.cycle = 
    {
        ammoOutGo: 3,           /*расход боеприпасов за 1 цикл игры при интенсивности боя 1*/
        ammoInGo: 1,           /*пополнение боеприпасов за 1 цикл игры*/
        foodOutGo: 1,           /*расход обеспечения за 1 цикл игры*/
        foodInGo: 2,           /*пополнение обеспечения за 1 цикл игры*/
        menInGo: 1             /*пополнение людьми за 1 цикл игры*/
    };
     
	this.icon =	L.icon({ iconUrl: '/img/type/tank24.png', /*объект иконки*/
			iconSize: [24, 24], 
			iconAnchor: [12, 12], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]});
					
	this.resources = {                        /*ресурсы*/
						men: 100, /*личный состав %*/
    					ammo: 100, /*вооружение и боеприпасы %*/
    					food: 100, /*прочее обеспечение %*/
    					discipline: 1, /*организованность 0-1*/
    					experience: 0 /*боевой опыт 0-1*/
					};
                    
     this.toString = function(){                 /*преобразование в строку*/  
        return {name: this.name, id: this.id, DELTA: this.DELTA, DELTA_TIME: this.DELTA_TIME,resources: this.resources, radius:this.radius, power: this.power, cycle: this.cycle}; 
     };

};

function Foot()
{
	this.name =	'Мотострелковый полк';
	this.id = 'foot';
    this.VELOCITY = 40;
	this.radius = 0.01;
    this.power = 30;              /*боевая мощь*/
    this.cycle = 
    {
        ammoOutGo: 3,          /*расход боеприпасов за 1 цикл игры при интенсивности боя 1*/
        ammoInGo: 1,           /*пополнение боеприпасов за 1 цикл игры*/
        foodOutGo: 1,           /*расход обеспечения за 1 цикл игры*/
        foodInGo: 2,           /*пополнение обеспечения за 1 цикл игры*/
        menInGo: 1             /*пополнение людьми за 1 цикл игры*/
    };
	this.icon = 	L.icon({ iconUrl: '/img/type/foot24.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 12], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]});
					
	this.resources =	{
					men: 100, /*личный состав %*/
					ammo: 100, /*вооружение и боеприпасы %*/
					food: 100, /*прочее обеспечение %*/
					discipline: 1, /*организованность 0-1*/
					experience: 0 /*боевой опыт 0-1*/
				};
                
    this.toString = function(){
        return {name: this.name, id: this.id, DELTA: this.DELTA, DELTA_TIME: this.DELTA_TIME,resources: this.resources, radius:this.radius, power: this.power, cycle: this.cycle}; 
     };
};

function Base()
{
	this.name =	'База снабжения';
	this.id = 'none';
    this.VELOCITY = 20;
	this.radius = 0.01;
    this.power = 10;              /*боевая мощь*/
	this.cycle = 
    {
        ammoOutGo: 3,           /*расход боеприпасов за 1 цикл игры при интенсивности боя 1*/
        ammoInGo: 1,           /*пополнение боеприпасов за 1 цикл игры*/
        foodOutGo: 1,           /*расход обеспечения за 1 цикл игры*/
        foodInGo: 2,           /*пополнение обеспечения за 1 цикл игры*/
        menInGo: 1             /*пополнение людьми за 1 цикл игры*/
    };
    this.icon = 	L.icon({ iconUrl: '/img/type/base3.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 12], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]});
					
	this.resources =	{
					men: 100,
					ammo: 100,
					food: 100
				};
                
    this.toString = function(){
        return {name: this.name, id: this.id, DELTA: this.DELTA, DELTA_TIME: this.DELTA_TIME,resources: this.resources, radius:this.radius, power: this.power, cycle: this.cycle}; 
     };
};

/**
* получение объекта заданного типа
* @param type тип нужного объекта
**/
function getType(type)
{
    switch (type){
        case 'tank': return new Tank(); break;
        case 'foot': return new Foot(); break;
        case 'none': return new Base(); break;
    }
};


var Types = 
{
    tank: [ Tank, 'Танковый полк'],
    foot: [ Foot, 'Мотострелковый полк']  
};