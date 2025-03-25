import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Box, Paper, Typography, Stack } from "@mui/material";
import axios from "axios";

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const [hasMore, setHasMore] = useState(true); // To stop fetching when no more messages


    // Function to initialize WebSocket connection
    const connectWebSocket = () => {
        const token = localStorage.getItem("authToken"); // Get token from localStorage
    const ws = new WebSocket(`ws://localhost:5000?userId=${localStorage.getItem('user')}`); // Attach token as query param
    
// WebSocket server URL
        
        ws.onopen = () => {
            console.log("✅ WebSocket Connected");
        };

        

        ws.onmessage = (event) => {
            console.log("Message received:", event.data);
            try {
                const response = JSON.parse(event.data);
                console.log("Parsed response:", response);
                
                setMessages((prev) => [...prev, response]); // Append new message
            } catch (error) {
                console.error("Failed to parse WebSocket response:", event.data);
            }
        };
        
        

        ws.onerror = (error) => {
            console.error("⚠️ WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("❌ WebSocket Disconnected. Reconnecting in 3s...");
            setTimeout(connectWebSocket, 3000); // Auto-reconnect after 3s
        };

        setSocket(ws);
    };

    useEffect(() => {
        connectWebSocket();
        getUsers();
        
        return () => {
            if (socket) {
                socket.close(); // Close WebSocket when component unmounts
            }
        };
    }, []);

    const sendMessage = () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.log("⚠️ WebSocket is not open. Cannot send message.");
            return;
        }

        if (message.trim() === "" || !selectedUserId) return;

        const msgObj = { receiverId: selectedUserId, message };
        socket.send(JSON.stringify(msgObj));
        setMessages((prev) => [...prev, msgObj]); // Show sent message
        setMessage("");
    };

    const getUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/ChatAPP/auth/user", {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
            });
            setUsers(res.data.user);
        } catch (error) {
            console.log(error);
        }
    };


    const chatBoxRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (chatBoxRef.current?.scrollTop === 0 && hasMore && !loading) {
                getMessages(page + 1,""); // Fetch older messages
            }
        };
        console.log("scroll",chatBoxRef);

        chatBoxRef.current?.addEventListener("scroll", handleScroll);
        return () => chatBoxRef.current?.removeEventListener("scroll", handleScroll);

        
    }, [page, hasMore]);

    const getMessages = async (newPage = 1,user) => {
        console.log("llllll",newPage,user);
        
      
        setLoading(true);
    
        try {
            const res = await axios.get(`http://localhost:5000/ChatAPP/auth/getChat`, {
                params: { receiverId: user ? user : selectedUserId, page: newPage, limit: 50 },
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
            });

            console.log("Messages:", res.data.data);
    
            const newMessages = res.data.data;
            if (newMessages.length < 50) setHasMore(false); // No more messages
    
            setMessages((prev) => [...newMessages, ...prev]); // Append old messages
            setPage(newPage);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };
    
    useEffect(() => {
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh",chatBoxRef.current);
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);
const getData=(user)=>{
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh");
    
    getMessages(page,user);setSelectedUserId(user);
}
    return (
        <Box sx={{ width: "400px", margin: "auto", mt: 5 }}>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
                Select a User to Chat
            </Typography>
            <Stack spacing={1} sx={{ mb: 2 }}>
                {users?.map((user) => (
                    <Button
                        key={user._id}
                        variant={selectedUserId === user._id ? "contained" : "outlined"}
                        onClick={()=>getData(user._id)}
                    >
                        {user.email}
                    </Button>
                ))}
            </Stack>

            <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
                    Chat with {selectedUserId ? users.find(u => u._id === selectedUserId)?.name : "..."}
                </Typography>

                
                <Box
    ref={chatBoxRef}
    sx={{
        height: "250px",
        overflowY: "auto",
        border: "1px solid #ccc",
        p: 1,
        mb: 2,
        display: "flex",
        flexDirection: "column" // 🔹 Start from bottom
    }}
>
    {loading && <Typography variant="body2" sx={{ textAlign: "center" }}>Loading...</Typography>}

    {messages.map((msg, index) => {
        const isSentByMe = msg.sender === localStorage.getItem('user');
        if (!msg?.text) return null;

        return (
            <Box key={index} sx={{ display: "flex", justifyContent: isSentByMe ? "flex-end" : "flex-start" }}>
                <Typography
                    sx={{
                        background: isSentByMe ? "#cfe8fc" : "#f5f5f5",
                        p: 1,
                        borderRadius: 1,
                        maxWidth: "75%",
                        textAlign: isSentByMe ? "right" : "left",
                    }}
                >
                    {msg.text}
                </Typography>
            </Box>
        );
    })}
</Box>



                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        fullWidth
                        label="Type a message..."
                        variant="outlined"
                        size="small"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button variant="contained" color="primary" onClick={sendMessage} disabled={!selectedUserId}>
                        Send
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Chat;
