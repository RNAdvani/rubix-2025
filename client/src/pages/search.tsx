import SearchBar from "../components/SearchBar"
import ImageResults from "../components/ImageResults"
import PeopleResults from "../components/PeopleResults"
import TimeCapsules from "../components/TimeCapsules"
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import VoiceGenerator from "@/components/review-page";

interface ChatMessageProps {
  content: string
  isUser: boolean
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`max-w-md p-2 rounded-lg ${isUser ? "bg-primary text-secondary pr-3" : "bg-secondary text-secondary-foreground pl-3"}`}>
        {content}
      </div>
    </motion.div>
  )
}




export const Genai = () => {
  const [prompt, setPrompt] = useState("")
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchResponses()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [responses])

  const fetchResponses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/responses")
      if (res.data.success) {
        setResponses(res.data.responses)
      }
    } catch (error) {
      console.error("Error fetching responses:", error)
      toast({
        title: "Error",
        description: "Failed to fetch responses. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt before generating.",
        variant: "destructive",
      })
      return
    }
    setLoading(true)

    try {
      const res = await axios.post("http://localhost:3000/api/generate", { prompt })
      if (res.data.success) {
        setPrompt("")
        fetchResponses()
      } else {
        throw new Error("Failed to generate response.")
      }
    } catch (error) {
      console.error("Error generating response:", error)
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
        {/* <VoiceGenerator /> */}

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Gemini Chat
      </motion.h1>

      <div className="flex-grow overflow-auto mb-4 space-y-4">
        <AnimatePresence>
          {responses.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessage content={item.prompt} isUser={true} />
              <ChatMessage content={item.response} isUser={false} />
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-end space-x-2"
      >
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="flex-grow resize-none"
        />
        <Button onClick={handleGenerate} disabled={loading} className="h-full">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </motion.div>
    </div>
  )
}


export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <ImageResults />
        <PeopleResults />
      </div>
      <TimeCapsules />
      <Genai />
    </div>
  )
}

