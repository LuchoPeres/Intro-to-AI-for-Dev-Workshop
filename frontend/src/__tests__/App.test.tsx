import { render } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    const container = document.querySelector('.min-h-screen');
    expect(container).toBeInTheDocument();
  });
});
