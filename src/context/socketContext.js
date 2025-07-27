"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketDataProvider({ children, userData }) {
    const [socketConnected, setSocketConnected] = useState(false);
    const socketRef = useRef(null);
    const reconnectTimeout = useRef(null);

    useEffect(() => {
        const setupSocket = () => {
            if (!socketRef.current) {
                socketRef.current = io();

                // Connection handlers
                socketRef.current.on('connect', () => {
                    console.log('Socket connected:', socketRef.current.id);
                    setSocketConnected(true);
                    
                    // Send online status when connected and have user data
                    if (userData?._id) {
                        socketRef.current.emit('online', userData._id);
                    }
                });

                socketRef.current.on('disconnect', () => {
                    console.log('Socket disconnected');
                    setSocketConnected(false);

                    // Try to reconnect after a delay
                    if (reconnectTimeout.current) {
                        clearTimeout(reconnectTimeout.current);
                    }
                    reconnectTimeout.current = setTimeout(setupSocket, 5000);
                });

                // Error handling
                socketRef.current.on('connect_error', (error) => {
                    console.log('Connection error:', error);
                    setSocketConnected(false);
                });
            }
        };

        setupSocket();

        // Update online status when userData changes
        if (socketRef.current && socketConnected && userData?._id) {
            socketRef.current.emit('online', userData._id);
        }

        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [userData?._id]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, socketConnected }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocketData() {
    return useContext(SocketContext);
}
