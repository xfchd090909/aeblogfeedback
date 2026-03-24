document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('status');
    
    btn.disabled = true;
    status.innerText = "正在发送...";

    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        // 调用 Netlify 后端接口 (路径是固定的)
        const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            status.style.color = "green";
            status.innerText = "发送成功！感谢反馈。";
            e.target.reset();
        } else {
            throw new Error('发送失败');
        }
    } catch (err) {
        status.style.color = "red";
        status.innerText = "发送失败，请稍后再试。";
    } finally {
        btn.disabled = false;
    }
});
