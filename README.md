<h1 align="center">📇 ReservasGov</h1>

## :memo: Descrição
Projeto desenvolvido como didática de bak-end para a turma Bootcamp Web Dev T23/2022/Enap/ Ironhack com conteúdos que englobam o universo da criação de um sistema de reservas de recursos (equipamentos e salas), para ser usado nos órgão do Governo. 

## :books: Sobre o projeto
* <b> Este projeto foi criado no terceiro módulo da Ironhack São Paulo - Web Development Bootcamp.
* <b> API REST simples para permitir CRUD completo no terminal: [[https://](https://reservasgov.netlify.app)](https://reservasgov.netlify.app/)
* <b> Atenção: Uso exclusivo

## :wrench: Uso
* Funcionalidade CRUD completa

## :rocket:Rotas do Usuário
<b> Criar Usuário:
```
POST /user/signup
```
<b> Conectar usuário:
```
POST /user/login
```
<b> Perfil do usuário:
```
GET /user/profile
```
<b> Editar usuário:
```
PUT /user/edit
```
<b> Deletar usuário:
```
DELETE: /user/delete/id
```
## :rocket:Rotas dos Recursos
<b> Criar Recurso:
```
POST /resource/create-resource
```
## :rocket:Rotas do Booking
<b> Criar Agendamento:
```
POST /booking/new
```
<b> Obter disponibilidade de horários para agendamento:
```
POST /booking/availability
```
<b>Obter reservas do usuário:
```
GET /booking/my-bookings
```
<b> Reservas de recursos do gestor:
```
GET /booking/gestor-bookings
```
<b> Editar reserva:
```
PUT /booking/edit/:bookingId
```
<b> Aprovar reserva:
```
PUT /booking/aprove/:bookingId
```
<b> Cancelar reserva:
```
DELETE /booking/delete/:bookingId
```
<b> Verificar todas as reserva:
```
GET /booking/all
```

## :rocket: Desenvolvedores GitHub

* <b> [Marcio Silva](https://github.com/msdrum)
* <b> [Vitor Martins](https://github.com/cmsvtr)
* <b> [Rodrigo Sotolani](https://github.com/rsotolani)
* <b> [karen Ortiz](https://github.com/kaluize)
* <b> [Ana Aleixo](https://github.com/AnaAleixo)
  
