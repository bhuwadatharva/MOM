//this is created to prevent the server down when the some error in any inputs take place
export const catchAsyncErrors = (theFunction) => {
    return(req, res, next)=>{
        Promise.resolve(theFunction(req,res,next)).catch(next); //the next is like a jump that tells that if there is a error while working then it should not shut the server 
    };
};