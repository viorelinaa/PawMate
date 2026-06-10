import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/SitterChatWidget.css";
import { useAuth } from "../context/AuthContext";
import {
    getConversations,
    getMessages,
    markConversationRead,
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
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState("");
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const localReadMarksRef = useRef<Record<number, string>>({});

    const selectedConversation = useMemo(
        () => conversations.find((conversation) => conversation.id === selectedId) ?? null,
        [conversations, selectedId]
    );

    const unreadTotal = conversations.reduce((sum, conversation) => sum + conversation.unreadCount, 0);

    function applyLocalReadMarks(items: ChatConversation[]) {
        return items.map((conversation) => {
            const readUntil = localReadMarksRef.current[conversation.id];
            if (!readUntil) {
                return conversation;
            }

            const readDate = new Date(readUntil);
            const lastMessageDate = new Date(conversation.lastMessageAt);
            if (!Number.isNaN(readDate.getTime()) && !Number.isNaN(lastMessageDate.getTime()) && readDate >= lastMessageDate) {
                return { ...conversation, unreadCount: 0 };
            }

            return conversation;
        });
    }

    function markConversationLocallyRead(conversationId: number, readUntil?: string) {
        const conversation = conversations.find((item) => item.id === conversationId);
        localReadMarksRef.current[conversationId] = readUntil ?? conversation?.lastMessageAt ?? new Date().toISOString();
        setConversations((prev) =>
            prev.map((item) =>
                item.id === conversationId
                    ? { ...item, unreadCount: 0 }
                    : item
            )
        );
    }

    function getConversationDisplayName(conversation: ChatConversation | null) {
        if (!conversation) {
            return "Alege cui raspunzi";
        }

        if (currentUser?.id === conversation.sitterUserId) {
            return conversation.clientName || "Utilizator";
        }

        return conversation.sitterName || conversation.sitterUserName || "Sitter";
    }
    async function loadConversations(preferredId?: number | null) {
        if (!currentUser) {
            setConversations([]);
            setSelectedId(null);
            return;
        }

        try {
            setIsLoadingConversations(true);
            const data = applyLocalReadMarks(await getConversations());
            setConversations(data);
            setError(null);

            if (preferredId) {
                setSelectedId(preferredId);
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
            markConversationLocallyRead(conversationId);
            setError(null);

            void markConversationRead(conversationId).catch(() => {});
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-au putut incarca mesajele.");
        } finally {
            setIsLoadingMessages(false);
        }
    }
    useEffect(() => {
        if (!currentUser) {
            return;
        }

        void loadConversations(null);
        const refreshId = window.setInterval(() => {
            void loadConversations(null);
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
            markConversationLocallyRead(selectedId, created.createdAt);
            setConversations((prev) =>
                prev.map((conversation) =>
                    conversation.id === selectedId
                        ? { ...conversation, lastMessage: created.body, lastMessageAt: created.createdAt }
                        : conversation
                )
            );
            void markConversationRead(selectedId).catch(() => {});
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
                onClick={() => {
                    if (!isOpen) {
                        setSelectedId(null);
                        setMessages([]);
                    }
                    onOpenChange(!isOpen);
                }}
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
                            <p>{getConversationDisplayName(selectedConversation)}</p>
                        </div>
                        <button type="button" onClick={() => onOpenChange(false)} aria-label="Inchide chatul">{"\u00d7"}</button>
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
                                        <span>{getConversationDisplayName(conversation)}</span>
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
                                    <div className="sitterChatEmpty sitterChatPickContact">Alege un contact de sus ca sa raspunzi.</div>
                                ) : messages.length === 0 ? (
                                    <div className="sitterChatEmpty sitterChatPickContact">Trimite primul mesaj.</div>
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