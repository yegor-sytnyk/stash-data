(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define("Stash", ["lodash"], factory);
	else if(typeof exports === 'object')
		exports["Stash"] = factory(require("lodash"));
	else
		root["Stash"] = factory(root["lodash"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var memoryProvider_1 = __webpack_require__(1);
	exports.memoryProvider = memoryProvider_1.default;
	//# sourceMappingURL=index.js.map

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _ = __webpack_require__(2);
	var filterHelper_1 = __webpack_require__(3);
	var sortHelper_1 = __webpack_require__(4);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
	    init: init,
	    query: query
	};
	var storage = null;
	function init(data) {
	    storage = data;
	}
	function query(params) {
	    var results = storage;
	    //TODO check query params should be one of (where, limit, order etc)
	    if (params.where) {
	        (function () {
	            var queryFilter = filterHelper_1.default.getFilter(params.where);
	            results = results.filter(function (x) {
	                return queryFilter(x);
	            });
	        })();
	    }
	    if (params.order) {
	        sortHelper_1.default.sort(results, params.order);
	    }
	    if (params.limit) {
	        var offset = params.offset;
	        if (!offset) offset = 0;
	        results = results.slice(offset, offset + params.limit);
	    }
	    results = results.map(function (x) {
	        return _.cloneDeep(x);
	    });
	    return Promise.resolve(results);
	}
	//# sourceMappingURL=memoryProvider.js.map

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _ = __webpack_require__(2);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
	    getFilter: getFilter
	};
	var operators = ['$eq', '$ne', '$gte', '$gt', '$lte', '$lt', '$not',
	//'$is',
	'$like', '$notLike', '$iLike', '$notILike', '$between', '$notBetween'];
	var combiners = ['$or', '$and'];
	function getFilter(where) {
	    return combineObjectQueries(where);
	}
	function combineObjectQueries(query) {
	    var isOr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	    var parentKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	
	    var subQueries = [];
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;
	
	    try {
	        for (var _iterator = Object.keys(query)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var param = _step.value;
	
	            var subQuery = getSubQuery(param, query[param], parentKey);
	            if (subQuery) {
	                subQueries.push(subQuery);
	            }
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }
	
	    if (subQueries.length === 0) return function (x) {
	        return true;
	    };
	    if (isOr) return orJoin.apply(undefined, subQueries);
	    return andJoin.apply(undefined, subQueries);
	}
	function getSubQuery(key, value, parentKey) {
	    if (key.startsWith('$')) {
	        checkOperator(key);
	        if (combiners.indexOf(key) !== -1) {
	            return combineObjectQueries(value, key === '$or', parentKey);
	        } else {
	            if (!parentKey) throw Error('TODO: error when operator in top level where');
	            return getSimpleOperatorQuery(key, parentKey, value);
	        }
	    } else {
	        checkFieldName(key);
	        if (_.isObject(value)) {
	            var _ret = function () {
	                var query = combineObjectQueries(value, false, key);
	                return {
	                    v: function v(x) {
	                        return query(x);
	                    }
	                };
	            }();
	
	            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
	        } else {
	            return function (x) {
	                return x[key] === value;
	            };
	        }
	    }
	}
	function getSimpleOperatorQuery(operator, key, value) {
	    //TODO check type for example for $gt should be number for $not bool
	    switch (operator) {
	        case '$eq':
	            return function (x) {
	                return x[key] === value;
	            };
	        case '$ne':
	            return function (x) {
	                return x[key] !== value;
	            };
	        case '$gt':
	            return function (x) {
	                return x[key] > value;
	            };
	        case 'gte':
	            return function (x) {
	                return x[key] >= value;
	            };
	        case '$lt':
	            return function (x) {
	                return x[key] < value;
	            };
	        case 'lte':
	            return function (x) {
	                return x[key] <= value;
	            };
	        case '$not':
	            return function (x) {
	                return x[key] ? false : true;
	            };
	        default:
	            throw new Error("Operator " + operator + " is not supported yet.");
	    }
	}
	function checkOperator(operator) {
	    var isValid = operators.indexOf(operator) !== -1 || combiners.indexOf(operator) !== -1;
	    if (!isValid) throw new Error("Invalid operator '" + operator + "'");
	}
	function checkFieldName(field) {
	    //TODO
	}
	function andJoin() {
	    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	        funcs[_key] = arguments[_key];
	    }
	
	    return function (x) {
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;
	
	        try {
	            for (var _iterator2 = funcs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var func = _step2.value;
	
	                if (!func(x)) return false;
	            }
	        } catch (err) {
	            _didIteratorError2 = true;
	            _iteratorError2 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                    _iterator2.return();
	                }
	            } finally {
	                if (_didIteratorError2) {
	                    throw _iteratorError2;
	                }
	            }
	        }
	
	        return true;
	    };
	}
	function orJoin() {
	    for (var _len2 = arguments.length, funcs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        funcs[_key2] = arguments[_key2];
	    }
	
	    return function (x) {
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;
	
	        try {
	            for (var _iterator3 = funcs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var func = _step3.value;
	
	                if (func(x)) return true;
	            }
	        } catch (err) {
	            _didIteratorError3 = true;
	            _iteratorError3 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                    _iterator3.return();
	                }
	            } finally {
	                if (_didIteratorError3) {
	                    throw _iteratorError3;
	                }
	            }
	        }
	
	        return false;
	    };
	}
	//# sourceMappingURL=filterHelper.js.map

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _ = __webpack_require__(2);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
	    sort: sort
	};
	function sort(list, orderParamsList) {
	    if (!list.length) return list;
	    if (!orderParamsList.length) throw new Error('No order params');
	    var sortParams = [];
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;
	
	    try {
	        for (var _iterator = orderParamsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var orderParams = _step.value;
	
	            var _orderParams = _slicedToArray(orderParams, 2),
	                field = _orderParams[0],
	                orderDirection = _orderParams[1];
	
	            sortParams.push({
	                field: field,
	                type: getType(list[0][field]),
	                isAsc: orderDirection !== 'DESC'
	            });
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }
	
	    var sortFunction = function sortFunction(x, y) {
	        return compareItems(x, y, sortParams);
	    };
	    list.sort(sortFunction);
	}
	function getType(val) {
	    if (_.isString(val)) return 'string';
	    if (_.isNumber(val)) return 'number';
	    throw new Error('Not supported type');
	}
	var sortFunctions = {
	    'string': function string(x, y, field) {
	        return x[field].localeCompare(y[field]);
	    },
	    'number': function number(x, y, field) {
	        return x[field] - y[field];
	    },
	    'date': function date(x, y, field) {
	        return Date.parse(x[field]) - Date.parse(y[field]);
	    }
	};
	function compareItems(x, y, sortParamsList) {
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;
	
	    try {
	        for (var _iterator2 = sortParamsList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var sortParams = _step2.value;
	
	            var dirNum = sortParams.isAsc ? 1 : -1;
	            var sortFunc = sortFunctions[sortParams.type];
	            var sortVal = sortFunc(x, y, sortParams.field) * dirNum;
	            if (sortVal !== 0) return sortVal;
	        }
	    } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                _iterator2.return();
	            }
	        } finally {
	            if (_didIteratorError2) {
	                throw _iteratorError2;
	            }
	        }
	    }
	
	    return 0;
	}
	//# sourceMappingURL=sortHelper.js.map

/***/ }
/******/ ])
});
;
//# sourceMappingURL=lib.js.map