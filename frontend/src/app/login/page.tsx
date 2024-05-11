'use client'
import { FormEvent } from "react";

export default function Page() {
    function onSumbitHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log(formData.get("username"))
    }

    return (
        <section className="relative w-full flex justify-center items-center wrap overflow-hidden h-[calc(100svh-3rem)]">
            <div className="absolute w-96 max-w-9/10 bg-neutral-200 z-50 flex justify-center items-center p-10 rounded-lg border border-neutral-500 dark:border-darkNeutral-500">

                <form className="relative w-full flex justify-center items-center flex-col gap-10" onSubmit={onSumbitHandler}>

                    <h2 className="text-3xl uppercase">Sign In</h2>

                    <div className="w-full flex flex-col gap-6">

                        <div className="relative w-full">
                            <input className="peer relative w-full bg-neutral-300 border-none outline-none pt-6 pr-2 pl-2 pb-2 rounded-md font-medium" type="text" name="username" required />
                            <i className={`absolute left-0 py-4 px-2.5 not-italic duration-500 pointer-events-none text-base
                        peer-valid:text-xs peer-valid:translate-y-[-7.5px] peer-focus:text-xs peer-focus:translate-y-[-7.5px]`}>Username</i>
                        </div>

                        <div className="relative w-full">
                            <input className="peer relative w-full bg-neutral-300 border-none outline-none pt-6 pr-2 pl-2 pb-2 rounded-md font-medium" type="password" name="password" required />
                            <i className={`absolute left-0 py-4 px-2.5 not-italic duration-500 pointer-events-none text-base
                        peer-valid:text-xs peer-valid:translate-y-[-7.5px] peer-focus:text-xs peer-focus:translate-y-[-7.5px]`}>Password</i>
                        </div>

                        {/* <div class="links"> <a href="#">Forgot Password</a> <a href="#">Signup</a> */}
                        {/* </div> */}

                        <div className="relative w-full">
                            <input className="relative w-full bg-neutral-300 border-none outline-none p-2.5 rounded-md font-semibold text-xl tracking-wider cursor-pointer active:opacity-60" type="submit" value="Login" />
                        </div>

                    </div>

                </form>

            </div>
        </section>
    )
}