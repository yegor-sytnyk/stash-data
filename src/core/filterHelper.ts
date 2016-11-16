import * as _ from 'lodash';

export default {
    getFilter
}

const operators = [
    '$eq',
    '$ne',
    '$gte',
    '$gt',
    '$lte',
    '$lt',
    '$not',
    //'$is',
    '$like',
    '$notLike',
    '$iLike',
    '$notILike',
    '$between',
    '$notBetween',
    //'$overlap',
    //'$contains',
    //'$contained'
];

const combiners = [
    '$or',
    '$and'
];

function getFilter(where) {
    return combineObjectQueries(where);
}

function combineObjectQueries(query, isOr = false, parentKey = null) {
    let subQueries = [];

    for (let param of Object.keys(query)) {
        let subQuery = getSubQuery(param, query[param], parentKey);

        if (subQuery) {
            subQueries.push(subQuery);
        }
    }

    if (subQueries.length === 0) return (x) => true;

    if (isOr) return orJoin(...subQueries);

    return andJoin(...subQueries);
}

function getSubQuery(key, value, parentKey) {
    if (key.startsWith('$')) {
        checkOperator(key);

        if (combiners.indexOf(key) !== -1) {
            return combineObjectQueries(value, key === '$or', parentKey)
        } else {
            if (!parentKey) throw Error('TODO: error when operator in top level where');

            return getSimpleOperatorQuery(key, parentKey, value)
        }
    } else {
        checkFieldName(key);

        if (_.isObject(value)) {
            let query = combineObjectQueries(value, false, key);

            return (x) => query(x)
        } else {
            return (x) => x[key] === value
        }
    }
}

function getSimpleOperatorQuery(operator, key, value) {
    //TODO check type for example for $gt should be number for $not bool
    switch (operator){
        case '$eq':
            return (x) => x[key] === value;
        case '$ne':
            return (x) => x[key] !== value;
        case '$gt':
            return (x) => x[key] > value;
        case 'gte':
            return (x) => x[key] >= value;
        case '$lt':
            return (x) => x[key] < value;
        case 'lte':
            return (x) => x[key] <= value;
        case '$not':
            return (x) => x[key] ? false: true;
        default:
            throw new Error(`Operator ${operator} is not supported yet.`);
    }
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