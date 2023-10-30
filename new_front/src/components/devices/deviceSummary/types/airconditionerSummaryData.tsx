export default function AirconditionerSummaryData(props: any) {
    return (
        <div className="relative flex flex-wrap w-full h-full text-on-surface">
            <p className="relative w-full h-1/5 text-center md:text-lg text-xs font-semibold">{props.data.isOn ? "ON" : "OFF"}</p>
            <div className="relative w-1/2 h-4/5 flex flex-wrap">
                <div className="relative w-full flex items-center content-cente">
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">{"Mode: "}</p>
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">{props.data.mode}</p>
                </div>
                <div className="relative w-full flex items-center content-center">
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">{"Swing 1: "}</p>
                    <p className={"relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none " + (props.data.swing1 ? "text-green-500" : "text-red-500")}>{props.data.swing1 ? "ON" : "OFF"}</p>
                </div>
                <div className="relative w-full flex items-center content-center">
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">{"Timer: "}</p>
                    {/* add the color for time as well */}
                    <p className={"relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none " + (( props.data.timer > 0) ? "text-green-500" : "text-red-500")}>{props.data.timer}</p>
                </div>
                <div className="relative w-full flex items-center content-center">
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">{"Health: "}</p>
                    <p className={"relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none " + (props.data.isHealth ? "text-green-500" : "text-red-500")}>{props.data.isHealth ? "ON" : "OFF"}</p>
                </div>
                <div className="relative w-full flex items-center content-center">
                    {/* this is just empty line */}
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">‏‏‎ ‎</p>
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">‏‏‎ ‎</p>
                </div>
            </div>
            <div className="relative w-1/2 h-4/5 flex flex-wrap">
                <div className="relative w-full flex items-center content-center">
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">{"Speed: "}</p>
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">{props.data.speed}</p>
                </div>
                <div className="relative w-full flex items-center content-center">
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">{"Swing 2: "}</p>
                    <p className={"relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none " + (props.data.swing2 ? "text-green-500" : "text-red-500")}>{props.data.swing2 ? "ON" : "OFF"}</p>
                </div>
                <div className="relative w-full flex items-center content-center">
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">{"Sleep:"}</p>
                    <p className={"relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none " + (props.data.isSleep ? "text-green-500" : "text-red-500")}>{props.data.isSleep ? "ON" : "OFF"}</p>
                </div>
                <div className="relative w-full flex items-center content-center">
                    {/* this is just empty line */}
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">‏‏‎ ‎</p>
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">‏‏‎ ‎</p>
                </div>
                <div className="relative w-full flex items-center content-center">
                    {/* this is just empty line */}
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">‏‏‎ ‎</p>
                    <p className="relative inline-block text-[0.45rem] md:text-[0.95rem] !leading-none">‏‏‎ ‎</p>
                </div>
            </div>
        </div>
    )
}