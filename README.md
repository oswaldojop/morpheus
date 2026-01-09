# Morpheus System 💸

Sistema de Gestão Financeira Inteligente com IA (Gemini API).

## Como Hospedar no GitHub Pages

1. Crie um novo repositório no GitHub.
2. Envie os arquivos extraídos deste ZIP para o repositório.
3. No GitHub, vá em **Settings > Pages**.
4. Em **Build and deployment**, selecione a branch `main` e a pasta `/(root)`.
5. Salve e aguarde o deploy.

## Configuração da API Key

Este sistema utiliza a API do Google Gemini. Como o GitHub Pages é estático, a variável `process.env.API_KEY` não estará disponível automaticamente.
Para funcionar em produção, você deve:
1. Abrir o arquivo `services/geminiService.ts`.
2. Substituir `process.env.API_KEY` pela sua chave real (não recomendado para repositórios públicos) OU implementar um campo de input para que o usuário insira sua própria chave.

## Desenvolvimento Local

```bash
npm install
npm run dev
```
