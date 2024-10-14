import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import axios from 'axios'
import { socket } from '../socket'
import PendingRequestContainer from './PendingRequestContainer'

export default function UserNotificationsContainer() {
    const [pendingRequests, setPendingRequest] = useState([])
    const [notifications, setNotifications] = useState([])
    const { auth } = useAuth()

    const token = localStorage.getItem('token');
  
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }

    const getPendingRequest = async() => {
        try {
            const { data } = await axios(`${import.meta.env.VITE_API_URL}/api/pending-requests`, config)
            setPendingRequest(data.pendingRequests.filter(item => item.status === 'pending'))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(auth.ID) {
            if(auth.RolID === 5 || auth.RolID === 1) {
                getPendingRequest()
            }
        }
    }, [auth])

    useEffect(() => {
        socket.on('pendingRequestUpdated', () => getPendingRequest())
    }, [])

    return (
        <div>
            <h2>Notificaciones</h2>
            {(pendingRequests.length > 0 || notifications.length > 0) ? (
                <div className='d-flex flex-column gap-2'>
                    {pendingRequests.map(pendingRequest => (
                        <PendingRequestContainer 
                            key={pendingRequest.id}
                            pendingRequest={pendingRequest} 
                        />
                    ))}
                </div>
            ) : (
                <p className='fw-bold fs-5 text-secondary'>No hay notificaciones</p>
            )}
        </div>
    )
}
