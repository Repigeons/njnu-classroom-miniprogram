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
/**
 * 用户收藏
 * @export
 * @interface UserFavoritesVo
 */
export interface UserFavoritesVo {
    /**
     * 
     * @type {number}
     * @memberof UserFavoritesVo
     */
    id?: number;
    /**
     * 标题
     * @type {string}
     * @memberof UserFavoritesVo
     */
    title: string;
    /**
     * 星期
     * @type {string}
     * @memberof UserFavoritesVo
     */
    weekday: UserFavoritesVoWeekdayEnum;
    /**
     * 开始节次
     * @type {number}
     * @memberof UserFavoritesVo
     */
    ksjc: number;
    /**
     * 结束节次
     * @type {number}
     * @memberof UserFavoritesVo
     */
    jsjc: number;
    /**
     * 地点
     * @type {string}
     * @memberof UserFavoritesVo
     */
    place: string;
    /**
     * 颜色
     * @type {string}
     * @memberof UserFavoritesVo
     */
    color: string;
    /**
     * 备注
     * @type {{ [key: string]: object | undefined; }}
     * @memberof UserFavoritesVo
     */
    remark: { [key: string]: object | undefined; };
}

export function UserFavoritesVoFromJSON(json: any): UserFavoritesVo {
    return UserFavoritesVoFromJSONTyped(json, false);
}

export function UserFavoritesVoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserFavoritesVo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'title': json['title'],
        'weekday': json['weekday'],
        'ksjc': json['ksjc'],
        'jsjc': json['jsjc'],
        'place': json['place'],
        'color': json['color'],
        'remark': json['remark'],
    };
}

export function UserFavoritesVoToJSON(value?: UserFavoritesVo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'title': value.title,
        'weekday': value.weekday,
        'ksjc': value.ksjc,
        'jsjc': value.jsjc,
        'place': value.place,
        'color': value.color,
        'remark': value.remark,
    };
}

/**
* @export
* @enum {string}
*/
export enum UserFavoritesVoWeekdayEnum {
    MON = 'MON',
    TUE = 'TUE',
    WED = 'WED',
    THU = 'THU',
    FRI = 'FRI',
    SAT = 'SAT',
    SUN = 'SUN'
}

