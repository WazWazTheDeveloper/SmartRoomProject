import * as cron from 'node-cron';
import { ERROR_LOG, logEvents } from '../middleware/logger';

type TScheduledTask = {
    id: string
    scheduledTask: cron.ScheduledTask
}

const scheduledTasks: TScheduledTask[] = []

// TODO: add logs
export function addScheduledTask(cronExpression: string, id: string, func: () => void) {
    // check if valid cron expression
    if (!isCronValid(cronExpression)){
        const error = `${cronExpression} is no a valid cron-expression at:addScheduledTask(cronExpression: string, id: string, func: () => void) in:taskSchedulerService.ts`
        logEvents(error,ERROR_LOG)
        throw new Error
    }

    const newScheduledTask = {
        id: id,
        scheduledTask: cron.schedule(cronExpression, func)
    }
    newScheduledTask.scheduledTask.start();
    scheduledTasks.push(newScheduledTask)
}

export function stopScheduledTask(id: string) {
    for (let i = 0; i < scheduledTasks.length; i++) {
        const task = scheduledTasks[i];
        if (task.id == id) {
            task.scheduledTask.stop();
            scheduledTasks.splice(i, 1);
        }

    }
}

export function isCronValid(cronExpression: string) {
    // can be replaced with cron.validate()
    var cronregex = new RegExp(/(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/);
    return cronregex.test(cronExpression);
}