import data = require('../handlers/file_handler')


interface PermissionRoleType {
    uuid:string;
    groupName:string;
    permission:Array<string>;
}

class PermissionRole{
    private uuid:string;
    private groupName:string;
    private permission:Array<string>;

    constructor(uuid:string,groupName:string, permission:Array<string>) {
        this.uuid = uuid;
        this.groupName = groupName;
        this.permission = permission;
    }

    async saveData() {
        console.log(`saveing PermissionRole object ${this.uuid}`)

        let dataJson: PermissionRoleType = this.getAsJson();

        await data.writeFile<PermissionRoleType>(`permissionRoles/${this.uuid}`, dataJson)
        console.log(`done saving PermissionRole object ${this.uuid}`)
    }

    getAsJson():PermissionRoleType {
        let dataJson: PermissionRoleType = {
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
    
    // IMPLEMENT
    addPermission() {

    }
    // IMPLEMENT
    removePermission() {

    }
}

export {PermissionRole}