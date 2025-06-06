/**
 * Enum che rappresenta lo stato di una prenotazione.
 */
export enum Status {
  PENDING = 'In attesa di pagamento',
  CONFIRMED = 'Prenotazione confermata',
  REJECTED = 'Prenotazione rifiutata',
  CANCELED = 'Prenotazione annullata',
}