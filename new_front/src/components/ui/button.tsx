interface buttonProps {

}

export default function Button({className,isFocused,onClick,children} : any) {
    return (
        <button 
        type="button"
        className={"outline-none flex justify-center content-center text-white ring-primary-varient ring-1 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2" +" " + className + " " +
        (isFocused ? "bg-primary-varient" : "bg-surface hover:bg-[#1a1a1a]")}
        onClick={onClick}
        >
            {children}
        </button>
    )
}