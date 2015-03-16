function merge (obj1, obj2) {
	// add key value pairs from obj2 into obj1
	var merged = {};
	for (var key in obj1) {
		merged[key] = obj1[key];
	}
	for (var key in obj2) {
		merged[key] = obj2[key];
	}
	return merged;
}

function FQL (data) {
	this.original = data;
	this.data = data;
};

FQL.prototype.exec = function () {
	return this.data;
};

FQL.prototype.count = function () {
	return this.exec().length;
};

FQL.prototype.limit = function (n) {
	// cut the result set down
	// limiting it to just the first n rows
	this.data = this.data.slice(0, n);
	return this;
};

FQL.prototype.where = function (conditions) {
	// filter out data based on conditions
	this.data = this.data.filter(function (row) {
		return Object.keys(conditions).every(function (column) {
			var cond = conditions[column];
			if (typeof cond === 'function') {
				return cond(row[column]);
			} else {
				return row[column] == cond;
			}
		});
	});
	return this;
};

FQL.prototype.select = function (columns) {
	// plucks out certain keys
	// narrows data to only include columns
	this.data = this.data.map(function (row) {
		return columns.reduce(function (result, col) {
			// if the row has a property of name col
			// add that to the result, keyed by col
			// return transfored result
			result[col] = row[col];
			return result;
		}, {});
	});
	return this;
};

function defaultCompare (valA, valB) {
	if (typeof valA === 'number' && typeof valB === 'number') {
		return valA - valB;
	} else {
		// do it later...
	}
}

FQL.prototype.order = function (column) {
	// it sorts, basically, by the given column
	this.data = this.data.sort(function (rowA, rowB) {
		return defaultCompare(rowA[column], rowB[column]);
	});
	return this;
};

FQL.prototype.left_join = function (foreignFql, rowMatcher) {
	// the left side of a venn diagram, including the middle
	// test the rowMatcher against each pair of self rows
	// and foreignFql rows
	// upon a match, merge the rows
	var result = [];
	this.data.forEach(function (row) {
		foreignFql.data.forEach(function (foreignRow) {
			if (rowMatcher(row, foreignRow)) {
				result.push(merge(row, foreignRow));
			}
		});
	});
	this.data = result;
	return this;
};

FQL.prototype.getIndicesOf = function (column, val) {};

FQL.prototype.addIndex = function (column) {};