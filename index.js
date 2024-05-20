const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const upload = multer();

app.post('/send-email-with-attachment', upload.single('attachment'), (req, res) => {
    console.log('Received email request:', req.body);
    const { transportOptions, from, to, subject, text } = req.body;
    const attachment = req.file;

    const transporter = nodemailer.createTransport(JSON.parse(transportOptions));

    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    const savedFilePath = path.join(uploadDir, attachment.originalname);
    
    // Write file to disk
    fs.writeFile(savedFilePath, attachment.buffer, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).json({ error: 'Failed to save attachment' });
            return;
        }
        
        // Create an email message
        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            // html: `<div>
            //     test
            //     <img src="${savedFilePath}" style="width: 300px; height: auto" />
            // </div>`,
            text: text,
            attachments: [{
                filename: attachment.originalname,
                path: savedFilePath,
                cid: 'imagename'
          }],
        };

        // Send email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error occurred:', error);
                res.status(500).json({ error: 'Failed to send email' });
            } else {
                console.log('Email sent:', info.response);
                res.status(200).json({ message: 'Email sent successfully' });
                
                // Delete the temporary file after sending the email
                fs.unlink(savedFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting file:', unlinkErr);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
