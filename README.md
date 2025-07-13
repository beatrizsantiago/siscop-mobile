<h1 align="center">Siscop - Mobile App</h1>

### ✨ Sobre

<h4>Aplicativo feito em react native para o Hackathon da Pós Tech FIAP</h4>

<b>Versão:</b> 1.0.0

### 📌 Stack de Desenvolvimento

- [expo](https://expo.dev/);
- [styled-components](https://styled-components.com/) para estilização de componentes;
- [firebase](https://firebase.google.com) para armazenamento de dados;
- [date-fns](https://date-fns.org/) para lidar com datas;
- [react-native-maps](https://github.com/react-native-maps/react-native-maps) para utilização de mapas;
- [react-native-gifted-charts](https://gifted-charts.web.app/) para lidar com os gráficos;
- [react-navigation](https://reactnavigation.org/) para roteamento da aplicação;

### 🛠 Ferramentas
- IDE: [VSCode](https://code.visualstudio.com/);
- [Android Studio](https://developer.android.com/studio);

---

### 🔧 Configurações do Firebase

<b>1. Criar conta</b>

  - Crie uma conta ou [acesse o console](https://console.firebase.google.com/) do Firebase usando sua conta Google.

<b>2. Criar um novo projeto no Firebase</b>

  - Siga este [guia oficial](https://firebase.google.com/docs/web/setup) para criar um novo projeto.
  - Após criar o projeto, acesse a aba Configurações do Projeto (ícone de engrenagem no menu lateral).
  - Na seção Suas Apps, clique em "Web" para registrar uma nova aplicação Web.
  - Ao finalizar o registro, o Firebase irá exibir o seu Firebase Config — um objeto contendo informações como apiKey, projectId, storageBucket, entre outros.

<b>3. Configuração do ambiente</b>

  1. **Crie um arquivo chamado** `env.ts` **na raiz do projeto.**

  2. **Copie e preencha a estrutura abaixo com os dados fornecidos pelo Firebase:**

   ```js
    // env.ts

    export const FIREBASE_API_KEY = 'API_KEY';
    export const FIREBASE_AUTH_DOMAIN = 'DOMINIO.firebaseapp.com';
    export const FIREBASE_PROJECT_ID = 'PROJECT_ID';
    export const FIREBASE_STORAGE_BUCKET = 'BUCKET.appspot.com';
    export const FIREBASE_MESSAGING_SENDER_ID = 'SENDER_ID';
    export const FIREBASE_APP_ID = 'APP_ID';
  ```

  3. Um arquivo de exemplo chamado ```env.example.ts``` está disponível no projeto. Use-o como base para criar o seu arquivo de configuração:

  ```bash
  cp env.example.ts env.ts
  ```

<b>4. Habilitar Autenticação e Firestore</b>

  No console do Firebase, acesse:

  - [Autenticação](https://firebase.google.com/docs/auth/web/email-link-auth): Habilite o método de email/senha e o login com o google para autenticação.
  - [Firestore](https://firebase.google.com/docs/firestore/quickstart): Crie um banco de dados Firestore.

<b>5. Configurar regras do Firestore</b>

  No Firestore, adicione as [regras de acesso](https://firebase.google.com/docs/firestore/security/get-started) abaixo (configuração disponível na aba de "Regras"):
  ```bash
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if true;
        }
      }
    }
  ```

<b>6. Criar índices para consultas</b>

  - Este projeto utiliza de consultas compostas para as notificações, por isso você precisará [criar índices](https://firebase.google.com/docs/firestore/query-data/indexing) no Firestore. Isso pode ser feito diretamente pelo console (configuração disponível na aba de "Índices") ou seguindo as mensagens de erro que o Firestore retorna no log da aplicação.
  - Este são os índices do projeto:

  <table>
    <thead>
      <tr>
        <th>ID da coleção</th>
        <th>Campos indexados</th>
        <th>Escopo da consulta</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>sales</td>
        <td>farm_id (Crescente), created_at (Crescente), __name__ (Crescente)</td>
        <td>Coleta</td>
        <td>Ativado</td>
      </tr>
      <tr>
        <td>inventory</td>
        <td>farm_id (Crescente), state (Crescente), created_at (Crescente), __name__ (Crescente)</td>
        <td>Coleta</td>
        <td>Ativado</td>
      </tr>
      <tr>
        <td>goals</td>
        <td>farm_id (Crescente), finished (Decrescente), kind (Crescente) ,created_at (Crescente), __name__ (Decrescente)</td>
        <td>Coleta</td>
        <td>Ativado</td>
      </tr>
    </tbody>
  </table>

---

### 🔧 Configurações do Google Maps

Para utilizar o Google Maps no projeto é necessário configurar uma chave de API na plataforma da Google Cloud.

#### 🛠️ Etapas de configuração

1. **Acesse o Console do Google Cloud:**

   [https://console.cloud.google.com/](https://console.cloud.google.com/)

2. **Crie um novo projeto** (ou selecione um existente).

3. No menu lateral, vá em **"APIs e serviços"**.

4. **Habilite as seguintes APIs:**

   - Maps JavaScript API
   - Maps SDK for Android
   - Maps SDK for iOS

5. Vá para **"Chaves e credenciais"** e clique em **"Criar credenciais" > "Chave de API"**.

#### 🧩 Configuração no `app.json`

Adicione a chave de API nas configurações de `android` e `ios` no `app.json`:

```json
{
  "expo": {
    // ... outras configurações

    "ios": {
      "config": {
        "googleMapsApiKey": "SUA_API_KEY_DO_GOOGLE"
      },
      "supportsTablet": true
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "SUA_API_KEY_DO_GOOGLE"
        }
      }
    }
  }
}
```

---

### 🎯 Getting Started

- [Instale](https://developer.android.com/studio/install) e configure o Android Studio em seu computador. 

- [Crie um dispositivo virtual](https://developer.android.com/studio/run/managing-avds) no Android Studio para rodar o projeto.

Verificar Instalação do Node.js

- Abra um terminal e execute o comando:
    
  ```bash
  node -v
  ```
    
- Se aparecer uma versão como a listada abaixo significa que o Node.js está instalado corretamente. Caso contrário, baixe e instale-o a partir do [site oficial](https://nodejs.dev/en/learn/) ou procure "Node.js" no Google.
    
  ```bash
  v20.18.0
  ```

Instalar as dependências

```bash
npm install
```

Iniciar projeto para android:

```bash
npm run android
```

Iniciar projeto para ios:

```bash
npm run ios
```

Após os comandos acima, o emulador será iniciado automaticamente e instalará o app Expo para utilizar o projeto.