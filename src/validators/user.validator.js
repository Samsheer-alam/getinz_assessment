/**
 * @description Validates user input for phone number and email address.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns None
 */
const userValidator = (req, res, next) => {
    const { phoneNumber, email } = req.body;

    //Check if both phoneNumber and email is not given
    if (phoneNumber === undefined && email === undefined) {
        return res.status(400).json({ message: 'Phone number or email is required' });
    }

    // Check if phoneNumber is given and is a string and contains only digits
    if (phoneNumber !== undefined && (typeof phoneNumber !== 'string' || !/^\d+$/.test(phoneNumber) || phoneNumber.length !== 10)) {
        return res.status(400).json({ message: 'Phone number is invalid' });
    }


    // Check if gmail is given and is a string and valid email
    if (email !== undefined && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        return res.status(400).json({ message: 'Email address is invalid' });
    }

    // If phoneNumber is valid, call the next middleware function
    next();
}

module.exports = { userValidator }