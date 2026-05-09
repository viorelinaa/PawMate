import { useEffect, useState } from "react";
import {
    getUsers,
    updateUserStatus,
    type AdminUser,
    type AdminUserStatus,
} from "../services/userService";
import "../styles/AdminUsers.css";

function buildInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return "U";
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function formatJoinDate(createdAt: string) {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "data indisponibila";
    }

    return date.toLocaleDateString("ro-RO", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function formatDateTime(value: string | null) {
    if (!value) {
        return "Indisponibil";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Indisponibil";
    }

    return date.toLocaleString("ro-RO", {
        dateStyle: "long",
        timeStyle: "short",
    });
}

function formatAvailability(value: boolean) {
    return value ? "Completat" : "Necompletat";
}

function formatEmailStatus(value: boolean) {
    return value ? "Verificat" : "Neverificat";
}

function formatMetric(value: number | null, fallback = "Nu este urmarit inca") {
    return value ?? fallback;
}

function statusLabel(status: AdminUserStatus) {
    switch (status) {
        case "active":
            return "Activ";
        case "banned":
            return "Banat";
        default:
            return "Offline";
    }
}

function statusBadgeClass(status: AdminUserStatus) {
    switch (status) {
        case "active":
            return "adminUserBadge--active";
        case "banned":
            return "adminUserBadge--banned";
        default:
            return "adminUserBadge--offline";
    }
}

function AdminUserMoreInfoModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
    return (
        <div className="adminUserModalOverlay" onClick={onClose}>
            <div
                className="adminUserModal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={`admin-user-modal-title-${user.id}`}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="adminUserModalHeader">
                    <div className="adminUserModalIdentity">
                        <div className="adminUserAvatar adminUserModalAvatar">
                            {user.selectedAvatar ? (
                                <img
                                    className="adminUserAvatarImage"
                                    src={user.selectedAvatar.imageUrl}
                                    alt={user.selectedAvatar.title || `Avatar ${user.name}`}
                                />
                            ) : (
                                buildInitials(user.name)
                            )}
                        </div>
                        <div>
                            <h2 id={`admin-user-modal-title-${user.id}`}>{user.name}</h2>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <button type="button" className="adminUserModalClose" onClick={onClose} aria-label="Inchide">
                        ×
                    </button>
                </div>

                <div className="adminUserModalBody">
                    <section className="adminUserMoreSection">
                        <h3 className="adminUserMoreTitle">Date cont</h3>
                        <div className="adminUserInfoList">
                            <div className="adminUserInfoRow">
                                <span>ID utilizator</span>
                                <strong>{user.id}</strong>
                            </div>
                            <div className="adminUserInfoRow">
                                <span>Rol salvat in baza de date</span>
                                <strong>{user.role}</strong>
                            </div>
                            <div className="adminUserInfoRow">
                                <span>Statut cont</span>
                                <strong>{statusLabel(user.status)}</strong>
                            </div>
                            <div className="adminUserInfoRow">
                                <span>Ultima sesiune activa</span>
                                <strong>{formatDateTime(user.lastActiveAt)}</strong>
                            </div>
                            <div className="adminUserInfoRow">
                                <span>Membru din</span>
                                <strong>{formatJoinDate(user.createdAt)}</strong>
                            </div>
                        </div>
                    </section>

                    <section className="adminUserMoreSection">
                        <h3 className="adminUserMoreTitle">Date utile pentru admin</h3>
                        <div className="adminUserInfoList">
                            <div className="adminUserInfoRow">
                                <span>Data ultimei autentificari</span>
                                <strong>{formatDateTime(user.lastLoginAt)}</strong>
                            </div>
                            <div className="adminUserInfoRow">
                                <span>Numarul de logari</span>
                                <strong>{user.loginCount}</strong>
                            </div>
                            <div className="adminUserInfoRow">
                                <span>Status email</span>
                                <strong>{formatEmailStatus(user.isEmailVerified)}</strong>
                            </div>
                            <div className="adminUserInfoRow">
                                <span>Telefon completat</span>
                                <strong>{formatAvailability(user.hasPhone)}</strong>
                            </div>
                            <div className="adminUserInfoRow">
                                <span>Oras completat</span>
                                <strong>{formatAvailability(user.hasCity)}</strong>
                            </div>
                        </div>
                    </section>

                    <section className="adminUserMoreSection">
                        <h3 className="adminUserMoreTitle">Informatii despre activitate</h3>
                        <div className="adminUserInfoList">
                            <div className="adminUserInfoRow">
                                <span>Cate postari are</span>
                                <strong>{user.blogPostsCount}</strong>
                            </div>
                            <div className="adminUserInfoRow">
                                <span>Cate animale a adaugat</span>
                                <strong>{formatMetric(user.petsAddedCount)}</strong>
                            </div>
                            <div className="adminUserInfoRow">
                                <span>Cate anunturi lost pets a publicat</span>
                                <strong>{formatMetric(user.lostPetsPublishedCount)}</strong>
                            </div>
                            <div className="adminUserInfoRow">
                                <span>Cate programari / cereri are</span>
                                <strong>{user.adoptionRequestsCount}</strong>
                            </div>
                            <div className="adminUserInfoRow">
                                <span>Ultima activitate in aplicatie</span>
                                <strong>{formatDateTime(user.lastActivityAt)}</strong>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingUserId, setPendingUserId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadUsers() {
            try {
                setIsLoading(true);
                const loadedUsers = await getUsers();
                setUsers(loadedUsers);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Nu s-a putut incarca lista de utilizatori.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadUsers();
    }, []);

    useEffect(() => {
        if (!selectedUser) {
            return;
        }

        const previousOverflow = document.body.style.overflow;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setSelectedUser(null);
            }
        }

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedUser]);

    async function handleStatusChange(userId: number, status: AdminUserStatus) {
        try {
            setPendingUserId(userId);
            const updatedUser = await updateUserStatus(userId, status);

            setUsers((prev) =>
                prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
            );
            setError(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Nu s-a putut actualiza statutul utilizatorului."
            );
        } finally {
            setPendingUserId(null);
        }
    }

    function openMoreInfo(user: AdminUser) {
        setSelectedUser(user);
    }

    return (
        <div className="adminUsers">
            <div className="adminUsersHeader">
                <h1>Utilizatori înregistrați</h1>
                <p>
                    {isLoading
                        ? "Se incarca utilizatorii din baza de date..."
                        : `${users.length} utilizatori incarcati din baza de date`}
                </p>
            </div>

            {error ? <div className="adminUsersState adminUsersState--error">{error}</div> : null}

            {isLoading ? (
                <div className="adminUsersState">Se incarca lista de utilizatori...</div>
            ) : users.length === 0 ? (
                <div className="adminUsersState">Nu exista utilizatori inregistrati in baza de date.</div>
            ) : (
                <div className="adminUsersTableShell">
                    <table className="adminUsersTable">
                        <thead>
                            <tr>
                                <th>Utilizator</th>
                                <th>ID</th>
                                <th>Rol</th>
                                <th>Status</th>
                                <th>Logari</th>
                                <th>Ultima autentificare</th>
                                <th>Ultima sesiune</th>
                                <th>Membru din</th>
                                <th>Actiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => {
                                const isPending = pendingUserId === user.id;
                                const isAdminUser = user.role === "admin";

                                return (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="adminUserTableIdentity">
                                                <div className="adminUserAvatar adminUserTableAvatar">
                                                    {user.selectedAvatar ? (
                                                        <img
                                                            className="adminUserAvatarImage"
                                                            src={user.selectedAvatar.imageUrl}
                                                            alt={user.selectedAvatar.title || `Avatar ${user.name}`}
                                                        />
                                                    ) : (
                                                        buildInitials(user.name)
                                                    )}
                                                </div>
                                                <div className="adminUserInfo">
                                                    <p className="adminUserName">{user.name}</p>
                                                    <p className="adminUserEmail">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="adminUsersTableMuted">#{user.id}</td>
                                        <td>
                                            <span className={`adminUserRoleBadge adminUserRoleBadge--${user.role}`}>
                                                {user.role === "admin" ? "Admin" : "User"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`adminUserBadge ${statusBadgeClass(user.status)}`}>
                                                {statusLabel(user.status)}
                                            </span>
                                        </td>
                                        <td>{user.loginCount}</td>
                                        <td>{formatDateTime(user.lastLoginAt)}</td>
                                        <td>{formatDateTime(user.lastActiveAt)}</td>
                                        <td>{formatJoinDate(user.createdAt)}</td>
                                        <td>
                                            <div className="adminUsersTableActions">
                                                {isAdminUser ? (
                                                    <span className="adminUsersProtectedLabel">Cont admin</span>
                                                ) : user.status === "banned" ? (
                                                    <button
                                                        className="adminUserBanBtn adminUserBanBtn--unban"
                                                        onClick={() => handleStatusChange(user.id, "offline")}
                                                        disabled={isPending}
                                                    >
                                                        {isPending ? "..." : "Deblocheaza"}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="adminUserBanBtn adminUserBanBtn--ban"
                                                        onClick={() => handleStatusChange(user.id, "banned")}
                                                        disabled={isPending}
                                                    >
                                                        {isPending ? "..." : "Blocheaza"}
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    className="adminUserMoreBtn"
                                                    onClick={() => openMoreInfo(user)}
                                                >
                                                    Detalii
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedUser ? (
                <AdminUserMoreInfoModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            ) : null}
        </div>
    );
}
