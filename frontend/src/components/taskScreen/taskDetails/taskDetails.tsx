import React, { useEffect, useRef, useState } from 'react';
import styles from './taskDetails.module.css'
import { Add, Check, Delete, Edit, IndeterminateCheckBox, Loop, PowerSettingsNew, Tag } from '@mui/icons-material';
import SwitchButton from '../../switchButton';
import { useParams } from 'react-router-dom';
import { useAppdata } from '../../../hooks/useAppdata';
import useDidMount from '../../../hooks/useDidMount';
import { useAuth } from '../../../hooks/useAuth';
import { useApi } from '../../../hooks/useApi';
import { ApiService } from '../../../services/apiService';
import TimeChackAdd from './listsItems/timeCheckAdd';
import VarCheckAdd from './listsItems/varCheckAdd';
import TodoTaskAdd from './listsItems/todoTaskAdd';
import VarCheck from './listsItems/varCheck';
import TimeCheck from './listsItems/timeCheck';
import TodoTask from './listsItems/todoTask';

function TaskDetails(props: any) {
    const [userdata] = useAuth();
    // const [data, isLoading, isError, error, fetchWithReauth, refreshToken] = useApi("/task/update-task", ApiService.REQUEST_POST);
    // const [removeVarData, removeVarIsLoading, removeVarIsError, removeVarError, removeVarFetchWithReauth] = useApi("/task/remove-var-check", ApiService.REQUEST_POST);
    // const [removeTimeData, removeTimeIsLoading, removeTimeIsError, removeTimeError, removeTimeFetchWithReauth] = useApi("/task/remove-time-check", ApiService.REQUEST_POST);
    // const [removeTodoData, removeTodoIsLoading, removeTodoIsError, removeTodoError, removeTodoFetchWithReauth] = useApi("/task/remove-todo", ApiService.REQUEST_POST);
    const [data, isLoading, isError, error, fetchWithReauth] = useApi();

    const { taskid } = useParams();
    const [appdata, isAppdata] = useAppdata()

    const [taskName, setTaskName] = useState("task - name");
    const [isOn, setIsOn] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);

    const [isEditTitle, setIsEditTitle] = useState(false);
    const [isAddVarCheck, setIsAddVarCheck] = useState(false);
    const [isAddTimeCheck, setIsAddTimeCheck] = useState(false);
    const [isAddTodoTask, setIsAddTodoTask] = useState(false);

    const taskNameRef = useRef(taskName)

    const [triggerupdate, setTriggerupdate] = useState(false);

    const [updateListItem, setUpdateListItem] = useState(-1);

    function onRemoveVarCheck(indexOfVarCheck: number) {
        let body = {
            targetTask: taskid,
            indexOfVarCheck: indexOfVarCheck
        }
        fetchWithReauth("/task/remove-var-check", ApiService.REQUEST_POST,userdata.token, body)
    }

    function onRemoveTimeCheck(indexOfVarCheck: number) {
        let body = {
            targetTask: taskid,
            indexOfTimeCheck: indexOfVarCheck
        }
        console.log(indexOfVarCheck)
        fetchWithReauth("/task/remove-time-check", ApiService.REQUEST_POST,userdata.token, body)
    }

    function onRemoveTodo(indexOfVarCheck: number) {
        let body = {
            targetTask: taskid,
            indexOfTodoTask: indexOfVarCheck
        }
        fetchWithReauth("/task/remove-todo", ApiService.REQUEST_POST,userdata.token, body)
    }
    function onButtonStateChange(e: React.ChangeEvent<HTMLElement>) {
        setIsOn(!isOn)
        setTriggerupdate(!triggerupdate);
    }
    function repeatingButtonStateChange(e: React.ChangeEvent<HTMLElement>) {
        setIsRepeating(!isRepeating)
        setTriggerupdate(!triggerupdate);
    }
    function onClickAddVarCheck() {
        setIsAddVarCheck(true);
    }
    function onClickAddTimeCheck() {
        setIsAddTimeCheck(true);
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

    function onSetUpdateListItem(place: number) {
        setUpdateListItem(place)
    }

    useEffect(() => {
        if (isAppdata && taskid) {
            try {
                let task = appdata.getTaskByUUID(taskid);
                console.log(task);
                setTaskName(task.taskName)
                setIsOn(task.isOn)
                setIsRepeating(task.isRepeating)
            } catch (err) {
                console.log("task doesn't exist")
            }
        }
    }, [appdata, isAppdata])


    // todate task
    useDidMount(() => {
        let body = {
            targetTask: taskid,
            data: {
                taskName: taskName,
                isOn: isOn,
                isRepeating: isRepeating
            }
        }
        fetchWithReauth("/task/update-task", ApiService.REQUEST_POST,userdata.token, body)
    }, [triggerupdate])

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

    let toCheckElements = []
    let todoElements = []
    //load elements of toCheck and todo from appdata
    if (isAppdata && taskid) {
        let toCheck = appdata.getTaskByUUID(taskid).varCheckList;
        for (let index = 0; index < toCheck.length; index++) {
            const check = toCheck[index];
            let element =
                <div className={styles.attribute}>
                    {updateListItem == index ? <></> : <VarCheck
                        deviceId={check.deviceId}
                        dataIndex={check.dataIndex}
                        checkType={check.checkType}
                        varName={check.varName}
                        valueToCompareTo={check.valueToCompareTo}
                        onDeleteFunction={() => { onRemoveVarCheck(index) }}
                        onEditFunction={() => { onSetUpdateListItem(index) }}
                    />}
                    {/* <VarCheck
                        deviceId={check.deviceId}
                        dataIndex={check.dataIndex}
                        checkType={check.checkType}
                        varName={check.varName}
                        valueToCompareTo={check.valueToCompareTo}
                        onDeleteFunction={() => { onRemoveVarCheck(index) }}
                    /> */}
                </div>
            toCheckElements.push(element)
        }

        let timeCheck = appdata.getTaskByUUID(taskid).timedCheckList;
        for (let index = 0; index < timeCheck.length; index++) {
            const check = timeCheck[index];
            let element =

                <div className={styles.attribute}>
                    {updateListItem == index + toCheck.length ? <></> : <TimeCheck
                        timingData={check.timingData}
                        onDeleteFunction={() => { onRemoveTimeCheck(index) }}
                        onEditFunction={() => { onSetUpdateListItem(index + toCheck.length) }}
                    />}
                    {/* <TimeCheck
                        timingData={check.timingData}
                        onDeleteFunction={() => { onRemoveTimeCheck(index) }}
                    /> */}
                </div>
            toCheckElements.push(element)
        }

        let todoTasks = appdata.getTaskByUUID(taskid).toDoTaskList;
        for (let index = 0; index < todoTasks.length; index++) {
            const todo = todoTasks[index];
            let element =
                <div className={styles.attribute}>
                    {updateListItem == index + toCheck.length + timeCheck.length ? <></> : <TodoTask
                        dataAt={todo.dataAt}
                        deviceId={todo.deviceId}
                        newVarValue={todo.newVarValue}
                        varName={todo.varName}
                        onDeleteFunction={() => { onRemoveTodo(index) }}
                        onEditFunction={() => { onSetUpdateListItem(index + toCheck.length + timeCheck.length) }}
                    />}

                    {/* <TodoTask
                        dataAt={todo.dataAt}
                        deviceId={todo.deviceId}
                        newVarValue={todo.newVarValue}
                        varName={todo.varName}
                        onDeleteFunction={() => { onRemoveTodo(index) }}
                    /> */}
                </div>
            todoElements.push(element)
        }

    }

    return (
        <div className={styles.container}>
            <div className={styles.title_container}>
                {isEditTitle ?
                    <div className={styles.task_name + " " + styles.task_name_editable} contentEditable suppressContentEditableWarning={true} onInput={onTitleChange}>
                        {taskNameRef.current}
                    </div> :
                    <p className={styles.task_name}>
                        {taskName}
                    </p>
                }
                <Edit className={styles.attribute_icon} onClick={() => { onEditTitleClick() }} />
            </div>
            <div className={styles.task_attributes}>
                <div className={styles.attribute}>
                    <Tag className={styles.attribute_icon} />
                    <p>{taskid}</p>
                </div>
                <div className={styles.attribute}>
                    <PowerSettingsNew className={styles.attribute_icon} />
                    <SwitchButton state={isOn} stateChangeFunction={onButtonStateChange} />
                </div>
                <div className={styles.attribute}>
                    <Loop className={styles.attribute_icon} />
                    <SwitchButton state={isRepeating} stateChangeFunction={repeatingButtonStateChange} />
                </div>
                <div className={styles.attribute_title_container}>
                    <h2 className={styles.attribute_name}>To check</h2>
                    {/* turn this into menu */}
                    <Add className={styles.attribute_icon} onClick={onClickAddTimeCheck} />
                    <Add className={styles.attribute_icon} onClick={onClickAddVarCheck} />
                </div>
                {toCheckElements}
                {isAddVarCheck ?
                    <div className={styles.attribute}>
                        <VarCheckAdd id={taskid} onDeleteFunction={onUnclickAddVarCheck} />
                    </div> :
                    <></>
                }
                {isAddTimeCheck ?
                    <div className={styles.attribute}>
                        <TimeChackAdd id={taskid} onDeleteFunction={onUnclickAddTimeCheck} />
                    </div> :
                    <></>
                }
                <div className={styles.attribute_title_container}>
                    <h2 className={styles.attribute_name}>To Do</h2>
                    <Add className={styles.attribute_icon} onClick={onClickAddTodo} />
                </div>
                {todoElements}
                {isAddTodoTask ?
                    <div className={styles.attribute}>
                        <TodoTaskAdd id={taskid} onDeleteFunction={onUnclickAddTodo} />
                    </div> :
                    <></>
                }
            </div>
        </div>
    )
}

export default TaskDetails