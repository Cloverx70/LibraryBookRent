namespace backend.utils.email.templates;

public class ResetPasswordTemplate
{
    public string GetPasswordResetTemplate(string username, string resetLink, string expirationTime)
    {
        return $@"
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Password Reset Request</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }}
                h2 {{
                    color: #333;
                }}
                p {{
                    color: #555;
                    font-size: 16px;
                    line-height: 1.6;
                }}
                .btn {{
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #007bff;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                    margin-top: 20px;
                }}
                .btn:hover {{
                    background-color: #0056b3;
                }}
                .footer {{
                    margin-top: 20px;
                    font-size: 12px;
                    color: #777;
                }}
            </style>
        </head>
        <body>
            <div class='container'>
                <h2>Password Reset Request</h2>
                <p>Hi <strong>{username}</strong>,</p>
                <p>We received a request to reset your password. Click the button below to proceed:</p>
                <a href='{resetLink}' class='btn'>Click Now to Reset</a>
                <p>If you did not request this, you can ignore this email. For security reasons, this link will expire in {expirationTime} minutes.</p>
                <p class='footer'>If you need help, contact us at <a href='mailto:support@example.com'>support@example.com</a>.</p>
            </div>
        </body>
        </html>";
    }
}
