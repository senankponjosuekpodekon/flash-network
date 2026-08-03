export default function errorMiddleware(err, req, res, next) {
    console.error(err);

    const status = err.status || (err.message && err.statusCode) || 500;
    const message = status < 500 ? err.message : "Internal server error";

    res.status(status).json({
        error: message
    });
}
