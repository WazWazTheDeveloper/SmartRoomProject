'use client';
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { ApiService } from "@/services/apiService";

interface AcceptDeviceLineProps {
    id: string;
    deviceName: string;
    showDenyButton: boolean;
}
export function AcceptDeviceLine(props: AcceptDeviceLineProps) {
    const { fetchWithReauth } = useApi();
    const { userdata } = useAuth();


    function onAccept() {
        let body = {
            targetDevice: props.id,
            isAccepted: 1,
        };
        fetchWithReauth("/device/is_accepted", ApiService.REQUEST_PUT, userdata.token, body);
    }

    function onDeny() {
        let body = {
            targetDevice: props.id,
            isAccepted: -1,
        };
        fetchWithReauth("/device/is_accepted", ApiService.REQUEST_PUT, userdata.token, body);
    }

    function onDelete() {
        let delete_path = '/device/delete_device?uuid=' + props.id;
        fetchWithReauth(delete_path, ApiService.REQUEST_POST, userdata.token)
    }

    return (
        <>
            <div className="text-on-surface w-full">
                <p className="text-center text-lg">{props.deviceName}</p>
                <div className="w-full flex justify-around">
                    <button className="ring-1 ring-primary-varient rounded-md w-20 h-8 font-medium bg-green-500 hover:bg-green-800 cursor-pointer" onClick={onAccept}>Accept</button>
                    {props.showDenyButton ?
                        <button className="ring-1 ring-primary-varient rounded-md w-20 h-8 font-medium bg-red-500 hover:bg-red-800 cursor-pointer" onClick={onDeny}>Deny</button>
                        : <></>}
                    <button className="ring-1 ring-primary-varient rounded-md w-20 h-8 font-medium bg-red-900 hover:bg-red-950 cursor-pointer" onClick={onDelete}>Delete</button>
                </div>
            </div>
            <div className="w-full h-px bg-gray-700 my-3"></div>
        </>
    );
}
