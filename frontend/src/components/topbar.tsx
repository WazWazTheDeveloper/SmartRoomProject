'use client'

import useSidebarState from '@/hooks/useSidebarState';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';

export default function Topbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useSidebarState();
    const router = useRouter()

    function toggleSidebar() {
        setIsSidebarOpen(!isSidebarOpen)
    }

    function onClick() {
        router.push(`/`)

    }
    
    return (
        <div className="text-3xl bg-neutral-200 dark:bg-darkNeutral-200 p-2 flex justify-between items-center">
            <h1 className="text 3xl" onClick={onClick}>
                SmartRoomProject
            </h1>
            <MenuIcon className='fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300' sx={{ fontSize: 35 }}  onClick={toggleSidebar}/>
        </div>
    )
}