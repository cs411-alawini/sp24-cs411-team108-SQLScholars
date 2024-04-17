import * as schedule from 'node-schedule';
import NotificationService from '../services/NotificationService';
class Schedule{
    constructor(){}
    static async attendanceServiceSchedule(){
        console.log('Attendance service scheduled');
        
        schedule.scheduleJob('0 10 * * *', async function(){
            console.log('Attendance service running');
            await NotificationService.sendAttendanceNotification();
        });
    }
}
export default Schedule;