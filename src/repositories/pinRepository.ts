import { Collection, Db, ExplainVerbosity } from 'mongodb';
import { client } from '../config/connect.js';
import { Pin } from '../models/pin.js';

export class PinRepository {
    private db: Db;
    private collection: Collection<
        Pin | { location: { type: string; coordinates: number[] } }
    >;
    private static instance: PinRepository;

    private constructor() {
        this.intit();
        this.db = client.db('obspenha');
        this.collection = this.db.collection('pins');
    }

    private async intit() {
        console.log('[MONGODB]: Starting attempt to connect to server');
        await client.connect();
        console.log('[MONGODB]: Connection stablished');
    }

    private async validateRepository() {
        if (!this.collection) throw new Error('Unable fo find pin collection');
    }

    public static getInstance() {
        if (!PinRepository.instance) {
            PinRepository.instance = new PinRepository();
        }

        return PinRepository.instance;
    }

    public async saveOne(pin: Pin) {
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
        } catch (e) {
            return false;
        }
    }

    public async saveAll(pins: Pin[]) {
        this.validateRepository();

        try {
            const response = await this.collection.insertMany(
                pins.map((pin) => ({
                    ...pin,
                    location: {
                        type: 'Point',
                        coordinates: [pin.longitude, pin.latitude],
                    },
                })),
            );
            return response.insertedCount;
        } catch (e) {
            return -1;
        }
    }

    /**
     *
     * @param radius radius in kilometers
     */
    public async getAllInRadius(
        longitude: number,
        latitude: number,
        radius: number = 5,
    ) {
        try {
            const result = this.collection.find<Pin>({
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

            let pins: Pin[] = [];

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
        } catch (e) {
            throw new Error('Unable to get pins: ' + e);
        }
    }

    public async likePin(pinId: string, userId: string) {
        const result = await this.collection.updateOne(
            { id: pinId },
            { $addToSet: { likes: userId } },
        );

        return result.modifiedCount > 0;
    }
}

export default PinRepository.getInstance();
