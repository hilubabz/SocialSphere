"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketDataProvider({ children, userData }) {
    const [socketConnected, setSocketConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!socketRef.current) {
            // Avoid reconnecting on each re-render
            socketRef.current = io();

            socketRef.current.on('connect', () => {
                console.log('Socket connected:', socketRef.current.id);
                if (userData?._id) {
                    socketRef.current.emit('online', userData._id);
                }
                setSocketConnected(true);
            });

            socketRef.current.on('disconnect', () => {
                console.log('Socket disconnected');
                setSocketConnected(false);
            });
        }

        return () => {
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
