# Phase 4: Offline-First Architecture

## Purpose
Implement offline-first architecture with request queuing, network detection, and sync management. Follows rules in `.cursor/rules/`.

## Prerequisites
- Phase 3 completed
- Store available
- Services available

## Steps

### Step 4.1: Create Network Listener
**Goal**: Detect network connectivity changes

**Actions**:
1. Create `src/offline/network.listener.js`:
   ```javascript
   /**
    * Network Listener
    * Monitors network connectivity
    */
   import NetInfo from '@react-native-community/netinfo';
   import { logger } from '@logging';
   
   let isOnline = true;
   let listeners = [];
   
   const checkConnectivity = async () => {
     const state = await NetInfo.fetch();
     const wasOnline = isOnline;
     isOnline = state.isConnected ?? false;
   
     if (wasOnline !== isOnline) {
       logger.info('Network status changed', { isOnline });
       listeners.forEach((listener) => listener(isOnline));
     }
   
     return isOnline;
   };
   
   const subscribe = (listener) => {
     listeners.push(listener);
     return () => {
       listeners = listeners.filter((l) => l !== listener);
     };
   };
   
   const startListening = () => {
     NetInfo.addEventListener((state) => {
       const wasOnline = isOnline;
       isOnline = state.isConnected ?? false;
       if (wasOnline !== isOnline) {
         logger.info('Network status changed', { isOnline });
         listeners.forEach((listener) => listener(isOnline));
       }
     });
   };
   
   export {
     checkConnectivity,
     subscribe,
     startListening,
     getIsOnline: () => isOnline,
   };
   ```

**Tests**: Create `src/__tests__/offline/network.listener.test.js`
- Mock NetInfo
- Test connectivity detection
- Test listeners

**Rule Reference**: `.cursor/rules/offline-sync.mdc`

---

### Step 4.2: Create Offline Queue
**Goal**: Persistent request queue for offline operations

**Actions**:
1. Create `src/offline/queue.js`:
   ```javascript
   /**
    * Offline Queue
    * Stores failed/deferred requests
    */
   import { async } from '@services/storage';
   import { encryption } from '@security';
   import { logger } from '@logging';
   
   const QUEUE_KEY = 'offline_queue';
   
   const getQueue = async () => {
     try {
       const encrypted = await async.getItem(QUEUE_KEY);
       if (!encrypted) return [];
       const json = await encryption.decrypt(encrypted);
       const queue = JSON.parse(json);
       return Array.isArray(queue) ? queue : [];
     } catch (error) {
       logger.error('Failed to read offline queue', { error: error.message });
       return [];
     }
   };
   
   const addToQueue = async (request) => {
     const queue = await getQueue();
     queue.push({
       ...request,
       id: Date.now().toString(),
       timestamp: Date.now(),
     });
     try {
       const json = JSON.stringify(queue);
       const encrypted = await encryption.encrypt(json);
       await async.setItem(QUEUE_KEY, encrypted);
       logger.debug('Added to offline queue', { requestId: queue[queue.length - 1].id });
     } catch (error) {
       logger.error('Failed to persist offline queue', { error: error.message });
     }
   };
   
   const removeFromQueue = async (requestId) => {
     const queue = await getQueue();
     const filtered = queue.filter((item) => item.id !== requestId);
     const json = JSON.stringify(filtered);
     const encrypted = await encryption.encrypt(json);
     await async.setItem(QUEUE_KEY, encrypted);
   };
   
   const clearQueue = async () => {
     const encrypted = await encryption.encrypt(JSON.stringify([]));
     await async.setItem(QUEUE_KEY, encrypted);
   };
   
   export {
     getQueue,
     addToQueue,
     removeFromQueue,
     clearQueue,
   };
   ```

**Tests**: Create `src/__tests__/offline/queue.test.js`
- Test queue operations
- Test persistence
- Test encryption/decryption (mock `@security/encryption`)

**Rule Reference**: `.cursor/rules/offline-sync.mdc`

---

### Step 4.3: Create Sync Manager
**Goal**: Orchestrate queue execution and sync

**Actions**:
1. Create `src/offline/sync.manager.js`:
   ```javascript
   /**
    * Sync Manager
    * Orchestrates queue execution
    */
   import { getQueue, removeFromQueue } from './queue';
   import { apiClient } from '@services/api';
   import { logger } from '@logging';
   import { getIsOnline } from './network.listener';
   
   const processQueue = async () => {
     if (!getIsOnline()) {
       logger.debug('Skipping queue processing - offline');
       return;
     }
   
     const queue = await getQueue();
     if (queue.length === 0) return;
   
     logger.info('Processing offline queue', { count: queue.length });
   
     for (const item of queue) {
       try {
         await apiClient(item);
         await removeFromQueue(item.id);
         logger.debug('Queue item processed', { id: item.id });
       } catch (error) {
         logger.error('Queue item failed', { id: item.id, error: error.message });
         // Keep in queue for retry
       }
     }
   };
   
   const startSync = () => {
     // Process queue on network reconnect
     const { subscribe } = await import('./network.listener');
     const unsubscribe = subscribe((isOnline) => {
       if (isOnline) {
         processQueue();
       }
     });
     return unsubscribe;
   };
   
   export {
     processQueue,
     startSync,
   };
   ```

**Tests**: Create `src/__tests__/offline/sync.manager.test.js`
- Test queue processing
- Test sync triggers

**Rule Reference**: `.cursor/rules/offline-sync.mdc`

---

### Step 4.4: Create Hydration Logic
**Goal**: Rehydrate state and queue on app restart

**Actions**:
1. Create `src/offline/hydration.js`:
   ```javascript
   /**
    * State Hydration
    * Rehydrates offline state on app restart
    */
   import { getQueue } from './queue';
   import { logger } from '@logging';
   
   const hydrate = async () => {
     try {
       const queue = await getQueue();
       logger.info('Hydrated offline queue', { count: queue.length });
       return { queue };
     } catch (error) {
       logger.error('Hydration failed', { error: error.message });
       return { queue: [] };
     }
   };
   
   export { hydrate };
   ```

**Tests**: Create `src/__tests__/offline/hydration.test.js`
- Test hydration
- Test error handling

**Rule Reference**: `.cursor/rules/offline-sync.mdc`

---

### Step 4.5: Create Network Slice
**Goal**: Redux slice for network state

**Actions**:
1. Create `src/store/slices/network.slice.js`:
   ```javascript
   /**
    * Network Slice
    * Tracks network connectivity state
    */
   import { createSlice } from '@reduxjs/toolkit';
   
   const initialState = {
     isOnline: true,
     isSyncing: false,
   };
   
   const networkSlice = createSlice({
     name: 'network',
     initialState,
     reducers: {
       setOnline: (state, action) => {
         state.isOnline = action.payload;
       },
       setSyncing: (state, action) => {
         state.isSyncing = action.payload;
       },
     },
   });
   
   export default {
     actions: networkSlice.actions,
     reducer: networkSlice.reducer,
   };
   ```
   **Note**: `rootReducer` imports the reducer via the default export (e.g. `import networkSlice from './slices/network.slice';` then `network: networkSlice.reducer`).

2. Update `src/store/rootReducer.js` to include network slice

**Tests**: Create `src/__tests__/store/network.slice.test.js`

**Rule Reference**: `.cursor/rules/offline-sync.mdc`, `.cursor/rules/state-management.mdc`

---

### Step 4.6: Create Offline Barrel
**Goal**: Centralized offline exports

**Actions**:
1. Create `src/offline/index.js`:
   ```javascript
   /**
    * Offline Barrel Export
    */
   export * as queue from './queue';
   export * as syncManager from './sync.manager';
   export * as networkListener from './network.listener';
   export * as hydration from './hydration';
   ```

---

### Step 4.7: Create Bootstrap Layer
**Goal**: Create bootstrap layer to wire together security, store, theme, and offline systems in correct order.

**Rule References**:
- Bootstrap order: `bootstrap-config.mdc` (security → store → theme → offline, mandatory order)
- Bootstrap structure: `bootstrap-config.mdc` (bootstrap folder structure, init modules)

**Actions**:
1. Create `src/bootstrap/` directory structure:
   - `src/bootstrap/index.js` - Main bootstrap entry (`bootstrapApp` function)
   - `src/bootstrap/init.security.js` - Security initialization
   - `src/bootstrap/init.store.js` - Store initialization
   - `src/bootstrap/init.theme.js` - Theme initialization
   - `src/bootstrap/init.offline.js` - Offline initialization

2. Create `src/bootstrap/init.security.js`:
   - Initialize security systems (token loading, encryption keys, biometric availability)
   - Must run first (per `bootstrap-config.mdc`)

3. Create `src/bootstrap/init.store.js`:
   - Initialize Redux store
   - Setup persistence
   - Hydrate state
   - Must run after security (per `bootstrap-config.mdc`)

4. Create `src/bootstrap/init.theme.js`:
   - Resolve light/dark mode
   - Load persisted user preference
   - Register styled-components theme
   - Must run after store (per `bootstrap-config.mdc`)

5. Create `src/bootstrap/init.offline.js`:
   - Register network listeners
   - Initialize request queue
   - Trigger hydration
   - Must run after theme (per `bootstrap-config.mdc`)

6. Create `src/bootstrap/index.js`:
   - Export `bootstrapApp()` function
   - Call init modules in correct order: security → store → theme → offline
   - Handle fatal/non-fatal errors per `bootstrap-config.mdc`

**Tests (mandatory - per `testing.mdc`)**: Create `src/__tests__/bootstrap/*.test.js`
- Test bootstrap order (security → store → theme → offline)
- Test error handling (fatal vs non-fatal)
- Mock all dependencies (security, store, theme, offline)
- Test idempotency

**Rule Reference**: `.cursor/rules/bootstrap-config.mdc`

---

## Completion Criteria
- ✅ Network listener complete
- ✅ Offline queue complete
- ✅ Sync manager complete
- ✅ Hydration logic complete
- ✅ Network slice added to store
- ✅ Bootstrap layer complete with correct initialization order
- ✅ All tests written and passing

**Next Phase**: `P005_reusable-hooks.md`
