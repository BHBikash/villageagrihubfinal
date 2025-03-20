import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import "../styles/AdminDashboard.css"; // Ensure CSS file is imported

const AdminDashboard = () => {
    const { user } = useAuthContext();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddTip = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("https://villageagrihub.onrender.com/api/tips", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ Farming tip added successfully!");
                setTitle("");
                setContent("");
            } else {
                alert(`❌ Error: ${data.message || "Failed to add tip"}`);
            }
        } catch (error) {
            alert("❌ Network error. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="admin-dashboard">
            <h2 className="dashboard-title">Admin Dashboard</h2>
            <div className="tip-card">
                <h3>Add Farming Tip</h3>
                <form onSubmit={handleAddTip}>
                    <input
                        type="text"
                        placeholder="Enter tip title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="tip-input"
                    />
                    <textarea
                        placeholder="Enter tip content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="tip-textarea"
                    />
                    {console.log("Button rendering")}
                    <button type="submit" className="add-tip-btn" disabled={loading}>
                        {loading ? "Adding..." : "Add Tip"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
