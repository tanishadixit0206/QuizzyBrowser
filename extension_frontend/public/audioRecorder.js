navigator.mediaDevices.getUserMedia({ audio: true })
  .then((stream) => {
    const mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "START_RECORDING") {
        console.log("Started recording...");
        audioChunks = []; 
        mediaRecorder.start();
      }

      if (message.type === "STOP_RECORDING") {
        console.log("Stopping recording...");
        mediaRecorder.stop();
      }
    });

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioArrayBuffer = await audioBlob.arrayBuffer();
      console.log("Recorded Audio Blob:", audioBlob);
      console.log("Recorded Audio URL:", audioUrl);

      chrome.runtime.sendMessage({ 
        type: "AUDIO",
        data: Array.from(new Uint8Array(audioArrayBuffer)), 
        mimeType: audioBlob.type, 
    });
    };
  })
  .catch((err) => console.error("Microphone access denied:", err));
