export type TUserSettings = {
    isDarkmode: boolean
    favoriteDevices: TFavoriteDevice[]
}

export type TFavoriteDevice = {
    deviceID: string
    place: number
}
