import { EventEmitter, Injectable } from '@angular/core';
import { Subject, Subscription, Unsubscribable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RxjsChangeService {
  Change = new Subject();

  constructor() {}

  emit(value: any) {
    this.Change.next(value);
  }

  subscribe(fn: any): Subscription {
    return this.Change.subscribe(fn);
  }

  unSubscribe(): void {
    this.Change.unsubscribe();
  }
}
