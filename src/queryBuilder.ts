import * as _ from 'lodash';

export default {
    getQuery
}

const operators = [
    '$eq',
    '$ne',
    '$gte',
    '$gt',
    '$lte',
    '$lt',
    '$not',
    '$is',
    '$like',
    '$notLike',
    '$iLike',
    '$notILike',
    '$between',
    '$notBetween',
    '$overlap',
    '$contains',
    '$contained'
];

const combiners = [
    '$or',
    '$and'
];

function getQuery(where) {
    return combineObjectQueries(where);
}

function combineObjectQueries(query, isOr = false) {
    let subQueries = [];

    for (let param of Object.keys(query)) {
        let subQuery = getSubQuery(param, query[param]);

        if (subQuery) {
            subQueries.push(subQuery);
        }
    }

    if (subQueries.length === 0) return (x) => true;

    if (isOr) return orJoin(...subQueries);

    return andJoin(...subQueries);
}

function getSubQuery(key, value) {
    if (key.startsWith('$')) {
        checkOperator(key);

        if (combiners.indexOf(key) !== -1) {
            return combineObjectQueries(value, key === '$or')
        }
    } else {
        checkFieldName(key);

        if (_.isObject(value)) {
            let query = combineObjectQueries(value);

            return (x) => x[key] === query(x)
        } else {
            return (x) => x[key] === value
        }
    }

    return null;
}

function checkOperator(operator) {
    let isValid = operators.indexOf(operator) !== -1 ||
            combiners.indexOf(operator) !== -1;

    if (!isValid) throw new Error(`Invalid operator '${operator}'`);
}

function checkFieldName(field) {
    //TODO
}

function andJoin(...funcs) {
    return (x) => {
        for (let func of funcs) {
            if (!func(x)) return false;
        }

        return true;
    }
}

function orJoin(...funcs) {
    return (x) => {
        for (let func of funcs) {
            if (func(x)) return true;
        }

        return false;
    }
}