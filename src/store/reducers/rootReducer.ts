import {combineReducers} from '@reduxjs/toolkit';
import counterReducer, {CounterState} from './counterReducer';

interface AppRootState {
    counter: CounterState
}

const rootReducer = combineReducers<AppRootState>({
    counter: counterReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
