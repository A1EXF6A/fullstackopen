import { useReducer } from 'react'
import { NotificationContext } from './contexts/NotificationContext'

export const NotificationProvider = ({ children }) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, null)

    return (
        <NotificationContext.Provider value={{ notification, notificationDispatch }}>
            {children}
        </NotificationContext.Provider>
    )
}

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return action.payload
        case 'CLEAR':
            return null
        default:
            return state
    }
}