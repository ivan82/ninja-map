var NinjaMap = function(sourceArray, targetArray, onMapStart, onMapComplete){
	this.items = [];
	this.onMapStart = onMapStart;
	this.onMapComplete = onMapComplete;
	this.addItems(sourceArray, targetArray);
};

NinjaMap.prototype = {
	addItem: function(source, target, onBeforeSet, onAfterSet){
		this.items.push(new NinjaMapProperty(source, target, onBeforeSet, onAfterSet));
	},

	addItems: function(sourceArray, targetArray){
		if(!sourceArray){ return; }
		var targetName;
		for (var i = 0, len = sourceArray.length; i < len; i++) {
			targetName = targetArray[i] || sourceArray[i];
			this.items.push(new NinjaMapProperty(sourceArray[i], targetName));
		}
	},

	mapArray: function(sourceArray, targetArray){
		if(!targetArray){ targetArray = []; }
		var target;

		for (var i = 0, len = sourceArray.length; i < len; i++) {
			target = targetArray[i] === undefined ? {} : targetArray[i];
			targetArray[i] = this.map(sourceArray[i], target);
		}
		return targetArray;
	},

	map: function(source, target){
		var item, sourceValue, propertyTargetArray;
		if(!source || !target){ return ; }
		if(this.onMapStart){ this.onMapStart(); }

		for (var i = 0, len = this.items.length; i < len; i++) {
			item = this.items[i];
			propertyTargetArray = NinjaProperty.getPathArray(item.target);
			sourceValue = NinjaProperty.value(source, item.source);

			if(item.onBeforeSet){ sourceValue = item.onBeforeSet(sourceValue); }
			NinjaProperty.valueObjectByPathArray(target, propertyTargetArray, sourceValue);
			if(item.onAfterSet){ item.onAfterSet(); }
		}
		if(this.onMapComplete){ this.onMapComplete(); }
		return target;
	}
};

var NinjaMapProperty = function(source, target, onBeforeSet, onAfterSet){
	this.source = source;
	this.target = target;
	this.onBeforeSet = onBeforeSet;
	this.onAfterSet = onAfterSet;
};
