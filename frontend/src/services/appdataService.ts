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
    isAccepted: -1 | 0 | 1
}

export interface User {
    uuid: string;
    username: string;
    password: string;
    permission: Array<string>;
    // settings: SettingsType;
    isActive: boolean;
    isAdmin : boolean;
}
export default class Appdata {
    private taskList: Array<Task>
    private deviceList: Array<Device>;
    private userList: Array<User>;

    constructor(taskList: Array<Task>, deviceList: Array<Device>, userList: Array<User>) {
        this.taskList = taskList;
        this.deviceList = deviceList;
        this.userList = userList;
    }

    public static createAppdataFromFetch(data: any) {
        let newAppdata = new Appdata(data.taskList, data.deviceList,data.userList)
        return newAppdata;
    }

    public static emptyAppdata() {
        return new Appdata([], [],[])
    }

    getTaskList() {
        return this.taskList;
    }

    getUserList() {
        return this.userList;
    }

    getDeviceList() {
        return this.deviceList;
    }

    getDeviceByUUID(deviceId: string) {
        for (let index = 0; index < this.deviceList.length; index++) {
            const device = this.deviceList[index];
            if (device.uuid == deviceId) {
                return device
            }
        }
        throw new Error("device not found")
    }

    getUserById(userId: string) {
        for (let index = 0; index < this.userList.length; index++) {
            const user = this.userList[index];
            if (user.uuid == userId) {
                return user
            }
        }
        throw new Error("user not found")
    }

    getTaskByUUID(taskId: string) {
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

    checkIfUserExist(uuid:string) {
        for (let index = 0; index < this.userList.length; index++) {
            const user = this.userList[index];
            if(user.uuid == uuid) {
                return true
            }
        }
        return false
    }
}

export class DataType {
    static readonly AIRCONDITIONER_TYPE = 0;
    static readonly SWITCH_TYPE = 1;
}