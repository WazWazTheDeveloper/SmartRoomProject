'use client';

import TaskListItem from "@/components/tasks/summary/TaskListItem";
import { useApi } from "@/hooks/useApi";
import { useAppdata } from "@/hooks/useAppdata";
import { useAuth } from "@/hooks/useAuth";
import { ApiService } from "@/services/apiService";
import { Add } from "@mui/icons-material";
import { ReactNode, useEffect, useState } from "react";

export default function Tasks() {
    const [appdata, isAppdata] = useAppdata()
    const { userdata } = useAuth();
    const { data, isLoading, isError, error, fetchWithReauth } = useApi();
    const [taskList,setTaskList] = useState<ReactNode>([])

    useEffect(() => {
        if(isAppdata) {
            let _taskList = [];
            let taskList = appdata.getTaskList()
            for (let index = 0; index < taskList.length; index++) {
                const taskId = taskList[index].taskId;
                _taskList.push(<TaskListItem taskId={taskId} key={index}/>)
            }

            setTaskList(_taskList)
        }
    }, [isAppdata, appdata])

    function onAddClick(e: React.MouseEvent<SVGSVGElement>) {
        fetchWithReauth("/task/create-task", ApiService.REQUEST_POST,userdata.token);
    }

    return (
        <div className="w-full md:w-4/5 m-auto flex flex-wrap content-start justify-center">
            <div className="w-full flex justify-between bg-surface items-center">
                <p className="text-on-surface text-center text-3xl ml-1 underline">
                    Tasks
                </p>
                <div className="w-12 h-12 mt-1 mb-1 flex flex-row-reverse">
                    <Add className="w-12 h-12 fill-on-surface cursor-pointer"
                        onClick={onAddClick} />
                </div>
            </div>

            <div className="w-full flex justify-center">
                <div className={"w-full flex flex-wrap gap-1"}>
                    {taskList}
                </div>
            </div>
        </div>

    )
}