'use client'
import Loading from "@/components/loading";
import useGetTopics from "@/hooks/apis/topics/useGetTopics"
import { useRouter } from "next/navigation";

export default function Page() {
    const topicsQuery = useGetTopics();

    if (topicsQuery.isLoading || topicsQuery.isError) {
        <Loading />
    }

    return (
        <>
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 pl-2">
                Topics
            </div>
            {
                topicsQuery.data?.topics ?
                topicsQuery.data.topics.map((element, index) => {
                        return (
                            <ListItem topicID={element._id} topicName={element.topicName} key={index} />
                        )
                    }) : <></>
            }
        </>
    )
}
type TProps = {
    topicID: string
    topicName: string
}

function ListItem(props: TProps) {
    const router = useRouter()

    function redirectToTask() {
        router.push(`/topic/${props.topicID}`)
    }


    return (
        <div className="relative flex mt-1 bg-neutral-300 dark:bg-darkNeutral-300 cursor-pointer" onClick={redirectToTask}>
            <div className={`w-full box-border flex items-center p-1`}>
                <h2 className="text-xl inline-block">
                    {props.topicName}
                </h2>
            </div>
            {/* <div className="w-1/4 justify-end flex items-center pr-2">
                <Loop className={"w-6 h-6 fill-neutral-1000 dark:fill-darkNeutral-1000 " + (props.isRepeating ? "fill-green-500 dark:fill-green-500" : "")} />
                <Switch
                    checked={isOn}
                    onChange={onIsOnClickHandler}
                    onClick={(e) => { e.stopPropagation() }}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </div> */}
        </div>

    )
}