import { getTime } from "date-fns";
import { updateDocument } from "./mongoDBService";

export async function updateLastActive(userID:string): Promise<boolean> {
    try {
        const time = getTime(new Date());
        const filter = {
            _id: userID,
        }
        const updateFilter = {
            $set: { lastActiveDate: time }
        }
        
        await updateDocument("users", filter, updateFilter)
        return true
    }
    catch(e) {
        return false
    }
}