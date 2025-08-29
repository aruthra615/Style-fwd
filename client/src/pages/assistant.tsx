import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Camera, Mic, Sparkles, Bot, User, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { chatApi, productsApi } from "@/lib/api";
import ProductCard from "@/components/product-card";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  analysis?: any;
}

export default function Assistant() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your StyleForward AI assistant. I can help you analyze outfits, find perfect fits, and recommend styles based on your profile. Upload a photo of an outfit you're trying on, or ask me any fashion question!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch recommended products
  const { data: recommendedProducts = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => productsApi.getAll({ category: 'Kurtas' }).then(products => products.slice(0, 3))
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: { message: string, userId: string }) => 
      chatApi.sendMessage(data.userId, data.message),
    onSuccess: (response) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  });

  const analyzeOutfitMutation = useMutation({
    mutationFn: (data: { file: File, userId: string }) => 
      chatApi.analyzeOutfit(data.file, data.userId),
    onSuccess: (analysis) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "✨ Outfit Analysis Complete",
        timestamp: new Date(),
        analysis
      };
      setMessages(prev => [...prev, aiMessage]);
      toast({
        title: "Analysis Complete!",
        description: "Your outfit has been analyzed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze your outfit. Please try again.",
        variant: "destructive",
      });
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() && !selectedFile) return;

    if (selectedFile) {
      // Add user message with image
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: inputMessage || "Can you analyze this outfit?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      // Analyze the outfit
      analyzeOutfitMutation.mutate({ 
        file: selectedFile, 
        userId: "temp-user-id" 
      });

      setSelectedFile(null);
    } else {
      // Send text message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: inputMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      sendMessageMutation.mutate({ 
        message: inputMessage, 
        userId: "temp-user-id" 
      });
    }

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
    }
  };

  const renderAnalysis = (analysis: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600" data-testid="fit-score">
            {analysis.fitScore}
          </div>
          <div className="text-sm text-muted-foreground">Fit Score</div>
        </div>
        <div className="bg-white/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-600" data-testid="color-match">
            {analysis.colorMatch}
          </div>
          <div className="text-sm text-muted-foreground">Color Match</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h5 className="font-medium text-foreground">What's Working:</h5>
        <ul className="text-sm space-y-1" data-testid="positives-list">
          {analysis.positives?.map((positive: string, index: number) => (
            <li key={index}>• {positive}</li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-2">
        <h5 className="font-medium text-foreground">Suggestions:</h5>
        <ul className="text-sm space-y-1" data-testid="suggestions-list">
          {analysis.suggestions?.map((suggestion: string, index: number) => (
            <li key={index}>• {suggestion}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Chat Interface */}
          <div className="lg:col-span-2 bg-card rounded-2xl shadow-lg flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">StyleForward AI</h3>
                  <p className="text-sm text-muted-foreground">Your personal fashion assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
            </div>
            
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4" data-testid="chat-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex space-x-3 ${
                      message.role === 'user' ? 'justify-end' : ''
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    
                    <div className={`flex-1 ${message.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                      <div
                        className={`rounded-2xl p-4 max-w-lg ${
                          message.role === 'user'
                            ? 'chat-message-user text-primary-foreground rounded-tr-sm'
                            : 'chat-message-assistant text-foreground rounded-tl-sm'
                        }`}
                      >
                        {message.analysis ? (
                          <div>
                            <h4 className="font-semibold text-foreground mb-4">{message.content}</h4>
                            {renderAnalysis(message.analysis)}
                          </div>
                        ) : (
                          <p>{message.content}</p>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    
                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {(sendMessageMutation.isPending || analyzeOutfitMutation.isPending) && (
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                    <div className="chat-message-assistant rounded-2xl rounded-tl-sm p-4">
                      <p className="text-muted-foreground">Analyzing...</p>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            {/* Chat Input */}
            <div className="p-6 border-t border-border">
              {selectedFile && (
                <div className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-primary" />
                    <span className="text-sm">{selectedFile.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    data-testid="button-remove-file"
                  >
                    Remove
                  </Button>
                </div>
              )}
              
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Ask about fashion, upload an outfit photo, or request style advice..."
                    className="min-h-[60px] resize-none pr-12"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    data-testid="chat-input"
                  />
                  <button
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="button-attach-file"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                    data-testid="file-input-chat"
                  />
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={(!inputMessage.trim() && !selectedFile) || sendMessageMutation.isPending || analyzeOutfitMutation.isPending}
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <button 
                    className="flex items-center space-x-1 hover:text-primary"
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="button-upload-photo"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Photo</span>
                  </button>
                  <button 
                    className="flex items-center space-x-1 hover:text-primary"
                    data-testid="button-voice-input"
                  >
                    <Mic className="w-3 h-3" />
                    <span>Voice Input</span>
                  </button>
                </div>
                <div>Press Enter to send</div>
              </div>
            </div>
          </div>
          
          {/* Recommendations Sidebar */}
          <div className="bg-card rounded-2xl shadow-lg p-6 overflow-y-auto">
            <h3 className="font-semibold text-foreground mb-4">Style Recommendations</h3>
            
            <div className="space-y-4">
              {recommendedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  data-testid={`recommendation-${index}`}
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-medium text-foreground">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary font-semibold">
                      ₹{(product.priceCents / 100).toLocaleString('en-IN')}
                    </span>
                    <div className="flex items-center space-x-1 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-muted-foreground">
                        {95 - index * 3}% match
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Pro Tip</h4>
              <p className="text-sm text-muted-foreground">
                Based on your warm undertones, earthy and jewel tones will enhance your natural beauty. Try incorporating more browns, golds, and deep teals!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
