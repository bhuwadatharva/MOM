import app from "./app.js"


app.listen(process.env.PORT, () =>{
    console.log(`Server listening on port ${process.env.PORT}`); // THIS WAS USE TO CHECK WHETHER THE PATH GIVEN IN APP.JS OF CONFIG IS CORRECT OR NOT AND IT IS IN WORKING 
});