import { useEffect, useState } from "react";
import "../styles/Donations.css";
import { AdminOnly } from "../components/AdminOnly";
import { HandCoinsIcon } from "../components/HandCoinsIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import {
    AddDonationOrgModal,
    EditDonationOrgModal,
    DeleteDonationOrgModal,
} from "../components/DonationModals";
import { getDonationOrgs } from "../services/donationService";
import type { DonationOrg } from "../services/donationService";

function DonationCard({
    o,
    onEdit,
    onDelete,
}: {
    o: DonationOrg;
    onEdit: (org: DonationOrg) => void;
    onDelete: (org: DonationOrg) => void;
}) {
    return (
        <div className="donCard">
            <div className="donCardHeader">
                <div>
                    <h3 className="donName">{o.name}</h3>
                    {o.city && <span className="donSmall">{o.city}</span>}
                </div>
                <span className="donBadge">{o.type}</span>
            </div>
            <p className="donDesc">{o.description}</p>
            <div style={{ marginTop: "auto", paddingTop: "14px" }}>
                <a
                    className="donBtn"
                    href={o.donationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <HandCoinsIcon size={16} aria-hidden="true" />
                    Donează
                </a>
            </div>
            <AdminOnly>
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                    <AppButton variant="ghost" size="sm" onClick={() => onEdit(o)}>
                        Editează
                    </AppButton>
                    <AppButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(o)}
                        style={{ borderColor: "#e53e3e", color: "#e53e3e" }}
                    >
                        Șterge
                    </AppButton>
                </div>
            </AdminOnly>
        </div>
    );
}

export default function Donations() {
    const [orgs, setOrgs] = useState<DonationOrg[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editOrg, setEditOrg] = useState<DonationOrg | null>(null);
    const [deleteOrg, setDeleteOrg] = useState<DonationOrg | null>(null);

    async function loadOrgs() {
        try {
            const data = await getDonationOrgs();
            setOrgs(data);
        } catch {
            setOrgs([]);
        }
    }

    useEffect(() => { loadOrgs(); }, []);

    return (
        <div>
            <section className="donHero">
                <div className="donCloud dc1" />
                <div className="donCloud dc2" />
                <span className="donPaw dp1">🐾</span>
                <span className="donPaw dp2">🐾</span>
                <span className="donPaw dp3">🐾</span>
                <span
                    className="donPaw"
                    style={{ top: "28px", left: "130px", transform: "rotate(10deg)", fontSize: "20px" }}
                >
                    🐾
                </span>
                <span
                    className="donPaw"
                    style={{ bottom: "80px", right: "130px", transform: "rotate(-12deg)", fontSize: "22px" }}
                >
                    🐾
                </span>
                <div className="donHeroInner">
                    <h1 className="donTitle heroTitle">Donații</h1>
                    <p className="donSub heroSubtitle">ONG-uri și adăposturi care au nevoie de ajutor.</p>
                </div>
            </section>

            <AdminOnly>
                <div className="roleActionBar">
                    <AddActionButton
                        label="Adaugă ONG"
                        onClick={() => setShowAddModal(true)}
                    />
                </div>
            </AdminOnly>

            <div className="donContent">
                {orgs.length === 0 ? (
                    <p style={{
                        textAlign: "center",
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-family)",
                        fontWeight: 600,
                        marginTop: "40px",
                    }}>
                        Nu există organizații adăugate momentan.
                    </p>
                ) : (
                    <div className="donCards">
                        {orgs.map((o) => (
                            <DonationCard
                                key={o.id}
                                o={o}
                                onEdit={setEditOrg}
                                onDelete={setDeleteOrg}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showAddModal && (
                <AddDonationOrgModal
                    onClose={() => setShowAddModal(false)}
                    onAdded={loadOrgs}
                />
            )}
            {editOrg && (
                <EditDonationOrgModal
                    org={editOrg}
                    onClose={() => setEditOrg(null)}
                    onUpdated={loadOrgs}
                />
            )}
            {deleteOrg && (
                <DeleteDonationOrgModal
                    org={deleteOrg}
                    onClose={() => setDeleteOrg(null)}
                    onDeleted={loadOrgs}
                />
            )}
        </div>
    );
}
