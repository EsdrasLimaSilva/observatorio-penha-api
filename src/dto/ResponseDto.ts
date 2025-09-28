import { Response } from 'express';

export class ResponseDto {
    static generate(
        res: Response,
        {
            ok,
            message,
            error,
            status,
        }: {
            ok: boolean;
            status: number;
            message?: string;
            error?: string;
        },
    ) {
        return res.status(status).json({ ok, message, error });
    }
}
