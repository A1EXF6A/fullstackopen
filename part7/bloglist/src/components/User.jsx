import { useDispatch } from 'react-redux'
import { logoutUser } from '../reducers/userReducer'

const User = ({ user }) => {
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logoutUser())
    }

    return (
        <div>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
        </div>
    )
}

export default User