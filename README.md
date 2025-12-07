💈 BarberApp

Aplicação web completa para gerenciamento de agendamentos e administração de uma barbearia — rápida, moderna e dividida em Frontend (Next.js) e Backend (Express.js).

🚀 Sobre o projeto

O BarberApp foi desenvolvido para facilitar o agendamento de serviços de barbearia de forma totalmente online.
Clientes podem marcar horários facilmente, enquanto administradores possuem um painel completo para gerenciar a barbearia.

A aplicação é dividida em:

Frontend: Next.js + React

Backend: Node.js + Express + Prisma + MongoDB (ou seu banco atual)

⚙️ Funcionalidades
🧔 Agendamentos para Clientes

Página pública moderna para escolher serviço, data e horário.

Processo simples e rápido para criação de agendamentos.

🔐 Administração Protegida

Sistema de login exclusivo para administradores.

Sessão segura com JWT ou cookies (dependendo de como está usado).

📊 Painel Administrativo

Visualização de todos os agendamentos.

Controle de status: Pendente, Confirmado, Cancelado, etc.

Gerenciamento de profissionais, serviços e clientes.

Dashboard com informações essenciais.

🛠️ Tecnologias Utilizadas
Frontend (Next.js)

Next.js

React

TailwindCSS

Axios

Context API / Hooks

Backend (Express.js)

Node.js + Express

Prisma ORM

Banco de dados (MongoDB)

JWT para autenticação

CORS configurado

Rotas REST organizadas

📦 Estrutura do Projeto
/BarberApp
  ├── frontend/        → Projeto Next.js
  └── backend/         → Projeto Express.js

▶️ Como rodar o projeto
Frontend
cd frontend
npm install
npm run dev

Backend
cd backend
npm install
npm run dev

🌐 Funcionalidades em Produção
https://www.kingsbarber.com.br/
