import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

test('renders Grid Clash heading and controls', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /grid clash/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /next round/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /solo vs cpu/i })).toBeInTheDocument();
});

test('players can finish a round and update the scoreboard', () => {
  render(<App />);
  const cells = screen.getAllByRole('gridcell');
  [0, 3, 1, 4, 2].forEach((index) => {
    fireEvent.click(cells[index]);
  });

  expect(screen.getByText(/player x wins/i)).toBeInTheDocument();
  const playerXLabel = screen.getByText(/player x/i, { selector: '.label' });
  const playerXBucket = playerXLabel.closest('.score');
  expect(playerXBucket).not.toBeNull();
  if (playerXBucket) {
    expect(within(playerXBucket).getByText('1')).toBeInTheDocument();
  }
});

test('solo mode triggers cpu turns after the player moves', () => {
  jest.useFakeTimers();
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /solo vs cpu/i }));
  expect(screen.getByText(/you \(x\)/i)).toBeInTheDocument();

  const cells = screen.getAllByRole('gridcell');
  fireEvent.click(cells[0]);
  expect(cells[0]).toHaveTextContent('X');
  expect(screen.getByText(/cpu is planning/i)).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(600);
  });

  const boardAfterTurn = screen.getAllByRole('gridcell');
  expect(boardAfterTurn.some((cell) => cell.textContent === 'O')).toBe(true);
  jest.useRealTimers();
});
