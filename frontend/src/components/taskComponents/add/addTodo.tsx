import { Close, Done } from "@mui/icons-material"
import { UseMutationResult } from "react-query"

type TAddTimeCheck = {
    updateTaskMutation: UseMutationResult<any, unknown, any[], unknown>
    onDone: () => void
    onClose: () => void
}
export function AddTodo(props: TAddTimeCheck) {

    function onSubmitHandler() {
        
        props.onDone()
    }

    return (
        <div className="w-full flex bg-neutral-300 dark:bg-darkNeutral-300">
            <div className="w-4/5 pl-2 pt-2 pb-2 flex justify-start items-center">
            </div>
            <div className="w-1/5 flex justify-end gap-1 pr-2 items-center">
                <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7' onClick={onSubmitHandler} />
                <Close className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7' onClick={props.onClose} />
            </div>
        </div>
    )
}