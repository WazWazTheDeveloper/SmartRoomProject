import cron = require('node-cron');
class TimedTask {
    timeFormat : string
    scheduledTask : cron.ScheduledTask
    callback:Function

    constructor(timeFormat : string,callback:Function) {
        this.timeFormat = timeFormat
        this.callback = callback.bind(this)
        this.scheduledTask = this.getNewScheduledTask()
    }
    
    getNewScheduledTask() {
        return cron.schedule(this.timeFormat,this.callback.bind(this))
    }

    stop() {
        this.scheduledTask.stop()
    }

    start() {
        this.scheduledTask.start()

    }
    chengeCallback() {
        this.stop()
        this.scheduledTask = this.getNewScheduledTask()

    }
}

export {TimedTask}