"use client";

import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

const WebSSH = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    let ws: WebSocket;

    useEffect(() => {
        if (terminalRef.current) {
            const term = new Terminal();
            term.open(terminalRef.current);
            term.write("Verbinde mit SSH...\r\n");

            ws = new WebSocket("https://ssh.moritxius.de");

            ws.onmessage = (event) => {
                term.write(event.data + "\r\n");
            };

            term.onData((data) => {
                ws.send(data);
            });

            return () => ws.close();
        }
    }, []);

    return <div ref={terminalRef} style={{ height: "400px", width: "100%" }} />;
};

export default WebSSH;
