// 获取DOM元素
const micBtn = document.getElementById('micBtn');
const responseDiv = document.getElementById('response');

// 检查浏览器支持
if (!('webkitSpeechRecognition' in window) {
    responseDiv.innerHTML = "⚠️ 您的浏览器不支持语音识别，请使用Chrome或Edge";
} else {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false; // 单次识别
    recognition.interimResults = false; // 不要中间结果
    recognition.lang = 'zh-CN'; // 中文识别

    // 按钮事件处理
    micBtn.addEventListener('mousedown', startListening);
    micBtn.addEventListener('mouseup', stopListening);
    micBtn.addEventListener('touchstart', startListening);
    micBtn.addEventListener('touchend', stopListening);

    function startListening() {
        recognition.start();
        micBtn.style.background = '#f44336'; // 红色表示录音中
        responseDiv.innerHTML = "正在聆听...";
    }

    function stopListening() {
        recognition.stop();
        micBtn.style.background = '#4CAF50'; // 恢复绿色
    }

    // 语音识别结果处理
    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        responseDiv.innerHTML = `<strong>你说：</strong> ${transcript}`;
        
        // 调用DeepSeek API
        const aiResponse = await getAIResponse(transcript);
        responseDiv.innerHTML += `<br><br><strong>AI回复：</strong> ${aiResponse}`;
        
        // 语音播报回复
        speak(aiResponse);
    };

    recognition.onerror = (event) => {
        console.error('语音识别错误:', event.error);
        responseDiv.innerHTML = "识别失败，请重试";
    };
}

// 调用DeepSeek API
async function getAIResponse(userInput) {
    const API_KEY = '你的DeepSeek_API_Key'; // 替换为你的API Key
    
    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "你是一个贴心的私人助手，回复简洁友好" },
                    { role: "user", content: userInput }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('API调用失败:', error);
        return "抱歉，我暂时无法回答这个问题";
    }
}

// 语音合成功能
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.0; // 语速
        utterance.pitch = 1.0; // 音调
        speechSynthesis.speak(utterance);
    }
}