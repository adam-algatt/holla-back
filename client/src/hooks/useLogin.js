import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
    const [ show, setShow] = useState(false); 
    const [ email, setEmail] = useState(''); 
    const [ error, setError] = useState(''); 
    const [ password, setPassword] = useState(''); 
    const [loading, setLoading] = useState(false);
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setLoading(true)

        // compare supplied credentials with DB
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
          })
        const json = await response.json()

        if (!response.ok) {
            setLoading(false)
            setError(json.error); 
        }

        if (response.ok) {
            localStorage.setItem('userInfo', JSON.stringify(json))

            // update auth context
            dispatch({type: 'LOGIN', payload: json})
            setLoading(false)

        }
    }
    return { login, loading, error }
}
  