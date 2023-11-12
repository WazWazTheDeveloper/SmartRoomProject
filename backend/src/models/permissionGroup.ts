import data = require('../handlers/file_handler')


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

    async saveData() {
        console.log(`saveing PermissionGroup object ${this.uuid}`)

        let dataJson: PermissionGroupType = this.getAsJson();

        await data.writeFile<PermissionGroupType>(`permissionGroup/${this.uuid}`, dataJson)
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
    
    // IMPLEMENT
    addPermission() {

    }
    // IMPLEMENT
    removePermission() {

    }
}

export {PermissionGroup}
