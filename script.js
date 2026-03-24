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
            // 延迟重置表单，保证动画可见
            setTimeout(() => {
                e.target.reset();
                // 手动重置标签位置（兼容浏览器）
                const labels = document.querySelectorAll('.m3-input-field label');
                labels.forEach(label => {
                    label.style.transform = 'translateY(-50%)';
                    label.style.fontSize = '16px';
                    label.style.color = 'var(--m3-outline)';
                });
            }, 500);
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

// 页面加载时初始化标签状态
document.addEventListener('DOMContentLoaded', () => {
    const inputFields = document.querySelectorAll('.m3-input-field input, .m3-input-field textarea');
    inputFields.forEach(field => {
        if (field.value.trim() !== '') {
            const label = field.nextElementSibling;
            label.style.transform = 'translateY(-120%)';
            label.style.fontSize = '12px';
            label.style.color = 'var(--m3-primary)';
        }
    });
});
