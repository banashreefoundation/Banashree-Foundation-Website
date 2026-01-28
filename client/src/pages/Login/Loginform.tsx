import { useState } from "react";
import { LoginService } from "./LoginService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const Form = () => {
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength += 1;
        if (password.length >= 10) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const getStrengthLabel = (strength) => {
        switch (strength) {
            case 0: return "Too Weak";
            case 1: return "Weak";
            case 2: return "Fair";
            case 3: return "Good";
            case 4: return "Strong";
            case 5: return "Very Strong";
            default: return "";
        }
    };

    const getStrengthColor = (strength) => {
        return ["red", "orange", "#877914", "lightgreen", "green", "darkgreen"][strength];
    };

    const navigate = useNavigate();
    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const strength = getPasswordStrength(password);
    const strengthLabel = getStrengthLabel(strength);
    const strengthColor = getStrengthColor(strength);
    const { get, post } = LoginService(`${import.meta.env.VITE_API_URL}`)
    const handleLogin = ($event) => {
        $event.preventDefault();
        if(!email){
            toast.error("Please enter your email address");
            return
        }
        if(!isValidEmail(email)){
            toast.error("Please enter a valid email");
            return
        }
        if(!password){
            toast.error("Please enter your password");
            return;
        }
        if (email && password) {
            post('login', { email, password }).then(data => {
                if(data && data["user"] && data["user"]["name"]){
                    localStorage.setItem('token', JSON.stringify(data.token));
                    toast.success("Login successful");
                    navigate('/admin');
                } else {
                    toast.error("Invalid credentials");
                }
            }).catch(error => {
                console.error(error);
                toast.error("Invalid credentials");
            });
        }
    }
    return <>
        <form>
            <div className="email-container flex-none">
                <div className="email-label">Email*</div>
                <div className="email-input">
                    <input type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
            </div>
            <div className="password-container flex-none">
                <div className="password-label">Password*</div>
                <div className="password-input">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {password &&<> <div style={{ height: "10px", width: "100%", background: "#ddd", borderRadius: "5px" }}>
                        <div style={{ width: `${(strength / 5) * 100}%`, height: "100%", background: strengthColor, borderRadius: "5px" }}></div>
                    </div>
                    <p style={{ color: strengthColor, fontWeight: "bold" }}>{strengthLabel}</p>
                    </>
                    }
                </div>
            </div>
            <div className="login-button" onClick={handleLogin}>
                Login
            </div>
            <ToastContainer />
            {/* <div className="register-div">
                <span className="desc2">Don’t have an account?
                    <span className="desc1">Register</span></span>
            </div> */}
        </form>
    </>
}