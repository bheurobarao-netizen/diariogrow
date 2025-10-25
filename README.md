# Grow Diary - Versão Offline

Diário de cultivo 100% local e offline. Todos os dados são armazenados no navegador usando IndexedDB.

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em: `http://localhost:5173`

## 🔐 Autenticação

Na primeira vez que você acessar, será solicitado criar um PIN de 4 dígitos.

**Senha padrão do administrador:** `12345grow`

Você pode alterar a senha padrão editando o arquivo `.env`:

```
VITE_ADMIN_PASSWORD=sua_senha_aqui
```

## 💾 Backup e Restauração

### Criar Backup

1. Acesse a página de Backup no menu
2. Clique em "Exportar Backup"
3. Um arquivo JSON será baixado com todos os seus dados

### Restaurar Backup

1. Acesse a página de Backup
2. Clique em "Selecionar Arquivo"
3. Escolha o arquivo de backup (.json)
4. Selecione o modo de importação:
   - **Mesclar**: Mantém os dados existentes e adiciona os novos
   - **Substituir**: Remove todos os dados atuais e carrega apenas o backup
5. Clique em "Importar Dados"

## 📦 Armazenamento

Todos os dados são armazenados localmente no navegador usando:
- **Dexie.js** (IndexedDB) para dados estruturados
- **LocalStorage** para autenticação
- **Base64** para imagens e vídeos

## 🌐 Funcionamento Offline

O aplicativo funciona **100% offline** após a primeira carga. Todas as funcionalidades estão disponíveis sem conexão com internet:

- ✅ Gerenciamento de plantas
- ✅ Diário de cultivo
- ✅ Tendas e equipamentos
- ✅ Insumos e colheitas
- ✅ Estatísticas e calendário
- ✅ Backup e restauração

## 🔧 Tecnologias

- **React** + **TypeScript**
- **Vite** (build tool)
- **Dexie.js** (IndexedDB)
- **Zustand** (gerenciamento de estado)
- **Tailwind CSS** (estilização)
- **Shadcn/ui** (componentes)

## 📁 Estrutura de Dados

O backup contém as seguintes tabelas:
- `plants` - Informações das plantas
- `entries` - Entradas do diário
- `tents` - Tendas de cultivo
- `equipment` - Equipamentos
- `insumos` - Nutrientes e suplementos
- `colheitas` - Registros de colheita
- `curas` - Processo de cura
- `tasks` - Tarefas e lembretes
- `breedingEvents` - Eventos de breeding

## ⚠️ Importante

- Os dados são armazenados apenas no navegador local
- Se limpar os dados do navegador, perderá todas as informações
- **Faça backups regulares!**
- Os backups são arquivos JSON que podem ser guardados em qualquer lugar

## 🛠️ Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 📝 Licença

Este projeto é de uso pessoal e privado.
