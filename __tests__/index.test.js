import { render, screen, fireEvent } from '../test-utils';
import Home from '../pages/index';
import { mockRouter } from '../test-utils';

describe('Home page', () => {
  beforeEach(() => {
    // Mock localStorage
    const mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
    });
    // Also mock sessionStorage for migration check
    Object.defineProperty(window, 'sessionStorage', {
      value: { getItem: jest.fn(() => null), removeItem: jest.fn() },
      writable: true,
    });

    // Clear mock router calls
    mockRouter.push.mockClear();
  });

  it('loads personas from localStorage', () => {
    const mockPersonas = [{ id: 1, name: 'Test Persona' }];
    window.localStorage.getItem.mockReturnValue(JSON.stringify(mockPersonas));

    render(<Home />);
    expect(screen.getByText('Test Persona')).toBeInTheDocument();
  });

  it('renders add new persona button', () => {
    render(<Home />);
    expect(
      screen.getByRole('link', { name: /add new persona/i })
    ).toBeInTheDocument();
  });

  it('navigates to add persona page', () => {
    render(<Home />);

    fireEvent.click(screen.getByRole('link', { name: /add new persona/i }));

    expect(mockRouter.push).toHaveBeenCalledWith('/add-persona');
  });

  it('handles persona deletion', () => {
    const mockPersonas = [{ id: 1, name: 'Test Persona' }];
    window.localStorage.getItem.mockReturnValue(JSON.stringify(mockPersonas));

    render(<Home />);

    const deleteButton = screen.getByRole('button', {
      name: /delete persona/i,
    });
    fireEvent.click(deleteButton);

    expect(window.localStorage.setItem).toHaveBeenCalled();
  });
});
