import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer, { RootState } from './reducers/rootReducer';

const persistConfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST']
            }
        })
})

const persistor = persistStore(store)

export { store, persistor }
