export interface JWTData {
    userInfo: {
        username: string
        permission: string[]
        isAdmin: boolean
    }
}