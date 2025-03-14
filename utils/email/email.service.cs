using System.Net;
using System.Net.Mail;

namespace backend.utils.email;

public interface IemailService
{
    void sendEmail(string To, string Subject, string body, bool isHtml);
}

public class emailService : IemailService
{
    private readonly IConfiguration configuration;

    public emailService(IConfiguration _configuration)
    {
        configuration = _configuration;
    }

    public void sendEmail(string To, string Subject, string body, bool isHtml)
    {
        try
        {
            var smtpSettings = configuration.GetSection("SmtpSettings");

            using (MailMessage mail = new MailMessage())
            {
                mail.From = new MailAddress(smtpSettings["Username"]!);
                mail.To.Add(To);
                mail.Subject = Subject;
                mail.Body = body;
                mail.IsBodyHtml = true;

                using (
                    SmtpClient smtp = new SmtpClient(
                        smtpSettings["Host"],
                        int.Parse(smtpSettings["Port"]!)
                    )
                )
                {
                    smtp.Credentials = new NetworkCredential(
                        smtpSettings["Username"],
                        smtpSettings["Password"]
                    );
                    smtp.EnableSsl = true;
                    smtp.Send(mail);
                }
            }
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
}
