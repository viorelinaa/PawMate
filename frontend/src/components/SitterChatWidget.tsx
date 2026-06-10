import { useEffect, useMemo, useState } from "react";
import "../styles/SitterChatWidget.css";
import { useAuth } from "../context/AuthContext";
import {
    getConversations,
    getMessages,
    sendMessage,
    type ChatConversation,
    type ChatMessage,
} from "../services/chatService";

interface SitterChatWidgetProps {
    isOpen: boolean;
    activeConversationId: number | null;
    onOpenChange: (isOpen: boolean) => void;
}

function formatChatDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("ro-RO", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function SitterChatWidget({
    isOpen,
    activeConversationId,
    onOpenChange,
}: SitterChatWidgetProps) {
    const { currentUser } = useAuth();
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(activeConversationId);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState("");
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedConversation = useMemo(
        () => conversations.find((conversation) => conversation.id === selectedId) ?? null,
        [conversations, selectedId]
    );

    const unreadTotal = conversations.reduce((sum, conversation) => sum + conversation.unreadCount, 0);

    async function loadConversations(preferredId?: number | null) {
        if (!currentUser) {
            setConversations([]);
            setSelectedId(null);
            return;
        }

        try {
            setIsLoadingConversations(true);
            const data = await getConversations();
            setConversations(data);
            setError(null);

            const nextId = preferredId || selectedId || data[0]?.id || null;
            if (nextId) {
                setSelectedId(nextId);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-au putut incarca conversatiile.");
        } finally {
            setIsLoadingConversations(false);
        }
    }

    async function loadMessages(conversationId: number) {
        try {
            setIsLoadingMessages(true);
            const data = await getMessages(conversationId);
            setMessages(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-au putut incarca mesajele.");
            setMessages([]);
        } finally {
            setIsLoadingMessages(false);
        }
    }

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        void loadConversations(activeConversationId);
        const refreshId = window.setInterval(() => {
            void loadConversations(activeConversationId);
        }, 30000);

        return () => window.clearInterval(refreshId);
    }, [currentUser?.id]);

    useEffect(() => {
        if (!activeConversationId) {
            return;
        }

        setSelectedId(activeConversationId);
        onOpenChange(true);
        void loadConversations(activeConversationId);
    }, [activeConversationId]);

    useEffect(() => {
        if (!selectedId || !isOpen) {
            return;
        }

        void loadMessages(selectedId);
    }, [selectedId, isOpen]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const body = draft.trim();

        if (!selectedId || !body) {
            return;
        }

        try {
            setIsSending(true);
            const created = await sendMessage(selectedId, body);
            setMessages((prev) => [...prev, created]);
            setDraft("");
            await loadConversations(selectedId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-a putut trimite mesajul.");
        } finally {
            setIsSending(false);
        }
    }

    if (!currentUser) {
        return null;
    }

    return (
        <div className="sitterChatDock">
            <button
                type="button"
                className="sitterChatToggle"
                onClick={() => onOpenChange(!isOpen)}
                aria-label={isOpen ? "Inchide chatul" : "Deschide chatul"}
                title={isOpen ? "Inchide chatul" : "Mesaje"}
            >
                <span className="sitterChatIcon" aria-hidden="true">{"\u2709"}</span>
                {unreadTotal > 0 ? <span className="sitterChatBadge">{unreadTotal > 9 ? "9+" : unreadTotal}</span> : null}
            </button>

            {isOpen ? (
                <section className="sitterChatPanel" aria-label="Mesaje sitter">
                    <header className="sitterChatHeader">
                        <div>
                            <h2>Mesaje</h2>
                            <p>{selectedConversation?.sitterName ?? "Alege o conversatie"}</p>
                        </div>
                        <button type="button" onClick={() => onOpenChange(false)} aria-label="Inchide chatul">
                            ×
                        </button>
                    </header>

                    {error ? <div className="sitterChatError">{error}</div> : null}

                    <div className="sitterChatBody">
                        <aside className="sitterChatConversations">
                            {isLoadingConversations ? (
                                <div className="sitterChatEmpty">Se incarca...</div>
                            ) : conversations.length === 0 ? (
                                <div className="sitterChatEmpty">Nu ai conversatii.</div>
                            ) : (
                                conversations.map((conversation) => (
                                    <button
                                        type="button"
                                        key={conversation.id}
                                        className={`sitterChatConversation${conversation.id === selectedId ? " isActive" : ""}`}
                                        onClick={() => setSelectedId(conversation.id)}
                                    >
                                        <span>{conversation.sitterName || conversation.sitterUserName}</span>
                                        <small>{conversation.lastMessage || "Conversatie noua"}</small>
                                        {conversation.unreadCount > 0 ? <b>{conversation.unreadCount}</b> : null}
                                    </button>
                                ))
                            )}
                        </aside>

                        <div className="sitterChatMessages">
                            <div className="sitterChatMessageList">
                                {isLoadingMessages ? (
                                    <div className="sitterChatEmpty">Se incarca mesajele...</div>
                                ) : !selectedId ? (
                                    <div className="sitterChatEmpty">Selecteaza o conversatie.</div>
                                ) : messages.length === 0 ? (
                                    <div className="sitterChatEmpty">Trimite primul mesaj.</div>
                                ) : (
                                    messages.map((message) => (
                                        <article
                                            key={message.id}
                                            className={`sitterChatBubble${message.isMine ? " isMine" : ""}`}
                                        >
                                            <div>
                                                <strong>{message.isMine ? "Tu" : message.senderName || "Sitter"}</strong>
                                                <span>{formatChatDate(message.createdAt)}</span>
                                            </div>
                                            <p>{message.body}</p>
                                        </article>
                                    ))
                                )}
                            </div>

                            <form className="sitterChatForm" onSubmit={handleSubmit}>
                                <input
                                    value={draft}
                                    onChange={(event) => setDraft(event.target.value)}
                                    placeholder="Scrie un mesaj..."
                                    maxLength={2000}
                                    disabled={!selectedId || isSending}
                                />
                                <button type="submit" disabled={!selectedId || !draft.trim() || isSending}>
                                    {isSending ? "..." : "Trimite"}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            ) : null}
        </div>
    );
}