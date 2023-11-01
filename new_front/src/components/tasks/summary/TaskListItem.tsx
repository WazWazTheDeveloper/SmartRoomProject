import SwitchButton from "@/components/ui/switchButton";
import { useApi } from "@/hooks/useApi";
import { useAppdata } from "@/hooks/useAppdata";
import { useAuth } from "@/hooks/useAuth";
import useDidMount from "@/hooks/useDidMount";
import { ApiService } from "@/services/apiService";
import { DeleteForever, Settings } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
    taskId: string
}

export default function TaskListItem(props: Props) {
    const router = useRouter()
    const { userdata } = useAuth();
    const { data, isLoading, isError, error, fetchWithReauth } = useApi();
    const [appdata, isAppdata] = useAppdata()
    const [isOn, setIsOn] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [isRepeating, setIsRepeating] = useState(true);
    const [triggerUpdate, setTriggerUpdate] = useState(false);

    function onButtonStateChange(e: boolean) {
        setIsOn(!isOn)
        setTriggerUpdate(!triggerUpdate);
    }

    function onSettingsClick() {
        router.push(`/tasks/${props.taskId}`)
    }

    // TODO: add a "are you sure massage"
    function onDeleteClick() {
        let body = {
            targetTask: props.taskId,
        }
        fetchWithReauth("/task/delete-task", ApiService.REQUEST_POST, userdata.token, body)
    }

    useEffect(() => {
        if (isAppdata) {
            let task = appdata.getTaskByUUID(props.taskId)
            setTaskName(task.taskName)
            setIsOn(task.isOn);
            setIsRepeating(task.isRepeating);
        }
    }, [appdata, isAppdata, props.taskId])

    useDidMount(() => {
        if (triggerUpdate) {
            let body = {
                targetTask: props.taskId,
                data: {
                    isOn: isOn
                }
            }
            fetchWithReauth("/task/update-task", ApiService.REQUEST_POST, userdata.token, body)
            setTriggerUpdate(false);
        }
    }, [triggerUpdate])

    return (
        <div className="relative w-full flex h-16 flex-wrap md:flex-nowrap justify-start items-center overflow-hidden bg-surface md:h-9">
            <div className="relative h-1/2 w-11/12 md:w-[70%] ml-2 flex item-center">
                <p className="
                leading-4 inline-block text-on-surface text-lg h-full w-full whitespace-nowrap text-ellipsis
                after:contents-[''] after:absolute after:m-auto overflow-hidden after:right-0 after:bottom-0 after:left-full after:w-px after:h-full 
                ">{taskName}</p>
            </div>
            <div className="flex justify-center h-1/2 w-full relative md:w-[30%] md:h-full md:justify-end items-center">
                <p className="relative text-center ml-2 mr-2 text-on-surface">{isRepeating ? "repeating" : "once"}</p>
                <SwitchButton state={isOn} stateChangeFunction={onButtonStateChange} />
                <Settings className="fill-on-surface ml-1 cursor-pointer" onClick={() => { onSettingsClick() }} />
                <DeleteForever className="fill-on-surface ml-1 cursor-pointer" onClick={() => { onDeleteClick() }} />

            </div>
        </div>
    )
}