import express from "express"
import dotenv from "dotenv"

import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatGroq } from "@langchain/groq"
import fs from "fs"
import { PDFParse } from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

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





const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001", // 768 dimensions
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
});





const upload = async () => {
    const pdfPath = './knowledge.pdf'
    const buffer = fs.readFileSync(pdfPath)
    const pdfResult = new PDFParse({ data: buffer })
    const result = await pdfResult.getText()
    const text = result.text
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    })
    const docs = await splitter.createDocuments([text])
    console.log(docs)
}
upload()




















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