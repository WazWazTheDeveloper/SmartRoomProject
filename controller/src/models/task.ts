import { TPropertyCheck, TTask, TTaskJSON_DB, TTimeCheck, TTodoTask } from "../interfaces/task.interface"

export class Task implements TTask {
    static readonly CHECK_TYPE_EQUAL = 0
    static readonly CHECK_TYPE_MORE_THEN = 1
    static readonly CHECK_TYPE_LESS_THEN = 2
    static readonly CHECK_TYPE_ANY = 3
    _id: string
    taskName: string
    isOn: boolean
    isRepeating: boolean
    propertyChecks: TPropertyCheck[]
    timeChecks: TTimeCheck[]
    todoTasks: TTodoTask[]

    constructor(
        _id: string,
        taskName: string,
        isOn: boolean,
        isRepeating: boolean,
        propertyChecks: TPropertyCheck[],
        timeChecks: TTimeCheck[],
        todoTasks: TTodoTask[]
    ) {
        this._id = _id;
        this.taskName = taskName;
        this.isOn = isOn;
        this.isRepeating = isRepeating;
        this.propertyChecks = propertyChecks;
        this.timeChecks = timeChecks;
        this.todoTasks = todoTasks;
    }

    static createNewTask(
        _id: string,
        taskName: string,
        isOn: boolean = false,
        isRepeating: boolean = false,
        propertyChecks: TPropertyCheck[] = [],
        timeChecks: TTimeCheck[] = [],
        todoTasks: TTodoTask[] = []) {
        const newTask = new Task(_id, taskName, isOn, isRepeating, propertyChecks, timeChecks, todoTasks)

        return newTask;
    }

    static createTaskFromTTaskJSON_DB(taskData: TTaskJSON_DB) {
        const newTask = new Task(taskData._id, taskData.taskName, taskData.isOn, taskData.isRepeating, taskData.propertyChecks, taskData.timeChecks, taskData.todoTasks)
        return newTask;
    }

    getAsJson_DB(): TTaskJSON_DB {
        let json = {
            _id: this._id,
            taskName: this.taskName,
            isOn: this.isOn,
            isRepeating: this.isRepeating,
            propertyChecks: this.propertyChecks,
            timeChecks: this.timeChecks,
            todoTasks: this.todoTasks,
        }
        return json;
    }

    getAsJson(): TTask {
        let json = {
            _id: this._id,
            taskName: this.taskName,
            isOn: this.isOn,
            isRepeating: this.isRepeating,
            propertyChecks: this.propertyChecks,
            timeChecks: this.timeChecks,
            todoTasks: this.todoTasks,
        }
        return json;
    }
}