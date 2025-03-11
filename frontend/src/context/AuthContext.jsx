import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined); // Start with undefined

    useEffect(() => {
        const syncUser = () => {
            try {
                const storedUser = localStorage.getItem("user");
                console.log("Stored User from LocalStorage:", storedUser);
    
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    console.log("Parsed User:", parsedUser);
                    setUser(parsedUser);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
                setUser(null);
            }
        };
    
        syncUser();
        window.addEventListener("storage", syncUser);  // Ensure sync when localStorage changes
    
        return () => {
            window.removeEventListener("storage", syncUser);
        };
    }, []);

    const login = (userData) => {
        console.log("Logging in:", userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Save user to localStorage
        setUser(userData); // Update user context
    };

    const logout = () => {
        console.log("Logging out");
        localStorage.removeItem("user");
        setUser(null); // Clear user context
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};
