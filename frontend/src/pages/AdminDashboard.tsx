import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStatisticsSummary } from '../services/statisticsService';
import type { StatisticsSummaryDto } from '../services/statisticsService';
import '../styles/AdminDashboard.css';

const ACTIVITY_ICONS: Record<string, string> = {
    adoption: '🐾',
    user: '👥',
    event: '📋',
    lostpet: '🔍',
    blog: '📝',
};

function formatDate(dateStr: string): string {
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

function formatCount(n: number): string {
    if (!n && n !== 0) return '0';
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
    return String(n);
}

const AdminDashboard: React.FC = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState<StatisticsSummaryDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            const data = await getStatisticsSummary();
            setStats(data);
            setError(null);
        } catch (err) {
            console.error('[AdminDashboard] Eroare la încărcarea statisticilor:', err);
            setError('Nu s-au putut încărca statisticile. Asigură-te că backend-ul rulează.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, [fetchStats]);

    if (!currentUser) return null;
    const firstName = currentUser.name.split(/\s+/).filter(Boolean)[0] ?? currentUser.name;

    const monthlyData = stats?.monthlyData ?? [];
    const recentActivity = stats?.recentActivity ?? [];
    const contentCounts = stats?.contentCounts;

    const allBarValues = monthlyData.flatMap(d => [d.adoptii ?? 0, d.pierdute ?? 0, d.evenimente ?? 0]);
    const maxBar = allBarValues.length > 0 ? Math.max(...allBarValues, 1) : 1;

    const contentValues = contentCounts
        ? [contentCounts.adoptii, contentCounts.blogPosts, contentCounts.veterinaryClinics,
           contentCounts.quizResults, contentCounts.marketplaceListings, contentCounts.evenimente]
        : [1];
    const maxContent = Math.max(...contentValues, 1);

    return (
        <div className="adminDash">
            {/* Header */}
            <div className="adminDashHeader">
                <div className="adminDashWelcome">
                    <h1>Bun venit, {firstName}! 👋</h1>
                    <p>Iată un rezumat al activității platformei PawMate.</p>
                </div>
                <div className="adminDashDate">
                    {new Date().toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>

            {loading && <p className="adminDashLoading">Se încarcă statisticile...</p>}
            {error && <p className="adminDashError">{error}</p>}

            {stats && (
                <>
                    {/* Stat Cards */}
                    <div className="adminStatCards">
                        <div className="adminStatCard">
                            <div className="adminStatCardLeft">
                                <p className="adminStatLabel">Animale la adopție</p>
                                <p className="adminStatValue" style={{ color: '#6b4fa1' }}>{formatCount(stats.totalPets)}</p>
                                <p className="adminStatTrend">{stats.totalSitters ?? 0} sitters activi</p>
                            </div>
                            <div className="adminStatCardIcon" style={{ background: '#6b4fa118' }}>
                                <span>🐾</span>
                            </div>
                        </div>

                        <div className="adminStatCard">
                            <div className="adminStatCardLeft">
                                <p className="adminStatLabel">Animale pierdute</p>
                                <p className="adminStatValue" style={{ color: '#e8932a' }}>{formatCount(stats.lostPetsActive)}</p>
                                <p className="adminStatTrend">{stats.lostPetsRecoveredThisMonth ?? 0} recuperate luna aceasta</p>
                            </div>
                            <div className="adminStatCardIcon" style={{ background: '#e8932a18' }}>
                                <span>🔍</span>
                            </div>
                        </div>

                        <div className="adminStatCard">
                            <div className="adminStatCardLeft">
                                <p className="adminStatLabel">Utilizatori înregistrați</p>
                                <p className="adminStatValue" style={{ color: '#3b82f6' }}>{formatCount(stats.totalUsers)}</p>
                                <p className="adminStatTrend">+{stats.newUsersThisWeek ?? 0} săptămâna asta</p>
                            </div>
                            <div className="adminStatCardIcon" style={{ background: '#3b82f618' }}>
                                <span>👥</span>
                            </div>
                        </div>

                        <div className="adminStatCard">
                            <div className="adminStatCardLeft">
                                <p className="adminStatLabel">Clinici veterinare</p>
                                <p className="adminStatValue" style={{ color: '#10b981' }}>{formatCount(contentCounts?.veterinaryClinics ?? 0)}</p>
                                <p className="adminStatTrend">{contentCounts?.marketplaceListings ?? 0} produse în vânzări</p>
                            </div>
                            <div className="adminStatCardIcon" style={{ background: '#10b98118' }}>
                                <span>🏥</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle row: Chart + Activity */}
                    <div className="adminDashMiddle">
                        <div className="adminChartCard">
                            <div className="adminChartHeader">
                                <h2>Activitate lunară</h2>
                                <div className="adminChartLegend">
                                    <span className="legendDot" style={{ background: '#6b4fa1' }} /> Adopții
                                    <span className="legendDot" style={{ background: '#e8932a' }} /> Pierdute
                                    <span className="legendDot" style={{ background: '#10b981' }} /> Evenimente
                                </div>
                            </div>
                            <div className="adminChart">
                                {monthlyData.map((d) => (
                                    <div key={`${d.year}-${d.month}`} className="adminChartCol">
                                        <div className="adminChartBars">
                                            <div
                                                className="adminChartBar"
                                                style={{ height: `${((d.adoptii ?? 0) / maxBar) * 100}%`, background: '#6b4fa1' }}
                                                title={`Adopții: ${d.adoptii ?? 0}`}
                                            />
                                            <div
                                                className="adminChartBar"
                                                style={{ height: `${((d.pierdute ?? 0) / maxBar) * 100}%`, background: '#e8932a' }}
                                                title={`Pierdute: ${d.pierdute ?? 0}`}
                                            />
                                            <div
                                                className="adminChartBar"
                                                style={{ height: `${((d.evenimente ?? 0) / maxBar) * 100}%`, background: '#10b981' }}
                                                title={`Evenimente: ${d.evenimente ?? 0}`}
                                            />
                                        </div>
                                        <span className="adminChartMonth">{d.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="adminActivityCard">
                            <h2>Activitate recentă</h2>
                            <ul className="adminActivityList">
                                {recentActivity.map((item, i) => (
                                    <li key={i} className="adminActivityItem">
                                        <span className="adminActivityIcon">{ACTIVITY_ICONS[item.type] ?? '📌'}</span>
                                        <div className="adminActivityInfo">
                                            <p className="adminActivityAction">{item.action}</p>
                                            <p className="adminActivityDetail">{item.detail}</p>
                                        </div>
                                        <span className="adminActivityDate">{formatDate(item.date)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Conținut per secțiune */}
                    <div className="adminPageVisitsCard">
                        <h2>Conținut pe platformă</h2>
                        <div className="adminPageVisitsGrid">
                            {[
                                { name: 'Adopții', count: contentCounts?.adoptii ?? 0, icon: '🐾' },
                                { name: 'Blog', count: contentCounts?.blogPosts ?? 0, icon: '📝' },
                                { name: 'Veterinari', count: contentCounts?.veterinaryClinics ?? 0, icon: '🏥' },
                                { name: 'Quiz', count: contentCounts?.quizResults ?? 0, icon: '🧩' },
                                { name: 'Vânzări', count: contentCounts?.marketplaceListings ?? 0, icon: '🛒' },
                                { name: 'Evenimente', count: contentCounts?.evenimente ?? 0, icon: '📅' },
                            ].map((p) => (
                                <div key={p.name} className="adminPageVisitItem">
                                    <span className="adminPageVisitIcon">{p.icon}</span>
                                    <div className="adminPageVisitInfo">
                                        <p className="adminPageVisitName">{p.name}</p>
                                        <p className="adminPageVisitCount">{formatCount(p.count)} înregistrări</p>
                                    </div>
                                    <div className="adminPageVisitBar">
                                        <div
                                            className="adminPageVisitBarFill"
                                            style={{ width: `${(p.count / maxContent) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
