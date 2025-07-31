# VOD API – Xtream + TMDB

API REST desenvolvida com NestJS que integra dados de filmes da plataforma Xtream Codes e os enriquece com informações do TMDB. Persistência em SQLite com cache em Redis.

##  Funcionalidades Implementadas

###  Sincronização VOD
- [x] Consome endpoints da Xtream: `get_vod_categories`, `get_vod_streams`, `get_vod_info`.
- [x] Persiste categorias e filmes no banco SQLite via Prisma.
- [x] Enriquecimento de dados dos filmes com informações do TMDB.
- [x] Registro de execução com status, quantidade de itens inseridos/atualizados/pulados e erros.

###  API Pública
- [x] `GET /movies/streams`: Lista de filmes com filtros e paginação.
- [x] `GET /movies/info/:vodId`: Dados detalhados do filme via Xtream.
- [x] `GET /movies/combined/:vodId`: Dados combinados (Xtream + TMDB).
- [x] `GET /categories`: Lista todas as categorias.

###  Documentação
- [x] Swagger disponível em runtime (`/docs`).

---

##  Tecnologias Utilizadas

- **NestJS** (TypeScript)
- **SQLite** com **Prisma**
- **Redis** para cache e performance
- **TMDB API** para enriquecimento dos dados
- **Axios**, **RxJS**, **Swagger**

---

##  Instalação e Execução

### 1. Clone o repositório e instale dependências
```bash
npm install
```

### 2. Configure o ambiente
Crie um arquivo `.env` com as seguintes variáveis:
```env
BASE_URL=
XTREAM_USERNAME=
XTREAM_PASSWORD=
DBBASE_URL=
TMDB_API_TOKEN=
TMDB_API_KEY=
```

### 3. Gere o client do Prisma
```bash
npx prisma generate
```

### 4. Rode o projeto
```bash
npm run start:dev
```

### 5. (Opcional) Use Docker
```bash
docker compose up --build
```

---

##  Testes

```bash
npm run test
```

---

##  Estrutura das Rotas

| Método | Rota                        | Descrição                                           |
|--------|-----------------------------|-----------------------------------------------------|
| GET    | `/categories`               | Lista todas as categorias                          |
| GET    | `/movies/streams`           | Lista filmes com filtros e paginação               |
| GET    | `/movies/info/:vodId`       | Detalhes do filme diretamente da Xtream            |
| GET    | `/movies/combined/:vodId`   | Dados enriquecidos (Xtream + TMDB)                 |
| GET    | `/movies/sync`              | Sincroniza todos os dados com TMDB e Xtream        |

---

##  Observações

- Todas as chamadas externas à Xtream e TMDB são cacheadas em Redis.
- A sincronização persiste os dados em tabelas normalizadas (`vod_items`, `tmdb_movies`, `vod_categories`).
- Swagger UI disponível em `/docs` para explorar a API.

---

##  Estrutura do Banco de Dados

- `vod_categories`: id, name, xtream_category_id
- `vod_items`: id, xtream_vod_id, title_original, title_normalized, category_id, stream_icon, added_at_xtream, container_extension
- `tmdb_movies`: vod_item_id, tmdb_id, overview, poster_path, backdrop_path, release_date, runtime, vote_average, genres (JSON)
- `sync_runs`: id, started_at, finished_at, status, inserted, updated, skipped, errors_json

---

##  Licença

Projeto para fins de avaliação técnica.