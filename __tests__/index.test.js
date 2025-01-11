import { render, screen, fireEvent } from '../test-utils';
import Home from '../pages/index';
import { mockRouter } from '../test-utils';

describe('Home page', () => {
  beforeEach(() => {
    // Mock sessionStorage
    const mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: mockStorage,
    });

    // Clear mock router calls
    mockRouter.push.mockClear();
  });

  it('loads personas from sessionStorage', () => {
    const mockPersonas = [{ id: 1, name: 'Test Persona' }];
    window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockPersonas));

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
    window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockPersonas));

    render(<Home />);

    const deleteButton = screen.getByRole('button', {
      name: /delete persona/i,
    });
    fireEvent.click(deleteButton);

    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      'personas',
      '[]'
    );
  });
});
