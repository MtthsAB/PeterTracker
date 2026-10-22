# Peter Tracker

> Sempre um passo à frente.

App mobile feito como trabalho em grupo da disciplina **Interface Humano-Computador** do **Centro Universitário da Serra Gaúcha (FSG)**.

Ele parte de um cenário fictício: Mary Jane (MJ) acompanha Peter Parker pela cidade. Pelo app ela vê onde ele está e como está, conversa com ele e, numa emergência, aciona as autoridades. O foco do trabalho é a interface: fluxo de navegação, hierarquia visual, feedback ao usuário e prevenção de erros, como o botão de emergência que precisa ficar pressionado por 3 segundos.

## Funcionalidades

| Tela | O que faz |
|------|-----------|
| **Login** | Usuário e senha, opção "Lembrar senha" e aviso de erro com contador de tentativas (máximo de 5) |
| **Mapa** | Localização de Peter em tempo real, com endereço e botão para recentralizar |
| **Dashboard** | Humor de Peter, mini mapa, última localização e horário da última atualização |
| **Chat** | Conversa com Peter, envio da sua localização e atalho para ligar |
| **Chamada** | Tela de ligação. Se Peter não atender, o app pergunta se ele está em perigo |
| **Autoridades** | Escolhe para onde enviar o alerta (911 ou delegacia) e confirma segurando o botão por 3s |
| **Confirmado** | Mostra o protocolo, o horário de envio e o status do atendimento |

Se a localização de Peter ficar mais de 5 minutos sem atualizar, o Mapa e o Dashboard mostram um alerta.

> Os dados são **simulados** (`src/services/api.ts`). Não existe backend: Peter "se move" a cada 15s e responde às mensagens automaticamente.

## Tecnologias

- [Expo](https://expo.dev) (SDK 58) + React Native + TypeScript
- Expo Router para a navegação
- react-native-maps e expo-location para o mapa e o endereço
- Zustand para o estado global
- expo-secure-store para guardar as credenciais
- expo-haptics para a vibração de feedback
- Fontes Barlow e Barlow Condensed

## Como rodar

**Pré-requisitos:** [Node.js](https://nodejs.org) 20 ou superior no computador e o app **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)).

Na raiz do projeto, rode:

```bat
start.bat            REM celular e PC na mesma rede Wi-Fi
start.bat --tunnel   REM celular em outra rede
```

O script instala as dependências na primeira execução e mostra um QR code. Para abrir o app, escaneie o código com o Expo Go (Android) ou com a Câmera (iOS).

**Login de demonstração:** usuário `mj`, senha `peter123`

Se preferir rodar na mão:

```bash
cd peter-tracker
npm install
npx expo start
```

## Estrutura

```
PeterTracker/
├── start.bat                 # sobe o app e mostra o QR code
└── peter-tracker/            # projeto Expo
    ├── app.json
    ├── assets/
    └── src/
        ├── app/              # telas (rotas do Expo Router)
        │   ├── login.tsx
        │   ├── call.tsx
        │   ├── (tabs)/       # Mapa, Dashboard, Chat, Autoridades
        │   └── emergencia/   # Acionar autoridades e Confirmado
        ├── components/       # botões, campos, cards, bolhas do chat etc.
        ├── services/api.ts   # API simulada
        ├── store/            # estado (auth, Peter, chat)
        └── theme/tokens.ts   # cores, fontes e espaçamentos
```

## Equipe

| Nome |
|------|
| Giovanny Custodio Baratieri |
| Matheus Andrighetti Borella |
| Natália Bortolosso |
| Patrick de Aguiar Pereira |
| Tomás Winkler Angeli |
| Vinicius Toigo de Freitas |

**Professor(a):** Giovanni Guizzo Da Rocha

---

Projeto acadêmico, sem fins comerciais. Peter Parker, Mary Jane e Homem-Aranha são marcas da Marvel.
