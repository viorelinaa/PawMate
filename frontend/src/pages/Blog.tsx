import { useState } from "react";
import "../styles/Blog.css";
import { UserOnly } from "../components/UserOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";

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

function BlogCard({ post }: { post: BlogPost }) {
    return (
        <div className="blogCard">
            <div className="blogCardEmoji">{post.emoji}</div>
            <div className="blogCardMeta">
                <span
                    className="blogTag"
                    style={{ background: tagColors[post.tag] ?? "#a78bfa" }}
                >
                    {post.tag}
                </span>
                <span className="blogDate">{post.date}</span>
                <span className="blogReadTime">⏱ {post.readTime}</span>
            </div>
            <h3 className="blogCardTitle">{post.title}</h3>
            <p className="blogCardExcerpt">{post.excerpt}</p>
            <AppButton
                className="blogReadBtn"
                variant="primary"
                onClick={() => alert("Articol complet — în curând!")}
            >
                Citește articolul →
            </AppButton>
        </div>
    );
}

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
            <section className="blogHero">
                <div className="blogCloud bc1" />
                <div className="blogCloud bc2" />

                <span className="blogPaw bp1">🐾</span>
                <span className="blogPaw bp2">🐾</span>
                <span className="blogPaw bp3">🐾</span>
                <span className="blogPaw" style={{ top: "32px", left: "140px", transform: "rotate(10deg)", fontSize: "20px" }}>🐾</span>
                <span className="blogPaw" style={{ bottom: "80px", right: "140px", transform: "rotate(-12deg)", fontSize: "22px" }}>🐾</span>

                <div className="blogHeroInner">
                    <h1 className="blogTitle">Blog PawMate</h1>
                    <p className="blogSub">Articole utile pentru stăpânii responsabili</p>
                </div>
            </section>

            <UserOnly>
                <div className="roleActionBar">
                    <AddActionButton
                        label="Adaugă articol"
                        onClick={() => alert("Formular adăugare articol — în curând!")}
                    />
                </div>
            </UserOnly>

            <section className="blogSearchSection">
                <div className="blogSearchContainer">
                    <div className="searchField">
                        <SearchIcon size={18} aria-hidden="true" />
                        <input
                            type="text"
                            className="blogSearchInput"
                            placeholder="Caută articole..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="blogCategoryButtons">
                        {categories.map((cat) => (
                            <AppButton
                                key={cat}
                                className="blogCategoryBtn"
                                variant={selectedCategory === cat ? "primary" : "ghost"}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </AppButton>
                        ))}
                    </div>
                </div>
            </section>

            <section className="blogGridSection">
                <div className="blogGrid">
                    {filtered.length > 0 ? (
                        filtered.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="blogNoResults">
                            <span>🔍</span>
                            <p>Niciun articol găsit pentru căutarea ta.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}