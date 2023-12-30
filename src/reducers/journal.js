import * as Actions from '../consts/actions/journal';
import JournalEntry from '../consts/models/journalEntry';
import { toast } from 'react-toastify';
import { createAction, createReducer } from '@reduxjs/toolkit'

const toastFetchError = () => toast.error(`😭 Journal loading failed!!!`, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});


const JournalReducer = createReducer({
    items: [],
    loadings: []
}, (builder) => {
    builder
        .addCase(createAction(Actions.FETCH_JOURNAL_REQUEST), (state, action) => {
            if (!state.loadings.includes('FETCH_JOURNAL')) {
                state.loadings.push('FETCH_JOURNAL');
            }
            state.items = JSON.parse(JSON.stringify([]));
        })
        .addCase(createAction(Actions.FETCH_JOURNAL_SUCCESS), (state, action) => {
            state.loadings = state.loadings.filter(l => l !== 'FETCH_JOURNAL');
            state.items = action.data.map(e => new JournalEntry(e));
        })
        .addCase(createAction(Actions.FETCH_JOURNAL_FAILURE), (state, action) => {
            toastFetchError();
            state.loadings = state.loadings.filter(l => l !== 'FETCH_JOURNAL');
        })
})

export default JournalReducer;