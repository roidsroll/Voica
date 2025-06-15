document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const output = document.getElementById('output');
    const language = document.getElementById('language');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    let recognition;
    let isRecognizing = false;
    
    // Cek dukungan browser
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        output.textContent = 'Maaf, browser Anda tidak mendukung Web Speech API. Gunakan Chrome atau Edge versi terbaru.';
        startBtn.disabled = true;
        return;
    }
    
    // Inisialisasi Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
        isRecognizing = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        output.textContent = 'Mendengarkan...';
    };
    
    recognition.onerror = (event) => {
        console.error('Error occurred in recognition: ' + event.error);
        output.textContent = 'Error: ' + event.error;
        isRecognizing = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };
    
    recognition.onend = () => {
        isRecognizing = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        
        if (output.textContent === 'Mendengarkan...') {
            output.textContent = 'Tidak ada suara yang terdeteksi...';
        }
    };
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        output.innerHTML = finalTranscript + '<span style="color: gray;">' + interimTranscript + '</span>';
    };
    
    // Event Listeners
    startBtn.addEventListener('click', () => {
        recognition.lang = language.value;
        recognition.start();
    });
    
    stopBtn.addEventListener('click', () => {
        recognition.stop();
    });
    
    copyBtn.addEventListener('click', () => {
        const textToCopy = output.textContent || output.innerText;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Tersalin!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Gagal menyalin teks: ', err);
        });
    });
    
    clearBtn.addEventListener('click', () => {
        output.textContent = '';
    });
});