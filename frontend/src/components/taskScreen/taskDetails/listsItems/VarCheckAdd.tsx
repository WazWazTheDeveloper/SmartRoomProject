import React, {useState } from 'react';
import styles from './varCheckAdd.module.css'
import {Check, Delete} from '@mui/icons-material';
import { useAppdata } from '../../../../hooks/useAppdata';
import { useAuth } from '../../../../hooks/useAuth';
import { useApi } from '../../../../hooks/useApi';
import { ApiService } from '../../../../services/apiService';
import { Button, Menu, MenuItem } from '@mui/material';

function MenuWarpIdSelect(props: any) {
    const [appdata, isAppdata] = useAppdata();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (selectedId: string) => {
        setAnchorEl(null);
        props.setSelectedId(selectedId)
    };

    let menuItems: React.JSX.Element[] = []
    if (isAppdata) {
        let ids = appdata.getAllDeviceId();
        for (let index = 0; index < ids.length; index++) {
            const id = ids[index];
            menuItems.push(<MenuItem onClick={() => { handleClose(id) }}>{id}</MenuItem>)
        }
    }

    return (
        <>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {props.selectedId}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => { handleClose("please select device") }}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems}
            </Menu>
        </>
    )
}

function MenuWarpAtSelect(props: any) {
    const [appdata, isAppdata] = useAppdata();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (selectedId: string) => {
        setAnchorEl(null);
        props.setSelectedAt(Number(selectedId))
    };

    let menuItems: React.JSX.Element[] = []
    if (isAppdata) {
        try {
            let device = appdata.getDeviceByUUID(props.selectedId);
            for (let index = 0; index < device.deviceData.length; index++) {
                menuItems.push(<MenuItem onClick={() => { handleClose(`${index}`) }}>{`[${index}]`}</MenuItem>)
            }
        } catch (err) { }
    }

    return (
        <>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {props.selectedAt}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => { handleClose("please select device") }}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems}
            </Menu>
        </>
    )
}

function MenuWarpVarNameSelect(props: any) {
    const [appdata, isAppdata] = useAppdata();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (selectedVarName: string) => {
        setAnchorEl(null);
        props.setSelectedVarName(selectedVarName)
    };

    let menuItems: React.JSX.Element[] = []
    if (isAppdata) {
        try {
            let deviceData = appdata.getDeviceByUUID(props.selectedId).deviceData[props.selectedAt].data;
            let keys = Object.keys(deviceData)
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index]
                menuItems.push(<MenuItem onClick={() => { handleClose(key) }}>{key}</MenuItem>)
            }
        } catch (err) { }
    }

    return (
        <>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {props.selectedVarName}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => { handleClose("please select device") }}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems}
            </Menu>
        </>
    )
}

function MenuWarpCheckType(props: any) {
    const [appdata, isAppdata] = useAppdata();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (selectedVarName: number) => {
        setAnchorEl(null);
        props.setCheckType(selectedVarName)
    };

    let menuItems: React.JSX.Element[] = []
    menuItems.push(<MenuItem onClick={() => { handleClose(0) }}>{"CHECK_EQUAL_TO"}</MenuItem>)
    menuItems.push(<MenuItem onClick={() => { handleClose(1) }}>{"CHECK_GREATER_THAN"}</MenuItem>)
    menuItems.push(<MenuItem onClick={() => { handleClose(2) }}>{"CHECK_LESS_THAN"}</MenuItem>)


    return (
        <>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {props.checkType}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => { handleClose(0) }}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems}
            </Menu>
        </>
    )
}

let CHECK_EQUAL_TO: number = 0
let CHECK_GREATER_THAN: number = 1
let CHECK_LESS_THAN: number = 2

interface props {
    id:string | undefined
    onDeleteFunction : Function
}

function VarCheckAdd(props: props) {
    const [userdata] = useAuth();
    const [data, isLoading, isError, error, fetchWithReauth, refreshToken] = useApi("/task/add-var-check", ApiService.REQUEST_POST);

    const [selectedId, setSekectedId] = useState("please select device");
    const [selectedAt, setSelectedAt] = useState("please select data at");
    const [selectedVarName, setSelectedVarName] = useState("please select varName");
    const [checkType, setCheckType] = useState(0);
    const [compatreTo, setCompateTo] = useState<any>();

    function handleCompatreToInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCompateTo(e.target.value)
    }

    function onSubmit() {
        let body={
            targetTask:props.id,
            deviceId:selectedId,
            dataIndex:selectedAt,
            varName:selectedVarName,
            checkType:checkType,
            valueToCompareTo:compatreTo
        }
        fetchWithReauth(userdata.token,body)
        props.onDeleteFunction()
    }
    return (
        <div className={styles.var_check}>
            <div className={styles.var_check_attributes}>
                <p>check</p>
                <MenuWarpIdSelect selectedId={selectedId} setSelectedId={setSekectedId} />
                <p>at</p>
                <MenuWarpAtSelect selectedId={selectedId} selectedAt={selectedAt} setSelectedAt={setSelectedAt} />
                <p>if</p>
                <MenuWarpVarNameSelect selectedId={selectedId} selectedAt={selectedAt} selectedVarName={selectedVarName} setSelectedVarName={setSelectedVarName} />
                <MenuWarpCheckType checkType={checkType} setCheckType={setCheckType} />
                <input className={styles.var_check_add_input} type='text' onChange={handleCompatreToInputChange} value={compatreTo}/>
            </div>
            <div className={styles.var_check_options}>
                <Check className={styles.attribute_icon} onClick={onSubmit} />
                <Delete className={styles.attribute_icon} onClick={() => {props.onDeleteFunction()}}/>
            </div>
        </div>
    )
}

export default VarCheckAdd