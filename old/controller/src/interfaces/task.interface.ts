export type TTaskProperty = {
    taskPropertyName: "taskName"
    newValue: string
} | {
    taskPropertyName: "isOn"
    newValue: boolean
} | {
    taskPropertyName: "isRepeating"
    newValue: boolean
} | UpdatePropertyCheck | DeletePropertyCheck | AddPropertyCheck
    | DeleteTimeCheck | UpdateTimeCheck | AddTimeCheck
    | AddTodoTask | DeleteTodoTask | UpdateTodoTask

type DeletePropertyCheck = {
    taskPropertyName: "propertyChecks",
    operation: "delete",
    itemID: string
}
type UpdatePropertyCheck = {
    taskPropertyName: "propertyChecks",
    operation: "update",
    itemID: string
} &
    ({
        checkPropertyName: "deviceID"
        newValue: string
    } | {
        checkPropertyName: "dataID"
        newValue: number
    } | {
        checkPropertyName: "propertyName"
        newValue: string
    } | {
        checkPropertyName: "checkType"
        newValue: number
    } | {
        checkPropertyName: "valueToCompare"
        newValue: any
    })
type AddPropertyCheck = {
    taskPropertyName: "propertyChecks",
    operation: "add",
    deviceID: string
    dataID: number
    propertyName: string
    checkType: number
    valueToCompare: any
}

type DeleteTimeCheck = {
    taskPropertyName: "timeChecks",
    operation: "delete",
    itemID: string
}
type UpdateTimeCheck = {
    taskPropertyName: "timeChecks",
    operation: "update",
    itemID: string
} & ({
    checkPropertyName: "timingDatas"
    newValue: string
} | {
    checkPropertyName: "isTrue"
    newValue: boolean
})
type AddTimeCheck = {
    taskPropertyName: "timeChecks",
    operation: "add",
    timingData: string
}

type AddTodoTask = {
    taskPropertyName: "todoTasks",
    operation: "add",
    deviceID: string
    dataID: number
    propertyName: string
    newValue: any
}

type DeleteTodoTask = {
    taskPropertyName: "todoTasks",
    operation: "delete",
    itemID: string
}
type UpdateTodoTask = {
    taskPropertyName: "todoTasks",
    operation: "update",
    itemID: string
} & ({
    todoPropertyName: "deviceID"
    newValue: string
} | {
    todoPropertyName: "dataID"
    newValue: number
} | {
    todoPropertyName: "propertyName"
    newValue: string
} | {
    todoPropertyName: "newValue"
    newValue: any
})

export type TTask = {
    _id: string
    taskName: string
    isOn: boolean
    isRepeating: boolean
    propertyChecks: TPropertyCheck[]
    timeChecks: TTimeCheck[]
    todoTasks: TTodoTask[]
}

export type TPropertyCheck = {
    itemID: string
    deviceID: string
    dataID: number
    propertyName: string
    checkType: number
    valueToCompare: any
}

export type TTimeCheck = {
    itemID: string
    timingData: string
    isTrue: boolean
}

export type TTodoTask = {
    itemID: string
    deviceID: string
    dataID: number
    propertyName: string
    newValue: any
}

export type TTaskJSON_DB = {
    _id: string
    taskName: string
    isOn: boolean
    isRepeating: boolean
    propertyChecks: TPropertyCheck[]
    timeChecks: TTimeCheck[]
    todoTasks: TTodoTask[]
}