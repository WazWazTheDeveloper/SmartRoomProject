import { subType } from "../types";
import { TopicData } from "./device";

class SubType implements subType {
    topicData: TopicData;
    callbackFunction: Function;

    constructor(topicData: TopicData, callbackFunction: Function) {
        this.topicData = topicData;
        this.callbackFunction = callbackFunction;
    }
}

export {SubType}