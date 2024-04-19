export interface GeneralDataType {
    topicList : Array<GeneralTopicType>
    deviceList : Array<DeviceListItemType>
    taskList : Array<GeneralTaskType>
    usernameList: Array<string>
    permissionGroup: Array<GeneralPermissionGroupType>;
}

export interface GeneralTopicType {
    topicName: string
    topicPath: string
    isVisible:boolean
}


export interface DeviceListItemType{
    UUID: string
    name: string
    deviceType: Array<number>
}
export interface GeneralTaskType {
    taskId : string
}

export interface GeneralPermissionGroupType {
    groupId : string
    groupName : string
}