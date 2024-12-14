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


import * as runtime from '../runtime';
import {
    GridVo,
    GridVoFromJSON,
    GridVoToJSON,
    InlineObject,
    InlineObjectFromJSON,
    InlineObjectToJSON,
    PositionVo,
    PositionVoFromJSON,
    PositionVoToJSON,
    ShuttleRouteVo,
    ShuttleRouteVoFromJSON,
    ShuttleRouteVoToJSON,
    SimpleDataVoLong,
    SimpleDataVoLongFromJSON,
    SimpleDataVoLongToJSON,
    UserFavoritesDto,
    UserFavoritesDtoFromJSON,
    UserFavoritesDtoToJSON,
    UserFavoritesVo,
    UserFavoritesVoFromJSON,
    UserFavoritesVoToJSON,
    } from '../models/index';

export interface DeleteFavoritesRequest {
    id: string;
    }

export interface GetShuttleRequest {
    weekday: GetShuttleWeekdayEnum;
    }

export interface SaveFavoritesRequest {
    userFavoritesDto?: UserFavoritesDto;
    }

export interface UploadShuttleImageRequest {
    inlineObject?: InlineObject;
    }

/**
 * 
 */
export class ExploreApi extends runtime.BaseAPI {

    /**
     * 删除用户收藏
     */
    async deleteFavoritesRaw(requestParameters: DeleteFavoritesRequest): Promise<runtime.ApiResponse<object>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling deleteFavorites.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // apikey-header-Authorization authentication
        }

        const response = await this.request({
            path: `/user/favorites/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,

        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * 删除用户收藏
     */
    async deleteFavorites(id: string): Promise<object> {
        const response = await this.deleteFavoritesRaw({ id: id });
        return await response.value();
    }

    /**
     * 刷新发现栏
     */
    async flushGridsRaw(): Promise<runtime.ApiResponse<Array<GridVo>>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // apikey-header-Authorization authentication
        }

        const response = await this.request({
            path: `/grids/flush`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,

        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(GridVoFromJSON));
    }

    /**
     * 刷新发现栏
     */
    async flushGrids(): Promise<Array<GridVo>> {
        const response = await this.flushGridsRaw();
        return await response.value();
    }

    /**
     * 查询用户收藏
     */
    async getFavoritesRaw(): Promise<runtime.ApiResponse<Array<UserFavoritesVo>>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // apikey-header-Authorization authentication
        }

        const response = await this.request({
            path: `/user/favorites`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,

        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(UserFavoritesVoFromJSON));
    }

    /**
     * 查询用户收藏
     */
    async getFavorites(): Promise<Array<UserFavoritesVo>> {
        const response = await this.getFavoritesRaw();
        return await response.value();
    }

    /**
     * 发现栏
     */
    async getGridsRaw(): Promise<runtime.ApiResponse<Array<GridVo>>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // apikey-header-Authorization authentication
        }

        const response = await this.request({
            path: `/grids.json`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,

        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(GridVoFromJSON));
    }

    /**
     * 发现栏
     */
    async getGrids(): Promise<Array<GridVo>> {
        const response = await this.getGridsRaw();
        return await response.value();
    }

    /**
     * 查询路线
     */
    async getShuttleRaw(requestParameters: GetShuttleRequest): Promise<runtime.ApiResponse<Array<Array<ShuttleRouteVo>>>> {
        if (requestParameters.weekday === null || requestParameters.weekday === undefined) {
            throw new runtime.RequiredError('weekday','Required parameter requestParameters.weekday was null or undefined when calling getShuttle.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        if (requestParameters.weekday !== undefined) {
            queryParameters['weekday'] = requestParameters.weekday;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // apikey-header-Authorization authentication
        }

        const response = await this.request({
            path: `/shuttle/getRoutes`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,

        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * 查询路线
     */
    async getShuttle(weekday: GetShuttleWeekdayEnum): Promise<Array<Array<ShuttleRouteVo>>> {
        const response = await this.getShuttleRaw({ weekday: weekday });
        return await response.value();
    }

    /**
     * 查询校车站
     */
    async getStationsRaw(): Promise<runtime.ApiResponse<Array<PositionVo>>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // apikey-header-Authorization authentication
        }

        const response = await this.request({
            path: `/shuttle/stations.json`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,

        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PositionVoFromJSON));
    }

    /**
     * 查询校车站
     */
    async getStations(): Promise<Array<PositionVo>> {
        const response = await this.getStationsRaw();
        return await response.value();
    }

    /**
     * 新增用户收藏
     */
    async saveFavoritesRaw(requestParameters: SaveFavoritesRequest): Promise<runtime.ApiResponse<SimpleDataVoLong>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // apikey-header-Authorization authentication
        }

        const response = await this.request({
            path: `/user/favorites`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserFavoritesDtoToJSON(requestParameters.userFavoritesDto),

        });

        return new runtime.JSONApiResponse(response, (jsonValue) => SimpleDataVoLongFromJSON(jsonValue));
    }

    /**
     * 新增用户收藏
     */
    async saveFavorites(userFavoritesDto?: UserFavoritesDto): Promise<SimpleDataVoLong> {
        const response = await this.saveFavoritesRaw({ userFavoritesDto: userFavoritesDto });
        return await response.value();
    }

    /**
     * 上传图片
     */
    async uploadShuttleImageRaw(requestParameters: UploadShuttleImageRequest): Promise<runtime.ApiResponse<object>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // apikey-header-Authorization authentication
        }

        const response = await this.request({
            path: `/shuttle/uploadImage`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: InlineObjectToJSON(requestParameters.inlineObject),

        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * 上传图片
     */
    async uploadShuttleImage(inlineObject?: InlineObject): Promise<object> {
        const response = await this.uploadShuttleImageRaw({ inlineObject: inlineObject });
        return await response.value();
    }

}

/**
    * @export
    * @enum {string}
    */
export enum GetShuttleWeekdayEnum {
    MON = 'MON',
    TUE = 'TUE',
    WED = 'WED',
    THU = 'THU',
    FRI = 'FRI',
    SAT = 'SAT',
    SUN = 'SUN'
}
