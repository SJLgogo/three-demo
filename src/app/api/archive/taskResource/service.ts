/* eslint-disable */
/*
 * Automatically generated by 'ng g ng-alain:sta'
 * @see https://ng-alain.com/cli/sta
 *
 * Inspired by: https://github.com/acacode/swagger-typescript-api
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { BaseQuery, HttpResultListTaskDTO, HttpResultPageTaskDTO, HttpResultString, HttpResultTaskDTO, TaskDTO } from '../models';
import { STABaseService, STAHttpOptions } from '../_base.service';

@Injectable({ providedIn: 'root' })
export class TaskResourceService extends STABaseService {
  /**
   * 修改 - 修改
   *
   * @request PUT:/api/task
   */
  update(req: TaskDTO, options?: STAHttpOptions): Observable<HttpResultTaskDTO> {
    return this.request('PUT', `/api/task`, {
      body: req,
      ...options
    });
  }

  /**
   * 添加 - 添加
   *
   * @request POST:/api/task
   */
  save(req: TaskDTO, options?: STAHttpOptions): Observable<HttpResultTaskDTO> {
    return this.request('POST', `/api/task`, {
      body: req,
      ...options
    });
  }

  /**
   * 分页查询接口 - 分页查询接口
   *
   * @request POST:/api/task/page-all
   */
  pageAll(req: BaseQuery, options?: STAHttpOptions): Observable<HttpResultPageTaskDTO> {
    return this.request('POST', `/api/task/page-all`, {
      body: req,
      ...options
    });
  }

  /**
   * 通过id查询接口 - 通过id查询接口
   *
   * @request GET:/api/task/{id}
   */
  findDtoById(id: number, options?: STAHttpOptions): Observable<HttpResultTaskDTO> {
    return this.request('GET', `/api/task/${id}`, {
      ...options
    });
  }

  /**
   * 通过id逻辑删除接口 - 通过id逻辑删除接口
   *
   * @request DELETE:/api/task/{id}
   */
  deleteById(id: number, options?: STAHttpOptions): Observable<HttpResultString> {
    return this.request('DELETE', `/api/task/${id}`, {
      ...options
    });
  }

  /**
   * 全量查询接口 - 全量查询接口
   *
   * @request GET:/api/task/find-all
   */
  findAll(options?: STAHttpOptions): Observable<HttpResultListTaskDTO> {
    return this.request('GET', `/api/task/find-all`, {
      ...options
    });
  }
}