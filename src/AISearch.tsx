import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { FaArrowUp } from "react-icons/fa6"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"

interface Props {
    query: string,
    api_key: string
}

interface ChatMessage {
    role: string,
    text: string
}

export default function AISearch({query, api_key}: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [text, setText] = useState("")

    async function askAI(query: string, api_key: string) {
        const userMessage = { role: "user", text: query.trim() }
        const updatedHistory = [...messages, userMessage]
        setMessages(updatedHistory)
        setText("")

        const cleanedLog = updatedHistory.map((message) => {
            return `${message.role}: ${message.text}`
        }).join('\n')
        const prompt = 
            `
            1. You are Nexus, an AI assistant on the startpage called nexus. 
            2. Provide accurate, clear, and conversational answers; keep responses concise and direct by default, only expanding when detail is necessary and always give good sources (in italics).
            3. You have access to markdown and rehypeRaw; freely use rich formatting features like headers, code blocks, bulleted lists, bold, italics, and blockquotes when helpful, but all links must be written as raw HTML <a href="URL" target="_blank" rel="noopener noreferrer">Text</a> tags instead of Markdown syntax to ensure they open in a new tab.
            4. Do not tell me your reasoning unless I ask or the prompt.

            This is our chatlog: ${cleanedLog}
            `
            try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                Authorization: `Bearer ${api_key}`,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                model: 'deepseek/deepseek-v4-flash',
                messages: [
                    {
                    role: 'user',
                    content: prompt
                    },
                ],
                }),
            })

            const data = await response.json()
            const result = data.choices[0].message.content
            setMessages((prev) => [...prev, {role: "ai", text: result}])
        } catch(error) {
            console.error(error)
        }
    }

    useEffect(() => {
        askAI(query, api_key)
    }, [query, api_key])
    
    return (
        <AnimatePresence>
            <div key={"msg-div"}  style={{ margin: 0, marginBottom: 150, overflow: "scroll" }}>
                {messages.map((message, index) => (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={index} className={message.role === "user" ? "user-msg" : "ai-msg"}>{message.role === "user" ? <div>{message.text}</div> : <Markdown rehypePlugins={[rehypeRaw]}>{message.text}</Markdown>}</motion.div>
                ))}
            </div>
            <motion.div key={"input-box"}  className='input-box' initial={{ y: 50 }} animate={{ y: 0 }} >
                <input key={"chat-input"} placeholder='Chat with Nexus' value={text} onChange={(e) => {setText(e.target.value)}} onKeyDown={(e) => {if (e.key === "Enter") {askAI(e.currentTarget.value, api_key)}}}/>
                <motion.button key={"chat-btn"}  initial={{ scale: 1, opacity: 1 }} whileTap={{ scale: 0.8, opacity: 0.5 }}  onClick={() => {askAI(text, api_key)}}><FaArrowUp key={"FaArrowUp"}  size={15}/></motion.button>
            </motion.div>
        </AnimatePresence>
    )
}