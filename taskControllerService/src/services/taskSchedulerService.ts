import * as cron from 'node-cron';
import { loggerGeneral } from './loggerService';

type TScheduledTask = {
    itemID: string
    taskID:string
    scheduledTask: cron.ScheduledTask
}

export const scheduledTasks: TScheduledTask[] = []

export function addScheduledTask(cronExpression: string, itemID: string,taskID:string, func: () => void) {
    // check if valid cron expression
    if (!cron.validate(cronExpression)){
        const error = `${cronExpression} is no a valid cron-expression at:addScheduledTask(cronExpression: string, id: string, func: () => void) in:taskSchedulerService.ts`
        loggerGeneral.error(error,"taskControllerService")
        throw new Error
    }

    const newScheduledTask = {
        itemID: itemID,
        taskID : taskID,
        scheduledTask: cron.schedule(cronExpression, func)
    }
    newScheduledTask.scheduledTask.start();
    scheduledTasks.push(newScheduledTask)
}

export function stopScheduledTask(itemID: string) {
    for (let i = 0; i < scheduledTasks.length; i++) {
        const task = scheduledTasks[i];
        if (task.itemID == itemID) {
            task.scheduledTask.stop();
            scheduledTasks.splice(i, 1);
        }

    }
}

export function stopScheduledTaskOfTask(taskID: string) {
    for (let i = 0; i < scheduledTasks.length; i++) {
        const task = scheduledTasks[i];
        if (task.taskID == taskID) {
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