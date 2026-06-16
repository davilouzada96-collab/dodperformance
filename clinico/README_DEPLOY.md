# Deploy do clinico-gate — passo a passo

> Tudo aqui roda do seu lado. As chaves nunca aparecem no código nem passam por mim — você define os secrets você mesmo, criptografados.

---

## 1. Resend — criar conta e verificar o domínio

1. Crie uma conta gratuita em https://resend.com/signup
2. No menu, vá em **Domains → Add Domain** e informe `dodperformance.com.br`.
3. O Resend mostra registros de DNS (DKIM, SPF, DMARC). No Cloudflare, vá em **DNS Records** do seu domínio e adicione exatamente esses registros.
4. Volte ao Resend e clique em **Verify DNS Records**. Quando ficar `Verified`, o domínio está pronto para enviar.
5. Vá em **API Keys → Create API Key**, dê um nome (ex. `clinico-gate`) e copie a chave para um lugar seguro. Você só a vê uma vez.

O endereço remetente `FROM_EMAIL` no `wrangler.toml` precisa ser do domínio verificado. Ex. `acesso@dodperformance.com.br`.

---

## 2. Wrangler — preparar a publicação

Se ainda não tem o wrangler:
```bash
npm install -g wrangler
wrangler login
```

Entre na pasta do worker (onde estão `clinico-gate.js` e `wrangler.toml`):
```bash
cd clinico
```

---

## 3. Secrets — você define, criptografados

Gere um segredo longo e aleatório para assinar os tokens (ex. no terminal):
```bash
openssl rand -hex 32
```

Copie o resultado. Agora defina os dois secrets (cada comando vai pedir o valor — cole quando solicitado):
```bash
wrangler secret put SIGNING_SECRET   # cole o valor gerado acima
wrangler secret put RESEND_API_KEY   # cole a chave do Resend
```

Eu nunca vejo esses valores. Eles ficam criptografados na sua conta Cloudflare.

---

## 4. Publicar

```bash
wrangler deploy
```

Isso coloca o Worker na rota `dodperformance.com.br/api/clinico/*`.

Teste rápido (deve responder `{"verified":false}`):
```bash
curl https://dodperformance.com.br/api/clinico/session
```

---

## 5. Ligar a porta ao Worker

No arquivo `clinico-gate.js` (front-end, não o Worker), troque:
```js
const CLINICO_API = "demo"     // modo demonstração
```
por:
```js
const CLINICO_API = "api/clinico"  // verificação real pelo Cloudflare Worker
```

Faça o deploy do site (commit/push) e pronto — a porta passa a enviar o link de verdade, e a confirmação por e-mail abre a sessão.

---

## Como o fluxo funciona

1. Usuário preenche e-mail + papel + conselho → **pedir link** (e-mail com link assinado, expira em 15 min)
2. Clicar no link → **valida e abre uma sessão de 8h** (cookie first-party)
3. O clínico libera → **a honestidade reativa**

---

## Rotas do Worker

| Método | Rota | Função |
|--------|------|--------|
| POST | `/api/clinico/request` | Envia link de acesso |
| GET | `/api/clinico/verify?token=...` | Valida e abre sessão |
| GET | `/api/clinico/session` | Verifica sessão ativa |
| POST | `/api/clinico/logout` | Encerra a sessão |

---

## Endurecer depois (opcional, próximos ciclos)

- **Uso único do link** — guardar o `jti` do token usado num KV para impedir reaproveitamento dentro da janela.
- **Domínios institucionais** — recusar e-mails pessoais (gmail/hotmail) e exigir domínio de instituição/conselho.
- **CRM ativo** — verificação profunda que ficou estacionada no fundamento.
