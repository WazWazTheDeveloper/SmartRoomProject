
interface props {
    data: {
        isOn: boolean
        onName:string
        offName:string
    }
}

export default function SwitchSummaryData(props: props) {
    return (
        <div className="relative flex flex-wrap w-full h-full text-on-surface">
            <p className="relative w-full h-1/5 text-center md:text-lg text-xs font-semibold">{props.data.isOn ? props.data.onName : props.data.offName}</p>
        </div>

    )
}