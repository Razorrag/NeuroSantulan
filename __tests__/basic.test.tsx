import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Simple component test without GSAP
describe('Basic Component Tests', () => {
  test('renders basic text', () => {
    const TestComponent = () => <div>Hello World</div>;
    render(<TestComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('button click works', () => {
    const TestComponent = () => {
      const [count, setCount] = React.useState(0);
      return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
    };
    render(<TestComponent />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Count: 0');
    
    fireEvent.click(button);
    expect(button).toHaveTextContent('Count: 1');
  });
});
