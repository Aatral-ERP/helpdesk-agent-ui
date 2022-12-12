import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardsComponent } from 'src/app/_teams/boards/boards.component';
import { TeamsComponent } from 'src/app/_teams/teams/teams.component';
import { ViewTeamComponent } from 'src/app/_teams/view-team/view-team.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'boards', component: BoardsComponent },
  { path: 'all', component: TeamsComponent },
  { path: 'view/:id', redirectTo: 'view/:id/dashboard' },
  { path: 'view/:id/:tab', component: ViewTeamComponent },
  { path: '**', redirectTo: 'boards', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }
