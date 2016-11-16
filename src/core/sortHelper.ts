import * as _ from 'lodash';

export default {
    sort
}

interface SortParams {
    field: string,
    type: string,
    isAsc: boolean
}

function sort(list, orderParamsList: any[]) {
    if (!list.length) return list;

    if (!orderParamsList.length) throw new Error('No order params');

    let sortParams = [];

    for (let orderParams of orderParamsList) {
        let [field, orderDirection] = orderParams;

        sortParams.push({
            field,
            type: getType(list[0][field]),
            isAsc: orderDirection !== 'DESC'
        });
    }

    let sortFunction = (x, y) => compareItems(x, y, sortParams);

    list.sort(sortFunction);
}

function getType(val) {
    if (_.isString(val)) return 'string';

    if (_.isNumber(val)) return 'number';

    throw new Error('Not supported type');
}

let sortFunctions = {
    'string': (x, y, field) => x[field].localeCompare(y[field]),
    'number': (x, y, field) => (x[field] - y[field]),
    'date': (x, y, field) => (Date.parse(x[field]) - Date.parse(y[field]))
};

function compareItems(x, y, sortParamsList: SortParams[]) {
    for (let sortParams of sortParamsList) {
        let dirNum = sortParams.isAsc ? 1: -1;

        let sortFunc = sortFunctions[sortParams.type];

        let sortVal = sortFunc(x, y, sortParams.field) * dirNum;

        if (sortVal !== 0) return sortVal;
    }

    return 0;
}