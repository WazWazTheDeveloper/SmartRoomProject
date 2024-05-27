import { Close, Done } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { UseMutationResult } from "react-query"
import { isValidCron } from 'cron-validator'

type TAddTimeCheck = {
    updateTaskMutation: UseMutationResult<any, unknown, any[], unknown>
    onDone: () => void
    onClose: () => void
}
export function AddTimeCheck(props: TAddTimeCheck) {
    const [cronExpression, setCronExpression] = useState("");
    const [isValidExpression, setIsValidExpression] = useState(true);

    useEffect(() => {
        setIsValidExpression(isValidCron(cronExpression))
    }, [cronExpression])

    function onSubmitHandler() {
        if (!isValidCron(cronExpression)) return
        props.updateTaskMutation.mutate([{
            taskPropertyName: "timeChecks",
            operation: "add",
            timingData: cronExpression
        }])

        props.onDone()
    }


    return (
        <div className="w-full flex bg-neutral-300 dark:bg-darkNeutral-300">
            <div className="w-4/5 pl-2 pt-2 pb-2 flex justify-start items-center flex-wrap">
                <label htmlFor="checkType" className="mr-1 w-full">cron expression</label>
                <input
                    className={`w-full mr-1` + (isValidExpression ? " focus:outline-green-700" : " border border-red-700 border-solid focus:outline-red-700")}
                    type="text"
                    value={cronExpression}
                    onChange={(e) => { setCronExpression(e.target.value) }}
                />
            </div>
            <div className="w-1/5 flex justify-end gap-1 pr-2 items-center">
                <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7 cursor-pointer' onClick={onSubmitHandler} />
                <Close className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7 cursor-pointer' onClick={props.onClose} />
            </div>
        </div>
    )
}