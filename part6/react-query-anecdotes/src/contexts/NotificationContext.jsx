import { createContext, useReducer } from 'react'

// Crea el contexto
export const NotificationContext = createContext()

// Crea el proveedor
export const NotificationProvider = ({ children }) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, null)

    return (
        <NotificationContext.Provider value={{ notification, notificationDispatch }}>
            {children}
        </NotificationContext.Provider>
    )
}

// Reducer para manejar las notificaciones
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