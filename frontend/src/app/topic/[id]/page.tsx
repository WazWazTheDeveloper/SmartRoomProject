'use client'

import Loading from "@/components/loading";
import { useGetTopic } from "@/hooks/apis/topics/useGetTopic"
import { usePatchTopicID } from "@/hooks/apis/topics/usePatchTopicID";
import { MULTI_STATE_BUTTON_TYPE, NUMBER_TYPE, SWITCH_TYPE } from "@/interfaces/device.interface";
import { ArrowBack, Done, Edit } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
    const [isEditTopidName, setIsEditTopidName] = useState(false);
    const [newTopicName, setNewTopicName] = useState("")

    const [isEditTopidPath, setIsEditTopidPath] = useState(false);
    const [newTopicPath, setNewTopicPath] = useState("")

    const router = useRouter()
    const updateTopicMutation = usePatchTopicID(params.id);
    const topicQuery = useGetTopic(params.id, [updateTopicMutation.data]);

    function onGoBackHandler() {
        router.push(`/topic/`)
    }

    if (topicQuery.isLoading || topicQuery.isError) {
        <Loading />
    }

    function onOpenEditNameHandler() {
        if (!topicQuery.data?.topicName) return

        setNewTopicName(topicQuery.data?.topicName)
        setIsEditTopidName(true)
    }

    function onDoneEditNameHabdler() {
        updateTopicMutation.mutate([{
            propertyName: "topicName",
            newValue: newTopicName
        }])
        setIsEditTopidName(false)
    }

    function onOpenEditPathHandler() {
        if (!topicQuery.data?.topicName) return

        setNewTopicPath(topicQuery.data?.path)
        setIsEditTopidPath(true)
    }

    function onDoneEditPathHabdler() {
        updateTopicMutation.mutate([{
            propertyName: "path",
            newValue: newTopicPath
        }])
        setIsEditTopidPath(false)
    }

    return (
        <>
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 px-2 pb-1 box-border sm:w-full sm:text-center flex justify-between items-center">
                <div className="flex justify-start items-center">
                    <ArrowBack className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 mr-2 cursor-pointer" onClick={onGoBackHandler} />
                </div>
            </div>
            <div className="flex w-full flex-wrap">
                < div className='flex justify-between items-center pl-2 pr-2 w-full sm:justify-center flex-wrap' >
                    <h2 className="text-base w-full font-bold">
                        topic ID:
                    </h2>
                    <div className="flex justify-between items-center w-full">
                        <p className="pl-2">{params.id}</p>
                    </div>
                </div>
                < div className='flex justify-between items-center pl-2 pr-2 w-full sm:justify-center flex-wrap' >
                    <div className="w-full">
                        <h2 className="text-base font-bold">
                            Type type:
                        </h2>
                        <div className="flex justify-between items-center">
                            {topicQuery.data?.topicType ?
                                <p className="pl-2">{getTypeOfTopic(topicQuery.data?.topicType)}</p> : <></>
                            }
                        </div>
                    </div>
                </div>
                < div className='flex justify-between items-center pl-2 pr-2 w-full sm:justify-center flex-wrap' >
                    <h2 className="text-base w-full font-bold">
                        Topic name:
                    </h2>
                    {
                        isEditTopidName ?
                            <div className="flex justify-between items-center w-full">
                                <input
                                    className="pl-2 w-full"
                                    value={newTopicName}
                                    onChange={(e) => { setNewTopicName(e.target.value) }} />
                                <div>
                                    <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onDoneEditNameHabdler} />
                                </div>
                            </div> :
                            <div className="flex justify-between items-center w-full">
                                <p className="pl-2">{topicQuery.data?.topicName}</p>
                                <div>
                                    <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onOpenEditNameHandler} />
                                </div>
                            </div>
                    }
                </div>
                < div className='flex justify-between items-center pl-2 pr-2 w-full sm:justify-center flex-wrap' >
                    <h2 className="text-base w-full font-bold">
                        Topic path:
                    </h2>
                    {
                        isEditTopidPath ?
                            <div className="flex justify-between items-center w-full">
                                <textarea
                                    className="pl-2 w-full text-wrap"
                                    value={newTopicPath}
                                    onChange={(e) => { setNewTopicPath(e.target.value.replace(/[^A-Za-z0-9_/-\s]/g, '')) }} />
                                <div>
                                    <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onDoneEditPathHabdler} />
                                </div>
                            </div> :
                            <div className="flex justify-between items-center w-full">
                                <p className="pl-2">{topicQuery.data?.path}</p>
                                <div>
                                    <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onOpenEditPathHandler} />
                                </div>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}

export function getTypeOfTopic(topicType: number) {
    switch (topicType) {
        case -1:
            return "any"
        case SWITCH_TYPE:
            return "boolean"
        case NUMBER_TYPE:
            return "number"
        case MULTI_STATE_BUTTON_TYPE:
            return "number"
        default:
            throw "unknown topicType"
    }
}