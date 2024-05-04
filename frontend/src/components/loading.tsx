import { BounceLoader } from "react-spinners";

export default function Loading() {
    return (
        <div className='w-full flex justify-center mt-4'>
            <BounceLoader color="#36d7b7" />
        </div>
    )
}