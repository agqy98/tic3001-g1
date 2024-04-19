import React, { useState, useEffect } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Card, CardContent } from '@mui/material';
import QuestionService from '../../services/QuestionService';

export default function Matched({ token, opponentName }) {
    // const [value, setValue] = useState('');
    const [code, setCode] = useState(
        `function add(a, b) {\n  return a + b;\n}`
    );
    const [question, setQuestion] = useState({ title: "", description: "" })

    const path = 'ws://host.docker.internal:8084/quill-demo-room'

    useEffect(() => {
        // Hardcoded (Supposed to be randomly assigned based on the catgory selected)
        getQuestion(1);

        // Establish WebSocket connection
        const socket = new WebSocket(path);

        // Listen for messages from the server
        socket.onmessage = (event) => {
            // Create a new FileReader object to read the Blob as text
            const reader = new FileReader();

            // Handle the FileReader onload event
            reader.onload = () => {
                // Extract the text content from the FileReader result
                const text = reader.result;

                // Update the value state with the received text message from the server
                console.log("Received:", text);
                setCode(text);
            };

            // Read the Blob as text
            reader.readAsText(event.data);
        };

        // Cleanup function to close the WebSocket connection when the component unmounts
        return () => {
            socket.close();
        };
    }, []);

    // Supposed to be random 
    const getQuestion = async (id) => {
        const res = await QuestionService.getQuestionById(token, id);
        if (res.questionDetails) {
            setQuestion(res.questionDetails)
        }
    }

    const handleChange = (newValue) => {
        // Update the value state with the new value
        setCode(newValue);

        // Send the new value to the server
        const socket = new WebSocket(path);
        socket.onopen = () => {
            socket.send(newValue);
        };
    };

    return (
        <div>
            {/* <h1>Real-time Collaborative Space</h1> */}
            <div className="m-2">
                <Card variant="outlined">
                    <CardContent style={{backgroundColor: "#D5D8DC"}}>
                        <h4>
                            {question.title}
                        </h4>
                        <hr />
                        <div>
                            {question.description}
                        </div>
                    </CardContent>
                </Card>
                <br />
                <div style={{ marginBottom: "10px" }}>
                    Attempt this question with <u>{opponentName || "guest"}</u>:
                </div>
                <CodeEditor
                    value={code}
                    language="js"
                    placeholder="Please enter JS code."
                    onChange={(evn) => handleChange(evn.target.value)}
                    padding={15}
                    style={{
                        backgroundColor: "#f5f5f5",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    }}
                />
            </div>
        </div>

    );
}

