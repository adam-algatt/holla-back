import { useLogout } from "../hooks/useLogout"
import { Route } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext()


    const handleClick = (e) => {
        e.preventDefault()
        logout()
    }

  return (
    <header>
      <Route path='/chat'
      >
        <h1>Holla Back</h1>
      </Route>
    <nav>
        {user && (
            <div>
            <button onClick={handleClick}>
            Logout
            </button>
            </div>
        )}
        {!user && (
            <div>
            <Route path='/'
      >
        <h3>Login/Signup</h3>
      </Route>
            </div>
        )}
    </nav>
    </header>
  )
}

export default Navbar
