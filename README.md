# Sviluppo di un sistema backend per la gestione di parcheggi
<div align="center">
  <img src="https://mobipar.it/wp-content/uploads/2024/10/Service_Featured_Image_progettazione_parcheggi.svg" alt="Logo del progetto" width="400"/>
</div>

######
[![Postgres](https://img.shields.io/badge/Made%20with-postgres-%23316192.svg?style=plastic&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![NPM](https://img.shields.io/badge/Made%20with-NPM-%23CB3837.svg?style=plastic&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![NodeJS](https://img.shields.io/badge/Made%20with-node.js-6DA55F?style=plastic&logo=node.js&logoColor=white)](https://nodejs.org/en)
[![Express.js](https://img.shields.io/badge/Made%20with-express.js-%23404d59.svg?style=plastic&logo=express&logoColor=%2361DAFB)](https://expressjs.com/it/)
[![JWT](https://img.shields.io/badge/Made%20with-JWT-black?style=plastic&logo=JSON%20web%20tokens)](https://jwt.io/)
[![TypeScript](https://img.shields.io/badge/Made%20with-typescript-%23007ACC.svg?style=plastic&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Sequelize](https://img.shields.io/badge/Made%20with-Sequelize-52B0E7?style=plastic&logo=Sequelize&logoColor=white)](https://sequelize.org/)
[![Docker](https://img.shields.io/badge/Made%20with-docker-%230db7ed.svg?style=plastic&logo=docker&logoColor=white)](https://www.docker.com/)
[![Postman](https://img.shields.io/badge/Made%20with-Postman-FF6C37?style=plastic&logo=postman&logoColor=white)](https://www.postman.com/)


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
- [Struttura del progetto ](#struttura-del-progetto)
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
Il Data Access Object (DAO) è un livello che si occupa esclusivamente di gestire tutte le interazioni con il database. In pratica, ogni interazione CRUD passa attraverso questo livello dedicato, mantenendo la logica di persistenza completamente separata dal resto dell’applicazione. Questo approccio garantisce una maggiore modularità, facilita il testing e permette di sostituire o evolvere la parte di accesso ai dati senza toccare la business logic.

Nel progetto ogni DAO è stato realizzato come una classe che si appoggia direttamente ai model di Sequelize per offrire sia operazioni CRUD di base (ad esempio findByPk, findAll, create, destroy) sia query personalizzate, sfruttando opzioni come where per i filtri e include per cercare associazioni.

## Singleton
Il pattern Singleton è stato adottato per garantire che componenti critiche, come la connessione al database, vengano create una sola volta e condivise in tutta l’applicazione. In questo modo si evita l’overhead di istanziare ripetutamente risorse pesanti, assicurando coerenza e un unico punto di controllo per lo stato globale. 

Il Singleton è stato realizzato definendo la classe DatabaseConnection con:

- Costruttore privato, per impedire istanziazioni dirette.
- Proprietà statica instance, che conserva l’unica istanza.
- Metodo statico getInstance(), che al primo chiamata crea l’oggetto e, alle successive, restituisce sempre la stessa istanza.

## Factory
Per garantire una gestione centralizzata e coerente degli errori, con messaggi e codici HTTP uniformi, nel progetto è stato adottato il Factory Pattern per la creazione di errori personalizzati.

La classe ErrorFactory offre metodi statici (ad esempio badRequest(), unauthorized(), entityNotFound()) che producono istanze di CustomError già configurate con il messaggio e lo status code corretti.

Nel controller e service si lancia l’errore tramite throw ErrorFactory.entityNotFound("User") o simili, evitando duplicazione di codice e assicurando coerenza nei messaggi e nei codici di risposta.

## Chain of Responsibility (COR)
Per gestire in modo flessibile e modulare la sequenza di controlli e operazioni su una richiesta (ad es. validazione, autorizzazione, elaborazione business), nel progetto è stato introdotto il Chain of Responsibility (CoR), un pattern comportamentale che definisce una catena di oggetti (handler), ciascuno dei quali può gestire la richiesta o passarla al successivo.

L’architettura si basa su una catena di middleware, ciascuno focalizzato su un compito specifico:

- Validazione del JWT: verifica la presenza e la correttezza del token in ogni richiesta.
- Autenticazione: estrae e conferma l’identità dell’utente dal token validato.
- Validazione degli ID: controlla che tutti gli identificativi utilizzati nelle rotte siano UUID validi.
- Gestione capacità e chiusure: controlla la disponibilità dei posti e rispetta i giorni di chiusura dei parcheggi.
- Errore globale: un ultimo middleware intercetta tutte le eccezioni, trasformandole in risposte HTTP strutturate grazie all’ErrorFactory.
Questa suddivisione rende la pipeline chiara e modulare.

# Diagrammi UML
# Diagramma dei casi d'uso
Un diagramma dei casi d’uso è una rappresentazione grafica che serve a descrivere chi (gli attori) interagisce con il sistema e cosa il sistema fornisce loro (i casi d’uso).
```mermaid
graph TD
    %% Attori
    Utente_pubblico["Utente_pubblico"]
    Automobilista["Automobilista"]
    Operatore["Operatore"]
    System["System"]

    %% Casi d'uso - autenticazione e scoperta
    login 
    infoParkings

    %% Casi d'uso - Automobilista
    createReservation
    getReservation
    listReservations 
    updateReservation
    deleteReservation
    payReservation
    cancelPayment
    checkTransit
    paymentSlip
    reportReservations

    %% Casi d'uso - Operatore
    createParking
    listParkings
    deleteParking
    updateParking
    getParking
    ReservationsReport  
    parkingStats  
    updateTokens

    %% Relazioni actor → use case
    Utente_pubblico --> login
    Utente_pubblico --> infoParkings

    Automobilista --> createReservation
    Automobilista --> getReservation
    Automobilista --> listReservations
    Automobilista --> updateReservation
    Automobilista --> deleteReservation
    Automobilista --> payReservation
    Automobilista --> cancelPayment
    Automobilista --> checkTransit
    Automobilista --> paymentSlip
    Automobilista --> reportReservations

    Operatore -->createParking
    Operatore -->listParkings
    Operatore -->deleteParking
    Operatore -->updateParking
    Operatore -->getParking
    Operatore -->ReservationsReport
    Operatore -->parkingStats 
    Operatore -->updateTokens

    %% Relazioni sistema interne
    System --> GenerateJSON
    System --> GeneratePDF
    System --> GenerateCSV
    System --> checkCapacity
    System --> checkClosedData
    System --> validateUUID

    createReservation -->authenticateJWT
    getReservation -->authenticateJWT
    listReservations -->authenticateJWT
    updateReservation -->authenticateJWT
    deleteReservation -->authenticateJWT
    payReservation -->authenticateJWT
    cancelPayment -->authenticateJWT
    checkTransit -->authenticateJWT
    paymentSlip -->authenticateJWT
    reportReservations -->authenticateJWT
    createParking-->authenticateJWT
    listParkings-->authenticateJWT
    deleteParking-->authenticateJWT
    updateParking-->authenticateJWT
    getParking-->authenticateJWT
    ReservationsReport-->authenticateJWT
    parkingStats -->authenticateJWT
    updateTokens-->authenticateJWT

```

# Diagramma E-R
Il progetto utilizza PostgreSQL come sistema di gestione di database relazionale (RDBMS). PostgreSQL è un database open-source maturo e conforme allo standard SQL, noto per la sua affidabilità, le garanzie ACID e l’elevata estensibilità.
Il modello è centrato su chi utilizza un parcheggio, ciò che prenota e come ci si muove al suo interno. Sono presenti utenti che fanno prenotazioni sui vari parcheggi; ogni prenotazione tiene traccia di quando inizia e finisce e di eventuali tentativi di pagamento. I transiti registrano le entrate e le uscite dei veicoli, collegandosi sia al parcheggio sia alla prenotazione. Sul lato amministrativo, vengono annotate eventuali multe emesse per targa e parcheggio, mentre per ciascun tipo di veicolo è definita la capacità e il costo associato in ogni struttura. Insieme, queste entità permettono di gestire accessi, prenotazioni, tariffe e sanzioni in modo integrato.

```mermaid
erDiagram
    USERS {
        INT id PK
        VARCHAR name
        VARCHAR email
        VARCHAR password
        VARCHAR role
        INT tokens
        DATETIME createdAt
        DATETIME updatedAt
    }
    PARKINGS {
        INT id PK
        VARCHAR name
        VARCHAR address
        INT capacity
        DATE closedData
        DATETIME createdAt
        DATETIME updatedAt
    }
    RESERVATIONS {
        INT id PK
        VARCHAR status
        INT userId FK
        INT parkingId FK
        VARCHAR licensePlate
        VARCHAR vehicle
        DATETIME startTime
        DATETIME endTime
        DATETIME createdAt
        DATETIME updatedAt
        INT paymentAttempts
    }
    TRANSITS {
        INT id PK
        VARCHAR licensePlate
        DATETIME time
        INT parkingId FK
        VARCHAR type
        INT reservationId FK
        DATETIME createdAt
        DATETIME updatedAt
    }
    FINES {
        INT id PK
        DECIMAL price
        VARCHAR licensePlate
        INT parkingId FK
        VARCHAR reason
        DATETIME createdAt
        DATETIME updatedAt
    }
    PARKINGCAPACITIES {
        INT id PK
        INT parkingId FK
        VARCHAR vehicle
        INT capacity
        DECIMAL price
        DATETIME createdAt
        DATETIME updatedAt
    }
PAYMENTS{
        STRING id PK
        FLOAT price
        STRING userId FK
        STRING reservationId FK
        FLOAT paymentAttemps
        FLOAT remainTokens

    }

    USERS ||--o{ RESERVATIONS : ha
    PARKINGS ||--o{ RESERVATIONS : ha
    RESERVATIONS ||--o{ TRANSITS : ha
    PARKINGS ||--o{ TRANSITS : registra
    PARKINGS ||--o{ FINES : emette
    PARKINGS ||--o{ PARKINGCAPACITIES : ha
    RESERVATIONS ||--||  PAYMENTS :ha
    PAYMENTS ||--o{USERS : ha

```

# Diagrammi delle sequenze

I diagrammi delle sequenze sono dei diagrammi comportamentali utilizzati per descrivere come e in che ordine gli oggetti (o componenti) di un sistema collaborano per realizzare uno specifico flusso di esecuzione.
## POST /login
```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: POST /login
    App->>+Controller: login(req.Request, res:Response)
    Controller->>+Service: login
    alt data valid
        Service->>+DAO: findByPk(userId)
        DAO->>+ORM: findByPk(userId)
        ORM-->>-DAO: User
        DAO-->>-Service: genrateToken
        Service-->-Controller: token
        Controller-->>App: HTTP Response
        App-->>Client: HTTP Response
        else user not found
          Service->>+ErrorFactory: entityNotFound()
          ErrorFactory-->>-Service: NotFound Error
          Service-->>Controller: throw NotFound Error
          Controller-->>Middleware: next(error)
          Middleware-->>App: HTTP Response
          App-->>Client: HTTP Response
          else password not valid
            Service->>+ErrorFactory: unauthorized()
            ErrorFactory-->>-Service: Unauthorized Error
            Service-->>Controller: throw Unauthorized Error
            Controller-->>Middleware: next(error)
            Middleware-->>App: HTTP Response
            App-->>Client: HTTP Response
      end   
```
## POST	/park/parking

```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: POST /park/parking ( parkingData )
    App->>+Middleware: authenticateJWT
    Middleware-->>-App: next()
    App->>+Middleware: isOperator
    Middleware-->>-App: next()
    App->>+Controller: createParking(req)
    Controller->>+Service: create(name, address,capacity,closedData)
    alt data valid
        Service->>+DAO: create(data)
        DAO->>+ORM: Parking
        ORM-->>-DAO: Parking
        DAO-->>-Service: Parking
        Service-->>-Controller: Parking
        Controller-->>App: HTTP Parking ( Parking )
        App-->>Client: HTTP Response new Parking
        else data not valid
          Service->>+ErrorFactory: entityNotFound()
          ErrorFactory-->>-Service: NotFound
          Service-->>Controller: throw NotFound
          Controller-->>Middleware: next(error)
          Middleware-->>App: HTTP Response
          App-->>Client: HTTP Response
    end
```
## GET /park/parkings

```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: GET /park/parkings ( parkingData )
    App->>+Middleware: authenticateJWT
    Middleware-->>-App: next()
    App->>+Middleware: isOperator
    Middleware-->>-App: next()
    App->>+Controller: listParking(req)
    Controller->>+Service: findAll()
    alt parking exists
        Service->>+DAO: findAll()
        DAO->>+ORM: Parking
        ORM-->>-DAO: Parking
        DAO-->>-Service: Parking
        Service-->>-Controller: Parking
        Controller-->>App: HTTP Response Parking
        App-->>Client: HTTP Response
        else reservation not found
            Service->>+ErrorFactory: entityNotFound()
            ErrorFactory-->>-Service: NotFound Error
            Service-->>Controller: throw NotFound Error
            Controller-->>Middleware: next(error)
            Middleware-->>App: HTTP Response
            App-->>Client: HTTP Response
    end
```
## DELETE /park/parking/:id

```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: DELETE /park/parking/:id
    App->>+Middleware: authenticateJWT
    Middleware-->>-App: next()
    App->>+Middleware: isOperator
    Middleware-->>-App: next()
    App->>+Middleware: validataeUUID
    Middleware-->>-App: next()
    App->>+Controller: DeleteParking(req)
    Controller->>+Service: delete(parkingId)
        Service->>+DAO: delete(parkingId)
        DAO->>+ORM: destroy()
        ORM-->>-DAO: Parking deleted
        alt parking exists
            DAO-->>-Service: Parking deleted
            Service-->>-Controller: Parking
            Controller-->>App: HTTP Response ( Parking )
            App-->>Client: HTTP Response
            else parking not found
                Service->>+ErrorFactory: entityNotFound()
                ErrorFactory-->>-Service: NotFound Error
                Service-->>Controller: throw NotFound Error
                Controller-->>Middleware: next(error)
                Middleware-->>App: HTTP Response
                App-->>Client: HTTP Response
    end
```
## GET /park/parking/:id

```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: GET /park/parking/:id
    App->>+Middleware: authenticateJWT
    Middleware-->>-App: next()
    App->>+Middleware: isOperator
    Middleware-->>-App: next()
    App->>+Middleware: validataeUUID
    Middleware-->>-App: next()
    App->>+Controller: getParking(req)
    Controller->>+Service: findById(parkingId)
        Service->>+DAO: findById(parkingId)
        DAO->>+ORM: findByPk(reservationId)
        ORM-->>-DAO: Reservation
        alt parking exists
            DAO-->>-Service: Parking
            Service-->>-Controller: Parking
            Controller-->>App: HTTP Response ( Parking )
            App-->>Client: HTTP Response
            else parking not found
                Service->>+ErrorFactory: entityNotFound()
                ErrorFactory-->>-Service: NotFound Error
                Service-->>Controller: throw NotFound Error
                Controller-->>Middleware: next(error)
                Middleware-->>App: HTTP Response
                App-->>Client: HTTP Response
    end
```
## POST /park/parking/update/:id

```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: POST /park/parking/update/:id
    App->>+Middleware: authenticateJWT
    Middleware-->>-App: next()
    App->>+Middleware: isOperator
    Middleware-->>-App: next()
    App->>+Middleware: validataeUUID
    Middleware-->>-App: next()
    App->>+Controller: UpdateParking(req)
    alt data valid
    Controller->>+Service: update(parkingId,updates)
        Service->>+DAO: update(parkingId,updates)
        DAO->>+ORM: findByPk(parkingId)
        ORM-->>-DAO: Parking
        alt parking exists
        DAO->>+ORM: update(updates)
        ORM-->>-DAO: Parking updated
            DAO-->>-Service: Parking updated
            Service-->>-Controller: Parking
            Controller-->>App: HTTP Response ( Parking )
            App-->>Client: HTTP Response
            else parking not found
                Service->>+ErrorFactory: entityNotFound()
                ErrorFactory-->>-Service: NotFound Error
                Service-->>Controller: throw NotFound Error
                Controller-->>Middleware: next(error)
                Middleware-->>App: HTTP Response
                App-->>Client: HTTP Response
                end
    else validation failed
    Service->>+ErrorFactory: badRequest("ID del parcheggio o dati di aggiornamento mancanti.")
        ErrorFactory-->>-Service: ValidationError
        Service-->>Controller: throw ValidationError
        Controller-->>Middleware: next(error)
        Middleware-->>Controller: HTTP Response
        App-->>Client: HTTP Response
    end

```
## GET /info/parcheggi/:id/:vehicle/:data/:period

```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: GET /info/parcheggi/:id/:vehicle/:data/:period
    App->>+Middleware: validataeUUID
    Middleware-->>-App: next()
    App->>+Controller: getParkingCapacityByIdAndVehicleAndDayAndPeriod(req)
    Controller->>+Service: findByVehicleTypeAndDayAndPeriod(id, vehicle, startTime, period)
    alt data valid     
      Service->>+DAO: findByVehicleTypeAndDayAndPeriod(id, vehicle, startTime, endTime)
      DAO->+ORM: findOne(id, vehicle)
      ORM-->-DAO: Parking
      alt parking exist
        DAO->+ORM: count(id, status,startTime,endTime)
        ORM-->-DAO:  count Reservation
        DAO-->>-Service: capacity
        Service-->>Controller: capacity
        Controller-->>App: HTTP Response
        App-->>Client: HTTP Response
      else parking not found
        Service->>+ErrorFactory: entityNotFound()
        ErrorFactory-->>-Service: NotFound Error
        Service-->>Controller: throw NotFound Error
        Controller-->>Middleware: next(error)
        Middleware-->>App: HTTP Response
        App-->>Client: HTTP Response
      end
    else validation failed
        Service->>+ErrorFactory: customMessage("Parametri non corretti")
        ErrorFactory-->>-Service: ValidationError
        Service-->>Controller: throw ValidationError
        Controller-->>Middleware: next(error)
        Middleware-->>App: HTTP Response
        App-->>Client: HTTP Response
    end

```
## POST /api/reservation

```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: POST /api/reservation ( reservationData )
    App->>+Middleware: authenticateJWT
    Middleware-->>-App: next()
    App->>+Middleware: isUser
    Middleware-->>-App: next()
    App->>+Middleware: checkCapacity
    Middleware-->>-App: next()
    App->>+Middleware: checkParkingClosed
    Middleware-->>-App: next()
    App->>+Controller: create(req)
    Controller->>+Service: createReservation(userId, parkingId, data)
    alt data valid
        Service->>+DAO: findByPk(userId)
        DAO->>+ORM: findByPk(userId)
        ORM-->>-DAO: User
        alt user exists
            Service->>DAO: findById(parkingId)
            DAO->>+ORM: findByPk(parkingId)
            ORM-->>-DAO: Parking
            alt parking exists
                Service->>DAO: createReservation(data)
                DAO->>+ORM: create(data)
                ORM-->>-DAO: Reservation
                DAO-->>-Service: Reservation
                Service-->>-Controller: Reservation
                Controller-->>App: HTTP Response ( Reservation )
                App-->>Client: HTTP Response new Reservation 
            else parking not found
                Service->>+ErrorFactory: entityNotFound()
                ErrorFactory-->>-Service: NotFound Error
                Service-->>Controller: throw NotFound Error
                Controller-->>Middleware: next(error)
                Middleware-->>App: HTTP Response
                App-->>Client: HTTP Response
            end
        else user not found
                Service->>+ErrorFactory: entityNotFound()
                ErrorFactory-->>-Service: NotFound Error
                Service-->>Controller: throw NotFound Error
                Controller-->>Middleware: next(error)
                Middleware-->>App: HTTP Response
                App-->>Client: HTTP Response
        end
    else validation failed
        Service->>+ErrorFactory: customMessage("Prenotazione rifiutata per mancanza di posti disponibili.")
        ErrorFactory-->>-Service: ValidationError
        Service-->>Controller: throw ValidationError
        Controller-->>Middleware: next(error)
        Middleware-->>App: HTTP Response
        App-->>Client: HTTP Response
    end
```

## GET /api/reservation/:id

```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: GET /api/reservation/:id 
    App->>+Middleware: authenticateJWT
    Middleware-->>-App: next()
    App->>+Middleware: isUser
    Middleware-->>-App: next()
    App->>+Middleware: validataeUUID
    Middleware-->>-App: next()
    App->>+Controller: listById(req)
    Controller->>+Service: findReservationById(reservationId)
        Service->>+DAO: findById(reservationId)
        DAO->>+ORM: findByPk(reservationId)
        ORM-->>-DAO: Reservation
        alt reservation exists
            DAO-->>-Service: Reservation
            Service-->>-Controller: Reservation
            Controller-->>App: HTTP Response ( Reservation )
            App-->>Client: HTTP Response
            else reservation not found
                Service->>+ErrorFactory: entityNotFound()
                ErrorFactory-->>-Service: NotFound Error
                Service-->>Controller: throw NotFound Error
                Controller-->>Middleware: next(error)
                Middleware-->>App: HTTP Response
                App-->>Client: HTTP Response
    end

```

## GET /api/reservations
```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: GET /api/reservations 
    App->>+Middleware: authenticateJWT
    Middleware-->>-App: next()
    App->>+Middleware: isUser
    Middleware-->>-App: next()
    App->>+Controller: listByUser(req)
    Controller->>+Service: findReservationByUserId(userId)
        Service->>+DAO: findAllByUser(userId)
        DAO->>+ORM: findAll(userId)
        ORM-->>-DAO: Reservations
        alt reservation exists
            DAO-->>-Service: Reservations
            Service-->>-Controller: Reservations
            Controller-->>App: HTTP Response ( Reservations )
            App-->>Client: HTTP Response
            else reservation not found
                Service->>+ErrorFactory: entityNotFound()
                ErrorFactory-->>-Service: NotFound Error
                Service-->>Controller: throw NotFound Error
                Controller-->>Middleware: next(error)
                Middleware-->>App: HTTP Response
                App-->>Client: HTTP Response
    end
```

## DELETE /api/reservation/:id
```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: DELETE /api/reservation/:id 
    App->>+Middleware: authenticateJWT
    Middleware-->>-App: next()
    App->>+Middleware: isUser
    App->>+Middleware: validataeUUID
    Middleware-->>-App: next()
    Middleware-->>-App: next()
    App->>+Controller: delete(req)
    Controller->>+Service: deleteReservation(reservationId)
        Service->>+DAO: delete(reservationId)
        DAO->>+ORM: destroy()
        ORM-->>-DAO: Reservation deleted
        alt reservation exists
            DAO-->>-Service: Reservation deleted
            Service-->>-Controller: Reservations
            Controller-->>App: HTTP Response ( Reservations )
            App-->>Client: HTTP Response
            else reservation not found
                Service->>+ErrorFactory: entityNotFound()
                ErrorFactory-->>-Service: NotFound Error
                Service-->>Controller: throw NotFound Error
                Controller-->>Middleware: next(error)
                Middleware-->>App: HTTP Response
                App-->>Client: HTTP Response
    end

```

## POST /api/reservation/update/:id
```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: POST /api/reservation/update/:id
    App->>+Middleware: authenticateJWT
    Middleware-->>-App: next()
    App->>+Middleware: isUser
    Middleware-->>-App: next()
    App->>+Middleware: validataeUUID
    Middleware-->>-App: next()
    App->>+Controller: update(req)
    alt data valid
    Controller->>+Service: updateReservation(reservationId,updates)
        Service->>+DAO: update(reservationId,updates)
        DAO->>+ORM: findByPk(reservationId)
        ORM-->>-DAO: Reservation
        alt reservation exists
        DAO->>+ORM: update(updates)
        ORM-->>-DAO: Reservation updated
            DAO-->>-Service: Reservation updated
            Service-->>-Controller: Reservation
            Controller-->>App: HTTP Response ( Reservation )
            App-->>Client: HTTP Response
            else reservation not found
                Service->>+ErrorFactory: entityNotFound()
                ErrorFactory-->>-Service: NotFound Error
                Service-->>Controller: throw NotFound Error
                Controller-->>Middleware: next(error)
                Middleware-->>App: HTTP Response
                App-->>Client: HTTP Response
                end
    else validation failed
    Service->>+ErrorFactory: badRequest("Nessun campo da aggiornare.")
        ErrorFactory-->>-Service: ValidationError
        Service-->>Controller: throw ValidationError
        Controller-->>Middleware: next(error)
        Middleware-->>Controller: HTTP Response
        App-->>Client: HTTP Response
    end

```
## GET /api/pay/:paymentId
```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: POST /api/pay/:paymentId
    App->>+Middleware: authenticateJWT
    Middleware-->>-App: next()
    App->>+Middleware: isUser
    Middleware-->>-App: next()
    App->>+Middleware: validataeUUID
    Middleware-->>-App: next()
    App->>+Controller: pay(req)
    Controller->>+Service: payReservation(paymentId, userId)
    alt data valid
        Service->>+DAO: findById(paymentId)
        DAO->>+ORM: findById(reservationId)
        ORM-->>-DAO: Payment
        alt payment exists
          DAO->>+ORM: findById(payment.reservationId)
          ORM-->>-DAO: Reservation
          alt reservation exists
            DAO->>+ORM: findById(userId)
            ORM-->>-DAO: User
            Service->>Service:calculatePrice(pricePerMinute, startTime, endTime)
            Service-->>Controller: Reservation
            DAO-->>-Service: Payment
            Service-->>-Controller: Payment
            Controller-->>App: HTTP Response
            App-->>Client: HTTP Response
          else reservation not found
              Service->>+ErrorFactory: entityNotFound()
              ErrorFactory-->>-Service: NotFound Error
              Service-->>Controller: throw NotFound Error
              Controller-->>Middleware: next(error)
              Middleware-->>App: HTTP Response
              App-->>Client: HTTP Response
              end
        else payment not found
            Service->>+ErrorFactory: entityNotFound()
            ErrorFactory-->>-Service: NotFound Error
            Service-->>Controller: throw NotFound Error
            Controller-->>Middleware: next(error)
            Middleware-->>App: HTTP Response
            App-->>Client: HTTP Response
            end
    else validation failed
      Service->>+ErrorFactory: badRequest("Nessun campo da aggiornare.")
      ErrorFactory-->>-Service: ValidationError
      Service-->>Controller: throw ValidationError
      Controller-->>Middleware: next(error)
      Middleware-->>App: HTTP Response
      App-->>Client: HTTP Response
  end

```
## DELETE	/api/paymentslip/:id
```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: GET /api/paymentslip/:id
    App->>+Middleware: authenticateJWT
    Middleware-->>-App: next()
    App->>+Middleware: isUser
    App->>+Middleware: validataeUUID
    Middleware-->>-App: next()
    Middleware-->>-App: next()
    App->>+Controller: deletePayment(req)
    Controller->>+Service: deletePayment(paymentId)
    alt payment valid
        Service->>+DAO: findById(paymentId)
        DAO->>+ORM: findByPk(paymentId)
        ORM-->>-DAO: Payment
        alt reservation exists
          DAO->>+ORM: findById(payment.reservationId)
          ORM-->>-DAO: Reservation
          alt payment exists
            DAO->>+ORM: destroy(paymentId)
            ORM-->>-DAO: Payment deleted
            DAO-->>-Service: Payment deleted
            Service-->>-Controller: Payment deleted
            Controller-->>App: HTTP Response
            App-->>Client: HTTP Response
          else payment not found
              Service->>+ErrorFactory: entityNotFound()
              ErrorFactory-->>-Service: NotFound Error
              Service-->>Controller: throw NotFound Error
              Controller-->>Middleware: next(error)
              Middleware-->>App: HTTP Response
              App-->>Client: HTTP Response
              end
        else reservation not found
            Service->>+ErrorFactory: entityNotFound()
            ErrorFactory-->>-Service: NotFound Error
            Service-->>Controller: throw NotFound Error
            Controller-->>Middleware: next(error)
            Middleware-->>App: HTTP Response
            App-->>Client: HTTP Response
            end
    else payment failed
      Service->>+ErrorFactory: badRequest("Nessun campo da aggiornare.")
      ErrorFactory-->>-Service: ValidationError
      Service-->>Controller: throw ValidationError
      Controller-->>Middleware: next(error)
      Middleware-->>App: HTTP Response
      App-->>Client: HTTP Response
  end

```

## DELETE /api/pay/:paymentId

```mermaid
sequenceDiagram
    actor Client
    participant App
    participant Middleware
    participant Controller
    participant Service
    participant DAO
    participant ORM
    participant ErrorFactory

    Client->>App: DELETE /api/pay/:paymentId
    App->>+Middleware: authenticateJWT
    Middleware-->>-App: next()
    App->>+Middleware: isUser
    Middleware-->>-App: next()
    App->>+Middleware: validataeUUID
    Middleware-->>-App: next()
    App->>+Controller: deletePayment(req)
    alt data valid
    Controller->>+Service: deletePayment(paymentId)
        Service->>+DAO: findById(paymentId)
        DAO->>+ORM: findByPk(paymentId)
        ORM-->>-DAO: Payment
        alt payment exists
        Service->>DAO:findById(reservationId)
        DAO->>+ORM: findByPk(reservationId)
        ORM-->>-DAO: Reservation
        alt reservation exists
        Service->>+DAO: update status
        DAO->>+ORM: save()
        ORM-->>-DAO: Reservation
        Service->>Service:calculatePrice(pricePerMinute, startTime, endTime)
        Service-->>Controller: Reservation
        DAO->>+ORM:delete(paymentId)
        ORM-->>-DAO:deletedPayment
        end
            DAO-->>-Service:  Payment deleted
            Service-->>-Controller: Payment deleted
            Controller-->>App: HTTP Response 
            App-->>Client: HTTP Response
            else payment not found
            Service->>+ErrorFactory: entityNotFound()
                ErrorFactory-->>-Service: NotFound Error
                Service-->>Controller: throw NotFound Error
                Controller-->>Middleware: next(error)
                Middleware-->>App: HTTP Response
                App-->>Client: HTTP Response
            else reservation not found
                Service->>+ErrorFactory: entityNotFound()
                ErrorFactory-->>-Service: NotFound Error
                Service-->>Controller: throw NotFound Error
                Controller-->>Middleware: next(error)
                Middleware-->>App: HTTP Response
                App-->>Client: HTTP Response
                end
    else validation failed
    Service->>+ErrorFactory: badRequest("Nessun campo da aggiornare.")
        ErrorFactory-->>-Service: ValidationError
        Service-->>Controller: throw ValidationError
        Controller-->>Middleware: next(error)
        Middleware-->>Controller: HTTP Response
        App-->>Client: HTTP Response
    end

```

## POST /operator/reports/reservations

```mermaid

```

# API Routes
| Verbo HTTP | Endpoint | Descrzione | Autenticazione JWT |
|:----------:|:--------:|:-----------:|:------------------:|
| POST| `/login`|Autenticazione dell'utente tramite email e password. | ❌ |
| POST| `/park/parking`| Creazione di un nuovo parcheggio. | ✅ |
| GET| `/park/parkings`| Recupero della lista dei parcheggi | ✅|
| DELETE| `/park/parking:id`| Cancellazione di un parcheggio| ✅|
| GET| `/park/parking/:id`| Recupero infomazioni di un parcheggio| ✅ |
| POST| `/park/parking/update/:id`| Aggiornamento parametri percheggio | ✅ |
| GET| `/info/parcheggi/:id/:vehicle/:data/:period`| Verifica della disponibilità di un parcheggio | ❌ |
| POST| `/api/reservation`| Creazione di una prenotazione | ✅ |
| GET| `/api/reservation/:id`| Recupero informazioni di una prenotazione | ✅ |
| GET| `/api/reservations`| Recupero prenotazioni di un utente| ✅ |
| DELETE| `/api/reservation/:id`| Cancellazione di una prenotazione| ✅ |
| POST| `/api/reservation/update/:id`| Aggiornamenot della prenotazione | ✅ |
| GET| `/api/pay/:paymentId`| Esecuzione del pagamento della prenotazione | ✅ |
| GET| `/api/paymentslip/:id`| Generazione del bollettino di una prenotazione | ✅ |
| DELETE| `/api/pay/:paymentId`| Annullamento del pagamento di una prenotazione esclusivamente se il suo stato è in attesa.| ✅ |
| GET| `/api/reservationsReport/:format`| Generazione di una report sulle prenotazioni | ✅ |
| POST| `/operator/reports/reservations`| Generazione di una report sulle prenotazioni degli utenti| ✅ |
| GET| `/operator/stats/:parkingId`|Generazione di una report sulle prenotazioni di un parcheggio | ✅ |
| POST| `/check/transit/:type`|Acquisizione del trasito di un vericolo per la generazione di una multa | ✅ |
| POST| `/operator/updateTokens` | Modifica dei token dell'utente| ✅ |

# POST /login
**Parametri**
| Posizione | Nome    | Tipo     | Descrizione  |Obbligatorio  |
|:---------:|:-------:|:--------:|:------------:|:------------:|
|Richiesta nel body|  `email`| `string`|Indirizzo email dell'utente| ✅ |
|Richiesta nel body|  `password`| `string`|Password dell'utente| ✅ |

**Esempio di richiesta**

```http
GET /login HTTP/1.1
Content-Type: application/json
```
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
|Richiesta nel body|  `name`| `string`|Nome del parcheggio| ✅ |
|Richiesta nel body| `address`| `string`|Indirizzo del parcheggio| ✅ |
|Richiesta nel body| `capacity`| `string`|Capacità del parcheggio| ✅ |
|Richiesta nel body| `closedData`| `Date[]`|Date di chiusura del parcheggio. Formato YYYY-MM-DD| ✅ |
|Header|	`Authorization`|	`string`|	Token JWT per autenticazione	| ✅|

**Esempio di richiesta**

```http
POST /park/parking HTTP/1.1
Content-Type: application/json
Authorization: Bearer {{jwt_token}}
```
```json
{
  "name": "Parcheggio Stamira",
  "address": "Via Stamira 11",
  "capacity": "60",
  "closedData": ["2025-04-01"]
}
```

**Esempio di risposta**
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
|Header|	`Authorization`|	`string`|	Token JWT per autenticazione	| ✅|

**Esempio di richiesta**

```http
GET /park/parkings HTTP/1.1
Content-Type: application/json
Authorization: Bearer {{JWT_TOKEN}}
```

**Esempio di risposta**
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

# DELETE /park/parking/:id
**Parametri**
| Posizione | Nome    | Tipo     | Descrizione  |Obbligatorio  |
|:---------:|:-------:|:--------:|:------------:|:------------:|
|Path Param| `id`| `string`|Id del parcheggio| ✅ |
|Header|	`Authorization`|	`string`|	Token JWT per autenticazione	| ✅|

**Esempio di richiesta**

```http
DELETE /park/parking/66fe25c9-a390-4326-8193-99b0513ad973 HTTP/1.1
Content-Type: application/json
Authorization: Bearer {{JWT_TOKEN}}
```

**Esempio di risposta**
```json
{
    "message": "Parking with ID aaf28cf9-eeb9-4d4f-8d96-3a5345551e9b deleted."
}
```
# GET /park/parking/:id
**Parametri**
| Posizione | Nome    | Tipo     | Descrizione  |Obbligatorio  |
|:---------:|:-------:|:--------:|:------------:|:------------:|
|Path Param| `id`| `string`|Id del parcheggio| ✅ |
|Header|	`Authorization`|	`string`|	Token JWT per autenticazione	| ✅|

**Esempio di richiesta**

```http
GET /park/parking/66fe25c9-a390-4326-8193-99b0513ad973 HTTP/1.1
Content-Type: application/json
Authorization: Bearer {{JWT_TOKEN}}
```

**Esempio di risposta**
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
|Richiesta nel body| `name`| `string`|Nome del parcheggio| ✅ |
|Richiesta nel body| `address`| `string`|Indirizzo del parcheggio| ✅ |
|Richiesta nel body| `capacity`| `string`|Capacità del parcheggio| ✅ |
|Richiesta nel body| `closedData`| `Date[]`|Date di chiusura del parcheggio. Formato YYYY-MM-DD| ✅ |
|Header|	`Authorization`|	`string`|	Token JWT per autenticazione	| ✅|

**Esempio di richiesta**

```http
POST /parking/update/66fe25c9-a390-4326-8193-99b0513ad973 HTTP/1.1
Content-Type: application/json
Authorization: Bearer {{JWT_TOKEN}}
```

```json
{
  "name": "Parcheggio Arco",
  "address": "Via Stamira 11",
  "capacity": "40",
  "closedData": ["2025-04-01"]
}
```

**Esempio di risposta**
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
|Path Param| `id`| `string`|Id del parcheggio| ✅ |
|Path Param| `vehicle`| `string`|Tipologia di veicolo| ✅ |
|Path Param| `data`| `string`|Data di arrivo. Formato YYYY-MM-DD| ✅ |
|Path Param| `period`| `integer` |Durata della prenotazione| ✅ |

**Esempio di richiesta**

```http
GET /info/parcheggi/d5ff1727-d01b-4b59-baa3-a800e244cd4f/moto/2025-04-05/5 HTTP/1.1
Content-Type: application/json
Authorization: Bearer {{JWT_TOKEN}}
```

**Esempio di risposta**
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

**Esempio di richiesta**

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

**Esempio di risposta** 

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

**Esempio di richiesta**

```http
GET /api/reservations HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
**Esempio di risposta** 

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

**Esempio di richiesta**

```http
GET /api/reservation/95c48683-8d0c-4bee-976b-a1500e7c5656 HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
**Esempio di risposta** 

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

**Esempio di richiesta**

```http
DELETE /api/reservation/95c48683-8d0c-4bee-976b-a1500e7c5656 HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
**Esempio di risposta**

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

**Esempio di richiesta**

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
**Esempio di risposta** 

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

# GET /api/pay/:paymentId
### Parametri

| **Posizione**      | **Nome**   | **Tipo**  | **Descrizione**                                                                                    | **Obbligatorio** |
|--------------------|------------|-----------|----------------------------------------------------------------------------------------------------|------------------|
| Richiesta nel path | `paymentId` | `string`  | 	ID del bollettino da pagare                                                              | ✅               |
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |

**Esempio di richiesta**

```http
GET /api/reservation/pay/c9c9e9a1-c173-4788-ab1e-e4872e7a784c HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
**Esempio di risposta** 

```json
{
"message": "Pagamento effettuato.",
    "payment": {
        "id": "c9c9e9a1-c173-4788-ab1e-e4872e7a784c",
        "price": 2430,
        "reservationId": "1256d8af-2c40-4de2-8f38-0c113c883058",
        "userId": "a2ed44b1-4694-4fe5-88e7-d670c0c31bd9",
        "paymentAttemps": 0,
        "remainingTokens": 5140,
        "createdAt": "2025-06-09T14:35:20.863Z",
        "updatedAt": "2025-06-09T15:05:09.727Z"
    }
}
```

# GET	/api/paymentslip/:id
**Parametri**
| Posizione | Nome    | Tipo     | Descrizione  |Obbligatorio  |
|:---------:|:-------:|:--------:|:------------:|:------------:|
|Path Param| id| string|Id della prenotazione| ✅ |
|Header|	Authorization|	string|	Token JWT per autenticazione	| ✅|

**Esempio di risposta (Formato PDF)**

[Scarica il PDF](./pdf/payment-slip-938c89e4-7bbb-4143-b873-d5a56ff1a4fb.pdf)

# DELETE /api/pay/:paymentId
### Parametri

| **Posizione**      | **Nome**   | **Tipo**  | **Descrizione**                                                                                    | **Obbligatorio** |
|--------------------|------------|-----------|----------------------------------------------------------------------------------------------------|------------------|
| Richiesta nel path | `paymentId` | `string`  | 	ID del pagamneto che si vuole annullare                                                                    | ✅               |
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>                                                                              | ✅               |

**Esempio di richiesta**

```http
DELETE /api/pay/e40fa6c9-8e16-4305-86a6-14f10bdbb4e1 HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
**Esempio di risposta** 

```json
{
   "message": "Payment with ID e40fa6c9-8e16-4305-86a6-14f10bdbb4e1 deleted."
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


**Esempio di richiesta**
```http
GET /api/reservationsReport/json?start=01-03-2025&end=12-07-2025&parkingId=a4b69567-1fa7-43ef-b222-90db6a17ab76 HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```

**Esempio di risposta**

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

**Esempio di richiesta**

```http
POST /operator/reports/reservations HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
**Esempio di richiesta**

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

**Esempio di risposta**

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

**Esempio di richiesta**

```http
GET /operator/stats/f2ec3c81-649d-46a9-b9df-c6ad73f18262?start=31-05-2025 08:00&end=02-08-2025 20:00 HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```

**Esempio di risposta**

```json
{
    "parkingId": "f2ec3c81-649d-46a9-b9df-c6ad73f18262",
    "stats": {
        "averageOccupancy": {
            "Lun": {
                "00:00-01:00": 0,
                "01:00-02:00": 0,
                "02:00-03:00": 0,
                "03:00-04:00": 0,
                "04:00-05:00": 0,
                "05:00-06:00": 0,
                "06:00-07:00": 0,
                "07:00-08:00": 0,
                "08:00-09:00": 0,
                "09:00-10:00": 0,
                "10:00-11:00": 0,
                "11:00-12:00": 0,
                "12:00-13:00": 0,
                "13:00-14:00": 0,
                "14:00-15:00": 0,
                "15:00-16:00": 0,
                "16:00-17:00": 0,
                "17:00-18:00": 0,
                "18:00-19:00": 0,
                "19:00-20:00": 0,
                "20:00-21:00": 0,
                "21:00-22:00": 0,
                "22:00-23:00": 0,
                "23:00-24:00": 0
            },
            "Mar": {
                "00:00-01:00": 0,
                "01:00-02:00": 0,
                "02:00-03:00": 0,
                "03:00-04:00": 0,
                "04:00-05:00": 0,
                "05:00-06:00": 0,
                "06:00-07:00": 0,
                "07:00-08:00": 0,
                "08:00-09:00": 0,
                "09:00-10:00": 0,
                "10:00-11:00": 0,
                "11:00-12:00": 0,
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
            "Mer": {
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
                "22:00-23:00": 0,
                "23:00-24:00": 0
            },
            "Gio": {
                "00:00-01:00": 0,
                "01:00-02:00": 0,
                "02:00-03:00": 0,
                "03:00-04:00": 0,
                "04:00-05:00": 0,
                "05:00-06:00": 0,
                "06:00-07:00": 0,
                "07:00-08:00": 0,
                "08:00-09:00": 0,
                "09:00-10:00": 0,
                "10:00-11:00": 0,
                "11:00-12:00": 0,
                "12:00-13:00": 0,
                "13:00-14:00": 0,
                "14:00-15:00": 0,
                "15:00-16:00": 0,
                "16:00-17:00": 0,
                "17:00-18:00": 0,
                "18:00-19:00": 0,
                "19:00-20:00": 0,
                "20:00-21:00": 0,
                "21:00-22:00": 0,
                "22:00-23:00": 0,
                "23:00-24:00": 0
            },
            "Ven": {
                "00:00-01:00": 0,
                "01:00-02:00": 0,
                "02:00-03:00": 0,
                "03:00-04:00": 0,
                "04:00-05:00": 0,
                "05:00-06:00": 0,
                "06:00-07:00": 0,
                "07:00-08:00": 0,
                "08:00-09:00": 0,
                "09:00-10:00": 0,
                "10:00-11:00": 0,
                "11:00-12:00": 0,
                "12:00-13:00": 0,
                "13:00-14:00": 0,
                "14:00-15:00": 0,
                "15:00-16:00": 0,
                "16:00-17:00": 0,
                "17:00-18:00": 0,
                "18:00-19:00": 0,
                "19:00-20:00": 0,
                "20:00-21:00": 0,
                "21:00-22:00": 0,
                "22:00-23:00": 0,
                "23:00-24:00": 0
            },
            "Sab": {
                "08:00-09:00": 0,
                "09:00-10:00": 0,
                "10:00-11:00": 0,
                "11:00-12:00": 0,
                "12:00-13:00": 0,
                "13:00-14:00": 0,
                "14:00-15:00": 0,
                "15:00-16:00": 0,
                "16:00-17:00": 0,
                "17:00-18:00": 0,
                "18:00-19:00": 0,
                "19:00-20:00": 0,
                "20:00-21:00": 0,
                "21:00-22:00": 0,
                "22:00-23:00": 0,
                "23:00-24:00": 0,
                "00:00-01:00": 0,
                "01:00-02:00": 0,
                "02:00-03:00": 0,
                "03:00-04:00": 0,
                "04:00-05:00": 0,
                "05:00-06:00": 0,
                "06:00-07:00": 0,
                "07:00-08:00": 0
            },
            "Dom": {
                "00:00-01:00": 0,
                "01:00-02:00": 0,
                "02:00-03:00": 0,
                "03:00-04:00": 0,
                "04:00-05:00": 0,
                "05:00-06:00": 0,
                "06:00-07:00": 0,
                "07:00-08:00": 0,
                "08:00-09:00": 0,
                "09:00-10:00": 0,
                "10:00-11:00": 0,
                "11:00-12:00": 0,
                "12:00-13:00": 0,
                "13:00-14:00": 0,
                "14:00-15:00": 0,
                "15:00-16:00": 0,
                "16:00-17:00": 0,
                "17:00-18:00": 0,
                "18:00-19:00": 0,
                "19:00-20:00": 0,
                "20:00-21:00": 0,
                "21:00-22:00": 0,
                "22:00-23:00": 0,
                "23:00-24:00": 0
            }
        },
        "contemporaryMaxOccupancy": 1,
        "contemporaryMinOccupancy": 0,
        "revenue": 3876,
        "rejectedCount": 1,
        "mostRequestedSlot": "12:00-13:00"
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

**Esempio di richiesta**

```http
POST /check/transit/ingresso HTTP/1.1
Authorization: Bearer {{JWT_TOKEN}}
```
**Esempio di richiesta**

```json
{
    "licensePlate": "ZZ123YY",
    "parkingId": "704d3fed-935a-409b-994d-2d7bc794e42e"
}
```

**Esempio di risposta**

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
# POST operator/updateTokens
**Parametri**
| Posizione | Nome    | Tipo     | Descrizione  |Obbligatorio  |
|:---------:|:-------:|:--------:|:------------:|:------------:|
|Richiesta nel body | `id` | `string` |Id dell'utente| ✅ |
|Richiesta nel body| `delta` | `integer` |Incremento dei token dell'utente| ✅ |
| Richiesta nel header | `Authorization` | `string`  | 	JWT di autenticazione: Bearer <token>  | ✅ |

**Esempio di richiesta**

```http
GET /operator/updateTokens HTTP/1.1
Content-Type: application/json
Authorization: Bearer {{JWT_TOKEN}}
```
```json
{
 "userId": "10257bb4-f632-40fd-aa3a-44209c65b749f",
  "delta":"1000"
```
**Esempio di risposta**
```json
{
    "id": "10257bb4-f632-40fd-aa3a-44209c65b749",
    "name": "Paolo Gialli",
    "email": "paolo.gialli@example.com",
    "password": "paolo",
    "role": "automobilista",
    "tokens": 46000,
    "createdAt": "2025-06-06T10:06:21.080Z",
    "updatedAt": "2025-06-06T10:06:21.080Z"
}
```

# Configurazione e uso
Per eseguire correttamente l'applicazione, è necessario seguire alcuni passaggi preliminari. Innanzitutto, bisogna installare **Docker** e **Postman**.
### Passo 1
Il primo passo è la clonazione della repository Github tramite il seguente comando:
```
git clone https://github.com/niccolociotti/parkingPA.git
```
### Passo 2
Una volta clonato il repository, si deve creare un file `.env` che contiene le variabili necessarie per configurare l'applicazione, che devono essere configurate in base alle esigenze.

### Passo 3
Devono essere creati nella directory del progetto due file che rappresentano rispettivamente la chiave pubblica e privata

Chiave privata
```bash
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
```
Chiave pubblica
```bash
openssl rsa -in jwtRS256.key -pubout -outform PEM -out
jwtRS256.key.pub
```
### Passo 4

Successivamente, a partire dalla cartella `parking_PA`(la directory principale del progetto), si può avviare l'applicazione eseguendo il seguente comando:

```
docker-compose up --build
```
L’applicazione sarà in ascolto all’indirizzo `http://localhost:3000` .
All'avvio verranno generate in automatico sia le migration che il seeder del database, creando utenti, parcheggi e prenotazioni.
Si possono testare le rotte utilizzando l'utente operatore
```
email: mario.rossi@example.com
password: mario
```
oppure l'utente automobilista
```
email: luigi.bianchi@example.com
password: luigi
```

Per testare le rotte dell'applicazione si utilizza Postman, attraverso i file che si trovano nella directory `postman`:
- `env.postman_environment.json`: contine le variabili ambiente utilizzate nelle rotte
- `ProgettoPA_parking.postman_collection.json`: contiene la collecion di rotte relative all'applicazione.

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
