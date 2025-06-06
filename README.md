# Sviluppo Sviluppo di un sistema backend per la gestione dei parcheggi

Il seguente progetto è stato sviluppato come parte dell’esame di Programmazione Avanzata (A.A. 2023/2024) presso l'Università Politecnica delle Marche, all’interno del corso di Laurea Magistrale in Ingegneria Informatica e dell’Automazione (LM-32). Il sistema realizzato è un back-end che permette la gestione delle prenotazioni dei parcheggi.

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
1. Server (Node.js con Express)
2. Database (PostgreSQL)
3. Autenticazion JWT

# Pattern utilizzati
Nel progetto sono stati applicati diversi pattern architetturali e design pattern per garantire una struttura flessibile, manutenibile e facilmente estendibile. I pattern utilizzati verranno elencati di seguito.
## MVC
## DAO
## FACTORY
## SINGLETON
## COR


# Diagrammi UML
# Diagramma dei casi d'uso
# Diagramma E-R
# Diagrammi delle sequenze
# API Routes
# Configurazione e uso
# Strumenti utilizzati
- **Node.j**s: Runtime utilizzato per eseguire il codice JavaScript sul lato server.
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
Il progetto è stato sviluppato da NIccolò Ciotti (Matricola: ) e Luca Renzi (Matricola: S1122444) come parte del corso di Programmazione Avanzata (A.A. 2023/2024) presso l'Università Politecnica delle Marche, nel corso di Laurea Magistrale in Ingegneria Informatica e dell’Automazione (LM-32).
