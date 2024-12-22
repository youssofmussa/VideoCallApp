// App.jsx
import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

function App() {
  const [myId, setMyId] = useState("");
  const [friendId, setFriendId] = useState("");
  const [callInProgress, setCallInProgress] = useState(false);
  const myVideoRef = useRef(null);
  const friendVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    // Initialize PeerJS
    const peer = new Peer();
    peerInstance.current = peer;
  
    peer.on("open", (id) => {
      setMyId(id);
    });
  
    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          myVideoRef.current.srcObject = stream;
          
          // Ensure the video is ready to play before calling play()
          myVideoRef.current.oncanplay = () => {
            myVideoRef.current.play();
          };
          
          call.answer(stream);
  
          call.on("stream", (remoteStream) => {
            friendVideoRef.current.srcObject = remoteStream;
            
            // Ensure the friend's video plays only after it is ready
            friendVideoRef.current.oncanplay = () => {
              friendVideoRef.current.play();
            };
          });
        })
        .catch((err) => console.error("Error accessing media devices.", err));
    });
  
    return () => {
      peer.disconnect();
    };
  }, []);
  

  const startCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideoRef.current.srcObject = stream;
        myVideoRef.current.play();

        const call = peerInstance.current.call(friendId, stream);
        setCallInProgress(true);

        call.on("stream", (remoteStream) => {
          friendVideoRef.current.srcObject = remoteStream;
          friendVideoRef.current.play();
        });
      })
      .catch((err) => console.error("Error accessing media devices.", err));
  };

  return (
    <div className="app">
      <h1>Video Call App</h1>
      <div className="video-container">
        <div>
          <h2>My Video</h2>
          <video ref={myVideoRef} playsInline muted></video>
        </div>
        <div>
          <h2>Friend's Video</h2>
          <video ref={friendVideoRef} playsInline></video>
        </div>
      </div>
      <div className="controls">
        <div>
          <h3>Your ID: {myId}</h3>
          <input
            type="text"
            placeholder="Enter friend's ID"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
          />
        </div>
        <button onClick={startCall} disabled={callInProgress || !friendId}>
          Start Call
        </button>
      </div>
      <style jsx>{`
        .app {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
        }
        .video-container {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
        }
        video {
          width: 45%;
          border: 2px solid black;
          border-radius: 10px;
        }
        .controls {
          margin-top: 20px;
        }
        input {
          padding: 10px;
          margin: 10px;
          font-size: 16px;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default App;
