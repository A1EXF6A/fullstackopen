import { useContext } from 'react'
import { NotificationContext } from '../contexts/NotificationContext'

const Notification = () => {
    const { notification } = useContext(NotificationContext)

    if (!notification) return null

    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1,
        marginBottom: 10,
        color: notification.type === 'error' ? 'red' : 'green'
    }

    return (
        <div style={style}>
            {notification.message}
        </div>
    )
}

export default Notification