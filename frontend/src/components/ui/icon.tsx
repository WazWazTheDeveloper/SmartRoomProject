import { DeviceThermostat, FastForward, PowerSettingsNew } from "@mui/icons-material";

interface Props {
    iconName: string;
    className: string;

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