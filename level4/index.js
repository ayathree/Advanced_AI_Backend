import express from "express"
import dotenv from "dotenv"
import { GoogleGenAI } from "@google/genai"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatGroq } from "@langchain/groq"
import { Annotation, StateGraph } from "@langchain/langgraph"
dotenv.config()

const app = express()
const port = 5000
app.use(express.json())

//without using langchain

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY

// })

// app.post("/ai", async (req, res) => {
//     const { input } = req.body
//     const response = await ai.models.generateContent({
//         model: "gemini-3.7-flash",
//         contents: [
//             {
//                 role: "system",
//                 parts: [{ text: "you are a assistant and your name is jarvis.And if you don't know ant answer you can tell that you don't know." }]
//             },
//             {
//                 role: "user",
//                 parts: [{ text: input }]
//             }
//         ]
//     })
//     return res.status(200).json({ "ai:": response.text })

// })

//with langchain gemini

// const llm = new ChatGoogleGenerativeAI({
//     model: "gemini-3.7-flash"
// })
// app.post("/ai", async (req, res) => {
//     const { input } = req.body

//     const response = await llm.invoke(input)

//     return res.status(200).json({ "ai:": response.content })

// })

//groq
const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.7,
    maxTokens: 100,
    maxRetries: 2
})


//langgraph
const State = Annotation.Root({
    prompt: Annotation,
    aiMsg: Annotation
})

const callLLM = async (state) => {
    console.log("state:", state)
    const response = await llm.invoke([
        {
            role: "system",
            content: "you are a assistant and your name is jarvis.And if you don't know any answer you can don't need to give wrong answer for that"
        },
        {
            role: "human",
            content: state.prompt
        }
    ])

    return { aiMsg: response.content }
}

const graph = new StateGraph(State)
    .addNode("agent", callLLM)
    .addEdge("__start__", "agent")
    .addEdge("agent", "__end__")
    .compile()









app.post("/ai", async (req, res) => {
    const { input } = req.body

    const response = await graph.invoke({ prompt: input })
    console.log(response)


    return res.status(200).json({ "ai:": response })

})







app.get("/", (req, res) => {
    return res.json({ message: "hello from level4" })
})

app.listen(port, () => {
    console.log("server started")
})