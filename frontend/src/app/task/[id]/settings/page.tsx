'use client'

import Loading from "@/components/loading";
import useGetTask from "@/hooks/apis/tasks/useGetTask";
import usePostTaskID from "@/hooks/apis/tasks/usePostTaskID";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
    const router = useRouter()
    const updateTaskMutation = usePostTaskID(params.id)
    const taskQuery = useGetTask(params.id, [updateTaskMutation.data])
    function goToTask() {
        router.push(`/task/${params.id}`)
    }

    if (taskQuery.isLoading || taskQuery.isError) {
        <Loading />
    }

    return (
        <div className="pb-4">
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 px-2 pb-1 box-border sm:w-full sm:text-center flex justify-between items-center">
                <div className="flex justify-start items-center">
                    <ArrowBack className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 mr-2" onClick={goToTask} />
                    {/* {taskQuery.data?.taskName} */}
                </div>
            </div>
            <div className="flex w-full flex-wrap">
                < div className='flex justify-between items-center pl-2 pr-2 w-full sm:w-full sm:max-w-[52rem] sm:justify-center flex-wrap' >
                    <h2 className="text-base w-full font-bold">
                        task ID:
                    </h2>
                    <div className="flex justify-between items-center w-full">
                        <p className="pl-2">{params.id}</p>
                    </div>
                </div>
                < div className='flex justify-between items-center pl-2 pr-2 w-full sm:w-full sm:max-w-[52rem] sm:justify-center flex-wrap' >
                    <h2 className="text-base w-full font-bold">
                        task name:
                    </h2>
                    <div className="flex justify-between items-center w-full">
                        <p className="pl-2">{taskQuery.data?.taskName}</p>
                        <div>
                            <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}