import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';
import { STWidgetRegistry } from '@delon/abc/st';
import { StEllipsisComponent } from '../components/st-ellipsis/st-ellipsis.component';

export const STWIDGET_COMPONENTS = [StEllipsisComponent];

@NgModule({
  declarations: STWIDGET_COMPONENTS,
  imports: [SharedModule],
  exports: [...STWIDGET_COMPONENTS]
})
export class STWidgetModule {
  constructor(widgetRegistry: STWidgetRegistry) {
    widgetRegistry.register(StEllipsisComponent.KEY, StEllipsisComponent);
  }
}
