import { useState, useEffect } from "react"

const usePersist = () => {
    const stored = window.localStorage.getItem("persist")
    let localStorage: string = ""
    if (stored) {
        localStorage = JSON.parse(stored);
    }
    const [persist, setPersist] = useState(localStorage);

    useEffect(() => {
        window.localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist] as const
}
export default usePersist