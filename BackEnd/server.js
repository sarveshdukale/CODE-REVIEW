require(`dotenv`).config();
const app = require("./src/app");


app.get("/", (req,res) => {
    res.send("Welcome to code review")
})



app.listen(process.env.PORT, () => {
    console.log(`Server Running on http://localhost:${process.env.PORT}`);

})