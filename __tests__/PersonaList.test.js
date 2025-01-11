import { render, screen, fireEvent } from '../test-utils';
import PersonaList from '../components/PersonaList';

describe('PersonaList', () => {
  const mockPersonas = [
    {
      id: 1,
      name: 'Test Persona',
      goals: ['Goal 1'],
      painPoints: ['Pain 1'],
      tags: ['tag1', 'tag2'],
      avatarImage: null,
    },
  ];

  const mockOnDeletePersona = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders personas correctly', () => {
    render(
      <PersonaList
        personas={mockPersonas}
        onDeletePersona={mockOnDeletePersona}
      />
    );

    expect(screen.getByText('Test Persona')).toBeInTheDocument();
    expect(screen.getByText('Goal 1')).toBeInTheDocument();
    expect(screen.getByText('Pain 1')).toBeInTheDocument();
  });

  it('handles persona deletion', () => {
    render(
      <PersonaList
        personas={mockPersonas}
        onDeletePersona={mockOnDeletePersona}
      />
    );

    // Use the aria-label to find the delete button
    const deleteButton = screen.getByRole('button', {
      name: /delete persona/i,
    });
    fireEvent.click(deleteButton);
    expect(mockOnDeletePersona).toHaveBeenCalledWith(1);
  });
});
