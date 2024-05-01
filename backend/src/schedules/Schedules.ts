import * as schedule from 'node-schedule';
import NotificationService from '../services/NotificationService';
class Schedule{
    constructor(){}
    static async attendanceServiceSchedule(){
        console.log('Attendance service scheduled');
        
        schedule.scheduleJob('*/1 * * * *', async function(){
            console.log('Attendance service running');
            await NotificationService.sendAttendanceNotification();
        });
    }

    static async gradeServiceSchedule(){
        console.log('Grade service scheduled');
        
        schedule.scheduleJob('*/1 * * * *', async function(){
            console.log('Grade service running');
            await NotificationService.sendEmailForGrades();
        });
    }
}
export default Schedule;