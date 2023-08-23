import { PermissionGroup } from "./permissionGroup";
import { PermissionRole } from "./permissionRole";
import { Settings, SettingsType } from "./settings";
import data = require('../handlers/file_handler')
import { v4 as uuidv4 } from 'uuid';
const bcrypt = require('bcrypt');

interface permissionData {
    type : number;
    name : string;
}

interface UserType {
    uuid:string;
    username:string;
    password:string;
    permission:Array<permissionData>; 
    settings:SettingsType;
    isActive:boolean;
}

class User {
    private uuid:string;
    private username:string;
    private password:string;
    private permission:Array<permissionData>; 
    private settings:Settings;
    private isActive:boolean;

    constructor( uuid:string ,  username:string,password:string,permission:Array<permissionData>,settings:Settings,isActive:boolean) {
        this.uuid = uuid;
        this.username = username;
        this.password = password;
        this.permission = permission;
        this.settings = settings;
        this.isActive = isActive;
    }

    static async createNewUser(username:string,password:string){
        let uuid = uuidv4();
        let hashedPassword = await this.getHashedPassword(password);
        let newUser = new User(uuid,username,hashedPassword,[],new Settings(),true);

        await newUser.saveData();
    }

    public static async getUser(username:string) {
        let _data:UserType= await data.readFile<UserType>(`users/${username}`)
        let user = await new User(_data.uuid,_data.username,_data.password,_data.permission,Settings.getFromJson(_data.settings),_data.isActive);
        return user;
    }

    private async saveData() {
        console.log(`saveing user object ${this.uuid}`)

        let dataJson: UserType = this.getAsJson();

        await data.writeFile<UserType>(`users/${this.username}`, dataJson)
        console.log(`done saving user object ${this.uuid}`)
    }

    getAsJson():UserType {
        let dataJson: UserType = {
            uuid: this.uuid,
            username: this.username,
            password: this.password,
            permission: this.permission,
            settings: this.settings.getAsJson(),
            isActive: this.isActive
        }

        return dataJson
    }

    private static async getHashedPassword(password:string) {
        const saltRounds = 10;
        let hash:string = await bcrypt.hash(password, saltRounds);
        return hash
    }
    
    // IMPLEMENT
    addPermission() {
        
    }
    // IMPLEMENT
    removePermission() {
        
    }

    // IMPLEMENT
    getPermissions() {
        return this.permission;
    }

    getSettings():Settings{
        return this.settings;
        
    }    
    getUUID():string{
        return this.uuid;
        
    }
    getUsername():string {
        return this.username;

    }
    async setUsername(_username:string){
        this.username = _username;
        await this.saveData();
    }
    getPassword():string {
        return this.password;
    }
    async setPassword(newPass:string){
        let hashedPass:string = await User.getHashedPassword(newPass)
        this.password = hashedPass

        await this.saveData();
    }
    getIsActive():boolean {
        return this.isActive;
    }
    async setIsActive(_isActive:boolean){
        this.isActive = _isActive;
        await this.saveData();
    }
}

export {User}
