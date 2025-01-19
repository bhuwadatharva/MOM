class ErrorHandler extends Error { //in a node.js we use class due to this only the backend required the OOP so that you can use the class object, constructor and destructor
    constructor(message,statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
export const errormiddleWare = (err, req, res, next) => {
    err.message = err.message || "Internal server error";
    err.statusCode = err.statusCode || 500;

    if(err.code ===11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }
    if(err.name === "JsonWebTokenError"){
        const message ="Json web token is Invalid, Try Again!";
        err = new ErrorHandler(message, 400);
    }
    if(err.name === "TokenExpiredError"){
        const message ="Json web token is Expired, Try Again!";
        err = new ErrorHandler(message, 400);
    }
    if(err.name === "CastError"){
        const message =`Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    const errorMessage = err.errors  // this will only print the error but not give the actual backened code in the output
    ? Object.values(err.errors)
    .map((error)=> error.message)
    .join(" ")
    :err.message;

    return res.status(err.statusCode).json({
        success:false,
        message: errorMessage,
    });
    
};



export default ErrorHandler;