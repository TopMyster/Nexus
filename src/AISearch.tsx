import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { FaArrowUp } from "react-icons/fa6"

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
        const userMessage = { role: "user", text: query }
        const updatedHistory = [...messages, userMessage]
        setMessages(updatedHistory)

        const cleanedLog = updatedHistory.map((message) => {
            return `${message.role}: ${message.text}`
        }).join('\n')
        const prompt = 
            `
            Answer my question with detail yet 40 words on the average. Do not tell me your reasoning. 
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
                model: 'google/gemma-4-31b-it',
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
            {messages.map((message, index) => (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={index} className={message.role === "user" ? "user-msg" : "ai-msg"}>{message.text}</motion.div>
            ))}
            <motion.div className='input-box' initial={{ y: 50 }} animate={{ y: 0 }} >
                <input placeholder='Chat with Nexus' value={text} onChange={(e) => {setText(e.target.value)}} onKeyDown={(e) => e.key === "Enter" && askAI(text, api_key)}/>
                <motion.button initial={{ scale: 1, opacity: 1 }} whileTap={{ scale: 0.8, opacity: 0.5 }} onClick={() => {askAI(text, api_key)}}><FaArrowUp size={15}/></motion.button>
            </motion.div>
        </AnimatePresence>
    )
}