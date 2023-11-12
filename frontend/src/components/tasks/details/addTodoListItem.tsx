import DropdownMenu from "@/components/ui/dropdownMenu";
import { useApi } from "@/hooks/useApi";
import { useAppdata } from "@/hooks/useAppdata";
import { useAuth } from "@/hooks/useAuth";
import { ApiService } from "@/services/apiService";
import { Check, Delete } from "@mui/icons-material"
import { useState } from "react";

interface AddToCheckListItemProps {
    id: string | undefined
    onDeleteFunction: Function
}

export default function AddTodoListItem(props: AddToCheckListItemProps) {
    const [appdata, isAppdata] = useAppdata();
    const { userdata } = useAuth();
    const { data, isLoading, isError, error, fetchWithReauth } = useApi();

    const [selectedId, setSekectedId] = useState("please select device");
    const [selectedAt, setSelectedAt] = useState(0);
    const [selectedVarName, setSelectedVarName] = useState("please select varName");
    const [compatreTo, setCompateTo] = useState<any>("");

    function onSubmit() {
        let body={
            targetTask:props.id,
            deviceId:selectedId,
            dataIndex:selectedAt,
            varName:selectedVarName,
            changeTo:compatreTo
        }
        console.log(body)
        fetchWithReauth("/task/todo", ApiService.REQUEST_POST,userdata.token,body)
        props.onDeleteFunction()
    }

    let deviceName;
    try {
        deviceName = appdata.getDeviceByUUID(selectedId).deviceName;
    } catch (err) {
        deviceName = "please select device"
    }

    const selectIdTitle =
        (<div className="md:h-10 md:w-48 flex items-center justify-center ring-1">
            {deviceName}
        </div>);

    function createSelectIdTile() {
        if (isAppdata) {
            let _selectIdTiles = []
            let _ids = appdata.getAllDeviceId();
            for (let index = 0; index < _ids.length; index++) {
                const _id = _ids[index];
                _selectIdTiles.push({
                    "itemTitle": appdata.getDeviceByUUID(_id).deviceName,
                    "onClick": () => { setSekectedId(_id) }
                })
            }

            return _selectIdTiles;
        }
        return []
    }

    const selectAtTitle =
        (<div className="md:h-10 px-2 flex items-center justify-center ring-1">
            {selectedAt}
        </div>);

    function createSelectAtTile() {
        if (isAppdata) {
            if (selectedId == "please select device") {
                return []
            }
            let _selectIdTiles = []
            let device = appdata.getDeviceByUUID(selectedId);
            for (let index = 0; index < device.deviceData.length; index++) {
                _selectIdTiles.push({
                    "itemTitle": (index + ""),
                    "onClick": () => { setSelectedAt(index) }
                })
            }

            return _selectIdTiles;
        }
        return []
    }

    const selectVarTitle =
        (<div className="md:h-10 px-2 flex items-center justify-center ring-1">
            {selectedVarName}
        </div>);

    function createSelectVarTile() {
        if (isAppdata) {
            if (selectedId == "please select device") {
                return []
            }
            let _selectVarTiles = []
            let deviceData = appdata.getDeviceByUUID(selectedId).deviceData[selectedAt].data;
            let keys = Object.keys(deviceData)
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index]
                _selectVarTiles.push({
                    "itemTitle": (key),
                    "onClick": () => { setSelectedVarName(key) }
                })
            }

            return _selectVarTiles;
        }
        return []
    }

    function handleTextChane(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        setCompateTo(e.currentTarget.value);
    }

    return (
        <div className="w-full flex justify-between ml-5 text-on-surface">
            <div className="flex justify-start gap-x-2.5 items-center">
                <p>change at</p>
                <DropdownMenu
                    menuItems={createSelectIdTile()}
                    titleElement={selectIdTitle}
                />
                <p>at</p>
                <DropdownMenu
                    menuItems={createSelectAtTile()}
                    titleElement={selectAtTitle}
                />
                <p>set</p>
                <DropdownMenu
                    menuItems={createSelectVarTile()}
                    titleElement={selectVarTitle}
                />
                <p>to</p>
                <input type="text" value={compatreTo} id="medium-input" onChange={handleTextChane} className="max-w-[25%] block w-full p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <div className="flex gap-x-2.5 items-center">
                <Check className="fill-on-surface h-6 w-6 cursor-pointer" onClick={onSubmit} />
                <Delete className="fill-on-surface h-6 w-6 cursor-pointer" onClick={() => { props.onDeleteFunction() }} />
            </div>
        </div>
    )
}