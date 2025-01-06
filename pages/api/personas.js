// pages/api/personas.js
export default function handler(req, res) {
  // Mock persona data
  const personas = [
    {
      id: 1,
      name: 'John Doe',
      goals: 'Learn coding',
      painPoints: 'Lack of time',
    },
    {
      id: 2,
      name: 'Jane Smith',
      goals: 'Improve UX design skills',
      painPoints: 'Too many tools',
    },
  ];

  res.status(200).json(personas);
}
