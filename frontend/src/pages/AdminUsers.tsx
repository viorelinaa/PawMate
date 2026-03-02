import React, { useState } from 'react';
import { mockUsers } from '../data/mockUsers';
import '../styles/AdminUsers.css';

const ACTIVITY_ICONS: Record<string, string> = {
    adoptie: '🐾',
    donatie: '💜',
    voluntariat: '🤝',
    postare: '📝',
};

const AdminUsers: React.FC = () => {
    const [bannedIds, setBannedIds] = useState<Set<string>>(new Set());
    const [confirmId, setConfirmId] = useState<string | null>(null);

    const users = mockUsers.filter((u) => u.role === 'user');

    const toggleBan = (id: string) => {
        setBannedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
        setConfirmId(null);
    };

    return (
        <div className="adminUsers">
            <div className="adminUsersHeader">
                <h1>Utilizatori înregistrați</h1>
                <p>
                    {users.length} utilizatori · {bannedIds.size} ban
                </p>
            </div>

            <div className="adminUsersGrid">
                {users.map((user) => {
                    const isBanned = bannedIds.has(user.id);
                    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
                    const joinDate = new Date(user.joinedAt).toLocaleDateString('ro-RO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    });

                    return (
                        <div
                            key={user.id}
                            className={`adminUserCard ${isBanned ? 'adminUserCard--banned' : ''}`}
                        >
                            {/* Avatar + identitate */}
                            <div className="adminUserCardTop">
                                <div className={`adminUserAvatar ${isBanned ? 'adminUserAvatar--banned' : ''}`}>
                                    {initials}
                                </div>
                                <div className="adminUserInfo">
                                    <p className="adminUserName">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="adminUserEmail">{user.username}</p>
                                </div>
                                <span className={`adminUserBadge ${isBanned ? 'adminUserBadge--banned' : 'adminUserBadge--active'}`}>
                                    {isBanned ? 'Banat' : 'Activ'}
                                </span>
                            </div>

                            {/* Detalii */}
                            <div className="adminUserDetails">
                                <div className="adminUserDetail">
                                    <span className="adminUserDetailIcon">📅</span>
                                    <span>Membru din {joinDate}</span>
                                </div>
                                <div className="adminUserDetail">
                                    <span className="adminUserDetailIcon">🐾</span>
                                    <span>
                                        {user.adoptedPets.length === 0
                                            ? 'Niciun animal adoptat'
                                            : `${user.adoptedPets.length} animal${user.adoptedPets.length > 1 ? 'e adoptate' : ' adoptat'}`}
                                    </span>
                                </div>
                                <div className="adminUserDetail">
                                    <span className="adminUserDetailIcon">📋</span>
                                    <span>{user.activityLog.length} acțiuni în istoricul activității</span>
                                </div>
                            </div>

                            {/* Activitate recentă */}
                            {user.activityLog.length > 0 && (
                                <div className="adminUserActivity">
                                    <p className="adminUserActivityLabel">Activitate recentă</p>
                                    <ul className="adminUserActivityList">
                                        {user.activityLog.slice(0, 2).map((item) => (
                                            <li key={item.id} className="adminUserActivityItem">
                                                <span>{ACTIVITY_ICONS[item.type] ?? '📌'}</span>
                                                <span>{item.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Acțiuni */}
                            <div className="adminUserActions">
                                {confirmId === user.id ? (
                                    <div className="adminUserConfirm">
                                        <p className="adminUserConfirmText">
                                            {isBanned
                                                ? 'Confirmi deblocarea contului?'
                                                : 'Confirmi blocarea contului?'}
                                        </p>
                                        <div className="adminUserConfirmBtns">
                                            <button
                                                className={`adminUserConfirmYes ${isBanned ? 'adminUserConfirmYes--unban' : 'adminUserConfirmYes--ban'}`}
                                                onClick={() => toggleBan(user.id)}
                                            >
                                                {isBanned ? 'Da, deblochează' : 'Da, blochează'}
                                            </button>
                                            <button
                                                className="adminUserConfirmNo"
                                                onClick={() => setConfirmId(null)}
                                            >
                                                Anulează
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className={`adminUserBanBtn ${isBanned ? 'adminUserBanBtn--unban' : 'adminUserBanBtn--ban'}`}
                                        onClick={() => setConfirmId(user.id)}
                                    >
                                        {isBanned ? '✓ Deblochează cont' : '⛔ Blochează cont'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminUsers;
