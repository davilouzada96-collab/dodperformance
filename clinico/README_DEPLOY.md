# Operação da área acadêmica

## Estado atual

A rota `/clinico/` usa cadastro acadêmico local implementado em `gate.js`.
Não há autenticação remota, envio de e-mail, cobrança ou consumo de créditos.
O e-mail é validado no navegador e não é armazenado; somente papel,
instituição e ano ficam no `localStorage` do próprio navegador.

O build público copia apenas os arquivos estáticos necessários. Ele não publica
`clinico-gate.js`, `wrangler.toml` nem esta documentação.

## Worker legado

`clinico-gate.js` e `wrangler.toml` são artefatos históricos e **não devem ser
implantados**. O Worker legado usa rotas e um modelo de acesso diferentes do
frontend atual. Ele permanece no repositório apenas para análise histórica.

Uma futura autenticação remota deve ser implementada como um projeto separado,
com contrato de API definido antes do código, testes de integração, rate limit,
segredos no Cloudflare e revisão explícita de privacidade. Até isso existir, o
modo local é o único fluxo suportado.
