import { useState, useEffect } from "react";
import "../styles/FarmingTipsPage.css"; // Ensure you have a CSS file for styling

const FarmingTipsPage = () => {
    const [tips, setTips] = useState([]);
    const [expandedTip, setExpandedTip] = useState(null); // Track which tip is expanded

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/tips"); // Ensure this route is correct
                const data = await response.json();
                setTips(data);
            } catch (error) {
                console.error("Error fetching farming tips:", error);
            }
        };

        fetchTips();
    }, []);

    const toggleExpand = (index) => {
        setExpandedTip(expandedTip === index ? null : index);
    };

    return (
        <div className="farming-tips-container">
            <h2>Farming Tips</h2>
            <div className="tips-grid">
                {tips.map((tip, index) => {
                    const isExpanded = expandedTip === index;
                    return (
                        <div key={index} className={`tip-card ${isExpanded ? "expanded" : ""}`}>
                            <h3>{tip.title}</h3>
                            <p className={isExpanded ? "full-text" : "short-text"}>
                                {isExpanded ? tip.content : tip.content.slice(0, 100) + "..."}
                            </p>
                            {tip.content.length > 100 && (
                                <button className="see-more-btn" onClick={() => toggleExpand(index)}>
                                    {isExpanded ? "See Less" : "See More"}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FarmingTipsPage;
