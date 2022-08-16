import {NgModule} from '@angular/core';
import {DelonFormModule, WidgetRegistry} from '@delon/form';

import {SharedModule} from '../shared.module';
import {TestWidget} from './test/test.widget';
import {SfDictComponent} from '../components/sf-dict/sf-dict.component';
import {SelectEmployeeButtonComponent} from "../components/select-employee-button/select-employee-button.component";

export const SCHEMA_THIRDS_COMPONENTS = [TestWidget, SfDictComponent, SelectEmployeeButtonComponent];

@NgModule({
  declarations: SCHEMA_THIRDS_COMPONENTS,
  imports: [SharedModule, DelonFormModule.forRoot()],
  exports: SCHEMA_THIRDS_COMPONENTS
})
export class JsonSchemaModule {
  constructor(widgetRegistry: WidgetRegistry) {
    widgetRegistry.register(TestWidget.KEY, TestWidget);
    widgetRegistry.register(SfDictComponent.KEY, SfDictComponent);
    widgetRegistry.register(SelectEmployeeButtonComponent.KEY, SelectEmployeeButtonComponent);
  }
}
