'use client';

import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function Login() {
    const router = useRouter()
    const {userdata, login, logout,signup, updateUserData, isError, error} = useAuth();
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")

    function handlePasswordChange(e:React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.currentTarget.value)
    }

    function handleUsernameChange(e:React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.currentTarget.value)
    }

    function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        login(username,password)
    }

    function handleSignup(e:React.MouseEvent<HTMLButtonElement>) {
        signup(username,password)
    }

    // IMPLEMENT: 
    function handleForgotPassword(e:React.MouseEvent<HTMLButtonElement>) {
    }

    useEffect(() =>{
        if(userdata.token != "") {
            router.push('/')
        }
    },[userdata,router])
    
    return (
        <section className="bg-background">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-on-background">
                    {/* TODO: smart room project icon :) here */}
                    <Image className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
                        Smart room project
                </a>
                <div className="w-full bg-surface rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-on-surface md:text-2xl">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-on-surface">Username</label>
                                <input type="text" name="username" id="username" value={username} onChange={handleUsernameChange} className="bg-[#1a1a1a] border border-gray-300 text-on-surface sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="username" required={true}/>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-on-surface">Password</label>
                                <input type="password" name="password" id="password" value={password} onChange={handlePasswordChange} placeholder="••••••••" className="bg-[#1a1a1a] border border-gray-300 text-on-surface sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true}/>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"/>
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label className="text-on-surface">Remember me</label>
                                    </div>
                                </div>
                                <a href="#" className="text-sm font-medium text-on-surface hover:underline">Forgot password?</a>
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-varient hover:bg-[#3d00c7] focus:ring-4 focus:outline-none focus:ring-[#3d00c7] font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <button onClick={handleSignup} className="cursor-pointer inline font-medium text-primary-varient hover:underline">Sign up</button>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}