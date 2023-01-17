import { useAuthContext } from './useAuthContext'

export const useLogout = () => { 
const { dispatch } = useAuthContext(); 


const logout = () => {
    // clear localStorage
    localStorage.removeItem('userInfo')

    // run logout in useAuthContext
    dispatch({ type: 'LOGOUT' })

}


return { logout }
}