import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

import App from '../../src/App';
import timerReducer from '../../src/features/timer/timerSlice';
import historyReducer from '../../src/features/history/historySlice';
import lockReducer from '../../src/features/lock/lockSlice';
import uiReducer from '../../src/features/ui/uiSlice';

const renderApp = (initialEntries = ['/']) => {
  const store = configureStore({
    reducer: {
      timer: timerReducer,
      history: historyReducer,
      lock: lockReducer,
      ui: uiReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

describe('Timer full flow integration test', () => {
  it('should allow a user to start a focus session', async () => {
    renderApp();
    
    // Check for HomePage content
    expect(screen.getByText(/請選擇一個模式來開始/i)).toBeInTheDocument();

    // Find and click on the "Focus" mode card.
    const focusModeCard = await screen.findByText(/專注/i);
    fireEvent.click(focusModeCard);

    // Should navigate to AdjustPage and find the start button
    const startButton = await screen.findByRole('button', { name: /開始計時/i });
    expect(startButton).toBeInTheDocument();
    
    // Click "Start" button.
    fireEvent.click(startButton);

    // Should navigate to TimerPage and check for timer display.
    const timerDisplay = await screen.findByRole('timer');
    expect(timerDisplay).toBeInTheDocument();
  });
});
