import { v4 as uuid } from 'uuid';

export class Pin {
    id: string;
    userId: string;
    latitude: number;
    longitude: number;
    likes: string[];

    constructor(userId: string, latitude: number, longitude: number) {
        this.id = uuid();
        this.userId = userId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.likes = [];
    }
}
