import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, User, Clock, MessageSquare } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { messageApi } from "../api/messageApi";
import { companyApi } from "../api/companyApi";
import type { MessageDto } from "../types/message";
import type { CompanyDto } from "../types/company";
import { useAuthStore } from "../store/authStore";

export function Messages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialUser = searchParams.get("user");
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialUser);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [msgsData, compsData] = await Promise.all([
        messageApi.getAll(),
        companyApi.getAll(),
      ]);
      setMessages(msgsData);
      setCompanies(compsData);
    } catch (err) {
      console.error("Failed to load messages.", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeConversationId]);

  // Group messages by user (conversations)
  const conversations = useMemo(() => {
    if (!user) return [];
    
    const convoMap = new Map<string, { lastMessage: MessageDto, unreadCount: number }>();
    
    // Add the user from URL if they don't have messages yet
    if (initialUser && initialUser !== user.id && !convoMap.has(initialUser)) {
      convoMap.set(initialUser, {
        lastMessage: { id: "draft", senderId: user.id, receiverId: initialUser, content: "Start a conversation...", sentAt: new Date().toISOString(), isRead: true },
        unreadCount: 0
      });
    }

    messages.forEach(msg => {
      const otherUser = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      if (otherUser === user.id) return; // Skip self messages
      
      const existing = convoMap.get(otherUser);
      if (!existing || new Date(msg.sentAt) > new Date(existing.lastMessage.sentAt)) {
        convoMap.set(otherUser, {
          lastMessage: msg,
          unreadCount: (existing?.unreadCount || 0) + (msg.senderId === otherUser && !msg.isRead ? 1 : 0)
        });
      } else if (msg.senderId === otherUser && !msg.isRead) {
        existing.unreadCount++;
      }
    });

    return Array.from(convoMap.entries()).map(([userId, data]) => ({
      userId,
      ...data
    })).sort((a, b) => new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime());
  }, [messages, user, initialUser]);

  const activeMessages = useMemo(() => {
    if (!activeConversationId) return [];
    return messages
      .filter(m => 
        (m.senderId === activeConversationId && m.receiverId === user?.id) || 
        (m.receiverId === activeConversationId && m.senderId === user?.id)
      )
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  }, [messages, activeConversationId, user]);

  // Mark active messages as read
  useEffect(() => {
    const unreadMsgs = activeMessages.filter(m => m.senderId === activeConversationId && !m.isRead);
    if (unreadMsgs.length > 0) {
      unreadMsgs.forEach(msg => {
        messageApi.markAsRead(msg.id).catch(console.error);
      });
      // Update local state
      setMessages(prev => prev.map(m => unreadMsgs.find(u => u.id === m.id) ? { ...m, isRead: true } : m));
    }
  }, [activeMessages, activeConversationId]);

  const getDisplayName = (id: string) => {
    const comp = companies.find(c => c.userId === id);
    return comp ? comp.name : `User #${id.slice(0,6)}`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversationId || !newMessage.trim()) return;

    setIsSending(true);
    try {
      const msg = await messageApi.create({
        receiverId: activeConversationId,
        content: newMessage.trim()
      });
      setMessages(prev => [...prev, msg]);
      setNewMessage("");
    } catch {
      alert("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setSearchParams({ user: id });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)] animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2dd4bf] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-fade-up">
      {/* Left Pane: Conversations */}
      <Card className="dashboard-card md:w-80 flex flex-col flex-shrink-0" noPadding>
        <div className="p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-white">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No conversations yet.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {conversations.map((convo) => (
                <div
                  key={convo.userId}
                  onClick={() => handleSelectConversation(convo.userId)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-[#1a2e2e] ${
                    activeConversationId === convo.userId ? "bg-[#1a2e2e] border-l-2 border-[#2dd4bf]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white truncate pr-2">
                      {getDisplayName(convo.userId)}
                    </h3>
                    <span className="text-[10px] text-gray-500 shrink-0">
                      {new Date(convo.lastMessage.sentAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 truncate pr-4">
                      {convo.lastMessage.senderId === user?.id ? "You: " : ""}
                      {convo.lastMessage.content}
                    </p>
                    {convo.unreadCount > 0 && (
                      <span className="bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {convo.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Right Pane: Active Chat */}
      <Card className="dashboard-card flex-1 flex flex-col min-w-0" noPadding>
        {activeConversationId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center border border-[var(--border)]">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{getDisplayName(activeConversationId)}</h2>
                <p className="text-xs text-teal-400">Online</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <MessageSquare className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400">No messages yet. Send a message to start the conversation.</p>
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                          isMe
                            ? "bg-teal-600 text-white rounded-br-sm"
                            : "bg-[#1a2e2e] border border-[var(--border)] text-gray-200 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-[var(--border)] bg-black/10">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-[#1a2e2e] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:border-teal-500/50 transition-colors"
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="px-4 bg-teal-500 hover:bg-teal-600"
                  isLoading={isSending}
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="w-16 h-16 mb-4 text-gray-600" />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </Card>
    </div>
  );
}
