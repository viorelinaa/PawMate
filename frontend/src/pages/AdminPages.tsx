import React from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../routes/paths';
import { AddActionButton } from '../components/AddActionButton';
import '../styles/AdminPages.css';

interface AdminPageCard {
    id: string;
    title: string;
    icon: string;
    description: string;
    path: string;
    actions: {
        label: string;
        onClick: () => void;
    }[];
}

const AdminPages: React.FC = () => {
    const navigate = useNavigate();

    const pages: AdminPageCard[] = [
        {
            id: 'adoptie',
            title: 'Adopție',
            icon: '🐾',
            description: 'Gestionează animalele disponibile pentru adopție.',
            path: paths.adoptie,
            actions: [
                {
                    label: 'Adaugă animal pentru adopție',
                    onClick: () => alert('Formular adăugare animal — în curând!'),
                },
            ],
        },
        {
            id: 'pierdute',
            title: 'Animale Pierdute',
            icon: '🔍',
            description: 'Administrează anunțurile de animale pierdute.',
            path: paths.pierdute,
            actions: [
                {
                    label: 'Adaugă anunț animal pierdut',
                    onClick: () => alert('Formular adăugare anunț — în curând!'),
                },
            ],
        },
        {
            id: 'veterinari',
            title: 'Veterinari',
            icon: '🏥',
            description: 'Gestionează clinicile și cabinetele veterinare.',
            path: paths.veterinari,
            actions: [
                {
                    label: 'Adaugă clinică',
                    onClick: () => alert('Formular adăugare clinică — în curând!'),
                },
            ],
        },
        {
            id: 'donatii',
            title: 'Donații',
            icon: '💜',
            description: 'Administrează ONG-urile și campaniile de donații.',
            path: paths.donatii,
            actions: [
                {
                    label: 'Adaugă ONG',
                    onClick: () => alert('Formular adăugare ONG — în curând!'),
                },
            ],
        },
        {
            id: 'blog',
            title: 'Blog',
            icon: '📝',
            description: 'Publică și gestionează articolele de pe blog.',
            path: paths.blog,
            actions: [
                {
                    label: 'Adaugă articol',
                    onClick: () => alert('Formular adăugare articol — în curând!'),
                },
            ],
        },
        {
            id: 'evenimente',
            title: 'Evenimente',
            icon: '📅',
            description: 'Creează și administrează evenimentele platformei.',
            path: paths.evenimente,
            actions: [
                {
                    label: 'Adaugă eveniment',
                    onClick: () => alert('Formular adăugare eveniment — în curând!'),
                },
            ],
        },
        {
            id: 'sitters',
            title: 'Sitters',
            icon: '🏠',
            description: 'Gestionează profilurile îngrijitorilor de animale.',
            path: paths.sitters,
            actions: [
                {
                    label: 'Adaugă profil sitter',
                    onClick: () => alert('Formular adăugare profil sitter — în curând!'),
                },
            ],
        },
        {
            id: 'vanzari',
            title: 'Vânzări',
            icon: '🛒',
            description: 'Administrează produsele și anunțurile din marketplace.',
            path: paths.vanzari,
            actions: [
                {
                    label: 'Adaugă produs/anunț',
                    onClick: () => alert('Formular adăugare produs — în curând!'),
                },
            ],
        },
        {
            id: 'quiz',
            title: 'Quiz',
            icon: '🧩',
            description: 'Gestionează întrebările și răspunsurile din quiz.',
            path: paths.quiz,
            actions: [
                {
                    label: 'Adaugă întrebare',
                    onClick: () => alert('Formular adăugare întrebare — în curând!'),
                },
            ],
        },
    ];

    return (
        <div className="adminPages">
            <div className="adminPagesHeader">
                <h1>Pagini administrate</h1>
                <p>Selectează o pagină pentru a o vizualiza sau adaugă conținut nou.</p>
            </div>
            <div className="adminPagesGrid">
                {pages.map((page) => (
                    <div key={page.id} className="adminPageCard">
                        <div className="adminPageCardTop">
                            <span className="adminPageCardIcon">{page.icon}</span>
                            <h2 className="adminPageCardTitle">{page.title}</h2>
                        </div>
                        <p className="adminPageCardDesc">{page.description}</p>
                        <div className="adminPageCardActions">
                            {page.actions.map((action) => (
                                <AddActionButton
                                    key={action.label}
                                    label={action.label}
                                    onClick={action.onClick}
                                />
                            ))}
                            <button
                                className="adminPageCardViewBtn"
                                onClick={() => navigate(page.path)}
                            >
                                Vezi pagina
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPages;
