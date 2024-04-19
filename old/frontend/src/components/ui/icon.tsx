import { DeviceThermostat, FastForward, PowerSettingsNew } from "@mui/icons-material";
import DropdownMenu, { DropdownMenuItem } from "./dropdownMenu";

interface Props {
    iconName: string;
    className?: string;

}
export default function Icon(props: Props) {
    switch (props.iconName) {
        case 'DeviceThermostat':
            return <DeviceThermostat className={props.className} />
        case 'FastForward':
            return <FastForward className={props.className} />
        case 'PowerSettingsNew':
            return <PowerSettingsNew className={props.className} />
        default:
            return <></>
    }
}

// TODO: finish this

interface IconDropMenuProps {
    onChange: (iconName: string) => any
    currentIcon: string
}
export function IconDropMenu(props: IconDropMenuProps) {
    const icons = ["DeviceThermostat", "FastForward", "PowerSettingsNew"]

    let options: DropdownMenuItem[] = [
        {
            "itemTitle": <div className="cursor-pointer">
                <p className="text-sm font-medium w-15 text-left inline-block">{"none"}</p>
            </div>,
            "onClick": () => { props.onChange("") }
        }
    ];

    icons.map((val, index) => {
        options.push({
            "itemTitle": <div className="cursor-pointer">
                <Icon iconName={val} className="h-8 w-8"></Icon>
                <p className="text-sm font-medium w-15 text-left inline-block">{val}</p>
            </div>,
            "onClick": () => { props.onChange(val) }
        })
    })

    return (
        <DropdownMenu menuItems={options} titleElement={
            icons.includes(props.currentIcon) ?
                <div className="cursor-pointer">
                    <Icon iconName={props.currentIcon} className="h-8 w-8 fill-on-surface"></Icon>
                    <p className="text-sm font-medium text-on-surface w-15 text-left inline-block">{props.currentIcon}</p>
                </div> :
                <div className="w-8 h-8 bg-white"></div>
        } />
    )
}