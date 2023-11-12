'use client';

import AddToCheckListItem from "@/components/tasks/details/addToCheckListItem";
import AddTodoListItem from "@/components/tasks/details/addTodoListItem";
import ViewToCheckListItem from "@/components/tasks/details/viewToCheckListItem";
import ViewTodoListItem from "@/components/tasks/details/viewTodoListItem";
import DropdownMenu from "@/components/ui/dropdownMenu";
import SwitchButton from "@/components/ui/switchButton";
import { useApi } from "@/hooks/useApi";
import { useAppdata } from "@/hooks/useAppdata";
import { useAuth } from "@/hooks/useAuth";
import useDidMount from "@/hooks/useDidMount";
import { ApiService } from "@/services/apiService";
import { Task } from "@/services/appdataService";
import { Add, Edit, Loop, PowerSettingsNew, Tag } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
    const { userdata } = useAuth();
    const { fetchWithReauth } = useApi();
    const [appdata, isAppdata] = useAppdata()
    const [taskName, setTaskName] = useState("task - name");
    const [isOn, setIsOn] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [isEditTitle, setIsEditTitle] = useState(false);
    const [triggerupdate, setTriggerupdate] = useState(false);

    const [isAddVarCheck, setIsAddVarCheck] = useState(false);
    const [isAddTimeCheck, setIsAddTimeCheck] = useState(false);
    const [isAddTodoTask, setIsAddTodoTask] = useState(false);

    const [toCheckElements, setToCheckElements] = useState<React.ReactNode>([]);
    const [todoElements, setTodoElements] = useState<React.ReactNode>([]);

    const taskNameRef = useRef(taskName)

    const addToCheckTitle =
        (<div className="duration-200 hover:scale-105 w-6 h-6 md:h-10 md:w-10">
            <Add className="fill-on-surface h-full w-full" />
        </div>);
    const addToCheckTiles = [
        {
            "itemTitle": "Add Time Check",
            "onClick": onClickAddTimeCheck
        }, {
            "itemTitle": "Add Var Check",
            "onClick": onClickAddVarCheck,
        },
    ]

    const addTodoTitle =
        (<div className="duration-200 hover:scale-105 w-6 h-6 md:h-10 md:w-10">
            <Add className="fill-on-surface h-full w-full" />
        </div>);
    const addTodoTiles = [
        {
            "itemTitle": "Add Todo task",
            "onClick": onClickAddTodo
        },
    ]

    function onEditTitleClick() {
        if (isEditTitle) {
            setTaskName(taskNameRef.current);
            setTriggerupdate(!triggerupdate);
        }
        else {
            taskNameRef.current = taskName;
        }
        setIsEditTitle(!isEditTitle);
    }

    function onTitleChange(e: React.FormEvent<HTMLParagraphElement>) {
        if (e.currentTarget.textContent) {
            taskNameRef.current = e.currentTarget.textContent;
        }
    }

    function onButtonStateChange(e: boolean) {
        setIsOn(!isOn)
        setTriggerupdate(!triggerupdate);
    }

    function repeatingButtonStateChange(e: boolean) {
        setIsRepeating(!isRepeating)
        setTriggerupdate(!triggerupdate);
    }

    function onClickAddTimeCheck() {
        setIsAddTimeCheck(true);
    }

    function onClickAddVarCheck() {
        setIsAddVarCheck(true);
    }
    function onClickAddTodo() {
        setIsAddTodoTask(true);
    }
    function onUnclickAddVarCheck() {
        setIsAddVarCheck(false);
    }
    function onUnclickAddTimeCheck() {
        setIsAddTimeCheck(false);
    }
    function onUnclickAddTodo() {
        setIsAddTodoTask(false);
    }

    function onRemoveVarCheck(indexOfVarCheck: number) {
        let body = {
            targetTask: params.id,
            indexOfVarCheck: indexOfVarCheck
        }
        fetchWithReauth("/task/remove-var-check", ApiService.REQUEST_POST, userdata.token, body)
    }

    function onRemoveTimeCheck(indexOfVarCheck: number) {
        let body = {
            targetTask: params.id,
            indexOfTimeCheck: indexOfVarCheck
        }
        console.log(indexOfVarCheck)
        fetchWithReauth("/task/remove-time-check", ApiService.REQUEST_POST, userdata.token, body)
    }

    function onRemoveTodo(indexOfVarCheck: number) {
        let body = {
            targetTask: params.id,
            indexOfTodoTask: indexOfVarCheck
        }
        fetchWithReauth("/task/remove-todo", ApiService.REQUEST_POST, userdata.token, body)
    }

    useEffect(() => {
        if (isAppdata && params.id) {
            try {
                let task = appdata.getTaskByUUID(params.id);
                console.log(task)
                setTaskName(task.taskName)
                setIsOn(task.isOn)
                setIsRepeating(task.isRepeating)
                // TODO: find apropriate place for this
                createListItems(task)
            } catch (err) {
                console.log("task doesn't exist")
            }
        }
    }, [appdata, isAppdata, params.id])

    useDidMount(() => {
        let body = {
            targetTask: params.id,
            data: {
                taskName: taskName,
                isOn: isOn,
                isRepeating: isRepeating
            }
        }
        fetchWithReauth("/task/update_task", ApiService.REQUEST_POST, userdata.token, body)
    }, [triggerupdate])

    function createListItems(task: Task) {
        const _toCheck = task.varCheckList;
        let _toCheckArr = []
        for (let index = 0; index < _toCheck.length; index++) {
            const check = _toCheck[index];
            let element = <ViewToCheckListItem
                deviceId={check.deviceId}
                dataIndex={check.dataIndex}
                varName={check.varName}
                checkType={check.checkType}
                valueToCompareTo={check.valueToCompareTo}
                onDeleteFunction={() => { onRemoveVarCheck(index) }}
                onEditFunction={() => { }}
                key={index}
            />

            _toCheckArr.push(element)
        }
        setToCheckElements(_toCheckArr);

        const _todo = task.toDoTaskList;
        let _todoArr = []
        for (let index = 0; index < _todo.length; index++) {
            const todo = _todo[index];
            let element = <ViewTodoListItem
                dataAt={todo.dataAt}
                deviceId={todo.deviceId}
                newVarValue={todo.newVarValue}
                varName={todo.varName}
                onEditFunction={() => { }}
                onDeleteFunction={() => { }}
                key={index}
            />

            _todoArr.push(element)
        }
        setTodoElements(_todoArr);
    }

    return (
        <div className="w-4/5 m-auto flex bg-surface content-start flex-wrap pb-4 px-3">
            <div className="w-full flex justify-center items-center gap-x-2">
                {isEditTitle ?
                    <div className="relative text-on-surface text-xl text-center m-y-2 w-auto py-2 px-3 
                        after:contents[''] after:absolute after:m-auto after:right-0 after:bottom-0 after:left-0 after:w-full after:h-full border-on-surface border-solid border"
                        contentEditable suppressContentEditableWarning={true} onInput={onTitleChange}>
                        {taskNameRef.current}
                    </div> :
                    <p className="relative text-on-surface text-xl text-center m-y-2 w-auto py-2 px-3">
                        {taskName}
                    </p>
                }
                <Edit className="cursor-pointer fill-on-surface h-7 w-7" onClick={() => { onEditTitleClick() }} />
            </div>
            <div className="w-full flex justify-center items-start flex-wrap gap-y-4">
                <Line>
                    <Tag className="fill-on-surface h-7 w-7" />
                    <p>{params.id}</p>
                </Line>
                <Line>
                    <PowerSettingsNew className="fill-on-surface h-7 w-7" />
                    <SwitchButton state={isOn} stateChangeFunction={onButtonStateChange} />
                </Line>
                <Line>
                    <Loop className="fill-on-surface h-7 w-7" />
                    <SwitchButton state={isRepeating} stateChangeFunction={repeatingButtonStateChange} />
                </Line>
            </div>
            <SubMenu>
                <h2>Conditions</h2>
                <DropdownMenu titleElement={addToCheckTitle} menuItems={addToCheckTiles} />
            </SubMenu>
            {/* TODO: finish this */}
            {isAddVarCheck ?
                <AddToCheckListItem
                    id={params.id}
                    onDeleteFunction={onUnclickAddVarCheck} /> :
                <></>
            }
            {isAddTimeCheck ?
                <></> :
                <></>
            }
            {toCheckElements}

            <SubMenu>
                <h2>Todo</h2>
                <DropdownMenu titleElement={addTodoTitle} menuItems={addTodoTiles} />
            </SubMenu>
            {isAddTodoTask ?
                <AddTodoListItem
                    id={params.id}
                    onDeleteFunction={onUnclickAddTodo} /> :
                <></>
            }
            {todoElements}
        </div>
    )
}

function Line({ children }: { children: React.ReactNode; }) {
    return (
        <div className="relative w-full flex justify-start gap-x-2.5 items-center text-on-surface">
            {children}
        </div>
    )
}

function SubMenu({ children }: { children: React.ReactNode; }) {
    return (
        <div className="relative flex items-center justify-between w-full text-on-surface">
            {children}
        </div>
    )
}