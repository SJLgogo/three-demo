import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  /**
   * 高德地图点击事件传递数据
   */
  private subject = new Subject<any>();
  /**
   * 加载数据修改高德地图
   */
  private markerSubject = new Subject<any>();

  constructor() {}

  sendMarkerMessage(message: any) {
    this.subject.next(message);
  }

  clearMarkerMessages() {
    // @ts-ignore
    this.subject.next();
  }

  getMarkerMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  sendMessage(message: any) {
    this.markerSubject.next(message);
  }

  clearMessages() {
    // @ts-ignore
    this.markerSubject.next();
  }

  getMessage(): Observable<any> {
    return this.markerSubject.asObservable();
  }
}
