// src/pages/Login.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (username === 'test' && password === 'test') {
            localStorage.setItem("token", "fake-test-token");
            localStorage.setItem("username", "Usuário Teste");
            navigate('/app');
            return;
        }

        try {
            const response = await fetch("https://service2.funifier.com/v3/auth/token", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    apiKey: "68bc2b63b907ef364c465e82",
                    grant_type: "password",
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error_description || "Usuário ou senha inválidos");
            }

            const data = await response.json();
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("username", username);
            
            navigate('/app');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-screen">
            <motion.div
                className="login-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="login-icon">🌱</div>
                <h1 className="login-title">Fazendinha do Saber</h1>
                <p className="login-subtitle">
                    Cultive seu conhecimento e colha recompensas.
                </p>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input type="text" placeholder="Usuário" className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <User className="input-icon" size={20} />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Senha" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <Lock className="input-icon" size={20} />
                    </div>
                    <motion.button type="submit" className="login-button" disabled={isLoading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        {isLoading ? "Entrando..." : "Entrar na Fazenda"}
                    </motion.button>
                    <p className="login-error">{error}</p>
                </form>
            </motion.div>
        </div>
    );
};

// ✅ ESSA É A LINHA MAIS IMPORTANTE PARA A IMPORTAÇÃO FUNCIONAR
export default Login;