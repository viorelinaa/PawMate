import { useEffect, useState } from "react";
import { getUsers, type AdminUser } from "../services/userService";
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

export default function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
                    {users.map((user) => (
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
                                <span className="adminUserBadge adminUserBadge--active">Activ</span>
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
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
