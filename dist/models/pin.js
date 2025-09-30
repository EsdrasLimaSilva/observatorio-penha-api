import { v4 as uuid } from 'uuid';
export class Pin {
    constructor(userId, latitude, longitude) {
        this.id = uuid();
        this.userId = userId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.likes = [];
    }
}
