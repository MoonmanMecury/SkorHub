import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, resetLink: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'SkorHub <onboarding@resend.dev>', // You should update this to your domain once verified
            to: email,
            subject: 'Reset your SkorHub password',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0A0A0B; color: white; border-radius: 20px;">
                    <h1 style="color: #FF2D55; text-transform: uppercase; font-style: italic;">SkorHub</h1>
                    <h2>Reset Your Password</h2>
                    <p>We received a request to reset your password for your SkorHub account. If you didn't make this request, you can safely ignore this email.</p>
                    <div style="margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #FF2D55; color: white; padding: 15px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; text-transform: uppercase;">Reset Password</a>
                    </div>
                    <p style="font-size: 12px; color: #64748b;">This link will expire in 1 hour.</p>
                    <p style="font-size: 12px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser: <br/> ${resetLink}</p>
                </div>
            `,
        });

        if (error) {
            console.error('Email error:', error);
            return { error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Resend catch error:', err);
        return { error: err };
    }
}
