import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';
import { NovelListComponent } from './components/novel-list/novel-list.component';
import { NovelEditorComponent } from './components/novel-editor/novel-editor.component';

const routes: Routes = [
  {
    path: 'novel',
    component: NovelListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'novel/:id',
    component: NovelEditorComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NovelRoutingModule {}
