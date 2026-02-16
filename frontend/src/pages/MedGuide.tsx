import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import "./MedGuide.css";

const PawMateMedical: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#f5f5f7]">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-[1400px] mx-auto px-8 py-4">
                    <div className="flex items-center justify-between">
                        <RouterNavLink to="/" className="flex items-center gap-2">
                            <span className="text-2xl">🐾</span>
                            <span className="text-2xl font-bold text-[#6b4a9e]">PawMate</span>
                        </RouterNavLink>

                        <div className="hidden md:flex items-center gap-4">
                            <MenuLink to="/" primary>
                                Acasă
                            </MenuLink>
                            <MenuLink to="/quiz">Quiz</MenuLink>
                            <MenuLink to="/adoptie">Adopție</MenuLink>
                            <MenuLink to="/sitters">Sitters</MenuLink>
                            <MenuLink to="/login">Login</MenuLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-[#d4c5e8] to-[#e8dff5] py-16 px-8 text-center overflow-hidden">
                <Cloud position="left" />
                <Cloud position="right" />

                <PawPrint className="top-[220px] left-[60px] -rotate-[20deg]" />
                <PawPrint className="top-[180px] left-[100px] rotate-[15deg]" />
                <PawPrint className="top-[240px] right-[80px] -rotate-[30deg]" />
                <PawPrint className="top-[200px] right-[120px] rotate-[25deg]" />
                <PawPrint className="bottom-[80px] left-[100px] rotate-[10deg]" />
                <PawPrint className="bottom-[100px] right-[100px] -rotate-[15deg]" />

                <div className="max-w-[800px] mx-auto relative z-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#6b4a9e] mb-6 tracking-tight">
                        Ghid Medical
                    </h1>
                    <p className="inline-block text-lg md:text-xl text-[#5a4570] bg-white px-8 py-4 rounded-[30px] shadow-lg">
                        Tot ce ai nevoie despre sănătatea animalelor de companie
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-[1200px] mx-auto px-8 py-16">
                <h2 className="text-4xl font-extrabold text-[#6b4a9e] text-center mb-4">
                    Informații Esențiale
                </h2>
                <p className="text-lg text-gray-600 text-center mb-12">
                    Semne de alarmă + prevenție (general, nu medical advice).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
                    <MedicalCard
                        title="Semne de alarmă"
                        description="Atunci când trebuie să mergi urgent la veterinar:"
                        items={[
                            "Lipsa poftei de mâncare > 24h",
                            "Letargie puternică",
                            "Respirație grea / febră",
                            "Vărsături repetate",
                        ]}
                    />

                    <MedicalCard
                        title="Prevenție"
                        description="Păstrează-ți animalul sănătos:"
                        items={[
                            "Vaccinuri la timp",
                            "Deparazitare periodică",
                            "Hidratare și hrană potrivită",
                            "Vizite regulate la veterinar",
                        ]}
                    />

                    <MedicalCard
                        title="Îngrijire zilnică"
                        description="Menține rutina sănătoasă:"
                        items={[
                            "Exercițiu fizic regulat",
                            "Igienă dentară",
                            "Curățarea urechilor și ochilor",
                            "Periaj regulat al blănii",
                        ]}
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#f9fafb] border-t border-gray-200 py-8 text-center text-gray-600 mt-16">
                <p>© 2026 PawMate. Creat cu ❤️ pentru animale.</p>
            </footer>
        </div>
    );
};

interface MenuLinkProps {
    to: string;
    children: React.ReactNode;
    primary?: boolean;
}

const MenuLink: React.FC<MenuLinkProps> = ({ to, children, primary = false }) => {
    return (
        <RouterNavLink
            to={to}
            className={() =>
                `px-5 py-2.5 rounded-[25px] font-medium transition-all ${
                    primary
                        ? "bg-[#6b4a9e] text-white hover:bg-[#5a3d85]"
                        : "text-[#6b4a9e] hover:bg-purple-50"
                }`
            }
        >
            {children}
        </RouterNavLink>
    );
};

interface CloudProps {
    position: "left" | "right";
}
const Cloud: React.FC<CloudProps> = ({ position }) => {
    const baseClass = "absolute bg-white rounded-[100px] opacity-90";
    const positionClass =
        position === "left"
            ? "w-[300px] h-[150px] top-[80px] left-[40px]"
            : "w-[350px] h-[170px] top-[60px] right-[40px]";

    return (
        <div className={`${baseClass} ${positionClass} hidden lg:block`}>
            <div className="absolute bg-white rounded-[100px] w-[180px] h-[180px] -top-[80px] left-[20px]" />
            <div className="absolute bg-white rounded-[100px] w-[150px] h-[150px] -top-[60px] right-[20px]" />
        </div>
    );
};

interface PawPrintProps {
    className?: string;
}
const PawPrint: React.FC<PawPrintProps> = ({ className }) => {
    return (
        <div className={`absolute text-[#6b4a9e] opacity-15 text-2xl hidden lg:block ${className}`}>
            🐾
        </div>
    );
};

interface MedicalCardProps {
    title: string;
    description: string;
    items: string[];
}
const MedicalCard: React.FC<MedicalCardProps> = ({ title, description, items }) => {
    return (
        <div className="bg-white rounded-[20px] p-10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            <h3 className="text-2xl font-bold text-[#6b4a9e] mb-4">{title}</h3>
            <p className="text-gray-600 text-sm mb-6">{description}</p>
            <ul className="space-y-3.5">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start">
                        <span className="text-[#6b4a9e] mr-3 text-base mt-0.5">•</span>
                        <span className="text-gray-600 leading-relaxed text-[0.95rem]">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PawMateMedical;
