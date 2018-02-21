import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { TasksPage } from '../tasks/tasks';
import { SyncPage } from '../sync/sync';
import { InfoPage } from '../info/info';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabTasks = TasksPage;
  tabInfo = InfoPage;
  tabSync = SyncPage;
  tabSettings = SettingsPage;

  constructor() {

  }
}
