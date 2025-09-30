export class ResponseDto {
    static generate(res, { ok, message, error, status, }) {
        return res.status(status).json({ ok, message, error });
    }
}
