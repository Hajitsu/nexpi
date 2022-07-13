function notFound(req, res, next) {
	return res.sendFile(path.join(__dirname, '404.html'));
}

function expressErrorHandler(err, req, res, next) {
	const status = err?.status || err?.code || 500;
	const message = err?.message || 'Internal Server Error';
	return res.status(status).json({
		status,
		success: false,
		message,
	});
}

module.exports = {
	notFound,
	expressErrorHandler,
};
