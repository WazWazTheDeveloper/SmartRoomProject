import { Settings, SettingsType } from "./settings";
import data = require('../handlers/file_handler')
import { v4 as uuidv4 } from 'uuid';
import { AppData } from "../appData";
import { PermissionGroup } from "./permissionGroup";
import { error } from "console";
const bcrypt = require('bcrypt');

interface permissionData {
    type: number;
    name: string;
}

interface UserType {
    uuid: string;
    username: string;
    password: string;
    permission: Array<string>;
    permissionGroups: Array<string>
    settings: SettingsType;
    isActive: boolean;
    isAdmin: boolean;
}

class User {
    private uuid: string;
    private username: string;
    private password: string;
    private permission: Array<string>;
    private permissionGroups: Array<string>
    private settings: Settings;
    private isActive: boolean;
    private isAdmin: boolean;

    constructor(uuid: string, username: string, password: string, permission: Array<string>, permissionGroups: Array<string>, settings: Settings, isActive: boolean, isAdmin: boolean) {
        this.uuid = uuid;
        this.username = username;
        this.password = password;
        this.permission = permission;
        this.permissionGroups = permissionGroups;
        this.settings = settings;
        this.isActive = isActive;
        this.isAdmin = isAdmin;
    }

    static async createNewUser(username: string, password: string, isAdmin: boolean = false) {
        let uuid = uuidv4();
        let hashedPassword = await this.getHashedPassword(password);
        let newUser = new User(uuid, username, hashedPassword, [], [], new Settings(), true, isAdmin);

        let appDataInstance = await AppData.getAppDataInstance();
        appDataInstance.addUser(username)
        await newUser.saveData();

        return newUser
    }

    public static async getUser(username: string) {
        let _data: UserType = await data.readFile<UserType>(`users/${username}`)
        let user = await new User(_data.uuid, _data.username, _data.password, _data.permission, _data.permissionGroups, Settings.getFromJson(_data.settings), _data.isActive, _data.isAdmin);
        return user;
    }

    private async saveData() {
        console.log(`saveing user object ${this.uuid}`)

        let dataJson: UserType = this.getAsJson();
        await data.writeFile<UserType>(`users/${this.username}`, dataJson)
        console.log(`done saving user object ${this.uuid}`)
    }

    getAsJson(): UserType {
        let dataJson: UserType = {
            uuid: this.uuid,
            username: this.username,
            password: this.password,
            permission: this.permission,
            permissionGroups: this.permissionGroups,
            settings: this.settings.getAsJson(),
            isActive: this.isActive,
            isAdmin: this.isAdmin
        }

        return dataJson
    }

    private static async getHashedPassword(password: string) {
        const saltRounds = 10;
        let hash: string = await bcrypt.hash(password, saltRounds);
        return hash
    }

    async addPermission(newPermission: string) {
        //TODO add check for correct format
        this.permission.push(newPermission);
        await this.saveData()
        console.log("added permission: '" + newPermission + "' to user: '" + this.username + "'")
    }

    async removePermission(permission: string) {
        for (let index = 0; index < this.permission.length; index++) {
            const element = this.permission[index];
            if (element == permission) {
                this.permission.splice(index, 1)
                console.log("removed permission: '" + element + "' from user: '" + this.username + "'")
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
                console.log("removed permission: '" + element + "' from user: '" + this.username + "'")
            }
        }
    }

    removeTaskPermission(taskId: string) {
        for (let index = 0; index < this.permission.length; index++) {
            const element = this.permission[index];
            const permission = element.split(".");
            if (permission[0] == 'task' && permission[1] == taskId) {
                this.permission.splice(index, 1)
                console.log("removed permission: '" + element + "' from user: '" + this.username + "'")
            }
        }
    }

    getPermissions() {
        return this.permission;
    }

    async hasPermission(permission: string) {
        for (let index = 0; index < this.permission.length; index++) {
            const _permission = this.permission[index];
            if (_permission == permission) {
                return true;
            }
        }

        for (let index = 0; index < this.permissionGroups.length; index++) {
            const groupId = this.permissionGroups[index];
            const group = await PermissionGroup.getPermissionGroup(groupId)
            for (let index = 0; index < group.getPermissions().length; index++) {
                const _permission = group.getPermissions()[index];
                if (_permission == permission) {
                    return true;
                }
            }

        }
        return false;
    }

    getSettings(): Settings {
        return this.settings;

    }
    getUUID(): string {
        return this.uuid;

    }
    getUsername(): string {
        return this.username;

    }
    async setUsername(_username: string) {
        this.username = _username;
        await this.saveData();
    }
    getPassword(): string {
        return this.password;
    }
    async setPassword(newPass: string) {
        let hashedPass: string = await User.getHashedPassword(newPass)
        this.password = hashedPass

        await this.saveData();
    }
    getIsActive(): boolean {
        return this.isActive;
    }
    async setIsActive(_isActive: boolean) {
        this.isActive = _isActive;
        await this.saveData();
    }

    getIsAdmin(): boolean {
        return this.isAdmin;
    }
    async setIsAdmin(_isAdmin: boolean) {
        this.isAdmin = _isAdmin;
        await this.saveData();
    }

    async addGroup(groupId: string) {
        if (!PermissionGroup.getPermissionGroup(groupId)) {
            throw new Error("permission group not found")
        }

        this.permissionGroups.push(groupId)
        console.log("added group: '" + groupId + "' to user: '" + this.username + "'")
        await this.saveData();
    }

    async removeGroup(groupId: string) {
        for (let index = 0; index < this.permissionGroups.length; index++) {
            const group = this.permissionGroups[index];
            if (groupId == group) {
                this.permissionGroups.splice(index, 1)
                console.log("removed group: '" + group + "' from user: '" + this.username + "'")
            }
        }
        await this.saveData();
    }
}

export { User }
