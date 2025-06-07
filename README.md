# Sviluppo Sviluppo di un sistema backend per la gestione dei parcheggi

Il seguente progetto è stato sviluppato come parte dell’esame di Programmazione Avanzata (A.A. 2024/2025) presso l'Università Politecnica delle Marche, all’interno del corso di Laurea Magistrale in Ingegneria Informatica e dell’Automazione (LM-32). Il sistema realizzato è un back-end che permette la gestione delle prenotazioni dei parcheggi.

L'idea del progetto si basa sulla realizzazione di un sistema in grado di gestire le prenotazioni per diversi parcheggi. Il sistema prevede due ruoli principali:
- Operatore
- Automobilista
  
Ogni parcheggio può ospitare diverse tipologie di veicoli, tra cui: moto, auto, caravan e camion. Ogni tipo di mezzo ha una capienza e una tariffa dedicate. Le tariffe possono variare in base:
- giorno della prenotazione
- durata della sosta

Per effettuare una prenotazione, l’automobilista verifica la disponibilità di posti in uno specifico parcheggio, in base al tipo di veicolo. Se trova disponibilità, la prenotazione viene creata e passa in uno stato di attesa di pagamento. Nel momento del pagamento, l’utente può scaricare un bollettino contenente i dettagli del veicolo e l’importo da versare. Il pagamento avviene utilizzando un credito preassegnato all’utente, composto da gettoni o token, che fungono da moneta virtuale interna. Infine, il sistema genera un report con varie statistiche aggregate relative ai parcheggi, utile per gli operatori e per l’analisi delle prenotazioni.

Il progetto è stato interamente concepito e realizzato da Niccolò Ciotti e Luca Renzi. Entrambi gli autori hanno collaborato attivamente in tutte le fasi di sviluppo, dalla progettazione iniziale dell’architettura del sistema, alla scrittura del codice, fino all’integrazione dei diversi componenti e alla fase di testing. La sinergia tra i due ha permesso di affrontare e risolvere problematiche complesse legate alla gestione delle partite e all’ottimizzazione delle prestazioni del sistema. Il contributo di entrambi ha garantito la creazione di un progetto solido e ben strutturato, rispettando gli obiettivi e i requisiti del progetto richiesto dal Prof. Mancini Adriano.

## Indice

- [Obiettivi di progetto](#obiettivi-di-progetto)
- [Struttura del progetto ](#struttura_del_progetto)
  - [Architettura dei servizi](#architettura-dei-servizi)
  - [Pattern utilizzati](#pattern-utilizzati)
  - [Diagrammi UML](#diagrammi-uml)
    - [Diagramma dei casi d'uso](#diagramma-dei-casi-duso)
    - [Diagramma E-R](#diagramma-e-r)
    - [Diagrammi delle sequenze](#diagrammi-delle-sequenze)
- [API Routes](#api-routes)
- [Configurazione e uso](#configurazione-e-uso)
- [Strumenti utilizzati](#strumenti-utilizzati)
- [Autori](#autori)


# Obiettivi di progetto
L'obiettivo è realizzare un sistema di back-end per la gestione delle prenotazioni dei parcheggi. Per raggiungere tale scopo, abbiamo diviso il progetto in varie funzionalità da realizzare:

- Autenticazione dell'utente mediante token JWT, per la quale è prevista una rotta di login. Il login avviene utilizzando l'email e password.
- Validazione della richiesta di autenticazione per idetificare la tipologia di utente loggato e assegnamento di un determinato numero di token.
- Implementazione delle operazioni CRUD per la gestione dei parcheggi, accessibili agli operatori.
- Implementazione delle operazioni CRUD per la gestione delle prenotazioni, con verifica al momento del transito per identificare eventuali veicoli non conformi alle prenotazioni effettuate.
- Creazione di endpoint per fornire la disponibilità del parcheggio, in base alla tipologia di veicolo e alla fascia oraria richiesta.
- Realizzazione di un workflow guidato per l’automobilista, che consenta la generazione del bollettino di pagamento e il successivo completamento del pagamento del parcheggio.
- Sviluppo di statistiche di monitoraggio in grado di:
  - l'occupazione media parcheggio distinguendo per giorno della settimana e fascia oraria.
  - Occupazione massima
  - Occupazione minima
  - Fatturato generato
  - Numero di richieste che sono state rifiutate per mancanza di spazio nel parcheggio.
  - Fascia oraria più richiesta.
# Struttura del progetto
La progettazione di un sistema software ben strutturato richiede una suddivisione ordinata e coerente delle sue componenti principali. Nel nostro progetto, l’architettura è stata pensata per garantire manutenibilità, scalabilità e chiarezza del codice. Ogni componente è stato progettato con una responsabilità ben definita, contribuendo in modo autonomo ma integrato al corretto funzionamento dell’intero sistema.
L’organizzazione delle directory segue una logica modulare che consente una gestione ordinata di file e moduli, una separazione chiara delle funzionalità ed una facile estensione e manutenzione del progetto. Questa struttura permette di accedere rapidamente alle funzionalità specifiche e rende più semplice lo sviluppo in team.

Di seguito è riportata la struttura delle directory del progetto:

```plaintext
PARKING_PA/
│
├── config
├── migrations
├── node_modules
├── pdf
├── csv
├── postman
├── seeders
│
├── src
│   ├── @types
│   ├── controllers
│   ├── dao
│   ├── database
│   ├── factories
│   ├── helpers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── app.ts
│
├── .dockerignore
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── jwkRS256.key
├── jwkRS256.key.pub
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```
# Architettura dei servizi
Il sistema di gestione delle prenotazioni dei parcheggi è basato su un'architettura client-server. Il back-end è stato sviluppato utilizzando Node.js con il framework Express e si occupa di gestire tutte le funzionalità principali: l’autenticazione degli utenti, la creazione e gestione delle prenotazioni, la gestione dei parcheggi da parte degli operatori, e l’elaborazione dei dati necessari per produrre statistiche di utilizzo.

**Componenti principali**

1. Server (Node.js con Express)
   
Il server riceve e gestisce le richieste degli utenti tramite API REST. Gli utenti possono   autenticarsi, creare e getire le proprie prenotazioni. Gli operatori possono creare e gestire paarcheggi e visualizzare le statistiche. Tutte le interazioni sono protette da un sistema di autenticazione basato su token JWT, che garantisce che solo gli utenti autorizzati possano accedere alle funzionalità protette.

2. Database (PostgreSQL)

La persistenza dei dati viene gestita tramite un database PostgreSQL,  integrato tramite l’ORM Sequelize. Le principali entità memorizzate includono:
- Parcheggi: contiene informazioni identificative, indirizzo, capacità massima e giorni di chiusura.
- Posti: rappresenta la capacità e il prezzo associati a un tipo di veicolo per uno specifico parcheggio.
- Utenti: contiene infomazioni identificative dell'utente, ruolo e il saldo dei token
- Multa: contine le infoamizioni sull'importo, la targa del veicolo e il motibvo della sanzione.
- Transito: rappresenta un transito di un veicolo (ingresso o uscita) in un parcheggio, con eventuale riferimento alla prenotazione associata.
- Prenotazioni: contiene informazioni sull'utente, il parcheggio, il veicolo, lo stato della prenotazione, i tentativi di pagamento e il periodo di validità.

3. Autenticazion JWT

Gli utenti si autenticano tramite JSON Web Tokens (JWT), ottenuti tramite il login con email e password. Il token JWT viene poi utilizzato per ogni richiesta successiva, permettendo al sistema di identificare facilmente il ruolo dell’utente (ad esempio, automobilista o operatore) e di garantire l’accesso solo alle risorse permesse in base ai privilegi associati.

# Pattern utilizzati
Nel progetto sono stati applicati diversi pattern architetturali e design pattern per garantire una struttura flessibile, manutenibile e facilmente estendibile. I pattern utilizzati verranno elencati di seguito.
##  Model-View-Controler (MVC)

## Data Access Object (DAO)
Il pattern Data Access Object (DAO) è stato adottato e implementato tramite Sequelize, che fornisce un’interfaccia ad alto livello per l’accesso ai dati. Questo pattern permette di astrarre e isolare la logica di accesso al database dal resto dell’applicazione, promuovendo una chiara separazione delle responsabilità. In questo constesto, Sequelize agisce come il DAO, poiché gestisce tutte le operazioni CRUD (Create, Read, Update, Delete) per i modelli. Il vantaggio dell’utilizzo del DAO è la modularità e la facilità di sostituzione o aggiornamento della logica di accesso ai dati senza influenzare la logica di business.

Il pattern DAO è stato scelto per astrarre l’accesso al database, garantendo una separazione netta tra la logica di business e l’interazione diretta con la persistenza dei dati.
## Factory
Il pattern Factory è stato impiegato per centralizzare la creazione di errori personalizzati all’interno del progetto, tramite la classe ErrorFactory definita nel file errorFactory.ts. Questo approccio fornisce un’interfaccia unificata per la generazione di differenti tipologie di errori HTTP, in base al contesto in cui si verificano. L’obiettivo principale è ridurre la duplicazione del codice e migliorare la manutenibilità, centralizzando la logica di creazione degli errori.

La classe ErrorFactory sfrutta la libreria http-status-codes per associare in modo semplice e coerente i codici di stato HTTP ai relativi errori. Ciò consente di generare facilmente errori come NOT_FOUND, UNAUTHORIZED, FORBIDDEN e altri, garantendo coerenza semantica e funzionale in tutto il progetto.

Il pattern Factory è stato scelto per centralizzare la creazione degli errori, riducendo la duplicazione del codice e garantendo una gestione uniforme degli errori in tutto il progetto. Inoltre permette di aggiungere nuove tipologie di errori senza modificare il codice nelle sigole parti dell'applicazione.
## Singleton
Il pattern Singleton è stato adottato per gestire la connessione al database in modo centralizzato ed efficiente. In particolare, l’istanza di Sequelize, responsabile di tutte le interazioni con il database PostgreSQL, viene creata una sola volta durante la fase di inizializzazione dell’applicazione. Questo garantisce che esista una unica connessione condivisa tra tutte le componenti del sistema, evitando problemi di concorrenza, conflitti di connessione o sprechi di risorse.

Per implementare il pattern, è stata creata una classe chiamata databaseConnection, che sfrutta una proprietà statica per conservare l’istanza unica di Sequelize. Il metodo getInstance() controlla se questa istanza è già presente: se lo è, la restituisce; altrimenti, ne crea una nuova utilizzando le variabili d’ambiente per configurare la connessione. In questo modo, si assicura che tutte le operazioni di lettura e scrittura sul database passino sempre attraverso la stessa connessione persistente, migliorando la coerenza del sistema e la gestione delle risorse.

Il pattern Singleton è stato implementato per assicurare che l’applicazione utilizzi una singola istanza di connessione al database, riducendo il rischio di errori legati alla concorrenza nelle operazioni di accesso ai dati.
## Chain of Responsibility (COR)
Il pattern Chain of Responsibility (CoR) è stato implementato attraverso l’uso dei middleware di Express.js. Questo approccio consente di suddividere il flusso delle richieste HTTP in una catena di responsabilità, dove ogni middleware si occupa di una fase specifica del processo, come validazione, autenticazione o gestione degli errori. La struttura a catena permette una gestione modulare, ordinata e facilmente estendibile delle richieste in ingresso. Esempi di middleware sono:
- Middleware di autenticazione: verifica la presenza e la validità di un token JWT nella richiesta. Se il token è assente o non valido, la catena viene interrotta e viene restituito un errore con codice 401 Unauthorized. Questo comportamento è gestito dalla funzione authenticateJWT, che si occupa di decodificare e validare il token, proteggendo le rotte che richiedono un utente autenticato.
- Middleware di gestione degli errori:gestisce in modo centralizzato tutti gli errori generati lungo la catena. È implementato come middleware globale che cattura eccezioni e restituisce risposte formattate in modo coerente, sfruttando la ErrorFactory per generare messaggi chiari e codici di stato HTTP corretti.

Il pattern Chain of Responsibility è stato adottato per gestire il flusso delle richieste HTTP tramite una catena di middleware modulari, consentendo una gestione flessibile e facilmente estendibile di autenticazione, validazione e gestione degli errori.
# Diagrammi UML
# Diagramma dei casi d'uso
# Diagramma E-R
# Diagrammi delle sequenze
# API Routes
| Verbo HTTP | Endpoint | Descrzione | Autenticazione JWT |
|:----------:|:--------:|:-----------:|:------------------:|
| POST| /login|Autenticazione dell'utente tramite email e password. | ❌ |
| POST| /park/parking| Creazione di un nuovo parcheggio. | ✅ |
| GET| /park/parkings| Recupero della lista dei parcheggi | ✅|
| DELETE| /park/parking:id| Cancellazione di un parcheggio| ✅|
| GET| /park/parking/:id| Recupero infomazioni di un parcheggio| ✅ |
| POST| /park/parking/update/:id| Aggiornamento parametri percheggio | ✅ |
| GET| /info/parcheggi/:id/:vehicle/:data/:period| Verifica della disponibilità di un parcheggio | ❌ |
| POST| /api/reservation| Creazione di una prenotazione | ✅ |
| GET| /api/reservations| Recupero della lista delle prenotazioni | ✅ |
| GET| /api/reservation/:id| Recupero informazioni di una prenotazione | ✅ |
| GET| /api/reservations/user/:userId| Recupero prenotazioni di un utente| ✅ |
| DELETE| /api/reservation/:id| Cancellazione di una prenotazione| ✅ |
| POST| /api/reservation/update/:id| Aggiornamenot della prenotazione | ✅ |
| GET| /api/pay/:reservationId| Esecuzione del pagamento della prenotazione | ✅ |
| GET| /api/paymentslip/:id| Generazione del bollettino di una prenotazione | ✅ |
| DELETE| /api/pay/:reservationId| Cancellazione del pagamento di una prenotazione | ✅ |
| GET| /api/reservationsReport/:id/:format| Generazione di una report sulle prenotazioni | ✅ |
| POST| /operator/reports/reservations| Generazione di una report sulle prenotazioni degli utenti| ✅ |
| GET| /operator/stats/:parkingId|Generazione di una report sulle prenotazioni di un parcheggio | ✅ |
| POST| /check/transit/:type|Acquisizione del trasito di un vericolo per la generazione di una multa | ✅ |

# POST /login
**Parametri**
| Posizione | Nome    | Tipo     | Descrizione  |Obbligatorio  |
|:---------:|:-------:|:--------:|:------------:|:------------:|
|Richiesta nel body| email| string|Indirizzo email dell'utente| ✅ |
|Richiesta nel body| password| string|Password dell'utente| ✅ |

**Esempio di richiesta**
```json
{
  "email": "luigi@example.com",
  "password": "luigi"
}
```
**Esempio di risposta**
```json
{
  "token":  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMwMzlhMGI3LTk2ZTktNGYyNC04YmQwLWU3ZmVlOWZlNmYyNSIsInJvbGUiOiJvcGVyYXRvcmUiLCJpYXQiOjE3NDkzMTAwOTUsImV4cCI6MTc0OTMxMzY5NX0.lU2POutp8peqHHCHTQEO90Fcu3bmurHJmki_fbjhiyb4c3vpycbnQmmKtTrSPQAwco4z0xyf5G8sOzwLWgspx81NCLCgxkuTpvQyhE76TcRrSHIH5BhDFv2pDvUKkWy1Q7oZ4o_0bKc0r0gRyTbOhDYw_wVkdrXZJkUpu0hGgUnlaNubrdHi7qoCOVPkaEfgOr5EvHdxCFGseZa-RMva17YhR0o85W54aJSvuBgyye-Fd7-MP8shXOzqBgrBoMSLRHSSAtk-m00b_dLNQYu_1Lbk2LJTbbHZo1LBsIF7lldMKtPPLqkaVZKpPOCwCrIKFyOvv5K0uCHeRmvQ15VqqiyQKyH7pYwaYPfiuyKvqzOAkOW3Kwf2LqOepWlk5iyk3ZlF6ZGKb6HVrR6dw2mxYB39YSDIXITBe1YVMQmq2bPJS7-kcRfY2m3Cm6mdtgC4SQjcSezqC27EsbyqgCQckrm7wr2ENbFZNCtVzsKVsTDTdTiHdK8oKDrcWjGZX6Oyv_j4zJZgZNrTe2L1l4p2Yt0d1Z6ZI3gLzhfJja3un8feERHwcgozrTGsKSrMLemN17U6oGhj2k-pK4PUJsC_GAaX_98hAjkxSsLSpQZ4_6-907bU1jwn0B-SOnkqA2kyRRCxlXMdtBfa5vcIRJP9R5zRR14RSBCHPBdeSt_-GSk",
  "message": "Login successful"
}
```
# POST /park/parking
**Parametri**
| Posizione | Nome    | Tipo     | Descrizione  |Obbligatorio  |
|:---------:|:-------:|:--------:|:------------:|:------------:|
|Richiesta nel body| name| string|Nome del parcheggio| ✅ |
|Richiesta nel body| address| string|Indirizzo del parcheggio| ✅ |
|Richiesta nel body| capacity| string|Capacità del parcheggio| ✅ |
|Richiesta nel body| closedData| string|Date di chiusura del parcheggio| ✅ |
|Header|	Authorization|	string|	Token JWT per autenticazione	| ✅|

** Esempio di richiesta**
```json
{
  "name": "Parcheggio Stamira",
  "address": "Via Stamira 11",
  "capacity": "60",
  "closedData": ["2025-04-01"]
}
```

** Esempio di risposta**
```json
{
    "id": "d6a7239f-78c5-413e-b479-f7b6eb3988fd",
    "name": "Parcheggio Stamira",
    "address": "Via Stamira 11",
    "capacity": 60,
    "closedData": [
        "2025-04-01T00:00:00.000Z"
    ],
    "updatedAt": "2025-06-07T15:38:21.190Z",
    "createdAt": "2025-06-07T15:38:21.190Z"
}
```
# GET /park/parkings
**Parametri**
| Posizione | Nome    | Tipo     | Descrizione  |Obbligatorio  |
|:---------:|:-------:|:--------:|:------------:|:------------:|
|Header|	Authorization|	string|	Token JWT per autenticazione	| ✅|

** Esempio di risposta**
```json
[
    {
        "id": "d5ff1727-d01b-4b59-baa3-a800e244cd4f",
        "name": "Parcheggio Centrale",
        "address": "Via Roma 1, Milano",
        "capacity": 45,
        "closedData": [
            "2025-12-31T00:00:00.000Z",
            "2026-01-01T00:00:00.000Z"
        ],
        "createdAt": "2025-06-06T10:06:21.095Z",
        "updatedAt": "2025-06-06T10:06:21.095Z"
    },
    {
        "id": "66fe25c9-a390-4326-8193-99b0513ad973",
        "name": "Parcheggio Stamira",
        "address": "Via Stamira 9",
        "capacity": 60,
        "closedData": [
            "2025-04-01T00:00:00.000Z"
        ],
        "createdAt": "2025-06-06T10:18:40.312Z",
        "updatedAt": "2025-06-06T10:18:40.312Z"
    }
]
```

# DELETE /park/parking:id
**Parametri**
| Posizione | Nome    | Tipo     | Descrizione  |Obbligatorio  |
|:---------:|:-------:|:--------:|:------------:|:------------:|
|Path Param| id| string|Id del parcheggio| ✅ |
|Header|	Authorization|	string|	Token JWT per autenticazione	| ✅|

** Esempio di risposta**
```json
{
    "message": "Parking with ID aaf28cf9-eeb9-4d4f-8d96-3a5345551e9b deleted."
}
```
# GET /park/parking/:id
**Parametri**
| Posizione | Nome    | Tipo     | Descrizione  |Obbligatorio  |
|:---------:|:-------:|:--------:|:------------:|:------------:|
|Path Param| id| string|Id del parcheggio| ✅ |
|Header|	Authorization|	string|	Token JWT per autenticazione	| ✅|

** Esempio di risposta**
```json
{
    "id": "d5ff1727-d01b-4b59-baa3-a800e244cd4f",
    "name": "Parcheggio Centrale",
    "address": "Via Roma 1, Milano",
    "capacity": 45,
    "closedData": [
        "2025-12-31T00:00:00.000Z",
        "2026-01-01T00:00:00.000Z"
    ],
    "createdAt": "2025-06-06T10:06:21.095Z",
    "updatedAt": "2025-06-06T10:06:21.095Z"
}
```
# POST /parking/update/:id
**Parametri**
| Posizione | Nome    | Tipo     | Descrizione  |Obbligatorio  |
|:---------:|:-------:|:--------:|:------------:|:------------:|
|Richiesta nel body| name| string|Nome del parcheggio| ✅ |
|Richiesta nel body| address| string|Indirizzo del parcheggio| ✅ |
|Richiesta nel body| capacity| string|Capacità del parcheggio| ✅ |
|Richiesta nel body| closedData| string|Date di chiusura del parcheggio| ✅ |
|Header|	Authorization|	string|	Token JWT per autenticazione	| ✅|

** Esempio di richiesta**
```json
{
  "name": "Parcheggio Arco",
  "address": "Via Stamira 11",
  "capacity": "40",
  "closedData": ["2025-04-01"]
}
```

** Esempio di risposta**
```json
{
    "id": "d6a7239f-78c5-413e-b479-f7b6eb3988fd",
    "name": "Parcheggio Arco",
    "address": "Via Stamira 11",
    "capacity": "40",
    "closedData": [
        "2025-04-01"
    ],
    "createdAt": "2025-06-07T15:38:21.190Z",
    "updatedAt": "2025-06-07T15:54:50.932Z"
}
```

# Configurazione e uso
# Strumenti utilizzati
- **Node.js**: Runtime utilizzato per eseguire il codice JavaScript sul lato server.
- **TypeScript**: Linguaggio utilizzato per aggiungere tipizzazione statica a JavaScript, migliorando la manutenibilità del codice.
- **Express**: Framework per applicazioni web Node.js, utilizzato per creare il server e gestire le API.
- **PostgreSQL**: Database relazionale utilizzato per memorizzare le informazioni relative a giocatori, partite e mosse.
- **Sequelize**: ORM (Object-Relational Mapping) utilizzato per interagire con il database PostgreSQL tramite modelli JavaScript.
- **JWT (JSON Web Tokens)**: Utilizzato per l’autenticazione degli utenti tramite token.
- **Docker**: Strumento per la containerizzazione, utilizzato per creare ambienti di sviluppo e produzione isolati.
- **docker-compose**: Strumento utilizzato per definire e gestire applicazioni multi-contenitore Docker.
- **Postman**: Strumento per testare le API, utilizzato per verificare il corretto funzionamento delle rotte create.
- **DBeaver**: Strumento per la gestione e l’interazione con il database PostgreSQL, utile per visualizzare e manipolare i dati.
  
# Autori
Il progetto è stato sviluppato da NIccolò Ciotti (Matricola: S1121676) e Luca Renzi (Matricola: S1122444) come parte del corso di Programmazione Avanzata (A.A. 2024/2025) presso l'Università Politecnica delle Marche, nel corso di Laurea Magistrale in Ingegneria Informatica e dell’Automazione (LM-32).
