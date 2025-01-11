import { render, screen, fireEvent, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import PersonaForm from '../components/PersonaForm';

describe('PersonaForm', () => {
  const mockOnAddPersona = jest.fn();
  const mockOnEditPersona = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<PersonaForm onAddPersona={mockOnAddPersona} />);

    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('Goals:')).toBeInTheDocument();
    expect(screen.getByText('Pain Points:')).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    render(<PersonaForm onAddPersona={mockOnAddPersona} />);

    await userEvent.type(screen.getByTestId('name-input'), 'Test Persona');
    await userEvent.type(
      screen.getByPlaceholderText(/enter a goal/i),
      'Test Goal'
    );

    fireEvent.click(screen.getByRole('button', { name: /add goal/i }));
    fireEvent.submit(screen.getByRole('button', { name: /add persona/i }));

    await waitFor(() => {
      expect(mockOnAddPersona).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Persona',
          goals: expect.arrayContaining(['Test Goal']),
        })
      );
    });
  });
});
