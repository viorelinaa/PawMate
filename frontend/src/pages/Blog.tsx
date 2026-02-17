import { useState } from "react";
import "./Blog.css";

interface BlogPost {
    id: string;
    title: string;
    tag: string;
    date: string;
    excerpt: string;
    emoji: string;
    readTime: string;
}

const blogPosts: BlogPost[] = [
    {
        id: "b1",
        title: "Greșeli comune la adopție",
        tag: "Adopție",
        date: "15 Ian 2026",
        excerpt: "Ce să verifici înainte să adopți un animal de companie. De la documentație la pregătirea casei, totul contează pentru un început bun.",
        emoji: "🐾",
        readTime: "4 min",
    },
    {
        id: "b2",
        title: "Checklist pentru prima vizită la veterinar",
        tag: "Medical",
        date: "20 Ian 2026",
        excerpt: "Întrebări esențiale și documente utile pe care trebuie să le ai pregătite înainte de prima consultație.",
        emoji: "🏥",
        readTime: "3 min",
    },
    {
        id: "b3",
        title: "Cum să îți pregătești casa pentru un cățeluș",
        tag: "Îngrijire",
        date: "28 Ian 2026",
        excerpt: "Ghid complet pentru a face casa ta sigură și prietenoasă pentru noul tău companion cu patru labe.",
        emoji: "🏠",
        readTime: "5 min",
    },
    {
        id: "b4",
        title: "Alimentația corectă a pisicilor",
        tag: "Nutriție",
        date: "3 Feb 2026",
        excerpt: "Ce mănâncă o pisică sănătoasă? Diferența dintre hrana uscată și umedă, și când să consulți un specialist.",
        emoji: "🐱",
        readTime: "6 min",
    },
    {
        id: "b5",
        title: "Socializarea câinilor: pași esențiali",
        tag: "Dresaj",
        date: "8 Feb 2026",
        excerpt: "Cum să îți obișnuiești câinele cu alte animale și oameni noi, fără stres și cu multă răbdare.",
        emoji: "🐕",
        readTime: "5 min",
    },
    {
        id: "b6",
        title: "Semne că animalul tău are nevoie de ajutor medical",
        tag: "Medical",
        date: "12 Feb 2026",
        excerpt: "Simptomele pe care nu trebuie să le ignori. O listă practică pentru orice stăpân responsabil.",
        emoji: "⚕️",
        readTime: "4 min",
    },
];

const categories = ["Toate", "Adopție", "Medical", "Îngrijire", "Nutriție", "Dresaj"];

const tagColors: Record<string, string> = {
    "Adopție": "#a78bfa",
    "Medical": "#f87171",
    "Îngrijire": "#34d399",
    "Nutriție": "#fbbf24",
    "Dresaj": "#60a5fa",
};

export default function Blog() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Toate");

    const filtered = blogPosts.filter((post) => {
        const matchSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat =
            selectedCategory === "Toate" || post.tag === selectedCategory;
        return matchSearch && matchCat;
    });

    return (
        <div className="blogPage">
            {/* Hero */}
            <section className="blogHero">
                <div className="cloud c1" />
                <div className="cloud c2" />

                <div className="paw p1">🐾</div>
                <div className="paw p2">🐾</div>
                <div className="paw p3">🐾</div>
                <div className="paw p4">🐾</div>
                <div className="paw p5">🐾</div>
                <div className="paw p6">🐾</div>

                <div className="blogHeroInner">
                    <h1 className="blogTitle">Blog PawMate</h1>
                    <p className="blogSub">Articole utile pentru stăpânii responsabili</p>
                </div>
            </section>
        </div>
    );
}
