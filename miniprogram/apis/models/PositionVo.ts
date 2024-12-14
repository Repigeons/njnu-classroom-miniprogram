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
 * 校车站位置
 * @export
 * @interface PositionVo
 */
export interface PositionVo {
    /**
     * 车站名称
     * @type {string}
     * @memberof PositionVo
     */
    name: string;
    /**
     * 经度
     * @type {number}
     * @memberof PositionVo
     */
    longitude: number;
    /**
     * 维度
     * @type {number}
     * @memberof PositionVo
     */
    latitude: number;
}

export function PositionVoFromJSON(json: any): PositionVo {
    return PositionVoFromJSONTyped(json, false);
}

export function PositionVoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PositionVo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'longitude': json['longitude'],
        'latitude': json['latitude'],
    };
}

export function PositionVoToJSON(value?: PositionVo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'longitude': value.longitude,
        'latitude': value.latitude,
    };
}


