import { render } from '@testing-library/react';

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  query: {},
  pathname: '/',
  route: '/',
  asPath: '/',
};

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

// Mock next/link
jest.mock('next/link', () => {
  const Link = ({ children, href }) => {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          mockRouter.push(href);
        }}
      >
        {children}
      </a>
    );
  };
  Link.displayName = 'Link';
  return Link;
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

const customRender = (ui, options = {}) => {
  return render(ui, { ...options });
};

export * from '@testing-library/react';
export { customRender as render, mockRouter };
