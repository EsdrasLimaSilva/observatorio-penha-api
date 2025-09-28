import client from "./connect";

class MongoClient {
    instance;
    database;

    constructor() {
        if (!database) {
            this.database = client.db("obspenha");
        }
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new MongoClient();
        }
        return this.instance;
    }
}

module.exports = { MongoClient };
