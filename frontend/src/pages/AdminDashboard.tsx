import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paths } from '../routes/paths';
import '../styles/AdminDashboard.css';

const statCards = [
    { label: 'Animale la adopție', value: '128', icon: '🐾', trend: '+12 luna aceasta', color: '#6b4fa1' },
    { label: 'Animale pierdute', value: '47', icon: '🔍', trend: '8 recuperate recent', color: '#e8932a' },
    { label: 'Utilizatori înregistrați', value: '1.2k', icon: '👥', trend: '+34 săptămâna asta', color: '#3b82f6' },
    { label: 'Donații active', value: '9', icon: '💜', trend: '3 ONG-uri noi', color: '#10b981' },
];

const monthlyData = [
    { month: 'Ian', adoptii: 8, pierdute: 5, evenimente: 2 },
    { month: 'Feb', adoptii: 12, pierdute: 7, evenimente: 3 },
    { month: 'Mar', adoptii: 15, pierdute: 4, evenimente: 4 },
    { month: 'Apr', adoptii: 10, pierdute: 6, evenimente: 2 },
    { month: 'Mai', adoptii: 18, pierdute: 9, evenimente: 5 },
    { month: 'Iun', adoptii: 22, pierdute: 11, evenimente: 6 },
    { month: 'Iul', adoptii: 19, pierdute: 8, evenimente: 4 },
    { month: 'Aug', adoptii: 25, pierdute: 14, evenimente: 7 },
    { month: 'Sep', adoptii: 20, pierdute: 10, evenimente: 5 },
];

const MAX_BAR = 25;

const recentActivity = [
    { icon: '🐶', action: 'Animal nou adăugat la adopție', detail: 'Golden Retriever, 2 ani', date: '24 Feb 2026' },
    { icon: '📋', action: 'Eveniment aprobat', detail: 'Târg de adopții, Chișinău', date: '23 Feb 2026' },
    { icon: '💜', action: 'ONG nou înregistrat', detail: 'Adăpost Speranța Chișinău', date: '22 Feb 2026' },
    { icon: '🔍', action: 'Anunț animal pierdut', detail: 'Labrador negru, sec. Botanica', date: '21 Feb 2026' },
    { icon: '👨‍⚕️', action: 'Clinică veterinară adăugată', detail: 'VetClinic Plus, Centru', date: '20 Feb 2026' },
];

const pageStats = [
    { name: 'Adopții', visits: '4.2k', icon: '🐾' },
    { name: 'Blog', visits: '2.8k', icon: '📝' },
    { name: 'Veterinari', visits: '1.9k', icon: '🏥' },
    { name: 'Quiz', visits: '3.1k', icon: '🧩' },
    { name: 'Vânzări', visits: '2.4k', icon: '🛒' },
    { name: 'Evenimente', visits: '1.6k', icon: '📅' },
];

const AdminDashboard: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    if (!currentUser || currentUser.role !== 'admin') {
        navigate(paths.home);
        return null;
    }

    return (
        <div className="adminDash">
            {/* Header */}
            <div className="adminDashHeader">
                <div className="adminDashWelcome">
                    <h1>Bun venit, {currentUser.firstName}! 👋</h1>
                    <p>Iată un rezumat al activității platformei PawMate.</p>
                </div>
                <div className="adminDashDate">
                    {new Date().toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="adminStatCards">
                {statCards.map((card) => (
                    <div key={card.label} className="adminStatCard">
                        <div className="adminStatCardLeft">
                            <p className="adminStatLabel">{card.label}</p>
                            <p className="adminStatValue" style={{ color: card.color }}>{card.value}</p>
                            <p className="adminStatTrend">{card.trend}</p>
                        </div>
                        <div className="adminStatCardIcon" style={{ background: card.color + '18' }}>
                            <span>{card.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle row: Chart + Activity */}
            <div className="adminDashMiddle">
                {/* Bar Chart */}
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
                            <div key={d.month} className="adminChartCol">
                                <div className="adminChartBars">
                                    <div
                                        className="adminChartBar"
                                        style={{ height: `${(d.adoptii / MAX_BAR) * 100}%`, background: '#6b4fa1' }}
                                        title={`Adopții: ${d.adoptii}`}
                                    />
                                    <div
                                        className="adminChartBar"
                                        style={{ height: `${(d.pierdute / MAX_BAR) * 100}%`, background: '#e8932a' }}
                                        title={`Pierdute: ${d.pierdute}`}
                                    />
                                    <div
                                        className="adminChartBar"
                                        style={{ height: `${(d.evenimente / MAX_BAR) * 100}%`, background: '#10b981' }}
                                        title={`Evenimente: ${d.evenimente}`}
                                    />
                                </div>
                                <span className="adminChartMonth">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="adminActivityCard">
                    <h2>Activitate recentă</h2>
                    <ul className="adminActivityList">
                        {recentActivity.map((item, i) => (
                            <li key={i} className="adminActivityItem">
                                <span className="adminActivityIcon">{item.icon}</span>
                                <div className="adminActivityInfo">
                                    <p className="adminActivityAction">{item.action}</p>
                                    <p className="adminActivityDetail">{item.detail}</p>
                                </div>
                                <span className="adminActivityDate">{item.date}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Page Visits */}
            <div className="adminPageVisitsCard">
                <h2>Vizite pe pagini</h2>
                <div className="adminPageVisitsGrid">
                    {pageStats.map((p) => (
                        <div key={p.name} className="adminPageVisitItem">
                            <span className="adminPageVisitIcon">{p.icon}</span>
                            <div className="adminPageVisitInfo">
                                <p className="adminPageVisitName">{p.name}</p>
                                <p className="adminPageVisitCount">{p.visits} vizite</p>
                            </div>
                            <div className="adminPageVisitBar">
                                <div
                                    className="adminPageVisitBarFill"
                                    style={{ width: `${(parseFloat(p.visits) / 4.2) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
