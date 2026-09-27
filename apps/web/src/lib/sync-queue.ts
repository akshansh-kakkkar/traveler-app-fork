import type { SyncOperation } from "../../../../packages/api/src/sync";
const DB_NAME = "traveler-offline";
const STORE_NAME = "sync-queue";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function enqueueSyncOperation(
  operation: SyncOperation
): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).put(operation);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  db.close();
}

export async function getSyncOperations(): Promise<SyncOperation[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => {
      resolve(
        (request.result as SyncOperation[]).sort(
          (a, b) => a.createdAt - b.createdAt
        )
      );
      db.close();
    };
    request.onerror = () => {
      reject(request.error);
      db.close();
    };
  });
}

export async function getSyncConflicts(): Promise<SyncOperation[]> {
	const operations = await getSyncOperations();

	return operations.filter(
		(operation) => operation.status === "conflict"
	)
}

export async function removeSyncOperation(id: string): Promise<void> {
  const db = await openDB();

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  db.close();
}

export async function markSyncOperationConflict(
  id: string,
  serverVersion: number | null
): Promise<void> {
  const db = await openDB();
  const operation = await new Promise<SyncOperation | undefined>(
    (resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }
  );

  if (!operation) {
    db.close();
    return;
  }

  operation.status = "conflict";
  operation.serverVersion = serverVersion;
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(operation);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  db.close();
}
