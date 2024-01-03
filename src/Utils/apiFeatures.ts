export default class ApiFeatures {
    dbQueryBulder: any;

    reqQuery: any;

    constructor(dbQueryBulder: any, reqQuery: any) {
        this.dbQueryBulder = dbQueryBulder;
        this.reqQuery = reqQuery;
    }

    filter() {
        // filtering
        const queryObj = { ...this.reqQuery };
        const excludeValues = ['limit', 'page', 'fields', 'sort'];
        excludeValues.forEach((el) => delete queryObj[el]);

        // advance filtering
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        this.dbQueryBulder
            .select('*')
            .where(JSON.parse(queryString))
            .withGraphFetched('users')
            .withGraphFetched('trips');
        return this;
    }
}
