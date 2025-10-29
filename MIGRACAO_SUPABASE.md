# Guia de Migração para Supabase (Organização diariogrow)

## Passo 1: Criar Novo Projeto no Supabase

1. Acesse https://supabase.com/dashboard
2. Entre na organização **diariogrow**
3. Clique em "New Project"
4. Configure o projeto:
   - Nome do projeto: Grow Diary (ou outro nome)
   - Database Password: Anote esta senha!
   - Região: Escolha a mais próxima
   - Plan: Free ou Pro (conforme sua necessidade)

## Passo 2: Executar SQL no Novo Projeto

1. No novo projeto, vá em **SQL Editor**
2. Cole e execute o SQL completo (arquivo `SCHEMA_COMPLETO.sql`)
3. Aguarde a execução completar

## Passo 3: Configurar Autenticação

1. Vá em **Authentication** > **Settings**
2. Em **Email Settings**:
   - ✅ Enable email signup
   - ✅ Enable email confirmations (pode desabilitar para testes)
3. Em **Site URL**:
   - Adicione a URL do seu app Lovable
4. Em **Redirect URLs**:
   - Adicione as URLs permitidas para redirect após login

## Passo 4: Obter Credenciais do Novo Projeto

1. Vá em **Project Settings** > **API**
2. Copie os seguintes valores:
   - **Project URL**: `https://[seu-projeto].supabase.co`
   - **anon/public key**: Chave pública
   - **service_role key**: Chave privada (não compartilhe!)

## Passo 5: Conectar ao Lovable

Após ter as credenciais, me envie para eu atualizar:
- Project URL
- Anon Key
- Project ID

Vou então:
1. Remover a integração Lovable Cloud
2. Configurar conexão manual com seu Supabase
3. Atualizar as variáveis de ambiente

## Passo 6: Testar

Após a configuração:
1. Teste o cadastro de novos usuários
2. Teste o login
3. Teste o upload de avatares
4. Verifique se os dados aparecem corretamente

---

## ⚠️ IMPORTANTE

- Guarde a senha do database em local seguro
- Não compartilhe a service_role key publicamente
- Configure corretamente as URLs de redirect
- Faça backup regular dos dados

## Observações sobre Dados Existentes

As tabelas já existentes no schema (`plants`, `entries`, `tents`, etc.) serão mantidas. Esta migração adiciona apenas:
- Tabela `profiles` para dados de usuário
- Bucket de storage `avatars`
- Políticas RLS necessárias
- Trigger para criar perfil automaticamente

## Suporte

Se encontrar erros durante a migração:
1. Copie a mensagem de erro completa
2. Me envie para análise
3. Podemos ajustar o SQL conforme necessário
