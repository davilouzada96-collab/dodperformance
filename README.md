# DOD Performance

Base oficial do site DOD Performance.

Esta pasta e o ponto de verdade para evolucao, revisao e deploy do projeto:

```bash
/Users/davilouzada/Documents/dodperformance--main
```

A raiz `index.html` e a home publica dos cards cientificos. A pagina `ai-ecg-risco-cardioembolico/index.html` e uma pagina editorial especifica ligada a essa base.

## Estrutura

- `index.html`: home publica dos cards cientificos, servicos, metodo e contato.
- `ai-ecg-risco-cardioembolico/index.html`: pagina editorial de AI-ECG e risco cardioembolico.
- `assets/css/reset.css`: normalizacao base.
- `assets/css/tokens.css`: cores, tipografia, raios, sombras, espacamentos e breakpoints.
- `assets/css/layout.css`: containers e secoes globais.
- `assets/css/components.css`: header, navegacao, botoes, cards, filtros, modal e footer.
- `assets/css/pages/home.css`: estilos especificos da home.
- `assets/css/pages/research-cards.css`: estilos da biblioteca de cards e modal.
- `assets/css/pages/ai-ecg.css`: estilos da pagina AI-ECG.
- `assets/js/main.js`: inicializacao dos comportamentos.
- `assets/js/navigation.js`: menu mobile.
- `assets/js/forms.js`: retorno basico do formulario de contato.
- `assets/js/research-data.js`: fonte editorial oficial dos cards cientificos.
- `assets/js/research-cards.js`: busca, filtros, modal e copia de citacao.
- `assets/js/ui/accordion.js`: comportamento de acordeoes quando a pagina usar esse padrao.
- `assets/js/ui/theme.js`: suporte a tema quando houver controle de tema.
- `assets/img/brand/`: imagens institucionais preservadas.

## Convencoes

- A home deve usar os dados de `assets/js/research-data.js` para renderizar cards.
- Conteudo editorial dos cards deve ficar em `assets/js/research-data.js`.
- Paginas editoriais especificas devem ficar em pastas proprias na raiz.
- Classes CSS em blocos descritivos.
- JavaScript em modulos pequenos por comportamento.
- Sem dependencias externas enquanto o site for estatico.
- Referencias devem ser trazidas para esta base antes de qualquer deploy.
- Arquivos locais de IDE, cache, QA e screenshots devem permanecer ignorados pelo Git.

## Validacao local

```bash
python3 -m http.server 4173
```

Acesse `http://localhost:4173` para validar a home e `http://localhost:4173/ai-ecg-risco-cardioembolico/` para validar a pagina AI-ECG.
