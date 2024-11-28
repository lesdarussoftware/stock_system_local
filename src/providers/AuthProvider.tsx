import { useState, ReactNode } from "react";

import { AuthContext, AuthData } from "../contexts/AuthContext";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [auth, setAuth] = useState<AuthData | null>(null);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
