import { Close } from "@mui/icons-material"
import { propagateServerField } from "next/dist/server/lib/render-server"

interface props {
    isOpen: boolean
    onClose: Function
    title: string
    children: React.ReactNode
    closeButton?: boolean
    className?: string
}
export default function PopupWindow({  onClose, title, children,className="",isOpen, closeButton = true }: props) {
    return (
        <div
            tabIndex={-1}
            aria-hidden="true"
            className={"fixed top-0 left-0 pl-11 pt-11 md:pl-24 md:pt-12 right-0 z-50 w-screen overflow-x-hidden overflow-y-auto h-full max-h-full flex justify-center items-center " + (isOpen ? "" : "hidden")}>
            <div className="w-4/5 bg-surface rounded-2xl border-primary-varient border-solid border-2">
                <div className="relative w-full h-16 flex">
                    <p className="text-on-surface w-full h-full pl-2 flex items-center text-sm overflow-hidden whitespace-nowrap text-ellipsis md:text-2xl">{title}</p>
                    <div className={"flex justify-end w-fit" + (!closeButton ? " hidden" : "")}>
                        <Close className="fill-on-surface m-2 w-12 h-12 cursor-pointer" onClick={() => { onClose() }} />
                    </div>
                </div>
                <div className={"w-full "+className}>
                    {children}
                </div>
            </div>
        </div>
    )
}