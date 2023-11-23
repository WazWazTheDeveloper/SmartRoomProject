import { v4 as uuidv4 } from 'uuid';
import data = require('../handlers/file_handler')
import { AppData } from '../appData';


interface PermissionGroupType {
    uuid:string;
    groupName:string;
    permission:Array<string>;
}

class PermissionGroup{
    private uuid:string;
    private groupName:string;
    private permission:Array<string>;

    constructor(uuid:string,groupName:string, permission:Array<string>) {
        this.uuid = uuid;
        this.groupName = groupName;
        this.permission = permission;
    }

    static async createNewPermissionGroup(groupName:string) {
        let uuid = uuidv4();

        let newPermissionGroup = new PermissionGroup(uuid, groupName, []);

        let appDataInstance = await AppData.getAppDataInstance();
        appDataInstance.addPermissionGroup(uuid,groupName)
        await newPermissionGroup.saveData();

        return newPermissionGroup
    }

    static async removePermissionGroup(groupId:string) {
        let appDataInstance = await AppData.getAppDataInstance();
        appDataInstance.removePermissionGroup(groupId)
        await data.removeFile(`permissionGroups/${groupId}`)
    }

    public static async getPermissionGroup(groupId: string) {
        let _data: PermissionGroupType = await data.readFile<PermissionGroupType>(`permissionGroups/${groupId}`)
        let permissionGroup = await new PermissionGroup(_data.uuid, _data.groupName, _data.permission);
        return permissionGroup;
    }

    async saveData() {
        console.log(`saveing PermissionGroup object ${this.uuid}`)

        let dataJson: PermissionGroupType = this.getAsJson();

        await data.writeFile<PermissionGroupType>(`permissionGroups/${this.uuid}`, dataJson)
        console.log(`done saving PermissionGroup object ${this.uuid}`)
    }

    getAsJson():PermissionGroupType {
        let dataJson: PermissionGroupType = {
            uuid: this.uuid,
            groupName: this.groupName,
            permission: this.permission
        }
        
        return dataJson
    }

    getGroupName():string {
        return this.groupName;
    }

    async setGroupName(_groupName:string) {
        this.groupName = _groupName;
        await this.saveData()
    }    
    
    getUUID():string {
        return this.uuid;
    }

    getPermissions():string[] {
        return this.permission;
    }
    
    async addPermission(newPermission : string) {
        this.permission.push(newPermission);
        await this.saveData()
        console.log("added permission: '"+newPermission +"' to group: '" + this.groupName + "'")
    }

    async removePermission(permission: string) {
        for (let index = 0; index < this.permission.length; index++) {
            const element = this.permission[index];
            if(element == permission) {
                this.permission.splice(index, 1)
                console.log("removed permission: '"+element +"' from group: '" + this.groupName + "'")
            }
        }
        await this.saveData()
    }

    removeDevicePermission(deviceID: string) {
        for (let index = 0; index < this.permission.length; index++) {
            const element = this.permission[index];
            const permission = element.split(".");
            if (permission[0] == 'device' && permission[1] == deviceID) {
                this.permission.splice(index, 1)
                console.log("removed permission: '" + element + "' from group: '" + this.groupName + "'")
            }
        }
    }

    removeTaskPermission(taskId: string) {
        for (let index = 0; index < this.permission.length; index++) {
            const element = this.permission[index];
            const permission = element.split(".");
            if (permission[0] == 'task' && permission[1] == taskId) {
                this.permission.splice(index, 1)
                console.log("removed permission: '" + element + "' from group: '" + this.groupName + "'")
            }
        }
    }

}

export {PermissionGroup}
