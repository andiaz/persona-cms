import { render, screen, fireEvent, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import PersonaForm from '../components/PersonaForm';

describe('PersonaForm', () => {
  const mockOnAddPersona = jest.fn();
  const mockOnEditPersona = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage for tag suggestions
    const mockStorage = {
      getItem: jest.fn(() => '[]'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
    });
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

  // Test form validation
  it('shows validation errors for empty required fields', async () => {
    render(<PersonaForm onAddPersona={mockOnAddPersona} />);

    // Try to submit without required fields
    fireEvent.submit(screen.getByRole('button', { name: /add persona/i }));

    expect(mockOnAddPersona).not.toHaveBeenCalled();
    expect(screen.getByTestId('name-input')).toBeInvalid();
  });

  // Test adding/removing dynamic fields
  it('handles adding and removing goals', async () => {
    render(<PersonaForm onAddPersona={mockOnAddPersona} />);

    // Add a goal
    const goalInput = screen.getByPlaceholderText(/enter a goal/i);
    await userEvent.type(goalInput, 'New Goal');
    fireEvent.click(screen.getByRole('button', { name: /add goal/i }));

    // Check that the goal was added
    expect(goalInput).toHaveValue('New Goal');

    // Remove the goal using the test id
    fireEvent.click(screen.getByTestId('delete-goal-0'));

    // Check that the goal was removed
    const updatedGoalInput = screen.getByPlaceholderText(/enter a goal/i);
    expect(updatedGoalInput).toHaveValue('');
  });

  // Test editing mode
  it('loads existing persona data in edit mode', () => {
    const existingPersona = {
      id: 1,
      name: 'Test Persona',
      goals: ['Goal 1'],
      painPoints: ['Pain 1'],
      tags: ['tag1'],
      contextOfUse: 'Test Context',
    };

    render(
      <PersonaForm
        personaToEdit={existingPersona}
        onEditPersona={mockOnEditPersona}
      />
    );

    // Check name input
    expect(screen.getByTestId('name-input')).toHaveValue('Test Persona');

    // Check goals input
    expect(screen.getByPlaceholderText(/enter a goal/i)).toHaveValue('Goal 1');

    // Check pain points input
    expect(screen.getByPlaceholderText(/enter a pain point/i)).toHaveValue(
      'Pain 1'
    );

    // Check context of use
    expect(screen.getByPlaceholderText(/enter context of use/i)).toHaveValue(
      'Test Context'
    );

    // Check tag
    expect(screen.getByText('tag1')).toBeInTheDocument();
  });

  // Test tag functionality
  it('handles adding and removing tags', async () => {
    render(<PersonaForm onAddPersona={mockOnAddPersona} />);

    const tagInput = screen.getByPlaceholderText(/type and press enter/i);
    await userEvent.type(tagInput, 'newtag{enter}');

    expect(screen.getByText('newtag')).toBeInTheDocument();

    // Remove tag using the updated aria-label
    fireEvent.click(screen.getByRole('button', { name: /remove tag newtag/i }));
    expect(screen.queryByText('newtag')).not.toBeInTheDocument();
  });

  // Test image upload
  it('handles image upload', async () => {
    render(<PersonaForm onAddPersona={mockOnAddPersona} />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('image-input');

    await userEvent.upload(input, file);

    expect(input.files[0]).toBe(file);
    expect(input.files).toHaveLength(1);
  });
});
