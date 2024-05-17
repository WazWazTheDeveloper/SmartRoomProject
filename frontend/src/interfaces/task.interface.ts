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

export const CHECK_TYPE_EQUAL = 0
export const CHECK_TYPE_MORE_THEN = 1
export const CHECK_TYPE_LESS_THEN = 2
export const CHECK_TYPE_ANY = 3