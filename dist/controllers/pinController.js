import { Pin } from '../models/pin.js';
import { PinRepository } from '../repositories/pinRepository.js';
import { ResponseDto } from '../dto/ResponseDto.js';
export class PinController {
    async createPin(req, res, next) {
        try {
            const body = req.body;
            if (!body || !body.latitude || !body.longitude || !body.userId) {
                return res.status(400).json({ message: 'Invalid body' });
            }
            const pin = new Pin(body.userId, body.latitude, body.longitude);
            const result = await PinController.pinRepository.saveOne(pin);
            if (result) {
                return res.status(200).json(pin);
            }
            return res.status(400).json({ error: 'Pin no created' });
        }
        catch (e) {
            next(e);
        }
    }
    async getPins(req, res, next) {
        try {
            const { lat, lng } = req.query;
            const pins = await PinController.pinRepository.getAllInRadius(Number(lng), Number(lat));
            return res.status(200).json({ pins });
        }
        catch (e) {
            next(e);
        }
    }
    async likePin(req, res, next) {
        try {
            const { pinId, userId } = req.body;
            if (!pinId || !userId) {
                return res.status(400).json({ error: 'Invalid body' });
            }
            const liked = await PinController.pinRepository.likePin(pinId, userId);
            if (!liked) {
                return ResponseDto.generate(res, {
                    ok: false,
                    status: 400,
                    error: 'Unable to like pin',
                });
            }
            return res.status(200).json(ResponseDto.generate(res, {
                ok: true,
                status: 200,
                message: 'Pin liked',
            }));
        }
        catch (e) {
            next(e);
        }
    }
}
(() => {
    PinController.pinRepository = PinRepository.getInstance();
})();
export default new PinController();
