import * as _ from 'lodash';

export default {
    init,
    query
}

let storage = null;

function init(data) {
    storage = data;
}

function query(params) {
    let results = storage;

    if (params.where) {
        let queryFilter = getFilter(params.where);

        results = results.filter(x => queryFilter(x));
    }

    results = results.map(x => _.cloneDeep(x));

    return results;
}

function getFilter(where) {
    let subQueries = [];

    for (let param of Object.keys(where)) {
        let subQuery = getSubQuery(param, where[param]);

        if (subQuery) {
            subQueries.push(subQuery);
        }
    }

    if (subQueries.length === 0) return (x) => true;

    return andJoin(...subQueries);
}

function getSubQuery(key, value) {
    if (!_.isObject(value)) {
        return (x) => x[key] === value
    }

    // let subQueries = [];
    //
    // for (let key of Object.keys(value)) {
    //     let subQuery = getSubQuery(param, where[param]);
    //
    //     if (subQuery) {
    //         subQueries.push(subQuery);
    //     }
    // }

    return null;
}

function andJoin(...funcs) {
    return (x) => {
        for (let func of funcs) {
            if (!func(x)) return false;
        }

        return true;
    }
}