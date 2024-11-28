import { createContext } from "react";

export interface AuthData {
    id: number;
    username: string;
}

interface AuthContextType {
    auth: AuthData | null;
    setAuth: (auth: AuthData | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    auth: null,
    setAuth: () => { },
});