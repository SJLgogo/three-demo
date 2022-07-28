import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LineNetworkService {
  constructor(private http: _HttpClient) {}
  /**
   * 获取所有线路
   */
  findAllLine() {
    return this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/findAllLine`);
  }

  getAllStationsByLineIds(post: any) {
    return this.http.post(`/service/emergency-base-config/admin/adminMetroLineApi/getAllStationsByLineIds`, post);
  }

  getAllStationAndSectionByLineIds(post: any) {
    return this.http.post(`/service/emergency-base-config/admin/adminMetroLineApi/getAllStationAndSectionByLineIds`, post);
  }

  getAllSectionsByLineIds(lineId: any) {
    return this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/getAllSectionsByLineIds/${lineId}`);
  }
  /**
   * 根据线路id查询线路下面的站点
   *
   * @param id
   */
  findStationByLineId(lineId: any) {
    return this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/getAllStationsByLineIds/${lineId}`);
  }

  getAllStationsPage() {
    return this.http.post(`/api/admin/station/list-all`, { page: 1, pageSize: 20 });
  }

  getAllStations(): Observable<any> {
    return this.http.get(`/api/admin/station/list`);
  }

  saveStation(post: any) {
    return this.http.post(`/api/admin/station`, post);
  }

  deleteStationById(id: any) {
    return this.http.delete(`/api/admin/station/${id}`);
  }
}
