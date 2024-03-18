// sendEmail.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3000; // Choose any port you prefer

// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Enable CORS for all routes
app.use(cors());

// Endpoint to handle email sending request
app.post('/send-email-with-attachment', (req, res) => {
    const {
        from,
        to,
        subject,
        text:
        attachments,
    } = req.body;

    // Convert base64 string to a buffer
    const attachmentBuffer = Buffer.from(attachmentBase64, 'base64');

    // Create a transporter object using SMTP
    const transporter = nodemailer.createTransport(transportOptions);

    // Create an email message
    const mailOptions = {
        from: from, // Sender's email address
        to: to, // Recipient's email address
        subject: 'Test Email with Attachment', // Subject line
        text: 'Hello, This is a test email with attachment.', // Plain text body
        attachments: [
            {
                filename: 'attachment.txt', // Name of the attachment
                content: attachmentBuffer // Buffer of the attachment
            }
        ]
    };

    // Send email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error occurred:', error);
            res.status(500).json({ error: 'Failed to send email' });
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Email sent successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
