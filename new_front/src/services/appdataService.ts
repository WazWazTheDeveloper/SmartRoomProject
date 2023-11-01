interface VarCheck {
    deviceId: string
    varName: string
    dataIndex: number;
    checkType: number
    valueToCompareTo: any
    isTrue: boolean
}

interface TimeCheck {
    timingData: string
    isTrue: boolean
}

interface ToDoTask {
    deviceId: string
    dataAt: number
    varName: string
    newVarValue: any

}

export interface Task {
    taskId: string
    taskName: string
    isOn: boolean
    isRepeating: boolean
    varCheckList: Array<VarCheck>
    timedCheckList: Array<TimeCheck>
    toDoTaskList: Array<ToDoTask>
}

interface DeviceDataType {
    dataType: number
    data: any
}

export interface Device {
    deviceName: string
    uuid: string
    topicPath: string
    deviceData: Array<DeviceDataType>
    isConnected: boolean
    isConnectedCheck: boolean
    isAccepted: boolean
}
export default class Appdata {
    private taskList: Array<Task>
    private deviceList: Array<Device>;

    constructor(taskList: Array<Task>, deviceList: Array<Device>) {
        this.taskList = taskList;
        this.deviceList = deviceList;
    }

    public static createAppdataFromFetch(data: any) {
        let newAppdata = new Appdata(data.taskList, data.deviceList)
        return newAppdata;
    }

    public static emptyAppdata() {
        return new Appdata([], [])
    }

    getTaskList() {
        return this.taskList;
    }

    getDeviceList() {
        return this.deviceList;
    }

    getDeviceByUUID(deviceId : string) {
        for (let index = 0; index < this.deviceList.length; index++) {
            const device = this.deviceList[index];
            if (device.uuid == deviceId) {
                return device
            }
        }
        throw new Error("device not found")
    }

    getTaskByUUID(taskId : string) {
        for (let index = 0; index < this.taskList.length; index++) {
            const task = this.taskList[index];
            if (task.taskId == taskId) {
                return task
            }
        }
        throw new Error("task not found")
    }

    getAllDeviceId() {
        let uuids = []
        for (let index = 0; index < this.deviceList.length; index++) {
            const device = this.deviceList[index];
            uuids.push(device.uuid)
        }

        return uuids
    }
}