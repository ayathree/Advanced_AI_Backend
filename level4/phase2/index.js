import express from "express"
import dotenv from "dotenv"

import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatGroq } from "@langchain/groq"

dotenv.config()

const app = express()
const port = 5000
app.use(express.json())



const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 2,
    maxTokens: 100,
    maxRetries: 2
})





















app.post("/ai", async (req, res) => {
    const { input } = req.body

    const response = await llm.invoke(
        input
    )



    return res.status(200).json({ "ai:": response.content })

})







app.get("/", (req, res) => {
    return res.json({ message: "hello from level4" })
})

app.listen(port, () => {
    console.log("server started")
})