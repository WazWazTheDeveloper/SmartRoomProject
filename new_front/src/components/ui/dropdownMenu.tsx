import { Menu, Transition } from '@headlessui/react'
import { Settings } from '@mui/icons-material'
import { Fragment } from "react"

interface DropdownMenuProps {
    titleElement : React.ReactNode;
    menuItems: DropdownMenuItem[];
    className? : string;
}

interface DropdownMenuItem {
    itemTitle: string;
    onClick: React.MouseEventHandler;
}

export default function DropdownMenu(props: DropdownMenuProps) {
    let menuItems = [];
    for (let i = 0; i < props.menuItems.length; i++) {
        const menuItem = props.menuItems[i];
        menuItems.push(
            <Menu.Item key={i}>
                {({ active }: any) => (
                    <button
                        onClick={menuItem.onClick}
                        className={`${active ? 'bg-gray-200 text-black' : 'text-black bg-white'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm font-semibold`}
                    >
                        {menuItem.itemTitle}
                    </button>
                )}
            </Menu.Item>
        )
    }

    return (
        <div className={"md:mr-2.5 cursor-pointer mr-1 relative " + props.className}>
            <Menu>
                <div>
                    <Menu.Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}>
                        {props.titleElement}
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute z-10 right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        {menuItems}
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}