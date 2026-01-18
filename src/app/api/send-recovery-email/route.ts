import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configuração do transporter do Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email, token, userName } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email e token são obrigatórios' },
        { status: 400 }
      );
    }

    // URL base do site
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ar-ji-parana.vercel.app';
    const resetLink = `${baseUrl}/admin/redefinir-senha?token=${token}&email=${encodeURIComponent(email)}`;

    // Template do e-mail
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Senha - AGERJI</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">AGERJI</h1>
              <p style="color: #bbf7d0; margin: 10px 0 0 0; font-size: 14px;">Agência Reguladora de Ji-Paraná</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #166534; margin: 0 0 20px 0; font-size: 22px;">Recuperação de Senha</h2>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Olá${userName ? `, <strong>${userName}</strong>` : ''},
              </p>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Recebemos uma solicitação para redefinir a senha da sua conta no sistema administrativo da AGERJI.
              </p>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Clique no botão abaixo para criar uma nova senha:
              </p>
              
              <!-- Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(22, 101, 52, 0.3);">
                      Redefinir Minha Senha
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                Se você não solicitou a redefinição de senha, ignore este e-mail. Sua senha permanecerá inalterada.
              </p>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                <strong>⚠️ Este link expira em 1 hora.</strong>
              </p>
              
              <!-- Alternative Link -->
              <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
                <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">
                  Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
                </p>
                <p style="color: #166534; font-size: 12px; word-break: break-all; margin: 0;">
                  ${resetLink}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">
                AGERJI - Agência Reguladora de Ji-Paraná
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                Rua do Brilhante, 130 - Urupá | Ji-Paraná - RO | CEP: 76.900-150
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                (69) 3421-5996 | agerji@ji-parana.ro.gov.br
              </p>
              <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 0 0;">
                Desenvolvido por DATA-RO INTELIGÊNCIA TERRITORIAL
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Enviar e-mail
    const mailOptions = {
      from: {
        name: 'AGERJI - Sistema Administrativo',
        address: process.env.GMAIL_USER || 'suporte@dataro-it.com.br',
      },
      to: email,
      subject: '🔐 Recuperação de Senha - AGERJI',
      html: htmlContent,
      text: `
AGERJI - Recuperação de Senha

Olá${userName ? ` ${userName}` : ''},

Recebemos uma solicitação para redefinir a senha da sua conta no sistema administrativo da AGERJI.

Clique no link abaixo para criar uma nova senha:
${resetLink}

Se você não solicitou a redefinição de senha, ignore este e-mail.

⚠️ Este link expira em 1 hora.

---
AGERJI - Agência Reguladora de Ji-Paraná
Rua do Brilhante, 130 - Urupá | Ji-Paraná - RO
(69) 3421-5996 | agerji@ji-parana.ro.gov.br
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'E-mail enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar e-mail de recuperação' },
      { status: 500 }
    );
  }
}
