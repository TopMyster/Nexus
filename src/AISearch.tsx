import { useState, useEffect } from "react"

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
        <div>
            {messages.map((message, index) => (
                <div key={index} className={message.role === "user" ? "user-msg" : "ai-msg"}>{message.text}</div>
            ))}
            <div className='input-box'>
                <input placeholder='Chat with Nexus' value={text} onChange={(e) => {setText(e.target.value)}} onKeyDown={(e) => e.key === "Enter" && askAI(text, api_key)}/>
                <button onClick={() => {askAI(text, api_key)}}>Ask</button>
            </div>
        </div>
    )
}