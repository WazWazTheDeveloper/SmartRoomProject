'use client'

import Loading from "@/components/loading";
import { useGetTopic } from "@/hooks/apis/topics/useGetTopic"
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
    const router = useRouter()
    const topicQuery = useGetTopic(params.id);

    function onGoBackHandler() {
        router.push(`/topic/`)
    }
    
    if (topicQuery.isLoading || topicQuery.isError) {
        <Loading />
    }

    return (
        <>
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 px-2 pb-1 box-border sm:w-full sm:text-center flex justify-between items-center">
                <div className="flex justify-start items-center">
                    <ArrowBack className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 mr-2" onClick={onGoBackHandler} />
                </div>
            </div>
            <div className="flex w-full flex-wrap">
            </div>
        </>
    )
}