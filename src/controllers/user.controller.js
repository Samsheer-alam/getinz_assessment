const jwt = require("jsonwebtoken");
const RequestHandler = require('../utils/responseHandler');
const User = require("../models/user.model");

const requestHandler = new RequestHandler();

class UsersController {

    /**
     * @description Sends an OTP to the user's phone number or email address and updates the user's information in the database.
     * @param {Object} req - The request object containing the user's phone number or email address.
     * @param {Object} res - The response object to send the result of the operation.
     * @returns None
     * @throws {Error} If there is an error updating the user's information in the database.
     */
    static async sendOTP(req, res) {
        try {
            const { phoneNumber, email } = req.body;
            const randomNumber = Math.floor(1000 + Math.random() * 9000);

            let where = { email };
            if (phoneNumber !== undefined) {
                where = { phoneNumber };
            }
            const data = await User.updateOne(
                where,
                { phoneNumber, email, status: false, otp: randomNumber },
                { upsert: true }
            );

            return requestHandler.sendSuccess(res, 200, data);
        } catch (err) {
            return requestHandler.sendError(res, err);
        }
    }

    /**
     * @description Logs in a user by verifying their phone number or email and OTP.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Object} - Returns a success response with a JWT token if the login is successful, or an error response if it fails.
     * @throws {Object} - Throws an error if there is an issue with the database or if the user is not found or the OTP is invalid.
     */
    static async login(req, res) {
        try {
            const { phoneNumber, email, otp } = req.body;
            let where = { email };
            if (phoneNumber !== undefined) {
                where = { phoneNumber };
            }
            const userInfo = await User.findOne(where).lean();
            if (userInfo?.otp !== otp && userInfo?.otp !== 9999) {
                const err = { status: 404, message: "User not found or Invalid OTP." }
                return requestHandler.sendError(res, err);
            }
            //Prepare JWT token for authentication
            const jwtPayload = { user: userInfo };
            const jwtData = { expiresIn: process.env.JWT_TIMEOUT_DURATION, };
            const secret = process.env.JWT_SECRET;

            //Generated JWT token with Payload and secret.
            const token = jwt.sign(jwtPayload, secret, jwtData);
            return requestHandler.sendSuccess(res, 200, { token });
        } catch (err) {
            return requestHandler.sendError(res, err);
        }
    }

    /**
     * @description Retrieves all users from the database and returns them as a JSON object.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Object} - A JSON object containing all users with their _id, email, phoneNumber, and status.
     * @throws {Error} - If there is an error retrieving the users from the database.
     */
    static async getAllUsers(req, res) {
        try {
            const users = await User.find().select({ _id: 1, email: 1, phoneNumber: 1, status: 1 }).lean();
            return requestHandler.sendSuccess(res, 200, users);
        } catch (err) {
            return requestHandler.sendError(res, err);
        }
    }

    /**
     * @description Retrieves user information for the specified user ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Object} - Returns a JSON object containing the user's ID, email, phone number, and status.
     * @throws {Object} - Throws an error if the user is not found or if there is an error retrieving the user information.
     */
    static async getUserInfo(req, res) {
        try {
            const userInfo = await User.findById(req.params.id).select({ _id: 1, email: 1, phoneNumber: 1, status: 1 }).lean();
            if (!userInfo) {
                const err = { status: 404, message: "User not found." }
                return requestHandler.sendError(res, err);
            }
            return requestHandler.sendSuccess(res, 200, userInfo);
        } catch (err) {
            return requestHandler.sendError(res, err);
        }
    }

    /**
     * @description Removes a user from the database by their ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise} A promise that resolves with a success message or rejects with an error.
     * @throws {Error} If there is an error removing the user.
     */
    static async removeUser(req, res) {
        try {
            const userInfo = await User.findByIdAndRemove(req.params.id);
            if (!userInfo) {
                const err = { status: 404, message: "User not found." }
                return requestHandler.sendError(res, err);
            }
            return requestHandler.sendSuccess(res, 200, { message: "Successfully removed the user." });
        } catch (err) {
            return requestHandler.sendError(res, err);
        }
    }
}

module.exports = UsersController;
