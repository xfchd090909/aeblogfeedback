const nodemailer = require('nodemailer');

exports.handler = async (event) => {
    // 跨域处理（虽然同域部署不需要，但养成好习惯）
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { name, email, message } = JSON.parse(event.body);

        // 使用 Netlify 环境变量注入 SMTP 配置
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // 如 smtp.gmail.com
            port: 587,
            secure: false, // 587 通常为 false，465 为 true
            auth: {
                user: process.env.SMTP_USER, // 你的邮箱地址
                pass: process.env.SMTP_PASS  // 你的应用授权码
            }
        });

        await transporter.sendMail({
            from: `"${name}" <${process.env.SMTP_USER}>`, // 发件人显示
            to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER, // 收件人（默认发给自己）
            subject: "来自网页的新反馈",
            text: `姓名: ${name}\n邮箱: ${email}\n内容: ${message}`,
            replyTo: email // 方便你直接回复用户
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Success" })
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
