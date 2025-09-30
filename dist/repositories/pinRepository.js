import { client } from '../config/connect.js';
export class PinRepository {
    constructor() {
        this.intit();
        this.db = client.db('obspenha');
        this.collection = this.db.collection('pins');
    }
    async intit() {
        console.log('[MONGODB]: Starting attempt to connect to server');
        await client.connect();
        console.log('[MONGODB]: Connection stablished');
    }
    async validateRepository() {
        if (!this.collection)
            throw new Error('Unable fo find pin collection');
    }
    static getInstance() {
        if (!PinRepository.instance) {
            PinRepository.instance = new PinRepository();
        }
        return PinRepository.instance;
    }
    async saveOne(pin) {
        this.validateRepository();
        try {
            const response = await this.collection.insertOne({
                ...pin,
                location: {
                    type: 'Point',
                    coordinates: [pin.longitude, pin.latitude],
                },
            });
            await this.collection.createIndex({ location: '2dsphere' });
            return !!response.insertedId;
        }
        catch (e) {
            return false;
        }
    }
    async saveAll(pins) {
        this.validateRepository();
        try {
            const response = await this.collection.insertMany(pins.map((pin) => ({
                ...pin,
                location: {
                    type: 'Point',
                    coordinates: [pin.longitude, pin.latitude],
                },
            })));
            return response.insertedCount;
        }
        catch (e) {
            return -1;
        }
    }
    /**
     *
     * @param radius radius in kilometers
     */
    async getAllInRadius(longitude, latitude, radius = 5) {
        try {
            const result = this.collection.find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude],
                        },
                        $maxDistance: radius * 1000,
                    },
                },
            });
            let pins = [];
            for await (const doc of result) {
                pins.push({
                    id: doc.id,
                    latitude: doc.latitude,
                    longitude: doc.longitude,
                    likes: doc.likes,
                    userId: doc.userId,
                });
            }
            return pins;
        }
        catch (e) {
            throw new Error('Unable to get pins: ' + e);
        }
    }
    async likePin(pinId, userId) {
        const result = await this.collection.updateOne({ id: pinId }, { $addToSet: { likes: userId } });
        return result.modifiedCount > 0;
    }
}
export default PinRepository.getInstance();
