const { reviewCode } = require("../services/ai.service"); 


async function giveResponse(req, res) {

    try {
        const { code } = req.body;

        if (!code) {
        
            return res.status(400).json({
                success: false,
                message: "Plese enter code for review"
            })
        }

        const review = await reviewCode(code);

        res.json({
            success: true,
            review
        })
    } catch (error) {
        console.error("Code Review Error:", error);

        return res.status(500).json({
          success: false,
          message: error.message ,
        });
    }
    
}

module.exports = { giveResponse };
