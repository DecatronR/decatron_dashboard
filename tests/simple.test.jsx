import React from 'react';
import { render, screen } from '@testing-library/react';

describe('SimpleTest', () => {
  it('renders simple text', () => {
    render(<div>Hello World</div>);

    const text = screen.getByText('Hello World');

    expect(text).toBeInTheDocument();
  });
});
