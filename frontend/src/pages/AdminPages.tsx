import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../routes/paths';
import { AddActionButton } from '../components/AddActionButton';
import { AddPetModal, EditPetModal, DeleteConfirmModal } from '../components/PetModals';
import { AddLostPetModal, EditLostPetModal, DeleteLostPetModal } from '../components/LostPetModals';
import { AddEventModal } from '../components/EventModals';
import { AddSitterModal } from '../components/SitterModals';
import { AddProductModal } from '../components/ProductModals';
import type { Pet } from '../services/petService';
import type { LostPet } from '../services/lostPetService';
import '../styles/AdminPages.css';
import '../styles/Adoption.css';
import '../styles/LostPets.css';

const AdminPages: React.FC = () => {
    const navigate = useNavigate();

    // ── Adopție CRUD state ────────────────────────────────────────────────────
    const [showAddPet, setShowAddPet] = useState(false);
    const [editPet, setEditPet] = useState<Pet | null>(null);
    const [deletePetTarget, setDeletePetTarget] = useState<Pet | null>(null);

    // ── Pierdute CRUD state ───────────────────────────────────────────────────
    const [showAddLost, setShowAddLost] = useState(false);
    const [editLost, setEditLost] = useState<LostPet | null>(null);
    const [deleteLost, setDeleteLost] = useState<LostPet | null>(null);

    // ── Evenimente / Sitters / Vânzări adăugare ───────────────────────────────
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [showAddSitter, setShowAddSitter] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);

    return (
        <div className="adminPages">
            <div className="adminPagesHeader">
                <h1>Pagini administrate</h1>
                <p>Selectează o pagină pentru a o vizualiza sau adaugă conținut nou.</p>
            </div>

            {/* Modals Adopție */}
            {showAddPet && (
                <AddPetModal onClose={() => setShowAddPet(false)} onAdded={() => {}} />
            )}
            {editPet && (
                <EditPetModal pet={editPet} onClose={() => setEditPet(null)} onUpdated={() => {}} />
            )}
            {deletePetTarget && (
                <DeleteConfirmModal pet={deletePetTarget} onClose={() => setDeletePetTarget(null)} onDeleted={() => {}} />
            )}

            {/* Modals Pierdute */}
            {showAddLost && (
                <AddLostPetModal onClose={() => setShowAddLost(false)} onAdded={() => {}} />
            )}
            {editLost && (
                <EditLostPetModal ad={editLost} onClose={() => setEditLost(null)} onUpdated={() => {}} />
            )}
            {deleteLost && (
                <DeleteLostPetModal ad={deleteLost} onClose={() => setDeleteLost(null)} onDeleted={() => {}} />
            )}

            {/* Modals Evenimente / Sitters / Vânzări */}
            {showAddEvent && (
                <AddEventModal onClose={() => setShowAddEvent(false)} onAdded={() => {}} />
            )}
            {showAddSitter && (
                <AddSitterModal onClose={() => setShowAddSitter(false)} onAdded={() => {}} />
            )}
            {showAddProduct && (
                <AddProductModal onClose={() => setShowAddProduct(false)} onAdded={() => {}} />
            )}

            <div className="adminPagesGrid">

                {/* ── Card Adopție cu CRUD complet ── */}
                <div className="adminPageCard">
                    <div className="adminPageCardTop">
                        <span className="adminPageCardIcon">🐾</span>
                        <h2 className="adminPageCardTitle">Adopție</h2>
                    </div>
                    <p className="adminPageCardDesc">Gestionează animalele disponibile pentru adopție.</p>
                    <div className="adminPageCardActions">
                        <AddActionButton
                            label="Adaugă animal pentru adopție"
                            onClick={() => setShowAddPet(true)}
                        />
                        <button
                            className="adminPageCardViewBtn"
                            onClick={() => navigate(paths.adoptie)}
                        >
                            Vezi pagina
                        </button>
                    </div>
                </div>

                {/* ── Restul cardurilor ── */}
                {[
                    { id: 'pierdute', title: 'Animale Pierdute', icon: '🔍', description: 'Administrează anunțurile de animale pierdute.', path: paths.pierdute, label: 'Adaugă anunț animal pierdut', onAdd: () => setShowAddLost(true) },
                    { id: 'veterinari', title: 'Veterinari', icon: '🏥', description: 'Gestionează clinicile și cabinetele veterinare.', path: paths.veterinari, label: 'Adaugă clinică', onAdd: () => navigate(`${paths.veterinari}?add=clinic`) },
                    { id: 'donatii', title: 'Donații', icon: '💜', description: 'Administrează ONG-urile și campaniile de donații.', path: paths.donatii, label: 'Adaugă ONG' },
                    { id: 'blog', title: 'Blog', icon: '📝', description: 'Publică și gestionează articolele de pe blog.', path: paths.blog, label: 'Adaugă articol' },
                    { id: 'evenimente', title: 'Evenimente', icon: '📅', description: 'Creează și administrează evenimentele platformei.', path: paths.evenimente, label: 'Adaugă eveniment', onAdd: () => setShowAddEvent(true) },
                    { id: 'sitters', title: 'Sitters', icon: '🏠', description: 'Gestionează profilurile îngrijitorilor de animale.', path: paths.sitters, label: 'Adaugă profil sitter', onAdd: () => setShowAddSitter(true) },
                    { id: 'vanzari', title: 'Vânzări', icon: '🛒', description: 'Administrează produsele și anunțurile din marketplace.', path: paths.vanzari, label: 'Adaugă produs/anunț', onAdd: () => setShowAddProduct(true) },
                    { id: 'quiz', title: 'Quiz', icon: '🧩', description: 'Gestionează întrebările și răspunsurile din quiz.', path: paths.quiz, label: 'Adaugă întrebare' },
                ].map((page) => (
                    <div key={page.id} className="adminPageCard">
                        <div className="adminPageCardTop">
                            <span className="adminPageCardIcon">{page.icon}</span>
                            <h2 className="adminPageCardTitle">{page.title}</h2>
                        </div>
                        <p className="adminPageCardDesc">{page.description}</p>
                        <div className="adminPageCardActions">
                            <AddActionButton
                                label={page.label}
                                onClick={'onAdd' in page && page.onAdd ? page.onAdd : () => alert(`${page.label} — în curând!`)}
                            />
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
