import jwt from 'jsonwebtoken'; // Import the jsonwebtoken package

export const generateToken = (user, message, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });

    res.status(statusCode).cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    }).json({
        success: true,
        message,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            designation: user.designation,
        },
    });
};
