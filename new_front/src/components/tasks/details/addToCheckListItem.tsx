import DropdownMenu, { DropdownMenuItem } from "@/components/ui/dropdownMenu";
import { useApi } from "@/hooks/useApi";
import { useAppdata } from "@/hooks/useAppdata";
import { useAuth } from "@/hooks/useAuth";
import { ApiService } from "@/services/apiService";
import { Check, Delete } from "@mui/icons-material"
import { useEffect, useState } from "react";

interface AddToCheckListItemProps {
    id: string | undefined
    onDeleteFunction: Function
}
export default function AddToCheckListItem(props: AddToCheckListItemProps) {
    const [appdata, isAppdata] = useAppdata();
    const { userdata } = useAuth();
    const { data, isLoading, isError, error, fetchWithReauth } = useApi();

    const [selectedId, setSekectedId] = useState("please select device");
    const [selectedAt, setSelectedAt] = useState(0);
    const [selectedVarName, setSelectedVarName] = useState("please select varName");
    const [checkType, setCheckType] = useState(0);
    const [compatreTo, setCompateTo] = useState<any>("");

    const [selectIdTiles, setSelectIdTiles] = useState<DropdownMenuItem[]>([]);
    const [selectAtTiles, setSelectAtTiles] = useState<DropdownMenuItem[]>([]);
    const [selectVarTiles, setSelectVarTiles] = useState<DropdownMenuItem[]>([]);

    function onSubmit() {
        let body = {
            targetTask: props.id,
            deviceId: selectedId,
            dataIndex: selectedAt,
            varName: selectedVarName,
            checkType: checkType,
            valueToCompareTo: compatreTo
        }
        fetchWithReauth("/task/add-var-check", ApiService.REQUEST_POST, userdata.token, body)
        props.onDeleteFunction()
    }

    function handleCompatreToInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCompateTo(e.target.value)
    }

    const selectIdTitle =
        (<div className="md:h-10 md:w-48 flex items-center justify-center ring-1">
            {selectedId}
        </div>);

    function createSelectIdTile() {
        if (isAppdata) {
            let _selectIdTiles = []
            let _ids = appdata.getAllDeviceId();
            for (let index = 0; index < _ids.length; index++) {
                const _id = _ids[index];
                // TODO: chenge to device name *
                _selectIdTiles.push({
                    "itemTitle": _id,
                    "onClick": () => { setSekectedId(_id) }
                })
            }

            setSelectIdTiles(_selectIdTiles);
        }
    }

    const selectAtTitle =
        (<div className="md:h-10 px-2 flex items-center justify-center ring-1">
            {selectedAt}
        </div>);

    function createSelectAtTile() {
        if (isAppdata) {
            if (selectedId == "please select device") {
                return
            }
            let _selectIdTiles = []
            let device = appdata.getDeviceByUUID(selectedId);
            for (let index = 0; index < device.deviceData.length; index++) {
                _selectIdTiles.push({
                    "itemTitle": (index + ""),
                    "onClick": () => { setSelectedAt(index) }
                })
            }

            setSelectAtTiles(_selectIdTiles);
        }
    }

    const selectVarTitle =
        (<div className="md:h-10 px-2 flex items-center justify-center ring-1">
            {selectedVarName}
        </div>);

    function createSelectVarTile() {
        if (isAppdata) {
            if (selectedId == "please select device") {
                return
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

            setSelectVarTiles(_selectVarTiles);
        }
    }

    let checkTypeString = ""
    switch (checkType) {
        case 0:
            checkTypeString = "EQUAL TO";
            break;
        case 1:
            checkTypeString = "GREATER THEN";
            break;
        case 2:
            checkTypeString = "LESS THEN";
            break;
    }

    const selectCheckTypeTitle =
        (<div className="md:h-10 px-2 flex items-center justify-center ring-1">
            {checkTypeString}
        </div>);

    const selectCheckTypeTiles = [
        {
            "itemTitle": "EQUAL TO",
            "onClick": () => { setCheckType(0) }
        }, {
            "itemTitle": "GREATER THEN",
            "onClick": () => { setCheckType(1) }
        }, {
            "itemTitle": "LESS THEN",
            "onClick": () => { setCheckType(2) }
        }
    ]

    useEffect(() => {
        createSelectIdTile();
    }, [appdata, isAppdata])

    useEffect(() => {
        createSelectAtTile();
        createSelectVarTile();
    }, [appdata, isAppdata, selectedId])

    return (
        <div className="w-full flex justify-between ml-5 text-on-surface">
            <div className="flex justify-start gap-x-2.5 items-center">
                <p>check</p>
                <DropdownMenu
                    menuItems={selectIdTiles}
                    titleElement={selectIdTitle}
                />
                <p>at</p>
                <DropdownMenu
                    menuItems={selectAtTiles}
                    titleElement={selectAtTitle}
                />
                <p>if</p>
                <DropdownMenu
                    menuItems={selectVarTiles}
                    titleElement={selectVarTitle}
                />
                <DropdownMenu
                    menuItems={selectCheckTypeTiles}
                    titleElement={selectCheckTypeTitle}
                />
                <input className="text-on-surface bg-surface ring-1" type='text' onChange={handleCompatreToInputChange} value={compatreTo}/>
            </div>
            <div className="flex gap-x-2.5 items-center">
                <Check className="fill-on-surface h-6 w-6 cursor-pointer" onClick={onSubmit} />
                <Delete className="fill-on-surface h-6 w-6 cursor-pointer" onClick={() => { props.onDeleteFunction() }} />
            </div>
        </div>
    )
}