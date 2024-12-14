/* tslint:disable */
/* eslint-disable */
/**
 * 南师教室
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    EmptyClassroomVo,
    EmptyClassroomVoFromJSON,
    EmptyClassroomVoFromJSONTyped,
    EmptyClassroomVoToJSON,
} from './index';

/**
 * 空教室反馈
 * @export
 * @interface EmptyClassroomFeedbackDto
 */
export interface EmptyClassroomFeedbackDto {
    /**
     * 星期
     * @type {string}
     * @memberof EmptyClassroomFeedbackDto
     */
    weekday: EmptyClassroomFeedbackDtoWeekdayEnum;
    /**
     * 节次
     * @type {number}
     * @memberof EmptyClassroomFeedbackDto
     */
    jc: number;
    /**
     * 教学楼名称
     * @type {string}
     * @memberof EmptyClassroomFeedbackDto
     */
    jxlmc: string;
    /**
     * 查询结果集
     * @type {Array<EmptyClassroomVo>}
     * @memberof EmptyClassroomFeedbackDto
     */
    results: Array<EmptyClassroomVo>;
    /**
     * 异常结果索引
     * @type {number}
     * @memberof EmptyClassroomFeedbackDto
     */
    index: number;
}

export function EmptyClassroomFeedbackDtoFromJSON(json: any): EmptyClassroomFeedbackDto {
    return EmptyClassroomFeedbackDtoFromJSONTyped(json, false);
}

export function EmptyClassroomFeedbackDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): EmptyClassroomFeedbackDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'weekday': json['weekday'],
        'jc': json['jc'],
        'jxlmc': json['jxlmc'],
        'results': ((json['results'] as Array<any>).map(EmptyClassroomVoFromJSON)),
        'index': json['index'],
    };
}

export function EmptyClassroomFeedbackDtoToJSON(value?: EmptyClassroomFeedbackDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'weekday': value.weekday,
        'jc': value.jc,
        'jxlmc': value.jxlmc,
        'results': ((value.results as Array<any>).map(EmptyClassroomVoToJSON)),
        'index': value.index,
    };
}

/**
* @export
* @enum {string}
*/
export enum EmptyClassroomFeedbackDtoWeekdayEnum {
    MON = 'MON',
    TUE = 'TUE',
    WED = 'WED',
    THU = 'THU',
    FRI = 'FRI',
    SAT = 'SAT',
    SUN = 'SUN'
}


