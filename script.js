var cash = 0;
var cps = 0, sps = 0, g = 0.5; //cash/sec, spam/sec, gullibility
var cpsText = document.getElementById('cps'), spsText = document.getElementById('sps'), gText = document.getElementById('g'), cashText = document.getElementById('cash');
var tickTime = 10;
var array;; //empty array for numbers of objects
var upgrades = new Array(12); //array of Upgrade Objects
var modifier = 0.5; //modifier to exponentially change the cost.  NewCost = [(Amount+2)^(UnitID+2)]*modifier
var lastTime
var button, totalElem;
var start = function()
{
	declareArrays();
	createDynamicElements();
	interval = setInterval(tick, tickTime); //creating a tick interval
	for(var i = 0; i < array.length; ++i)
	{
		array[i] = 0;
	}
	for(var i = 0; i < upgrades.length; ++i)
	{
		upgrades[i] = new Upgrade(i, upgrade.cost[i]);
	}
	window.onfocus = Focus;
	window.onblur = Blur;
}
var createDynamicElements = function() //creating dynamic buttons and text nodes based off of "unit.js"
{	
	var unitDiv = document.getElementById('unitDiv');
	for(var i = 0; i < unit.name.length; ++i)
	{
		button[i] = document.createElement("button");
		buttonText = document.createTextNode("Loading...");
		button[i].appendChild(buttonText);
		button[i].setAttribute('onclick', 'add('+i+')');
		unitDiv.appendChild(button[i]);
		unitDiv.appendChild(document.createElement('br'));
		unitDiv.appendChild(document.createTextNode(unit.description[i]));
		unitDiv.appendChild(document.createElement('br'));
		unitDiv.appendChild(document.createTextNode("Spam/second per unit = " + unit.output[i]));
		unitDiv.appendChild(document.createElement('br'));
		totalElem[i] = document.createTextNode("Total spam/second of all units = Loading...");
		unitDiv.appendChild(totalElem[i]);
		unitDiv.appendChild(document.createElement('br'));
	}
	for(var i = 0; i < upgrade.name.length; ++i)
	{
		document.getElementById('u'+i).innerHTML = upgrade.name[i];
	}
}
var declareArrays = function()
{
	array = new Array(unit.name.length);
	button = new Array(unit.name.length);
	totalElem = new Array(unit.name.length);
	upgrades = new Array(upgrade.cost.length);
}
var tick = function()
{
	calcSPS();
	spam();
	setTexts();
}
var spam = function()
{
	//adding up cash by tickTime, so not a full second. maths needed :o
	cash += cps/(1000/tickTime); //cash per tickTime, incorporating gullibility.
}
var send = function()
{
	cash += g; //every human click gives G amount of dollars (temporary?)
}
var add = function(a)
{	
	if(cash >= unit.cost[a]) //checking for enough cash
	{
		cash-= unit.cost[a];
		array[a] += 1;
		unit.cost[a] += (modifier * Math.pow(array[a] + 2, a + 2)); //calculate new cost after buying the unit
	}
}
var calcSPS = function()
{
	sps = 0;
	for(var i = 0; i < array.length; ++i)
	{
		sps += array[i]*unit.output[i];
	}
	cps = sps*g;
}
var hover = function(buttonNumber, on)
{
	if(on && buttonNumber < upgrade.name.length)
	{
		document.getElementById('upgradecost').innerHTML = upgrade.cost[buttonNumber];
		document.getElementById('description').innerHTML = upgrade.description[buttonNumber];
	}
	else
	{
		document.getElementById('upgradecost').innerHTML = "?"
		document.getElementById('description').innerHTML = "Hover over an available upgrade to read the description!";
	}
}
var buy = function(buttonNumber)
{
	upgrades[buttonNumber].buy();
}
var setTexts = function()
{	
	cpsText.innerHTML = cps;
	spsText.innerHTML = sps;
	gText.innerHTML = g * 100;
	cashText.innerHTML = cash.toFixed(2);
	if(cps > 0)
	document.getElementById('title').innerHTML = "$" + cps + "/second!";
	for(var i = 0; i < array.length; ++i) //changing unit buttons/text nodes
	{
		button[i].innerHTML = array[i] + " " + unit.name[i] + ": $" + unit.cost[i].toFixed(2);
		totalElem[i].nodeValue = "Total spam/second of all units = " + unit.output[i] * array[i]; //text nodes require nodeValue, apparently
	}
	for(var i = 0; i < upgrade.cost[i]; ++i)
	{
		var element = document.getElementById("u"+i);
		if(upgrades[i].getBought())
		{
			element.disabled = true;
			element.className = "buttonbought";
		}
		else if(upgrades[i].getAvailable())
		{
			element.disabled = false;
			element.className = "buttonavailable";
		}
		else
		{
			element.disabled = true;
			element.className = "buttonunavailable";
		}
	}
}

//detecting window activity
var Focus = function()
{
	var difference = new Date().getTime() - lastTime;
	cash += cps * (difference/1000);
	interval = setInterval(tick, 10);
}
var Blur = function()
{
	clearInterval(interval);
	lastTime = new Date().getTime();
}

function Upgrade(upgradeNumber, cost) //upgrades go case-by-case to change amounts and modifiers
{
	this.bought = false;
	this.buy = function()
	{
		hover(upgradeNumber, false);
		cash -= cost;
		switch(upgradeNumber) //each upgrade uses switch-case for its effects
		{
			case 0:
				unit.output[0] *=2; //doubles manual labor amount
				break;
			case 1:
				g *= 1.5; //increases gullibility by 50%
				break;
			case 2:
				g *= 1.5; //increases gullibility by 50%
				break;
			case 3:
				unit.output[4]*=2;
				break;
		}
		this.bought = true;
	}
	this.getBought = function()
	{
		return this.bought;
	}
	this.getAvailable = function()
	{
		if(cash >= cost )
		{
			return true;
		}
		return false;
	}
}