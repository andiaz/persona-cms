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

  it('handles empty persona list', () => {
    render(<PersonaList personas={[]} onDeletePersona={jest.fn()} />);
    expect(screen.getByText(/no personas found/i)).toBeInTheDocument();
  });

  it('filters personas by search query', () => {
    const personas = [
      { id: 1, name: 'Test One', tags: ['tag1'] },
      { id: 2, name: 'Test Two', tags: ['tag2'] },
    ];

    render(<PersonaList personas={personas} onDeletePersona={jest.fn()} />);

    // Use the persona search input
    const searchInput = screen.getByPlaceholderText(/search personas/i);
    fireEvent.change(searchInput, { target: { value: 'One' } });

    expect(screen.getByText('Test One')).toBeInTheDocument();
    expect(screen.queryByText('Test Two')).not.toBeInTheDocument();
  });

  it('filters personas by tag', () => {
    const personas = [
      { id: 1, name: 'Test One', tags: ['tag1'] },
      { id: 2, name: 'Test Two', tags: ['tag2'] },
    ];

    render(<PersonaList personas={personas} onDeletePersona={jest.fn()} />);

    // Click the tag dropdown to open it
    fireEvent.click(screen.getByText(/select a tag/i));

    // Use a more specific query to get the tag button in the dropdown
    const tagButton = screen
      .getAllByRole('button')
      .find((button) => button.textContent === 'tag1');
    fireEvent.click(tagButton);

    expect(screen.getByText('Test One')).toBeInTheDocument();
    expect(screen.queryByText('Test Two')).not.toBeInTheDocument();
  });
});
