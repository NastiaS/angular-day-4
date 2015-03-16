function merge (obj1, obj2) {
	// add key value pairs from obj1 and obj2 into merged
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
	this.indexTables = {};
};

FQL.prototype.exec = function () {
	var result = this.data;
	// reset data for next query
	this.data = this.original;
	return result;
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
	var self = this;
	function whereOne (data, col, cond) {
		if (self.getIndicesOf(col, cond)) {
			// index lookup
			var indices = self.getIndicesOf(col, cond);
			return indices.map(function (idx) {
				// each index return a resulting
				// data element
				return self.original[idx];
			});
		} else {
			return data.filter(function (row) {
				// normal where lookup
				if (typeof cond === 'function') {
					return cond(row[col]);
				} else {
					return row[col] == cond;
				}
			});
		}
	}
	this.data = Object.keys(conditions).reduce(function (data, col) {
		// recursively narrow down data set
		// using whereOne for each condition key/val pair
		var cond = conditions[col];
		return whereOne(data, col, cond);
	}, this.data);
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
		return valA < valB ? 1 : -1;
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
	// // ---- stateful approach
	// var result = [];
	// this.data.forEach(function (row) {
	// 	foreignFql.data.forEach(function (foreignRow) {
	// 		if (rowMatcher(row, foreignRow)) {
	// 			result.push(merge(row, foreignRow));
	// 		}
	// 	});
	// });
	// this.data = result;
	// --- functional approach
	this.data = this.data.reduce(function (outerResult, row) {
		return foreignFql.data.reduce(function (innerResult, foreignRow) {
			if (rowMatcher(row, foreignRow)) {
				innerResult.push(merge(row, foreignRow));
			}
			return innerResult;
		}, outerResult);
	}, []);
	return this;
};

FQL.prototype.getIndicesOf = function (column, val) {
	// return the array of indices in the column's
	// index table
	if (this.indexTables[column]) {
		return this.indexTables[column][val];
	}
};

FQL.prototype.addIndex = function (column) {
	// construct a reverse lookup table for a 
	// given column
	var idxTable = this.indexTables[column] = {};
	this.original.forEach(function (row, idx) {
		var val = row[column];
		if (!idxTable[val]) {
			idxTable[val] = [idx];
		} else {
			idxTable[val].push(idx);
		}
	});
};