import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  constructor(private http: _HttpClient) {}
  // /**
  //  * 获取所有线路
  //  */
  // findAllLine() {
  //   return this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/findAllLine`);
  // }

  /**
   * 根据传入的不同类别获取对应的字典数据
   *
   * @param post
   */
  getAllDictionaryByCategory(category: any) {
    return this.http.get(`/service/emergency-base-config/admin/dictionary/getByCategory/${category}`);
  }
}
