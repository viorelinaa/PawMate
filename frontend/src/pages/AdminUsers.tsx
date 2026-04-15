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

function statusHint(status: AdminUserStatus) {
    switch (status) {
        case "active":
            return "Utilizatorul este conectat acum.";
        case "banned":
            return "Contul este blocat si nu se poate autentifica.";
        default:
            return "Utilizatorul va deveni activ la urmatorul login.";
    }
}

export default function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingUserId, setPendingUserId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadUsers() {
            try {
                setIsLoading(true);
                const loadedUsers = await getUsers();
                setUsers(loadedUsers.filter((user) => user.role === "user"));
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Nu s-a putut incarca lista de utilizatori.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadUsers();
    }, []);

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
                <div className="adminUsersGrid">
                    {users.map((user) => {
                        const isPending = pendingUserId === user.id;

                        return (
                            <article key={user.id} className="adminUserCard">
                                <div className="adminUserCardTop">
                                    <div className="adminUserAvatar">
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
                                    <span className={`adminUserBadge ${statusBadgeClass(user.status)}`}>
                                        {statusLabel(user.status)}
                                    </span>
                                </div>

                                <div className="adminUserDetails">
                                    <div className="adminUserDetail">
                                        <span className="adminUserDetailIcon">📅</span>
                                        <span>Membru din {formatJoinDate(user.createdAt)}</span>
                                    </div>
                                    <div className="adminUserDetail">
                                        <span className="adminUserDetailIcon">🆔</span>
                                        <span>ID utilizator: {user.id}</span>
                                    </div>
                                    <div className="adminUserDetail">
                                        <span className="adminUserDetailIcon">👤</span>
                                        <span>Rol salvat in baza de date: {user.role}</span>
                                    </div>
                                    <div className="adminUserDetail">
                                        <span className="adminUserDetailIcon">📡</span>
                                        <span>Statut cont: {statusLabel(user.status).toLowerCase()}</span>
                                    </div>
                                </div>

                                <div className="adminUserActivity">
                                    <p className="adminUserActivityLabel">Sursa</p>
                                    <ul className="adminUserActivityList">
                                        <li className="adminUserActivityItem">
                                            <span>💾</span>
                                            <span>Datele de pe acest card vin din tabela de utilizatori din baza de date.</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="adminUserActions">
                                    {user.status === "banned" ? (
                                        <button
                                            className="adminUserBanBtn adminUserBanBtn--unban"
                                            onClick={() => handleStatusChange(user.id, "offline")}
                                            disabled={isPending}
                                        >
                                            {isPending ? "Se actualizeaza..." : "Deblocheaza contul"}
                                        </button>
                                    ) : (
                                        <button
                                            className="adminUserBanBtn adminUserBanBtn--ban"
                                            onClick={() => handleStatusChange(user.id, "banned")}
                                            disabled={isPending}
                                        >
                                            {isPending ? "Se actualizeaza..." : "Blocheaza contul"}
                                        </button>
                                    )}
                                    <p className="adminUserStatusHint">{statusHint(user.status)}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
