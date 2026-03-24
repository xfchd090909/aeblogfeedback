document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('status');
    
    // 锁定按钮防止重复提交
    btn.disabled = true;
    status.style.color = "inherit";
    status.innerText = "正在发送...";

    // 收集数据并处理可选字段
    const data = {
        name: document.getElementById('name').value.trim() || "匿名用户",
        email: document.getElementById('email').value.trim() || "未提供邮箱",
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            status.style.color = "var(--m3-success)";
            status.innerHTML = "<b>发送成功！感谢反馈。</b>";
            e.target.reset();
        } else {
            throw new Error('Server Error');
        }
    } catch (err) {
        status.style.color = "var(--m3-error)";
        status.innerText = "发送失败，请检查网络或配置。";
    } finally {
        btn.disabled = false;
    }
});
