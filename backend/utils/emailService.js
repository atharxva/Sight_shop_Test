import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const getStatusEmailTemplate = (userName, doctorName, date, time, status) => {
    const statusMessages = {
        'Confirmed': 'Your appointment has been confirmed',
        'Cancelled': 'Your appointment has been cancelled',
        'Completed': 'Your appointment has been marked as completed',
        'Pending': 'Your appointment is now pending review'
    };

    const message = statusMessages[status] || 'Your appointment status has been updated';

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Appointment Status Update</h2>
            <p>Dear ${userName},</p>
            <p>${message} with Dr. ${doctorName}.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Appointment Details:</h3>
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Status:</strong> <span style="color: ${
                    status === 'Confirmed' ? '#28a745' :
                    status === 'Cancelled' ? '#dc3545' :
                    status === 'Completed' ? '#6c757d' :
                    '#ffd700'
                }">${status}</span></p>
            </div>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>Your Healthcare Team</p>
        </div>
    `;
};

export const sendStatusUpdateEmail = async (userEmail, userName, doctorName, date, time, status) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Appointment Status Update - ${status}`,
        html: getStatusEmailTemplate(userName, doctorName, date, time, status)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Status update email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending status update email:', error);
        return false;
    }
};
