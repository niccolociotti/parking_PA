# Sviluppo di un sistema backend per la gestione di parcheggi

Il presente progetto è stato realizzato per l’esame di Programmazione Avanzata (A.A. 2024/2025) presso il corso di Laurea Magistrale in Ingegneria Informatica e Automazione (LM-32) dell’Università Politecnica delle Marche. Si tratta di un sistema back-end per la gestione delle prenotazioni dei parcheggi.

L'idea del progetto si basa sulla realizzazione di un sistema in grado di gestire le prenotazioni per diversi parcheggi. Il sistema prevede due ruoli principali:
- Operatore
- Automobilista
  
Ogni parcheggio può ospitare diverse tipologie di veicoli, tra cui: moto, auto, caravan e camion. Ogni tipo di mezzo ha una capienza e una tariffa dedicate. Le tariffe possono variare in base:
- giorno della prenotazione
- durata della sosta

Per effettuare una prenotazione, l’automobilista verifica la disponibilità di posti in uno specifico parcheggio, in base al tipo di veicolo. Se trova disponibilità, la prenotazione viene creata e passa in uno stato di attesa di pagamento. Nel momento del pagamento, l’utente può scaricare un bollettino contenente i dettagli del veicolo e l’importo da versare. Il pagamento avviene utilizzando un credito preassegnato all’utente, composto da gettoni o token, che fungono da moneta virtuale interna. Infine, il sistema genera un report con varie statistiche aggregate relative ai parcheggi, utile per gli operatori e per l’analisi delle prenotazioni.

Il progetto è stato interamente realizzato da Niccolò Ciotti e Luca Renzi. Il contributo di entrambi ha garantito la creazione di un progetto solido e ben strutturato, rispettando gli obiettivi e i requisiti del progetto richiesto dal Prof. Mancini Adriano.

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
   
Il cuore dell’applicazione è un server costruito con Node.js e Express, che espone API REST per gestire le richieste degli utenti. Gli automobilisti possono autenticarsi, creare e monitorare le proprie prenotazioni, mentre gli operatori hanno la possibilità di aggiungere nuovi parcheggi, modificarne i dettagli e consultare report statistici. L’accesso alle risorse protette è regolato da un meccanismo di autenticazione basato su JSON Web Token, in modo da garantire che soltanto utenti con credenziali valide possano sfruttare le funzionalità riservate.

2. Database (PostgreSQL)

Tutti i dati vengono memorizzati in un’istanza PostgreSQL, manipolata attraverso l’ORM Sequelize. Le entità principali modellate nel database sono:
- Parcheggi: informazioni identificative, indirizzo, capacità massima e giorni di chiusura.
- Posti: tipologie di posti auto, con relativo prezzo e capacità per veicolo.
- Utenti: dati identificativi, ruolo (es. automobilista, operatore) e saldo dei token.
- Multe: importo della sanzione, targa del veicolo e motivazione.
- Transiti: registrazione di entrate/uscite dei veicoli, con eventuale collegamento a una prenotazione.
- Prenotazioni: dettagli su utente, parcheggio, veicolo, stato della prenotazione, tentativi di pagamento e periodo di validità.

3. Autenticazion JWT

Gli utenti effettuano il login tramite email e password, ottenendo in risposta un token JWT. Questo token va poi allegato a ogni chiamata successiva, consentendo al server di riconoscere l’identità e il ruolo dell’utente (es. automobilista o operatore) e di applicare controlli di autorizzazione sulle risorse richieste.

# Pattern utilizzati
Per assicurare un’architettura flessibile, di facile manutenzione e facilmente estendibile, il progetto fa uso di diversi pattern sia architetturali sia di design. Di seguito vengono presentati quelli impiegati.
##  Model-View-Controler (MVC)
Nel progetto il pattern MVC è stato adattato a un contesto esclusivamente back-end: il tradizionale livello “View” è stato sostituito da un layer “Service”, incaricato di gestire la logica di presentazione e di orchestrare tutte le operazioni.

- Model: rappresenta in maniera fedele le entità del dominio—parcheggi, posti auto, utenti, multe, transiti e prenotazioni—definendone strutture, vincoli e relazioni tramite Sequelize.
- Controller: funge da interfaccia verso il mondo esterno: riceve le richieste HTTP (GET, POST, DELETE), estrae e convalida i parametri in ingresso (dai path, dal body JSON o dagli header) e decide quale operazione eseguire. Invece di occuparsi di logiche complesse, il controller si limita a chiamare i metodi del Service corrispondenti all’azione richiesta.
- Service:  è il centro dell’applicazione, dove vengono gestite tutte le operazioni principali. Si occupa di far interagire i diversi componenti, applicare le regole di business. In questo modo i controller restano snelli e concentrati sulla gestione delle richieste HTTP, mentre tutte le logiche complesse rimangono in un unico punto, facilmente testabile ed estendibile.

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
| GET| /api/reservation/:id| Recupero informazioni di una prenotazione | ✅ |
| GET| /api/reservations| Recupero prenotazioni di un utente| ✅ |
| DELETE| /api/reservation/:id| Cancellazione di una prenotazione| ✅ |
| POST| /api/reservation/update/:id| Aggiornamenot della prenotazione | ✅ |
| GET| /api/pay/:reservationId| Esecuzione del pagamento della prenotazione | ✅ |
| GET| /api/paymentslip/:id| Generazione del bollettino di una prenotazione | ✅ |
| DELETE| /api/pay/:reservationId| Annullamento del pagamento di una prenotazione esclusivamente se il suo stato è in attesa.| ✅ |
| GET| /api/reservationsReport/:format| Generazione di una report sulle prenotazioni | ✅ |
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
|Richiesta nel body| closedData| Date[]|Date di chiusura del parcheggio. Formato YYYY-MM-DD| ✅ |
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
|Richiesta nel body| closedData| Date[]|Date di chiusura del parcheggio. Formato YYYY-MM-DD| ✅ |
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
# GET info/parcheggi/:id/:vehicle/:data/:period
**Parametri**
| Posizione | Nome    | Tipo     | Descrizione  |Obbligatorio  |
|:---------:|:-------:|:--------:|:------------:|:------------:|
|Path Param| id| string|Id del parcheggio| ✅ |
|Path Param| vehicle| string|Tipologia di veicolo| ✅ |
|Path Param| data| string|Data di arrivo. Formato YYYY-MM-DD| ✅ |
|Path Param| period| integer |Durata della prenotazione| ✅ |

** Esempio di risposta**
```json
{
  "Disponibilità":"14"
}
```


# POST /api/reservation
### Parametri

| **Posizione**      | **Nome**   | **Tipo**  | **Descrizione**                                                                                    | **Obbligatorio** |
|--------------------|------------|-----------|----------------------------------------------------------------------------------------------------|------------------|
| Richiesta nel body | `email`    | `string`  | Indirizzo email dell'utente. Formato: `username@example.com`.                                      | ✅               |
| Richiesta nel body | `password` | `string`  | Password dell'utente                                                                               | ✅               |
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |

Esempio di richiesta

```http
POST /api/reservation HTTP/1.1
Content-Type: application/json
Authorization: Bearer {{JWT_TOKEN}}
```

```json
{
    "parkingId": "a4b69567-1fa7-43ef-b222-90db6a17ab76",
    "licensePlate": "ATRYSA",
    "vehicle": "auto",
    "startTime": "23-06-2025",
    "endTime": "25-06-2025"
}

```

Esempio di risposta 

```json
{
    "Prenotazione": {
        "id": "e40fa6c9-8e16-4305-86a6-14f10bdbb4e1",
        "userId": "e603cb6d-97e3-435f-bdc3-38f28823e7cc",
        "parkingId": "a4b69567-1fa7-43ef-b222-90db6a17ab76",
        "licensePlate": "ATRYSA",
        "vehicle": "auto",
        "status": "In attesa di pagamento",
        "startTime": "2025-06-07T15:49:41.865Z",
        "endTime": "2025-06-12T15:49:41.865Z",
        "paymentAttemps": 0,
        "updatedAt": "2025-06-07T15:49:41.866Z",
        "createdAt": "2025-06-07T15:49:41.866Z"
    }
}
```
# GET /api/reservations
### Parametri

| **Posizione**      | **Nome**   | **Tipo**  | **Descrizione**                                                                                    | **Obbligatorio** |
|--------------------|------------|-----------|----------------------------------------------------------------------------------------------------|------------------|
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |
| Richiesta nel payload token | `userId` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |

Esempio di richiesta

```http
GET /api/reservations HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
Esempio di risposta 

```json
{
    {
        "id": "95c48683-8d0c-4bee-976b-a1500e7c5656",
        "status": "In attesa di pagamento",
        "licensePlate": "AB124CD",
        "vehicle": "auto",
        "paymentAttemps": 0,
        "userId": "e603cb6d-97e3-435f-bdc3-38f28823e7cc",
        "parkingId": "00bf5ef9-3198-444d-91bf-b080a6b6bde8",
        "startTime": "2025-07-01T10:00:00.000Z",
        "endTime": "2025-07-02T20:00:00.000Z",
        "createdAt": "2025-06-06T18:36:43.885Z",
        "updatedAt": "2025-06-06T18:36:43.885Z"
    },
    {
        "id": "22601805-6962-41a0-ad42-17c7f848e248",
        "status": "Prenotazione rifiutata",
        "licensePlate": "AB124CD",
        "vehicle": "auto",
        "paymentAttemps": 0,
        "userId": "e603cb6d-97e3-435f-bdc3-38f28823e7cc",
        "parkingId": "00bf5ef9-3198-444d-91bf-b080a6b6bde8",
        "startTime": "2025-07-04T10:00:00.000Z",
        "endTime": "2025-07-06T20:00:00.000Z",
        "createdAt": "2025-06-06T18:36:43.885Z",
        "updatedAt": "2025-06-06T18:36:43.885Z"
    },
    {
        "id": "1f9f3edc-e2b1-4b54-b9ce-285ef53117e0",
        "status": "In attesa di pagamento",
        "licensePlate": "ATRYSA",
        "vehicle": "auto",
        "paymentAttemps": 0,
        "userId": "e603cb6d-97e3-435f-bdc3-38f28823e7cc",
        "parkingId": "a4b69567-1fa7-43ef-b222-90db6a17ab76",
        "startTime": "2025-06-07T15:46:34.885Z",
        "endTime": "2025-06-12T15:46:34.885Z",
        "createdAt": "2025-06-07T15:46:34.889Z",
        "updatedAt": "2025-06-07T15:46:34.889Z"
    },
    {
        "id": "e40fa6c9-8e16-4305-86a6-14f10bdbb4e1",
        "status": "In attesa di pagamento",
        "licensePlate": "ATRYSA",
        "vehicle": "auto",
        "paymentAttemps": 0,
        "userId": "e603cb6d-97e3-435f-bdc3-38f28823e7cc",
        "parkingId": "a4b69567-1fa7-43ef-b222-90db6a17ab76",
        "startTime": "2025-06-07T15:49:41.865Z",
        "endTime": "2025-06-12T15:49:41.865Z",
        "createdAt": "2025-06-07T15:49:41.866Z",
        "updatedAt": "2025-06-07T15:49:41.866Z"
    }
}
```

# GET /api/reservation/:id
### Parametri

| **Posizione**      | **Nome**   | **Tipo**  | **Descrizione**                                                                                    | **Obbligatorio** |
|--------------------|------------|-----------|----------------------------------------------------------------------------------------------------|------------------|
| Richiesta nel path | `id` | `string`  | 	ID della prenotazione da ottenere                                                                         | ✅               |
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |

Esempio di richiesta

```http
GET /api/reservation/95c48683-8d0c-4bee-976b-a1500e7c5656 HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
Esempio di risposta 

```json
{
    "id": "95c48683-8d0c-4bee-976b-a1500e7c5656",
    "status": "In attesa di pagamento",
    "licensePlate": "AB124CD",
    "vehicle": "auto",
    "paymentAttemps": 0,
    "userId": "e603cb6d-97e3-435f-bdc3-38f28823e7cc",
    "parkingId": "00bf5ef9-3198-444d-91bf-b080a6b6bde8",
    "startTime": "2025-07-01T10:00:00.000Z",
    "endTime": "2025-07-02T20:00:00.000Z",
    "createdAt": "2025-06-06T18:36:43.885Z",
    "updatedAt": "2025-06-06T18:36:43.885Z"
}
```

# DELETE /api/reservation/:id
### Parametri

| **Posizione**      | **Nome**   | **Tipo**  | **Descrizione**                                                                                    | **Obbligatorio** |
|--------------------|------------|-----------|----------------------------------------------------------------------------------------------------|------------------|
| Richiesta nel path | `id` | `string`  | 	ID della prenotazione che si vuole eliminare                                                                    | ✅               |
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |

Esempio di richiesta

```http
DELETE /api/reservation/95c48683-8d0c-4bee-976b-a1500e7c5656 HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
Esempio di risposta 

```json
{
   "message": "Reservation with ID 95c48683-8d0c-4bee-976b-a1500e7c5656 deleted."
}
```

# POST /api/reservation/update/:id
### Parametri

| **Posizione**      | **Nome**   | **Tipo**  | **Descrizione**                                                                                    | **Obbligatorio** |
|--------------------|------------|-----------|----------------------------------------------------------------------------------------------------|------------------|
| Richiesta nel path | `id` | `string`  | 	ID della prenotazione che si vuole aggiornare                                                                    | ✅               |
| Richiesta nel body | `param` | `string`  | 	paramaetri che si vogliono aggiornare                                                                    | ✅               |
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |

Esempio di richiesta

```http
POST /api/reservation/update/e40fa6c9-8e16-4305-86a6-14f10bdbb4e1 HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
```json
{
"licensePlate": "CC123FF",
    "vehicle": "moto"
}
```
Esempio di risposta 

```json
{
   "Prenotazione": {
        "id": "e40fa6c9-8e16-4305-86a6-14f10bdbb4e1",
        "status": "In attesa di pagamento",
        "licensePlate": "CC123FF",
        "vehicle": "moto",
        "paymentAttemps": 0,
        "userId": "e603cb6d-97e3-435f-bdc3-38f28823e7cc",
        "parkingId": "a4b69567-1fa7-43ef-b222-90db6a17ab76",
        "startTime": "2025-06-07T15:49:41.865Z",
        "endTime": "2025-06-12T15:49:41.865Z",
        "createdAt": "2025-06-07T15:49:41.866Z",
        "updatedAt": "2025-06-07T16:18:11.451Z"
    }
}
```

# GET /api/pay/:reservationId
### Parametri

| **Posizione**      | **Nome**   | **Tipo**  | **Descrizione**                                                                                    | **Obbligatorio** |
|--------------------|------------|-----------|----------------------------------------------------------------------------------------------------|------------------|
| Richiesta nel path | `reservationId` | `string`  | 	ID della prenotazione che si vuole pagare                                                                    | ✅               |
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |

Esempio di richiesta

```http
GET /api/reservation/pay/e40fa6c9-8e16-4305-86a6-14f10bdbb4e1 HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
Esempio di risposta 

```json
{
   "message": "Pagamento effettuato.",
    "reservation": {
        "id": "e40fa6c9-8e16-4305-86a6-14f10bdbb4e1",
        "status": "Prenotazione confermata",
        "licensePlate": "CC123FF",
        "vehicle": "moto",
        "paymentAttemps": 0,
        "userId": "e603cb6d-97e3-435f-bdc3-38f28823e7cc",
        "parkingId": "a4b69567-1fa7-43ef-b222-90db6a17ab76",
        "startTime": "2025-06-07T15:49:41.865Z",
        "endTime": "2025-06-12T15:49:41.865Z",
        "createdAt": "2025-06-07T15:49:41.866Z",
        "updatedAt": "2025-06-07T16:30:48.536Z"
    }
}
```

# GET	/api/paymentslip/:id
**Parametri**
| Posizione | Nome    | Tipo     | Descrizione  |Obbligatorio  |
|:---------:|:-------:|:--------:|:------------:|:------------:|
|Path Param| id| string|Id della prenotazione| ✅ |
|Header|	Authorization|	string|	Token JWT per autenticazione	| ✅|

** Esempio di risposta (Formato PDF) **

[Scarica il PDF](./pdf/payment-slip-938c89e4-7bbb-4143-b873-d5a56ff1a4fb.pdf)

# DELETE /api/pay/:reservationId
### Parametri

| **Posizione**      | **Nome**   | **Tipo**  | **Descrizione**                                                                                    | **Obbligatorio** |
|--------------------|------------|-----------|----------------------------------------------------------------------------------------------------|------------------|
| Richiesta nel path | `reservationId` | `string`  | 	ID della prenotazione che si vuole annullare                                                                    | ✅               |
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |

Esempio di richiesta

```http
DELETE /api/reservation/pay/e40fa6c9-8e16-4305-86a6-14f10bdbb4e1 HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
Esempio di risposta 

```json
{
   "message": "Reservation with ID e40fa6c9-8e16-4305-86a6-14f10bdbb4e1 deleted."
}
```
# GET /api/reservationsReport/:format
### Parametri
| **Posizione**      | **Nome**   | **Tipo**  | **Descrizione**                                                                                    | **Obbligatorio** |
|--------------------|------------|-----------|----------------------------------------------------------------------------------------------------|------------------|
| Richiesta nel path | `format` | `string`  | 	formato in cui si vuole ottenere il report(json,csv,pdf)                                                                    | ✅               |
| Richiesta nel body | `start` | `string`  | 	data di inizio del periodo temporale                                                                  | ❌               |
| Richiesta nel body | `end` | `string`  | 	data di fine del periodo temporale                                                                        | ❌               |
| Richiesta nel body | `parkingId` | `string`  | 	ID del parcheggio con cui si vuole filtrare                                                                    | ❌               |
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |



```http
GET /api/reservationsReport/json?start=01-03-2025&end=12-07-2025&parkingId=a4b69567-1fa7-43ef-b222-90db6a17ab76 HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```

Esempio di risposta

```json
{
        "id": "1f9f3edc-e2b1-4b54-b9ce-285ef53117e0",
        "status": "In attesa di pagamento",
        "licensePlate": "ATRYSA",
        "vehicle": "auto",
        "paymentAttemps": 0,
        "userId": "e603cb6d-97e3-435f-bdc3-38f28823e7cc",
        "parkingId": "a4b69567-1fa7-43ef-b222-90db6a17ab76",
        "startTime": "2025-06-07T15:46:34.885Z",
        "endTime": "2025-06-12T15:46:34.885Z",
        "createdAt": "2025-06-07T15:46:34.889Z",
        "updatedAt": "2025-06-07T15:46:34.889Z"
    }
```
oppure in un file [csv](csv/reservations-e603cb6d-97e3-435f-bdc3-38f28823e7cc.csv) o [pdf](pdf/reservations-e603cb6d-97e3-435f-bdc3-38f28823e7cc.pdf)



# POST /operator/reports/reservations
### Parametri

| **Posizione**      | **Nome**   | **Tipo**  | **Descrizione**                                                                                    | **Obbligatorio** |
|--------------------|------------|-----------|----------------------------------------------------------------------------------------------------|------------------|
| Richiesta nel body | `licensePlate` | `string`  | 	targhe dei vicoli con cui si vuole filtrare                                                                    | ✅               |
| Richiesta nel body | `start` | `string`  | 	data di inizio del periodo temporale                                                                  | ✅               |
| Richiesta nel body | `end` | `string`  | 	data di fine del periodo temporale                                                                        | ✅               |
| Richiesta nel body | `format` | `string`  | 	formato in cui si vuole ottenere il report(json,pdf)                                                                    | ✅               |
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |

Esempio di richiesta

```http
POST /operator/reports/reservations HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
Esempio di richiesta

```json
{
   {
    "licensePlates": [
        "AB124CD",
        "ZZ123YY"
    ],
    "start": "14-05-2025",
    "end": "02-09-2025",
    "format": "json"
}
}
```

Esempio di risposta

```json
{
   "reservations": [
        {
            "id": "a9ff78ba-be89-43de-9c96-030e54f19e08",
            "status": "Prenotazione confermata",
            "licensePlate": "ZZ123YY",
            "vehicle": "camion",
            "paymentAttemps": 0,
            "userId": "9f06cb27-7039-46e0-aa01-24323c821e9f",
            "parkingId": "704d3fed-935a-409b-994d-2d7bc794e42e",
            "startTime": "2025-05-15T06:00:00.000Z",
            "endTime": "2025-07-15T14:00:00.000Z",
            "createdAt": "2025-06-06T18:36:43.885Z",
            "updatedAt": "2025-06-06T18:36:43.885Z"
        },
        {
            "id": "22601805-6962-41a0-ad42-17c7f848e248",
            "status": "Prenotazione rifiutata",
            "licensePlate": "AB124CD",
            "vehicle": "auto",
            "paymentAttemps": 0,
            "userId": "e603cb6d-97e3-435f-bdc3-38f28823e7cc",
            "parkingId": "00bf5ef9-3198-444d-91bf-b080a6b6bde8",
            "startTime": "2025-07-04T10:00:00.000Z",
            "endTime": "2025-07-06T20:00:00.000Z",
            "createdAt": "2025-06-06T18:36:43.885Z",
            "updatedAt": "2025-06-06T18:36:43.885Z"
        }
    ]
}
```
oppure un file [pdf](pdf/report_1749130994650.pdf)
# GET /operator/stats/:parkingId
### Parametri

| **Posizione**      | **Nome**   | **Tipo**  | **Descrizione**                                                                                    | **Obbligatorio** |
|--------------------|------------|-----------|----------------------------------------------------------------------------------------------------|------------------|
| Richiesta nel path | `parkingId` | `string`  | 	Id del parcheggio di cui si vogliono ottenere le statistiche                                                                 | ✅               |
| Richiesta nella query | `start` | `string`  | 	targa del veicolo che transita                                                                    | ❌               |
| Richiesta nella query | `end` | `string`  | 	ID del parcheggio dove si transita                                                                   | ❌               |
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |

Esempio di richiesta

```http
GET /operator/stats/a4b69567-1fa7-43ef-b222-90db6a17ab76?start=31-05-2025 08:00&end=02-08-2025 20:00 HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```

Esempio di risposta

```json
{
   "parkingId": "a4b69567-1fa7-43ef-b222-90db6a17ab76",
    "stats": {
        "averageOccupancy": {
            "Lun": {
                "00:00-01:00": 0.33,
                "01:00-02:00": 0.33,
                "02:00-03:00": 0.33,
                "03:00-04:00": 0.33,
                "04:00-05:00": 0.33,
                "05:00-06:00": 0.33,
                "06:00-07:00": 0.33,
                "07:00-08:00": 0.33,
                "08:00-09:00": 0.33,
                "09:00-10:00": 0.33,
                "10:00-11:00": 0.33,
                "11:00-12:00": 0.33,
                "12:00-13:00": 0.33,
                "13:00-14:00": 0.33,
                "14:00-15:00": 0.33,
                "15:00-16:00": 0.33,
                "16:00-17:00": 0.33,
                "17:00-18:00": 0.33,
                "18:00-19:00": 0.33,
                "19:00-20:00": 0.33,
                "20:00-21:00": 0.33,
                "21:00-22:00": 0.33,
                "22:00-23:00": 0.33,
                "23:00-24:00": 0.33
            },
            "Mar": {
                "00:00-01:00": 0.33,
                "01:00-02:00": 0.33,
                "02:00-03:00": 0.33,
                "03:00-04:00": 0.33,
                "04:00-05:00": 0.33,
                "05:00-06:00": 0.33,
                "06:00-07:00": 0.33,
                "07:00-08:00": 0.33,
                "08:00-09:00": 0.33,
                "09:00-10:00": 0.33,
                "10:00-11:00": 0.33,
                "11:00-12:00": 0.33,
                "12:00-13:00": 0.33,
                "13:00-14:00": 0.33,
                "14:00-15:00": 0.33,
                "15:00-16:00": 0.33,
                "16:00-17:00": 0.33,
                "17:00-18:00": 0.33,
                "18:00-19:00": 0.33,
                "19:00-20:00": 0.33,
                "20:00-21:00": 0.33,
                "21:00-22:00": 0.33,
                "22:00-23:00": 0.33,
                "23:00-24:00": 0.33
            },
            "Mer": {
                "00:00-01:00": 0.33,
                "01:00-02:00": 0.33,
                "02:00-03:00": 0.33,
                "03:00-04:00": 0.33,
                "04:00-05:00": 0.33,
                "05:00-06:00": 0.33,
                "06:00-07:00": 0.33,
                "07:00-08:00": 0.33,
                "08:00-09:00": 0.33,
                "09:00-10:00": 0.33,
                "10:00-11:00": 0.33,
                "11:00-12:00": 0.33,
                "12:00-13:00": 0.33,
                "13:00-14:00": 0.33,
                "14:00-15:00": 0.33,
                "15:00-16:00": 0.33,
                "16:00-17:00": 0.33,
                "17:00-18:00": 0.33,
                "18:00-19:00": 0.33,
                "19:00-20:00": 0.33,
                "20:00-21:00": 0.33,
                "21:00-22:00": 0.33,
                "22:00-23:00": 0.33,
                "23:00-24:00": 0.33
            },
            "Gio": {
                "00:00-01:00": 0.33,
                "01:00-02:00": 0.33,
                "02:00-03:00": 0.33,
                "03:00-04:00": 0.33,
                "04:00-05:00": 0.33,
                "05:00-06:00": 0.33,
                "06:00-07:00": 0.33,
                "07:00-08:00": 0.33,
                "08:00-09:00": 0.33,
                "09:00-10:00": 0.33,
                "10:00-11:00": 0.33,
                "11:00-12:00": 0.33,
                "12:00-13:00": 0.33,
                "13:00-14:00": 0.33,
                "14:00-15:00": 0.33,
                "15:00-16:00": 0.33,
                "16:00-17:00": 0.33,
                "17:00-18:00": 0.33,
                "18:00-19:00": 0.22,
                "19:00-20:00": 0.22,
                "20:00-21:00": 0.11,
                "21:00-22:00": 0.11,
                "22:00-23:00": 0.11,
                "23:00-24:00": 0.11
            },
            "Ven": {
                "00:00-01:00": 0.11,
                "01:00-02:00": 0.11,
                "02:00-03:00": 0.11,
                "03:00-04:00": 0.11,
                "04:00-05:00": 0.11,
                "05:00-06:00": 0.11,
                "06:00-07:00": 0.11,
                "07:00-08:00": 0.11,
                "08:00-09:00": 0.11,
                "09:00-10:00": 0.11,
                "10:00-11:00": 0.11,
                "11:00-12:00": 0.11,
                "12:00-13:00": 0.11,
                "13:00-14:00": 0.11,
                "14:00-15:00": 0.11,
                "15:00-16:00": 0.11,
                "16:00-17:00": 0.11,
                "17:00-18:00": 0.11,
                "18:00-19:00": 0.11,
                "19:00-20:00": 0.11,
                "20:00-21:00": 0.11,
                "21:00-22:00": 0.11,
                "22:00-23:00": 0.11,
                "23:00-24:00": 0.11
            },
            "Sab": {
                "08:00-09:00": 0.1,
                "09:00-10:00": 0.1,
                "10:00-11:00": 0.1,
                "11:00-12:00": 0.1,
                "12:00-13:00": 0.1,
                "13:00-14:00": 0.1,
                "14:00-15:00": 0.1,
                "15:00-16:00": 0.1,
                "16:00-17:00": 0.1,
                "17:00-18:00": 0.2,
                "18:00-19:00": 0.2,
                "19:00-20:00": 0.2,
                "20:00-21:00": 0.2,
                "21:00-22:00": 0.22,
                "22:00-23:00": 0.22,
                "23:00-24:00": 0.22,
                "00:00-01:00": 0.11,
                "01:00-02:00": 0.11,
                "02:00-03:00": 0.11,
                "03:00-04:00": 0.11,
                "04:00-05:00": 0.11,
                "05:00-06:00": 0.11,
                "06:00-07:00": 0.11,
                "07:00-08:00": 0.11
            },
            "Dom": {
                "00:00-01:00": 0.22,
                "01:00-02:00": 0.22,
                "02:00-03:00": 0.22,
                "03:00-04:00": 0.22,
                "04:00-05:00": 0.22,
                "05:00-06:00": 0.22,
                "06:00-07:00": 0.22,
                "07:00-08:00": 0.22,
                "08:00-09:00": 0.22,
                "09:00-10:00": 0.22,
                "10:00-11:00": 0.33,
                "11:00-12:00": 0.33,
                "12:00-13:00": 0.33,
                "13:00-14:00": 0.33,
                "14:00-15:00": 0.33,
                "15:00-16:00": 0.33,
                "16:00-17:00": 0.33,
                "17:00-18:00": 0.33,
                "18:00-19:00": 0.33,
                "19:00-20:00": 0.33,
                "20:00-21:00": 0.33,
                "21:00-22:00": 0.33,
                "22:00-23:00": 0.33,
                "23:00-24:00": 0.33
            }
        },
        "contemporaryMaxOccupancy": 2,
        "contemporaryMinOccupancy": 0,
        "revenue": 0,
        "rejectedCount": 0,
        "mostRequestedSlot": "10:00-11:00"
    }
}
```


# POST /check/transit/:type
### Parametri

| **Posizione**      | **Nome**   | **Tipo**  | **Descrizione**                                                                                    | **Obbligatorio** |
|--------------------|------------|-----------|----------------------------------------------------------------------------------------------------|------------------|
| Richiesta nel path | `type` | `string`  | 	tipo di transito(ingresso,uscita)                                                                 | ✅               |
| Richiesta nel body | `licensePlate` | `string`  | 	targa del veicolo che transita                                                                    | ✅               |
| Richiesta nel body | `parkingId` | `string`  | 	ID del parcheggio dove si transita                                                                   | ✅               |
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |

Esempio di richiesta

```http
POST /check/transit/ingresso HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
Esempio di richiesta

```json
{
    "licensePlate": "ZZ123YY",
    "parkingId": "704d3fed-935a-409b-994d-2d7bc794e42e"
}
```

Esempio di risposta

```json
{
   "message": "Transito in ingresso",
    "fineOrTransit": {
        "id": "a18c8bf8-3426-46f8-ad13-08b25d075ab0",
        "type": "ingresso",
        "licensePlate": "ZZ123YY",
        "parkingId": "704d3fed-935a-409b-994d-2d7bc794e42e",
        "time": "2025-06-07 17:03:48.844 +00:00",
        "reservationId": "a9ff78ba-be89-43de-9c96-030e54f19e08",
        "updatedAt": "2025-06-07T17:03:48.855Z",
        "createdAt": "2025-06-07T17:03:48.855Z"
    }
}
```
oppure
```json
{
   "message": "Multa",
    "fineOrTransit": {
        "id": "a7f84fd1-3710-4a52-b031-fadcba1578e2",
        "licensePlate": "ZZ123YY",
        "parkingId": "704d3fed-935a-409b-994d-2d7bc794e42e",
        "price": 50,
        "reason": "Transito senza prenotazione valida",
        "updatedAt": "2025-06-07T17:08:57.332Z",
        "createdAt": "2025-06-07T17:08:57.332Z"
    }
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
