import Link from "next/link";

export default function TopBar() {
    return (
        <div className="w-full fixed bg-surface h-11 flex items-center z-10 md:h-12">
            <Link href="/">
                <p className="text-2xl text-white font-bold ml-5">Smart Home Project</p>
            </Link>
        </div>
    )
}