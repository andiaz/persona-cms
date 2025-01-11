import { render, screen, fireEvent, act } from '../test-utils';
import Home from '../pages/index';

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
});
