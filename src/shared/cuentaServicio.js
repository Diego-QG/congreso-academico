const ACCOUNTS_KEY = 'congreso.cuentas';
const PARTICIPANT_KEY = 'congreso.participante';
const PBKDF2_ITERATIONS = 100000;

function readAccounts() {
  const storedAccounts = window.localStorage.getItem(ACCOUNTS_KEY);
  if (!storedAccounts) return [];

  const accounts = JSON.parse(storedAccounts);
  if (!Array.isArray(accounts)) {
    throw new Error('Los datos de las cuentas guardadas no tienen un formato válido.');
  }
  return accounts;
}

function normalizeEmail(email) {
  return email.trim().toLocaleLowerCase();
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  return Uint8Array.from(hex.match(/.{2}/g) || [], (byte) => Number.parseInt(byte, 16));
}

async function derivePasswordHash(password, salt) {
  if (!window.crypto?.subtle) {
    throw new Error('El navegador no permite validar contraseñas de forma segura en este origen.');
  }

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const hash = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: hexToBytes(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  return bytesToHex(new Uint8Array(hash));
}

function hashesMatch(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export function getCurrentParticipant() {
  const participant = window.sessionStorage.getItem(PARTICIPANT_KEY)
    || window.localStorage.getItem(PARTICIPANT_KEY);
  return participant ? JSON.parse(participant) : null;
}

export function hasRememberedSession() {
  return Boolean(window.localStorage.getItem(PARTICIPANT_KEY));
}

export function getParticipantHome(participant) {
  if (participant?.rolParticipacion === 'comite') return '/comite/edicion';
  if (participant?.rolParticipacion === 'revisor') return '/revisor/bandeja';
  if (['autor', 'ambos'].includes(participant?.rolParticipacion)) return '/mis-trabajos';
  return '/';
}

export function setCurrentParticipant(participant, rememberMe = false) {
  const persistentStorage = rememberMe ? window.localStorage : window.sessionStorage;
  const temporaryStorage = rememberMe ? window.sessionStorage : window.localStorage;

  temporaryStorage.removeItem(PARTICIPANT_KEY);
  persistentStorage.setItem(PARTICIPANT_KEY, JSON.stringify(participant));
}

export function signOut() {
  window.sessionStorage.removeItem(PARTICIPANT_KEY);
  window.localStorage.removeItem(PARTICIPANT_KEY);
}

export function startCommitteeDemoSession(rememberMe = false) {
  const participant = {
    nombres: 'Comité',
    apellidos: 'Demostración',
    email: 'comite.demo@local',
    rolParticipacion: 'comite'
  };
  setCurrentParticipant(participant, rememberMe);
  return participant;
}

export async function createAccount(participant, password) {
  const accounts = readAccounts();
  const email = normalizeEmail(participant.email);
  if (accounts.some((account) => normalizeEmail(account.participant.email) === email)) {
    const error = new Error('Ya existe una cuenta con este correo institucional.');
    error.code = 'EMAIL_TAKEN';
    throw error;
  }

  const salt = bytesToHex(window.crypto.getRandomValues(new Uint8Array(16)));
  const passwordHash = await derivePasswordHash(password, salt);
  const account = {
    participant: { ...participant, email },
    salt,
    passwordHash
  };

  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
  setCurrentParticipant(account.participant);
  return account.participant;
}

export async function signIn(email, password, rememberMe = false) {
  const normalizedEmail = normalizeEmail(email);
  const account = readAccounts().find(
    (candidate) => normalizeEmail(candidate.participant.email) === normalizedEmail
  );
  if (!account) return null;

  const passwordHash = await derivePasswordHash(password, account.salt);
  if (!hashesMatch(passwordHash, account.passwordHash)) return null;

  setCurrentParticipant(account.participant, rememberMe);
  return account.participant;
}

export function updateCurrentParticipant(participant) {
  const rememberMe = hasRememberedSession();
  const accounts = readAccounts();
  const email = normalizeEmail(participant.email);
  const accountIndex = accounts.findIndex(
    (account) => normalizeEmail(account.participant.email) === email
  );
  if (accountIndex >= 0) {
    accounts[accountIndex] = { ...accounts[accountIndex], participant };
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }
  setCurrentParticipant(participant, rememberMe);
}

export async function changeAccountPassword(email, password) {
  const normalizedEmail = normalizeEmail(email);
  const accounts = readAccounts();
  const accountIndex = accounts.findIndex(
    (account) => normalizeEmail(account.participant.email) === normalizedEmail
  );
  if (accountIndex < 0) return false;

  const salt = bytesToHex(window.crypto.getRandomValues(new Uint8Array(16)));
  const passwordHash = await derivePasswordHash(password, salt);
  accounts[accountIndex] = { ...accounts[accountIndex], salt, passwordHash };
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return true;
}
