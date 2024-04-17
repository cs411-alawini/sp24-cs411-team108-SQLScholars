import nodemailer from 'nodemailer';
import SQLHelper from '../helpers/SQLHelper';
class NotificationService{
    constructor(){}

    static async sendEmailNotification(email: string, message: string){

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, 
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Define the email options
        const mailOptions = {
            from: 'illinicms@gmail.com',
            to: email,
            subject: 'Notification',
            text: message,
        };
        
        // Send the email
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Failed to send email:', error);
        }
        console.log(`Sending notification to ${email} with message: ${message}`);
        
    }

    static async sendAttendanceNotification(){
        const start = Date.now();
        // Send notifications to all students with isParentNotified = false
        const students: any = await SQLHelper.executeQuery(SQLHelper.getStudentsWithIsParentNotifiedFalse());
        if (students === null || students[0].length === 0) {
            console.error('No students found with isParentNotified = false');
            return;
        }
        for (const student of students[0]) {
            const studentId = student.studentId;
            const userResponse: any = await SQLHelper.executeQuery(SQLHelper.getUserById(studentId));
            if (userResponse === null || userResponse[0].length === 0) {
                console.error('No user found for student', student);
                return;
            }

            const fetchParentsResponse: any = await SQLHelper.executeQuery(SQLHelper.getParentsByStudentId(studentId));
            if (fetchParentsResponse === null || fetchParentsResponse[0].length === 0) {
                console.error('No parents found for student', student);
                return;
            }
            const user = userResponse[0][0];
            const email = user.email;
            let message = '';
            if(student.isPresent){
                message = `Your ward ${user.firstName} ${user.lastName} was present today`;
            } else {
                message = `Your ward ${user.firstName} ${user.lastName} was absent today`;
            }
            await NotificationService.sendEmailNotification(email, message);

            // Update isParentNotified to true
            const attendanceDate = new Date(student.attendanceDate).toISOString().slice(0, 10); // Convert to MySQL-compatible date format
            const updateParentNotificationResponse: any = await SQLHelper.executeQuery(SQLHelper.updateAttendanceAfterNotification(studentId, attendanceDate));
            if (updateParentNotificationResponse === null || updateParentNotificationResponse[0].affectedRows === 0) {
                console.error('Error in updating isParentNotified to true for student', student);
                return;
            }
        }

    }
}
export default NotificationService;