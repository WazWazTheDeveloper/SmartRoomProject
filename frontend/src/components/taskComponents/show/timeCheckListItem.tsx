import { Delete, Edit } from "@mui/icons-material"
import cronstrue from 'cronstrue'

type TTimeCheckProps = {
    cronText: string
    onDeleteClick: () => void
    onEditClick: () => void
}
export function TimeCheckListItem(props: TTimeCheckProps) {
    return (
        <div className="w-full flex bg-neutral-300 dark:bg-darkNeutral-300">
            <div className="w-4/5 pl-2 pt-2 pb-2 flex justify-start items-center">
                <p className="w-full text-base">
                    {cronstrue.toString(props.cronText)}
                </p>
            </div>
            <div className="w-1/5 flex justify-end gap-1 pr-2 items-center">
                <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7 cursor-pointer' onClick={props.onEditClick} />
                <Delete className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7 cursor-pointer' onClick={props.onDeleteClick} />
            </div>
        </div>
    )
}