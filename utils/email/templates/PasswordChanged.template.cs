namespace backend.utils.email.templates;

public class PasswordChangedTemplate
{
    public string GetPasswordChangedTemplate(string username, string resetLink)
    {
        return $@"
       <!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Password Changed Successfully</title>
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
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }}
        .header {{
            background: #007bff;
            color: #ffffff;
            text-align: center;
            padding: 15px;
            font-size: 20px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }}
        .content {{
            padding: 20px;
            color: #333333;
            font-size: 16px;
            line-height: 1.6;
        }}
        .footer {{
            text-align: center;
            font-size: 14px;
            color: #888888;
            margin-top: 20px;
        }}
        .button {{
            display: inline-block;
            padding: 12px 20px;
            margin: 20px 0;
            font-size: 16px;
            color: #ffffff;
            background: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }}
        .button:hover {{
            background: #0056b3;
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">Password Changed Successfully</div>
        <div class=""content"">
            <p>Hello {username},</p>
            <p>We wanted to let you know that your password has been successfully changed. If this was you, no further action is required.</p>
            <p>If you did not make this change, please reset your password immediately by clicking the button below and contact our support team.</p>
            <p style=""text-align: center;"">
                <a href=""{resetLink}"" class=""button"">Reset Password</a>
            </p>
            <p>If the button above doesn’t work, you can copy and paste this link into your browser:</p>
            <p><a href=""{resetLink}"">{resetLink}</a></p>
            <p>If you need any assistance, feel free to contact our support team.</p>
            <p>Best regards,</p>
            <p><strong>Your Company Name</strong></p>
        </div>
        <div class=""footer"">
            &copy; {DateTime.Now.Year} Your Company Name. All rights reserved.
        </div>
    </div>
</body>
</html>
";
    }
}
