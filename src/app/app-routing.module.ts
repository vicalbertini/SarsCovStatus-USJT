import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { CadastroComponent } from './Hospital/cadastro/cadastro.component';
import { LoginComponent } from './Hospital/login/login.component';

import { LoginPacienteComponent } from './painel/Paciente/login-paciente/login-paciente.component';


import { CadastroUsuarioComponent } from './painel/usuario-inserir/cadastro-usuario.component';
import { PainelControleComponent } from './painel/painel-controle/painel-controle.component';
import {UsuarioAtualizaComponent} from './painel/usuario-atualiza/usuario-atualiza.component';
import { UsuarioVisualizacaoComponent } from './painel/usuario-visualizacao/usuario-visualizacao.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './Hospital/auth.guard'
import { AuthPacienteGuard} from './painel/Paciente/login-paciente/auth.paciente.guard'


const routes: Routes = [
  { path: "chat", component: ChatComponent},
  { path: "profile/:idUsuario", component: UsuarioVisualizacaoComponent, canActivate: [AuthPacienteGuard]},
  { path: "editar/:idUsuario", component: UsuarioAtualizaComponent, canActivate: [AuthGuard]},
  { path: "cadastro-paciente", component: CadastroUsuarioComponent, canActivate: [AuthGuard]},
  { path: "painel-controle", component: PainelControleComponent, canActivate: [AuthGuard]},
  { path: "login-paciente", component: LoginPacienteComponent},
  { path: "cadastro", component: CadastroComponent},
  { path: "login", component: LoginComponent},
  { path: "", component: HomeComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard,
    AuthPacienteGuard
  ]
})
export class AppRoutingModule { }
