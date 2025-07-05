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
- [react-navigation](https://reactnavigation.org/) para roteamento da aplicação;

### 🛠 Ferramentas
- IDE: [VSCode](https://code.visualstudio.com/);
- [Android Studio](https://developer.android.com/studio);

### 🔧 Configurações do Firebase

<b>1. Criar conta</b>

  - Crie uma conta ou [acesse o console](https://console.firebase.google.com/) do Firebase usando sua conta Google.

<b>2. Criar um novo projeto no Firebase</b>

  - Siga este [guia oficial](https://firebase.google.com/docs/web/setup) para criar um novo projeto.
  - Após criar o projeto, acesse a aba Configurações do Projeto (ícone de engrenagem no menu lateral).
  - Na seção Suas Apps, clique em "Web" para registrar uma nova aplicação Web.
  - Ao finalizar o registro, o Firebase irá exibir o seu Firebase Config — um objeto contendo informações como apiKey, projectId, storageBucket, entre outros.
  - Cole o conteúdo da configuração dentro de ```/firebase/config.ts```:
   ```js
    // /firebase/config.ts

    const firebaseConfig = {
      apiKey: "API_KEY",
      authDomain: "DOMINIO.firebaseapp.com",
      projectId: "PROJECT_ID",
      storageBucket: "BUCKET.appspot.com",
      messagingSenderId: "SENDER_ID",
      appId: "APP_ID"
    };
  ```

<b>3. Habilitar Autenticação e Firestore</b>

  No console do Firebase, acesse:

  - [Autenticação](https://firebase.google.com/docs/auth/web/email-link-auth): Habilite o método de email/senha e o login com o google para autenticação.
  - [Firestore](https://firebase.google.com/docs/firestore/quickstart): Crie um banco de dados Firestore.

<b>4. Configurar regras do Firestore</b>

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