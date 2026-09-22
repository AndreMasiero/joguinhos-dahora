# Joguinhos da Hora

App instalável (PWA) que roda offline, com vários joguinhos dentro. Hoje tem o
**Truco do Boteco**; a ideia é ir empilhando outros na mesma casca.

## Estrutura

```
Joguinhos/
├── index.html          → menu principal (lista os jogos)
├── manifest.json        → configuração do app instalável (nome, ícone, etc.)
├── sw.js                → service worker: guarda tudo em cache pra funcionar offline
├── icons/                → ícone do app
├── fonts/                → fontes baixadas localmente (funciona sem internet)
├── run.py / iniciar.bat  → liga um servidor local pra testar/instalar
└── games/
    └── truco/
        └── index.html    → o jogo do Truco, sozinho na própria pasta
```

## Como rodar

Dar duplo clique no `index.html` **não funciona** para instalar nem para
cachear offline — o navegador bloqueia isso quando o arquivo é aberto direto
do disco (`file://`). É preciso servir por `http://localhost`:

1. Dê duplo clique em **`iniciar.bat`** (ou rode `python run.py` no terminal).
2. Ele abre o navegador em `http://localhost:8791`.
3. No Chrome/Edge, clique no ícone de instalar na barra de endereço (ou no
   botão "📲 Instalar app" que aparece na tela) para instalar como app de
   verdade, com ícone próprio.
4. Depois de instalado (ou só de ter aberto uma vez), o app funciona **sem
   internet**.

Pra jogar no celular, é preciso publicar essa pasta em algum lugar com HTTPS
(GitHub Pages, Netlify, Cloudflare Pages, etc.) — daí abre o link no celular e
instala do mesmo jeito. Posso ajudar com isso quando você quiser.

## Como adicionar um novo joguinho

1. Crie uma pasta em `games/<nome-do-jogo>/` com o `index.html` do jogo.
2. No `index.html` do novo jogo, aponte os links de fonte/ícone/manifest pra
   raiz (mesmo esquema usado no Truco: `../../fonts/fonts.css`,
   `../../icons/icon.svg`, `../../manifest.json`) e registre o service worker:
   ```html
   <script>
     if ('serviceWorker' in navigator) {
       navigator.serviceWorker.register('../../sw.js', { scope: '../../' });
     }
   </script>
   ```
3. Adicione uma entrada no array `GAMES` dentro de `index.html` (raiz), com
   ícone, título, descrição e o caminho (`games/<nome-do-jogo>/index.html`).
4. (Opcional) some a URL do novo jogo em `PRECACHE_URLS` no `sw.js` e suba o
   número de `CACHE_VERSION` — isso garante que quem já instalou o app recebe
   o jogo novo já em cache. Sem isso, o jogo também fica salvo offline, só que
   a partir da primeira vez que for aberto.
