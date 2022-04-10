import nodemailer from 'nodemailer';

//Create a SMTP transporter object
const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '9395b556317726',
    pass: '53d1217c7a5c10',
  },
});

export const emailRegistry = async (data) =>{
    const { email, name , token } = data;
  
    //Create a mail options
    const info = await transport.sendMail({
        from: '"UpTask - Project Management " <accounts@uptask.com>',
        to: email,
        subject: 'upTask - Confirm your account',
        text: `Confirm your account in upTask, ${name}`,
        html: `<h1>Confirm your account in upTask, ${name}</h1>
        <p>Click on the link below to confirm your account</p>
        <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm</a>
        <p>If you did not request this, please ignore this email</p>
        `,
        
    })
    console.log('Message sent: %s', info.messageId);
}

export const emailResetPassword = async (data) =>{
  const { email, name, token } = data;

  //Create a mail options
  const info = await transport.sendMail({
    from: '"UpTask - Project Management " <accounts@uptask.com>',
    to: email,
    subject: 'upTask - Reset your password',
    text: `Reset your password in upTask, ${name}`,
    html: `<h1>Reset your password in upTask, ${name}</h1>
        <p>Click on the link below to reset your password</p>
        <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reset Password</a>
        <p>If you did not request this, please ignore this email</p>
        `,
  });
  console.log('Message sent: %s', info.messageId);
}


