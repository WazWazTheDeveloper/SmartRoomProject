import React, { useState} from 'react';
import styles from './taskDetails.module.css'
import { Add, Delete, Edit, Loop, PowerSettingsNew, Tag } from '@mui/icons-material';
import SwitchButton from '../../switchButton';
import { useParams } from 'react-router-dom';

function TaskDetails(props: any) {
    const params = useParams();

    let [taskName, setTaskName] = useState("task - name");
    let [isOn, setIsOn] = useState(false);
    let [isRepeating, setIsRepeating] = useState(false);

    function onButtonStateChange(e: React.ChangeEvent<HTMLElement>) {
        setIsOn(!isOn)
    }

    function repeatingButtonStateChange(e: React.ChangeEvent<HTMLElement>) {
        setIsRepeating(!isRepeating)
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.task_name}>{taskName}</h1>
            <div className={styles.task_attributes}>
                <div className={styles.attribute}>
                    <Tag className={styles.attribute_icon} />
                    <p>
                        "taskid"
                    </p>
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
                    <Add className={styles.attribute_icon} />
                </div>
                <div className={styles.attribute}>
                    <VarCheck
                        deviceId='2f454d2b-38a9-4b56-a5d8-5c03d205970e'
                        dataIndex={0}
                        checkType={0}
                        varName='test'
                        valueToCompareTo={0}
                    />
                </div>
                <div className={styles.attribute}>
                    <TimeCheck
                        timingData='"*/5 * * * * *"'
                    />
                </div>
                <div className={styles.attribute_title_container}>
                    <h2 className={styles.attribute_name}>To Do</h2>
                    <Add className={styles.attribute_icon} />
                </div>
                <div className={styles.attribute}>
                    <ToDoTask
                        dataAt={0}
                        deviceId='2f454d2b-38a9-4b56-a5d8-5c03d205970e'
                        newVarValue={13}
                        varName='temp'
                    />
                </div>
            </div>
        </div>
    )
}

let CHECK_EQUAL_TO: number = 0
let CHECK_GREATER_THAN: number = 1
let CHECK_LESS_THAN: number = 2

interface VarCheckProps {
    deviceId: string
    dataIndex: number
    varName: string
    checkType: number
    valueToCompareTo: any
}
function VarCheck(props: VarCheckProps) {
    let checkType: string = "";
    switch (props.checkType) {
        case (CHECK_EQUAL_TO): {
            checkType = "equal to";
            break;
        }
        case (CHECK_GREATER_THAN): {
            checkType = "greater than";
            break;
        }
        case (CHECK_LESS_THAN): {
            checkType = "less than";
            break;
        }
    }
    return (
        <div className={styles.var_check}>
            <div className={styles.var_check_attributes}>
                <p>check</p>
                <p>"{props.deviceId}"</p>
                <p>at</p>
                <p>[{props.dataIndex}]</p>
                <p>if</p>
                <p>{props.varName}</p>
                <p>{checkType}</p>
                <p>{props.valueToCompareTo}</p>
            </div>
            <div className={styles.var_check_options}>
                <Edit className={styles.attribute_icon} />
                <Delete className={styles.attribute_icon} />
            </div>
        </div>
    )
}

interface TimeCheckProps {
    timingData: string
}

function TimeCheck(props: TimeCheckProps) {
    return (
        <div className={styles.time_check}>
            <div className={styles.time_check_attributes}>
                <p>{"timingData string: "}</p>
                <p>{props.timingData}</p>
            </div>
            <div className={styles.time_check_options}>
                <Edit className={styles.attribute_icon} />
                <Delete className={styles.attribute_icon} />
            </div>
        </div>
    )
}

interface ToDoTaskProps {
    deviceId: string
    dataAt: number
    varName: string
    newVarValue: any
}
function ToDoTask(props: ToDoTaskProps) {
    return (
        <div className={styles.todo_check}>
            <div className={styles.todo_check_attributes}>
                <p>change</p>
                <p>"{props.varName}"</p>
                <p>at</p>
                <p>"{props.deviceId}"[{props.dataAt}]</p>
                <p>to</p>
                <p>{props.newVarValue}</p>
            </div>
            <div className={styles.todo_check_options}>
                <Edit className={styles.attribute_icon} />
                <Delete className={styles.attribute_icon} />
            </div>
        </div>
    )
}

export default TaskDetails