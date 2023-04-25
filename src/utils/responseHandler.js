class RequestHandler {
    /**
     * @description Sends a response to the client with the given status code, message, and data.
     * @param {Object} res - The response object from Express.
     * @param {number} status - The HTTP status code to send.
     * @param {Object} [data=null] - The data to send in the response.
     * @param {string} [message="success"] - The message to send in the response.
     * @returns None
     */
    sendSuccess(res, status, data = null, message = "success") {
        return res.status(status || 200).json({
            status, message, data
        });
    }

    /**
     * @description Sends an error response to the client with the given error message and status code.
     * @param {Object} res - The response object to send the error to.
     * @param {Object} error - The error object to send to the client.
     * @returns None
     */
    sendError(res, error) {
        return res.status(error.status || 500).json({
            type: 'error', message: error.message || error.message || 'Unhandled Error', error,
        });
    }
}

module.exports = RequestHandler;
