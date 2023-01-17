import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext(); 

// reducer for global state of 
//session status
export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': 
    return { user: action.payload }
    case 'LOGOUT': 
    return { user: action.payload }
    default: 
    return state
  }
}

// context with user state and reducer method
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })
//   if user session storage in LS run 'LOGIN' case
useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'))

    if (user) {
        dispatch({ type: 'LOGIN', payload: user })
    }
}, [])

// console.log(`User status`, state)

// destructured user state and reducer method

return (
    <AuthContext.Provider value={{ ...state, dispatch }}
    >
        { children }
    </AuthContext.Provider>
)
}